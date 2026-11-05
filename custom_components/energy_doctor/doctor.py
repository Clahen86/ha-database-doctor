"""Energy Doctor: the analysis for the panel, the fixes and clean-ups, and their undo history."""

from __future__ import annotations

import asyncio
import json
import time
from datetime import timedelta
from typing import Any
from uuid import uuid4

from homeassistant.components import persistent_notification
from homeassistant.components.recorder import get_instance
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.event import async_call_later, async_track_time_change, async_track_time_interval
from homeassistant.helpers.storage import Store

from . import analysis, energy, health, rates, usage
from .const import CACHE_SECONDS, DOMAIN, KEEP_DAYS

DEFAULT_SETTINGS: dict[str, Any] = {
    "overrides": {},  # device id -> its own level, or "never"
    "auto_new": True,  # new devices get the chosen levels
    "retention": {},  # group -> days of detail to keep (graphs and hourly statistics stay)
    "exclude": [],  # entities the user wants to stop saving: shown as the lines for configuration.yaml
    "protect": [],  # entities never suggested for clean-up, trimming or saving less often ("Never touch")
    "notify_energy": True,  # a notification when new wrong numbers turn up in Energy
    "weekly_report": False,  # a short report on Mondays
}
# Unused entities that write at least this many rows a day are worth trimming.
BUSY_PER_DAY = 500
# How many days of history a trimmed entity keeps.
TRIM_KEEP_DAYS = 3


class Doctor:
    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store[dict[str, Any]] = Store(hass, 1, f"{DOMAIN}.history")
        self.history: list[dict[str, Any]] = []
        self.sizes: dict[str, int] = {}  # date -> database size, for the growth over days
        self.samples: list[list[float]] = []  # [time, size] every hour for the last week, so the graph starts at once
        self.seen: list[str] = []  # energy issues the user has already been told about
        self.levels: dict[str, str] = {}  # the levels the user chose per group; new devices get them too
        self.settings: dict[str, Any] = dict(DEFAULT_SETTINGS)
        self._all: dict[str, dict[str, Any]] = {}
        self._per_row = 300.0
        self._cache: tuple[float, dict[str, Any]] | None = None
        self._lock = asyncio.Lock()
        self._unsubs: list[CALLBACK_TYPE] = []

    async def async_load(self) -> None:
        data = await self.store.async_load() or {}
        cutoff = time.time() - KEEP_DAYS * 86400
        self.history = [h for h in data.get("history", []) if h["at"] >= cutoff]
        self.sizes = data.get("sizes", {})
        self.samples = data.get("samples", [])
        # The last picture, so the panel opens at once (also after a restart) and refreshes behind it.
        if cached := data.get("overview"):
            self._cache = (cached.get("at", 0), cached)
            self._all = {e["entity_id"]: e for e in cached.get("entities", [])}
        self.seen = data.get("seen", [])
        self.levels = data.get("levels", {})
        self.settings = DEFAULT_SETTINGS | data.get("settings", {})
        self._unsubs = [
            async_track_time_change(self.hass, self._async_nightly, hour=3, minute=30, second=0),
            async_track_time_change(self.hass, self._async_weekly, hour=9, minute=0, second=0),
            self.hass.bus.async_listen(dr.EVENT_DEVICE_REGISTRY_UPDATED, self._device_added),
            async_track_time_interval(self.hass, self._async_note_size, timedelta(hours=1)),
            async_track_time_interval(self.hass, self._async_watch, timedelta(hours=12)),
        ]
        self.hass.async_create_task(self._async_note_size())

    def async_stop(self) -> None:
        for unsub in getattr(self, "_unsubs", []):
            unsub()

    def _save(self) -> None:
        self.store.async_delay_save(lambda: {
                "history": self.history, "sizes": self.sizes, "samples": self.samples, "seen": self.seen[-500:],
                "levels": self.levels, "settings": self.settings, "overview": self._cache[1] if self._cache else None,
            }, 1)

    @callback
    def _device_added(self, event: Event) -> None:
        """A new Zigbee2MQTT device gets the levels the user chose, once it has told what it is (after 5 minutes)."""
        if event.data.get("action") != "create" or not self.levels or not self.settings["auto_new"]:
            return
        device = dr.async_get(self.hass).async_get(event.data["device_id"])
        if device is None or rates.ieee(device) is None:
            return

        async def _later(_now: Any) -> None:
            await self.async_set_rates(dict(self.levels), only=device.id, remember=False)

        self._unsubs.append(async_call_later(self.hass, 300, _later))

    def _da(self) -> bool:
        return self.hass.config.language.startswith(("da", "nb", "nn", "no"))

    async def _async_nightly(self, _now: Any = None) -> None:
        """Keep only N days of detail for the groups the user chose. Graphs and hourly statistics stay."""
        rules = {g: int(d) for g, d in self.settings["retention"].items() if d}
        if not rules:
            return
        overview = await self.async_overview(fresh=True)
        for group, days in rules.items():
            ids = [
                e["entity_id"] for e in self._all.values()
                if e["group"] == group and not e["deleted"] and not e.get("history_used") and not e.get("protected")
            ]
            if ids:
                await self.hass.services.async_call(
                    "recorder", "purge_entities", {"entity_id": ids, "keep_days": days}, blocking=True
                )
        self._cache = None
        del overview

    async def _async_weekly(self, now: Any) -> None:
        """Mondays at 9: a short report of the week."""
        if not self.settings["weekly_report"] or now.weekday() != 0:
            return
        overview = await self.async_overview(fresh=True)
        days = sorted(self.sizes.items())
        week = days[-1][1] - days[-8][1] if len(days) >= 8 else None
        mb = lambda n: f"{round(n / 1e6)} MB"  # noqa: E731
        issues = len(overview["energy_issues"])
        if self._da():
            text = (f"Databasen fylder {mb(overview['size'] or 0)}"
                    + (f" og voksede {mb(week)} denne uge" if week is not None else "") + ". "
                    + (f"{issues} forkerte tal i Energi. " if issues else "Ingen fejl i Energi. ")
                    + (f"Du kan spare {mb(overview['suggestion']['bytes'])}. " if overview["suggestion"]["bytes"] else "")
                    + "[Åbn Energi-doktor](/energy-doctor)")
        else:
            text = (f"The database is {mb(overview['size'] or 0)}"
                    + (f" and grew {mb(week)} this week" if week is not None else "") + ". "
                    + (f"{issues} wrong numbers in Energy. " if issues else "No wrong numbers in Energy. ")
                    + (f"You can save {mb(overview['suggestion']['bytes'])}. " if overview["suggestion"]["bytes"] else "")
                    + "[Open Energy Doctor](/energy-doctor)")
        persistent_notification.async_create(
            self.hass, text, title="Energi-doktor" if self._da() else "Energy Doctor", notification_id=f"{DOMAIN}_weekly"
        )

    async def _async_watch(self, _now: Any = None) -> None:
        """Twice a day: tell the user about new wrong numbers in Energy (once per issue)."""
        if not self.settings["notify_energy"]:
            return
        overview = await self.async_overview(fresh=True)
        new = [i for i in overview["energy_issues"] if i["id"] not in self.seen]
        if not new:
            return
        self.seen += [i["id"] for i in new]
        self._save()
        da = self.hass.config.language.startswith(("da", "nb", "nn", "no"))
        names = ", ".join(sorted({i["name"] for i in new})[:3])
        persistent_notification.async_create(
            self.hass,
            (f"{len(new)} forkerte tal i Energi ({names}). [Åbn Energi-doktor](/energy-doctor) for at rette dem."
             if da else f"{len(new)} wrong numbers in Energy ({names}). [Open Energy Doctor](/energy-doctor) to fix them."),
            title="Energi-doktor" if da else "Energy Doctor",
            notification_id=f"{DOMAIN}_energy",
        )

    async def _async_note_size(self, _now: Any = None) -> None:
        size = await get_instance(self.hass).async_add_executor_job(analysis.db_size, self.hass)
        if size:
            now = time.time()
            self.sizes[time.strftime("%Y-%m-%d")] = size
            self.sizes = dict(sorted(self.sizes.items())[-60:])
            self.samples = [s for s in self.samples if s[0] > now - 7 * 86400] + [[now, size]]
            self._save()

    def growth(self) -> float | None:
        """Bytes a day over the last week; the first days from the hourly samples (provisional)."""
        days = sorted(self.sizes.items())
        if len(days) < 2:
            if len(self.samples) >= 2 and (span := self.samples[-1][0] - self.samples[0][0]) >= 3600:
                return (self.samples[-1][1] - self.samples[0][1]) / (span / 86400)
            return None
        (first_day, first), (last_day, last) = days[max(0, len(days) - 8)], days[-1]
        span = (time.mktime(time.strptime(last_day, "%Y-%m-%d")) - time.mktime(time.strptime(first_day, "%Y-%m-%d")))
        return (last - first) / (span / 86400) if span > 0 else None

    # ---------- the picture ----------

    async def async_overview(self, fresh: bool = False, allow_stale: bool = False) -> dict[str, Any]:
        """The analysis. allow_stale: an older picture at once (marked "stale"); the panel then asks for a fresh one."""
        if not fresh and allow_stale and self._cache and not self._lock.locked():
            return self._cache[1] | {"stale": time.time() - self._cache[0] >= CACHE_SECONDS}
        async with self._lock:
            if not fresh and self._cache and time.time() - self._cache[0] < CACHE_SECONDS:
                return self._cache[1]
            result = await analysis.async_analyse(self.hass)
            uses, seen = await usage.async_uses(self.hass)
            protect = set(self.settings.get("protect") or [])
            for entity in result["entities"]:
                entity["used_in"] = uses.get(entity["entity_id"], [])
                # Its history is needed (a graph, Energy, a statistics helper, code that reads it) - or kept by the user.
                entity["history_used"] = any(u.get("history") for u in entity["used_in"])
                entity["protected"] = entity["entity_id"] in protect
            result["usage"] = seen
            self._all = {e["entity_id"]: e for e in result["entities"]}
            self._per_row = (result["size"] / result["rows"]) if result["size"] and result["rows"] else 300.0
            stats, costs = await energy.async_energy_statistics(self.hass)
            fixed = {i["id"] for h in self.history if h["kind"] == "energy" and not h["undone"] for i in h["issues"]}
            issues = [i for i in await energy.async_find_issues(self.hass, set(stats)) if i["id"] not in fixed]
            for issue in issues:
                state = self.hass.states.get(issue["statistic_id"])
                issue["name"] = (state and state.name) or issue["statistic_id"]
                issue["source"] = stats.get(issue["statistic_id"])
                issue["cost_of"] = costs.get(issue["statistic_id"])
            await energy.async_add_causes(self.hass, issues)
            result["energy_issues"] = issues
            result["growth"] = self.growth()
            result["sizes"] = sorted(self.sizes.items())
            result["samples"] = self.samples
            # Less than two days measured: the forecast is only a first guess.
            result["provisional"] = len(self.sizes) < 3
            result["health"] = await health.async_health(self.hass, result["size"])
            result["suggestion"] = self._suggestion(result)
            result["entities"] = result["entities"][:200]
            result["at"] = time.time()
            self._cache = (time.time(), result)
            self._save()
            return result

    def _suggestion(self, result: dict[str, Any]) -> dict[str, Any]:
        """The one-tap clean-up: data of deleted entities, and old history of busy entities nothing uses."""
        per_row = (result["size"] / result["rows"]) if result["size"] and result["rows"] else 300
        deleted, trim, saved = [], [], 0
        for e in result["entities"]:
            if e["deleted"]:
                deleted.append(e["entity_id"])
                saved += e["bytes"]
            elif not e["history_used"] and not e["protected"] and e["per_day"] >= BUSY_PER_DAY:
                # Automations and templates only need the value now, so old history of a busy entity can go.
                keep = e["per_day"] * TRIM_KEEP_DAYS * per_row
                if e["bytes"] > keep:
                    trim.append(e["entity_id"])
                    saved += round(e["bytes"] - keep)
        return {"deleted": deleted, "trim": trim, "keep_days": TRIM_KEEP_DAYS, "bytes": saved}

    # ---------- settings ----------

    def get_settings(self) -> dict[str, Any]:
        return dict(self.settings)

    def set_settings(self, changes: dict[str, Any]) -> dict[str, Any]:
        for key, value in changes.items():
            if key in DEFAULT_SETTINGS:
                self.settings[key] = value
        self._save()
        self._cache = None
        return dict(self.settings)

    # ---------- statistics warnings and use that Energy doesn't account for ----------

    async def async_energy_extra(self) -> dict[str, Any]:
        stats, _costs = await energy.async_energy_statistics(self.hass)
        validation = await energy.async_validation(self.hass)
        for issue in validation:
            issue["in_energy"] = issue["statistic_id"] in stats  # never offered for deletion
        return {
            "validation": validation,
            "unaccounted": await energy.async_unaccounted(self.hass),
        }

    async def async_fix_validation(self, issue_ids: list[str]) -> dict[str, Any]:
        stats, _costs = await energy.async_energy_statistics(self.hass)
        issues = [
            i for i in await energy.async_validation(self.hass)
            if i["id"] in set(issue_ids) and not (i["fix"] == "clear" and i["statistic_id"] in stats)
        ]
        done = [i["id"] for i in issues if await energy.async_fix_validation(self.hass, i)]
        self._cache = None
        return {"fixed": len(done)}

    async def async_add_to_energy(self, statistic_ids: list[str]) -> dict[str, Any]:
        added = await energy.async_add_to_energy(self.hass, statistic_ids)
        record = {"id": uuid4().hex, "at": time.time(), "kind": "energy_devices", "added": added, "undone": False}
        if added:
            self.history.append(record)
            self._save()
        return {"id": record["id"], "added": len(added)}

    # ---------- stop saving ----------

    async def async_stop_saving(self, entity_ids: list[str]) -> dict[str, Any]:
        """Zigbee2MQTT values stop at their source with one tap; the rest goes on the list for configuration.yaml."""
        changes = await rates.async_filter(self.hass, entity_ids) if "mqtt" in self.hass.config.components else []
        stopped = {
            e for e in entity_ids
            if (entry := er.async_get(self.hass).async_get(e)) and rates.z2m_attribute(entry)
            and any(c["ieee"] in (entry.unique_id or "") for c in changes)
        }
        rest = [e for e in entity_ids if e not in stopped]
        if rest:
            self.settings["exclude"] = sorted(set(self.settings["exclude"]) | set(rest))
        record = {"id": uuid4().hex, "at": time.time(), "kind": "filter", "changes": changes,
                  "entities": sorted(stopped), "undone": False}
        if changes:
            self.history.append(record)
        self._save()
        self._cache = None
        return {"id": record["id"], "stopped": len(stopped), "listed": len(rest), "undoable": bool(changes)}

    # ---------- AI ----------

    async def async_explain(self, ai_entity: str, language: str) -> str:
        """A short explanation in plain words of what fills the database and what to do, by the user's AI."""
        overview = await self.async_overview()
        top = [
            {"name": e["name"], "mb": round(e["bytes"] / 1e6), "per_day": e["per_day"], "group": e["group"],
             "used": [u["kind"] for u in e["used_in"]][:4], "deleted": e["deleted"]}
            for e in overview["entities"][:15]
        ]
        facts = {
            "size_mb": round((overview["size"] or 0) / 1e6), "growth_mb_day": round((overview["growth"] or 0) / 1e6, 1),
            "free_gb": round((overview["free"] or 0) / 1e9, 1), "groups_mb": {k: round(v / 1e6) for k, v in overview["groups"].items()},
            "top": top, "energy_issues": len(overview["energy_issues"]),
            "suggestion_mb": round(overview["suggestion"]["bytes"] / 1e6),
        }
        lang = "Danish" if language.startswith(("da", "nb", "nn", "no")) else "English"
        result = await self.hass.services.async_call(
            "ai_task", "generate_data",
            {
                "entity_id": ai_entity, "task_name": "Energy Doctor",
                "instructions": (
                    f"You help a Home Assistant user understand their recorder database. Answer in {lang}, in at most "
                    "6 short sentences, plain words, no tables, no markdown headings. Say what takes up the most and why "
                    "(how often it saves), whether it is used, and the one or two things worth doing. Never suggest "
                    "removing data that is used (\"used\" not empty). Facts (JSON): " + json.dumps(facts)
                ),
            },
            blocking=True, return_response=True,
        )
        return str((result or {}).get("data") or "").strip()

    # ---------- how often devices save ----------

    async def async_rates(self) -> dict[str, Any]:
        await self.async_overview()
        plan = await rates.async_plan(self.hass, self._all, self._per_row, self.settings["overrides"])
        plan.pop("_signals", None)
        plan["profiles"] = rates.PROFILES
        plan["chosen"] = self.levels
        return plan

    async def async_set_rates(
        self, levels: dict[str, str], only: str | None = None, remember: bool = True
    ) -> dict[str, Any]:
        """Set groups to levels (or a profile's levels). only: one device (a new one)."""
        await self.async_overview()
        plan = await rates.async_plan(self.hass, self._all, self._per_row, self.settings["overrides"])
        if only:
            for group in plan["groups"]:
                group["devices"] = [d for d in group["devices"] if d["id"] == only]
            plan["_signals"] = []
        done = await rates.async_apply(self.hass, plan, levels)
        if remember:
            self.levels = {k: v for k, v in levels.items() if v in (*rates.THROTTLE, "on", "off")}
        record = {"id": uuid4().hex, "at": time.time(), "kind": "rates", "done": done, "undone": False}
        if done["throttles"] or done["disabled"] or done["enabled"]:
            self.history.append(record)
        self._save()
        self._cache = None
        return {"id": record["id"], "devices": len(done["throttles"]), "signals": len(done["disabled"]) + len(done["enabled"])}

    # ---------- energy fixes ----------

    async def async_fix_energy(self, issue_ids: list[str]) -> dict[str, Any]:
        overview = await self.async_overview()
        picked = set(issue_ids)
        chosen = [i for i in overview["energy_issues"] if i["id"] in picked]
        # The price of the same hour follows the energy: fixing a meter's spike fixes its cost too.
        hours = {(i["statistic_id"], i["start"]) for i in chosen}
        issues = chosen + [
            i for i in overview["energy_issues"]
            if i["id"] not in picked and i.get("cost_of") and (i["cost_of"], i["start"]) in hours
        ]
        # Newest hour first: each fix changes the sums after it, never the ones before.
        for issue in sorted(issues, key=lambda i: i["start"], reverse=True):
            await energy.async_fix(self.hass, issue)
        record = {"id": uuid4().hex, "at": time.time(), "kind": "energy", "issues": issues, "undone": False}
        self.history.append(record)
        self._save()
        self._cache = None
        return {"id": record["id"], "fixed": len(issues)}

    # ---------- clean-up ----------

    async def async_backup(self) -> bool:
        """Home Assistant's own backup, with the user's settings. Takes minutes on a big installation."""
        if not self.hass.services.has_service("backup", "create_automatic"):
            return False
        await self.hass.services.async_call("backup", "create_automatic", {}, blocking=True)
        return True

    async def async_cleanup(
        self, deleted: list[str], trim: list[str], keep_days: int, backup: bool = False
    ) -> dict[str, Any]:
        """Remove history through the recorder's own purge. This can't be undone, so a backup can be made first."""
        hass = self.hass
        backed_up = False
        if backup and hass.services.has_service("backup", "create_automatic"):
            # Home Assistant's own backup, with the user's backup settings (where and what to keep).
            await hass.services.async_call("backup", "create_automatic", {}, blocking=True)
            backed_up = True
        if deleted:
            await hass.services.async_call("recorder", "purge_entities", {"entity_id": deleted, "keep_days": 0}, blocking=True)
            # Long-term statistics of entities that are gone (only the recorder's own, never imported ones).
            gone = [s for s in deleted if ":" not in s]
            if gone:
                get_instance(hass).async_clear_statistics(gone)
        if trim:
            await hass.services.async_call(
                "recorder", "purge_entities", {"entity_id": trim, "keep_days": keep_days}, blocking=True
            )
        record = {
            "id": uuid4().hex, "at": time.time(), "kind": "cleanup",
            "size_before": (self._cache[1]["size"] if self._cache else None),
            "deleted": deleted, "trim": trim, "keep_days": keep_days, "undone": False,
        }
        self.history.append(record)
        self._save()
        self._cache = None
        return {"id": record["id"], "deleted": len(deleted), "trimmed": len(trim), "backup": backed_up}

    # ---------- history ----------

    def history_view(self) -> list[dict[str, Any]]:
        """The undo history, newest first; a clean-up shows how much smaller the database got since."""
        now = self._cache[1]["size"] if self._cache else (sorted(self.sizes.items())[-1][1] if self.sizes else None)
        result = []
        for record in reversed(self.history):
            item = dict(record)
            if record["kind"] == "cleanup" and record.get("size_before") and now:
                item["saved"] = max(0, record["size_before"] - now)
            result.append(item)
        return result

    async def async_undo(self, record_id: str) -> bool:
        record = next((r for r in self.history if r["id"] == record_id and not r["undone"]), None)
        if record is None or record["kind"] == "cleanup":
            return False  # a clean-up removed data; only a backup brings it back
        if record["kind"] == "rates":
            await rates.async_undo(self.hass, record["done"])
        elif record["kind"] == "filter":
            await rates.async_unfilter(self.hass, record["changes"])
        elif record["kind"] == "energy_devices":
            await energy.async_add_to_energy(self.hass, record["added"], back=True)
        else:
            for issue in sorted(record["issues"], key=lambda i: i["start"]):
                await energy.async_fix(self.hass, issue, back=True)
        record["undone"] = True
        self._save()
        self._cache = None
        return True


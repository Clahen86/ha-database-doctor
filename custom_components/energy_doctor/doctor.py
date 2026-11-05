"""Energy Doctor: the analysis for the panel, the fixes and clean-ups, and their undo history."""

from __future__ import annotations

import asyncio
import time
from datetime import timedelta
from typing import Any
from uuid import uuid4

from homeassistant.components.recorder import get_instance
from homeassistant.core import CALLBACK_TYPE, HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store

from . import analysis, energy, usage
from .const import CACHE_SECONDS, DOMAIN, KEEP_DAYS

# Unused entities that write at least this many rows a day are worth trimming.
BUSY_PER_DAY = 500
# How many days of history a trimmed entity keeps.
TRIM_KEEP_DAYS = 3


class Doctor:
    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store[dict[str, Any]] = Store(hass, 1, f"{DOMAIN}.history")
        self.history: list[dict[str, Any]] = []
        self.sizes: dict[str, int] = {}  # date -> database size, for the growth
        self._cache: tuple[float, dict[str, Any]] | None = None
        self._lock = asyncio.Lock()
        self._unsub: CALLBACK_TYPE | None = None

    async def async_load(self) -> None:
        data = await self.store.async_load() or {}
        cutoff = time.time() - KEEP_DAYS * 86400
        self.history = [h for h in data.get("history", []) if h["at"] >= cutoff]
        self.sizes = data.get("sizes", {})
        self._unsub = async_track_time_interval(self.hass, self._async_note_size, timedelta(hours=6))
        self.hass.async_create_task(self._async_note_size())

    def async_stop(self) -> None:
        if self._unsub:
            self._unsub()

    def _save(self) -> None:
        self.store.async_delay_save(lambda: {"history": self.history, "sizes": self.sizes}, 1)

    async def _async_note_size(self, _now: Any = None) -> None:
        url = get_instance(self.hass).db_url
        if not url.startswith(analysis.SQLITE):
            return
        size = await self.hass.async_add_executor_job(analysis._file_size, url.removeprefix(analysis.SQLITE))
        if size:
            self.sizes[time.strftime("%Y-%m-%d")] = size
            self.sizes = dict(sorted(self.sizes.items())[-60:])
            self._save()

    def growth(self) -> float | None:
        """Bytes a day over the last week (or as far back as known)."""
        days = sorted(self.sizes.items())
        if len(days) < 2:
            return None
        (first_day, first), (last_day, last) = days[max(0, len(days) - 8)], days[-1]
        span = (time.mktime(time.strptime(last_day, "%Y-%m-%d")) - time.mktime(time.strptime(first_day, "%Y-%m-%d")))
        return (last - first) / (span / 86400) if span > 0 else None

    # ---------- the picture ----------

    async def async_overview(self, fresh: bool = False) -> dict[str, Any]:
        async with self._lock:
            if not fresh and self._cache and time.time() - self._cache[0] < CACHE_SECONDS:
                return self._cache[1]
            result = await analysis.async_analyse(self.hass)
            uses = await usage.async_uses(self.hass)
            for entity in result["entities"]:
                entity["used_in"] = uses.get(entity["entity_id"], [])
            stats = await energy.async_energy_statistics(self.hass)
            fixed = {i["id"] for h in self.history if h["kind"] == "energy" and not h["undone"] for i in h["issues"]}
            issues = [i for i in await energy.async_find_issues(self.hass, set(stats)) if i["id"] not in fixed]
            for issue in issues:
                state = self.hass.states.get(issue["statistic_id"])
                issue["name"] = (state and state.name) or issue["statistic_id"]
                issue["source"] = stats.get(issue["statistic_id"])
            result["energy_issues"] = issues
            result["growth"] = self.growth()
            result["suggestion"] = self._suggestion(result)
            result["entities"] = result["entities"][:200]
            result["at"] = time.time()
            self._cache = (time.time(), result)
            return result

    def _suggestion(self, result: dict[str, Any]) -> dict[str, Any]:
        """The one-tap clean-up: data of deleted entities, and old history of busy entities nothing uses."""
        per_row = (result["size"] / result["rows"]) if result["size"] and result["rows"] else 300
        deleted, trim, saved = [], [], 0
        for e in result["entities"]:
            if e["deleted"]:
                deleted.append(e["entity_id"])
                saved += e["bytes"]
            elif not e["used_in"] and e["per_day"] >= BUSY_PER_DAY and e["group"] != "energy":
                keep = e["per_day"] * TRIM_KEEP_DAYS * per_row
                if e["bytes"] > keep:
                    trim.append(e["entity_id"])
                    saved += round(e["bytes"] - keep)
        return {"deleted": deleted, "trim": trim, "keep_days": TRIM_KEEP_DAYS, "bytes": saved}

    # ---------- energy fixes ----------

    async def async_fix_energy(self, issue_ids: list[str]) -> dict[str, Any]:
        overview = await self.async_overview()
        issues = [i for i in overview["energy_issues"] if i["id"] in set(issue_ids)]
        # Newest hour first: each fix changes the sums after it, never the ones before.
        for issue in sorted(issues, key=lambda i: i["start"], reverse=True):
            energy.adjust(self.hass, issue)
        record = {"id": uuid4().hex, "at": time.time(), "kind": "energy", "issues": issues, "undone": False}
        self.history.append(record)
        self._save()
        self._cache = None
        return {"id": record["id"], "fixed": len(issues)}

    # ---------- clean-up ----------

    async def async_cleanup(self, deleted: list[str], trim: list[str], keep_days: int) -> dict[str, Any]:
        """Remove history through the recorder's own purge. This can't be undone - the panel says so first."""
        hass = self.hass
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
            "deleted": deleted, "trim": trim, "keep_days": keep_days, "undone": False,
        }
        self.history.append(record)
        self._save()
        self._cache = None
        return {"id": record["id"], "deleted": len(deleted), "trimmed": len(trim)}

    # ---------- history ----------

    async def async_undo(self, record_id: str) -> bool:
        record = next((r for r in self.history if r["id"] == record_id and not r["undone"]), None)
        if record is None or record["kind"] != "energy":
            return False  # a clean-up removed data; only a backup brings it back
        for issue in sorted(record["issues"], key=lambda i: i["start"]):
            energy.adjust(self.hass, issue, back=True)
        record["undone"] = True
        self._save()
        self._cache = None
        return True


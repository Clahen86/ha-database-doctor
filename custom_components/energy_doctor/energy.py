"""Wrong numbers in the energy dashboard: spikes, negative hours and gaps, and fixing them.

Read with the recorder's statistics API. Fixed only with the recorder's own functions:
- a spike or a negative hour: adjust_statistics (the same as "Adjust sum" under Settings > Tools > Statistics), which
  changes the hour and every hour after it in both the long and the short-term statistics;
- a gap (the meter was offline, then everything came at once): the missing hours are imported with
  async_import_statistics, spreading the jump evenly.
Every fix has an exact opposite, so it can be undone.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
import statistics as pystats
from typing import Any

from homeassistant.components.recorder import get_instance, history
from homeassistant.components.recorder.statistics import (
    async_add_external_statistics,
    async_import_statistics,
    get_metadata,
    statistics_during_period,
)
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import CHECK_DAYS

# A spike is an hour much larger than this meter's normal hours.
SPIKE_FACTOR = 10
# ... and at least this large (in the statistic's own unit), so a meter that is almost always 0 is not flagged.
MIN_SPIKE = 1.0
# A gap is at least this many missing hours before a big hour.
MIN_GAP_HOURS = 2


async def async_energy_statistics(hass: HomeAssistant) -> tuple[dict[str, str], dict[str, str]]:
    """(statistic_id -> what it is in the energy dashboard, cost statistic -> the energy statistic it prices)."""
    if "energy" not in hass.config.components:
        return {}, {}
    try:
        from homeassistant.components.energy.data import async_get_manager

        data = (await async_get_manager(hass)).data or {}
    except Exception:  # noqa: BLE001 - the energy dashboard is optional
        return {}, {}
    found: dict[str, str] = {}
    costs: dict[str, str] = {}

    def note(item: dict[str, Any], kind: str) -> None:
        for energy_key, cost_key in (("stat_energy_from", "stat_cost"), ("stat_energy_to", "stat_compensation")):
            if not (stat := item.get(energy_key)):
                continue
            found[stat] = kind
            # The cost: a statistic the user chose, or the "<energy>_cost" sensor the energy dashboard makes itself.
            cost = item.get(cost_key) or (f"{stat}_cost" if hass.states.get(f"{stat}_cost") else None)
            if cost:
                found[cost] = kind
                costs[cost] = stat

    for source in data.get("energy_sources", []):
        note(source, source.get("type", ""))
        for flow in source.get("flow_from", []) + source.get("flow_to", []):
            note(flow, source.get("type", ""))
    for device in data.get("device_consumption", []):
        if stat := device.get("stat_consumption"):
            found[stat] = "device"
    return found, costs


def _issues(statistic_id: str, rows: list[dict[str, Any]], unit: str | None) -> list[dict[str, Any]]:
    """Hours of one statistic that are almost surely wrong, with the fix that makes them normal."""
    changes = [r.get("change") for r in rows]
    normal = sorted(c for c in changes if c is not None and c > 0)
    if len(normal) < 24:
        return []  # too little history to say what is normal
    high = normal[int(len(normal) * 0.95)]
    found = []
    for i, row in enumerate(rows):
        change = row.get("change")
        if change is None or i == 0:
            continue
        start = int(row["start"])
        missing = round((start - int(rows[i - 1]["start"])) / 3600) - 1
        around = [c for c in changes[max(0, i - 12) : i] + changes[i + 1 : i + 13] if c is not None and c >= 0]
        expected = round(pystats.median(around), 3) if around else 0.0
        issue: dict[str, Any] = {
            "id": f"{statistic_id}@{start}",
            "statistic_id": statistic_id,
            "start": start,
            "value": round(change, 3),
            "expected": expected,
            "unit": unit,
        }
        if missing >= MIN_GAP_HOURS and change > max(high * 3, MIN_SPIKE):
            # Real use that came all at once after the meter was away: spread it over the missing hours.
            prev = rows[i - 1]
            issue |= {
                "kind": "gap",
                "missing": missing,
                "from_start": int(prev["start"]),
                "from_sum": prev.get("sum"),
                "from_state": prev.get("state"),
                "to_state": row.get("state"),
            }
        elif change < -0.001:
            issue |= {"kind": "negative", "adjust": round(expected - change, 6)}
        elif change > max(high * SPIKE_FACTOR, MIN_SPIKE) and change > expected * SPIKE_FACTOR:
            # adjust_statistics adds this to the hour's sum and to every sum after it.
            issue |= {"kind": "spike", "adjust": round(expected - change, 6)}
        else:
            continue
        found.append(issue)
    return found


async def async_find_issues(hass: HomeAssistant, statistic_ids: set[str]) -> list[dict[str, Any]]:
    """Spikes, negative hours and gaps in the energy dashboard's statistics over the last CHECK_DAYS days."""
    if not statistic_ids:
        return []
    instance = get_instance(hass)
    start = dt_util.utcnow() - timedelta(days=CHECK_DAYS)
    rows = await instance.async_add_executor_job(
        statistics_during_period, hass, start, None, statistic_ids, "hour", None, {"change", "sum", "state"}
    )
    metadata = await instance.async_add_executor_job(lambda: get_metadata(hass, statistic_ids=statistic_ids))
    issues = []
    for statistic_id, data in rows.items():
        unit = metadata.get(statistic_id, (0, {}))[1].get("unit_of_measurement")
        issues += _issues(statistic_id, list(data), unit)
    issues.sort(key=lambda i: i["start"], reverse=True)
    return issues


def _cause(hass: HomeAssistant, issue: dict[str, Any]) -> str | None:
    """Runs in the recorder's thread: why a meter jumped - it went to 0 or was unavailable just before."""
    if ":" in issue["statistic_id"]:
        return None
    start = datetime.fromtimestamp(issue["start"], UTC)
    states = history.state_changes_during_period(
        hass, start - timedelta(hours=2), start + timedelta(hours=1), issue["statistic_id"], no_attributes=True
    ).get(issue["statistic_id"], [])
    values = [s.state for s in states]
    if any(v in ("unavailable", "unknown") for v in values):
        return "unavailable"
    if any(v in ("0", "0.0") for v in values):
        return "zero"
    return None


async def async_add_causes(hass: HomeAssistant, issues: list[dict[str, Any]]) -> None:
    instance = get_instance(hass)
    for issue in issues[:30]:
        if issue["kind"] in ("spike", "negative"):
            issue["cause"] = await instance.async_add_executor_job(_cause, hass, issue)


async def async_fix(hass: HomeAssistant, issue: dict[str, Any], back: bool = False) -> None:
    """Fix one issue (or undo the fix) with the recorder's own functions."""
    instance = get_instance(hass)
    if issue["kind"] != "gap":
        amount = -issue["adjust"] if back else issue["adjust"]
        instance.async_adjust_statistics(
            issue["statistic_id"], datetime.fromtimestamp(issue["start"], UTC), amount, issue["unit"] or ""
        )
        return
    meta = (await instance.async_add_executor_job(lambda: get_metadata(hass, statistic_ids={issue["statistic_id"]})))
    if issue["statistic_id"] not in meta:
        return
    metadata = dict(meta[issue["statistic_id"]][1])
    steps = issue["missing"] + 1
    total = issue["value"]
    base_sum, base_state = issue["from_sum"] or 0.0, issue["from_state"]
    rows = []
    for n in range(1, steps):
        share = 0.0 if back else total * n / steps  # undo: flat again, so the jump is back in its hour
        row: dict[str, Any] = {"start": datetime.fromtimestamp(issue["from_start"] + n * 3600, UTC), "sum": base_sum + share}
        if base_state is not None:
            row["state"] = base_state + share
        rows.append(row)
    if metadata.get("source") == "recorder":
        async_import_statistics(hass, metadata, rows)
    else:
        async_add_external_statistics(hass, metadata, rows)


# ---------- Home Assistant's own statistics warnings ----------

# What the panel offers per warning: "clear" the old statistics, "convert" them to the new unit, or "open" HA's page.
_FIX = {
    "entity_no_longer_recorded": "clear",
    "entity_not_recorded": "clear",
    "no_state": "clear",
    "state_class_removed": "clear",
    "units_changed": "convert",
    "mean_type_changed": "open",
}


async def async_validation(hass: HomeAssistant) -> list[dict[str, Any]]:
    """The warnings Home Assistant shows under Settings > Tools > Statistics, each with the fix the panel offers."""
    from homeassistant.components.recorder.statistics import can_convert_units, validate_statistics

    found = await get_instance(hass).async_add_executor_job(validate_statistics, hass)
    issues = []
    for statistic_id, items in found.items():
        for item in items:
            data = dict(item.data or {})
            fix = _FIX.get(item.type, "open")
            if fix == "convert" and not can_convert_units(
                data.get("metadata_unit_class"), data.get("metadata_unit"), data.get("state_unit")
            ):
                fix = "clear"
            state = hass.states.get(statistic_id)
            issues.append({
                "id": f"{statistic_id}:{item.type}", "statistic_id": statistic_id, "type": item.type,
                "fix": fix, "data": data, "name": (state and state.name) or statistic_id,
            })
    return issues


async def async_fix_validation(hass: HomeAssistant, issue: dict[str, Any]) -> bool:
    """Fix one warning the way Home Assistant's own dialog does. Clearing can't be undone (the panel says so)."""
    from homeassistant.components.recorder.statistics import async_change_statistics_unit

    if issue["fix"] == "clear":
        get_instance(hass).async_clear_statistics([issue["statistic_id"]])
        return True
    if issue["fix"] == "convert":
        await async_change_statistics_unit(
            hass, issue["statistic_id"],
            new_unit_of_measurement=issue["data"]["state_unit"],
            old_unit_of_measurement=issue["data"]["metadata_unit"],
        )
        return True
    return False


# ---------- use that no device in Energy accounts for ----------


async def async_unaccounted(hass: HomeAssistant, days: int = 30) -> dict[str, Any] | None:
    """How much of the grid use the devices in Energy explain, and energy meters that could be added."""
    if "energy" not in hass.config.components:
        return None
    try:
        from homeassistant.components.energy.data import async_get_manager

        data = (await async_get_manager(hass)).data or {}
    except Exception:  # noqa: BLE001
        return None
    grid = {
        s for src in data.get("energy_sources", []) if src.get("type") == "grid"
        for s in [src.get("stat_energy_from")] + [f.get("stat_energy_from") for f in src.get("flow_from", [])] if s
    }
    solar = {s.get("stat_energy_from") for s in data.get("energy_sources", []) if s.get("type") == "solar"}
    devices = {d.get("stat_consumption") for d in data.get("device_consumption", []) if d.get("stat_consumption")}
    if not grid:
        return None
    # Candidates: energy meters (kWh, total) that are not in Energy at all.
    used = grid | solar | devices
    candidates = [
        s.entity_id for s in hass.states.async_all("sensor")
        if s.attributes.get("device_class") == "energy"
        and s.attributes.get("state_class") in ("total", "total_increasing")
        and s.entity_id not in used and not s.entity_id.endswith("_cost")
    ]
    ids = grid | devices | set(candidates)
    start = dt_util.utcnow() - timedelta(days=days)
    rows = await get_instance(hass).async_add_executor_job(
        statistics_during_period, hass, start, None, ids, "month", {"energy": "kWh"}, {"change"}
    )
    total = lambda stat: sum(r.get("change") or 0 for r in rows.get(stat, []))  # noqa: E731
    grid_use = sum(total(s) for s in grid)
    device_use = sum(total(s) for s in devices)
    suggestions = sorted(
        ({"statistic_id": c, "name": hass.states.get(c).name, "kwh": round(total(c), 1)} for c in candidates if total(c) > 0.5),
        key=lambda s: s["kwh"], reverse=True,
    )[:10]
    return {
        "days": days, "grid_kwh": round(grid_use, 1), "devices_kwh": round(device_use, 1),
        "share": round(1 - device_use / grid_use, 3) if grid_use > 0 else None,
        "suggestions": suggestions,
    }


async def async_add_to_energy(hass: HomeAssistant, statistic_ids: list[str], back: bool = False) -> list[str]:
    """Add energy meters as devices in the energy dashboard (or take them out again) through its own manager."""
    from homeassistant.components.energy.data import async_get_manager

    manager = await async_get_manager(hass)
    current = list((manager.data or {}).get("device_consumption", []))
    have = {d.get("stat_consumption") for d in current}
    if back:
        new = [d for d in current if d.get("stat_consumption") not in set(statistic_ids)]
        changed = [d.get("stat_consumption") for d in current if d not in new]
    else:
        changed = [s for s in statistic_ids if s not in have]
        new = current + [{"stat_consumption": s} for s in changed]
    if changed:
        await manager.async_update({"device_consumption": new})
    return changed

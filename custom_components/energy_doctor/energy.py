"""Wrong numbers in the energy dashboard: spikes and negative hours, and fixing them.

Read with the recorder's statistics API; fixed with the recorder's own adjust_statistics (the same thing as
"Adjust sum" under Settings > Tools > Statistics), which changes the hour and every hour after it in both the long
and the short-term statistics. Every fix is the opposite of its undo, so it can be undone exactly.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
import statistics as pystats
from typing import Any

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.statistics import get_metadata, statistics_during_period
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import CHECK_DAYS

# A spike is an hour much larger than this meter's normal hours.
SPIKE_FACTOR = 10
# ... and at least this large (in the statistic's own unit), so a meter that is almost always 0 is not flagged.
MIN_SPIKE = 1.0


async def async_energy_statistics(hass: HomeAssistant) -> dict[str, str]:
    """statistic_id -> what it is in the energy dashboard (grid, solar, a device …)."""
    if "energy" not in hass.config.components:
        return {}
    try:
        from homeassistant.components.energy.data import async_get_manager

        data = (await async_get_manager(hass)).data or {}
    except Exception:  # noqa: BLE001 - the energy dashboard is optional
        return {}
    found: dict[str, str] = {}
    for source in data.get("energy_sources", []):
        kind = source.get("type", "")
        for key in ("stat_energy_from", "stat_energy_to", "stat_cost", "stat_compensation"):
            if stat := source.get(key):
                found[stat] = kind
        for flow in source.get("flow_from", []) + source.get("flow_to", []):
            for key in ("stat_energy_from", "stat_energy_to", "stat_cost", "stat_compensation"):
                if stat := flow.get(key):
                    found[stat] = kind
    for device in data.get("device_consumption", []):
        if stat := device.get("stat_consumption"):
            found[stat] = "device"
    return found


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
        if change is None:
            continue
        around = [c for c in changes[max(0, i - 12) : i] + changes[i + 1 : i + 13] if c is not None and c >= 0]
        expected = round(pystats.median(around), 3) if around else 0.0
        if change < -0.001:
            kind = "negative"
        elif change > max(high * SPIKE_FACTOR, MIN_SPIKE) and change > expected * SPIKE_FACTOR:
            kind = "spike"
        else:
            continue
        found.append(
            {
                "id": f"{statistic_id}@{int(row['start'])}",
                "statistic_id": statistic_id,
                "kind": kind,
                "start": int(row["start"]),
                "value": round(change, 3),
                "expected": expected,
                "unit": unit,
                # adjust_statistics adds this to the hour's sum and to every sum after it.
                "adjust": round(expected - change, 6),
            }
        )
    return found


async def async_find_issues(hass: HomeAssistant, statistic_ids: set[str]) -> list[dict[str, Any]]:
    """Spikes and negative hours in the energy dashboard's statistics over the last CHECK_DAYS days."""
    if not statistic_ids:
        return []
    instance = get_instance(hass)
    start = dt_util.utcnow() - timedelta(days=CHECK_DAYS)
    rows = await instance.async_add_executor_job(
        statistics_during_period, hass, start, None, statistic_ids, "hour", None, {"change"}
    )
    metadata = await instance.async_add_executor_job(lambda: get_metadata(hass, statistic_ids=statistic_ids))
    issues = []
    for statistic_id, data in rows.items():
        unit = metadata.get(statistic_id, (0, {}))[1].get("unit_of_measurement")
        issues += _issues(statistic_id, list(data), unit)
    issues.sort(key=lambda i: abs(i["adjust"]), reverse=True)
    return issues


def adjust(hass: HomeAssistant, issue: dict[str, Any], back: bool = False) -> None:
    """Fix one hour (or undo the fix) with the recorder's own adjust_statistics."""
    amount = -issue["adjust"] if back else issue["adjust"]
    get_instance(hass).async_adjust_statistics(
        issue["statistic_id"], datetime.fromtimestamp(issue["start"], UTC), amount, issue["unit"] or ""
    )

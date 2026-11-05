"""What fills the database: rows per entity, the file size, growth and free disk.

Everything here only READS the database, in the recorder's own thread (get_instance(hass).async_add_executor_job),
through the recorder's own models - never raw SQL and never a write.
"""

from __future__ import annotations

import os
import shutil
import time
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import func, select

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.db_schema import States, StatesMeta, Statistics, StatisticsMeta
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.recorder import session_scope

SQLITE = "sqlite:///"
RECENT_DAYS = 3


@dataclass
class DbInfo:
    size: int | None  # bytes, SQLite only
    engine: str
    rows: int
    free: int | None  # free disk space where the database is
    entities: dict[str, dict[str, Any]] = field(default_factory=dict)
    statistics: dict[str, int] = field(default_factory=dict)


def _file_size(path: str) -> int | None:
    sizes = [os.path.getsize(p) for p in (path, f"{path}-wal", f"{path}-shm") if os.path.isfile(p)]
    return sum(sizes) if sizes else None


def read_db(hass: HomeAssistant) -> DbInfo:
    """Runs in the recorder's thread: row counts per entity (all, and the last days), statistics rows, size."""
    instance = get_instance(hass)
    since = time.time() - RECENT_DAYS * 86400
    with session_scope(session=instance.get_session(), read_only=True) as session:
        total = dict(
            session.execute(
                select(StatesMeta.entity_id, func.count(States.state_id))
                .join(States, States.metadata_id == StatesMeta.metadata_id)
                .group_by(StatesMeta.entity_id)
            ).all()
        )
        recent = dict(
            session.execute(
                select(StatesMeta.entity_id, func.count(States.state_id))
                .join(States, States.metadata_id == StatesMeta.metadata_id)
                .where(States.last_updated_ts >= since)
                .group_by(StatesMeta.entity_id)
            ).all()
        )
        statistics = dict(
            session.execute(
                select(StatisticsMeta.statistic_id, func.count(Statistics.id))
                .join(Statistics, Statistics.metadata_id == StatisticsMeta.id)
                .group_by(StatisticsMeta.statistic_id)
            ).all()
        )
    url = instance.db_url
    path = url.removeprefix(SQLITE) if url.startswith(SQLITE) else None
    engine = "sqlite" if path else url.split(":", 1)[0]
    size = _file_size(path) if path else None
    try:
        free = shutil.disk_usage(os.path.dirname(path) if path else hass.config.path()).free
    except OSError:
        free = None
    entities = {
        entity_id: {"rows": rows, "per_day": round(recent.get(entity_id, 0) / RECENT_DAYS)}
        for entity_id, rows in total.items()
        if entity_id
    }
    return DbInfo(size, engine, sum(total.values()), free, entities, {k: v for k, v in statistics.items() if k})


def kind(entity_id: str, state: Any, entry: er.RegistryEntry | None) -> str:
    """The group an entity is shown in: energy, lights, signals, sensors or other."""
    domain = entity_id.split(".", 1)[0]
    device_class = (state and state.attributes.get("device_class")) or (
        entry and (entry.device_class or entry.original_device_class)
    )
    name = entity_id.lower()
    if device_class in ("energy", "power", "voltage", "current", "power_factor", "gas", "water") or domain == "utility_meter":
        return "energy"
    if domain == "light":
        return "lights"
    if device_class == "signal_strength" or any(w in name for w in ("linkquality", "rssi", "_lqi", "signal")):
        return "signals"
    if domain in ("sensor", "binary_sensor"):
        return "sensors"
    return "other"


async def async_analyse(hass: HomeAssistant) -> dict[str, Any]:
    """The whole picture for the panel's front page (without the uses; see usage.py)."""
    info = await get_instance(hass).async_add_executor_job(read_db, hass)
    registry = er.async_get(hass)
    per_row = (info.size / info.rows) if info.size and info.rows else 300  # bytes; a rough average when unknown
    groups: dict[str, int] = {}
    entities = []
    for entity_id, data in info.entities.items():
        state = hass.states.get(entity_id)
        entry = registry.async_get(entity_id)
        group = kind(entity_id, state, entry)
        size = round(data["rows"] * per_row)
        groups[group] = groups.get(group, 0) + size
        entities.append(
            {
                "entity_id": entity_id,
                "name": (state and state.name) or (entry and (entry.name or entry.original_name)) or entity_id,
                "group": group,
                "rows": data["rows"],
                "per_day": data["per_day"],
                "bytes": size,
                # Gone from Home Assistant: no registry entry and no state - only its old history is left.
                "deleted": state is None and entry is None,
            }
        )
    entities.sort(key=lambda e: e["bytes"], reverse=True)
    return {
        "size": info.size,
        "engine": info.engine,
        "rows": info.rows,
        "free": info.free,
        "groups": groups,
        "entities": entities,
        "statistics": info.statistics,
    }

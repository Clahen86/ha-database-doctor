"""Energy Doctor against a real recorder database (SQLite in memory)."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import patch

import pytest

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.statistics import async_import_statistics, statistics_during_period
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done

from custom_components.energy_doctor import energy
from custom_components.energy_doctor.const import DOMAIN


@pytest.fixture
async def doctor(recorder_mock, hass: HomeAssistant):
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry.runtime_data


def _hours(n: int) -> list:
    start = (dt_util.utcnow() - timedelta(hours=n + 2)).replace(minute=0, second=0, microsecond=0)
    return [start + timedelta(hours=i) for i in range(n)]


async def _meter(hass: HomeAssistant, statistic_id: str, changes: list[float]) -> None:
    metadata = {
        "has_sum": True, "mean_type": 0, "name": "Fridge", "source": "recorder",
        "statistic_id": statistic_id, "unit_class": "energy", "unit_of_measurement": "kWh",
    }
    total, rows = 0.0, []
    for hour, change in zip(_hours(len(changes)), changes, strict=True):
        total += change
        rows.append({"start": hour, "sum": total, "state": total})
    hass.states.async_set(statistic_id, str(total), {"unit_of_measurement": "kWh", "state_class": "total_increasing"})
    async_import_statistics(hass, metadata, rows)
    await async_wait_recording_done(hass)


def _changes(hass: HomeAssistant, statistic_id: str) -> list[float]:
    start = dt_util.utcnow() - timedelta(days=10)
    rows = statistics_during_period(hass, start, None, {statistic_id}, "hour", None, {"change"})[statistic_id]
    return [round(r["change"], 3) for r in rows]


async def test_finds_and_fixes_a_spike_and_a_negative_hour_and_undoes(recorder_mock, hass: HomeAssistant, doctor) -> None:
    changes = [0.1] * 60
    changes[30] = 50.0  # a meter that suddenly reports 50 kWh in one hour
    changes[45] = -3.0  # and a reset that went negative
    await _meter(hass, "sensor.fridge_energy", changes)
    with patch.object(energy, "async_energy_statistics", return_value={"sensor.fridge_energy": "device"}):
        overview = await doctor.async_overview(fresh=True)
    issues = overview["energy_issues"]
    assert sorted(i["kind"] for i in issues) == ["negative", "spike"]
    spike = next(i for i in issues if i["kind"] == "spike")
    assert spike["value"] == 50.0 and spike["expected"] == 0.1

    result = await doctor.async_fix_energy([i["id"] for i in issues])
    await async_wait_recording_done(hass)
    assert result["fixed"] == 2
    fixed = await get_instance(hass).async_add_executor_job(_changes, hass, "sensor.fridge_energy")
    assert max(fixed) == 0.1 and min(fixed) >= 0  # every hour is normal now

    assert await doctor.async_undo(result["id"])
    await async_wait_recording_done(hass)
    back = await get_instance(hass).async_add_executor_job(_changes, hass, "sensor.fridge_energy")
    assert 50.0 in back and -3.0 in back


async def test_analysis_counts_rows_and_finds_deleted_and_busy_unused(recorder_mock, hass: HomeAssistant, doctor) -> None:
    registry = er.async_get(hass)
    registry.async_get_or_create("sensor", "test", "t", suggested_object_id="stue_temperatur")
    assert await async_setup_component(
        hass, "automation",
        {"automation": {"alias": "Varmt", "triggers": {"trigger": "state", "entity_id": "sensor.stue_temperatur"}, "actions": []}},
    )
    for i in range(30):
        hass.states.async_set("sensor.stue_temperatur", str(20 + i % 3))
        hass.states.async_set("sensor.signal_linkquality", str(100 + i))
        hass.states.async_set("sensor.old_thing", str(i))
    await async_wait_recording_done(hass)
    hass.states.async_remove("sensor.old_thing")  # gone: no state, no registry entry
    await hass.async_block_till_done()

    with patch("custom_components.energy_doctor.doctor.BUSY_PER_DAY", 10), patch(
        "custom_components.energy_doctor.doctor.TRIM_KEEP_DAYS", 0
    ):
        overview = await doctor.async_overview(fresh=True)
    by_id = {e["entity_id"]: e for e in overview["entities"]}
    assert by_id["sensor.stue_temperatur"]["rows"] >= 3
    assert by_id["sensor.stue_temperatur"]["used_in"][0]["kind"] == "automation"
    assert by_id["sensor.signal_linkquality"]["group"] == "signals"
    assert by_id["sensor.old_thing"]["deleted"]
    suggestion = overview["suggestion"]
    assert suggestion["deleted"] == ["sensor.old_thing"]
    assert "sensor.signal_linkquality" in suggestion["trim"] and "sensor.stue_temperatur" not in suggestion["trim"]

    result = await doctor.async_cleanup(suggestion["deleted"], [], 0)
    await async_wait_recording_done(hass)
    assert result["deleted"] == 1
    overview = await doctor.async_overview(fresh=True)
    assert "sensor.old_thing" not in {e["entity_id"] for e in overview["entities"]}

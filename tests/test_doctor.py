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


async def _meter(hass: HomeAssistant, statistic_id: str, changes: list[float], skip: set[int] = frozenset()) -> None:
    metadata = {
        "has_sum": True, "mean_type": 0, "name": "Fridge", "source": "recorder",
        "statistic_id": statistic_id, "unit_class": "energy", "unit_of_measurement": "kWh",
    }
    total, rows = 0.0, []
    for n, (hour, change) in enumerate(zip(_hours(len(changes)), changes, strict=True)):
        total += change
        if n not in skip:  # a missing hour: the meter was away
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
    with patch.object(energy, "async_energy_statistics", return_value=({"sensor.fridge_energy": "device"}, {})):
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


async def test_fills_a_gap_and_fixes_the_price_of_the_same_hour(recorder_mock, hass: HomeAssistant, doctor) -> None:
    """A meter away for 4 hours gets its jump spread over them; a spike's cost hour is fixed together with it."""
    changes = [0.5] * 60
    changes[36:40] = [0.0] * 4  # the meter is away for 4 hours …
    changes[40] = 2.5  # … and then reports those 4 hours and this one at once: 5 x 0.5
    await _meter(hass, "sensor.heat_pump_energy", changes, skip={36, 37, 38, 39})
    spiky = [0.2] * 60
    spiky[20] = 80.0
    await _meter(hass, "sensor.grid_energy", spiky)
    cost = [0.5] * 60
    cost[20] = 200.0
    await _meter(hass, "sensor.grid_energy_cost", cost)
    stats = {"sensor.heat_pump_energy": "device", "sensor.grid_energy": "grid", "sensor.grid_energy_cost": "grid"}
    with patch.object(energy, "async_energy_statistics", return_value=(stats, {"sensor.grid_energy_cost": "sensor.grid_energy"})):
        overview = await doctor.async_overview(fresh=True)
    by_stat = {i["statistic_id"]: i for i in overview["energy_issues"]}
    gap = by_stat["sensor.heat_pump_energy"]
    assert gap["kind"] == "gap" and gap["missing"] == 4
    assert by_stat["sensor.grid_energy_cost"]["cost_of"] == "sensor.grid_energy"

    # The user ticks the gap and the grid spike; the grid's cost of that hour comes along.
    result = await doctor.async_fix_energy([gap["id"], by_stat["sensor.grid_energy"]["id"]])
    await async_wait_recording_done(hass)
    assert result["fixed"] == 3
    heat = await get_instance(hass).async_add_executor_job(_changes, hass, "sensor.heat_pump_energy")
    assert max(heat) == 0.5 and len(heat) == 60
    price = await get_instance(hass).async_add_executor_job(_changes, hass, "sensor.grid_energy_cost")
    assert max(price) == 0.5

    assert await doctor.async_undo(result["id"])
    await async_wait_recording_done(hass)
    heat = await get_instance(hass).async_add_executor_job(_changes, hass, "sensor.heat_pump_energy")
    assert 2.5 in heat and heat.count(0.0) == 4


@pytest.mark.parametrize("expected_lingering_timers", [True])  # the MQTT test client
async def test_rates_only_slow_sensor_devices_and_undo(recorder_mock, hass: HomeAssistant, doctor, mqtt_mock) -> None:
    """Sensor-only Zigbee2MQTT devices get Zigbee2MQTT's throttle; plugs never; unused signals are switched off."""
    from homeassistant.helpers import device_registry as dr

    mqtt_entry = hass.config_entries.async_entries("mqtt")[0]
    devices, registry = dr.async_get(hass), er.async_get(hass)

    def device(ieee: str, name: str, entities: list[tuple[str, str, str | None]]) -> None:
        d = devices.async_get_or_create(config_entry_id=mqtt_entry.entry_id, identifiers={("mqtt", f"zigbee2mqtt_{ieee}")}, name=name)
        for domain, object_id, device_class in entities:
            registry.async_get_or_create(domain, "mqtt", f"{ieee}_{object_id}", suggested_object_id=f"{name}_{object_id}",
                                         device_id=d.id, config_entry=mqtt_entry, original_device_class=device_class)

    device("0x00158d0001a2b3c4", "gang", [("sensor", "temperature", "temperature"), ("sensor", "linkquality", None)])
    device("0x00158d0001a2b3c5", "stue", [("sensor", "temperature", "temperature")])
    device("0x00158d0001a2b3c6", "stik", [("switch", "switch", None), ("sensor", "power", "power")])
    assert await async_setup_component(
        hass, "automation",
        {"automation": {"alias": "Varme", "triggers": {"trigger": "state", "entity_id": "sensor.stue_temperature"}, "actions": []}},
    )
    for i in range(5):
        for e in ("sensor.gang_temperature", "sensor.stue_temperature", "sensor.gang_linkquality", "sensor.stik_power"):
            hass.states.async_set(e, str(20 + i))
    await async_wait_recording_done(hass)

    with patch("custom_components.energy_doctor.rates.async_throttles", return_value={}):
        plan = await doctor.async_rates()
        assert [g["key"] for g in plan["groups"]] == ["climate"]  # the plug is never slowed down
        assert {d["name"] for d in plan["groups"][0]["devices"]} == {"gang", "stue"}
        mqtt_mock.async_publish.reset_mock()
        result = await doctor.async_set_rates({"climate": "rare", "signals": "off"})
    assert result["devices"] == 2 and result["signals"] == 1
    sent = {c.args[1]: c.args[0] for c in mqtt_mock.async_publish.call_args_list}
    assert sent['{"id": "0x00158d0001a2b3c4", "options": {"throttle": 300}}'] == "zigbee2mqtt/bridge/request/device/options"
    assert '{"id": "0x00158d0001a2b3c5", "options": {"throttle": 30}}' in sent  # used in an automation: never "rare"
    assert registry.async_get("sensor.gang_linkquality").disabled_by is er.RegistryEntryDisabler.USER

    mqtt_mock.async_publish.reset_mock()
    assert await doctor.async_undo(result["id"])
    sent = {c.args[1] for c in mqtt_mock.async_publish.call_args_list}
    assert '{"id": "0x00158d0001a2b3c4", "options": {"throttle": 0}}' in sent
    assert registry.async_get("sensor.gang_linkquality").disabled_by is None


async def test_settings_retention_health_energy_devices_and_history(recorder_mock, hass: HomeAssistant, doctor) -> None:
    """Retention purges only what no graph needs; meters are added to Energy and taken out on undo."""
    from homeassistant.components.energy.data import async_get_manager

    assert await async_setup_component(hass, "energy", {})
    hass.states.async_set("sensor.signal_linkquality", "100")
    hass.states.async_set("sensor.oven_energy", "5", {"device_class": "energy", "state_class": "total_increasing", "unit_of_measurement": "kWh"})
    await async_wait_recording_done(hass)

    settings = doctor.set_settings({"retention": {"signals": 3}, "weekly_report": True, "nonsense": 1})
    assert settings["retention"] == {"signals": 3} and settings["weekly_report"] and "nonsense" not in settings
    calls = []

    async def purge(call):
        calls.append(dict(call.data))

    hass.services.async_register("recorder", "purge_entities", purge)
    await doctor._async_nightly()
    assert calls and calls[0]["keep_days"] == 3 and "sensor.signal_linkquality" in calls[0]["entity_id"]

    overview = await doctor.async_overview(fresh=True)
    assert any(h["key"] == "keep_days" for h in overview["health"])
    extra = await doctor.async_energy_extra()
    assert isinstance(extra["validation"], list)

    result = await doctor.async_add_to_energy(["sensor.oven_energy"])
    manager = await async_get_manager(hass)
    assert {"stat_consumption": "sensor.oven_energy"} in manager.data["device_consumption"]
    assert doctor.history_view()[0]["kind"] == "energy_devices"
    assert await doctor.async_undo(result["id"])
    assert not manager.data["device_consumption"]


async def test_growth_starts_from_hourly_samples(recorder_mock, hass: HomeAssistant, doctor) -> None:
    """Before two days are measured, the growth comes from the hourly samples (and is marked provisional)."""
    doctor.sizes, doctor.samples = {}, [[1000.0, 1_000_000_000], [1000.0 + 7200, 1_010_000_000]]
    assert doctor.growth() == pytest.approx(120_000_000)
    doctor.samples = [[1000.0, 1_000_000_000]]
    assert doctor.growth() is None
    doctor.sizes = {"2026-11-01": 1_000_000_000, "2026-11-03": 1_100_000_000}
    assert doctor.growth() == pytest.approx(50_000_000)


async def test_opens_at_once_with_the_last_picture(recorder_mock, hass: HomeAssistant, doctor) -> None:
    """An older picture comes back at once (marked stale) and survives a restart through the store."""
    first = await doctor.async_overview(fresh=True)
    doctor._cache = (first["at"] - 3600, first)
    again = await doctor.async_overview(allow_stale=True)
    assert again["stale"] and again["at"] == first["at"]
    await doctor.store.async_save({"overview": first})
    from custom_components.energy_doctor.doctor import Doctor

    other = Doctor(hass)
    await other.async_load()
    assert (await other.async_overview(allow_stale=True))["at"] == first["at"]
    other.async_stop()

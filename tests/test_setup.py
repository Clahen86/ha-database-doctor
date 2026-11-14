"""The setup for the developer: engine, size step, keep days, integrations writing most - never entity IDs or names."""

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done

from custom_components.database_doctor.setup import setup_info, size_bucket

from .test_doctor import doctor  # noqa: F401


def test_size_bucket():
    assert size_bucket(None) is None and size_bucket(100e6) == "<500MB" and size_bucket(3e9) == "2-5GB" and size_bucket(50e9) == "10GB+"


async def test_setup_info(recorder_mock, hass: HomeAssistant, doctor) -> None:  # noqa: F811
    er.async_get(hass).async_get_or_create("sensor", "zha", "t1", suggested_object_id="stue_temperatur")
    for i in range(20):
        hass.states.async_set("sensor.stue_temperatur", str(20 + i % 3))
    await async_wait_recording_done(hass)
    await doctor.async_overview(fresh=True)
    su = setup_info(doctor)
    db = su["devices"][0]
    assert db["kind"] == "database" and db["platform"] == "sqlite"
    assert "zha" in db["extra"]["top_integrations"]
    assert su["sizes"]["keep_days"] and su["counts"]["entities_recorded"] >= 1
    assert "stue" not in str(su)

"""Energy Doctor: wrong numbers in the energy dashboard, and what fills the database."""

from __future__ import annotations

from pathlib import Path
from typing import Any

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from . import websocket
from .const import DOMAIN, PANEL, STATIC
from .doctor import Doctor

type EnergyDoctorConfigEntry = ConfigEntry[Doctor]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
_TITLES = {"da": "Energi-doktor", "nb": "Energi-doktor", "sv": "Energidoktor", "de": "Energie-Doktor"}


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    websocket.async_setup(hass)
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC, str(Path(__file__).parent / "frontend"), cache_headers=False)]
    )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: EnergyDoctorConfigEntry) -> bool:
    doctor = Doctor(hass)
    await doctor.async_load()
    entry.runtime_data = doctor

    async def _resume(_event: Any = None) -> None:
        await doctor.async_resume_cleanups()

    # A restart stops the recorder's purge, so unfinished clean-ups go on once Home Assistant has started.
    if hass.is_running:
        hass.async_create_task(_resume())
    else:
        entry.async_on_unload(hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _resume))
    entry.async_on_unload(doctor.async_stop)
    entry.async_on_unload(entry.add_update_listener(_options_changed))
    version = (await async_get_integration(hass, DOMAIN)).version
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL,
        webcomponent_name="energy-doctor-panel",
        sidebar_title=_TITLES.get(hass.config.language.split("-")[0], "Energy Doctor"),
        sidebar_icon="mdi:stethoscope",
        module_url=f"{STATIC}/panel.js?v={version}",
        require_admin=True,
    )
    return True


async def _options_changed(hass: HomeAssistant, entry: EnergyDoctorConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: EnergyDoctorConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL)
    return True

"""Energy Doctor: wrong numbers in the energy dashboard, and what fills the database."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
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
    entry.async_on_unload(doctor.async_stop)
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


async def async_unload_entry(hass: HomeAssistant, entry: EnergyDoctorConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL)
    return True

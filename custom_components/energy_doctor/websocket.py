"""The panel's commands."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .doctor import Doctor


@callback
def async_setup(hass: HomeAssistant) -> None:
    for command in (ws_overview, ws_fix_energy, ws_cleanup, ws_history, ws_undo):
        websocket_api.async_register_command(hass, command)


def _doctor(hass: HomeAssistant) -> Doctor | None:
    entry = next(iter(hass.config_entries.async_loaded_entries(DOMAIN)), None)
    return entry.runtime_data if entry else None


def _not_loaded(connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    connection.send_error(msg["id"], "not_loaded", "Energy Doctor is not set up")


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/overview", vol.Optional("fresh", default=False): bool})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_overview(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_overview(msg["fresh"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/fix_energy", vol.Required("issues"): [str]})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_fix_energy(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_fix_energy(msg["issues"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/cleanup",
        vol.Optional("deleted", default=[]): [str],
        vol.Optional("trim", default=[]): [str],
        vol.Optional("keep_days", default=3): vol.All(int, vol.Range(min=0, max=365)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_cleanup(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_cleanup(msg["deleted"], msg["trim"], msg["keep_days"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/history"})
@websocket_api.require_admin
@callback
def ws_history(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], list(reversed(doctor.history)))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/undo", vol.Required("record"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_undo(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], {"undone": await doctor.async_undo(msg["record"])})

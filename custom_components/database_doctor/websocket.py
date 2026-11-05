"""The panel's commands."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import CONF_AI, DOMAIN
from .doctor import Doctor


@callback
def async_setup(hass: HomeAssistant) -> None:
    for command in (ws_overview, ws_fix_energy, ws_cleanup, ws_history, ws_undo, ws_rates, ws_set_rates, ws_explain, ws_settings, ws_energy_extra, ws_fix_validation, ws_add_to_energy, ws_set_settings, ws_backup, ws_stop_saving, ws_repack):
        websocket_api.async_register_command(hass, command)


def _doctor(hass: HomeAssistant) -> Doctor | None:
    entry = next(iter(hass.config_entries.async_loaded_entries(DOMAIN)), None)
    return entry.runtime_data if entry else None


def _not_loaded(connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    connection.send_error(msg["id"], "not_loaded", "Database Doctor is not set up")


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/overview", vol.Optional("fresh", default=False): bool,
     vol.Optional("stale", default=True): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_overview(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_overview(msg["fresh"], allow_stale=msg["stale"]))


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
        vol.Optional("backup", default=False): bool,
        vol.Optional("repack", default=True): bool,
        vol.Optional("keep_rule", default=True): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_cleanup(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_cleanup(msg["deleted"], msg["trim"], msg["keep_days"], msg["backup"], msg["repack"], msg["keep_rule"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/history"})
@websocket_api.require_admin
@callback
def ws_history(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], doctor.history_view())


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/undo", vol.Required("record"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_undo(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], {"undone": await doctor.async_undo(msg["record"])})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/rates"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_rates(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_rates())


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_rates",
        vol.Required("levels"): {str: vol.In(["often", "normal", "rare", "on", "off"])},
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_rates(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_set_rates(msg["levels"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/explain"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_explain(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entry = next(iter(hass.config_entries.async_loaded_entries(DOMAIN)), None)
    if entry is None or not (ai := entry.options.get(CONF_AI)):
        connection.send_error(msg["id"], "no_ai", "No AI chosen (Configure on the integration)")
        return
    try:
        text = await entry.runtime_data.async_explain(ai, hass.config.language)
    except Exception as err:  # noqa: BLE001 - shown in the panel
        connection.send_error(msg["id"], "ai_failed", str(err))
        return
    connection.send_result(msg["id"], {"text": text})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/settings"})
@websocket_api.require_admin
@callback
def ws_settings(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entry = next(iter(hass.config_entries.async_loaded_entries(DOMAIN)), None)
    connection.send_result(msg["id"], {
        "ai": bool(entry and entry.options.get(CONF_AI)),
        "backup": hass.services.has_service("backup", "create_automatic"),
        "mqtt": "mqtt" in hass.config.components,
        **(entry.runtime_data.get_settings() if entry else {}),
    })


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_settings",
        vol.Optional("overrides"): {str: vol.In(["often", "normal", "rare", "never"])},
        vol.Optional("auto_new"): bool,
        vol.Optional("retention"): {str: vol.Any(None, vol.All(int, vol.Range(min=1, max=365)))},
        vol.Optional("exclude"): [str],
        vol.Optional("protect"): [str],
        vol.Optional("keep"): {str: vol.Any(None, vol.All(int, vol.Range(min=1, max=365)))},
        vol.Optional("notify_energy"): bool,
        vol.Optional("weekly_report"): bool,
    }
)
@websocket_api.require_admin
@callback
def ws_set_settings(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    changes = {k: v for k, v in msg.items() if k not in ("id", "type")}
    connection.send_result(msg["id"], doctor.set_settings(changes))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/energy_extra"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_energy_extra(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_energy_extra())


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/fix_validation", vol.Required("issues"): [str]})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_fix_validation(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_fix_validation(msg["issues"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/add_to_energy", vol.Required("statistics"): [str]})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_add_to_energy(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_add_to_energy(msg["statistics"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/backup"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_backup(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], {"backup": await doctor.async_backup()})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/stop_saving", vol.Required("entities"): [str]})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_stop_saving(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await doctor.async_stop_saving(msg["entities"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/repack", vol.Required("record"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_repack(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Make the file smaller now, for a clean-up that is done but not repacked."""
    if (doctor := _doctor(hass)) is None:
        return _not_loaded(connection, msg)
    record = next((r for r in doctor.history if r["id"] == msg["record"] and r["kind"] == "cleanup"), None)
    if record is None:
        connection.send_error(msg["id"], "not_found", "No such clean-up")
        return
    record.pop("repacked", None)
    await doctor._async_repack(record)
    connection.send_result(msg["id"], {"repacking": record.get("repacked") is False, "skipped": record.get("repack_skipped")})

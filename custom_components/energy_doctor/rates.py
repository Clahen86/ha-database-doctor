"""How often devices save: groups, three levels and profiles for the whole house.

Changed only through each system's own settings:
- Zigbee2MQTT devices: Zigbee2MQTT's own "throttle" device option (one message per period), set over MQTT with
  "<base>/bridge/request/device/options" - the same as the option in Zigbee2MQTT's own interface. Only for devices that
  have nothing but sensors: lights, plugs, buttons, motion and door sensors must stay instant, so they are never touched.
- Signal strength (linkquality): the entity is disabled in Home Assistant's entity registry, and only when nothing uses it.
Every change remembers what was there before, so it can be undone.
"""

from __future__ import annotations

import asyncio
import json
import re
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er

Z2M_ID = re.compile(r"^zigbee2mqtt_0x([0-9a-f]{16})$")
# Seconds between messages for each level.
THROTTLE = {"often": 0, "normal": 30, "rare": 300}
# A device with any of these is never slowed down: it must react at once.
INSTANT = {
    "light", "switch", "cover", "climate", "lock", "fan", "button", "event", "siren", "valve", "number", "select",
    "text", "media_player", "binary_sensor", "alarm_control_panel", "vacuum", "update",
}
SIGNAL = re.compile(r"(linkquality|_lqi|rssi)$")
CLIMATE = {"temperature", "humidity", "pressure", "illuminance", "carbon_dioxide", "pm25", "volatile_organic_compounds"}
METER = {"power", "energy", "voltage", "current", "power_factor"}
# Profiles: the level per group. Devices something uses are never set to "rare" (they get "normal").
PROFILES = {
    "sparse": {"climate": "rare", "meters": "normal", "sensors": "rare", "signals": "off"},
    "balanced": {"climate": "normal", "meters": "often", "sensors": "normal", "signals": "off"},
    "detailed": {"climate": "often", "meters": "often", "sensors": "often", "signals": "on"},
}


def ieee(device: dr.DeviceEntry) -> str | None:
    for _domain, value in device.identifiers:
        if match := Z2M_ID.match(str(value).lower()):
            return f"0x{match[1]}"
    return None


def base_topic(hass: HomeAssistant, device: dr.DeviceEntry) -> str:
    """The base topic of the Zigbee2MQTT that owns the device (it can be changed, and several can run)."""
    try:
        from homeassistant.components.mqtt import debug_info

        text = json.dumps(debug_info.info_for_device(hass, device.id), default=str)
    except Exception:  # noqa: BLE001 - MQTT not loaded
        return "zigbee2mqtt"
    match = re.search(r'([^"\\\s]+)/bridge/state', text)
    return match[1] if match else "zigbee2mqtt"


async def async_throttles(hass: HomeAssistant, base: str) -> dict[str, int]:
    """ieee -> the throttle Zigbee2MQTT has now, from its retained "<base>/bridge/info"."""
    if "mqtt" not in hass.config.components:
        return {}
    from homeassistant.components import mqtt

    received: asyncio.Future[str] = hass.loop.create_future()

    @callback
    def _message(msg: Any) -> None:
        if not received.done():
            received.set_result(msg.payload)

    try:
        unsubscribe = await mqtt.async_subscribe(hass, f"{base}/bridge/info", _message)
    except Exception:  # noqa: BLE001 - MQTT not ready
        return {}
    try:
        async with asyncio.timeout(5):
            info = json.loads(await received)
    except (TimeoutError, ValueError):
        return {}
    finally:
        unsubscribe()
    devices = ((info or {}).get("config") or {}).get("devices") or {}
    return {str(k).lower(): int(v.get("throttle") or 0) for k, v in devices.items() if isinstance(v, dict)}


def level_of(throttle: int) -> str:
    return "often" if throttle <= 0 else "normal" if throttle <= 60 else "rare"


def _group(entries: list[er.RegistryEntry], hass: HomeAssistant) -> str | None:
    """The group of a device that may be slowed down, or None when it must stay instant."""
    domains = {e.domain for e in entries if not e.disabled_by}
    if not domains or domains & INSTANT or domains - {"sensor"}:
        return None
    classes = set()
    for e in entries:
        if SIGNAL.search(e.entity_id):
            continue
        state = hass.states.get(e.entity_id)
        classes.add((state and state.attributes.get("device_class")) or e.device_class or e.original_device_class)
    if classes & METER:
        return "meters"
    if classes & CLIMATE:
        return "climate"
    return "sensors"


async def async_plan(hass: HomeAssistant, entities: dict[str, dict[str, Any]], per_row: float) -> dict[str, Any]:
    """The groups with their devices, the level each has now and what each level would save a month."""
    devices, registry = dr.async_get(hass), er.async_get(hass)
    bases: dict[str, dict[str, int]] = {}
    groups: dict[str, dict[str, Any]] = {k: {"key": k, "devices": []} for k in ("climate", "meters", "sensors")}
    signals: list[dict[str, Any]] = []
    for device in list(devices.devices.values()):
        address = ieee(device)
        if address is None:
            continue
        entries = er.async_entries_for_device(registry, device.id, include_disabled_entities=True)
        for entry in entries:
            if SIGNAL.search(entry.entity_id):
                info = entities.get(entry.entity_id, {})
                signals.append({
                    "entity_id": entry.entity_id, "device": device.name_by_user or device.name,
                    "on": entry.disabled_by is None, "used": bool(info.get("used_in")),
                    "per_day": info.get("per_day", 0),
                })
        group = _group(entries, hass)
        if group is None:
            continue
        base = base_topic(hass, device)
        if base not in bases:
            bases[base] = await async_throttles(hass, base)
        throttle = bases[base].get(address, 0)
        own = [e for e in entries if not SIGNAL.search(e.entity_id) and e.disabled_by is None]
        per_day = sum(entities.get(e.entity_id, {}).get("per_day", 0) for e in own)
        groups[group]["devices"].append({
            "id": device.id, "ieee": address, "base": base, "name": device.name_by_user or device.name,
            "throttle": throttle, "level": level_of(throttle), "per_day": per_day,
            "used": any(entities.get(e.entity_id, {}).get("used_in") for e in own),
            # Rows a day each level would leave: at most one per entity per throttle period.
            "rows": {lvl: sum(min(entities.get(e.entity_id, {}).get("per_day", 0), 86400 / t if t else 10**9)
                              for e in own) for lvl, t in THROTTLE.items()},
        })
    for group in groups.values():
        levels = {d["level"] for d in group["devices"]}
        group["level"] = levels.pop() if len(levels) == 1 else ("mixed" if levels else "often")
        now = sum(d["per_day"] for d in group["devices"])
        group["saving"] = {
            lvl: round(max(0, now - sum(d["rows"][_safe(lvl, d)] for d in group["devices"])) * per_row * 30)
            for lvl in THROTTLE
        }
    unused_on = [s for s in signals if s["on"] and not s["used"]]
    return {
        "groups": [g for g in groups.values() if g["devices"]],
        "signals": {
            "count": len(signals), "on": sum(s["on"] for s in signals), "can_off": len(unused_on),
            "saving": round(sum(s["per_day"] for s in unused_on) * per_row * 30),
            "level": "on" if any(s["on"] for s in signals) else "off",
        },
        "_signals": signals,
    }


def _safe(level: str, device: dict[str, Any]) -> str:
    """Something uses the device: it is never set to "rare"."""
    return "normal" if level == "rare" and device["used"] else level


async def async_apply(
    hass: HomeAssistant, plan: dict[str, Any], levels: dict[str, str]
) -> dict[str, Any]:
    """Set the groups to their levels ({"climate": "rare", "signals": "off", …}). Returns what was changed and before."""
    from homeassistant.components import mqtt

    changes: list[dict[str, Any]] = []
    for group in plan["groups"]:
        if (level := levels.get(group["key"])) not in THROTTLE:
            continue
        for device in group["devices"]:
            throttle = THROTTLE[_safe(level, device)]
            if throttle == device["throttle"]:
                continue
            await mqtt.async_publish(
                hass, f"{device['base']}/bridge/request/device/options",
                json.dumps({"id": device["ieee"], "options": {"throttle": throttle}}),
            )
            changes.append({"ieee": device["ieee"], "base": device["base"], "name": device["name"],
                            "before": device["throttle"], "after": throttle})
    disabled: list[str] = []
    enabled: list[str] = []
    registry = er.async_get(hass)
    if (signal := levels.get("signals")) in ("on", "off"):
        for s in plan["_signals"]:
            if signal == "off" and s["on"] and not s["used"]:
                registry.async_update_entity(s["entity_id"], disabled_by=er.RegistryEntryDisabler.USER)
                disabled.append(s["entity_id"])
            elif signal == "on" and not s["on"]:
                registry.async_update_entity(s["entity_id"], disabled_by=None)
                enabled.append(s["entity_id"])
    return {"throttles": changes, "disabled": disabled, "enabled": enabled}


async def async_undo(hass: HomeAssistant, done: dict[str, Any]) -> None:
    from homeassistant.components import mqtt

    for change in done.get("throttles", []):
        await mqtt.async_publish(
            hass, f"{change['base']}/bridge/request/device/options",
            json.dumps({"id": change["ieee"], "options": {"throttle": change["before"]}}),
        )
    registry = er.async_get(hass)
    for entity_id in done.get("disabled", []):
        if registry.async_get(entity_id):
            registry.async_update_entity(entity_id, disabled_by=None)
    for entity_id in done.get("enabled", []):
        if registry.async_get(entity_id):
            registry.async_update_entity(entity_id, disabled_by=er.RegistryEntryDisabler.USER)

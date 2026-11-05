"""Health check of the database: where it lives, how big it is, the recorder's settings and the last backup."""

from __future__ import annotations

import os
from typing import Any

from homeassistant.components.recorder import get_instance
from homeassistant.core import HomeAssistant

# A database this big makes Home Assistant start and back up slowly.
BIG = 3_000_000_000


def _mount_device(path: str) -> str | None:
    """The block device a path is on (from /proc/mounts), to tell an SD card (mmcblk) from a disk."""
    best, device = "", None
    try:
        with open("/proc/mounts", encoding="utf-8") as mounts:
            for line in mounts:
                parts = line.split()
                if len(parts) > 1 and path.startswith(parts[1]) and len(parts[1]) > len(best):
                    best, device = parts[1], parts[0]
    except OSError:
        return None
    return device


async def async_health(hass: HomeAssistant, size: int | None) -> list[dict[str, Any]]:
    """Findings, each {"key", "level": ok|info|warn, "data"}; the panel words them."""
    instance = get_instance(hass)
    found: list[dict[str, Any]] = []
    path = instance.db_url.removeprefix("sqlite:///") if instance.db_url.startswith("sqlite:///") else None
    if path:
        device = await hass.async_add_executor_job(_mount_device, os.path.dirname(path))
        if device and "mmcblk" in device:
            found.append({"key": "sd_card", "level": "warn", "data": {}})
    if size and size > BIG:
        found.append({"key": "big", "level": "warn", "data": {"size": size}})
    found.append({"key": "keep_days", "level": "info", "data": {"days": instance.keep_days}})
    if not getattr(instance, "auto_purge", True):
        found.append({"key": "no_auto_purge", "level": "warn", "data": {}})
    if not getattr(instance, "auto_repack", True):
        found.append({"key": "no_auto_repack", "level": "info", "data": {}})
    backup = await _async_last_backup(hass)
    if backup:
        found.append({"key": "backup", "level": "info", "data": backup})
    return found


async def _async_last_backup(hass: HomeAssistant) -> dict[str, Any] | None:
    """The newest backup's size and date, from Home Assistant's backup manager."""
    if "backup" not in hass.config.components:
        return None
    try:
        from homeassistant.components.backup import async_get_manager

        backups, _errors = await async_get_manager(hass).async_get_backups()
    except Exception:  # noqa: BLE001 - the backup manager is optional and its API may change
        return None
    newest = max(backups.values(), key=lambda b: str(b.date), default=None)
    if newest is None:
        return None
    size = getattr(newest, "size", None)
    if size is None:
        sizes = [getattr(agent, "size", 0) for agent in (getattr(newest, "agents", {}) or {}).values()]
        size = max(sizes, default=None)
    return {"size": size, "date": str(newest.date)}

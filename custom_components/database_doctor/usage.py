"""Where each entity is used - and whether its HISTORY is used, or only its value now.

Read as well as Home Assistant itself understands it, never by guessing from text:
- automations, scripts and scenes: Home Assistant's own lists of the entities they use;
- dashboards made in the UI and YAML dashboards: card by card, graphs (history and statistics cards) apart;
- the energy dashboard and helpers made in the UI;
- the YAML configuration, loaded the way Home Assistant loads it (!include, packages, no comments), with each
  sensor platform's meaning: statistics, history_stats and filter read the recorder's history, templates and the rest
  only the value now;
- code outside Home Assistant where it can be read (AppDaemon, pyscript, python_scripts, Node-RED): a history call
  (AppDaemon get_history, a Node-RED history node) reads history, anything else only the value.
Nothing is written.
"""

from __future__ import annotations

import importlib
import json
import os
import re
from typing import Any

from homeassistant.core import HomeAssistant

ID = re.compile(r"\b(?:[a-z_]+)\.[a-z0-9_]+\b")
# Cards that draw an entity's history: its data is what they show.
GRAPH_CARDS = ("history-graph", "statistics-graph", "statistic", "sensor", "mini-graph", "apexcharts", "plotly", "energy")
# Helpers made in the UI that read an entity's recorded history (the others follow its value from now on).
HISTORY_HELPERS = ("history_stats", "statistics")
HELPERS = HISTORY_HELPERS + (
    "utility_meter", "derivative", "integration", "trend", "group", "template", "min_max", "threshold",
    "switch_as_x", "combine", "filter", "mold_indicator", "generic_thermostat",
)
# YAML sensor platforms that read the recorder's history.
HISTORY_PLATFORMS = ("statistics", "history_stats", "filter")
# Where code outside Home Assistant usually lives, when Home Assistant can read it.
OUTSIDE = ("appdaemon", "pyscript", "python_scripts", "node-red", "nodered", "netdaemon")
OUTSIDE_FILES = (".py", ".json", ".yaml", ".yml", ".cs", ".js")
HISTORY_CALL = re.compile(r"get_history|history/period|state_changes_during_period|statistics_during_period", re.I)
MAX_FILES, MAX_FILE = 3000, 2_000_000


def _add(uses: dict[str, list[dict[str, Any]]], entity_id: str, kind: str, name: str, history: bool = False) -> None:
    found = uses.setdefault(entity_id, [])
    for u in found:
        if u["kind"] == kind and u["name"] == name:
            u["history"] = u["history"] or history
            return
    found.append({"kind": kind, "name": name, "history": history})


def _ids(value: Any) -> set[str]:
    return set(ID.findall(json.dumps(value, default=str).lower()))


def _walk_cards(node: Any, title: str, uses: dict[str, list[dict[str, Any]]], graph: bool = False) -> None:
    if isinstance(node, dict):
        card = str(node.get("type", ""))
        graph = graph or any(g in card for g in GRAPH_CARDS)
        for key, value in node.items():
            if isinstance(value, str) and key in ("entity", "entity_id", "statistic"):
                _add(uses, value.lower(), "graph" if graph else "dashboard", title, graph)
            else:
                _walk_cards(value, title, uses, graph)
    elif isinstance(node, list):
        for item in node:
            if isinstance(item, str) and ID.fullmatch(item.lower()):
                _add(uses, item.lower(), "graph" if graph else "dashboard", title, graph)
            else:
                _walk_cards(item, title, uses, graph)
    elif isinstance(node, str) and "{{" in node:
        for entity_id in ID.findall(node.lower()):
            _add(uses, entity_id, "dashboard", title)


# ---------- the YAML configuration ----------

_SKIP_DOMAINS = {"recorder", "logger", "homeassistant", "http", "frontend", "default_config", "lovelace"}
# Handled by their own editors (and Home Assistant's own lists above).
_EDITOR_DOMAINS = {"automation", "script", "scene"}


def _walk_config(config: dict[str, Any], uses: dict[str, list[dict[str, Any]]]) -> None:
    for domain, value in config.items():
        domain = str(domain).split(" ")[0]
        if domain in _SKIP_DOMAINS or domain in _EDITOR_DOMAINS:
            continue
        items = value if isinstance(value, list) else [value]
        for item in items:
            platform = item.get("platform") if isinstance(item, dict) else None
            history = platform in HISTORY_PLATFORMS
            label = f"YAML: {domain}" + (f" ({platform})" if platform else "")
            for entity_id in _ids(item):
                if entity_id.split(".")[0] in ("homeassistant", "input", "states", "state_attr", "this", "trigger"):
                    continue
                _add(uses, entity_id, "yaml", label, history)


async def _async_yaml(hass: HomeAssistant, uses: dict[str, list[dict[str, Any]]]) -> None:
    """The YAML configuration as Home Assistant loads it: !include, packages merged, no comments."""
    try:
        from homeassistant import config as conf_util

        config = await conf_util.async_hass_config_yaml(hass)
    except Exception:  # noqa: BLE001 - a broken file is Home Assistant's own business to report
        return
    _walk_config(config, uses)


async def _async_yaml_dashboards(hass: HomeAssistant, uses: dict[str, list[dict[str, Any]]]) -> None:
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_STORAGE
    except ImportError:
        return
    data = hass.data.get(LOVELACE_DATA)
    for url, dashboard in data.dashboards.items() if data else []:
        try:
            config = await dashboard.async_load(False)
        except Exception:  # noqa: BLE001 - an empty dashboard
            continue
        title = (getattr(dashboard, "config", None) or {}).get("title") or url or "Overview"
        kind = "" if getattr(dashboard, "mode", None) == MODE_STORAGE else " (YAML)"
        _walk_cards(config, f"{title}{kind}", uses)


# ---------- code outside Home Assistant ----------


def outside_roots(config_dir: str) -> list[str]:
    roots = [os.path.join(config_dir, name) for name in OUTSIDE]
    roots += [os.path.join("/share", name) for name in OUTSIDE]
    # Add-on folders (Home Assistant OS) - readable only on some installations.
    if os.path.isdir("/addon_configs"):
        try:
            roots += [os.path.join("/addon_configs", d) for d in os.listdir("/addon_configs")
                      if any(o.replace("-", "") in d.replace("-", "").lower() for o in OUTSIDE)]
        except OSError:
            pass
    return [r for r in roots if os.path.isdir(r)]


def _scan_outside(config_dir: str) -> tuple[dict[str, set[tuple[str, bool]]], list[str]]:
    """entity_id -> {(file, history)} from code outside Home Assistant, and the folders that were read."""
    found: dict[str, set[tuple[str, bool]]] = {}
    roots = outside_roots(config_dir)
    budget = MAX_FILES
    for root in roots:
        for folder, dirs, files in os.walk(root):
            dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("node_modules", "__pycache__", "lib")]
            for name in files:
                path = os.path.join(folder, name)
                if not name.endswith(OUTSIDE_FILES) or ".bak" in name or budget <= 0:
                    continue
                try:
                    if os.path.getsize(path) > MAX_FILE:
                        continue
                    with open(path, encoding="utf-8", errors="ignore") as file:
                        text = file.read()
                except OSError:
                    continue
                budget -= 1
                short = os.path.relpath(path, root.rsplit("/", 1)[0])
                if name == "flows.json":
                    _scan_node_red(text, short, found)
                    continue
                lines = text.splitlines()
                # A history call reads the history of the entities named in the call itself (until its brackets
                # close), or in the constants and variables it names.
                constants = {}
                for line in lines:
                    if m := re.match(r"\s*([A-Za-z_][A-Za-z0-9_.]*)\s*=\s*[\"']([a-z_]+\.[a-z0-9_]+)[\"']", line):
                        constants[m[1].split(".")[-1]] = m[2]
                history_ids = set()
                for i, line in enumerate(lines):
                    if not (call := HISTORY_CALL.search(line)):
                        continue
                    text_call, depth = line[call.start():], 0
                    for j in range(i, min(i + 8, len(lines))):
                        part = text_call if j == i else lines[j]
                        if j > i:
                            text_call += "\n" + part
                        depth += part.count("(") - part.count(")")
                        if depth <= 0 and "(" in text_call:
                            break
                    history_ids |= set(ID.findall(text_call.lower()))
                    history_ids |= {v for k, v in constants.items() if re.search(rf"\b{re.escape(k)}\b", text_call)}
                for entity_id in set(ID.findall(text.lower())):
                    if "." in entity_id and entity_id.split(".")[0] in _KNOWN_DOMAINS:
                        found.setdefault(entity_id, set()).add((short, entity_id in history_ids))
    return found, roots


def _scan_node_red(text: str, short: str, found: dict[str, set[tuple[str, bool]]]) -> None:
    try:
        nodes = json.loads(text)
    except ValueError:
        return
    for node in nodes if isinstance(nodes, list) else []:
        if not isinstance(node, dict):
            continue
        history = "history" in str(node.get("type", ""))
        for entity_id in _ids(node):
            if entity_id.split(".")[0] in _KNOWN_DOMAINS:
                found.setdefault(entity_id, set()).add((f"{short}: {node.get('name') or node.get('type')}", history))


_KNOWN_DOMAINS = {
    "sensor", "binary_sensor", "switch", "light", "climate", "input_number", "input_boolean", "input_select",
    "number", "select", "weather", "person", "device_tracker", "cover", "fan", "media_player", "lock", "button",
    "counter", "timer", "zone", "sun", "water_heater", "humidifier", "vacuum", "event", "update", "valve", "todo",
}


async def async_addons_without_access(hass: HomeAssistant, roots: list[str]) -> list[str]:
    """Add-ons that can run code using the history (AppDaemon, Node-RED …) whose files Home Assistant can't read."""
    try:
        from homeassistant.components.hassio import get_addons_list

        addons = get_addons_list(hass)
    except Exception:  # noqa: BLE001 - not Home Assistant OS / Supervised
        return []
    read = " ".join(roots).replace("-", "").lower()
    found = []
    for addon in addons:
        name, slug = str(addon.get("name", "")), str(addon.get("slug", "")).lower()
        key = next((o for o in OUTSIDE if o.replace("-", "") in slug.replace("-", "").replace("_", "")), None)
        if key and key.replace("-", "") not in read:
            found.append(name)
    return found


async def async_uses(hass: HomeAssistant) -> tuple[dict[str, list[dict[str, Any]]], dict[str, Any]]:
    """(entity_id -> [{kind, name, history}], what could not be read)."""
    uses: dict[str, list[dict[str, Any]]] = {}
    for domain, module, finder in (
        ("automation", "homeassistant.components.automation", "entities_in_automation"),
        ("script", "homeassistant.components.script", "entities_in_script"),
        ("scene", "homeassistant.components.homeassistant.scene", "entities_in_scene"),
    ):
        if domain not in hass.config.components:
            continue
        find = getattr(importlib.import_module(module), finder)
        for state in hass.states.async_all(domain):
            for entity_id in find(hass, state.entity_id):
                _add(uses, entity_id, domain, state.name)

    await _async_yaml_dashboards(hass, uses)

    if "energy" in hass.config.components:
        try:
            from homeassistant.components.energy.data import async_get_manager

            manager = await async_get_manager(hass)
            for entity_id in _ids(manager.data or {}):
                _add(uses, entity_id, "energy", "Energy", True)
        except Exception:  # noqa: BLE001 - the energy dashboard is optional
            pass

    for entry in hass.config_entries.async_entries():
        if entry.domain not in HELPERS:
            continue
        for entity_id in _ids([dict(entry.data), dict(entry.options)]):
            _add(uses, entity_id, "helper", entry.title, entry.domain in HISTORY_HELPERS)

    await _async_yaml(hass, uses)

    outside, roots = await hass.async_add_executor_job(_scan_outside, hass.config.path())
    for entity_id, places in outside.items():
        for name, history in sorted(places):
            _add(uses, entity_id, "outside", name, history)
    unseen = await async_addons_without_access(hass, roots)
    return uses, {"unseen_addons": unseen, "outside_read": [os.path.basename(r) for r in roots]}


def energy_ids(uses: dict[str, list[dict[str, Any]]]) -> set[str]:
    return {e for e, found in uses.items() if any(u["kind"] == "energy" for u in found)}

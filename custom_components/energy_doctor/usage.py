"""Where each entity is used, so data that something needs is never suggested for clean-up.

Read only: automations, scripts, scenes, dashboards made in the UI, the energy dashboard, helpers, and the user's own
YAML files (read, never written).
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
GRAPH_CARDS = ("history-graph", "statistics-graph", "statistic", "sensor", "mini-graph", "apexcharts", "plotly")
# Helpers that read an entity's recorded history.
HISTORY_HELPERS = ("history_stats", "statistics", "utility_meter", "derivative", "integration", "trend", "filter")
HELPERS = HISTORY_HELPERS + ("group", "template", "min_max", "threshold", "switch_as_x", "combine")


def _add(uses: dict[str, list[dict[str, Any]]], entity_id: str, kind: str, name: str, history: bool = False) -> None:
    found = uses.setdefault(entity_id, [])
    if not any(u["kind"] == kind and u["name"] == name for u in found):
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


def _yaml_files(config_dir: str) -> list[str]:
    files = [os.path.join(config_dir, n) for n in os.listdir(config_dir) if n.endswith((".yaml", ".yml"))]
    for root, _dirs, names in os.walk(os.path.join(config_dir, "packages")):
        files += [os.path.join(root, n) for n in names if n.endswith((".yaml", ".yml"))]
    return sorted(f for f in files if os.path.basename(f) != "secrets.yaml" and ".bak" not in os.path.basename(f))


def _scan_yaml(config_dir: str) -> dict[str, set[str]]:
    """Entity ids mentioned in the user's own YAML files (automations.yaml etc. are covered by their editors)."""
    found: dict[str, set[str]] = {}
    for path in _yaml_files(config_dir):
        name = os.path.relpath(path, config_dir)
        if name in ("automations.yaml", "scripts.yaml", "scenes.yaml"):
            continue
        try:
            with open(path, encoding="utf-8") as file:
                text = file.read().lower()
        except OSError:
            continue
        for entity_id in ID.findall(text):
            found.setdefault(entity_id, set()).add(name)
    return found


async def async_uses(hass: HomeAssistant) -> dict[str, list[dict[str, Any]]]:
    """entity_id -> [{kind, name, history}] for every entity that something uses."""
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

    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_STORAGE

        data = hass.data.get(LOVELACE_DATA)
        for url, dashboard in data.dashboards.items() if data else []:
            if getattr(dashboard, "mode", None) != MODE_STORAGE:
                continue
            try:
                config = await dashboard.async_load(False)
            except Exception:  # noqa: BLE001 - an empty dashboard
                continue
            title = (getattr(dashboard, "config", None) or {}).get("title") or url or "Overview"
            _walk_cards(config, str(title), uses)
    except ImportError:
        pass

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

    for entity_id, files in (await hass.async_add_executor_job(_scan_yaml, hass.config.path())).items():
        for name in sorted(files):
            _add(uses, entity_id, "yaml", name)
    return uses


def energy_ids(uses: dict[str, list[dict[str, Any]]]) -> set[str]:
    return {e for e, found in uses.items() if any(u["kind"] == "energy" for u in found)}

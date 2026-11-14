"""How Database Doctor is used, for the developer (sent with the daily question when sharing is on - see support.py):
the database engine, its size in rough steps, how long it keeps history, and which integrations write the most.
Never entity IDs or names - integrations by their domain only. Read from the last analysis (nothing is measured)."""

from __future__ import annotations

from typing import Any

from homeassistant.helpers import entity_registry as er

BUCKETS = [(500e6, "<500MB"), (2e9, "0.5-2GB"), (5e9, "2-5GB"), (10e9, "5-10GB")]


def size_bucket(size: float | None) -> str | None:
    if not size:
        return None
    return next((name for top, name in BUCKETS if size < top), "10GB+")


def setup_info(doctor: Any) -> dict[str, Any]:
    hass = doctor.hass
    res = doctor._cache[1] if doctor._cache else {}
    reg = er.async_get(hass)
    by_domain: dict[str, int] = {}
    ents = sorted(doctor._all.values(), key=lambda e: e.get("bytes") or 0, reverse=True)[:400]
    for e in ents:
        entry = reg.async_get(e["entity_id"])
        dom = (entry.platform if entry else None) or e["entity_id"].split(".")[0]
        by_domain[dom] = by_domain.get(dom, 0) + int(e.get("rows") or 0)
    top = dict(sorted(by_domain.items(), key=lambda kv: -kv[1])[:10])
    keep = None
    try:
        from homeassistant.components.recorder import get_instance

        keep = get_instance(hass).keep_days
    except Exception:  # noqa: BLE001
        pass
    engine = str(res.get("engine") or "?").lower()
    st = doctor.settings
    groups = res.get("groups") or {}
    total = sum(groups.values()) or 1
    return {
        "devices": [{"kind": "database", "platform": engine, "ok": not any(h.get("level") == "error" for h in (res.get("health") or [])
                                                                      if isinstance(h, dict)),
                     "extra": {"top_integrations": top, "groups_pct": {g: round(100 * b / total) for g, b in
                                                                      sorted(groups.items(), key=lambda kv: -kv[1])[:8]}}}],
        "sizes": {"db_size": size_bucket(res.get("size")), "keep_days": keep},
        "counts": {"entities_recorded": len(doctor._all), "excluded": len(st.get("exclude") or []),
                   "protected": len(st.get("protect") or []), "kept": len(st.get("keep") or {}),
                   "energy_issues": len(res.get("energy_issues") or []), "cleanups": len(doctor.history)},
        "features": {"auto_new": bool(st.get("auto_new")), "notify_energy": bool(st.get("notify_energy")),
                     "weekly_report": bool(st.get("weekly_report")), "retention": bool(st.get("retention")),
                     "levels": bool(doctor.levels)},
    }

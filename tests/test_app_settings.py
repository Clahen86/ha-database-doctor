"""Apps (add-ons) that name sensors in their own settings keep those sensors' history."""

import os

from custom_components.database_doctor import usage


def test_app_settings_found(tmp_path, monkeypatch):
    app = tmp_path / "55081cca_energy_pilot"
    app.mkdir()
    (app / "energy_pilot_uses.json").write_text('{"entities": ["sensor.husets_forbrug", "sensor.gone"]}')
    (app / "model.pkl").write_bytes(b"sensor.not_read")
    real = os.path.isdir
    monkeypatch.setattr(usage.os.path, "isdir", lambda p: True if p == "/addon_configs" else real(p))
    monkeypatch.setattr(usage.os, "listdir", lambda p: ["55081cca_energy_pilot"] if p == "/addon_configs" else os.listdir(p))
    orig_join = usage.os.path.join
    monkeypatch.setattr(usage.os.path, "join", lambda a, *b: str(tmp_path.joinpath(*b)) if a == "/addon_configs" else orig_join(a, *b))
    found = usage._scan_app_settings({"sensor.husets_forbrug", "sensor.not_read"}, [])
    assert found == {"sensor.husets_forbrug": {"55081cca_energy_pilot"}}

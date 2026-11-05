"""Fixtures for Energy Doctor tests: every test runs with a real recorder (SQLite in memory)."""

import pytest


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    """The recorder must come before hass, so it is requested first."""
    yield

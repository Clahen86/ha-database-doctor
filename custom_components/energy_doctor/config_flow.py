"""Set up once; everything happens in the Energy Doctor panel. Configure: an AI to explain the database (optional)."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import CONF_AI, DOMAIN


class EnergyDoctorConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(title="Energy Doctor", data={})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return EnergyDoctorOptionsFlow()


class EnergyDoctorOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        current = self.config_entry.options.get(CONF_AI)
        schema = vol.Schema(
            {
                vol.Optional(CONF_AI, description={"suggested_value": current}): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="ai_task")
                )
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)

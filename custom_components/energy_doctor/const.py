"""Constants for Energy Doctor."""

DOMAIN = "energy_doctor"
PANEL = "energy-doctor"
STATIC = "/energy_doctor_static"

# How far back the energy statistics are checked for spikes and negative values.
CHECK_DAYS = 120
# How long the undo history and the daily database sizes are kept.
KEEP_DAYS = 30
# An analysis is reused this long unless the user asks for a fresh one.
CACHE_SECONDS = 600

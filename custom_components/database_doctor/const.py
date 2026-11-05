"""Constants for Database Doctor."""

DOMAIN = "database_doctor"
PANEL = "database-doctor"
STATIC = "/database_doctor_static"

# How far back the energy statistics are checked for spikes and negative values.
CHECK_DAYS = 120
# How long the undo history and the daily database sizes are kept.
KEEP_DAYS = 30
# An analysis is reused this long unless the user asks for a fresh one.
CACHE_SECONDS = 600

# The ai_task entity that explains the database in plain words (optional).
CONF_AI = "ai_entity"

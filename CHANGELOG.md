# Changelog – Database Doctor

Newest first. Each version lists what changed since the one before.

## 0.14.1 – 2026-11-19

- French translation: panel, setup, notifications and AI explanation

## 0.14.0 – 2026-11-16

- Keep used and Energy statistics, buttons never slowed, use seen for every entity, repack on MariaDB/PostgreSQL by hand, lighter counting, free space only where known, safer gap fix

## 0.13.1 – 2026-11-16

- Store and update links open right inside Home Assistant
- Error reports: a translated message shown on purpose (a refusal) is not reported as an error
- 3-part device identifiers, panel shows errors instead of spinning, no blocking read of manifest.json

## 0.13.0 – 2026-11-14

- How it is set up goes with the daily question (no names unless 'Share my setup' is on)

## 0.12.0 – 2026-11-14

- Update card (new version, your error fixed) and the version in the daily question

## 0.11.1 – 2026-11-14

- Files under a new address for every version, so a browser never mixes old and new files

## 0.11.0 – 2026-11-14

- Suggestions of the other apps (fits your home, from the same developer)

## 0.10.2 – 2026-11-14

- Errors from Home Assistant restarting or the network (502, timeout, no connection) are not reported

## 0.10.1 – 2026-11-14

- Help sends again (the websocket field 'id' clashed with the message's own)

## 0.10.0 – 2026-11-14

- Help - get help, answers from the developer, errors sent anonymously

## 0.9.0 – 2026-11-08

- New screenshots with the new name and design
- No NaN in Updated
- Say exactly how the database is read
- Sensors named in apps' own settings (Energy Pilot, Predbat, EMHASS ...) keep their history

## 0.8.1 – 2026-11-05

- Hassio in after_dependencies (it reads the add-on list)

## 0.8.0 – 2026-11-05

- Energy Doctor 0.1.0: energy spikes and negative hours, what fills the database, clean-up
- Save less often (Zigbee2MQTT throttle, groups, profiles, new devices), gaps, price of the same hour, causes, watch, backup first, AI explanation
- Tabs, Data per device with filters and search, graph and forecast, health check, statistics warnings, unaccounted use, retention, per-device levels, why-not list, weekly report, 5 languages
- Iterate the device registry without the deprecated mapping
- The size graph starts at once from hourly samples
- The first forecast is marked provisional
- Opens at once with the last picture and refreshes behind it
- The backup step shows that it is the backup that takes time
- Database size for MariaDB/MySQL and PostgreSQL
- Statistics warnings grouped with one button each, never for statistics Energy uses
- Data – "Lower" with one tap where a device can save less often
- Otherwise only "Saves a lot"
- Reads how entities are used (YAML as HA loads it, history platforms, AppDaemon/pyscript/Node-RED history calls), history vs. value, Never touch, add-ons it can't see, Stop saving via Zigbee2MQTT filtered_attributes
- An entity only counts as deleted when it has written nothing for days (set_state sensors are missing for a while after a restart)
- Clean-up page says why it is safe and lists what is cleaned, with size and why each one is fine
- Clean-up progress on Overview, nothing suggested twice while it runs, an interrupted clean-up goes on after a restart
- One progress bar for all running clean-ups, also ones started before 0.4.3
- Makes the file smaller after a clean-up (the recorder's own repack), shows the space freed at once and how much smaller the file got
- "Keep it like this" – a clean-up becomes a nightly rule that skips entities whose history comes into use
- Data shows "Keeps 3 days" and "Keep everything again"
- Recently shows the real change of the database once, from before the clean-ups began
- "not recorded" warnings are explained, not offered for deletion (HA warns about the setup, not the data)
- Health score with what to do, stat tiles, plain words with ? help, welcome, undo bar, empty states, two columns on wide screens, dark theme, gentle animations
- Renamed to Database Doctor – it covers the whole database, not just energy (settings and history come along from Energy Doctor)

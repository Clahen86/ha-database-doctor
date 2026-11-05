# Energy Doctor

[![Validate](https://github.com/Clahen86/ha-energy-doctor/actions/workflows/validate.yml/badge.svg)](https://github.com/Clahen86/ha-energy-doctor/actions/workflows/validate.yml)

**Wrong numbers in the energy dashboard fixed with one tap – and a clear view of what fills your database.**

Energy Doctor adds a panel to the sidebar:

- **Wrong numbers in Energy:** finds hours with spikes (a fridge using 50,000 kWh in one hour) and negative hours, and sets them to what is normal for that meter – with Home Assistant's own *Adjust sum*. Every fix can be undone.
- **What takes up the most:** how big the database is, how fast it grows, when the disk is full, and which entities take up the space – with how often they save and where they are used (automations, scripts, scenes, graphs, dashboards, the energy dashboard, helpers, YAML).
- **Save less often:** three levels per group (temperature and climate, energy meters, other sensors) and profiles for the whole house (Sparse, Balanced, Detailed). It uses Zigbee2MQTT's own *throttle* option, only on devices that have nothing but sensors – lights, plugs, buttons, motion and door sensors are never slowed down, and anything that is used never goes below Normal. New devices get the same. Unused signal-strength entities can be switched off. Everything can be undone.
- **Gaps:** when a meter was offline and everything came at once, the use is spread over the missing hours. The price of the same hour is fixed together with the energy, and the panel says why a meter jumped (it was unavailable or went to 0).
- **Overview:** size over time with a forecast (doing nothing vs. after Optimise), a health check (SD card, size, the recorder's settings, the last backup) and how much smaller the database got after a clean-up.
- **Statistics warnings:** Home Assistant's own warnings (unit changed, entity gone …) in one place, fixed with its own functions.
- **Use nothing explains:** how much of your grid use the devices in Energy explain, with energy meters you can add in one tap.
- **How long details are kept:** per group, for example 3 days of second-by-second detail – graphs and hourly statistics always stay.
- **A watch:** twice a day it checks for new wrong numbers and tells you, and a weekly report if you want one.
- **Explain with AI (optional):** pick an AI task entity under *Configure*, and the panel explains your database in plain words.
- **Clean up:** removes the history of devices that are gone, and old history of busy entities that nothing uses, with the recorder's own purge – after a Home Assistant backup if you want. Anything something uses is never suggested.

Energy Doctor only changes data through Home Assistant's own recorder functions. It never writes your YAML files: to stop saving an entity it shows the lines to add yourself.

> Early version (0.3). Tabs: Overview · Energy · Data · Settings. Languages: English, Danish, German, Swedish, Dutch.

## Installation

1. HACS → search for **Energy Doctor** → Download. (Not in HACS yet? Add `https://github.com/Clahen86/ha-energy-doctor` as a custom repository of type *Integration*.)
2. Restart Home Assistant.
3. Settings → Devices & services → Add integration → **Energy Doctor**.
4. Open **Energy Doctor** in the sidebar.

---

## Dansk

**Forkerte tal i Energi-dashboardet rettet med ét tryk – og et klart overblik over, hvad der fylder i databasen.**

- **Fejl i Energi:** finder timer med spring og negative timer og sætter dem til det normale for måleren med Home Assistants egen *Juster sum*. Alt kan fortrydes.
- **Fylder mest:** databasens størrelse, vækst, hvornår disken er fuld, og hvad der fylder – med hvor tit det gemmes, og hvor det bruges.
- **Ryd op:** fjerner historik fra enheder, der ikke findes længere, og gammel historik fra travle entiteter, som intet bruger. Det, der bruges, bliver aldrig foreslået.

Energi-doktor ændrer kun data via Home Assistants egne recorder-funktioner og skriver aldrig i dine YAML-filer.

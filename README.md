# Energy Doctor

[![Validate](https://github.com/Clahen86/ha-energy-doctor/actions/workflows/validate.yml/badge.svg)](https://github.com/Clahen86/ha-energy-doctor/actions/workflows/validate.yml)

**Wrong numbers in the energy dashboard fixed with one tap – and a clear view of what fills your database.**

Energy Doctor adds a panel to the sidebar:

- **Wrong numbers in Energy:** finds hours with spikes (a fridge using 50,000 kWh in one hour) and negative hours, and sets them to what is normal for that meter – with Home Assistant's own *Adjust sum*. Every fix can be undone.
- **What takes up the most:** how big the database is, how fast it grows, when the disk is full, and which entities take up the space – with how often they save and where they are used (automations, scripts, scenes, graphs, dashboards, the energy dashboard, helpers, YAML).
- **Clean up:** removes the history of devices that are gone, and old history of busy entities that nothing uses, with the recorder's own purge. Anything something uses is never suggested.

Energy Doctor only changes data through Home Assistant's own recorder functions. It never writes your YAML files: to stop saving an entity it shows the lines to add yourself.

> Early version (0.1). Saving less often per group and profiles for the whole house come next.

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

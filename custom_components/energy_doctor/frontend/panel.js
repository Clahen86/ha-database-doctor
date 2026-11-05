// Energy Doctor panel: tabs Overview · Energy · Data · Settings.

const EN = {
  score: "Health",
  grades: {"great": "Very good", "good": "Good", "fair": "Could be better", "poor": "Needs help"},
  scoreOf: "{n} of 100",
  todo: "What you can do",
  actEnergy: "Fix {n} wrong numbers in Energy",
  actClean: "Clean up and save {n}",
  actRates: "Save less often – save {n} a month",
  actValidation: "Clear old statistics",
  actHealth: "See the health check",
  allGood: "Everything looks good",
  allGoodText: "No wrong numbers in Energy and nothing to clean up. Look in again in a week.",
  statSize: "Size",
  statGrowth: "Grows a day",
  statDisk: "Disk full in",
  statNever: "not soon",
  w1t: "Welcome to Energy Doctor",
  w1: "It finds wrong numbers in the energy dashboard and shows what fills your database – and how to keep it small.",
  w2t: "Always safe",
  w2: "It only uses Home Assistant's own functions, and nothing that something uses is ever touched.",
  w3t: "It can be undone",
  w3: "Fixes and settings can be undone, and before a clean-up it can make a backup.",
  next: "Next",
  start: "Get started",
  skip: "Skip",
  help: {"history": "History is every value Home Assistant saves, for example every 10 seconds. Statistics are hourly averages that long graphs use – they always stay.", "trim": "Keeping only a few days of history removes the second-by-second detail. Graphs, Energy and hourly statistics are not affected.", "protect": "“Never touch” keeps an entity out of every suggestion – useful when code outside Home Assistant (like AppDaemon) reads its history.", "rates": "Zigbee devices can send less often. Only devices with nothing but sensors are slowed down, and what is used never goes below Normal.", "validation": "Home Assistant keeps statistics for sensors. When a sensor is renamed or removed, its old statistics stay behind and can be cleared."},
  energyAllGood: "Everything is in order in Energy",
  snackUndo: "Undo",
  vinfo: "Harmless: their history is switched off on purpose. Home Assistant keeps warning as long as the sensor makes statistics – there is no old statistics left to delete.",
  keepRule: "Keep it like this – they keep only {k} days from now on (checked every night)",
  keptPill: "Keeps {k} days",
  unkeep: "Keep everything again",
  repackAfter: "Make the file smaller when it is done",
  recFreed: "≈ {n} freed in the database",
  recRepacking: "the file is being made smaller …",
  recSmaller: "the file is {n} smaller",
  recNoRoom: "too little free disk to make the file smaller",
  repackNow: "Make the file smaller",
  cleaningTitle: "Cleaning up · {p} %",
  cleaningText: "Home Assistant works in the background – on a big database it can take an hour. Avoid restarting Home Assistant meanwhile (if you do, it carries on afterwards).",
  cleanDoneText: "Home Assistant now removes it in the background. On a big database that can take an hour – follow it on Overview. If Home Assistant restarts meanwhile, it carries on afterwards.",
  cleanWhat: "{t} entities keep the last {k} days, and {d} deleted devices are cleaned out.",
  cleanWhatTrim: "{t} entities keep the last {k} days.",
  cleanWhatDeleted: "{d} deleted devices are cleaned out.",
  safeTitle: "Why it's safe",
  safe1: "No graph, the energy dashboard or a history helper uses them",
  safe2: "Automations and templates only use the value now – it stays",
  safe3: "Hourly statistics stay, so long graphs still work",
  safe4: "{n} entities marked “Never touch” are left alone",
  seeWhat: "See what is cleaned ({n})",
  whyGone: "No longer exists",
  whyUnused: "Not used anywhere",
  whyValue: "Only its value now is used: {list}",
  st2: {"history": "History used – keep", "value": "Used – only its value", "value_busy": "Used – old history can go", "protected": "Never touch"},
  protectOn: "Never touch",
  protectOff: "Allow again",
  trimRow: "Clear old history",
  historyTag: "history",
  unseen: "Energy Doctor can't see the files of {list}. If they read history, mark those entities “Never touch”.",
  outsideRead: "Also read: {list}",
  stopDone: "{s} stopped at the source in Zigbee2MQTT",
  stopListed: "{l} put on the list “Stop saving”",
  recFilter: "Stop saving: {n} values stopped in Zigbee2MQTT",
  lower: "Lower",
  busyOnly: "Saves a lot",
  loweredOne: "{n} saves less often now",
  vgroups: {"no_state": "{n} entities no longer exist", "entity_no_longer_recorded": "{n} entities are no longer recorded", "entity_not_recorded": "{n} entities are not recorded", "state_class_removed": "{n} entities no longer have a state class"},
  vexplain: {"no_state": "Old names from devices that were renamed or paired again. Their old statistics are still in the database.", "entity_no_longer_recorded": "They are excluded from the recorder (by you or an integration). The statistics from before are still there.", "entity_not_recorded": "They are excluded from the recorder. The statistics from before are still there.", "state_class_removed": "They no longer give statistics. The statistics from before are still there."},
  vclearAll: "Delete old statistics for all {n}",
  vshow: "Show them",
  vnotEnergy: "None of them are used in the energy dashboard.",
  vinEnergy: "{n} of them are used in the energy dashboard – keep those.",
  sizeUnknown: "The size couldn't be read from the database server – the rest works the same.",
  updated: "Updated {n}",
  agoNow: "just now",
  agoMin: "{n} min ago",
  agoHour: "{n} h ago",
  refreshing: "Updating …",
  backupWorking: "Making a backup …",
  backupHint: "Home Assistant's own backup – it can take a few minutes on a big installation.",
  cleaning: "Cleaning up …",
  provisional: "First estimate from the first hours – it gets more precise after a couple of days.",
  title: "Energy Doctor",
  tabs: { overview: "Overview", energy: "Energy", data: "Data", settings: "Settings" },
  working: "Looking through the database …",
  workingHint: "A big database takes a minute.",
  fresh: "Check again",
  perDay: "+{n} a day",
  healthy: "Your database is healthy.",
  growing: "Your database grows by {n} a day.",
  diskFull: "The disk is full in about {n}.",
  months: "{n} months", years: "{n} years", days: "{n} days",
  groups: { sensors: "Sensors", energy: "Energy", lights: "Lights", signals: "Signals", other: "Other" },
  graphTitle: "Size over time",
  graphNow: "Now", graphAsIs: "If you do nothing", graphOptimised: "After Optimise",
  graphFew: "The graph fills in day by day.",
  ratesCard: "Save less often",
  ratesNone: "Not set up – everything saves as often as it can.",
  ratesProfile: "Profile: {p}",
  ratesCustom: "Your own choices",
  ratesSave: "Can save {n} a month",
  change: "Change",
  suggestion: "Suggestion",
  save: "Save {n}",
  saveText: "{d} deleted devices still have history, and {t} busy entities that nothing uses keep {k} days instead of all of it.",
  nothingToSave: "Nothing to clean up – well kept!",
  cleanup: "Clean up",
  health: "Health check",
  healthItems: {
    sd_card: "The database is on an SD card. SD cards wear out from many writes – consider an SSD.",
    big: "The database is {size}. That makes starting and backing up Home Assistant slow.",
    keep_days: "The recorder keeps {days} days of history (purge_keep_days).",
    no_auto_purge: "Automatic clean-up (auto_purge) is off, so the database only grows.",
    no_auto_repack: "Automatic repack is off, so the file doesn't shrink after a clean-up.",
    backup: "Latest backup: {size} ({date}).",
  },
  energyErrors: "Wrong numbers in Energy",
  found: "{n} found",
  noErrors: "No wrong numbers in the last 120 days.",
  fix: "Fix", fill: "Fill",
  spike: "{v} {u} in one hour – normal is {e}",
  negative: "{v} {u} – an hour can't be negative",
  gap: "The meter was away for {m} hours – {v} {u} came at once",
  causeUnavailable: "The meter was unavailable just before – that often gives a jump.",
  causeZero: "The meter went to 0 just before (for example at a restart) and started over.",
  costNote: "Its price for the same hour is fixed with it.",
  energyIntro: "Each hour is set to what is normal for that meter, with Home Assistant's own “Adjust sum”. It can be undone.",
  fixN: "Fix {n}",
  fixedN: "{n} hours fixed",
  validation: "Statistics warnings",
  validationNone: "Home Assistant has no warnings about your statistics.",
  vtypes: {
    entity_no_longer_recorded: "Is no longer recorded – old statistics are left",
    entity_not_recorded: "Is not recorded – old statistics are left",
    no_state: "The entity is gone – old statistics are left",
    state_class_removed: "No longer makes statistics – old statistics are left",
    units_changed: "The unit changed from {from} to {to}",
    mean_type_changed: "The kind of average changed",
  },
  vfix: { clear: "Delete old statistics", convert: "Convert to {to}", open: "Open in Home Assistant" },
  clearWarn: "Deleting statistics can't be undone.",
  unaccounted: "Use that no device explains",
  unaccountedText: "{p} of your grid use the last {d} days doesn't come from a device in Energy.",
  unaccountedOk: "The devices in Energy explain your grid use well.",
  addMeters: "Energy meters you can add",
  add: "Add {n}",
  addedN: "{n} added to Energy",
  dataTitle: "Takes up the most",
  filters: { all: "All", clean: "Can be cleaned", used: "Used", deleted: "Deleted" },
  search: "Search",
  status: { clean: "Can be cleaned", busy: "Saves a lot – can be lowered", used: "Used – keep", deleted: "Deleted" },
  usedIn: "Used in",
  unused: "Not used anywhere",
  rows: "{n} rows · {d} a day",
  nEntities: "{n} entities",
  signalsRow: "Signal strength",
  showMore: "Show more",
  remove: "Remove",
  stopSaving: "Stop saving",
  stopAdded: "Added to “Stop saving”",
  ratesTitle: "Save less often",
  ratesIntro: "Zigbee2MQTT devices with only sensors can send less often. Lights, plugs, buttons, motion and door sensors are never slowed down, and anything an automation or graph uses never goes below Normal.",
  profile: "Profile for the whole house",
  profiles: { sparse: "Sparse", balanced: "Balanced", detailed: "Detailed" },
  rgroups: { climate: "Temperature and climate", meters: "Energy meters", sensors: "Other sensors" },
  levels: { often: "Often", normal: "Normal", rare: "Rarely", mixed: "Mixed", group: "Like the group", never: "Never touch" },
  levelHelp: { often: "every change", normal: "at most every 30 s", rare: "at most every 5 min", mixed: "devices differ" },
  nDevices: "{n} devices",
  perMonth: "−{n} a month",
  devicesShow: "Each device",
  signals: "Signal strength (linkquality)",
  signalsText: "{n} of them are used nowhere and can be switched off.",
  on: "On", off: "Off",
  noZ2m: "No Zigbee2MQTT sensor devices found. Other devices can't be slowed down from here – use “Stop saving” on the Data tab.",
  applyRates: "Save",
  ratesDone: "{d} devices and {s} signals changed",
  whyNot: "Why not these?",
  reasons: { instant: "Has {d} – must react at once", not_z2m: "Not Zigbee2MQTT ({d})" },
  retention: "How long details are kept",
  retentionIntro: "Graphs and hourly statistics always stay. Only the second-by-second detail is removed every night. Entities a graph or history helper uses are never touched.",
  keepAll: "All",
  keepDays: "{n} days",
  autoNew: "New devices get the same automatically",
  notifyEnergy: "Tell me about new wrong numbers in Energy",
  weekly: "Weekly report (Mondays)",
  notifications: "Notifications",
  stopList: "Stop saving",
  stopListIntro: "Energy Doctor never changes your YAML. Add these lines to configuration.yaml yourself and restart:",
  stopListEmpty: "Nothing yet. Tap “Stop saving” on the Data tab.",
  copy: "Copy", copied: "Copied",
  aiTitle: "AI",
  aiHint: "Pick an AI under Settings → Devices & services → Energy Doctor → Configure to have your database explained.",
  explain: "Explain my database",
  explaining: "The AI is thinking …",
  cleanTitle: "Clean up",
  cleanIntro: "This is removed with Home Assistant's own clean-up:",
  cleanDeleted: "All history of {n} deleted devices",
  cleanTrim: "History older than {k} days of {n} busy entities that nothing uses",
  cleanWarn: "Removed data can't be undone.",
  backupFirst: "Make a backup first (Home Assistant's own backup)",
  makeBackup: "Make a backup",
  cleanDo: "Clean up · save {n}",
  cleanDone: "Cleaned up",
  recent: "Recently",
  recEnergy: "{n} hours fixed in Energy",
  recClean: "History removed for {n} entities",
  recSaved: "the database is {n} smaller since",
  recRates: "Save less often: {n} changes",
  recDevices: "{n} meters added to Energy",
  undo: "Undo", undone: "Undone",
  back: "Back", home: "Done",
  error: "Something went wrong: {e}",
  saved: "Saved",
};

const DA = {
  score: "Sundhed",
  grades: {"great": "Rigtig god", "good": "God", "fair": "Kan blive bedre", "poor": "Trænger til hjælp"},
  scoreOf: "{n} af 100",
  todo: "Det kan du gøre",
  actEnergy: "Ret {n} forkerte tal i Energi",
  actClean: "Ryd op og spar {n}",
  actRates: "Gem sjældnere – spar {n} om måneden",
  actValidation: "Ryd op i gammel statistik",
  actHealth: "Se sundhedstjekket",
  allGood: "Alt ser godt ud",
  allGoodText: "Ingen forkerte tal i Energi og intet at rydde op. Kig forbi igen om en uge.",
  statSize: "Størrelse",
  statGrowth: "Vokser pr. dag",
  statDisk: "Disk fuld om",
  statNever: "ikke snart",
  w1t: "Velkommen til Energi-doktor",
  w1: "Den finder forkerte tal i Energi-dashboardet og viser, hvad der fylder i din database – og hvordan den holdes lille.",
  w2t: "Altid sikkert",
  w2: "Den bruger kun Home Assistants egne funktioner, og det, der bruges, bliver aldrig rørt.",
  w3t: "Det kan fortrydes",
  w3: "Rettelser og indstillinger kan fortrydes, og før en oprydning kan den tage en backup.",
  next: "Næste",
  start: "Kom i gang",
  skip: "Spring over",
  help: {"history": "Historik er alle de målinger, Home Assistant gemmer, fx hvert 10. sekund. Statistik er gennemsnit pr. time, som lange grafer bruger – den bliver altid.", "trim": "Når kun få dages historik gemmes, forsvinder sekund-for-sekund-detaljerne. Grafer, Energi og timeværdier påvirkes ikke.", "protect": "“Rør aldrig” holder en entitet ude af alle forslag – nyttigt, når kode uden for Home Assistant (fx AppDaemon) læser dens historik.", "rates": "Zigbee-enheder kan sende sjældnere. Kun enheder med rene sensorer sættes ned, og det, der bruges, kommer aldrig under Normal.", "validation": "Home Assistant gemmer statistik for sensorer. Når en sensor omdøbes eller fjernes, bliver dens gamle statistik liggende og kan ryddes."},
  energyAllGood: "Alt er i orden i Energi",
  snackUndo: "Fortryd",
  vinfo: "Ufarligt: deres historik er slået fra med vilje. Home Assistant bliver ved med at advare, så længe sensoren laver statistik – der er ingen gammel statistik tilbage at slette.",
  keepRule: "Hold det sådan – de beholder kun {k} dage fremover (tjekkes hver nat)",
  keptPill: "Beholder {k} dage",
  unkeep: "Behold alt igen",
  repackAfter: "Gør filen mindre, når den er færdig",
  recFreed: "≈ {n} frigivet i databasen",
  recRepacking: "filen gøres mindre …",
  recSmaller: "filen er {n} mindre",
  recNoRoom: "for lidt fri plads på disken til at gøre filen mindre",
  repackNow: "Gør filen mindre",
  cleaningTitle: "Oprydning i gang · {p} %",
  cleaningText: "Home Assistant arbejder i baggrunden – på en stor database kan det tage en time. Genstart helst ikke Home Assistant imens (gør du, fortsætter den bagefter).",
  cleanDoneText: "Home Assistant fjerner det nu i baggrunden. På en stor database kan det tage en time – følg med på Overblik. Genstarter Home Assistant imens, fortsætter den bagefter.",
  cleanWhat: "{t} entiteter beholder de sidste {k} dage, og {d} slettede enheder ryddes væk.",
  cleanWhatTrim: "{t} entiteter beholder de sidste {k} dage.",
  cleanWhatDeleted: "{d} slettede enheder ryddes væk.",
  safeTitle: "Derfor er det sikkert",
  safe1: "Ingen grafer, Energi-dashboardet eller historik-hjælpere bruger dem",
  safe2: "Automationer og templates bruger kun den nuværende værdi – den bliver",
  safe3: "Timeværdier og statistik bliver, så lange grafer virker stadig",
  safe4: "{n} entiteter med “Rør aldrig” bliver ikke rørt",
  seeWhat: "Se hvad der ryddes ({n})",
  whyGone: "Findes ikke længere",
  whyUnused: "Bruges ingen steder",
  whyValue: "Kun den nuværende værdi bruges: {list}",
  st2: {"history": "Historik bruges – behold", "value": "Bruges – kun værdien", "value_busy": "Bruges – gammel historik kan ryddes", "protected": "Rør aldrig"},
  protectOn: "Rør aldrig",
  protectOff: "Må røres igen",
  trimRow: "Ryd gammel historik",
  historyTag: "historik",
  unseen: "Energi-doktor kan ikke se filerne fra {list}. Læser de historik, så markér de entiteter som “Rør aldrig”.",
  outsideRead: "Læser også: {list}",
  stopDone: "{s} stoppet ved kilden i Zigbee2MQTT",
  stopListed: "{l} lagt på listen “Stop med at gemme”",
  recFilter: "Gem ikke: {n} værdier stoppet i Zigbee2MQTT",
  lower: "Sæt ned",
  busyOnly: "Gemmer meget",
  loweredOne: "{n} gemmer sjældnere nu",
  vgroups: {"no_state": "{n} entiteter findes ikke længere", "entity_no_longer_recorded": "{n} entiteter gemmes ikke længere", "entity_not_recorded": "{n} entiteter gemmes ikke", "state_class_removed": "{n} entiteter har ikke længere en state class"},
  vexplain: {"no_state": "Gamle navne fra enheder, der er omdøbt eller parret igen. Deres gamle statistik ligger stadig i databasen.", "entity_no_longer_recorded": "De er slået fra i recorderen (af dig eller en integration). Statistikken fra før ligger der stadig.", "entity_not_recorded": "De er slået fra i recorderen. Statistikken fra før ligger der stadig.", "state_class_removed": "De giver ikke længere statistik. Statistikken fra før ligger der stadig."},
  vclearAll: "Slet gammel statistik for alle {n}",
  vshow: "Vis dem",
  vnotEnergy: "Ingen af dem bruges i Energi-dashboardet.",
  vinEnergy: "{n} af dem bruges i Energi-dashboardet – behold dem.",
  sizeUnknown: "Størrelsen kunne ikke læses fra databaseserveren – resten virker på samme måde.",
  updated: "Opdateret {n}",
  agoNow: "lige nu",
  agoMin: "for {n} min. siden",
  agoHour: "for {n} t. siden",
  refreshing: "Opdaterer …",
  backupWorking: "Laver en backup …",
  backupHint: "Home Assistants egen backup – det kan tage nogle minutter på en stor installation.",
  cleaning: "Rydder op …",
  provisional: "Første skøn ud fra de første timer – det bliver mere præcist efter et par dage.",
  title: "Energi-doktor",
  tabs: { overview: "Overblik", energy: "Energi", data: "Data", settings: "Indstillinger" },
  working: "Kigger databasen igennem …",
  workingHint: "En stor database tager et minut.",
  fresh: "Tjek igen",
  perDay: "+{n} om dagen",
  healthy: "Din database er sund.",
  growing: "Din database vokser {n} om dagen.",
  diskFull: "Disken er fuld om ca. {n}.",
  months: "{n} måneder", years: "{n} år", days: "{n} dage",
  groups: { sensors: "Sensorer", energy: "Energi", lights: "Lys", signals: "Signaler", other: "Andet" },
  graphTitle: "Størrelse over tid",
  graphNow: "Nu", graphAsIs: "Hvis du ikke gør noget", graphOptimised: "Efter Optimer",
  graphFew: "Grafen fyldes ud dag for dag.",
  ratesCard: "Gem sjældnere",
  ratesNone: "Ikke sat op – alt gemmes så tit, det kan.",
  ratesProfile: "Profil: {p}",
  ratesCustom: "Dine egne valg",
  ratesSave: "Kan spare {n} om måneden",
  change: "Skift",
  suggestion: "Forslag",
  save: "Spar {n}",
  saveText: "{d} slettede enheder har stadig historik, og {t} travle entiteter, som intet bruger, beholder {k} dage i stedet for det hele.",
  nothingToSave: "Intet at rydde op – flot holdt!",
  cleanup: "Ryd op",
  health: "Sundhedstjek",
  healthItems: {
    sd_card: "Databasen ligger på et SD-kort. SD-kort slides af mange skrivninger – overvej en SSD.",
    big: "Databasen fylder {size}. Det gør opstart og backup af Home Assistant langsom.",
    keep_days: "Recorderen gemmer {days} dages historik (purge_keep_days).",
    no_auto_purge: "Automatisk oprydning (auto_purge) er slået fra, så databasen bare vokser.",
    no_auto_repack: "Automatisk komprimering er slået fra, så filen bliver ikke mindre efter oprydning.",
    backup: "Seneste backup: {size} ({date}).",
  },
  energyErrors: "Fejl i Energi",
  found: "{n} fundet",
  noErrors: "Ingen forkerte tal de sidste 120 dage.",
  fix: "Ret", fill: "Udfyld",
  spike: "{v} {u} på én time – normalt er {e}",
  negative: "{v} {u} – en time kan ikke være negativ",
  gap: "Måleren var væk i {m} timer – {v} {u} kom på én gang",
  causeUnavailable: "Måleren var utilgængelig lige før – det giver tit et spring.",
  causeZero: "Måleren gik til 0 lige før (fx ved en genstart) og startede forfra.",
  costNote: "Prisen for samme time rettes med.",
  energyIntro: "Hver time sættes til det normale for måleren, med Home Assistants egen “Juster sum”. Det kan fortrydes.",
  fixN: "Ret {n}",
  fixedN: "{n} timer rettet",
  validation: "Advarsler om statistik",
  validationNone: "Home Assistant har ingen advarsler om din statistik.",
  vtypes: {
    entity_no_longer_recorded: "Gemmes ikke længere – gammel statistik er tilbage",
    entity_not_recorded: "Gemmes ikke – gammel statistik er tilbage",
    no_state: "Entiteten findes ikke længere – gammel statistik er tilbage",
    state_class_removed: "Laver ikke længere statistik – gammel statistik er tilbage",
    units_changed: "Enheden er skiftet fra {from} til {to}",
    mean_type_changed: "Typen af gennemsnit er ændret",
  },
  vfix: { clear: "Slet gammel statistik", convert: "Omregn til {to}", open: "Åbn i Home Assistant" },
  clearWarn: "Sletning af statistik kan ikke fortrydes.",
  unaccounted: "Forbrug, ingen enhed forklarer",
  unaccountedText: "{p} af dit forbrug fra nettet de sidste {d} dage kommer ikke fra en enhed i Energi.",
  unaccountedOk: "Enhederne i Energi forklarer dit forbrug godt.",
  addMeters: "Energimålere, du kan tilføje",
  add: "Tilføj {n}",
  addedN: "{n} tilføjet til Energi",
  dataTitle: "Fylder mest",
  filters: { all: "Alle", clean: "Kan ryddes", used: "Bruges", deleted: "Slettede" },
  search: "Søg",
  status: { clean: "Kan ryddes", busy: "Gemmer meget – kan sættes ned", used: "Bruges – behold", deleted: "Slettet" },
  usedIn: "Bruges i",
  unused: "Bruges ingen steder",
  rows: "{n} rækker · {d} om dagen",
  nEntities: "{n} entiteter",
  signalsRow: "Signalstyrke",
  showMore: "Vis flere",
  remove: "Fjern",
  stopSaving: "Gem ikke",
  stopAdded: "Lagt på listen “Stop med at gemme”",
  ratesTitle: "Gem sjældnere",
  ratesIntro: "Zigbee2MQTT-enheder med kun sensorer kan sende sjældnere. Lys, stik, knapper, bevægelses- og dørsensorer bliver aldrig sat ned, og det, en automation eller graf bruger, kommer aldrig under Normal.",
  profile: "Profil for hele huset",
  profiles: { sparse: "Sparsom", balanced: "Balanceret", detailed: "Detaljeret" },
  rgroups: { climate: "Temperatur og klima", meters: "Energimålere", sensors: "Andre sensorer" },
  levels: { often: "Ofte", normal: "Normal", rare: "Sjældent", mixed: "Blandet", group: "Som gruppen", never: "Rør aldrig" },
  levelHelp: { often: "hver ændring", normal: "højst hvert 30. sek.", rare: "højst hvert 5. min.", mixed: "enhederne er forskellige" },
  nDevices: "{n} enheder",
  perMonth: "−{n} om måneden",
  devicesShow: "Hver enhed",
  signals: "Signalstyrke (linkquality)",
  signalsText: "{n} af dem bruges ingen steder og kan slås fra.",
  on: "Til", off: "Fra",
  noZ2m: "Ingen Zigbee2MQTT-sensorer fundet. Andre enheder kan ikke sættes ned herfra – brug “Gem ikke” på fanen Data.",
  applyRates: "Gem",
  ratesDone: "{d} enheder og {s} signaler ændret",
  whyNot: "Hvorfor ikke disse?",
  reasons: { instant: "Har {d} – skal reagere med det samme", not_z2m: "Ikke Zigbee2MQTT ({d})" },
  retention: "Hvor længe detaljer gemmes",
  retentionIntro: "Grafer og timeværdier bliver altid. Kun sekund-for-sekund-detaljerne fjernes hver nat. Entiteter, som en graf eller historik-hjælper bruger, røres aldrig.",
  keepAll: "Alt",
  keepDays: "{n} dage",
  autoNew: "Nye enheder får automatisk det samme",
  notifyEnergy: "Giv besked om nye fejl i Energi",
  weekly: "Ugentlig rapport (mandag)",
  notifications: "Beskeder",
  stopList: "Stop med at gemme",
  stopListIntro: "Energi-doktor ændrer aldrig din YAML. Sæt selv disse linjer ind i configuration.yaml, og genstart:",
  stopListEmpty: "Intet endnu. Tryk “Gem ikke” på fanen Data.",
  copy: "Kopiér", copied: "Kopieret",
  aiTitle: "AI",
  aiHint: "Vælg en AI under Indstillinger → Enheder og tjenester → Energy Doctor → Konfigurer, så kan den forklare din database.",
  explain: "Forklar min database",
  explaining: "AI'en tænker …",
  cleanTitle: "Ryd op",
  cleanIntro: "Dette fjernes med Home Assistants egen oprydning:",
  cleanDeleted: "Al historik fra {n} slettede enheder",
  cleanTrim: "Historik ældre end {k} dage fra {n} travle entiteter, som intet bruger",
  cleanWarn: "Slettede data kan ikke fortrydes.",
  backupFirst: "Lav en backup først (Home Assistants egen backup)",
  makeBackup: "Lav en backup",
  cleanDo: "Ryd op · spar {n}",
  cleanDone: "Ryddet op",
  recent: "Seneste",
  recEnergy: "{n} timer rettet i Energi",
  recClean: "Historik fjernet for {n} entiteter",
  recSaved: "databasen er {n} mindre siden",
  recRates: "Gem sjældnere: {n} ændringer",
  recDevices: "{n} målere tilføjet til Energi",
  undo: "Fortryd", undone: "Fortrudt",
  back: "Tilbage", home: "Færdig",
  error: "Noget gik galt: {e}",
  saved: "Gemt",
};

const DE = {
  score: "Gesundheit",
  grades: {"great": "Sehr gut", "good": "Gut", "fair": "Geht besser", "poor": "Braucht Hilfe"},
  scoreOf: "{n} von 100",
  todo: "Das kannst du tun",
  actEnergy: "{n} falsche Werte in Energie korrigieren",
  actClean: "Aufräumen und {n} sparen",
  actRates: "Seltener speichern – {n} pro Monat sparen",
  actValidation: "Alte Statistik aufräumen",
  actHealth: "Gesundheitscheck ansehen",
  allGood: "Alles sieht gut aus",
  allGoodText: "Keine falschen Werte in Energie und nichts aufzuräumen. Schau in einer Woche wieder vorbei.",
  statSize: "Größe",
  statGrowth: "Wächst pro Tag",
  statDisk: "Speicher voll in",
  statNever: "nicht bald",
  w1t: "Willkommen beim Energie-Doktor",
  w1: "Er findet falsche Werte im Energie-Dashboard und zeigt, was deine Datenbank füllt – und wie sie klein bleibt.",
  w2t: "Immer sicher",
  w2: "Er nutzt nur Home Assistants eigene Funktionen, und was genutzt wird, bleibt unberührt.",
  w3t: "Alles rückgängig machbar",
  w3: "Korrekturen und Einstellungen lassen sich rückgängig machen, und vor dem Aufräumen kann er ein Backup machen.",
  next: "Weiter",
  start: "Los geht's",
  skip: "Überspringen",
  help: {"history": "Verlauf sind alle Werte, die Home Assistant speichert, z. B. alle 10 Sekunden. Statistik sind Stundenmittel für lange Grafiken – sie bleibt immer.", "trim": "Werden nur wenige Tage Verlauf behalten, verschwinden die sekundengenauen Details. Grafiken, Energie und Stundenwerte bleiben.", "protect": "„Nie anfassen“ hält eine Entität aus allen Vorschlägen heraus – nützlich, wenn Code außerhalb von Home Assistant (z. B. AppDaemon) ihren Verlauf liest.", "rates": "Zigbee-Geräte können seltener senden. Nur Geräte mit reinen Sensoren werden gebremst, und was genutzt wird, geht nie unter Normal.", "validation": "Home Assistant speichert Statistik für Sensoren. Wird ein Sensor umbenannt oder entfernt, bleibt seine alte Statistik übrig und kann gelöscht werden."},
  energyAllGood: "In Energie ist alles in Ordnung",
  snackUndo: "Rückgängig",
  vinfo: "Harmlos: Sie sind absichtlich im Recorder ausgeschlossen. Home Assistant warnt, solange der Sensor eine State-Class hat – es gibt keine alte Statistik mehr zu löschen.",
  keepRule: "So beibehalten – künftig nur {k} Tage behalten (jede Nacht geprüft)",
  keptPill: "Behält {k} Tage",
  unkeep: "Wieder alles behalten",
  repackAfter: "Datei danach verkleinern (komprimieren)",
  recFreed: "≈ {n} in der Datenbank freigegeben",
  recRepacking: "die Datei wird verkleinert …",
  recSmaller: "die Datei ist {n} kleiner",
  recNoRoom: "zu wenig freier Speicher zum Verkleinern",
  repackNow: "Datei verkleinern",
  cleaningTitle: "Aufräumen läuft · {p} %",
  cleaningText: "Der Recorder arbeitet im Hintergrund – bei einer großen Datenbank kann das eine Stunde dauern. Starte Home Assistant möglichst nicht neu (sonst geht es danach weiter).",
  cleanDoneText: "Der Recorder entfernt es jetzt im Hintergrund. Bei einer großen Datenbank kann das eine Stunde dauern – verfolge es in der Übersicht. Bei einem Neustart geht es danach weiter.",
  cleanWhat: "{t} Entitäten behalten die letzten {k} Tage, und {d} gelöschte Geräte werden aufgeräumt.",
  cleanWhatTrim: "{t} Entitäten behalten die letzten {k} Tage.",
  cleanWhatDeleted: "{d} gelöschte Geräte werden aufgeräumt.",
  safeTitle: "Warum das sicher ist",
  safe1: "Keine Grafik, kein Energie-Dashboard und kein Verlaufshelfer nutzt sie",
  safe2: "Automationen und Templates nutzen nur den aktuellen Wert – der bleibt",
  safe3: "Stundenwerte und Statistik bleiben, lange Grafiken funktionieren weiter",
  safe4: "{n} Entitäten mit „Nie anfassen“ bleiben unberührt",
  seeWhat: "Ansehen, was aufgeräumt wird ({n})",
  whyGone: "Gibt es nicht mehr",
  whyUnused: "Wird nirgends genutzt",
  whyValue: "Nur der aktuelle Wert wird genutzt: {list}",
  st2: {"history": "Verlauf genutzt – behalten", "value": "Genutzt – nur der Wert", "value_busy": "Genutzt – alter Verlauf kann weg", "protected": "Nie anfassen"},
  protectOn: "Nie anfassen",
  protectOff: "Wieder erlauben",
  trimRow: "Alten Verlauf löschen",
  historyTag: "Verlauf",
  unseen: "Energie-Doktor kann die Dateien von {list} nicht sehen. Lesen sie Verlauf, markiere diese Entitäten mit „Nie anfassen“.",
  outsideRead: "Liest auch: {list}",
  stopDone: "{s} an der Quelle in Zigbee2MQTT gestoppt",
  stopListed: "{l} auf die Liste „Nicht mehr speichern“ gesetzt",
  recFilter: "Nicht speichern: {n} Werte in Zigbee2MQTT gestoppt",
  lower: "Reduzieren",
  busyOnly: "Speichert viel",
  loweredOne: "{n} speichert jetzt seltener",
  vgroups: {"no_state": "{n} Entitäten gibt es nicht mehr", "entity_no_longer_recorded": "{n} Entitäten werden nicht mehr aufgezeichnet", "entity_not_recorded": "{n} Entitäten werden nicht aufgezeichnet", "state_class_removed": "{n} Entitäten haben keine State-Class mehr"},
  vexplain: {"no_state": "Alte Namen von Geräten, die umbenannt oder neu gekoppelt wurden. Ihre alte Statistik liegt noch in der Datenbank.", "entity_no_longer_recorded": "Sie sind im Recorder ausgeschlossen (von dir oder einer Integration). Die Statistik von vorher ist noch da.", "entity_not_recorded": "Sie sind im Recorder ausgeschlossen. Die Statistik von vorher ist noch da.", "state_class_removed": "Sie liefern keine Statistik mehr. Die Statistik von vorher ist noch da."},
  vclearAll: "Alte Statistik für alle {n} löschen",
  vshow: "Anzeigen",
  vnotEnergy: "Keine davon wird im Energie-Dashboard genutzt.",
  vinEnergy: "{n} davon werden im Energie-Dashboard genutzt – behalte diese.",
  sizeUnknown: "Die Größe konnte nicht vom Datenbankserver gelesen werden – der Rest funktioniert gleich.",
  updated: "Aktualisiert {n}",
  agoNow: "gerade eben",
  agoMin: "vor {n} Min.",
  agoHour: "vor {n} Std.",
  refreshing: "Wird aktualisiert …",
  backupWorking: "Backup wird erstellt …",
  backupHint: "Home Assistants eigenes Backup – das kann bei einer großen Installation ein paar Minuten dauern.",
  cleaning: "Wird aufgeräumt …",
  provisional: "Erste Schätzung aus den ersten Stunden – nach ein paar Tagen wird sie genauer.",
  title: "Energie-Doktor",
  tabs: { overview: "Übersicht", energy: "Energie", data: "Daten", settings: "Einstellungen" },
  working: "Die Datenbank wird durchgesehen …", workingHint: "Eine große Datenbank dauert eine Minute.",
  fresh: "Erneut prüfen", perDay: "+{n} pro Tag", healthy: "Deine Datenbank ist gesund.",
  growing: "Deine Datenbank wächst um {n} pro Tag.", diskFull: "Der Speicher ist in etwa {n} voll.",
  months: "{n} Monaten", years: "{n} Jahren", days: "{n} Tagen",
  groups: { sensors: "Sensoren", energy: "Energie", lights: "Licht", signals: "Signale", other: "Sonstiges" },
  graphTitle: "Größe im Zeitverlauf", graphNow: "Jetzt", graphAsIs: "Wenn du nichts tust", graphOptimised: "Nach Optimieren",
  graphFew: "Die Grafik füllt sich Tag für Tag.",
  ratesCard: "Seltener speichern", ratesNone: "Nicht eingerichtet – alles speichert so oft es kann.",
  ratesProfile: "Profil: {p}", ratesCustom: "Eigene Auswahl", ratesSave: "Kann {n} pro Monat sparen", change: "Ändern",
  suggestion: "Vorschlag", save: "{n} sparen",
  saveText: "{d} gelöschte Geräte haben noch Verlauf, und {t} aktive Entitäten, die nichts nutzt, behalten {k} Tage statt allem.",
  nothingToSave: "Nichts aufzuräumen – gut gepflegt!", cleanup: "Aufräumen", health: "Gesundheitscheck",
  healthItems: {
    sd_card: "Die Datenbank liegt auf einer SD-Karte. SD-Karten verschleißen durch viele Schreibvorgänge – erwäge eine SSD.",
    big: "Die Datenbank ist {size} groß. Das macht Start und Backup von Home Assistant langsam.",
    keep_days: "Der Recorder behält {days} Tage Verlauf (purge_keep_days).",
    no_auto_purge: "Automatisches Aufräumen (auto_purge) ist aus, die Datenbank wächst nur.",
    no_auto_repack: "Automatisches Komprimieren ist aus, die Datei wird nach dem Aufräumen nicht kleiner.",
    backup: "Letztes Backup: {size} ({date}).",
  },
  energyErrors: "Falsche Werte in Energie", found: "{n} gefunden", noErrors: "Keine falschen Werte in den letzten 120 Tagen.",
  fix: "Korrigieren", fill: "Auffüllen",
  spike: "{v} {u} in einer Stunde – normal sind {e}", negative: "{v} {u} – eine Stunde kann nicht negativ sein",
  gap: "Der Zähler war {m} Stunden weg – {v} {u} kamen auf einmal",
  causeUnavailable: "Der Zähler war kurz davor nicht verfügbar – das gibt oft einen Sprung.",
  causeZero: "Der Zähler ging kurz davor auf 0 (z. B. bei einem Neustart) und begann neu.",
  costNote: "Der Preis derselben Stunde wird mit korrigiert.",
  energyIntro: "Jede Stunde wird auf den normalen Wert des Zählers gesetzt, mit Home Assistants eigenem „Summe anpassen“. Rückgängig machbar.",
  fixN: "{n} korrigieren", fixedN: "{n} Stunden korrigiert",
  validation: "Statistik-Warnungen", validationNone: "Home Assistant hat keine Warnungen zu deiner Statistik.",
  vtypes: {
    entity_no_longer_recorded: "Wird nicht mehr aufgezeichnet – alte Statistik ist übrig",
    entity_not_recorded: "Wird nicht aufgezeichnet – alte Statistik ist übrig",
    no_state: "Die Entität ist weg – alte Statistik ist übrig",
    state_class_removed: "Hat keine State-Class mehr – alte Statistik ist übrig",
    units_changed: "Die Einheit wechselte von {from} zu {to}", mean_type_changed: "Die Art des Mittelwerts hat sich geändert",
  },
  vfix: { clear: "Alte Statistik löschen", convert: "In {to} umrechnen", open: "In Home Assistant öffnen" },
  clearWarn: "Das Löschen von Statistik kann nicht rückgängig gemacht werden.",
  unaccounted: "Verbrauch, den kein Gerät erklärt",
  unaccountedText: "{p} deines Netzbezugs der letzten {d} Tage kommt von keinem Gerät in Energie.",
  unaccountedOk: "Die Geräte in Energie erklären deinen Verbrauch gut.",
  addMeters: "Energiezähler, die du hinzufügen kannst", add: "{n} hinzufügen", addedN: "{n} zu Energie hinzugefügt",
  dataTitle: "Belegt am meisten",
  filters: { all: "Alle", clean: "Aufräumbar", used: "Genutzt", deleted: "Gelöscht" }, search: "Suchen",
  status: { clean: "Aufräumbar", busy: "Speichert viel – kann reduziert werden", used: "Genutzt – behalten", deleted: "Gelöscht" },
  usedIn: "Genutzt in", unused: "Wird nirgends genutzt", rows: "{n} Zeilen · {d} pro Tag", nEntities: "{n} Entitäten",
  signalsRow: "Signalstärke", showMore: "Mehr anzeigen", remove: "Entfernen", stopSaving: "Nicht speichern",
  stopAdded: "Zu „Nicht mehr speichern“ hinzugefügt",
  ratesTitle: "Seltener speichern",
  ratesIntro: "Zigbee2MQTT-Geräte mit nur Sensoren können seltener senden. Licht, Steckdosen, Taster, Bewegungs- und Türsensoren werden nie gebremst, und was eine Automation oder Grafik nutzt, geht nie unter Normal.",
  profile: "Profil für das ganze Haus", profiles: { sparse: "Sparsam", balanced: "Ausgewogen", detailed: "Detailliert" },
  rgroups: { climate: "Temperatur und Klima", meters: "Energiezähler", sensors: "Andere Sensoren" },
  levels: { often: "Oft", normal: "Normal", rare: "Selten", mixed: "Gemischt", group: "Wie die Gruppe", never: "Nie anfassen" },
  levelHelp: { often: "jede Änderung", normal: "höchstens alle 30 s", rare: "höchstens alle 5 min", mixed: "Geräte unterschiedlich" },
  nDevices: "{n} Geräte", perMonth: "−{n} pro Monat", devicesShow: "Jedes Gerät",
  signals: "Signalstärke (linkquality)", signalsText: "{n} davon werden nirgends genutzt und können aus.", on: "An", off: "Aus",
  noZ2m: "Keine Zigbee2MQTT-Sensoren gefunden. Andere Geräte lassen sich hier nicht bremsen – nutze „Nicht speichern“ im Tab Daten.",
  applyRates: "Speichern", ratesDone: "{d} Geräte und {s} Signale geändert",
  whyNot: "Warum nicht diese?", reasons: { instant: "Hat {d} – muss sofort reagieren", not_z2m: "Nicht Zigbee2MQTT ({d})" },
  retention: "Wie lange Details bleiben",
  retentionIntro: "Grafiken und Stundenwerte bleiben immer. Nur die sekundengenauen Details werden jede Nacht entfernt. Entitäten, die eine Grafik oder ein Verlaufshelfer nutzt, bleiben unberührt.",
  keepAll: "Alles", keepDays: "{n} Tage", autoNew: "Neue Geräte bekommen automatisch dasselbe",
  notifyEnergy: "Über neue falsche Werte in Energie informieren", weekly: "Wochenbericht (montags)", notifications: "Benachrichtigungen",
  stopList: "Nicht mehr speichern",
  stopListIntro: "Energie-Doktor ändert nie dein YAML. Füge diese Zeilen selbst in configuration.yaml ein und starte neu:",
  stopListEmpty: "Noch nichts. Tippe „Nicht speichern“ im Tab Daten.", copy: "Kopieren", copied: "Kopiert",
  aiTitle: "KI", aiHint: "Wähle eine KI unter Einstellungen → Geräte & Dienste → Energy Doctor → Konfigurieren.",
  explain: "Meine Datenbank erklären", explaining: "Die KI denkt nach …",
  cleanTitle: "Aufräumen", cleanIntro: "Das wird mit dem eigenen Aufräumen des Recorders entfernt:",
  cleanDeleted: "Der ganze Verlauf von {n} gelöschten Geräten", cleanTrim: "Verlauf älter als {k} Tage von {n} aktiven Entitäten, die nichts nutzt",
  cleanWarn: "Entfernte Daten lassen sich nicht wiederherstellen.", backupFirst: "Vorher ein Backup machen (Home Assistants eigenes)",
  makeBackup: "Backup machen", cleanDo: "Aufräumen · {n} sparen", cleanDone: "Aufgeräumt",
  recent: "Zuletzt", recEnergy: "{n} Stunden in Energie korrigiert", recClean: "Verlauf für {n} Entitäten entfernt",
  recSaved: "die Datenbank ist seitdem {n} kleiner", recRates: "Seltener speichern: {n} Änderungen", recDevices: "{n} Zähler zu Energie hinzugefügt",
  undo: "Rückgängig", undone: "Rückgängig gemacht", back: "Zurück", home: "Fertig", error: "Etwas ging schief: {e}", saved: "Gespeichert",
};

const SV = {
  score: "Hälsa",
  grades: {"great": "Mycket bra", "good": "Bra", "fair": "Kan bli bättre", "poor": "Behöver hjälp"},
  scoreOf: "{n} av 100",
  todo: "Det här kan du göra",
  actEnergy: "Rätta {n} felaktiga värden i Energi",
  actClean: "Städa och spara {n}",
  actRates: "Spara mer sällan – spara {n} per månad",
  actValidation: "Rensa gammal statistik",
  actHealth: "Se hälsokontrollen",
  allGood: "Allt ser bra ut",
  allGoodText: "Inga felaktiga värden i Energi och inget att städa. Titta in igen om en vecka.",
  statSize: "Storlek",
  statGrowth: "Växer per dag",
  statDisk: "Disken full om",
  statNever: "inte snart",
  w1t: "Välkommen till Energidoktorn",
  w1: "Den hittar felaktiga värden i energipanelen och visar vad som fyller din databas – och hur den hålls liten.",
  w2t: "Alltid säkert",
  w2: "Den använder bara Home Assistants egna funktioner, och det som används rörs aldrig.",
  w3t: "Det kan ångras",
  w3: "Rättelser och inställningar kan ångras, och före en städning kan den göra en säkerhetskopia.",
  next: "Nästa",
  start: "Kom igång",
  skip: "Hoppa över",
  help: {"history": "Historik är alla värden Home Assistant sparar, t.ex. var 10:e sekund. Statistik är timmedelvärden som långa grafer använder – den finns alltid kvar.", "trim": "När bara några dagars historik sparas försvinner detaljerna sekund för sekund. Grafer, Energi och timvärden påverkas inte.", "protect": "”Rör aldrig” håller en entitet utanför alla förslag – bra när kod utanför Home Assistant (t.ex. AppDaemon) läser dess historik.", "rates": "Zigbee-enheter kan skicka mer sällan. Bara enheter med enbart sensorer sänks, och det som används går aldrig under Normal.", "validation": "Home Assistant sparar statistik för sensorer. När en sensor byter namn eller tas bort ligger den gamla statistiken kvar och kan rensas."},
  energyAllGood: "Allt är i ordning i Energi",
  snackUndo: "Ångra",
  vinfo: "Ofarligt: de är undantagna i recordern med flit. Home Assistant fortsätter varna så länge sensorn har en state class – det finns ingen gammal statistik kvar att ta bort.",
  keepRule: "Behåll så här – de behåller bara {k} dagar framöver (kontrolleras varje natt)",
  keptPill: "Behåller {k} dagar",
  unkeep: "Behåll allt igen",
  repackAfter: "Gör filen mindre när det är klart (komprimering)",
  recFreed: "≈ {n} frigjort i databasen",
  recRepacking: "filen görs mindre …",
  recSmaller: "filen är {n} mindre",
  recNoRoom: "för lite ledigt diskutrymme för att göra filen mindre",
  repackNow: "Gör filen mindre",
  cleaningTitle: "Städning pågår · {p} %",
  cleaningText: "Recordern arbetar i bakgrunden – på en stor databas kan det ta en timme. Undvik att starta om Home Assistant under tiden (gör du det fortsätter den efteråt).",
  cleanDoneText: "Recordern tar nu bort det i bakgrunden. På en stor databas kan det ta en timme – följ det på Översikt. Startar Home Assistant om under tiden fortsätter den efteråt.",
  cleanWhat: "{t} entiteter behåller de senaste {k} dagarna, och {d} borttagna enheter rensas bort.",
  cleanWhatTrim: "{t} entiteter behåller de senaste {k} dagarna.",
  cleanWhatDeleted: "{d} borttagna enheter rensas bort.",
  safeTitle: "Därför är det säkert",
  safe1: "Ingen graf, energipanelen eller historikhjälpare använder dem",
  safe2: "Automationer och mallar använder bara det nuvarande värdet – det finns kvar",
  safe3: "Timvärden och statistik finns kvar, så långa grafer fungerar fortfarande",
  safe4: "{n} entiteter med ”Rör aldrig” lämnas ifred",
  seeWhat: "Se vad som rensas ({n})",
  whyGone: "Finns inte längre",
  whyUnused: "Används ingenstans",
  whyValue: "Bara det nuvarande värdet används: {list}",
  st2: {"history": "Historik används – behåll", "value": "Används – bara värdet", "value_busy": "Används – gammal historik kan tas bort", "protected": "Rör aldrig"},
  protectOn: "Rör aldrig",
  protectOff: "Tillåt igen",
  trimRow: "Rensa gammal historik",
  historyTag: "historik",
  unseen: "Energidoktorn kan inte se filerna från {list}. Läser de historik, markera de entiteterna som ”Rör aldrig”.",
  outsideRead: "Läser också: {list}",
  stopDone: "{s} stoppade vid källan i Zigbee2MQTT",
  stopListed: "{l} lagda på listan ”Sluta spara”",
  recFilter: "Spara inte: {n} värden stoppade i Zigbee2MQTT",
  lower: "Sänk",
  busyOnly: "Sparar mycket",
  loweredOne: "{n} sparar mer sällan nu",
  vgroups: {"no_state": "{n} entiteter finns inte längre", "entity_no_longer_recorded": "{n} entiteter spelas inte längre in", "entity_not_recorded": "{n} entiteter spelas inte in", "state_class_removed": "{n} entiteter har inte längre en state class"},
  vexplain: {"no_state": "Gamla namn från enheter som bytt namn eller parats igen. Deras gamla statistik finns kvar i databasen.", "entity_no_longer_recorded": "De är undantagna i recordern (av dig eller en integration). Statistiken från tidigare finns kvar.", "entity_not_recorded": "De är undantagna i recordern. Statistiken från tidigare finns kvar.", "state_class_removed": "De ger inte längre statistik. Statistiken från tidigare finns kvar."},
  vclearAll: "Ta bort gammal statistik för alla {n}",
  vshow: "Visa dem",
  vnotEnergy: "Ingen av dem används i energipanelen.",
  vinEnergy: "{n} av dem används i energipanelen – behåll dem.",
  sizeUnknown: "Storleken kunde inte läsas från databasservern – resten fungerar likadant.",
  updated: "Uppdaterad {n}",
  agoNow: "nyss",
  agoMin: "för {n} min sedan",
  agoHour: "för {n} tim sedan",
  refreshing: "Uppdaterar …",
  backupWorking: "Gör en säkerhetskopia …",
  backupHint: "Home Assistants egen säkerhetskopia – det kan ta några minuter på en stor installation.",
  cleaning: "Städar …",
  provisional: "Första uppskattning från de första timmarna – den blir mer exakt efter ett par dagar.",
  title: "Energidoktorn",
  tabs: { overview: "Översikt", energy: "Energi", data: "Data", settings: "Inställningar" },
  working: "Går igenom databasen …", workingHint: "En stor databas tar en minut.",
  fresh: "Kontrollera igen", perDay: "+{n} per dag", healthy: "Din databas är frisk.",
  growing: "Din databas växer {n} per dag.", diskFull: "Disken är full om ungefär {n}.",
  months: "{n} månader", years: "{n} år", days: "{n} dagar",
  groups: { sensors: "Sensorer", energy: "Energi", lights: "Ljus", signals: "Signaler", other: "Övrigt" },
  graphTitle: "Storlek över tid", graphNow: "Nu", graphAsIs: "Om du inte gör något", graphOptimised: "Efter Optimera",
  graphFew: "Grafen fylls i dag för dag.",
  ratesCard: "Spara mer sällan", ratesNone: "Inte inställt – allt sparas så ofta det kan.",
  ratesProfile: "Profil: {p}", ratesCustom: "Egna val", ratesSave: "Kan spara {n} per månad", change: "Ändra",
  suggestion: "Förslag", save: "Spara {n}",
  saveText: "{d} borttagna enheter har fortfarande historik, och {t} aktiva entiteter som inget använder behåller {k} dagar i stället för allt.",
  nothingToSave: "Inget att städa – välskött!", cleanup: "Städa", health: "Hälsokontroll",
  healthItems: {
    sd_card: "Databasen ligger på ett SD-kort. SD-kort slits av många skrivningar – överväg en SSD.",
    big: "Databasen är {size}. Det gör start och säkerhetskopiering av Home Assistant långsam.",
    keep_days: "Recordern sparar {days} dagars historik (purge_keep_days).",
    no_auto_purge: "Automatisk rensning (auto_purge) är av, så databasen bara växer.",
    no_auto_repack: "Automatisk komprimering är av, så filen krymper inte efter en rensning.",
    backup: "Senaste säkerhetskopia: {size} ({date}).",
  },
  energyErrors: "Fel i Energi", found: "{n} hittade", noErrors: "Inga felaktiga värden de senaste 120 dagarna.",
  fix: "Rätta", fill: "Fyll i",
  spike: "{v} {u} på en timme – normalt är {e}", negative: "{v} {u} – en timme kan inte vara negativ",
  gap: "Mätaren var borta i {m} timmar – {v} {u} kom på en gång",
  causeUnavailable: "Mätaren var otillgänglig strax innan – det ger ofta ett hopp.",
  causeZero: "Mätaren gick till 0 strax innan (t.ex. vid en omstart) och började om.",
  costNote: "Priset för samma timme rättas också.",
  energyIntro: "Varje timme sätts till det normala för mätaren, med Home Assistants egen ”Justera summa”. Det kan ångras.",
  fixN: "Rätta {n}", fixedN: "{n} timmar rättade",
  validation: "Statistikvarningar", validationNone: "Home Assistant har inga varningar om din statistik.",
  vtypes: {
    entity_no_longer_recorded: "Spelas inte längre in – gammal statistik finns kvar",
    entity_not_recorded: "Spelas inte in – gammal statistik finns kvar",
    no_state: "Entiteten finns inte längre – gammal statistik finns kvar",
    state_class_removed: "Har inte längre en state class – gammal statistik finns kvar",
    units_changed: "Enheten ändrades från {from} till {to}", mean_type_changed: "Typen av medelvärde har ändrats",
  },
  vfix: { clear: "Ta bort gammal statistik", convert: "Räkna om till {to}", open: "Öppna i Home Assistant" },
  clearWarn: "Borttagen statistik kan inte ångras.",
  unaccounted: "Förbrukning som ingen enhet förklarar",
  unaccountedText: "{p} av din förbrukning från nätet de senaste {d} dagarna kommer inte från någon enhet i Energi.",
  unaccountedOk: "Enheterna i Energi förklarar din förbrukning väl.",
  addMeters: "Energimätare du kan lägga till", add: "Lägg till {n}", addedN: "{n} tillagda i Energi",
  dataTitle: "Tar mest plats",
  filters: { all: "Alla", clean: "Kan städas", used: "Används", deleted: "Borttagna" }, search: "Sök",
  status: { clean: "Kan städas", busy: "Sparar mycket – kan sänkas", used: "Används – behåll", deleted: "Borttagen" },
  usedIn: "Används i", unused: "Används ingenstans", rows: "{n} rader · {d} per dag", nEntities: "{n} entiteter",
  signalsRow: "Signalstyrka", showMore: "Visa fler", remove: "Ta bort", stopSaving: "Spara inte",
  stopAdded: "Lagt till i ”Sluta spara”",
  ratesTitle: "Spara mer sällan",
  ratesIntro: "Zigbee2MQTT-enheter med bara sensorer kan skicka mer sällan. Ljus, uttag, knappar, rörelse- och dörrsensorer sänks aldrig, och det en automation eller graf använder går aldrig under Normal.",
  profile: "Profil för hela huset", profiles: { sparse: "Sparsam", balanced: "Balanserad", detailed: "Detaljerad" },
  rgroups: { climate: "Temperatur och klimat", meters: "Energimätare", sensors: "Andra sensorer" },
  levels: { often: "Ofta", normal: "Normal", rare: "Sällan", mixed: "Blandat", group: "Som gruppen", never: "Rör aldrig" },
  levelHelp: { often: "varje ändring", normal: "högst var 30:e sek.", rare: "högst var 5:e min.", mixed: "enheterna skiljer sig" },
  nDevices: "{n} enheter", perMonth: "−{n} per månad", devicesShow: "Varje enhet",
  signals: "Signalstyrka (linkquality)", signalsText: "{n} av dem används ingenstans och kan stängas av.", on: "På", off: "Av",
  noZ2m: "Inga Zigbee2MQTT-sensorer hittades. Andra enheter kan inte sänkas härifrån – använd ”Spara inte” på fliken Data.",
  applyRates: "Spara", ratesDone: "{d} enheter och {s} signaler ändrade",
  whyNot: "Varför inte dessa?", reasons: { instant: "Har {d} – måste reagera direkt", not_z2m: "Inte Zigbee2MQTT ({d})" },
  retention: "Hur länge detaljer sparas",
  retentionIntro: "Grafer och timvärden finns alltid kvar. Bara detaljerna sekund för sekund tas bort varje natt. Entiteter som en graf eller historikhjälpare använder rörs aldrig.",
  keepAll: "Allt", keepDays: "{n} dagar", autoNew: "Nya enheter får automatiskt samma",
  notifyEnergy: "Meddela mig om nya fel i Energi", weekly: "Veckorapport (måndagar)", notifications: "Meddelanden",
  stopList: "Sluta spara",
  stopListIntro: "Energidoktorn ändrar aldrig din YAML. Lägg själv in dessa rader i configuration.yaml och starta om:",
  stopListEmpty: "Inget ännu. Tryck ”Spara inte” på fliken Data.", copy: "Kopiera", copied: "Kopierat",
  aiTitle: "AI", aiHint: "Välj en AI under Inställningar → Enheter och tjänster → Energy Doctor → Konfigurera.",
  explain: "Förklara min databas", explaining: "AI:n tänker …",
  cleanTitle: "Städa", cleanIntro: "Detta tas bort med recorderns egen rensning:",
  cleanDeleted: "All historik från {n} borttagna enheter", cleanTrim: "Historik äldre än {k} dagar från {n} aktiva entiteter som inget använder",
  cleanWarn: "Borttagen data kan inte ångras.", backupFirst: "Gör en säkerhetskopia först (Home Assistants egen)",
  makeBackup: "Gör en säkerhetskopia", cleanDo: "Städa · spara {n}", cleanDone: "Städat",
  recent: "Senaste", recEnergy: "{n} timmar rättade i Energi", recClean: "Historik borttagen för {n} entiteter",
  recSaved: "databasen är {n} mindre sedan dess", recRates: "Spara mer sällan: {n} ändringar", recDevices: "{n} mätare tillagda i Energi",
  undo: "Ångra", undone: "Ångrat", back: "Tillbaka", home: "Klar", error: "Något gick fel: {e}", saved: "Sparat",
};

const NL = {
  score: "Gezondheid",
  grades: {"great": "Heel goed", "good": "Goed", "fair": "Kan beter", "poor": "Heeft hulp nodig"},
  scoreOf: "{n} van 100",
  todo: "Dit kun je doen",
  actEnergy: "{n} foute waarden in Energie herstellen",
  actClean: "Opruimen en {n} besparen",
  actRates: "Minder vaak opslaan – {n} per maand besparen",
  actValidation: "Oude statistiek opruimen",
  actHealth: "Bekijk de gezondheidscheck",
  allGood: "Alles ziet er goed uit",
  allGoodText: "Geen foute waarden in Energie en niets op te ruimen. Kijk over een week nog eens.",
  statSize: "Grootte",
  statGrowth: "Groeit per dag",
  statDisk: "Schijf vol over",
  statNever: "niet snel",
  w1t: "Welkom bij Energiedokter",
  w1: "Hij vindt foute waarden in het energiedashboard en laat zien wat je database vult – en hoe je hem klein houdt.",
  w2t: "Altijd veilig",
  w2: "Hij gebruikt alleen de eigen functies van Home Assistant, en wat gebruikt wordt, blijft onaangeroerd.",
  w3t: "Het kan ongedaan",
  w3: "Herstel en instellingen kunnen ongedaan worden gemaakt, en voor het opruimen kan hij een back-up maken.",
  next: "Volgende",
  start: "Aan de slag",
  skip: "Overslaan",
  help: {"history": "Geschiedenis is elke waarde die Home Assistant opslaat, bijv. elke 10 seconden. Statistiek zijn uurgemiddelden voor lange grafieken – die blijven altijd.", "trim": "Als maar een paar dagen geschiedenis worden bewaard, verdwijnen de details per seconde. Grafieken, Energie en uurwaarden blijven.", "protect": "‘Nooit aanraken’ houdt een entiteit buiten alle voorstellen – handig als code buiten Home Assistant (bijv. AppDaemon) haar geschiedenis leest.", "rates": "Zigbee-apparaten kunnen minder vaak sturen. Alleen apparaten met alleen sensoren worden vertraagd, en wat gebruikt wordt gaat nooit onder Normaal.", "validation": "Home Assistant bewaart statistiek voor sensoren. Wordt een sensor hernoemd of verwijderd, dan blijft de oude statistiek achter en kan worden gewist."},
  energyAllGood: "Alles is in orde in Energie",
  snackUndo: "Ongedaan maken",
  vinfo: "Onschuldig: ze zijn bewust uitgesloten in de recorder. Home Assistant blijft waarschuwen zolang de sensor een state class heeft – er is geen oude statistiek meer om te verwijderen.",
  keepRule: "Zo houden – ze bewaren voortaan alleen {k} dagen (elke nacht gecontroleerd)",
  keptPill: "Bewaart {k} dagen",
  unkeep: "Weer alles bewaren",
  repackAfter: "Bestand daarna kleiner maken (comprimeren)",
  recFreed: "≈ {n} vrijgemaakt in de database",
  recRepacking: "het bestand wordt kleiner gemaakt …",
  recSmaller: "het bestand is {n} kleiner",
  recNoRoom: "te weinig vrije schijfruimte om het bestand kleiner te maken",
  repackNow: "Bestand kleiner maken",
  cleaningTitle: "Opruimen bezig · {p} %",
  cleaningText: "De recorder werkt op de achtergrond – bij een grote database kan dat een uur duren. Herstart Home Assistant liever niet ondertussen (doe je dat, dan gaat het daarna verder).",
  cleanDoneText: "De recorder verwijdert het nu op de achtergrond. Bij een grote database kan dat een uur duren – volg het op Overzicht. Herstart Home Assistant ondertussen, dan gaat het daarna verder.",
  cleanWhat: "{t} entiteiten houden de laatste {k} dagen, en {d} verwijderde apparaten worden opgeruimd.",
  cleanWhatTrim: "{t} entiteiten houden de laatste {k} dagen.",
  cleanWhatDeleted: "{d} verwijderde apparaten worden opgeruimd.",
  safeTitle: "Waarom het veilig is",
  safe1: "Geen grafiek, energiedashboard of geschiedenishelper gebruikt ze",
  safe2: "Automatiseringen en templates gebruiken alleen de huidige waarde – die blijft",
  safe3: "Uurwaarden en statistiek blijven, dus lange grafieken werken nog",
  safe4: "{n} entiteiten met ‘Nooit aanraken’ blijven ongemoeid",
  seeWhat: "Bekijk wat wordt opgeruimd ({n})",
  whyGone: "Bestaat niet meer",
  whyUnused: "Nergens gebruikt",
  whyValue: "Alleen de huidige waarde wordt gebruikt: {list}",
  st2: {"history": "Geschiedenis gebruikt – behouden", "value": "Gebruikt – alleen de waarde", "value_busy": "Gebruikt – oude geschiedenis kan weg", "protected": "Nooit aanraken"},
  protectOn: "Nooit aanraken",
  protectOff: "Weer toestaan",
  trimRow: "Oude geschiedenis wissen",
  historyTag: "geschiedenis",
  unseen: "Energiedokter kan de bestanden van {list} niet zien. Lezen ze geschiedenis, markeer die entiteiten dan als ‘Nooit aanraken’.",
  outsideRead: "Leest ook: {list}",
  stopDone: "{s} gestopt bij de bron in Zigbee2MQTT",
  stopListed: "{l} op de lijst ‘Stoppen met opslaan’ gezet",
  recFilter: "Niet opslaan: {n} waarden gestopt in Zigbee2MQTT",
  lower: "Verlagen",
  busyOnly: "Slaat veel op",
  loweredOne: "{n} slaat nu minder vaak op",
  vgroups: {"no_state": "{n} entiteiten bestaan niet meer", "entity_no_longer_recorded": "{n} entiteiten worden niet meer opgenomen", "entity_not_recorded": "{n} entiteiten worden niet opgenomen", "state_class_removed": "{n} entiteiten hebben geen state class meer"},
  vexplain: {"no_state": "Oude namen van apparaten die hernoemd of opnieuw gekoppeld zijn. Hun oude statistiek staat nog in de database.", "entity_no_longer_recorded": "Ze zijn uitgesloten in de recorder (door jou of een integratie). De statistiek van eerder is er nog.", "entity_not_recorded": "Ze zijn uitgesloten in de recorder. De statistiek van eerder is er nog.", "state_class_removed": "Ze geven geen statistiek meer. De statistiek van eerder is er nog."},
  vclearAll: "Oude statistiek voor alle {n} verwijderen",
  vshow: "Toon ze",
  vnotEnergy: "Geen ervan wordt gebruikt in het energiedashboard.",
  vinEnergy: "{n} ervan worden gebruikt in het energiedashboard – houd die.",
  sizeUnknown: "De grootte kon niet van de databaseserver worden gelezen – de rest werkt hetzelfde.",
  updated: "Bijgewerkt {n}",
  agoNow: "zojuist",
  agoMin: "{n} min geleden",
  agoHour: "{n} uur geleden",
  refreshing: "Bijwerken …",
  backupWorking: "Back-up maken …",
  backupHint: "Home Assistants eigen back-up – dat kan op een grote installatie een paar minuten duren.",
  cleaning: "Opruimen …",
  provisional: "Eerste schatting uit de eerste uren – na een paar dagen wordt die nauwkeuriger.",
  title: "Energiedokter",
  tabs: { overview: "Overzicht", energy: "Energie", data: "Data", settings: "Instellingen" },
  working: "De database wordt doorgekeken …", workingHint: "Een grote database duurt een minuut.",
  fresh: "Opnieuw controleren", perDay: "+{n} per dag", healthy: "Je database is gezond.",
  growing: "Je database groeit {n} per dag.", diskFull: "De schijf is over ongeveer {n} vol.",
  months: "{n} maanden", years: "{n} jaar", days: "{n} dagen",
  groups: { sensors: "Sensoren", energy: "Energie", lights: "Lampen", signals: "Signalen", other: "Overig" },
  graphTitle: "Grootte door de tijd", graphNow: "Nu", graphAsIs: "Als je niets doet", graphOptimised: "Na Optimaliseren",
  graphFew: "De grafiek vult zich dag na dag.",
  ratesCard: "Minder vaak opslaan", ratesNone: "Niet ingesteld – alles slaat zo vaak op als het kan.",
  ratesProfile: "Profiel: {p}", ratesCustom: "Eigen keuzes", ratesSave: "Kan {n} per maand besparen", change: "Wijzigen",
  suggestion: "Voorstel", save: "Bespaar {n}",
  saveText: "{d} verwijderde apparaten hebben nog geschiedenis, en {t} drukke entiteiten die niets gebruikt houden {k} dagen in plaats van alles.",
  nothingToSave: "Niets op te ruimen – goed bijgehouden!", cleanup: "Opruimen", health: "Gezondheidscheck",
  healthItems: {
    sd_card: "De database staat op een SD-kaart. SD-kaarten slijten door veel schrijven – overweeg een SSD.",
    big: "De database is {size}. Dat maakt opstarten en back-uppen van Home Assistant traag.",
    keep_days: "De recorder bewaart {days} dagen geschiedenis (purge_keep_days).",
    no_auto_purge: "Automatisch opschonen (auto_purge) staat uit, dus de database groeit alleen.",
    no_auto_repack: "Automatisch comprimeren staat uit, dus het bestand krimpt niet na opruimen.",
    backup: "Laatste back-up: {size} ({date}).",
  },
  energyErrors: "Foute waarden in Energie", found: "{n} gevonden", noErrors: "Geen foute waarden in de laatste 120 dagen.",
  fix: "Herstellen", fill: "Aanvullen",
  spike: "{v} {u} in één uur – normaal is {e}", negative: "{v} {u} – een uur kan niet negatief zijn",
  gap: "De meter was {m} uur weg – {v} {u} kwam in één keer",
  causeUnavailable: "De meter was vlak ervoor niet beschikbaar – dat geeft vaak een sprong.",
  causeZero: "De meter ging vlak ervoor naar 0 (bijv. bij een herstart) en begon opnieuw.",
  costNote: "De prijs van hetzelfde uur wordt meteen hersteld.",
  energyIntro: "Elk uur wordt op het normale niveau van die meter gezet, met Home Assistants eigen ‘Som aanpassen’. Het kan ongedaan worden gemaakt.",
  fixN: "{n} herstellen", fixedN: "{n} uur hersteld",
  validation: "Statistiekwaarschuwingen", validationNone: "Home Assistant heeft geen waarschuwingen over je statistiek.",
  vtypes: {
    entity_no_longer_recorded: "Wordt niet meer opgenomen – oude statistiek is over",
    entity_not_recorded: "Wordt niet opgenomen – oude statistiek is over",
    no_state: "De entiteit is weg – oude statistiek is over",
    state_class_removed: "Heeft geen state class meer – oude statistiek is over",
    units_changed: "De eenheid veranderde van {from} naar {to}", mean_type_changed: "Het soort gemiddelde is veranderd",
  },
  vfix: { clear: "Oude statistiek verwijderen", convert: "Omrekenen naar {to}", open: "Openen in Home Assistant" },
  clearWarn: "Verwijderen van statistiek kan niet ongedaan worden gemaakt.",
  unaccounted: "Verbruik dat geen apparaat verklaart",
  unaccountedText: "{p} van je verbruik van het net de laatste {d} dagen komt niet van een apparaat in Energie.",
  unaccountedOk: "De apparaten in Energie verklaren je verbruik goed.",
  addMeters: "Energiemeters die je kunt toevoegen", add: "{n} toevoegen", addedN: "{n} toegevoegd aan Energie",
  dataTitle: "Neemt het meeste ruimte in",
  filters: { all: "Alle", clean: "Op te ruimen", used: "Gebruikt", deleted: "Verwijderd" }, search: "Zoeken",
  status: { clean: "Op te ruimen", busy: "Slaat veel op – kan omlaag", used: "Gebruikt – behouden", deleted: "Verwijderd" },
  usedIn: "Gebruikt in", unused: "Nergens gebruikt", rows: "{n} rijen · {d} per dag", nEntities: "{n} entiteiten",
  signalsRow: "Signaalsterkte", showMore: "Meer tonen", remove: "Verwijderen", stopSaving: "Niet opslaan",
  stopAdded: "Toegevoegd aan ‘Stoppen met opslaan’",
  ratesTitle: "Minder vaak opslaan",
  ratesIntro: "Zigbee2MQTT-apparaten met alleen sensoren kunnen minder vaak sturen. Lampen, stekkers, knoppen, bewegings- en deursensoren worden nooit vertraagd, en wat een automatisering of grafiek gebruikt gaat nooit onder Normaal.",
  profile: "Profiel voor het hele huis", profiles: { sparse: "Zuinig", balanced: "Gebalanceerd", detailed: "Gedetailleerd" },
  rgroups: { climate: "Temperatuur en klimaat", meters: "Energiemeters", sensors: "Andere sensoren" },
  levels: { often: "Vaak", normal: "Normaal", rare: "Zelden", mixed: "Gemengd", group: "Zoals de groep", never: "Nooit aanraken" },
  levelHelp: { often: "elke wijziging", normal: "hoogstens elke 30 s", rare: "hoogstens elke 5 min", mixed: "apparaten verschillen" },
  nDevices: "{n} apparaten", perMonth: "−{n} per maand", devicesShow: "Elk apparaat",
  signals: "Signaalsterkte (linkquality)", signalsText: "{n} ervan worden nergens gebruikt en kunnen uit.", on: "Aan", off: "Uit",
  noZ2m: "Geen Zigbee2MQTT-sensoren gevonden. Andere apparaten kunnen hier niet worden vertraagd – gebruik ‘Niet opslaan’ op het tabblad Data.",
  applyRates: "Opslaan", ratesDone: "{d} apparaten en {s} signalen gewijzigd",
  whyNot: "Waarom niet deze?", reasons: { instant: "Heeft {d} – moet direct reageren", not_z2m: "Geen Zigbee2MQTT ({d})" },
  retention: "Hoe lang details bewaard blijven",
  retentionIntro: "Grafieken en uurwaarden blijven altijd. Alleen de details per seconde worden elke nacht verwijderd. Entiteiten die een grafiek of geschiedenishelper gebruikt worden nooit aangeraakt.",
  keepAll: "Alles", keepDays: "{n} dagen", autoNew: "Nieuwe apparaten krijgen automatisch hetzelfde",
  notifyEnergy: "Meld nieuwe foute waarden in Energie", weekly: "Weekrapport (maandag)", notifications: "Meldingen",
  stopList: "Stoppen met opslaan",
  stopListIntro: "Energiedokter verandert nooit je YAML. Zet deze regels zelf in configuration.yaml en herstart:",
  stopListEmpty: "Nog niets. Tik op ‘Niet opslaan’ op het tabblad Data.", copy: "Kopiëren", copied: "Gekopieerd",
  aiTitle: "AI", aiHint: "Kies een AI onder Instellingen → Apparaten en diensten → Energy Doctor → Configureren.",
  explain: "Leg mijn database uit", explaining: "De AI denkt na …",
  cleanTitle: "Opruimen", cleanIntro: "Dit wordt verwijderd met de eigen opschoning van de recorder:",
  cleanDeleted: "Alle geschiedenis van {n} verwijderde apparaten", cleanTrim: "Geschiedenis ouder dan {k} dagen van {n} drukke entiteiten die niets gebruikt",
  cleanWarn: "Verwijderde data kan niet worden teruggezet.", backupFirst: "Eerst een back-up maken (Home Assistants eigen back-up)",
  makeBackup: "Back-up maken", cleanDo: "Opruimen · bespaar {n}", cleanDone: "Opgeruimd",
  recent: "Recent", recEnergy: "{n} uur hersteld in Energie", recClean: "Geschiedenis verwijderd voor {n} entiteiten",
  recSaved: "de database is sindsdien {n} kleiner", recRates: "Minder vaak opslaan: {n} wijzigingen", recDevices: "{n} meters toegevoegd aan Energie",
  undo: "Ongedaan maken", undone: "Ongedaan gemaakt", back: "Terug", home: "Klaar", error: "Er ging iets mis: {e}", saved: "Opgeslagen",
};

const TEXT = { en: EN, da: DA, de: DE, sv: SV, nl: NL };
const LOCALE = { en: "en-GB", da: "da-DK", de: "de-DE", sv: "sv-SE", nl: "nl-NL" };
const COLORS = { sensors: "#0b6fa4", energy: "#f59e0b", lights: "#22a06b", signals: "#8b5cf6", other: "#94a3b8" };
const USE_ICON = { outside: "mdi:application-cog", automation: "mdi:robot", script: "mdi:script-text", scene: "mdi:palette", graph: "mdi:chart-line", dashboard: "mdi:view-dashboard", energy: "mdi:lightning-bolt", helper: "mdi:tools", yaml: "mdi:file-code-outline" };
const GROUP_ICON = { climate: "mdi:thermometer", meters: "mdi:lightning-bolt", sensors: "mdi:motion-sensor", signals: "mdi:signal" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const SIGNAL = /(linkquality|_lqi|rssi)$/;

class EnergyDoctorPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.tab = "overview";
    this.view = "working";
    this.data = null;
    this.extra = null;
    this.rates = null;
    this.history = [];
    this.settings = {};
    this.picked = new Set();
    this.mpicked = new Set();
    this.choice = {};
    this.overrides = {};
    this.openRows = new Set();
    this.openGroups = new Set();
    this.filter = "all";
    this.query = "";
    this.limit = 10;
    this.backup = true;
    this.repack = true;
    this.keepRule = true;
    this.message = "";
    this.aiText = "";
    this.snack = null;
    this.step = 0;
    this.animate = true;
    try {
      this.welcomed = localStorage.getItem("energy_doctor_welcomed") === "1";
    } catch (e) {
      this.welcomed = true;
    }
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    this.toggleAttribute("dark", !!hass.themes?.darkMode);
    if (first) this.load();
  }

  set narrow(narrow) {
    this._narrow = narrow;
  }

  get lang() {
    const l = (this._hass?.locale?.language || this._hass?.language || "en").split("-")[0];
    if (["da", "nb", "nn", "no"].includes(l)) return "da";
    return TEXT[l] ? l : "en";
  }

  t(key, vars = {}) {
    const find = (table) => key.split(".").reduce((o, k) => o?.[k], table);
    const value = find(TEXT[this.lang]) ?? find(EN) ?? key;
    return String(value).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  }

  ws(type, data = {}) {
    return this._hass.callWS({ type: `energy_doctor/${type}`, ...data });
  }

  num(n, digits = 1) {
    return Number(n).toLocaleString(LOCALE[this.lang], { maximumFractionDigits: digits });
  }

  bytes(n) {
    if (n == null) return "–";
    if (Math.abs(n) >= 1e9) return `${this.num(n / 1e9)} GB`;
    if (Math.abs(n) >= 1e6) return `${this.num(n / 1e6, 0)} MB`;
    return `${this.num(n / 1e3, 0)} kB`;
  }

  when(ts) {
    return new Date(ts * 1000).toLocaleString(LOCALE[this.lang], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  async load(fresh = false, quiet = false) {
    // quiet: keep showing what is there while the new picture loads (after an action).
    if (!quiet) {
      this.view = "working";
      this.render();
    }
    try {
      const [data, history, settings] = await Promise.all([this.ws("overview", { fresh, stale: !fresh }), this.ws("history"), this.ws("settings")]);
      this.data = data;
      this.history = history;
      this.settings = settings;
      this.overrides = { ...(settings.overrides || {}) };
      this.view = "tabs";
      this.render();
      // An older picture opened at once: get a fresh one quietly behind it.
      if (data.stale) {
        this.refreshing = true;
        this.render();
        this.ws("overview", { fresh: true, stale: false }).then((d) => (this.data = d)).catch(() => {}).finally(() => {
          this.refreshing = false;
          this.render();
        });
      }
      // The slower parts come in behind the first picture.
      const [extra, rates] = await Promise.all([
        this.ws("energy_extra").catch(() => null),
        settings.mqtt ? this.ws("rates").catch(() => null) : Promise.resolve(null),
      ]);
      this.extra = extra;
      this.rates = rates;
      this.followCleaning();
      if (rates) this.choice = { ...(rates.chosen || {}) };
      this.render();
    } catch (e) {
      this.message = this.t("error", { e: e.message || e });
      this.view = "tabs";
      this.render();
    }
  }

  // While the recorder cleans up, the progress is fetched again every minute.
  followCleaning() {
    clearTimeout(this._follow);
    if (!this.data?.cleaning) return;
    this._follow = setTimeout(async () => {
      try {
        if (this.isConnected) this.data = await this.ws("overview", { fresh: true, stale: false });
      } catch (e) { /* tried again next minute */ }
      if (this.view === "tabs") this.render();
      this.followCleaning();
    }, 60000);
  }

  disconnectedCallback() {
    clearTimeout(this._follow);
  }

  // ---------- overview ----------

  ring() {
    const d = this.data;
    const order = ["sensors", "energy", "lights", "signals", "other"].filter((g) => d.groups[g]);
    const total = order.reduce((a, g) => a + d.groups[g], 0) || 1;
    const c = 2 * Math.PI * 80;
    let offset = 0;
    const arcs = order.map((g) => {
      const len = (d.groups[g] / total) * c;
      const arc = `<circle cx="98" cy="98" r="80" stroke="${COLORS[g]}" stroke-dasharray="${Math.max(len - 2, 0.1)} ${c}" stroke-dashoffset="${-offset}"></circle>`;
      offset += len;
      return arc;
    }).join("");
    const legend = order.map((g) => `<span class="leg"><i style="background:${COLORS[g]}"></i>${this.t(`groups.${g}`)} ${Math.round((d.groups[g] / total) * 100)} %</span>`).join("");
    let text = d.growth > 0 ? this.t("growing", { n: this.bytes(d.growth) }) : this.t("healthy");
    if (d.growth > 0 && d.free) text += ` ${this.t("diskFull", { n: this.duration(d.free / d.growth) })}`;
    return `<div class="card ringcard">
      <div class="ring"><svg viewBox="0 0 196 196" aria-hidden="true"><g transform="rotate(-90 98 98)" fill="none" stroke-width="22"><circle cx="98" cy="98" r="80" stroke="var(--divider-color,#e8ecf1)"></circle>${arcs}</g></svg>
        <div class="center"><b>${d.size != null ? this.bytes(d.size) : this.num(d.rows, 0)}</b><span>${d.growth != null ? this.t("perDay", { n: this.bytes(Math.max(d.growth, 0)) }) : ""}</span></div></div>
      <div class="legend">${legend}</div>
      <p class="lead">${esc(text)}</p>
      <p class="muted small">${this.refreshing ? `<span class="spinner tiny"></span> ${this.t("refreshing")}` : esc(this.t("updated", { n: this.ago(d.at) }))}</p>
      ${d.size == null ? `<p class="muted small">${this.t("sizeUnknown")}</p>` : ""}
    </div>`;
  }

  ago(ts) {
    const min = Math.max(0, Math.round((Date.now() / 1000 - ts) / 60));
    if (min < 2) return this.t("agoNow");
    if (min < 120) return this.t("agoMin", { n: min });
    return this.t("agoHour", { n: Math.round(min / 60) });
  }

  duration(days) {
    if (days > 730) return this.t("years", { n: this.num(days / 365, 0) });
    if (days > 60) return this.t("months", { n: this.num(days / 30, 0) });
    return this.t("days", { n: this.num(days, 0) });
  }

  help(key) {
    return `<details class="q"><summary aria-label="?">?</summary><div class="tip">${esc(this.t(`help.${key}`))}</div></details>`;
  }

  validationGroups() {
    return new Set((this.extra?.validation || []).filter((v) => v.fix !== "info").map((v) => (["no_state", "entity_no_longer_recorded", "entity_not_recorded", "state_class_removed"].includes(v.type) ? v.type : v.id)));
  }

  score() {
    // A simple 0-100 health score and up to three things to do, most useful first.
    const d = this.data;
    const issues = this.visibleIssues().length;
    const vgroups = this.validationGroups().size;
    const warns = (d.health || []).filter((h) => h.level === "warn").length;
    const save = d.suggestion?.bytes || 0;
    const rates = this.ratesSaving();
    let score = 100;
    score -= Math.min(30, issues * 10);
    score -= Math.min(10, vgroups * 5);
    score -= Math.min(24, warns * 8);
    score -= d.size ? Math.round(Math.min(25, (save / d.size) * 50)) : save > 5e8 ? 10 : 0;
    if (d.growth > 0 && d.free) score -= d.free / d.growth < 90 ? 15 : d.free / d.growth < 365 ? 5 : 0;
    score = Math.max(0, score);
    const todo = [];
    if (issues) todo.push({ icon: "mdi:lightning-bolt", text: this.t("actEnergy", { n: issues }), act: "tab", tab: "energy", tone: "red" });
    if (save > 1e7 && !d.cleaning) todo.push({ icon: "mdi:broom", text: this.t("actClean", { n: this.bytes(save) }), act: "clean", tone: "blue" });
    if (rates > 1e7) todo.push({ icon: "mdi:timer-sand", text: this.t("actRates", { n: this.bytes(rates) }), act: "tab", tab: "settings", tone: "amber" });
    if (vgroups) todo.push({ icon: "mdi:chart-box-outline", text: this.t("actValidation"), act: "tab", tab: "energy", tone: "amber" });
    const grade = score >= 90 ? "great" : score >= 75 ? "good" : score >= 50 ? "fair" : "poor";
    return { score, grade, todo: todo.slice(0, 3) };
  }

  scoreCard() {
    const { score, grade, todo } = this.score();
    const d = this.data;
    const c = 2 * Math.PI * 30;
    const tone = { great: "var(--ed-green)", good: "var(--ed-green)", fair: "var(--ed-amber)", poor: "var(--ed-red)" }[grade];
    const days = d.growth > 0 && d.free ? d.free / d.growth : null;
    const tile = (icon, label, value) => `<div class="tile"><ha-icon icon="${icon}"></ha-icon><b>${esc(value)}</b><span>${esc(label)}</span></div>`;
    const list = todo.length
      ? `<div class="todo"><div class="eyebrow muted">${this.t("todo")}</div>${todo.map((x) => `<button class="tdo" data-act="${x.act}" ${x.tab ? `data-tab="${x.tab}"` : ""}><span class="ticon ${x.tone}"><ha-icon icon="${x.icon}"></ha-icon></span><span class="grow">${esc(x.text)}</span><ha-icon class="chev" icon="mdi:chevron-right"></ha-icon></button>`).join("")}</div>`
      : `<div class="empty small-empty"><ha-icon icon="mdi:party-popper"></ha-icon><b>${this.t("allGood")}</b><span class="muted small">${this.t("allGoodText")}</span></div>`;
    return `<div class="card span scorecard">
      <div class="scorehead"><div class="mini"><svg viewBox="0 0 72 72" aria-hidden="true"><g transform="rotate(-90 36 36)" fill="none" stroke-width="8" stroke-linecap="round"><circle cx="36" cy="36" r="30" stroke="var(--ed-track)"></circle><circle class="arc" cx="36" cy="36" r="30" stroke="${tone}" stroke-dasharray="${(score / 100) * c} ${c}"></circle></g></svg><b>${score}</b></div>
        <div class="grow"><div class="eyebrow muted">${this.t("score")}</div><div class="grade">${this.t(`grades.${grade}`)}</div><div class="muted small">${this.t("scoreOf", { n: score })}</div></div></div>
      <div class="tiles">${tile("mdi:database", this.t("statSize"), d.size != null ? this.bytes(d.size) : this.num(d.rows, 0))}${tile("mdi:trending-up", this.t("statGrowth"), d.growth != null ? this.bytes(Math.max(d.growth, 0)) : "–")}${tile("mdi:harddisk", this.t("statDisk"), days == null || days > 3650 ? this.t("statNever") : this.duration(days))}</div>
      ${list}</div>`;
  }

  ratesSaving() {
    if (!this.rates) return 0;
    const groups = this.rates.groups.reduce((a, g) => a + (g.saving.rare || 0), 0);
    return groups + (this.rates.signals?.saving || 0);
  }

  graph() {
    const d = this.data;
    // Days once there are a few; before that the hourly samples, so the graph starts at once.
    const daily = (d.sizes || []).map(([day, size]) => [new Date(`${day}T12:00:00`).getTime() / 86400000, size]);
    const pts = daily.length >= 3 ? daily : (d.samples || []).map(([ts, size]) => [ts / 86400, size]);
    if (pts.length < 2 || d.growth == null) return `<div class="card"><div class="head"><b>${this.t("graphTitle")}</b></div><p class="muted small">${this.t("graphFew")}</p></div>`;
    const last = pts[pts.length - 1];
    const ahead = 90;
    const optimised = Math.max(0, d.growth - this.ratesSaving() / 30);
    const asIs = [last[0] + ahead, last[1] + d.growth * ahead];
    const opt = [last[0] + ahead, Math.max(0, last[1] - (d.suggestion?.bytes || 0)) + optimised * ahead];
    const xs = [pts[0][0], asIs[0]];
    const ys = [Math.min(...pts.map((p) => p[1]), opt[1]) * 0.95, Math.max(...pts.map((p) => p[1]), asIs[1]) * 1.02];
    const W = 320, H = 140;
    const x = (v) => 8 + ((v - xs[0]) / (xs[1] - xs[0] || 1)) * (W - 16);
    const y = (v) => H - 18 - ((v - ys[0]) / (ys[1] - ys[0] || 1)) * (H - 30);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join(" ");
    return `<div class="card"><div class="head"><b>${this.t("graphTitle")}</b></div>
      <svg viewBox="0 0 ${W} ${H}" class="graph" role="img" aria-label="${esc(this.t("graphTitle"))}">
        <path d="${line}" fill="none" stroke="var(--primary-color,#0b6fa4)" stroke-width="3" stroke-linejoin="round"></path>
        <path d="M${x(last[0])} ${y(last[1])} L${x(asIs[0])} ${y(asIs[1])}" stroke="#d92d20" stroke-width="2.5" stroke-dasharray="6 5" fill="none"></path>
        <path d="M${x(last[0])} ${y(last[1])} L${x(opt[0])} ${y(opt[1])}" stroke="#22a06b" stroke-width="2.5" stroke-dasharray="6 5" fill="none"></path>
        <circle cx="${x(last[0])}" cy="${y(last[1])}" r="5" fill="var(--primary-color,#0b6fa4)"></circle>
        <text x="${x(asIs[0]) - 4}" y="${y(asIs[1]) - 6}" text-anchor="end" class="gl red">${this.bytes(asIs[1])}</text>
        <text x="${x(opt[0]) - 4}" y="${y(opt[1]) + 16}" text-anchor="end" class="gl green">${this.bytes(opt[1])}</text>
      </svg>
      ${d.provisional ? `<p class="muted small">${this.t("provisional")}</p>` : ""}
      <div class="legend left"><span class="leg"><i style="background:var(--primary-color,#0b6fa4)"></i>${this.t("graphNow")}</span><span class="leg"><i style="background:#d92d20"></i>${this.t("graphAsIs")}</span><span class="leg"><i style="background:#22a06b"></i>${this.t("graphOptimised")}</span></div>
    </div>`;
  }

  ratesCard() {
    if (!this.settings.mqtt) return "";
    const r = this.rates;
    const chosen = r?.chosen || {};
    const profile = r && Object.entries(r.profiles).find(([, lv]) => Object.entries(lv).every(([k, v]) => chosen[k] === v))?.[0];
    const status = !r || !Object.keys(chosen).length ? this.t("ratesNone") : profile ? this.t("ratesProfile", { p: this.t(`profiles.${profile}`) }) : this.t("ratesCustom");
    const save = this.ratesSaving();
    return `<div class="card"><div class="head"><span class="gicon climate"><ha-icon icon="mdi:speedometer-slow"></ha-icon></span><div class="grow"><b>${this.t("ratesCard")}</b>
        <div class="muted small">${esc(status)}${save ? ` · ${this.t("ratesSave", { n: this.bytes(save) })}` : ""}</div></div>
        <button class="soft" data-act="tab" data-tab="settings">${this.t("change")}</button></div></div>`;
  }

  cleaningCard() {
    const c = this.data.cleaning;
    if (!c) return "";
    const pct = Math.round(c.progress * 100);
    return `<div class="card"><div class="head"><span class="spinner tiny"></span><b>${this.t("cleaningTitle", { p: pct })}</b></div>
      <div class="bar big"><div style="width:${Math.max(3, pct)}%;background:var(--primary-color,#0b6fa4)"></div></div>
      <div class="small muted">${this.t("cleaningText")}</div></div>`;
  }

  suggestionCard() {
    const s = this.data.suggestion;
    if (!s.bytes) return `<div class="card okcard"><ha-icon icon="mdi:check-decagram"></ha-icon><span class="grow">${this.t("nothingToSave")}</span></div>`;
    return `<div class="card hero">
      <span class="eyebrow">${this.t("suggestion")}</span>
      <span class="big">${this.t("save", { n: this.bytes(s.bytes) })}</span>
      <span>${esc(this.t("saveText", { d: s.deleted.length, t: s.trim.length, k: s.keep_days }))}</span>
      <div class="row"><button class="white" data-act="clean">${this.t("cleanup")}</button></div>
    </div>`;
  }

  healthCard() {
    const items = this.data.health || [];
    if (!items.length) return "";
    const icon = { warn: "mdi:alert", info: "mdi:information-outline", ok: "mdi:check" };
    const text = (h) => this.t(`healthItems.${h.key}`, { ...h.data, size: this.bytes(h.data?.size), date: h.data?.date ? new Date(h.data.date).toLocaleDateString(LOCALE[this.lang]) : "" });
    return `<div class="card"><div class="head"><b>${this.t("health")}</b></div>
      ${items.map((h) => `<div class="hrow ${h.level}"><ha-icon icon="${icon[h.level]}"></ha-icon><span>${esc(text(h))}</span></div>`).join("")}</div>`;
  }

  aiCard() {
    if (!this.settings.ai) return "";
    if (this.aiText) return `<div class="card"><div class="head"><ha-icon icon="mdi:creation"></ha-icon><b>${this.t("explain")}</b></div><p class="lead left">${esc(this.aiText)}</p></div>`;
    return `<button class="ghost aibtn" data-act="explain" ${this.explaining ? "disabled" : ""}><ha-icon icon="mdi:creation"></ha-icon> ${this.t(this.explaining ? "explaining" : "explain")}</button>`;
  }

  recentCard() {
    const list = this.history.slice(0, 5);
    if (!list.length) return "";
    const label = (r) => ({
      energy: () => this.t("recEnergy", { n: r.issues.length }),
      rates: () => this.t("recRates", { n: r.done.throttles.length + r.done.disabled.length + r.done.enabled.length }),
      energy_devices: () => this.t("recDevices", { n: r.added.length }),
      filter: () => this.t("recFilter", { n: r.entities.length }),
      cleanup: () => this.t("recClean", { n: r.deleted.length + r.trim.length }),
    }[r.kind] || (() => r.kind))();
    const extra = (r) => {
      if (r.kind !== "cleanup") return "";
      const bits = [];
      if (r.freed) bits.push(this.t("recFreed", { n: this.bytes(r.freed) }));
      if (r.repack_skipped) bits.push(this.t("recNoRoom"));
      else if (r.repacking) bits.push(this.t("recRepacking"));
      else if (r.saved) bits.push(this.t("recSmaller", { n: this.bytes(r.saved) }));
      return bits.length ? ` · ${esc(bits.join(" · "))}` : "";
    };
    const action = (r) => r.kind !== "cleanup"
      ? (r.undone ? `<span class="muted small">${this.t("undone")}</span>` : `<button class="soft" data-act="undo" data-id="${r.id}">${this.t("undo")}</button>`)
      : r.finished && !r.repacking && !r.saved && !r.repack_skipped ? `<button class="soft" data-act="repackNow" data-id="${r.id}">${this.t("repackNow")}</button>` : "";
    const row = (r) => `<div class="irow"><div class="grow"><div class="name">${esc(label(r))}</div>
        <div class="muted small">${esc(this.when(r.at))}${extra(r)}</div></div>${action(r)}</div>`;
    return `<div class="card"><div class="head"><b>${this.t("recent")}</b></div>${list.map(row).join("")}</div>`;
  }

  overviewTab() {
    return `${this.scoreCard()}${this.ring()}${this.cleaningCard()}${this.aiCard()}${this.suggestionCard()}${this.ratesCard()}${this.graph()}${this.healthCard()}${this.recentCard()}
      <button class="link center-link" data-act="fresh"><ha-icon icon="mdi:refresh"></ha-icon> ${this.t("fresh")}</button>`;
  }

  // ---------- energy ----------

  issueText(i) {
    const u = i.unit || "";
    if (i.kind === "gap") return this.t("gap", { m: i.missing, v: this.num(i.value), u });
    return i.kind === "spike" ? this.t("spike", { v: this.num(i.value), u, e: `${this.num(i.expected, 2)} ${u}` }) : this.t("negative", { v: this.num(i.value), u });
  }

  issueExtra(i) {
    const cause = i.cause === "unavailable" ? this.t("causeUnavailable") : i.cause === "zero" ? this.t("causeZero") : "";
    const paired = this.data.energy_issues.some((c) => c.cost_of === i.statistic_id && c.start === i.start);
    return `${cause ? `<div class="small muted">${esc(cause)}</div>` : ""}${paired ? `<div class="small muted">${this.t("costNote")}</div>` : ""}`;
  }

  visibleIssues() {
    const all = this.data.energy_issues;
    return all.filter((i) => !i.cost_of || !all.some((e) => e.statistic_id === i.cost_of && e.start === i.start));
  }

  energyTab() {
    const issues = this.visibleIssues();
    const row = (i) => `<label class="irow pick"><input type="checkbox" data-pick="${esc(i.id)}" ${this.picked.has(i.id) ? "checked" : ""}><span class="box"></span>
        <div class="grow"><div class="name">${esc(i.name)}</div><div class="small ${i.kind === "spike" ? "red" : "amber"}">${esc(this.issueText(i))}</div>
        <div class="muted small">${esc(this.when(i.start))}</div>${this.issueExtra(i)}</div></label>`;
    const errors = issues.length
      ? `<div class="card"><div class="head"><i class="dot" style="background:#d92d20"></i><b>${this.t("energyErrors")}</b><span class="muted small right">${this.t("found", { n: issues.length })}</span></div>
          <p class="muted small">${this.t("energyIntro")}</p>${issues.map(row).join("")}
          <button class="primary" data-act="fixPicked" ${this.picked.size ? "" : "disabled"}>${this.t("fixN", { n: this.picked.size })}</button></div>`
      : `<div class="card okcard"><ha-icon icon="mdi:lightning-bolt-circle"></ha-icon><span>${this.t("noErrors")}</span></div>`;
    if (!issues.length && this.extra && !this.validationGroups().size && !(this.extra.unaccounted?.candidates || []).length) {
      return `<div class="card span empty"><ha-icon icon="mdi:lightning-bolt-circle"></ha-icon><b>${this.t("energyAllGood")}</b><span class="muted">${this.t("noErrors")}</span></div>${this.validationCard()}${this.unaccountedCard()}`;
    }
    return `${errors}${this.validationCard()}${this.unaccountedCard()}`;
  }

  validationCard() {
    if (!this.extra) return `<div class="card"><div class="spinner small-spin"></div></div>`;
    const list = this.extra.validation || [];
    if (!list.length) return `<div class="card okcard"><ha-icon icon="mdi:chart-box-outline"></ha-icon><span>${this.t("validationNone")}</span></div>`;
    // Old statistics of entities that are gone or not recorded: one group each, with one button for all.
    const energy = new Set(list.filter((v) => v.in_energy).map((v) => v.statistic_id));
    const groupTypes = ["no_state", "entity_no_longer_recorded", "entity_not_recorded", "state_class_removed"];
    const groups = groupTypes.map((type) => ({ type, items: list.filter((v) => v.type === type) })).filter((g) => g.items.length);
    const single = list.filter((v) => !groupTypes.includes(v.type));
    const group = (g) => {
      const open = this.openGroups.has(`v:${g.type}`);
      const inEnergy = g.items.filter((v) => energy.has(v.statistic_id));
      const free = g.items.filter((v) => !energy.has(v.statistic_id));
      return `<div class="vgroup"><div class="name">${esc(this.t(`vgroups.${g.type}`, { n: g.items.length }))}</div>
        <div class="small muted">${esc(g.items[0].fix === "info" ? this.t("vinfo") : this.t(`vexplain.${g.type}`))}</div>
        ${g.items[0].fix === "info" ? "" : `<div class="small ${inEnergy.length ? "amber" : "green"}">${esc(inEnergy.length ? this.t("vinEnergy", { n: inEnergy.length }) : this.t("vnotEnergy"))}</div>`}
        <div class="row wrap">${free.length && g.items[0].fix !== "info" ? `<button class="soft redbg" data-act="clearGroup" data-type="${g.type}">${esc(this.t("vclearAll", { n: free.length }))}</button>` : ""}
          <button class="link" data-act="toggleGroup" data-key="v:${g.type}">${this.t("vshow")} <ha-icon icon="${open ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon></button></div>
        ${open ? `<div class="vlist">${g.items.map((v) => `<div class="mono small">${esc(v.statistic_id)}${energy.has(v.statistic_id) ? ` <span class="pill blue">${this.t("groups.energy")}</span>` : ""}</div>`).join("")}</div>` : ""}
      </div>`;
    };
    const row = (v) => {
      const text = this.t(`vtypes.${v.type}`, { from: v.data.metadata_unit || "?", to: v.data.state_unit || "?" });
      const action = v.fix === "open"
        ? `<a class="soft linkbtn" href="/developer-tools/statistics" target="_top">${this.t("vfix.open")}</a>`
        : `<button class="soft ${v.fix === "clear" ? "redbg" : ""}" data-act="fixValidation" data-id="${esc(v.id)}">${esc(this.t(`vfix.${v.fix}`, { to: v.data.state_unit || "" }))}</button>`;
      return `<div class="irow"><div class="grow"><div class="name">${esc(v.name)}</div><div class="small muted">${esc(text)}</div><div class="mono small muted">${esc(v.statistic_id)}</div></div>${action}</div>`;
    };
    return `<div class="card"><div class="head"><i class="dot" style="background:#f59e0b"></i><b>${this.t("validation")}</b>${this.help("validation")}<span class="muted small right">${this.t("found", { n: list.length })}</span></div>
      ${groups.map(group).join("")}${single.map(row).join("")}<p class="muted small">${this.t("clearWarn")}</p></div>`;
  }

  unaccountedCard() {
    const u = this.extra?.unaccounted;
    if (!u) return "";
    const share = u.share != null && u.share > 0.1;
    const sug = u.suggestions || [];
    const row = (s) => `<label class="irow pick"><input type="checkbox" data-meter="${esc(s.statistic_id)}" ${this.mpicked.has(s.statistic_id) ? "checked" : ""}><span class="box"></span>
        <div class="grow"><div class="name">${esc(s.name)}</div><div class="muted small">${this.num(s.kwh)} kWh · <span class="mono">${esc(s.statistic_id)}</span></div></div></label>`;
    return `<div class="card"><div class="head"><span class="gicon meters"><ha-icon icon="mdi:chart-donut"></ha-icon></span><div class="grow"><b>${this.t("unaccounted")}</b>
        <div class="muted small">${esc(share ? this.t("unaccountedText", { p: `${Math.round(u.share * 100)} %`, d: u.days }) : this.t("unaccountedOk"))}</div></div></div>
      ${share ? `<div class="bar big"><div style="width:${Math.round((1 - u.share) * 100)}%;background:#22a06b"></div></div>` : ""}
      ${sug.length ? `<b class="small">${this.t("addMeters")}</b>${sug.map(row).join("")}<button class="primary" data-act="addMeters" ${this.mpicked.size ? "" : "disabled"}>${this.t("add", { n: this.mpicked.size })}</button>` : ""}
    </div>`;
  }

  // ---------- data ----------

  rows() {
    // One row per device (or entity without one); all signal-strength entities together in one row.
    const rows = new Map();
    for (const e of this.data.entities) {
      const key = SIGNAL.test(e.entity_id) && !e.deleted ? "signals" : e.device ? `d:${e.device}` : `e:${e.entity_id}`;
      if (!rows.has(key)) rows.set(key, { key, name: key === "signals" ? this.t("signalsRow") : e.device_name || e.name, entities: [], group: key === "signals" ? "signals" : e.group });
      rows.get(key).entities.push(e);
    }
    return [...rows.values()].map((r) => {
      r.bytes = r.entities.reduce((a, e) => a + e.bytes, 0);
      r.per_day = r.entities.reduce((a, e) => a + e.per_day, 0);
      r.deleted = r.entities.every((e) => e.deleted);
      r.used = r.entities.some((e) => e.used_in.length);
      r.history = r.entities.some((e) => e.history_used);
      r.protected = r.entities.some((e) => e.protected);
      r.kept = Math.max(0, ...r.entities.map((e) => e.keep_days || 0)) || null;
      const busy = r.per_day >= 500;
      r.status = r.deleted ? "deleted" : r.protected ? "protected" : r.history ? "history" : r.used ? (busy ? "value_busy" : "value") : busy ? "busy" : "clean";
      return r;
    }).sort((a, b) => b.bytes - a.bytes);
  }

  // The Zigbee2MQTT sensor device behind a row, when Energy Doctor can make it save less often.
  lowerable(r) {
    if (!this.rates || !r.key.startsWith("d:")) return null;
    const id = r.key.slice(2);
    for (const g of this.rates.groups) {
      const d = g.devices.find((x) => x.id === id);
      if (d) return d.level === "rare" || (d.used && d.level === "normal") ? null : d;
    }
    return null;
  }

  dataRow(r, max) {
    const open = this.openRows.has(r.key);
    const pct = Math.max(2, Math.round((r.bytes / (max || 1)) * 100));
    const pill = { deleted: "grey", history: "blue", protected: "grey", value: "blue", value_busy: "amber", busy: "amber", clean: "green" }[r.status];
    const excluded = new Set(this.settings.exclude || []);
    const stop = !r.used && !r.deleted && !r.entities.every((e) => excluded.has(e.entity_id));
    const lower = !r.protected && ["busy", "value", "value_busy"].includes(r.status) ? this.lowerable(r) : null;
    const action = r.deleted
      ? `<button class="soft redbg" data-act="cleanRow" data-key="${esc(r.key)}">${this.t("remove")}</button>`
      : r.status === "value_busy" ? `<button class="soft" data-act="trimRow" data-key="${esc(r.key)}">${this.t("trimRow")}</button>${lower ? `<button class="soft" data-act="lowerRow" data-key="${esc(r.key)}">${this.t("lower")}</button>` : ""}`
      : lower ? `<button class="soft" data-act="lowerRow" data-key="${esc(r.key)}">${this.t("lower")}</button>`
      : stop && !r.protected ? `<button class="soft" data-act="stopRow" data-key="${esc(r.key)}">${this.t("stopSaving")}</button>` : "";
    const statusText = r.status === "busy" && !lower ? this.t("busyOnly") : ["clean", "busy", "deleted"].includes(r.status) ? this.t(`status.${r.status}`) : this.t(`st2.${r.status}`);
    const details = open ? r.entities.map((e) => `<div class="sub">
        <div class="line"><span>${esc(e.name)}</span><span class="nowrap muted">${this.bytes(e.bytes)}</span></div>
        <div class="mono small muted">${esc(e.entity_id)} · ${esc(this.t("rows", { n: this.num(e.rows, 0), d: this.num(e.per_day, 0) }))}</div>
        ${e.used_in.length ? `<div class="chips">${e.used_in.slice(0, 8).map((u) => `<span class="chip ${u.history ? "hist" : ""}"><ha-icon icon="${USE_ICON[u.kind] || "mdi:link"}"></ha-icon>${esc(u.kind === "energy" ? this.t("groups.energy") : u.name)}${u.history ? ` · ${this.t("historyTag")}` : ""}</span>`).join("")}</div>` : `<div class="small muted">${this.t("unused")}</div>`}
        <div class="row wrap">${!e.deleted ? `<button class="link small" data-act="protect" data-id="${esc(e.entity_id)}">${e.protected ? this.t("protectOff") : this.t("protectOn")}</button>${this.help("protect")}` : ""}
        ${e.keep_days ? `<button class="link small" data-act="unkeep" data-id="${esc(e.entity_id)}">${this.t("unkeep")}</button>` : ""}</div>
      </div>`).join("") : "";
    return `<div class="erow">
      <button class="rowhead" data-act="toggleRow" data-key="${esc(r.key)}" aria-expanded="${open}">
        <span class="line"><span class="name">${esc(r.name)}</span><span class="nowrap">${this.bytes(r.bytes)}</span></span>
        <span class="bar"><span style="width:${pct}%;background:${COLORS[r.group] || COLORS.other}"></span></span>
        <span class="meta"><span class="pill ${pill}">${esc(statusText)}</span>${r.kept ? `<span class="pill grey">${esc(this.t("keptPill", { k: r.kept }))}</span>` : ""}${r.entities.length > 1 ? `<span class="muted small">${this.t("nEntities", { n: r.entities.length })}</span>` : ""}<ha-icon class="chev" icon="${open ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon></span>
      </button>
      ${action ? `<div class="rowact">${action}</div>` : ""}
      ${details}
    </div>`;
  }

  dataTab() {
    const q = this.query.trim().toLowerCase();
    const all = this.rows();
    const groupsOf = { clean: ["clean", "busy", "value_busy"], used: ["history", "value", "value_busy", "protected"], deleted: ["deleted"] };
    const inFilter = (r, f) => f === "all" || groupsOf[f].includes(r.status);
    const list = all.filter((r) => inFilter(r, this.filter) && (!q || r.name.toLowerCase().includes(q) || r.entities.some((e) => e.entity_id.includes(q))));
    const max = list[0]?.bytes || 1;
    const chips = ["all", "clean", "used", "deleted"].map((f) => `<button class="fchip ${this.filter === f ? "on" : ""}" data-act="filter" data-filter="${f}">${this.t(`filters.${f}`)} <span>${all.filter((r) => inFilter(r, f)).length}</span></button>`).join("");
    const u = this.data.usage || {};
    const unseen = (u.unseen_addons || []).length ? `<div class="card warncard"><ha-icon icon="mdi:eye-off-outline"></ha-icon><div class="grow small">${esc(this.t("unseen", { list: u.unseen_addons.join(", ") }))}</div></div>` : "";
    return `${unseen}<div class="card span"><div class="head"><h2>${this.t("dataTitle")}</h2>${this.help("history")}</div>
        ${(u.outside_read || []).length ? `<div class="small muted">${esc(this.t("outsideRead", { list: u.outside_read.join(", ") }))}</div>` : ""}
        <div class="fchips">${chips}</div>
        <input id="q" class="search" type="search" placeholder="${this.t("search")}" value="${esc(this.query)}" aria-label="${this.t("search")}">
        ${this.toast ? `<p class="small green">${esc(this.toast)}</p>` : ""}
        ${list.slice(0, this.limit).map((r) => this.dataRow(r, max)).join("")}
        ${list.length > this.limit ? `<button class="link" data-act="more">${this.t("showMore")} (${list.length - this.limit})</button>` : ""}
      </div>`;
  }

  // ---------- settings ----------

  ratesSection() {
    if (!this.settings.mqtt) return "";
    const r = this.rates;
    if (!r) return `<div class="card"><h2>${this.t("ratesTitle")}</h2><div class="spinner small-spin"></div></div>`;
    if (!r.groups.length && !r.signals.count) return `<div class="card"><h2>${this.t("ratesTitle")}</h2><p class="muted">${this.t("noZ2m")}</p></div>`;
    const cur = (key, fallback) => this.choice[key] || fallback;
    const seg = (key, options, current) => `<div class="seg" role="radiogroup">${options.map((o) => `<button role="radio" aria-checked="${current === o}" class="${current === o ? "on" : ""}" data-act="level" data-key="${key}" data-level="${o}">${key === "signals" ? this.t(o) : this.t(`levels.${o}`)}</button>`).join("")}</div>`;
    const deviceRow = (d) => `<div class="drow"><span class="grow">${esc(d.name)}${d.used ? ` <span class="pill blue">${this.t("status.used")}</span>` : ""}</span>
        <select data-device="${d.id}" aria-label="${esc(d.name)}">${["group", "often", "normal", "rare", "never"].map((o) => `<option value="${o}" ${(this.overrides[d.id] || "group") === o ? "selected" : ""}>${this.t(`levels.${o}`)}</option>`).join("")}</select></div>`;
    const group = (g) => {
      const level = cur(g.key, g.level);
      const save = g.saving[level] || 0;
      const open = this.openGroups.has(g.key);
      return `<div class="card"><div class="head"><span class="gicon ${g.key}"><ha-icon icon="${GROUP_ICON[g.key]}"></ha-icon></span><div class="grow"><b>${this.t(`rgroups.${g.key}`)}</b>
          <div class="muted small">${this.t("nDevices", { n: g.devices.length })}${save ? ` · ${this.t("perMonth", { n: this.bytes(save) })}` : ""}</div></div></div>
        ${seg(g.key, ["often", "normal", "rare"], level)}
        <div class="muted small">${this.t(`levelHelp.${level}`)}</div>
        <button class="link" data-act="toggleGroup" data-key="${g.key}">${this.t("devicesShow")} <ha-icon icon="${open ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon></button>
        ${open ? g.devices.map(deviceRow).join("") : ""}</div>`;
    };
    const sig = r.signals;
    const profile = Object.entries(r.profiles).find(([, lv]) => Object.entries(lv).every(([k, v]) => this.choice[k] === v))?.[0];
    const skipped = r.skipped || [];
    return `<div class="card"><div class="head"><h2>${this.t("ratesTitle")}</h2>${this.help("rates")}</div><p class="muted small">${this.t("ratesIntro")}</p>
        <b>${this.t("profile")}</b><div class="profiles">${Object.keys(r.profiles).map((p) => `<button class="${profile === p ? "on" : ""}" data-act="profile" data-profile="${p}">${this.t(`profiles.${p}`)}</button>`).join("")}</div></div>
      ${r.groups.map(group).join("")}
      ${sig.count ? `<div class="card"><div class="head"><span class="gicon signals"><ha-icon icon="mdi:signal"></ha-icon></span><div class="grow"><b>${this.t("signals")}</b>
          <div class="muted small">${this.t("signalsText", { n: sig.can_off })}${sig.saving ? ` · ${this.t("perMonth", { n: this.bytes(sig.saving) })}` : ""}</div></div></div>${seg("signals", ["on", "off"], cur("signals", sig.level))}</div>` : ""}
      ${skipped.length ? `<details class="card why"><summary><b>${this.t("whyNot")}</b> <span class="muted small">(${skipped.length})</span></summary>
          ${skipped.map((s) => `<div class="irow"><div class="grow"><div class="name">${esc(s.name)}</div><div class="small muted">${esc(this.t(`reasons.${s.reason}`, { d: s.detail }))}</div></div></div>`).join("")}</details>` : ""}
      <div class="actions"><button class="primary" data-act="applyRates">${this.t("applyRates")}</button></div>`;
  }

  settingsTab() {
    const s = this.settings;
    const toggle = (key, label) => `<label class="trow"><span class="grow">${label}</span><input type="checkbox" class="switch" data-setting="${key}" ${s[key] ? "checked" : ""}></label>`;
    const groups = ["sensors", "signals", "lights", "other", "energy"];
    const keep = (g) => `<div class="drow"><span class="grow">${this.t(`groups.${g}`)}</span><select data-retention="${g}" aria-label="${this.t(`groups.${g}`)}">${[0, 30, 10, 3].map((d) => `<option value="${d}" ${(Number(s.retention?.[g]) || 0) === d ? "selected" : ""}>${d ? this.t("keepDays", { n: d }) : this.t("keepAll")}</option>`).join("")}</select></div>`;
    const exclude = s.exclude || [];
    const yaml = `recorder:\n  exclude:\n    entities:\n${exclude.map((e) => `      - ${e}`).join("\n")}`;
    return `${this.ratesSection()}
      <div class="card"><div class="head"><h2>${this.t("retention")}</h2>${this.help("trim")}</div><p class="muted small">${this.t("retentionIntro")}</p>${groups.map(keep).join("")}</div>
      <div class="card"><h2>${this.t("notifications")}</h2>${toggle("auto_new", this.t("autoNew"))}${toggle("notify_energy", this.t("notifyEnergy"))}${toggle("weekly_report", this.t("weekly"))}</div>
      <div class="card"><h2>${this.t("stopList")}</h2>
        ${exclude.length ? `<p class="muted small">${this.t("stopListIntro")}</p><pre>${esc(yaml)}</pre>
          <div class="row"><button class="soft" data-act="copyYaml">${this.t(this.copied ? "copied" : "copy")}</button></div>
          ${exclude.map((e) => `<div class="drow"><span class="mono small grow">${esc(e)}</span><button class="soft" data-act="unexclude" data-id="${esc(e)}">${this.t("remove")}</button></div>`).join("")}`
        : `<p class="muted small">${this.t("stopListEmpty")}</p>`}</div>
      ${!s.ai ? `<div class="card"><h2>${this.t("aiTitle")}</h2><p class="muted small">${this.t("aiHint")}</p></div>` : ""}`;
  }

  // ---------- other views ----------

  cleanView() {
    const s = this.cleanPlan || this.data.suggestion;
    const items = s.items || [];
    const protectedCount = (this.data.entities || []).filter((e) => e.protected).length;
    const what = s.trim.length && s.deleted.length ? this.t("cleanWhat", { t: s.trim.length, k: s.keep_days, d: s.deleted.length })
      : s.trim.length ? this.t("cleanWhatTrim", { t: s.trim.length, k: s.keep_days }) : this.t("cleanWhatDeleted", { d: s.deleted.length });
    const safe = [
      this.t("safe1"),
      ...(s.trim.length ? [this.t("safe2"), this.t("safe3")] : []),
      ...(protectedCount ? [this.t("safe4", { n: protectedCount })] : []),
    ];
    const why = (i) => i.kind === "deleted" ? this.t("whyGone")
      : !i.uses.length ? this.t("whyUnused")
      : this.t("whyValue", { list: [...new Set(i.uses.map((u) => (u.kind === "energy" ? this.t("groups.energy") : u.name)))].join(", ") });
    const row = (i) => `<div class="citem"><div class="line"><span class="name">${esc(i.name)}</span><span class="nowrap muted">${this.bytes(i.bytes)}</span></div>
        <div class="small muted">${esc(why(i))}</div></div>`;
    return `<div class="card hero">
        <span class="eyebrow">${this.t("cleanTitle")}</span>
        <span class="big">${s.bytes ? this.t("save", { n: this.bytes(s.bytes) }) : this.t("cleanup")}</span>
        <span>${esc(what)}</span>
      </div>
      <div class="card"><b>${this.t("safeTitle")}</b>
        ${safe.map((x) => `<div class="hrow ok"><ha-icon icon="mdi:check-circle"></ha-icon><span>${esc(x)}</span></div>`).join("")}
      </div>
      ${items.length ? `<details class="card clist"><summary><span class="grow"><b>${this.t("seeWhat", { n: items.length })}</b></span><ha-icon icon="mdi:chevron-down"></ha-icon></summary>
        <div class="cscroll">${items.map(row).join("")}</div></details>` : ""}
      <div class="card warncard"><ha-icon icon="mdi:shield-alert-outline"></ha-icon><div class="grow"><span>${this.t("cleanWarn")}</span>
        ${this.settings.backup ? `<label class="irow pick nob"><input type="checkbox" id="backup" ${this.backup ? "checked" : ""}><span class="box"></span><span class="grow">${this.t("backupFirst")}</span></label>` : `<br><a href="/config/backup" target="_top">${this.t("makeBackup")}</a>`}
        <label class="irow pick nob"><input type="checkbox" id="repack" ${this.repack ? "checked" : ""}><span class="box"></span><span class="grow">${this.t("repackAfter")}</span></label></div></div>
      ${s.trim.length ? `<div class="card"><label class="irow pick nob"><input type="checkbox" id="keepRule" ${this.keepRule ? "checked" : ""}><span class="box"></span><span class="grow">${esc(this.t("keepRule", { k: s.keep_days }))}</span></label></div>` : ""}
      <div class="actions"><button class="ghost" data-act="tabs">${this.t("back")}</button>
        <button class="primary" data-act="cleanDo">${s.bytes ? this.t("cleanDo", { n: this.bytes(s.bytes) }) : this.t("cleanup")}</button></div>`;
  }

  welcomeView() {
    const steps = [["mdi:stethoscope", "w1t", "w1"], ["mdi:shield-check", "w2t", "w2"], ["mdi:undo-variant", "w3t", "w3"]];
    const [icon, title, text] = steps[this.step];
    return `<div class="card welcome"><div class="wicon"><ha-icon icon="${icon}"></ha-icon></div><h2>${this.t(title)}</h2><p class="lead">${this.t(text)}</p>
        <div class="dots">${steps.map((_, i) => `<i class="${i === this.step ? "on" : ""}"></i>`).join("")}</div></div>
      <div class="actions"><button class="ghost" data-act="welcomeDone">${this.t("skip")}</button>
        <button class="primary" data-act="${this.step < 2 ? "welcomeNext" : "welcomeDone"}">${this.t(this.step < 2 ? "next" : "start")}</button></div>`;
  }

  doneView() {
    return `<div class="card done"><ha-icon icon="mdi:check-circle"></ha-icon><h2>${esc(this.doneTitle)}</h2>${this.doneText ? `<p class="muted">${esc(this.doneText)}</p>` : ""}</div>
      <div class="actions">${this.doneUndo ? `<button class="ghost" data-act="undo" data-id="${this.doneUndo}">${this.t("undo")}</button>` : ""}<button class="primary" data-act="fresh">${this.t("home")}</button></div>`;
  }

  workingView() {
    const [title, hint] = this.workingText || [this.t("working"), this.t("workingHint")];
    return `<div class="card working"><div class="spinner"></div><b>${esc(title)}</b><span class="muted small">${esc(hint)}</span></div>`;
  }

  render() {
    const tabs = this.view === "tabs";
    let body;
    if (this.data && !this.welcomed && this.view === "tabs") body = this.welcomeView();
    else if (this.view === "working") body = this.workingView();
    else if (this.view === "clean") body = this.cleanView();
    else if (this.view === "done") body = this.doneView();
    else if (!this.data) body = `<div class="card"><p class="red">${esc(this.message)}</p><button class="primary" data-act="fresh">${this.t("fresh")}</button></div>`;
    else body = `${this.message ? `<div class="card"><p class="red">${esc(this.message)}</p></div>` : ""}${{ overview: () => this.overviewTab(), energy: () => this.energyTab(), data: () => this.dataTab(), settings: () => this.settingsTab() }[this.tab]()}`;
    // The badge counts things to look at: each wrong hour, and each group of statistics warnings.
    const vtypes = this.validationGroups();
    const issues = this.data ? this.visibleIssues().length + vtypes.size : 0;
    const tabBar = tabs && this.data && this.welcomed ? `<nav class="tabs" role="tablist">${["overview", "energy", "data", "settings"].map((t) => `<button role="tab" aria-selected="${this.tab === t}" class="${this.tab === t ? "on" : ""}" data-act="tab" data-tab="${t}">${this.t(`tabs.${t}`)}${t === "energy" && issues ? `<span class="badge">${issues}</span>` : ""}</button>`).join("")}</nav>` : "";
    const y = this.scrollTop;
    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
      <div class="top"><div class="toolbar">${customElements.get("ha-menu-button") ? "<ha-menu-button></ha-menu-button>" : ""}
        ${["clean", "done"].includes(this.view) ? `<button class="tb-back" data-act="tabs" aria-label="${this.t("back")}"><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : ""}
        <div class="tb-title">${this.t("title")}</div></div>${tabBar}</div>
      <div class="page ${tabs && this.data && this.welcomed && ["overview", "energy"].includes(this.tab) ? "cols" : ""} ${this.animate && this.data ? "anim" : ""}">${body}</div>
      ${this.snack ? `<div class="snack" role="status"><span class="grow">${esc(this.snack.text)}</span>${this.snack.undo ? `<button class="snackbtn" data-act="undo" data-id="${this.snack.undo}">${this.t("snackUndo")}</button>` : ""}<button class="snackx" data-act="snackClose" aria-label="×"><ha-icon icon="mdi:close"></ha-icon></button></div>` : ""}`;
    if (this.data && this.view === "tabs") this.animate = false;
    this.scrollTop = y;
    const menu = this.shadowRoot.querySelector("ha-menu-button");
    if (menu) {
      menu.hass = this._hass;
      menu.narrow = this._narrow;
    }
    this.bind();
  }

  bind() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-act]").forEach((el) => el.addEventListener("click", () => this.act(el.dataset)));
    const check = (sel, set, attr) => root.querySelectorAll(sel).forEach((el) => el.addEventListener("change", () => {
      if (el.checked) set.add(el.dataset[attr]);
      else set.delete(el.dataset[attr]);
      this.render();
    }));
    check("input[data-pick]", this.picked, "pick");
    check("input[data-meter]", this.mpicked, "meter");
    const backup = root.getElementById("backup");
    if (backup) backup.addEventListener("change", () => (this.backup = backup.checked));
    const keepRule = root.getElementById("keepRule");
    if (keepRule) keepRule.addEventListener("change", () => (this.keepRule = keepRule.checked));
    const repack = root.getElementById("repack");
    if (repack) repack.addEventListener("change", () => (this.repack = repack.checked));
    const q = root.getElementById("q");
    if (q) q.addEventListener("input", () => {
      this.query = q.value;
      this.limit = 10;
      const pos = q.selectionStart;
      this.render();
      const again = this.shadowRoot.getElementById("q");
      again.focus();
      again.setSelectionRange(pos, pos);
    });
    root.querySelectorAll("select[data-device]").forEach((el) => el.addEventListener("change", () => {
      if (el.value === "group") delete this.overrides[el.dataset.device];
      else this.overrides[el.dataset.device] = el.value;
    }));
    root.querySelectorAll("select[data-retention]").forEach((el) => el.addEventListener("change", () => {
      const retention = { ...(this.settings.retention || {}), [el.dataset.retention]: Number(el.value) || null };
      this.saveSettings({ retention });
    }));
    root.querySelectorAll("input[data-setting]").forEach((el) => el.addEventListener("change", () => this.saveSettings({ [el.dataset.setting]: el.checked })));
  }

  async saveSettings(changes) {
    try {
      this.settings = { ...this.settings, ...(await this.ws("set_settings", changes)) };
    } catch (e) {
      this.message = this.t("error", { e: e.message || e });
    }
    this.render();
  }

  async run(job, title, text = "") {
    this.view = "working";
    this.render();
    const reset = () => (this.workingText = null);
    try {
      const r = await job();
      // Stay where you were, with a short message and Undo at the bottom.
      const t = typeof title === "function" ? title(r) : title;
      this.showSnack(text ? `${t} – ${text}` : t, r?.undoable ? r.id : null);
      this.view = "tabs";
      reset();
      this.render();
      await this.load(true, true);
      return;
    } catch (e) {
      this.message = this.t("error", { e: e.message || e });
      this.view = "tabs";
      reset();
    }
    this.render();
  }

  showSnack(text, undo = null) {
    clearTimeout(this._snackTimer);
    this.snack = { text, undo };
    this._snackTimer = setTimeout(() => {
      this.snack = null;
      this.render();
    }, undo ? 10000 : 6000);
  }

  rowByKey(key) {
    return this.rows().find((r) => r.key === key);
  }

  act(d) {
    const a = d.act;
    this.toast = "";
    if (a === "welcomeNext") {
      this.step += 1;
      return this.render();
    }
    if (a === "welcomeDone") {
      this.welcomed = true;
      try {
        localStorage.setItem("energy_doctor_welcomed", "1");
      } catch (e) {
        /* private window: shown again next time */
      }
      this.animate = true;
      return this.render();
    }
    if (a === "snackClose") {
      this.snack = null;
      return this.render();
    }
    if (a === "tab") {
      this.tab = d.tab;
      this.view = "tabs";
      if (d.tab === "energy" && !this.picked.size) this.picked = new Set(this.visibleIssues().map((i) => i.id));
      this.scrollTop = 0;
      this.render();
    } else if (a === "tabs") {
      this.view = "tabs";
      this.render();
    } else if (a === "fresh") {
      this.message = "";
      this.load(true);
    } else if (a === "clean") {
      this.cleanPlan = null;
      this.view = "clean";
      this.render();
    } else if (a === "cleanRow") {
      const r = this.rowByKey(d.key);
      this.cleanPlan = { deleted: r.entities.map((e) => e.entity_id), trim: [], keep_days: 0, bytes: r.bytes,
        items: r.entities.map((e) => ({ entity_id: e.entity_id, name: e.name, bytes: e.bytes, kind: "deleted", uses: [] })) };
      this.view = "clean";
      this.render();
    } else if (a === "cleanDo") {
      const s = this.cleanPlan || this.data.suggestion;
      const backup = Boolean(this.settings.backup && this.backup);
      this.run(async () => {
        // Each step says what it is waiting for: the backup can take minutes, the clean-up is quick.
        if (backup) {
          this.workingText = [this.t("backupWorking"), this.t("backupHint")];
          this.render();
          await this.ws("backup");
        }
        this.workingText = [this.t("cleaning"), ""];
        this.render();
        return this.ws("cleanup", { deleted: s.deleted, trim: s.trim, keep_days: s.keep_days, backup: false, repack: this.repack, keep_rule: this.keepRule });
      }, this.t("cleanDone"), this.t("cleanDoneText"));
    } else if (a === "fixPicked") {
      const ids = [...this.picked];
      this.run(async () => ({ ...(await this.ws("fix_energy", { issues: ids })), undoable: true }), (r) => this.t("fixedN", { n: r.fixed }));
    } else if (a === "fixValidation") {
      const v = this.extra.validation.find((x) => x.id === d.id);
      if (v?.fix === "clear" && !window.confirm(this.t("clearWarn"))) return;
      this.run(() => this.ws("fix_validation", { issues: [d.id] }), this.t("saved"));
    } else if (a === "clearGroup") {
      const ids = this.extra.validation.filter((v) => v.type === d.type && !v.in_energy).map((v) => v.id);
      if (!window.confirm(this.t("clearWarn"))) return;
      this.run(() => this.ws("fix_validation", { issues: ids }), this.t("saved"));
    } else if (a === "addMeters") {
      const ids = [...this.mpicked];
      this.run(async () => ({ ...(await this.ws("add_to_energy", { statistics: ids })), undoable: true }), (r) => this.t("addedN", { n: r.added }));
    } else if (a === "repackNow") {
      this.run(() => this.ws("repack", { record: d.id }), this.t("recRepacking"));
    } else if (a === "undo") {
      this.run(() => this.ws("undo", { record: d.id }), this.t("undone"));
    } else if (a === "toggleRow") {
      if (this.openRows.has(d.key)) this.openRows.delete(d.key);
      else this.openRows.add(d.key);
      this.render();
    } else if (a === "toggleGroup") {
      if (this.openGroups.has(d.key)) this.openGroups.delete(d.key);
      else this.openGroups.add(d.key);
      this.render();
    } else if (a === "stopRow") {
      const r = this.rowByKey(d.key);
      const ids = r.entities.filter((e) => !e.used_in.length && !e.protected).map((e) => e.entity_id);
      this.run(async () => {
        const res = await this.ws("stop_saving", { entities: ids });
        this.settings = { ...this.settings, ...(await this.ws("settings")) };
        return res;
      }, (res) => [res.stopped ? this.t("stopDone", { s: res.stopped }) : "", res.listed ? this.t("stopListed", { l: res.listed }) : ""].filter(Boolean).join(" · "));
    } else if (a === "trimRow") {
      const r = this.rowByKey(d.key);
      const ids = r.entities.filter((e) => !e.history_used && !e.protected).map((e) => e.entity_id);
      const keep = r.entities.filter((e) => ids.includes(e.entity_id));
      this.cleanPlan = { deleted: [], trim: ids, keep_days: 3, bytes: keep.reduce((a, e) => a + Math.max(0, e.bytes - e.per_day * 3 * 300), 0),
        items: keep.map((e) => ({ entity_id: e.entity_id, name: e.name, bytes: e.bytes, kind: "trim", uses: e.used_in })) };
      this.view = "clean";
      this.render();
    } else if (a === "unkeep") {
      const keep = { ...(this.settings.keep || {}) };
      delete keep[d.id];
      for (const e of this.data.entities) if (e.entity_id === d.id) e.keep_days = null;
      this.saveSettings({ keep });
    } else if (a === "protect") {
      const set = new Set(this.settings.protect || []);
      if (set.has(d.id)) set.delete(d.id);
      else set.add(d.id);
      for (const e of this.data.entities) if (e.entity_id === d.id) e.protected = set.has(d.id);
      this.saveSettings({ protect: [...set] });
    } else if (a === "lowerRow") {
      const r = this.rowByKey(d.key);
      const device = this.lowerable(r);
      if (!device) return;
      // Its own level, as low as is safe ("rare", or "normal" when something uses it); the groups stay as chosen.
      const overrides = { ...(this.settings.overrides || {}), [device.id]: device.used ? "normal" : "rare" };
      this.run(async () => {
        await this.ws("set_settings", { overrides });
        this.overrides = overrides;
        return { ...(await this.ws("set_rates", { levels: { ...(this.rates.chosen || {}) } })), undoable: true };
      }, this.t("loweredOne", { n: r.name }));
    } else if (a === "unexclude") {
      this.saveSettings({ exclude: (this.settings.exclude || []).filter((e) => e !== d.id) });
    } else if (a === "copyYaml") {
      const exclude = this.settings.exclude || [];
      navigator.clipboard?.writeText(`recorder:\n  exclude:\n    entities:\n${exclude.map((e) => `      - ${e}`).join("\n")}\n`);
      this.copied = true;
      this.render();
      setTimeout(() => {
        this.copied = false;
        this.render();
      }, 2000);
    } else if (a === "filter") {
      this.filter = d.filter;
      this.limit = 10;
      this.render();
    } else if (a === "more") {
      this.limit += 20;
      this.render();
    } else if (a === "level") {
      this.choice[d.key] = d.level;
      this.render();
    } else if (a === "profile") {
      this.choice = { ...this.rates.profiles[d.profile] };
      this.render();
    } else if (a === "applyRates") {
      const levels = {};
      for (const g of this.rates.groups) if (this.choice[g.key] && this.choice[g.key] !== "mixed") levels[g.key] = this.choice[g.key];
      if (this.choice.signals) levels.signals = this.choice.signals;
      this.run(async () => {
        await this.ws("set_settings", { overrides: this.overrides });
        return { ...(await this.ws("set_rates", { levels })), undoable: true };
      }, (r) => this.t("ratesDone", { d: r.devices, s: r.signals }));
    } else if (a === "explain") {
      this.explaining = true;
      this.render();
      this.ws("explain").then((r) => (this.aiText = r.text)).catch((e) => (this.aiText = this.t("error", { e: e.message || e }))).finally(() => {
        this.explaining = false;
        this.render();
      });
    }
  }
}

const STYLE = `
:host{--ed-green:#22a06b;--ed-amber:#f59e0b;--ed-red:#d92d20;--ed-track:var(--divider-color,#e8ecf1);--ed-green-bg:#e7f6ee;--ed-green-fg:#22663f;--ed-amber-bg:#fef0c7;--ed-amber-fg:#93370d;--ed-blue-bg:#e6f2f9;--ed-blue-fg:#0b4f75;--ed-grey-bg:#eef1f4;--ed-grey-fg:#475467;--ed-red-bg:#fde8e7;--ed-red-fg:#b42318;--ed-warn-bg:#fffaeb;--ed-purple-bg:#f1ecfe;--ed-purple-fg:#6d3fdb}
:host([dark]){--ed-green-bg:rgba(34,160,107,.18);--ed-green-fg:#6fd6a4;--ed-amber-bg:rgba(245,158,11,.18);--ed-amber-fg:#fcc463;--ed-blue-bg:rgba(56,152,214,.2);--ed-blue-fg:#8cc8ee;--ed-grey-bg:rgba(255,255,255,.08);--ed-grey-fg:#c3cad4;--ed-red-bg:rgba(217,45,32,.2);--ed-red-fg:#ff9a91;--ed-warn-bg:rgba(245,158,11,.12);--ed-purple-bg:rgba(139,92,246,.2);--ed-purple-fg:#c4b0fb}
:host{display:block;height:100vh;overflow-y:auto;background:var(--primary-background-color,#f2f4f7);color:var(--primary-text-color,#1c2430);font-family:var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif)}
.top{position:sticky;top:0;z-index:3}
.toolbar{height:56px;display:flex;align-items:center;gap:4px;padding:0 8px;background:var(--app-header-background-color,var(--primary-color,#03a9f4));color:var(--app-header-text-color,#fff)}
.tb-title{font-size:20px;font-weight:400;margin-left:8px}
.tb-back{background:none;border:0;color:inherit;width:44px;height:44px;border-radius:50%;cursor:pointer}
.tabs{display:flex;background:var(--app-header-background-color,var(--primary-color,#03a9f4));overflow-x:auto;scrollbar-width:none}
.tabs button{flex:1 0 auto;min-height:48px;padding:0 14px;border:0;background:none;color:var(--app-header-text-color,#fff);opacity:.75;font-size:14px;font-weight:500;letter-spacing:.3px;border-bottom:3px solid transparent;display:flex;align-items:center;justify-content:center;gap:6px}
.tabs button.on{opacity:1;border-bottom-color:var(--app-header-text-color,#fff)}
.badge{min-width:18px;height:18px;border-radius:9px;background:#d92d20;color:#fff;font-size:11px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px;box-sizing:border-box}
.page{max-width:640px;margin:0 auto;padding:16px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}
.card{background:var(--card-background-color,#fff);border-radius:var(--ha-card-border-radius,16px);padding:18px;box-shadow:var(--ha-card-box-shadow,0 1px 3px rgba(16,24,40,.08));display:flex;flex-direction:column;gap:10px}
h2{margin:0;font-size:20px;font-weight:500}
.muted{color:var(--secondary-text-color,#5b6676)}.small{font-size:13px}.mono{font-family:ui-monospace,monospace;overflow-wrap:anywhere}
.red{color:var(--error-color,#b42318)}.amber{color:var(--ed-amber-fg)}.green{color:var(--success-color,#22663f)}
.ringcard{align-items:center;text-align:center}
.ring{position:relative;width:196px;height:196px}.ring svg{width:196px;height:196px}
.center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.center b{font-size:32px;font-weight:700}.center span{font-size:13px;color:var(--secondary-text-color,#5b6676)}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;font-size:13px}.legend.left{justify-content:flex-start}
.leg{display:flex;align-items:center;gap:6px}.leg i{width:10px;height:10px;border-radius:5px;display:inline-block}
.lead{margin:0;font-size:15px;line-height:1.45}.lead.left{text-align:left}
.graph{width:100%;height:auto}.gl{font-size:12px;font-weight:500}.gl.red{fill:var(--ed-red-fg)}.gl.green{fill:var(--ed-green-fg)}
.hero{background:var(--primary-color,#0b6fa4);color:var(--text-primary-color,#fff)}
.hero .eyebrow{font-size:13px;font-weight:500;letter-spacing:.4px;text-transform:uppercase;opacity:.85}
.hero .big{font-size:26px;font-weight:700}
.row{display:flex;gap:10px}
button{font-family:inherit;cursor:pointer}
.white{flex:1;height:48px;border-radius:12px;border:0;background:var(--card-background-color,#fff);color:var(--primary-color,#0b6fa4);font-size:16px;font-weight:500}
.primary{flex:1;min-height:52px;border-radius:14px;border:0;background:var(--primary-color,#0b6fa4);color:var(--text-primary-color,#fff);font-size:16px;font-weight:500;padding:0 18px}
.primary:disabled{opacity:.45;cursor:default}
.ghost{min-height:52px;padding:0 18px;border-radius:14px;border:1px solid var(--divider-color,#c4ccd6);background:var(--card-background-color,#fff);color:var(--primary-color,#0b6fa4);font-size:15px;font-weight:500}
.soft{min-height:40px;min-width:64px;padding:0 14px;border-radius:10px;border:0;background:var(--secondary-background-color,#eef1f4);color:var(--primary-text-color);font-size:14px;font-weight:500;flex:none}
.linkbtn{display:inline-flex;align-items:center;text-decoration:none}
.redbg{background:var(--ed-red-bg);color:var(--ed-red-fg)}
.link{background:none;border:0;color:var(--primary-color,#0b6fa4);font-size:14px;padding:8px 0;text-align:left;display:inline-flex;align-items:center;gap:4px;align-self:flex-start}
.center-link{align-self:center}
.head{display:flex;align-items:center;gap:10px}.head b{font-size:17px;font-weight:500}.right{margin-left:auto}
.dot{width:10px;height:10px;border-radius:5px;display:inline-block;flex:none}
.irow{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--divider-color,#eef1f4)}.irow:last-of-type{border-bottom:0}
.hrow{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.4}.hrow ha-icon{--mdc-icon-size:20px;flex:none}
.hrow.warn ha-icon{color:#b54708}.hrow.ok ha-icon{color:var(--success-color,#22a06b)}
.clist summary{display:flex;align-items:center;gap:8px;cursor:pointer;list-style:none;min-height:28px}.clist summary::-webkit-details-marker{display:none}
.clist[open] summary ha-icon{transform:rotate(180deg)}
.cscroll{max-height:420px;overflow-y:auto;margin-top:6px}.citem{padding:10px 0;border-bottom:1px solid var(--divider-color,#eef1f4)}.citem:last-child{border:0}.hrow.info ha-icon{color:var(--secondary-text-color)}
.grow{flex:1;min-width:0}.name{font-size:15px;font-weight:500;overflow-wrap:anywhere}
.erow{border-bottom:1px solid var(--divider-color,#eef1f4);padding:4px 0 10px}.erow:last-of-type{border-bottom:0}
.rowhead{all:unset;display:flex;flex-direction:column;gap:6px;width:100%;padding:8px 0;cursor:pointer;box-sizing:border-box}
.rowhead:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px;border-radius:8px}
.line{display:flex;justify-content:space-between;gap:12px;font-size:15px}.nowrap{white-space:nowrap}
.bar{display:block;height:6px;border-radius:3px;background:var(--secondary-background-color,#eef1f4)}.bar>span,.bar>div{display:block;height:6px;border-radius:3px}
.bar.big,.bar.big>div{height:10px;border-radius:5px}
.meta{display:flex;align-items:center;gap:8px}.chev{margin-left:auto;--mdc-icon-size:20px;color:var(--secondary-text-color)}
.pill{font-size:12px;font-weight:500;border-radius:12px;padding:3px 10px}
.pill.green{background:var(--ed-green-bg);color:var(--ed-green-fg)}.pill.amber{background:var(--ed-amber-bg);color:var(--ed-amber-fg)}.pill.blue{background:var(--ed-blue-bg);color:var(--ed-blue-fg)}.pill.grey{background:var(--ed-grey-bg);color:var(--ed-grey-fg)}
.rowact{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:8px}
.sub{margin:8px 0 0 12px;padding:8px 0 8px 12px;border-left:3px solid var(--divider-color,#e8ecf1);display:flex;flex-direction:column;gap:4px}
.chip.hist{background:var(--ed-blue-bg);color:var(--ed-blue-fg)}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{display:inline-flex;align-items:center;gap:4px;background:var(--secondary-background-color,#eef1f4);border-radius:14px;padding:4px 10px 4px 6px;font-size:12px}.chip ha-icon{--mdc-icon-size:16px}
.fchips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}
.fchip{flex:none;min-height:36px;border-radius:18px;border:1px solid var(--divider-color,#d6dce4);background:var(--card-background-color,#fff);color:var(--primary-text-color);font-size:14px;padding:0 14px}
.fchip span{color:var(--secondary-text-color);margin-left:2px}.fchip.on{background:var(--primary-color,#0b6fa4);border-color:var(--primary-color,#0b6fa4);color:#fff}.fchip.on span{color:#fff;opacity:.8}
.search{height:44px;border-radius:12px;border:1px solid var(--divider-color,#d6dce4);padding:0 14px;font-size:15px;background:var(--card-background-color,#fff);color:var(--primary-text-color);font-family:inherit}
pre{margin:0;padding:12px;border-radius:10px;background:var(--secondary-background-color,#eef1f4);font-size:12px;overflow-x:auto}
.okcard{flex-direction:row;align-items:center;gap:12px;color:var(--success-color,#22663f)}
.warncard{flex-direction:row;gap:12px;background:var(--ed-warn-bg);color:var(--ed-amber-fg)}.warncard a{color:var(--ed-amber-fg);font-weight:500}
.actions{display:flex;gap:10px;position:sticky;bottom:12px}
.pick{cursor:pointer}.pick input{position:absolute;opacity:0}
.box{width:22px;height:22px;flex:none;border-radius:6px;border:2px solid var(--secondary-text-color,#8a94a3);box-sizing:border-box}
.pick input:checked+.box{background:var(--primary-color,#0b6fa4);border-color:var(--primary-color,#0b6fa4);box-shadow:inset 0 0 0 3px var(--card-background-color,#fff)}
.pick input:focus-visible+.box{outline:2px solid var(--primary-color)}
.nob{border:0;padding:8px 0 0}
.seg{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);background:var(--secondary-background-color,#eef1f4);border-radius:10px;padding:3px;gap:3px}
.seg button{min-height:40px;border:0;border-radius:8px;background:transparent;color:var(--primary-text-color);font-size:14px}
.seg button.on{background:var(--card-background-color,#fff);color:var(--primary-color,#0b6fa4);font-weight:500;box-shadow:0 1px 2px rgba(16,24,40,.12)}
.profiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.profiles button{min-height:52px;border-radius:12px;border:1px solid var(--divider-color,#d6dce4);background:var(--card-background-color,#fff);color:var(--primary-text-color);font-size:15px}
.profiles button.on{border:2px solid var(--primary-color,#0b6fa4);background:rgba(11,111,164,.08);color:var(--primary-color,#0b6fa4);font-weight:500}
.gicon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex:none}
.gicon.climate{background:var(--ed-blue-bg);color:var(--ed-blue-fg)}.gicon.meters{background:var(--ed-amber-bg);color:var(--ed-amber-fg)}.gicon.sensors{background:var(--ed-green-bg);color:var(--ed-green-fg)}.gicon.signals{background:var(--ed-purple-bg);color:var(--ed-purple-fg)}
.drow{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--divider-color,#eef1f4)}
select{height:40px;border-radius:10px;border:1px solid var(--divider-color,#d6dce4);background:var(--card-background-color,#fff);color:var(--primary-text-color);font-family:inherit;font-size:14px;padding:0 8px;max-width:50%}
.trow{display:flex;align-items:center;gap:12px;min-height:48px;cursor:pointer;border-top:1px solid var(--divider-color,#eef1f4)}
.switch{appearance:none;width:44px;height:26px;border-radius:13px;background:var(--divider-color,#c4ccd6);position:relative;cursor:pointer;flex:none;margin:0}
.switch::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .15s}
.switch:checked{background:var(--primary-color,#0b6fa4)}.switch:checked::after{left:21px}
.switch:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}
.why summary{cursor:pointer;min-height:24px}
.vgroup{display:flex;flex-direction:column;gap:6px;padding:12px 0;border-bottom:1px solid var(--divider-color,#eef1f4)}
.row.wrap{flex-wrap:wrap;align-items:center}.vlist{max-height:240px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;padding:8px;border-radius:10px;background:var(--secondary-background-color,#eef1f4)}
.aibtn{align-self:stretch;display:flex;align-items:center;justify-content:center;gap:8px}
.working{align-items:center;text-align:center;padding:48px 18px}
.spinner{width:40px;height:40px;border-radius:50%;border:4px solid var(--divider-color,#e8ecf1);border-top-color:var(--primary-color,#0b6fa4);animation:spin 1s linear infinite}
.small-spin{width:24px;height:24px;border-width:3px;align-self:center}
.spinner.tiny{display:inline-block;width:12px;height:12px;border-width:2px;vertical-align:-2px}
@keyframes spin{to{transform:rotate(360deg)}}
.eyebrow{font-size:12px;font-weight:500;letter-spacing:.5px;text-transform:uppercase}
.scorehead{display:flex;align-items:center;gap:16px}
.mini{position:relative;width:72px;height:72px;flex:none}.mini svg{width:72px;height:72px}.mini b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700}
.grade{font-size:22px;font-weight:600}
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.tile{background:var(--secondary-background-color,#eef1f4);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:2px;min-width:0}
.tile ha-icon{--mdc-icon-size:20px;color:var(--primary-color,#0b6fa4)}.tile b{font-size:16px;font-weight:600;line-height:1.2;overflow-wrap:anywhere}.tile span{font-size:12px;color:var(--secondary-text-color)}
.todo{display:flex;flex-direction:column;gap:4px}
.tdo{all:unset;display:flex;align-items:center;gap:12px;min-height:52px;padding:4px 6px;border-radius:12px;cursor:pointer;font-size:15px;box-sizing:border-box}
.tdo:hover{background:var(--secondary-background-color,#eef1f4)}.tdo:focus-visible{outline:2px solid var(--primary-color)}
.ticon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:none}.ticon ha-icon{--mdc-icon-size:20px}
.ticon.red{background:var(--ed-red-bg);color:var(--ed-red-fg)}.ticon.amber{background:var(--ed-amber-bg);color:var(--ed-amber-fg)}.ticon.blue{background:var(--ed-blue-bg);color:var(--ed-blue-fg)}
.empty{align-items:center;text-align:center;gap:6px;padding:32px 18px}.empty ha-icon{--mdc-icon-size:48px;color:var(--ed-green)}.empty b{font-size:18px;font-weight:600}
.small-empty{padding:12px 0 4px}.small-empty ha-icon{--mdc-icon-size:36px}
.q{position:relative;display:inline-block}.q summary{list-style:none;width:22px;height:22px;border-radius:50%;background:var(--secondary-background-color,#eef1f4);color:var(--secondary-text-color);font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer}
.q summary::-webkit-details-marker{display:none}.q[open] summary{background:var(--primary-color,#0b6fa4);color:#fff}
.tip{position:absolute;z-index:4;top:28px;left:-120px;width:260px;max-width:78vw;padding:12px 14px;border-radius:12px;background:var(--card-background-color,#fff);color:var(--primary-text-color);box-shadow:0 8px 24px rgba(16,24,40,.18);font-size:13px;line-height:1.45;font-weight:400;text-transform:none;letter-spacing:0}
.welcome{align-items:center;text-align:center;padding:36px 22px;gap:14px}
.wicon{width:84px;height:84px;border-radius:26px;background:var(--ed-blue-bg);color:var(--ed-blue-fg);display:flex;align-items:center;justify-content:center}.wicon ha-icon{--mdc-icon-size:44px}
.dots{display:flex;gap:6px}.dots i{width:8px;height:8px;border-radius:4px;background:var(--divider-color,#d6dce4);transition:width .2s}.dots i.on{width:22px;background:var(--primary-color,#0b6fa4)}
.snack{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:6;width:min(560px,calc(100% - 32px));box-sizing:border-box;display:flex;align-items:center;gap:8px;padding:8px 8px 8px 16px;border-radius:12px;background:#1f2937;color:#fff;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.25);animation:rise .2s ease-out}
.snackbtn{background:none;border:0;color:#8cc8ee;font-size:14px;font-weight:600;min-height:40px;padding:0 10px}.snackx{background:none;border:0;color:#cbd5e1;width:40px;height:40px;border-radius:50%}
.bar>span,.bar>div{transition:width .6s ease}
@media (min-width:1000px){.page.cols{max-width:1120px;display:block;column-count:2;column-gap:16px}.page.cols>*{break-inside:avoid;margin-bottom:16px;width:100%;box-sizing:border-box}.page.cols>.span{column-span:all}.page.cols>.center-link{display:flex;margin:0 auto}}
@keyframes rise{from{opacity:0;transform:translate(var(--tx,0),8px)}to{opacity:1;transform:translate(var(--tx,0),0)}}
@keyframes draw{from{stroke-dasharray:0 999}}
.page.anim>.card{animation:rise .3s ease-out both}.page.anim>.card:nth-child(2){animation-delay:.04s}.page.anim>.card:nth-child(3){animation-delay:.08s}.page.anim>.card:nth-child(n+4){animation-delay:.12s}
.page.anim .ring circle+circle,.page.anim .arc{animation:draw .8s ease-out both}
.snack{--tx:-50%}
@media (prefers-reduced-motion:reduce){.page.anim>.card,.snack,.page.anim .ring circle,.page.anim .arc{animation:none}.bar>span,.bar>div{transition:none}}
.done{align-items:center;text-align:center}.done ha-icon{--mdc-icon-size:56px;color:var(--success-color,#22a06b)}
`;

customElements.define("energy-doctor-panel", EnergyDoctorPanel);

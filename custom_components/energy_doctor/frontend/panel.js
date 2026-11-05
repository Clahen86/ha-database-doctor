// Energy Doctor panel: what fills the database, wrong numbers in the energy dashboard, and one-tap fixes.

const TEXT = {
  en: {
    title: "Energy Doctor",
    working: "Looking through the database …",
    workingHint: "A big database takes a minute.",
    fresh: "Check again",
    perDay: "+{n} a day",
    healthy: "Your database is healthy.",
    growing: "Your database grows by {n} a day.",
    diskFull: "The disk is full in about {n}.",
    months: "{n} months",
    years: "{n} years",
    days: "{n} days",
    sizeUnknown: "The size is only known for SQLite – the rest works the same.",
    groups: { sensors: "Sensors", energy: "Energy", lights: "Lights", signals: "Signals", other: "Other" },
    suggestion: "Suggestion",
    save: "Save {n}",
    saveText: "{d} deleted devices still have history, and {t} busy entities that nothing uses keep {k} days instead of all of it.",
    nothingToSave: "Nothing to clean up – well kept!",
    cleanup: "Clean up",
    energyErrors: "Wrong numbers in Energy",
    found: "{n} found",
    noErrors: "No wrong numbers found in the last 120 days.",
    fix: "Fix",
    seeAll: "See all",
    spike: "{v} {u} in one hour – normal is {e}",
    negative: "{v} {u} – an hour can't be negative",
    biggest: "Takes up the most",
    usedIn: "Used in",
    unused: "Not used anywhere",
    deleted: "Gone from Home Assistant – only old history is left",
    rows: "{n} rows · {d} a day",
    energyTitle: "Wrong numbers in Energy",
    energyIntro: "Each hour is set to what is normal for that meter, with Home Assistant's own “Adjust sum”. It can be undone.",
    fixN: "Fix {n}",
    fixedN: "{n} hours fixed",
    undo: "Undo",
    undone: "Undone",
    back: "Back",
    home: "Done",
    dataTitle: "Takes up the most",
    stopRecording: "Stop saving it",
    stopHint: "Add this to the recorder in configuration.yaml yourself (Energy Doctor never changes your YAML), then restart:",
    copy: "Copy",
    copied: "Copied",
    keep: "Keep – something needs this history",
    cleanTitle: "Clean up",
    cleanIntro: "This is removed with the recorder's own purge:",
    cleanDeleted: "All history of {n} deleted devices",
    cleanTrim: "History older than {k} days of {n} busy entities that nothing uses",
    cleanWarn: "Removed data can't be undone. Make a backup first if you want to keep it.",
    makeBackup: "Make a backup",
    cleanDo: "Clean up · save {n}",
    cleanDone: "Cleaned up",
    cleanDoneText: "The database file gets smaller at the next repack (the recorder does that by itself every month).",
    recent: "Recently",
    recEnergy: "{n} hours fixed in Energy",
    recClean: "History removed for {n} entities",
    error: "Something went wrong: {e}",
  },
  da: {
    title: "Energi-doktor",
    working: "Kigger databasen igennem …",
    workingHint: "En stor database tager et minut.",
    fresh: "Tjek igen",
    perDay: "+{n} om dagen",
    healthy: "Din database er sund.",
    growing: "Din database vokser {n} om dagen.",
    diskFull: "Disken er fuld om ca. {n}.",
    months: "{n} måneder",
    years: "{n} år",
    days: "{n} dage",
    sizeUnknown: "Størrelsen kendes kun for SQLite – resten virker på samme måde.",
    groups: { sensors: "Sensorer", energy: "Energi", lights: "Lys", signals: "Signaler", other: "Andet" },
    suggestion: "Forslag",
    save: "Spar {n}",
    saveText: "{d} slettede enheder har stadig historik, og {t} travle entiteter, som intet bruger, beholder {k} dage i stedet for det hele.",
    nothingToSave: "Intet at rydde op – flot holdt!",
    cleanup: "Ryd op",
    energyErrors: "Fejl i Energi",
    found: "{n} fundet",
    noErrors: "Ingen forkerte tal fundet de sidste 120 dage.",
    fix: "Ret",
    seeAll: "Se alle",
    spike: "{v} {u} på én time – normalt er {e}",
    negative: "{v} {u} – en time kan ikke være negativ",
    biggest: "Fylder mest",
    usedIn: "Bruges i",
    unused: "Bruges ingen steder",
    deleted: "Findes ikke længere – kun gammel historik er tilbage",
    rows: "{n} rækker · {d} om dagen",
    energyTitle: "Fejl i Energi",
    energyIntro: "Hver time sættes til det normale for måleren, med Home Assistants egen “Juster sum”. Det kan fortrydes.",
    fixN: "Ret {n}",
    fixedN: "{n} timer rettet",
    undo: "Fortryd",
    undone: "Fortrudt",
    back: "Tilbage",
    home: "Færdig",
    dataTitle: "Fylder mest",
    stopRecording: "Stop med at gemme",
    stopHint: "Sæt selv dette ind under recorder i configuration.yaml (Energi-doktor ændrer aldrig din YAML), og genstart:",
    copy: "Kopiér",
    copied: "Kopieret",
    keep: "Behold – noget bruger historikken",
    cleanTitle: "Ryd op",
    cleanIntro: "Dette fjernes med recorderens egen oprydning:",
    cleanDeleted: "Al historik fra {n} slettede enheder",
    cleanTrim: "Historik ældre end {k} dage fra {n} travle entiteter, som intet bruger",
    cleanWarn: "Slettede data kan ikke fortrydes. Lav en backup først, hvis du vil beholde dem.",
    makeBackup: "Lav en backup",
    cleanDo: "Ryd op · spar {n}",
    cleanDone: "Ryddet op",
    cleanDoneText: "Databasefilen bliver mindre ved næste oprydning (recorderen gør det selv hver måned).",
    recent: "Seneste",
    recEnergy: "{n} timer rettet i Energi",
    recClean: "Historik fjernet for {n} entiteter",
    error: "Noget gik galt: {e}",
  },
};
const COLORS = { sensors: "#0b6fa4", energy: "#f59e0b", lights: "#22a06b", signals: "#8b5cf6", other: "#94a3b8" };
const ICONS = { sensors: "mdi:thermometer", energy: "mdi:lightning-bolt", lights: "mdi:lightbulb", signals: "mdi:signal", other: "mdi:shape" };
const USE_ICON = { automation: "mdi:robot", script: "mdi:script-text", scene: "mdi:palette", graph: "mdi:chart-line", dashboard: "mdi:view-dashboard", energy: "mdi:lightning-bolt", helper: "mdi:tools", yaml: "mdi:file-code-outline" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

class EnergyDoctorPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.view = "working";
    this.data = null;
    this.history = [];
    this.picked = new Set();
    this.open = new Set();
    this.message = "";
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this.load();
  }

  set narrow(narrow) {
    this._narrow = narrow;
  }

  get lang() {
    const l = (this._hass?.locale?.language || this._hass?.language || "en").split("-")[0];
    return ["da", "nb", "nn", "no"].includes(l) ? "da" : "en";
  }

  t(key, vars = {}) {
    const value = key.split(".").reduce((o, k) => o?.[k], TEXT[this.lang]) ?? key.split(".").reduce((o, k) => o?.[k], TEXT.en) ?? key;
    return String(value).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  }

  ws(type, data = {}) {
    return this._hass.callWS({ type: `energy_doctor/${type}`, ...data });
  }

  num(n, digits = 1) {
    return Number(n).toLocaleString(this.lang === "da" ? "da-DK" : "en-US", { maximumFractionDigits: digits });
  }

  bytes(n) {
    if (n == null) return "–";
    if (n >= 1e9) return `${this.num(n / 1e9)} GB`;
    if (n >= 1e6) return `${this.num(n / 1e6, 0)} MB`;
    return `${this.num(n / 1e3, 0)} kB`;
  }

  async load(fresh = false) {
    this.view = "working";
    this.render();
    try {
      const [data, history] = await Promise.all([this.ws("overview", { fresh }), this.ws("history")]);
      this.data = data;
      this.history = history;
      this.view = "home";
    } catch (e) {
      this.message = this.t("error", { e: e.message || e });
      this.view = "home";
    }
    this.render();
  }

  // ---------- views ----------

  ring() {
    const d = this.data;
    const total = Object.values(d.groups).reduce((a, b) => a + b, 0) || 1;
    const c = 2 * Math.PI * 80;
    let offset = 0;
    const arcs = ["sensors", "energy", "lights", "signals", "other"].filter((g) => d.groups[g]).map((g) => {
      const len = (d.groups[g] / total) * c;
      const arc = `<circle cx="98" cy="98" r="80" stroke="${COLORS[g]}" stroke-dasharray="${Math.max(len - 2, 0.1)} ${c}" stroke-dashoffset="${-offset}"></circle>`;
      offset += len;
      return arc;
    }).join("");
    const legend = ["sensors", "energy", "lights", "signals", "other"].filter((g) => d.groups[g])
      .map((g) => `<span class="leg"><i style="background:${COLORS[g]}"></i>${this.t(`groups.${g}`)}</span>`).join("");
    const size = d.size != null ? this.bytes(d.size) : `${this.num(d.rows, 0)}`;
    const sub = d.growth != null ? this.t("perDay", { n: this.bytes(Math.max(d.growth, 0)) }) : "";
    let text = d.growth > 0 ? this.t("growing", { n: this.bytes(d.growth) }) : this.t("healthy");
    if (d.growth > 0 && d.free) {
      const days = d.free / d.growth;
      const when = days > 730 ? this.t("years", { n: this.num(days / 365, 0) }) : days > 60 ? this.t("months", { n: this.num(days / 30, 0) }) : this.t("days", { n: this.num(days, 0) });
      text += ` ${this.t("diskFull", { n: when })}`;
    }
    return `<div class="card ringcard">
      <div class="ring"><svg viewBox="0 0 196 196" role="img" aria-label="${esc(legend.replace(/<[^>]+>/g, " "))}"><g transform="rotate(-90 98 98)" fill="none" stroke-width="22"><circle cx="98" cy="98" r="80" stroke="var(--divider-color,#e8ecf1)"></circle>${arcs}</g></svg>
        <div class="center"><b>${size}</b><span>${sub}</span></div></div>
      <div class="legend">${legend}</div>
      <p class="lead">${esc(text)}</p>
      ${d.size == null ? `<p class="muted small">${this.t("sizeUnknown")}</p>` : ""}
    </div>`;
  }

  suggestionCard() {
    const s = this.data.suggestion;
    if (!s.bytes) return `<div class="card okcard"><ha-icon icon="mdi:check-decagram"></ha-icon><span>${this.t("nothingToSave")}</span></div>`;
    return `<div class="card hero">
      <span class="eyebrow">${this.t("suggestion")}</span>
      <span class="big">${this.t("save", { n: this.bytes(s.bytes) })}</span>
      <span>${esc(this.t("saveText", { d: s.deleted.length, t: s.trim.length, k: s.keep_days }))}</span>
      <div class="row"><button class="white" data-act="clean">${this.t("cleanup")}</button></div>
    </div>`;
  }

  issueText(i) {
    const u = i.unit || "";
    return i.kind === "spike" ? this.t("spike", { v: this.num(i.value), u, e: `${this.num(i.expected, 2)} ${u}` }) : this.t("negative", { v: this.num(i.value), u });
  }

  when(ts) {
    return new Date(ts * 1000).toLocaleString(this.lang === "da" ? "da-DK" : "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  energyCard() {
    const issues = this.data.energy_issues;
    if (!issues.length) return `<div class="card okcard"><ha-icon icon="mdi:lightning-bolt-circle"></ha-icon><span>${this.t("noErrors")}</span></div>`;
    const row = (i) => `<div class="irow"><div class="grow"><div class="name">${esc(i.name)}</div>
        <div class="small ${i.kind === "spike" ? "red" : "amber"}">${esc(this.issueText(i))}</div><div class="muted small">${esc(this.when(i.start))}</div></div>
        <button class="soft ${i.kind === "spike" ? "redbg" : "amberbg"}" data-act="fixOne" data-id="${esc(i.id)}">${this.t("fix")}</button></div>`;
    return `<div class="card"><div class="head"><i class="dot" style="background:#d92d20"></i><b>${this.t("energyErrors")}</b><span class="muted small right">${this.t("found", { n: issues.length })}</span></div>
      ${issues.slice(0, 3).map(row).join("")}
      ${issues.length > 1 ? `<button class="link" data-act="energy">${this.t("seeAll")}</button>` : ""}</div>`;
  }

  usedLine(e) {
    if (e.deleted) return `<div class="small green">${this.t("deleted")}</div>`;
    if (!e.used_in.length) return `<div class="small muted">${this.t("unused")}</div>`;
    const names = [...new Set(e.used_in.map((u) => this.useName(u)))].slice(0, 3);
    return `<div class="small muted">${this.t("usedIn")}: ${esc(names.join(", "))}${e.used_in.length > 3 ? " …" : ""}</div>`;
  }

  useName(u) {
    return u.kind === "energy" ? this.t("groups.energy") : u.name;
  }

  entityRow(e, max, full = false) {
    const pct = Math.max(2, Math.round((e.bytes / (max || 1)) * 100));
    const canStop = full && !e.deleted && !e.used_in.length;
    const open = this.open.has(e.entity_id);
    return `<div class="erow">
      <div class="line"><span class="name">${esc(e.name)}</span><span class="nowrap">${this.bytes(e.bytes)}</span></div>
      <div class="bar"><div style="width:${pct}%;background:${COLORS[e.group]}"></div></div>
      ${full ? `<div class="mono small muted">${esc(e.entity_id)} · ${esc(this.t("rows", { n: this.num(e.rows, 0), d: this.num(e.per_day, 0) }))}</div>` : ""}
      ${this.usedLine(e)}
      ${full && e.used_in.length ? `<div class="chips">${e.used_in.slice(0, 6).map((u) => `<span class="chip"><ha-icon icon="${USE_ICON[u.kind] || "mdi:link"}"></ha-icon>${esc(this.useName(u))}</span>`).join("")}</div>` : ""}
      ${canStop ? `<button class="link" data-act="toggleStop" data-id="${esc(e.entity_id)}">${this.t("stopRecording")}</button>` : ""}
      ${canStop && open ? `<div class="snippet"><p class="small muted">${this.t("stopHint")}</p><pre>recorder:\n  exclude:\n    entities:\n      - ${esc(e.entity_id)}</pre><button class="soft" data-act="copy" data-id="${esc(e.entity_id)}">${this.t("copy")}</button></div>` : ""}
    </div>`;
  }

  biggestCard() {
    const list = this.data.entities.slice(0, 4);
    if (!list.length) return "";
    const max = list[0].bytes;
    return `<div class="card"><div class="head"><b>${this.t("biggest")}</b></div>${list.map((e) => this.entityRow(e, max)).join("")}
      <button class="link" data-act="data">${this.t("seeAll")}</button></div>`;
  }

  recentCard() {
    const list = this.history.slice(0, 4);
    if (!list.length) return "";
    const row = (r) => `<div class="irow"><div class="grow"><div class="name">${esc(r.kind === "energy" ? this.t("recEnergy", { n: r.issues.length }) : this.t("recClean", { n: r.deleted.length + r.trim.length }))}</div>
        <div class="muted small">${esc(this.when(r.at))}</div></div>
        ${r.kind === "energy" ? (r.undone ? `<span class="muted small">${this.t("undone")}</span>` : `<button class="soft" data-act="undo" data-id="${r.id}">${this.t("undo")}</button>`) : ""}</div>`;
    return `<div class="card"><div class="head"><b>${this.t("recent")}</b></div>${list.map(row).join("")}</div>`;
  }

  homeView() {
    if (!this.data) return `<div class="card"><p class="red">${esc(this.message)}</p><button class="primary" data-act="fresh">${this.t("fresh")}</button></div>`;
    return `${this.message ? `<div class="card"><p class="red">${esc(this.message)}</p></div>` : ""}
      ${this.ring()}${this.suggestionCard()}${this.energyCard()}${this.biggestCard()}${this.recentCard()}
      <button class="link center-link" data-act="fresh"><ha-icon icon="mdi:refresh"></ha-icon> ${this.t("fresh")}</button>`;
  }

  energyView() {
    const issues = this.data.energy_issues;
    const row = (i) => `<label class="irow pick"><input type="checkbox" data-pick="${esc(i.id)}" ${this.picked.has(i.id) ? "checked" : ""}><span class="box"></span>
        <div class="grow"><div class="name">${esc(i.name)}</div><div class="small ${i.kind === "spike" ? "red" : "amber"}">${esc(this.issueText(i))}</div>
        <div class="muted small">${esc(this.when(i.start))} · <span class="mono">${esc(i.statistic_id)}</span></div></div></label>`;
    return `<div class="card"><h2>${this.t("energyTitle")}</h2><p class="muted">${this.t("energyIntro")}</p></div>
      <div class="card">${issues.map(row).join("")}</div>
      <div class="actions"><button class="ghost" data-act="home">${this.t("back")}</button>
        <button class="primary" data-act="fixPicked" ${this.picked.size ? "" : "disabled"}>${this.t("fixN", { n: this.picked.size })}</button></div>`;
  }

  dataView() {
    const list = this.data.entities.slice(0, 60);
    const max = list[0]?.bytes || 1;
    return `<div class="card"><h2>${this.t("dataTitle")}</h2>${list.map((e) => this.entityRow(e, max, true)).join("")}</div>
      <div class="actions"><button class="primary" data-act="home">${this.t("back")}</button></div>`;
  }

  cleanView() {
    const s = this.data.suggestion;
    return `<div class="card"><h2>${this.t("cleanTitle")}</h2><p class="muted">${this.t("cleanIntro")}</p>
        ${s.deleted.length ? `<div class="irow"><ha-icon icon="mdi:delete-outline"></ha-icon><div class="grow">${esc(this.t("cleanDeleted", { n: s.deleted.length }))}</div></div>` : ""}
        ${s.trim.length ? `<div class="irow"><ha-icon icon="mdi:content-cut"></ha-icon><div class="grow">${esc(this.t("cleanTrim", { n: s.trim.length, k: s.keep_days }))}</div></div>` : ""}
      </div>
      <div class="card warncard"><ha-icon icon="mdi:shield-alert-outline"></ha-icon><div class="grow"><span>${this.t("cleanWarn")}</span><br><a href="/config/backup" target="_top">${this.t("makeBackup")}</a></div></div>
      <div class="actions"><button class="ghost" data-act="home">${this.t("back")}</button>
        <button class="primary" data-act="cleanDo">${this.t("cleanDo", { n: this.bytes(s.bytes) })}</button></div>`;
  }

  doneView() {
    return `<div class="card done"><ha-icon icon="mdi:check-circle"></ha-icon><h2>${esc(this.doneTitle)}</h2>${this.doneText ? `<p class="muted">${esc(this.doneText)}</p>` : ""}</div>
      <div class="actions">${this.doneUndo ? `<button class="ghost" data-act="undo" data-id="${this.doneUndo}">${this.t("undo")}</button>` : ""}<button class="primary" data-act="fresh">${this.t("home")}</button></div>`;
  }

  workingView() {
    return `<div class="card working"><div class="spinner"></div><b>${this.t("working")}</b><span class="muted small">${this.t("workingHint")}</span></div>`;
  }

  render() {
    const body = { working: () => this.workingView(), home: () => this.homeView(), energy: () => this.energyView(), data: () => this.dataView(), clean: () => this.cleanView(), done: () => this.doneView() }[this.view]();
    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
      <div class="toolbar">${customElements.get("ha-menu-button") ? "<ha-menu-button></ha-menu-button>" : ""}
        ${!["home", "working"].includes(this.view) ? `<button class="tb-back" data-act="home" aria-label="${this.t("back")}"><ha-icon icon="mdi:arrow-left"></ha-icon></button>` : ""}
        <div class="tb-title">${this.t("title")}</div></div>
      <div class="page">${body}</div>`;
    const menu = this.shadowRoot.querySelector("ha-menu-button");
    if (menu) {
      menu.hass = this._hass;
      menu.narrow = this._narrow;
    }
    this.shadowRoot.querySelectorAll("[data-act]").forEach((el) => el.addEventListener("click", () => this.act(el.dataset)));
    this.shadowRoot.querySelectorAll("input[data-pick]").forEach((el) => el.addEventListener("change", () => {
      if (el.checked) this.picked.add(el.dataset.pick);
      else this.picked.delete(el.dataset.pick);
      this.render();
    }));
  }

  async run(job, title, text = "") {
    this.view = "working";
    this.render();
    try {
      const r = await job();
      this.doneTitle = typeof title === "function" ? title(r) : title;
      this.doneText = text;
      this.doneUndo = r?.undoable ? r.id : null;
      this.view = "done";
    } catch (e) {
      this.message = this.t("error", { e: e.message || e });
      this.view = "home";
    }
    this.render();
  }

  act(d) {
    const a = d.act;
    if (a === "home") {
      this.view = "home";
      this.render();
    } else if (a === "fresh") {
      this.message = "";
      this.load(true);
    } else if (a === "energy") {
      this.picked = new Set(this.data.energy_issues.map((i) => i.id));
      this.view = "energy";
      this.render();
    } else if (a === "data" || a === "clean") {
      this.view = a;
      this.render();
    } else if (a === "fixOne" || a === "fixPicked") {
      const ids = a === "fixOne" ? [d.id] : [...this.picked];
      this.run(async () => ({ ...(await this.ws("fix_energy", { issues: ids })), undoable: true }), (r) => this.t("fixedN", { n: r.fixed }));
    } else if (a === "cleanDo") {
      const s = this.data.suggestion;
      this.run(() => this.ws("cleanup", { deleted: s.deleted, trim: s.trim, keep_days: s.keep_days }), this.t("cleanDone"), this.t("cleanDoneText"));
    } else if (a === "undo") {
      this.run(() => this.ws("undo", { record: d.id }), this.t("undone"));
    } else if (a === "toggleStop") {
      if (this.open.has(d.id)) this.open.delete(d.id);
      else this.open.add(d.id);
      this.render();
    } else if (a === "copy") {
      navigator.clipboard?.writeText(`recorder:\n  exclude:\n    entities:\n      - ${d.id}\n`);
    }
  }
}

const STYLE = `
:host{display:block;min-height:100vh;background:var(--primary-background-color,#f2f4f7);color:var(--primary-text-color,#1c2430);font-family:var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif)}
.toolbar{height:56px;display:flex;align-items:center;gap:4px;padding:0 8px;background:var(--app-header-background-color,var(--primary-color,#03a9f4));color:var(--app-header-text-color,#fff);position:sticky;top:0;z-index:2}
.tb-title{font-size:20px;font-weight:400;margin-left:8px}
.tb-back{background:none;border:0;color:inherit;width:44px;height:44px;border-radius:50%;cursor:pointer}
.page{max-width:640px;margin:0 auto;padding:16px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}
.card{background:var(--card-background-color,#fff);border-radius:var(--ha-card-border-radius,16px);padding:18px;box-shadow:var(--ha-card-box-shadow,0 1px 3px rgba(16,24,40,.08));display:flex;flex-direction:column;gap:10px}
h2{margin:0;font-size:20px;font-weight:500}
.muted{color:var(--secondary-text-color,#5b6676)}.small{font-size:13px}.mono{font-family:ui-monospace,monospace;overflow-wrap:anywhere}
.red{color:var(--error-color,#b42318)}.amber{color:#b54708}.green{color:var(--success-color,#22663f)}
.ringcard{align-items:center;text-align:center}
.ring{position:relative;width:196px;height:196px}.ring svg{width:196px;height:196px}
.center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.center b{font-size:32px;font-weight:700}.center span{font-size:13px;color:var(--secondary-text-color,#5b6676)}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;font-size:13px}
.leg{display:flex;align-items:center;gap:6px}.leg i{width:10px;height:10px;border-radius:5px;display:inline-block}
.lead{margin:0;font-size:15px;line-height:1.45}
.hero{background:var(--primary-color,#0b6fa4);color:var(--text-primary-color,#fff)}
.hero .eyebrow{font-size:13px;font-weight:500;letter-spacing:.4px;text-transform:uppercase;opacity:.85}
.hero .big{font-size:26px;font-weight:700}
.row{display:flex;gap:10px}
button{font-family:inherit;cursor:pointer}
.white{flex:1;height:48px;border-radius:12px;border:0;background:#fff;color:var(--primary-color,#0b6fa4);font-size:16px;font-weight:500}
.primary{flex:1;min-height:52px;border-radius:14px;border:0;background:var(--primary-color,#0b6fa4);color:var(--text-primary-color,#fff);font-size:16px;font-weight:500;padding:0 18px}
.primary:disabled{opacity:.45;cursor:default}
.ghost{min-height:52px;padding:0 18px;border-radius:14px;border:1px solid var(--divider-color,#c4ccd6);background:var(--card-background-color,#fff);color:var(--primary-color,#0b6fa4);font-size:15px;font-weight:500}
.soft{min-height:40px;min-width:64px;padding:0 14px;border-radius:10px;border:0;background:var(--secondary-background-color,#eef1f4);color:var(--primary-text-color);font-size:14px;font-weight:500}
.redbg{background:#fde8e7;color:#b42318}.amberbg{background:#fef0c7;color:#93370d}
.link{background:none;border:0;color:var(--primary-color,#0b6fa4);font-size:14px;padding:8px 0;text-align:left;display:inline-flex;align-items:center;gap:4px}
.center-link{align-self:center}
.head{display:flex;align-items:center;gap:10px}.head b{font-size:17px;font-weight:500}.right{margin-left:auto}
.dot{width:10px;height:10px;border-radius:5px;display:inline-block}
.irow{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--divider-color,#eef1f4)}.irow:last-of-type{border-bottom:0}
.grow{flex:1;min-width:0}.name{font-size:15px;font-weight:500;overflow-wrap:anywhere}
.erow{padding:12px 0;border-bottom:1px solid var(--divider-color,#eef1f4);display:flex;flex-direction:column;gap:6px}.erow:last-of-type{border-bottom:0}
.line{display:flex;justify-content:space-between;gap:12px;font-size:15px}.nowrap{white-space:nowrap}
.bar{height:6px;border-radius:3px;background:var(--secondary-background-color,#eef1f4)}.bar div{height:6px;border-radius:3px}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{display:inline-flex;align-items:center;gap:4px;background:var(--secondary-background-color,#eef1f4);border-radius:14px;padding:4px 10px 4px 6px;font-size:12px}.chip ha-icon{--mdc-icon-size:16px}
.snippet pre{margin:6px 0;padding:10px;border-radius:8px;background:var(--secondary-background-color,#eef1f4);font-size:12px;overflow-x:auto}
.okcard{flex-direction:row;align-items:center;gap:12px;color:var(--success-color,#22663f)}
.warncard{flex-direction:row;gap:12px;background:#fffaeb;color:#93370d}.warncard a{color:#93370d;font-weight:500}
.actions{display:flex;gap:10px;position:sticky;bottom:12px}
.pick{cursor:pointer}.pick input{position:absolute;opacity:0}
.box{width:22px;height:22px;flex:none;border-radius:6px;border:2px solid var(--secondary-text-color,#8a94a3);box-sizing:border-box}
.pick input:checked+.box{background:var(--primary-color,#0b6fa4);border-color:var(--primary-color,#0b6fa4);box-shadow:inset 0 0 0 3px var(--card-background-color,#fff)}
.pick input:focus-visible+.box{outline:2px solid var(--primary-color)}
.working{align-items:center;text-align:center;padding:48px 18px}
.spinner{width:40px;height:40px;border-radius:50%;border:4px solid var(--divider-color,#e8ecf1);border-top-color:var(--primary-color,#0b6fa4);animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.done{align-items:center;text-align:center}.done ha-icon{--mdc-icon-size:56px;color:var(--success-color,#22a06b)}
`;

customElements.define("energy-doctor-panel", EnergyDoctorPanel);

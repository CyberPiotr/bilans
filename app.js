(() => {
  "use strict";

  const NUTRIENT_KEYS = [
    "kalorie",
    "bialko",
    "tluszcz",
    "wegle_netto",
    "sod",
    "potas",
    "magnez",
    "omega3_epa_dha",
    "blonnik",
    "witamina_d3",
    "witamina_a",
    "witamina_e",
    "witamina_k2",
    "zelazo",
    "cynk",
    "selen",
    "jod",
  ];

  const NUTRIENT_ALIASES = {
    kalorie: ["kalorie", "kcal", "energia"],
    bialko: ["bialko", "protein", "proteiny"],
    tluszcz: ["tluszcz", "tluszcze", "fat"],
    wegle_netto: ["wegle_netto", "wegle netto", "weglowodany netto", "net carbs", "carbs netto"],
    sod: ["sod", "sodium"],
    potas: ["potas", "potassium"],
    magnez: ["magnez", "magnesium"],
    omega3_epa_dha: [
      "omega3_epa_dha", "omega3 epa dha", "omega_3_epa_dha", "omega 3 epa dha",
      "omega3", "omega_3", "epa_dha", "epa dha", "omega_ea_dha", "omega3_ea_dha",
    ],
    blonnik: ["blonnik", "fiber"],
    witamina_d3: ["witamina_d3", "witamina d3", "wit d3", "d3", "vitamin d3"],
    witamina_a: ["witamina_a", "witamina a", "wit a", "vitamin a"],
    witamina_e: ["witamina_e", "witamina e", "wit e", "vitamin e"],
    witamina_k2: ["witamina_k2", "witamina k2", "wit k2", "k2", "vitamin k2"],
    zelazo: ["zelazo", "iron"],
    cynk: ["cynk", "zinc"],
    selen: ["selen", "selenium"],
    jod: ["jod", "iodine"],
  };

  const TAGS = [
    "jaja",
    "tluste_ryby",
    "owoce_morza_ryby_morskie",
    "podroby",
    "mieso_czerwone",
    "drob",
    "nabial",
    "tluszcze_czyste",
    "zielone_warzywa",
    "warzywa_krzyzowe",
    "kiszonki",
    "orzechy_pestki",
  ];

  const TAG_ALIASES = {
    jaja: ["jaja", "jajka", "jajko"],
    tluste_ryby: ["tluste_ryby", "tluste ryby", "makrela", "losos", "sledz", "sardynki", "sardynka"],
    owoce_morza_ryby_morskie: [
      "owoce_morza_ryby_morskie", "owoce morza", "ryby morskie", "ryba morska",
      "tunczyk", "dorsz", "krewetki", "krewetka", "malze", "ostrygi",
    ],
    podroby: ["podroby", "watrobka", "watroba", "serca", "serce", "nerki", "nerka", "zoladki"],
    mieso_czerwone: [
      "mieso_czerwone", "mieso czerwone", "wolowina", "wieprzowina",
      "jagniecina", "baranina", "stek",
    ],
    drob: ["drob", "kurczak", "indyk", "kaczka", "ges"],
    nabial: ["nabial", "twarog", "ser", "sery", "jogurt", "kefir", "smietana", "mozzarella", "feta", "halloumi"],
    tluszcze_czyste: [
      "tluszcze_czyste", "tluszcze czyste", "oliwa", "maslo", "smalec",
      "olej mct", "mct", "olej kokosowy", "ghee",
    ],
    zielone_warzywa: [
      "zielone_warzywa", "zielone warzywa", "warzywa zielone", "rukola", "szpinak",
      "salata", "roszponka", "ogorek", "rzodkiewka", "cukinia", "szczypiorek", "natka pietruszki",
    ],
    warzywa_krzyzowe: [
      "warzywa_krzyzowe", "warzywa krzyzowe", "kalafior", "brokul", "kapusta", "brukselka", "jarmuz",
    ],
    kiszonki: ["kiszonki", "kiszonka", "kapusta kiszona", "ogorki kiszone", "ogorek kiszony", "kimchi"],
    orzechy_pestki: [
      "orzechy_pestki", "orzechy", "pestki", "pestki dyni", "slonecznik", "chia",
      "siemie lniane", "migdaly", "orzechy wloskie", "orzechy brazylijskie",
    ],
  };

  const LABELS = {
    kalorie: "Kalorie",
    bialko: "Białko",
    tluszcz: "Tłuszcz",
    wegle_netto: "Węgle netto",
    sod: "Sód",
    potas: "Potas",
    magnez: "Magnez",
    omega3_epa_dha: "Omega-3 EPA+DHA",
    blonnik: "Błonnik",
    witamina_d3: "Witamina D3",
    witamina_a: "Witamina A",
    witamina_e: "Witamina E",
    witamina_k2: "Witamina K2",
    zelazo: "Żelazo",
    cynk: "Cynk",
    selen: "Selen",
    jod: "Jod",
    owoce_morza_ryby_morskie: "Owoce morza i ryby morskie",
    mieso_czerwone: "Mięso czerwone",
    drob: "Drób",
    nabial: "Nabiał",
    tluszcze_czyste: "Tłuszcze czyste",
    warzywa_krzyzowe: "Warzywa krzyżowe",
    tluste_ryby: "Tłuste ryby",
    podroby: "Podroby",
    jaja: "Jaja",
    zielone_warzywa: "Zielone warzywa",
    kiszonki: "Kiszonki",
    orzechy_pestki: "Orzechy i pestki",
  };

  const SETTINGS_GROUPS = [
    { title: "Wygląd", fields: [["theme", "Motyw", "select"]] },
    { title: "Okno jedzenia", fields: [["eatingWindowStart", "Od", "time"], ["eatingWindowEnd", "Do", "time"]] },
    { title: "Cele dzienne", fields: [
      ["dailyKalorie", "Kalorie (kcal)"], ["dailyBialko", "Białko (g)"], ["dailyTluszcz", "Tłuszcz (g)"],
      ["dailyWegleMax", "Węgle netto maks. (g)"], ["dailySodMin", "Sód min. (mg)"], ["dailySodMax", "Sód maks. (mg)"],
      ["dailyPotasMin", "Potas min. (mg)"], ["dailyPotasMax", "Potas maks. (mg)"],
      ["dailyMagnezMin", "Magnez min. (mg)"], ["dailyMagnezMax", "Magnez maks. (mg)"],
    ] },
    { title: "Cele 3 dni", fields: [
      ["threeSodMin", "Sód min."], ["threeSodMax", "Sód maks."], ["threePotasMin", "Potas min."],
      ["threePotasMax", "Potas maks."], ["threeMagnezMin", "Magnez min."], ["threeMagnezMax", "Magnez maks."],
      ["threeOmegaMin", "Omega-3 min."], ["threeOmegaMax", "Omega-3 maks."],
      ["threeBlonnikMin", "Błonnik min."], ["threeBlonnikMax", "Błonnik maks."],
    ] },
    { title: "Cele 7 dni", fields: [
      ["sevenD3Min", "Witamina D3 min."], ["sevenD3Max", "Witamina D3 maks."],
      ["sevenAMin", "Witamina A min."], ["sevenAMax", "Witamina A maks."],
      ["sevenEMin", "Witamina E min."], ["sevenEMax", "Witamina E maks."],
      ["sevenK2Min", "Witamina K2 min."], ["sevenK2Max", "Witamina K2 maks."],
      ["sevenZelazoMin", "Żelazo min."], ["sevenCynkMin", "Cynk min."], ["sevenCynkMax", "Cynk maks."],
      ["sevenSelenMin", "Selen min."], ["sevenSelenMax", "Selen maks."], ["sevenJodMin", "Jod min."],
    ] },
    { title: "Cele tagów / 30 dni", fields: [
      ["tagJaja", "Jaja"], ["tagTlusteRyby", "Tłuste ryby"], ["tagOwoceMorza", "Owoce morza i ryby morskie"],
      ["tagPodroby", "Podroby"], ["tagZielone", "Zielone warzywa"], ["tagKrzyzowe", "Warzywa krzyżowe"],
      ["tagKiszonki", "Kiszonki"], ["tagOrzechy", "Orzechy i pestki"],
    ] },
  ];

  const elements = {};
  let entries = [];
  let settings = getDefaultSettings();
  let deferredInstallPrompt = null;
  let alertsExpanded = false;
  let editingEntryId = null;

  function getDefaultSettings() {
    return {
      theme: "system",
      eatingWindowStart: "10:00", eatingWindowEnd: "18:00",
      dailyKalorie: 2200, dailyBialko: 170, dailyTluszcz: 146, dailyWegleMax: 50,
      dailySodMin: 4000, dailySodMax: 5000, dailyPotasMin: 3500, dailyPotasMax: 4500,
      dailyMagnezMin: 400, dailyMagnezMax: 500,
      threeSodMin: 12000, threeSodMax: 15000, threePotasMin: 10500, threePotasMax: 13500,
      threeMagnezMin: 1200, threeMagnezMax: 1500, threeOmegaMin: 3000, threeOmegaMax: 6000,
      threeBlonnikMin: 60, threeBlonnikMax: 90,
      sevenD3Min: 28000, sevenD3Max: 35000, sevenAMin: 6000, sevenAMax: 8000,
      sevenEMin: 100, sevenEMax: 120, sevenK2Min: 700, sevenK2Max: 1400,
      sevenZelazoMin: 56, sevenCynkMin: 70, sevenCynkMax: 100,
      sevenSelenMin: 400, sevenSelenMax: 500, sevenJodMin: 1000,
      tagJaja: 20, tagTlusteRyby: 8, tagOwoceMorza: 4, tagPodroby: 4,
      tagZielone: 20, tagKrzyzowe: 8, tagKiszonki: 10, tagOrzechy: 8,
    };
  }

  function getGoalGroups() {
    const tagTargets = {
      jaja: settings.tagJaja, tluste_ryby: settings.tagTlusteRyby,
      owoce_morza_ryby_morskie: settings.tagOwoceMorza, podroby: settings.tagPodroby,
      zielone_warzywa: settings.tagZielone, warzywa_krzyzowe: settings.tagKrzyzowe,
      kiszonki: settings.tagKiszonki, orzechy_pestki: settings.tagOrzechy,
    };
    return [
      { title: "Dziś", days: 1, goals: [
        goal("kalorie", "exact", settings.dailyKalorie, "kcal"), goal("bialko", "exact", settings.dailyBialko, "g"),
        goal("tluszcz", "exact", settings.dailyTluszcz, "g"), goal("wegle_netto", "max", settings.dailyWegleMax, "g"),
        rangeGoal("sod", settings.dailySodMin, settings.dailySodMax, "mg"),
        rangeGoal("potas", settings.dailyPotasMin, settings.dailyPotasMax, "mg"),
        rangeGoal("magnez", settings.dailyMagnezMin, settings.dailyMagnezMax, "mg"),
      ] },
      { title: "Ostatnie 3 dni", days: 3, goals: [
        rangeGoal("sod", settings.threeSodMin, settings.threeSodMax, "mg"),
        rangeGoal("potas", settings.threePotasMin, settings.threePotasMax, "mg"),
        rangeGoal("magnez", settings.threeMagnezMin, settings.threeMagnezMax, "mg"),
        rangeGoal("omega3_epa_dha", settings.threeOmegaMin, settings.threeOmegaMax, "mg"),
        rangeGoal("blonnik", settings.threeBlonnikMin, settings.threeBlonnikMax, "g"),
      ] },
      { title: "Ostatnie 7 dni", days: 7, goals: [
        rangeGoal("witamina_d3", settings.sevenD3Min, settings.sevenD3Max, "IU"),
        rangeGoal("witamina_a", settings.sevenAMin, settings.sevenAMax, "µg"),
        rangeGoal("witamina_e", settings.sevenEMin, settings.sevenEMax, "mg"),
        rangeGoal("witamina_k2", settings.sevenK2Min, settings.sevenK2Max, "µg"),
        goal("zelazo", "minimum", settings.sevenZelazoMin, "mg"),
        rangeGoal("cynk", settings.sevenCynkMin, settings.sevenCynkMax, "mg"),
        rangeGoal("selen", settings.sevenSelenMin, settings.sevenSelenMax, "µg"),
        goal("jod", "minimum", settings.sevenJodMin, "µg"),
      ] },
      { title: "Ostatnie 30 dni", days: 30, goals: TAGS.map((tag) => Object.hasOwn(tagTargets, tag)
        ? goal(tag, "minimum", tagTargets[tag], "wpisów", true)
        : goal(tag, "count", 0, "wpisów", true)) },
    ];
  }

  function goal(key, type, value, unit, isTag = false) {
    return { key, type, value, unit, isTag };
  }

  function rangeGoal(key, min, max, unit) {
    return { key, type: "range", min, max, unit, isTag: false };
  }

  function localDateString(date = new Date()) {
    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  function dateDaysAgo(days) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - days);
    return localDateString(date);
  }

  function normalizeText(value) {
    return String(value)
      .toLocaleLowerCase("pl")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/[_–—-]+/g, " ")
      .replace(/[^a-z0-9.,:+=\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function detectTags(rawText) {
    const searchableText = ` ${normalizeText(rawText)} `;
    return TAGS.filter((tag) => TAG_ALIASES[tag].some((alias) => {
      const normalizedAlias = normalizeText(alias);
      return searchableText.includes(` ${normalizedAlias} `);
    }));
  }

  function parseNutritionText(rawText) {
    const parsedData = Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, 0]));
    const detectedFields = new Set();

    rawText.split(/\r?\n/).forEach((line) => {
      const normalizedLine = normalizeText(line);
      if (!normalizedLine) return;

      const symbolMatch = normalizedLine.match(/^(na|k)\s*:\s*([-+]?\d+(?:[.,]\d+)?)/);
      if (symbolMatch) {
        const key = symbolMatch[1] === "na" ? "sod" : "potas";
        parsedData[key] = Number.parseFloat(symbolMatch[2].replace(",", "."));
        detectedFields.add(key);
        return;
      }

      Object.entries(NUTRIENT_ALIASES).some(([key, aliases]) => aliases
        .slice()
        .sort((a, b) => normalizeText(b).length - normalizeText(a).length)
        .some((alias) => {
          const aliasPattern = escapeRegExp(normalizeText(alias)).replace(/\s+/g, "\\s+");
          const match = normalizedLine.match(
            new RegExp(`(?:^|\\s)${aliasPattern}(?:\\s*[:=]\\s*|\\s+)([-+]?\\d+(?:[.,]\\d+)?)`),
          );
          if (!match) return false;

          parsedData[key] = Number.parseFloat(match[1].replace(",", "."));
          detectedFields.add(key);
          return true;
        }));
    });

    return {
      parsedData,
      tags: detectTags(rawText),
      detectedCount: detectedFields.size,
    };
  }

  function createId() {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function createUpdatedEntry(existingEntry, date, rawText, parsedData, tags, updatedAt = new Date().toISOString()) {
    return { ...existingEntry, date, rawText, parsedData, tags, updatedAt };
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 2 }).format(value || 0);
  }

  function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    return new Intl.DateTimeFormat("pl-PL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function getEntriesForDays(days) {
    const from = dateDaysAgo(days - 1);
    const today = localDateString();
    return entries.filter((entry) => entry.date >= from && entry.date <= today);
  }

  function sumNutrient(periodEntries, key) {
    return periodEntries.reduce((sum, entry) => sum + Number(entry.parsedData?.[key] || 0), 0);
  }

  function countTag(periodEntries, tag) {
    return periodEntries.filter((entry) => Array.isArray(entry.tags) && entry.tags.includes(tag)).length;
  }

  function getStatus(value, target) {
    if (target.type === "range") {
      if (value < target.min) return { label: "brakuje", className: "missing" };
      if (value > target.max) return { label: "przekroczone", className: "exceeded" };
      return { label: "OK", className: "ok" };
    }

    if (target.type === "max") {
      return value <= target.value
        ? { label: "OK", className: "ok" }
        : { label: "przekroczone", className: "exceeded" };
    }

    if (target.type === "minimum") {
      return value >= target.value
        ? { label: "OK", className: "ok" }
        : { label: "brakuje", className: "missing" };
    }

    if (value < target.value) return { label: "brakuje", className: "missing" };
    if (value > target.value) return { label: "przekroczone", className: "exceeded" };
    return { label: "OK", className: "ok" };
  }

  function getTargetText(target) {
    if (target.type === "range") {
      return `${formatNumber(target.min)}–${formatNumber(target.max)} ${target.unit}`;
    }
    if (target.type === "max") {
      return `maks. ${formatNumber(target.value)} ${target.unit}`;
    }
    if (target.type === "minimum") {
      return `min. ${formatNumber(target.value)} ${target.unit}`;
    }
    return `${formatNumber(target.value)} ${target.unit}`;
  }

  function getEatingWindowState(now = new Date()) {
    const toMinutes = (value) => {
      const [hours, minutes] = value.split(":").map(Number);
      return hours * 60 + minutes;
    };
    const current = now.getHours() * 60 + now.getMinutes();
    const start = toMinutes(settings.eatingWindowStart);
    const end = toMinutes(settings.eatingWindowEnd);
    if (start === end) return "during";
    if (start < end) {
      if (current < start) return "before";
      if (current <= end) return "during";
      return "after";
    }
    return current >= start || current <= end ? "during" : "before";
  }

  function calculateAlerts() {
    const priorities = {
      sod: 1, potas: 1, magnez: 1, bialko: 2, kalorie: 2, wegle_netto: 2,
      omega3_epa_dha: 3, blonnik: 3,
    };
    const order = [
      "potas", "magnez", "sod", "bialko", "kalorie", "wegle_netto", "omega3_epa_dha", "blonnik",
      "witamina_d3", "witamina_a", "witamina_e", "witamina_k2", "zelazo", "cynk", "selen", "jod",
      "tluste_ryby", "podroby", "kiszonki", "warzywa_krzyzowe", "zielone_warzywa", "orzechy_pestki", "jaja",
    ];
    const detailAlerts = [];
    getGoalGroups().forEach((group) => {
      const periodEntries = getEntriesForDays(group.days);
      group.goals.forEach((target) => {
        if (target.type === "count" || (group.days === 1 && target.key === "tluszcz")) return;
        const value = target.isTag ? countTag(periodEntries, target.key) : sumNutrient(periodEntries, target.key);
        const status = getStatus(value, target);
        if (status.label === "OK") return;
        const priority = priorities[target.key] || (group.days === 7 ? 4 : 5);
        if (status.label === "przekroczone") {
          if (target.key === "wegle_netto") {
            detailAlerts.push({
              key: target.key, priority, exceeded: true, period: "today",
              detail: `Dziś: ${formatNumber(value)} ${target.unit} / maks. ${formatNumber(target.value)} ${target.unit}.`,
            });
          }
          return;
        }
        const minimum = target.type === "range" ? target.min : target.value;
        const periodLabel = group.days === 1 ? "Dziś" : `Ostatnie ${group.days} dni`;
        detailAlerts.push({
          priority,
          key: target.key,
          period: group.days === 1 ? "today" : `days${group.days}`,
          detail: target.isTag
            ? `${periodLabel}: ${formatNumber(value)} / min. ${formatNumber(minimum)} wpisów.`
            : `${periodLabel}: brakuje ok. ${formatNumber(Math.max(0, minimum - value))} ${target.unit}.`,
        });
      });
    });
    return groupAlertsByKey(detailAlerts).sort((a, b) =>
      a.priority - b.priority || order.indexOf(a.key) - order.indexOf(b.key));
  }

  function groupAlertsByKey(detailAlerts) {
    const groups = new Map();
    detailAlerts.forEach((alert) => {
      if (!groups.has(alert.key)) {
        groups.set(alert.key, {
          key: alert.key,
          label: LABELS[alert.key],
          priority: alert.priority,
          exceeded: false,
          periods: [],
          details: [],
        });
      }
      const group = groups.get(alert.key);
      group.exceeded ||= Boolean(alert.exceeded);
      group.periods.push(alert.period);
      group.details.push(alert.detail);
    });
    return [...groups.values()].map((group) => {
      if (group.exceeded) {
        group.shortMessage = "Limit dzienny został przekroczony.";
      } else if (group.periods.includes("today") && group.periods.includes("days3")) {
        group.shortMessage = "Brakuje dziś i w skali 3 dni.";
      } else if (group.periods.includes("today")) {
        group.shortMessage = "Brakuje do celu dziennego.";
      } else if (group.periods.includes("days30")) {
        group.shortMessage = "Warto zaplanować w najbliższych dniach.";
      } else {
        group.shortMessage = "Warto uwzględnić w najbliższym planie.";
      }
      return group;
    });
  }

  function getTomorrowPlan() {
    const preferred = ["potas", "magnez", "sod", "omega3_epa_dha", "blonnik", "jod", "selen", "cynk", "witamina_d3", "tluste_ryby", "podroby", "kiszonki", "warzywa_krzyzowe"];
    const missing = new Set(calculateAlerts().map((alert) => alert.key));
    return preferred.filter((key) => missing.has(key)).slice(0, 3);
  }

  function renderAlerts() {
    const alerts = calculateAlerts();
    elements.alertsList.replaceChildren();
    if (alerts.length === 0) {
      const item = document.createElement("div");
      item.className = "alert-item";
      item.textContent = "Najważniejsze cele są dziś pod kontrolą.";
      elements.alertsList.append(item);
    } else {
      (alertsExpanded ? alerts : alerts.slice(0, 3)).forEach((alert) => {
        const item = document.createElement("div");
        item.className = `alert-item${alert.exceeded ? " exceeded" : ""}`;
        const title = document.createElement("strong");
        title.className = "alert-title";
        title.textContent = alert.label;
        const short = document.createElement("span");
        short.className = "alert-short";
        short.textContent = alert.shortMessage;
        item.append(title, short);
        if (alertsExpanded) {
          const details = document.createElement("ul");
          details.className = "alert-details";
          alert.details.forEach((detail) => {
            const row = document.createElement("li");
            row.textContent = detail;
            details.append(row);
          });
          item.append(details);
        }
        elements.alertsList.append(item);
      });
    }
    elements.toggleAlertsButton.hidden = alerts.length <= 3;
    elements.toggleAlertsButton.textContent = alertsExpanded ? "Pokaż mniej" : "Pokaż więcej";

    const plan = getTomorrowPlan();
    elements.tomorrowPlanList.replaceChildren();
    (plan.length ? plan : ["Najważniejsze cele są pod kontrolą"]).forEach((key) => {
      const item = document.createElement("div");
      item.className = "tomorrow-plan-item";
      item.textContent = LABELS[key] || key;
      elements.tomorrowPlanList.append(item);
    });

    const names = alerts.slice(0, 3).map((alert) => alert.label.toLocaleLowerCase("pl"));
    const list = names.length ? names.join(", ") : "najważniejsze cele";
    const state = getEatingWindowState();
    elements.eatingWindowMessage.textContent = state === "before"
      ? `Okno jedzenia zaczyna się o ${settings.eatingWindowStart}. Dzisiaj warto zaplanować: ${list}.`
      : state === "during"
        ? `Do domknięcia w dzisiejszym oknie: ${list}.`
        : `Okno jedzenia już minęło. Na jutro warto zaplanować: ${list}.`;
  }

  function renderSettings() {
    elements.settingsFields.replaceChildren();
    SETTINGS_GROUPS.forEach((group) => {
      const section = document.createElement("section");
      section.className = "settings-group";
      const title = document.createElement("h3");
      title.textContent = group.title;
      const grid = document.createElement("div");
      grid.className = "settings-grid";
      group.fields.forEach(([key, label, type = "number"]) => {
        const field = document.createElement("label");
        field.className = "settings-field";
        field.textContent = label;
        let control;
        if (type === "select") {
          control = document.createElement("select");
          [["system", "Systemowy"], ["light", "Jasny"], ["dark", "Ciemny"]].forEach(([value, text]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            control.append(option);
          });
        } else {
          control = document.createElement("input");
          control.type = type;
          if (type === "number") {
            control.min = "0";
            control.step = "any";
          }
        }
        control.name = key;
        control.value = settings[key];
        field.append(control);
        grid.append(field);
      });
      section.append(title, grid);
      elements.settingsFields.append(section);
    });
  }

  function readSettingsForm() {
    const result = { ...getDefaultSettings() };
    new FormData(elements.settingsForm).forEach((value, key) => {
      result[key] = key.startsWith("eatingWindow") || key === "theme" ? value : Number(value);
    });
    return result;
  }

  function applyTheme() {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!["system", "light", "dark"].includes(settings.theme)) settings.theme = "system";
    const resolvedTheme = settings.theme === "system" ? (systemDark ? "dark" : "light") : settings.theme;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    elements.themeColorMeta.content = resolvedTheme === "dark" ? "#08111f" : "#f1f5f2";
  }

  function renderSummaries() {
    elements.summarySections.replaceChildren();

    getGoalGroups().forEach((group) => {
      const periodEntries = getEntriesForDays(group.days);
      const section = document.createElement("section");
      section.className = "summary-group";

      const header = document.createElement("div");
      header.className = "summary-group-header";
      const title = document.createElement("h3");
      title.textContent = group.title;
      const period = document.createElement("span");
      period.className = "summary-period";
      period.textContent = `${periodEntries.length} ${periodEntries.length === 1 ? "wpis" : "wpisów"}`;
      header.append(title, period);

      const grid = document.createElement("div");
      grid.className = "goal-grid";

      group.goals.forEach((target) => {
        const value = target.isTag
          ? countTag(periodEntries, target.key)
          : sumNutrient(periodEntries, target.key);

        const row = document.createElement("div");
        row.className = "goal-row";

        const name = document.createElement("span");
        name.className = "goal-name";
        name.textContent = LABELS[target.key];

        const values = document.createElement("span");
        values.className = "goal-values";
        if (target.type === "count") {
          values.textContent = `${formatNumber(value)} ${target.unit}`;
          row.append(name, values);
        } else {
          const status = getStatus(value, target);
          values.textContent = `${formatNumber(value)} ${target.unit} / ${getTargetText(target)}`;
          const statusElement = document.createElement("span");
          statusElement.className = `status ${status.className}`;
          statusElement.textContent = status.label;
          row.append(name, statusElement, values);
        }
        grid.append(row);
      });

      section.append(header, grid);
      elements.summarySections.append(section);
    });
  }

  function createMacro(label, value, unit) {
    const item = document.createElement("div");
    item.className = "macro";
    const name = document.createElement("span");
    name.textContent = label;
    const amount = document.createElement("strong");
    amount.textContent = `${formatNumber(value)} ${unit}`;
    item.append(name, amount);
    return item;
  }

  function renderEntries() {
    elements.entriesList.replaceChildren();
    elements.entryCount.textContent = String(entries.length);

    if (entries.length === 0) {
      elements.entriesList.append(elements.emptyTemplate.content.cloneNode(true));
      return;
    }

    entries
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, 50)
      .forEach((entry) => {
        const article = document.createElement("article");
        article.className = "entry-item";

        const top = document.createElement("div");
        top.className = "entry-top";
        const date = document.createElement("span");
        date.className = "entry-date";
        date.textContent = formatDate(entry.date);
        const actions = document.createElement("div");
        actions.className = "entry-actions";
        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.type = "button";
        editButton.textContent = "Edytuj";
        editButton.dataset.editEntryId = entry.id;
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "Usuń";
        deleteButton.dataset.deleteEntryId = entry.id;
        actions.append(editButton, deleteButton);
        top.append(date, actions);

        const macros = document.createElement("div");
        macros.className = "macro-list";
        macros.append(
          createMacro("Kalorie", entry.parsedData?.kalorie, "kcal"),
          createMacro("Białko", entry.parsedData?.bialko, "g"),
          createMacro("Tłuszcz", entry.parsedData?.tluszcz, "g"),
          createMacro("Węgle netto", entry.parsedData?.wegle_netto, "g"),
        );

        article.append(top, macros);

        if (entry.tags?.length) {
          const tagList = document.createElement("div");
          tagList.className = "tag-list";
          entry.tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.className = "tag";
            tagElement.textContent = LABELS[tag] || tag;
            tagList.append(tagElement);
          });
          article.append(tagList);
        }

        elements.entriesList.append(article);
      });
  }

  function renderAll() {
    renderSummaries();
    renderAlerts();
    renderEntries();
  }

  function setMessage(element, text, type = "") {
    element.textContent = text;
    element.className = `message ${type}`.trim();
  }

  async function refreshEntries() {
    entries = await window.ketoDb.getAllEntries();
    renderAll();
  }

  async function handleSave() {
    const rawText = elements.rawInput.value.trim();
    const date = elements.entryDate.value;

    if (!rawText) {
      setMessage(elements.formMessage, "Wklej dane przed zapisaniem.", "error");
      elements.rawInput.focus();
      return;
    }

    if (!date) {
      setMessage(elements.formMessage, "Wybierz datę wpisu.", "error");
      elements.entryDate.focus();
      return;
    }

    const { parsedData, tags, detectedCount } = parseNutritionText(rawText);
    if (detectedCount === 0) {
      setMessage(
        elements.formMessage,
        editingEntryId
          ? "Nie wykryto danych liczbowych. Zmiany nie zostały zapisane."
          : "Nie wykryto danych liczbowych. Sprawdź format wpisu.",
        "error",
      );
      return;
    }

    let entry;
    if (editingEntryId) {
      const existingEntry = entries.find((item) => item.id === editingEntryId);
      if (!existingEntry) {
        setMessage(elements.formMessage, "Nie znaleziono wpisu do edycji.", "error");
        cancelEditEntry(false);
        return;
      }
      entry = createUpdatedEntry(existingEntry, date, rawText, parsedData, tags);
    } else {
      entry = { id: createId(), date, createdAt: new Date().toISOString(), rawText, parsedData, tags };
    }

    try {
      await window.ketoDb.saveEntry(entry);
      const confirmation = tags.length
        ? `${editingEntryId ? "Zmiany zapisane" : "Wpis zapisany"}. Wykryto ${detectedCount} wartości i tagi: ${tags.join(", ")}.`
        : `${editingEntryId ? "Zmiany zapisane" : "Wpis zapisany"}. Nie wykryto tagów.`;
      cancelEditEntry(false);
      setMessage(elements.formMessage, confirmation, "success");
      await refreshEntries();
    } catch (error) {
      console.error(error);
      setMessage(elements.formMessage, "Nie udało się zapisać wpisu.", "error");
    }
  }

  function startEditEntry(id) {
    const entry = entries.find((item) => item.id === id);
    if (!entry) {
      setMessage(elements.formMessage, "Nie znaleziono wpisu do edycji.", "error");
      return;
    }
    editingEntryId = id;
    elements.entryDate.value = entry.date;
    elements.rawInput.value = entry.rawText;
    elements.saveButton.textContent = "Zapisz zmiany";
    elements.cancelEditButton.hidden = false;
    elements.editModeMessage.hidden = false;
    elements.editModeMessage.textContent = `Edytujesz wpis z dnia: ${entry.date}`;
    setMessage(elements.formMessage, "");
    elements.rawInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditEntry(clearMessage = true) {
    editingEntryId = null;
    elements.entryDate.value = localDateString();
    elements.rawInput.value = "";
    elements.saveButton.textContent = "Zapisz wpis";
    elements.cancelEditButton.hidden = true;
    elements.editModeMessage.hidden = true;
    if (clearMessage) setMessage(elements.formMessage, "");
  }

  async function handleDelete(id) {
    if (!window.confirm("Usunąć ten wpis?")) {
      return;
    }

    try {
      await window.ketoDb.deleteEntry(id);
      if (editingEntryId === id) cancelEditEntry();
      await refreshEntries();
    } catch (error) {
      console.error(error);
      setMessage(elements.formMessage, "Nie udało się usunąć wpisu.", "error");
    }
  }

  async function handleExport() {
    try {
      const allEntries = await window.ketoDb.getAllEntries();
      const payload = {
        app: "Bilans",
        version: 2,
        exportedAt: new Date().toISOString(),
        entries: allEntries,
        settings,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "keto-backup.json";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage(elements.backupMessage, `Wyeksportowano ${allEntries.length} wpisów.`, "success");
    } catch (error) {
      console.error(error);
      setMessage(elements.backupMessage, "Nie udało się wyeksportować danych.", "error");
    }
  }

  function isValidImportedEntry(entry) {
    return Boolean(
      entry
      && typeof entry.id === "string"
      && typeof entry.date === "string"
      && typeof entry.createdAt === "string"
      && typeof entry.rawText === "string"
      && entry.parsedData
      && typeof entry.parsedData === "object"
      && Array.isArray(entry.tags),
    );
  }

  async function handleImportFile(file) {
    try {
      const data = JSON.parse(await file.text());
      const importedEntries = Array.isArray(data) ? data : data.entries;
      if (!Array.isArray(importedEntries)) {
        throw new Error("Nieprawidłowy format pliku.");
      }

      const validEntries = importedEntries.filter(isValidImportedEntry);
      const importedCount = await window.ketoDb.importEntries(validEntries);
      settings = { ...getDefaultSettings(), ...(data.settings || {}) };
      await window.ketoDb.saveSettings(settings);
      applyTheme();
      renderSettings();
      await refreshEntries();
      setMessage(
        elements.backupMessage,
        `Zaimportowano ${importedCount} nowych wpisów. Pominięto ${importedEntries.length - importedCount}.`,
        "success",
      );
    } catch (error) {
      console.error(error);
      setMessage(elements.backupMessage, "Nie udało się zaimportować pliku JSON.", "error");
    } finally {
      elements.importInput.value = "";
    }
  }

  async function requestPersistentStorage() {
    const status = elements.storageStatus;
    if (!navigator.storage?.persist) {
      status.textContent = "Pamięć trwała: niepotwierdzona — rób kopie zapasowe";
      return;
    }

    try {
      const persistent = await navigator.storage.persist();
      status.textContent = persistent
        ? "Pamięć trwała: aktywna"
        : "Pamięć trwała: niepotwierdzona — rób kopie zapasowe";
    } catch (error) {
      console.error(error);
      status.textContent = "Pamięć trwała: niepotwierdzona — rób kopie zapasowe";
    }
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch((error) => {
        console.error("Service worker registration failed:", error);
      });
    }
  }

  function bindEvents() {
    elements.saveButton.addEventListener("click", handleSave);
    elements.clearButton.addEventListener("click", () => {
      elements.rawInput.value = "";
      setMessage(elements.formMessage, "");
      elements.rawInput.focus();
    });
    elements.cancelEditButton.addEventListener("click", () => cancelEditEntry());
    elements.toggleAlertsButton.addEventListener("click", () => {
      alertsExpanded = !alertsExpanded;
      renderAlerts();
    });
    elements.entriesList.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit-entry-id]");
      const deleteButton = event.target.closest("[data-delete-entry-id]");
      if (editButton) startEditEntry(editButton.dataset.editEntryId);
      if (deleteButton) handleDelete(deleteButton.dataset.deleteEntryId);
    });
    elements.exportButton.addEventListener("click", handleExport);
    elements.importButton.addEventListener("click", () => elements.importInput.click());
    elements.importInput.addEventListener("change", () => {
      const [file] = elements.importInput.files;
      if (file) {
        handleImportFile(file);
      }
    });
    elements.settingsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      settings = readSettingsForm();
      await window.ketoDb.saveSettings(settings);
      applyTheme();
      renderAll();
      setMessage(elements.settingsMessage, "Ustawienia zapisane.", "success");
    });
    elements.resetSettingsButton.addEventListener("click", async () => {
      settings = getDefaultSettings();
      await window.ketoDb.saveSettings(settings);
      applyTheme();
      renderSettings();
      renderAll();
      setMessage(elements.settingsMessage, "Przywrócono ustawienia domyślne.", "success");
    });
    elements.installButton.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      elements.installButton.hidden = true;
    });
    window.addEventListener("beforeinstallprompt", (event) => {
      if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) return;
      event.preventDefault();
      deferredInstallPrompt = event;
      elements.installButton.hidden = false;
    });
    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      elements.installButton.hidden = true;
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (settings.theme === "system") applyTheme();
    });
  }

  async function init() {
    Object.assign(elements, {
      backupMessage: document.querySelector("#backup-message"),
      alertsList: document.querySelector("#alerts-list"),
      cancelEditButton: document.querySelector("#cancel-edit-button"),
      clearButton: document.querySelector("#clear-button"),
      eatingWindowMessage: document.querySelector("#eating-window-message"),
      editModeMessage: document.querySelector("#edit-mode-message"),
      emptyTemplate: document.querySelector("#empty-entries-template"),
      entriesList: document.querySelector("#entries-list"),
      entryCount: document.querySelector("#entry-count"),
      entryDate: document.querySelector("#entry-date"),
      exportButton: document.querySelector("#export-button"),
      formMessage: document.querySelector("#form-message"),
      importButton: document.querySelector("#import-button"),
      importInput: document.querySelector("#import-input"),
      installButton: document.querySelector("#install-button"),
      rawInput: document.querySelector("#raw-input"),
      resetSettingsButton: document.querySelector("#reset-settings-button"),
      saveButton: document.querySelector("#save-button"),
      settingsFields: document.querySelector("#settings-fields"),
      settingsForm: document.querySelector("#settings-form"),
      settingsMessage: document.querySelector("#settings-message"),
      storageStatus: document.querySelector("#storage-status"),
      summarySections: document.querySelector("#summary-sections"),
      themeColorMeta: document.querySelector("#theme-color-meta"),
      tomorrowPlanList: document.querySelector("#tomorrow-plan-list"),
      toggleAlertsButton: document.querySelector("#toggle-alerts-button"),
    });

    elements.entryDate.value = localDateString();
    bindEvents();
    registerServiceWorker();
    requestPersistentStorage();

    try {
      settings = { ...getDefaultSettings(), ...await window.ketoDb.getSettings() };
      applyTheme();
      renderSettings();
      await refreshEntries();
    } catch (error) {
      console.error(error);
      setMessage(elements.formMessage, "Nie udało się otworzyć lokalnej bazy danych.", "error");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

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
    "owoce",
    "straczki",
    "slodycze",
    "kiszonki",
    "orzechy_pestki",
  ];

  const AUXILIARY_TAGS = ["fermentowane", "suplement", "wysokie_wegle"];

  const TAG_ALIASES = {
    jaja: ["jaja", "jajka", "jajko"],
    tluste_ryby: ["tluste_ryby", "tluste ryby", "makrela", "losos", "sledz", "sardynki", "sardynka"],
    owoce_morza_ryby_morskie: [
      "owoce_morza_ryby_morskie", "owoce morza", "ryby morskie", "ryba morska",
      "tunczyk", "dorsz", "losos", "krewetki", "krewetka", "malze", "ostrygi",
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
    owoce: [
      "owoce", "owoc", "truskawki", "truskawka", "borowki", "borowka", "maliny", "malina",
      "jablka", "jablko", "gruszki", "gruszka", "banany", "banan", "cytrusy", "winogrona", "kiwi",
    ],
    straczki: ["straczki", "ciecierzyca", "fasola", "soczewica", "groch", "soja"],
    slodycze: ["slodycze", "czekolada", "cukierki", "batony", "baton", "ciastka", "ciasto", "lody"],
    kiszonki: ["kiszonki", "kiszonka", "kapusta kiszona", "ogorki kiszone", "ogorek kiszony", "kimchi"],
    orzechy_pestki: [
      "orzechy_pestki", "orzechy", "pestki", "pestki dyni", "slonecznik", "chia",
      "siemie lniane", "migdaly", "orzechy wloskie", "orzechy brazylijskie",
    ],
    fermentowane: [
      "fermentowane", "kapusta kiszona", "ogorki kiszone", "ogorek kiszony", "kimchi",
      "kefir", "jogurt", "sery dojrzewajace", "ser dojrzewajacy",
    ],
    suplement: [
      "suplement", "witamina d3", "magnez", "elektrolity", "omega 3", "omega3", "tran",
    ],
    wysokie_wegle: [
      "wysokie_wegle", "wysokie wegle", "ziemniaki", "ziemniak", "ryz", "kasza",
      "makaron", "pieczywo", "buraki", "burak",
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
    owoce_morza_ryby_morskie: "Ryby morskie i owoce morza",
    mieso_czerwone: "Mięso czerwone",
    drob: "Drób",
    nabial: "Nabiał",
    tluszcze_czyste: "Tłuszcze czyste",
    warzywa_krzyzowe: "Warzywa krzyżowe",
    tluste_ryby: "Tłuste ryby",
    podroby: "Podroby",
    jaja: "Jaja",
    zielone_warzywa: "Zielone warzywa",
    owoce: "Owoce",
    straczki: "Strączki",
    slodycze: "Słodycze",
    kiszonki: "Kiszonki",
    orzechy_pestki: "Orzechy i pestki",
    fermentowane: "Fermentowane",
    suplement: "Suplement",
    wysokie_wegle: "Wysokie węgle",
  };

  const FOOD_SUGGESTIONS = [
    foodSuggestion("Awokado", "awokado", ["potas", "witamina_e", "tluszcz", "kalorie"]),
    foodSuggestion("Pomidor", "pomidor", ["potas"]),
    foodSuggestion("Buraki", "buraki", ["potas", "blonnik"]),
    foodSuggestion("Ziemniaki", "ziemniaki", ["potas"]),
    foodSuggestion("Szpinak", "szpinak", ["potas", "magnez", "blonnik"], ["zielone_warzywa"]),
    foodSuggestion("Pestki dyni", "pestki-dyni", ["magnez", "cynk", "blonnik"], ["orzechy_pestki"]),
    foodSuggestion("Kakao", "kakao", ["magnez"]),
    foodSuggestion("Migdały", "migdaly", ["magnez", "witamina_e", "blonnik"], ["orzechy_pestki"]),
    foodSuggestion("Kasza gryczana", "kasza-gryczana", ["magnez", "blonnik"]),
    foodSuggestion("Sól jodowana", "sol-jodowana", ["sod", "jod"]),
    foodSuggestion("Bulion", "bulion", ["sod"]),
    foodSuggestion("Kiszonki", "kiszonki", ["sod", "blonnik"], ["kiszonki"]),
    foodSuggestion("Ogórki kiszone", "ogorki-kiszone", ["sod", "blonnik"], ["kiszonki"]),
    foodSuggestion("Kapusta kiszona", "kapusta-kiszona", ["sod", "blonnik"], ["kiszonki"]),
    foodSuggestion("Makrela", "makrela", ["omega3_epa_dha", "witamina_d3", "selen", "jod", "bialko"], ["tluste_ryby", "owoce_morza_ryby_morskie"]),
    foodSuggestion("Sardynki", "sardynki", ["omega3_epa_dha", "witamina_d3", "selen", "jod", "bialko"], ["tluste_ryby", "owoce_morza_ryby_morskie"]),
    foodSuggestion("Śledź", "sledz", ["omega3_epa_dha", "witamina_d3", "selen", "jod", "bialko"], ["tluste_ryby", "owoce_morza_ryby_morskie"]),
    foodSuggestion("Tran", "tran", ["omega3_epa_dha", "witamina_d3", "witamina_a"]),
    foodSuggestion("Łosoś", "losos", ["omega3_epa_dha", "witamina_d3", "selen", "bialko"], ["tluste_ryby", "owoce_morza_ryby_morskie"]),
    foodSuggestion("Siemię lniane", "siemie-lniane", ["blonnik", "magnez"], ["orzechy_pestki"]),
    foodSuggestion("Chia", "chia", ["blonnik", "magnez"], ["orzechy_pestki"]),
    foodSuggestion("Warzywa krzyżowe", "warzywa-krzyzowe", ["blonnik", "potas", "wegle_netto"], ["warzywa_krzyzowe"]),
    foodSuggestion("Brokuł", "brokul", ["blonnik", "potas", "wegle_netto"], ["warzywa_krzyzowe"]),
    foodSuggestion("Kalafior", "kalafior", ["blonnik", "wegle_netto"], ["warzywa_krzyzowe"]),
    foodSuggestion("Zielone warzywa", "zielone-warzywa", ["blonnik", "potas", "magnez", "wegle_netto"], ["zielone_warzywa"]),
    foodSuggestion("Rukola", "rukola", ["potas", "blonnik", "wegle_netto"], ["zielone_warzywa"]),
    foodSuggestion("Jajka", "jajka", ["bialko", "witamina_d3", "witamina_a", "witamina_k2", "zelazo", "cynk", "selen", "tluszcz", "kalorie", "wegle_netto"], ["jaja"]),
    foodSuggestion("Omlet", "omlet", ["bialko", "tluszcz", "kalorie", "wegle_netto"], ["jaja"]),
    foodSuggestion("Jajka na miękko", "jajka-na-miekko", ["bialko", "selen", "wegle_netto"], ["jaja"]),
    foodSuggestion("Twaróg", "twarog", ["bialko"]),
    foodSuggestion("Kurczak", "kurczak", ["bialko"]),
    foodSuggestion("Wołowina", "wolowina", ["bialko", "zelazo", "cynk"]),
    foodSuggestion("Ryby", "ryby", ["bialko", "selen", "jod", "wegle_netto"], ["owoce_morza_ryby_morskie"]),
    foodSuggestion("Suplement D3", "suplement-d3", ["witamina_d3"]),
    foodSuggestion("Słońce", "slonce", ["witamina_d3"]),
    foodSuggestion("Wątróbka", "watrobka", ["witamina_a", "zelazo", "cynk", "bialko"], ["podroby"]),
    foodSuggestion("Masło", "maslo", ["witamina_a", "tluszcz"]),
    foodSuggestion("Sery", "sery", ["witamina_a", "bialko", "tluszcz", "kalorie"]),
    foodSuggestion("Marchew", "marchew", ["witamina_a", "blonnik"]),
    foodSuggestion("Pestki", "pestki", ["witamina_e", "magnez", "cynk"], ["orzechy_pestki"]),
    foodSuggestion("Oliwa", "oliwa", ["witamina_e", "tluszcz"]),
    foodSuggestion("Sery dojrzewające", "sery-dojrzewajace", ["witamina_k2", "bialko", "tluszcz"]),
    foodSuggestion("Fermentowane produkty", "fermentowane", ["witamina_k2"], ["kiszonki"]),
    foodSuggestion("Podroby", "podroby", ["witamina_a", "zelazo", "cynk", "bialko"], ["podroby"]),
    foodSuggestion("Serca drobiowe", "serca-drobiowe", ["zelazo", "cynk", "bialko"], ["podroby"]),
    foodSuggestion("Orzechy brazylijskie", "orzechy-brazylijskie", ["selen", "magnez"], ["orzechy_pestki"]),
    foodSuggestion("Owoce morza", "owoce-morza", ["jod", "selen", "cynk", "bialko"], ["owoce_morza_ryby_morskie"]),
  ];

  const SETTINGS_GROUPS = [
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
  let customDishes = [];
  let settings = getDefaultSettings();
  let deferredInstallPrompt = null;
  let alertsExpanded = false;
  let editingEntryId = null;
  let editingDishId = null;
  let currentView = "start";
  let homeProgressDays = 1;
  let isAiParsing = false;
  let isDishAiParsing = false;
  const AI_DEBUG_TOTAL_COST_KEY = "vitatrack_ai_debug_total_cost_usd";
  const HIDDEN_MISSING_FOODS_KEY = "vitatrack_hidden_missing_foods_v1";
  const FOOD_LOOKUP_TEST_CASES = [
    { query: "jajka", amount_g: 120, variant: null, fdc_id: null, limit: 5 },
    { query: "truskawki", amount_g: 200, variant: null, fdc_id: null, limit: 5 },
    { query: "oliwa", amount_g: 10, variant: null, fdc_id: null, limit: 5 },
    { query: "brokul", amount_g: 150, variant: null, fdc_id: null, limit: 5 },
    { query: "papaja", amount_g: 100, variant: null, fdc_id: null, limit: 5 },
  ];
  const aiDebugState = {
    request: "idle",
    fetchStarted: "nie",
    http: "-",
    errorType: "-",
    errorMessage: "-",
    foodLookupStatus: "-",
    duration: "-",
    parsedKeys: "-",
    rawResponse: "-",
    model: "-",
    inputTokens: "brak danych usage",
    outputTokens: "brak danych usage",
    totalTokens: "brak danych usage",
    lastCost: "brak danych usage",
    totalCost: readDebugTotalCost(),
  };

  function getDefaultSettings() {
    return {
      theme: "light",
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

  function foodSuggestion(name, imageKey, supports, tags = []) {
    return { name, imageKey, supports, tags };
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
    return [...TAGS, ...AUXILIARY_TAGS].filter((tag) => TAG_ALIASES[tag].some((alias) => {
      const normalizedAlias = normalizeText(alias);
      return searchableText.includes(` ${normalizedAlias} `);
    }));
  }

  function parseProducts(rawText) {
    const products = [];
    let inProductsSection = false;

    rawText.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();
      const normalizedLine = normalizeText(trimmedLine);
      if (normalizedLine === "produkty:") {
        inProductsSection = true;
        return;
      }
      if (inProductsSection && /^[^|]+:\s*$/.test(trimmedLine)) {
        inProductsSection = false;
        return;
      }
      if (!inProductsSection || !trimmedLine) return;

      const match = trimmedLine.match(/^([^|]+?)\s*\|\s*([-+]?\d+(?:[.,]\d+)?)\s*g\b/i);
      if (!match) return;
      const amountG = Number.parseFloat(match[2].replace(",", "."));
      if (!Number.isFinite(amountG)) return;
      products.push({ name: match[1].trim(), amountG });
    });

    return products;
  }

  function isCustomDishText(rawText) {
    return rawText.split(/\r?\n/).some((line) => normalizeText(line) === "typ: danie wieloskladnikowe");
  }

  function parseNamedValue(rawText, key) {
    const normalizedKey = normalizeText(key);
    const line = rawText.split(/\r?\n/).find((item) => normalizeText(item).startsWith(`${normalizedKey}:`));
    if (!line) return "";
    return line.slice(line.indexOf(":") + 1).trim();
  }

  function parseNutrientSection(rawText, sectionName) {
    const data = Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, 0]));
    const detectedFields = new Set();
    let inSection = false;

    rawText.split(/\r?\n/).forEach((line) => {
      const normalizedLine = normalizeText(line);
      if (normalizedLine === `${normalizeText(sectionName)}:`) {
        inSection = true;
        return;
      }
      if (inSection && /^[^|]+:\s*$/.test(line.trim())) {
        inSection = false;
        return;
      }
      if (!inSection || !normalizedLine) return;
      Object.entries(NUTRIENT_ALIASES).some(([key, aliases]) => aliases.some((alias) => {
        const aliasPattern = escapeRegExp(normalizeText(alias)).replace(/\s+/g, "\\s+");
        const match = normalizedLine.match(new RegExp(`^${aliasPattern}\\s*:\\s*([-+]?\\d+(?:[.,]\\d+)?)`));
        if (!match) return false;
        data[key] = Number.parseFloat(match[1].replace(",", "."));
        detectedFields.add(key);
        return true;
      }));
    });
    return { data, detectedCount: detectedFields.size };
  }

  function parseCustomDish(rawText) {
    if (!isCustomDishText(rawText)) return null;
    const id = parseNamedValue(rawText, "id");
    const name = parseNamedValue(rawText, "nazwa");
    const explicitTotalMassG = extractExplicitDishTotalMass(rawText);
    const parsedTotalMassG = Number.parseFloat(parseNamedValue(rawText, "masa_calkowita_g").replace(",", "."));
    const totalMassG = explicitTotalMassG || parsedTotalMassG;
    const total = parseNutrientSection(rawText, "calosc");
    if (!id || !name || !Number.isFinite(totalMassG) || totalMassG <= 0 || total.detectedCount === 0) return null;

    const per100g = parseNutrientSection(rawText, "na_100g");
    const per100gData = per100g.detectedCount > 0
      ? per100g.data
      : Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, total.data[key] / totalMassG * 100]));
    return {
      id,
      name,
      totalMassG,
      massSource: parseNamedValue(rawText, "masa_zrodlo"),
      portionCalculation: parseNamedValue(rawText, "liczenie_porcji"),
      totalData: total.data,
      per100gData,
      tags: detectTags(rawText),
      products: parseProducts(rawText),
      rawText,
    };
  }

  function parseNutritionText(rawText) {
    const parsedData = Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, 0]));
    const detectedFields = new Set();
    let inProductsSection = false;

    rawText.split(/\r?\n/).forEach((line) => {
      const normalizedLine = normalizeText(line);
      if (!normalizedLine) return;
      if (normalizedLine === "produkty:") {
        inProductsSection = true;
        return;
      }
      if (inProductsSection && /^[^|]+:\s*$/.test(line.trim())) {
        inProductsSection = false;
      }
      if (inProductsSection) return;

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
      products: parseProducts(rawText),
      detectedCount: detectedFields.size,
    };
  }

  function createId() {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function createUpdatedEntry(existingEntry, date, rawText, parsedData, tags, products, updatedAt = new Date().toISOString()) {
    return { ...existingEntry, date, rawText, parsedData, tags, products, updatedAt };
  }

  function extractExplicitDishTotalMass(rawText) {
    const normalized = normalizeText(rawText).replace(/\s+/g, " ");
    const patterns = [
      /\bmasa calosci\s*(?:wynosi\s*)?(\d+(?:[.,]\d+)?)\s*g\b/,
      /\bcalosc po ugotowaniu\s*(?:wynosi\s*)?(\d+(?:[.,]\d+)?)\s*g\b/,
      /\bpo ugotowaniu\s*(?:wynosi\s*)?(\d+(?:[.,]\d+)?)\s*g\b/,
      /\bcalosc\s*(?:wynosi\s*)?(\d+(?:[.,]\d+)?)\s*g\b/,
    ];
    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (!match) continue;
      const value = Number.parseFloat(match[1].replace(",", "."));
      if (Number.isFinite(value) && value > 0) return value;
    }
    return null;
  }

  function getEntryDataSource(entry) {
    const source = entry?.dataSource || entry?.nutritionSource;
    if (!source || typeof source !== "object") {
      return {
        type: "unknown",
        label: "Źródło nieznane",
        badgeText: "Źródło nieznane",
        className: "unknown",
        foodLookupStatus: null,
      };
    }
    const type = source.type || "unknown";
    if (type === "food_database") {
      return { ...source, badgeText: "Baza", className: "database" };
    }
    if (type === "food_database_proxy") {
      return { ...source, badgeText: "! Baza proxy", className: "proxy" };
    }
    if (type === "ai_fallback_missing") {
      return { ...source, badgeText: "! Brak w bazie", className: "missing" };
    }
    if (type === "mixed_food_database_ai_fallback") {
      return { ...source, badgeText: "Baza + brak", className: "mixed" };
    }
    if (type === "custom_dish") {
      const ingredientText = getDishIngredientQualityText(source.ingredientSource);
      return {
        ...source,
        label: ingredientText ? `Danie własne · ${ingredientText}` : "Danie własne",
        badgeText: "Danie własne",
        className: "custom-dish",
      };
    }
    if (type === "ai_fallback_database_error" || type === "ai_fallback_database_mapping_error") {
      return { ...source, badgeText: "! Błąd bazy / AI", className: "error" };
    }
    return { ...source, badgeText: source.label || "Źródło nieznane", className: "unknown" };
  }

  function getProductSourceBadgeInfo(product) {
    const statusMap = {
      food_database: { text: "Baza", className: "database" },
      food_database_proxy: { text: "Baza proxy", className: "proxy" },
      ai_fallback_missing: { text: "Brak w bazie", className: "missing" },
      food_lookup_error: { text: "Błąd bazy", className: "error" },
      custom_dish: { text: "Danie własne", className: "custom-dish" },
      unknown: { text: "AI Parser", className: "unknown" },
    };
    return statusMap[product?.dataSourceType] || null;
  }

  function appendProductSourceBadge(item, product) {
    const source = getProductSourceBadgeInfo(product);
    if (!source) return;
    const badge = document.createElement("span");
    badge.className = `ingredient-source-badge ${source.className}`;
    badge.textContent = source.text;
    badge.title = product?.matchedName ? `Dopasowano: ${product.matchedName}` : source.text;
    item.append(" ", badge);
  }

  function getDishIngredientQualityText(source) {
    const type = source?.type || "";
    if (type === "custom_dish_food_database") return "Źródła składników: baza";
    if (type === "custom_dish_food_database_proxy") return "Źródła składników: baza/proxy";
    if (type === "custom_dish_mixed_food_database_ai_fallback") return "Źródła składników: baza + brak";
    if (type === "custom_dish_missing") return "Źródła składników: braki w bazie";
    if (type === "custom_dish_lookup_error") return "Źródła składników: błąd bazy";
    return "";
  }

  function getDishDataSourceInfo(dish) {
    const source = dish?.dataSource || dish?.source;
    if (!source || typeof source !== "object") {
      return { label: "Jakość danych: źródło składników nieznane", className: "unknown" };
    }
    const type = source.type || "unknown";
    if (type === "custom_dish_food_database") return { ...source, label: "Jakość danych: baza", className: "database" };
    if (type === "custom_dish_food_database_proxy") return { ...source, label: "Jakość danych: baza/proxy", className: "proxy" };
    if (type === "custom_dish_mixed_food_database_ai_fallback") return { ...source, label: "Jakość danych: baza + brak", className: "mixed" };
    if (type === "custom_dish_missing") return { ...source, label: "Jakość danych: braki w bazie", className: "missing" };
    if (type === "custom_dish_lookup_error") return { ...source, label: "Jakość danych: błąd bazy", className: "error" };
    return { ...source, label: source.label || "Jakość danych: AI Parser", className: "unknown" };
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

  function renderHomeProgress() {
    const homeLabels = { wegle_netto: "Węgle", omega3_epa_dha: "Omega-3" };
    const group = getGoalGroups().find(({ days }) => days === homeProgressDays);
    if (!group) return;
    const periodEntries = getEntriesForDays(homeProgressDays);
    elements.homeProgressList.replaceChildren();
    group.goals.forEach((target) => {
      const value = sumNutrient(periodEntries, target.key);
      const primaryTarget = target.type === "range" ? target.min : target.value;
      const exceeded = getStatus(value, target).className === "exceeded";
      const percent = primaryTarget > 0 ? Math.min(100, (value / primaryTarget) * 100) : 0;
      const row = document.createElement("div");
      row.className = `home-progress-row${exceeded ? " exceeded" : ""}`;
      const top = document.createElement("div");
      top.className = "home-progress-top";
      const name = document.createElement("strong");
      name.textContent = homeLabels[target.key] || LABELS[target.key];
      const amount = document.createElement("span");
      amount.textContent = `${formatNumber(value)} ${target.unit} / ${getTargetText(target)}`;
      top.append(name, amount);
      const track = document.createElement("div");
      track.className = "home-progress-track";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", LABELS[target.key]);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(primaryTarget));
      track.setAttribute("aria-valuenow", String(value));
      const fill = document.createElement("span");
      fill.style.width = `${percent}%`;
      track.append(fill);
      row.append(top, track);
      elements.homeProgressList.append(row);
    });
    elements.homePeriodButtons.forEach((button) => {
      const active = Number(button.dataset.homeDays) === homeProgressDays;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
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

  function getDataDaysCount() {
    return new Set(entries.map((entry) => entry.date)).size;
  }

  function getWorthContext(key, days, exceeded) {
    if (key === "wegle_netto") {
      return exceeded ? "Dziś przyda się spokojniejszy wybór pod węgle." : "Węgle są blisko dzisiejszego limitu.";
    }
    if (days === 1) return "Dobry priorytet na dziś.";
    if (days === 3) return "Dobrze uzupełnić po ostatnich dniach.";
    if (days === 7) return "Warto uwzględnić w tym tygodniu.";
    return "Warto częściej uwzględniać w najbliższych tygodniach.";
  }

  function renderWorthEmptyState(titleText, bodyText) {
    const item = document.createElement("section");
    item.className = "worth-empty";
    const icon = document.createElement("span");
    icon.className = "worth-empty-icon";
    icon.textContent = "V";
    const title = document.createElement("strong");
    title.textContent = titleText;
    const body = document.createElement("p");
    body.textContent = bodyText;
    item.append(icon, title, body);
    elements.alertsList.append(item);
  }

  function renderWorthCard(suggestion) {
    const card = document.createElement("article");
    card.className = "worth-card";
    const header = document.createElement("header");
    const title = document.createElement("h2");
    title.textContent = suggestion.label;
    const context = document.createElement("p");
    context.textContent = suggestion.context;
    header.append(title, context);

    const products = document.createElement("div");
    products.className = "worth-products";
    suggestion.products.forEach((product) => {
      const tile = document.createElement("div");
      tile.className = "worth-product";
      tile.dataset.imageKey = product.imageKey;
      const image = document.createElement("span");
      image.className = "worth-product-image";
      image.textContent = product.name.slice(0, 1).toLocaleUpperCase("pl");
      const name = document.createElement("strong");
      name.textContent = product.name;
      tile.append(image, name);
      products.append(tile);
    });
    card.append(header, products);
    elements.alertsList.append(card);
  }

  function addWorthNote(text) {
    const note = document.createElement("p");
    note.className = "worth-note";
    note.textContent = text;
    elements.worthNotes.append(note);
  }

  function calculateWorthSuggestions() {
    const priorities = {
      sod: 1, potas: 1, magnez: 1, bialko: 2, kalorie: 2, wegle_netto: 2,
      omega3_epa_dha: 3, blonnik: 3, tluszcz: 3,
    };
    const order = [
      "potas", "magnez", "sod", "bialko", "kalorie", "wegle_netto", "omega3_epa_dha", "blonnik",
      "witamina_d3", "witamina_a", "witamina_e", "witamina_k2", "zelazo", "cynk", "selen", "jod",
      "tluste_ryby", "podroby", "kiszonki", "warzywa_krzyzowe", "zielone_warzywa", "orzechy_pestki", "jaja",
      "owoce_morza_ryby_morskie",
    ];
    const dataDays = getDataDaysCount();
    if (dataDays === 0) return [];
    const needs = new Map();
    const activeGroups = dataDays === 1 ? getGoalGroups().filter(({ days }) => days === 1) : getGoalGroups();

    const addNeed = (target, group, exceeded = false) => {
      const existing = needs.get(target.key);
      const basePriority = priorities[target.key] || (group.days === 7 ? 4 : 5);
      const priority = group.days === 30 && dataDays < 7 ? basePriority + 2 : basePriority;
      const context = getWorthContext(target.key, group.days, exceeded);
      if (!existing || priority < existing.priority) {
        needs.set(target.key, { key: target.key, priority, context, periods: [group.days], exceeded });
      } else {
        existing.periods.push(group.days);
        existing.exceeded ||= exceeded;
      }
    };

    activeGroups.forEach((group) => {
      const periodEntries = getEntriesForDays(group.days);
      group.goals.forEach((target) => {
        if (target.type === "count") return;
        const value = target.isTag ? countTag(periodEntries, target.key) : sumNutrient(periodEntries, target.key);
        if (target.type === "max") {
          if (value >= target.value * 0.85) addNeed(target, group, value > target.value);
          return;
        }
        const minimum = target.type === "range" ? target.min : target.value;
        if (value < minimum) addNeed(target, group);
      });
    });

    const activeKeys = new Set(needs.keys());
    const activeTags = new Set([...needs.values()].filter((need) => order.indexOf(need.key) >= order.indexOf("tluste_ryby")).map((need) => need.key));
    return [...needs.values()].map((need) => {
      const products = FOOD_SUGGESTIONS
        .filter((product) => product.supports.includes(need.key) || product.tags.includes(need.key))
        .map((product) => ({
          ...product,
          score: product.supports.filter((key) => activeKeys.has(key)).length
            + product.tags.filter((tag) => activeTags.has(tag)).length,
        }))
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "pl"))
        .slice(0, 3);
      return { ...need, label: LABELS[need.key], products, bestProductScore: products[0]?.score || 0 };
    }).filter((suggestion) => suggestion.products.length > 0)
      .sort((a, b) => a.priority - b.priority || b.bestProductScore - a.bestProductScore || order.indexOf(a.key) - order.indexOf(b.key));
  }

  function renderAlerts() {
    const dataDays = getDataDaysCount();
    const suggestions = calculateWorthSuggestions();
    elements.alertsList.replaceChildren();
    elements.worthNotes.replaceChildren();

    if (dataDays === 0) {
      elements.eatingWindowMessage.textContent = "Po kilku wpisach zobaczysz tutaj, co warto uzupełnić.";
      renderWorthEmptyState(
        "Dodaj pierwszy wpis, a VitaTrack zacznie uczyć się Twojego rytmu odżywiania.",
        "Po kilku wpisach zobaczysz tutaj, co warto uzupełnić.",
      );
      elements.toggleAlertsButton.hidden = true;
      return;
    }

    elements.eatingWindowMessage.textContent = dataDays === 1
      ? "Masz już pierwszy dzień danych. Dodaj jeszcze 1–2 dni, żeby podpowiedzi były trafniejsze."
      : "Trzy praktyczne pomysły wybrane na podstawie Twoich ostatnich wpisów.";

    if (suggestions.length === 0) {
      renderWorthEmptyState("Twój rytm wygląda dobrze.", "Dziś możesz kierować się apetytem i swoim planem.");
    } else {
      (alertsExpanded ? suggestions : suggestions.slice(0, 3)).forEach(renderWorthCard);
    }

    if (dataDays >= 2 && dataDays < 4) {
      addWorthNote("Tygodniowe sugestie będą trafniejsze po kilku dniach używania.");
    }
    if (dataDays >= 2 && dataDays < 7) {
      addWorthNote("Szersze nawyki żywieniowe ocenimy dokładniej po dłuższym używaniu aplikacji.");
    }

    elements.toggleAlertsButton.hidden = suggestions.length <= 3;
    elements.toggleAlertsButton.textContent = alertsExpanded ? "Pokaż mniej" : "Pokaż więcej";
  }

  function renderSettings() {
    elements.settingsFields.replaceChildren();
    SETTINGS_GROUPS.forEach((group, groupIndex) => {
      const section = document.createElement("details");
      section.className = "accordion settings-group";
      section.open = groupIndex === 0;
      const summary = document.createElement("summary");
      const title = document.createElement("strong");
      title.textContent = group.title;
      const hint = document.createElement("span");
      hint.textContent = "Rozwiń";
      summary.append(title, hint);
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
      section.append(summary, grid);
      elements.settingsFields.append(section);
    });
  }

  function readSettingsForm() {
    const result = { ...settings };
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
    if (elements.themeButtons) updateThemeButtons();
  }

  function renderSummaries() {
    elements.summarySections.replaceChildren();

    getGoalGroups().forEach((group, groupIndex) => {
      const periodEntries = getEntriesForDays(group.days);
      const section = document.createElement("details");
      section.className = "accordion summary-group";
      section.open = groupIndex === 0;

      const header = document.createElement("summary");
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
        const sourceInfo = getEntryDataSource(entry);
        const sourceBadges = document.createElement("div");
        sourceBadges.className = "source-badge-group";
        if (sourceInfo.type === "mixed_food_database_ai_fallback") {
          [
            ["source-badge proxy", "Baza/proxy"],
            ["source-badge missing", "Brak: 1+"],
          ].forEach(([className, text]) => {
            const badge = document.createElement("span");
            badge.className = className;
            badge.textContent = text;
            sourceBadges.append(badge);
          });
        } else {
          const sourceBadge = document.createElement("span");
          sourceBadge.className = `source-badge ${sourceInfo.className}`;
          sourceBadge.textContent = sourceInfo.badgeText;
          sourceBadges.append(sourceBadge);
        }
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
        top.append(date, sourceBadges, actions);

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

        const details = document.createElement("details");
        details.className = "entry-details";
        const detailsSummary = document.createElement("summary");
        detailsSummary.textContent = "Szczegóły wpisu";
        details.append(detailsSummary);
        if (sourceInfo.label) {
          const source = document.createElement("p");
          source.className = "entry-source";
          source.textContent = sourceInfo.label;
          details.append(source);
        }
        const products = Array.isArray(entry.products) ? entry.products : [];
        if (products.length) {
          const productsSection = document.createElement("section");
          productsSection.className = "entry-products";
          const productsTitle = document.createElement("h3");
          productsTitle.textContent = "Produkty";
          const productsList = document.createElement("ul");
          products.forEach((product) => {
            const item = document.createElement("li");
            item.append(`${product.name} — ${formatNumber(product.amountG)} g`);
            appendProductSourceBadge(item, product);
            productsList.append(item);
          });
          productsSection.append(productsTitle, productsList);
          details.append(productsSection);
        }
        const raw = document.createElement("pre");
        raw.textContent = entry.rawText;
        details.append(raw);
        article.append(details);

        elements.entriesList.append(article);
      });
  }

  function getMissingFoodProducts(entry) {
    const products = Array.isArray(entry.products) ? entry.products : [];
    if (products.length) {
      return products.map((product) => ({
        name: String(product.name || "").trim() || entry.rawText || "Nieznany produkt",
        amountG: Number.isFinite(Number(product.amountG)) ? Number(product.amountG) : null,
        lookupStatus: product.lookupStatus || null,
        dataSourceType: product.dataSourceType || null,
        matchedName: product.matchedName || null,
        fdcId: product.fdcId ?? null,
        matchType: product.matchType || null,
        requiresConfirmation: product.requiresConfirmation === true,
      }));
    }
    const sourceInfo = getEntryDataSource(entry);
    return [{
      name: String(sourceInfo.originalText || entry.rawText || "Nieznany produkt").trim(),
      amountG: null,
      lookupStatus: null,
      dataSourceType: sourceInfo.type || null,
      matchedName: null,
      fdcId: null,
      matchType: null,
      requiresConfirmation: false,
    }];
  }

  function getDishReviewDate(dish) {
    const value = String(dish.updatedAt || dish.createdAt || "").slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : localDateString();
  }

  function getDishMissingFoodProducts(dish) {
    const products = Array.isArray(dish.products) ? dish.products : [];
    return products
      .map((product) => ({
        name: String(product.name || "").trim() || "Nieznany składnik",
        amountG: Number.isFinite(Number(product.amountG)) ? Number(product.amountG) : null,
        lookupStatus: product.lookupStatus || null,
        dataSourceType: product.dataSourceType || null,
        matchedName: product.matchedName || null,
        fdcId: product.fdcId ?? null,
        matchType: product.matchType || null,
        requiresConfirmation: product.requiresConfirmation === true,
        query: product.query || product.name || null,
        originalName: product.originalName || product.name || null,
      }))
      .filter((product) => product.lookupStatus === "not_found" || product.dataSourceType === "ai_fallback_missing");
  }

  function getMissingFoodKey(product, entry = {}) {
    const name = String(product.name || product.query || product.originalName || entry.rawText || "Nieznany produkt").trim();
    const amount = product.amountG === null || product.amountG === undefined ? "" : String(product.amountG);
    const source = String(product.originalName || product.query || name).trim();
    const entryKey = String(entry.id || entry.createdAt || `${entry.date || ""}|${entry.rawText || ""}`).trim();
    return `${normalizeText(entryKey)}|${normalizeText(name)}|${amount}|${normalizeText(source)}`;
  }

  function readHiddenMissingFoodKeys() {
    try {
      const stored = JSON.parse(localStorage.getItem(HIDDEN_MISSING_FOODS_KEY) || "[]");
      return new Set(Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : []);
    } catch {
      return new Set();
    }
  }

  function writeHiddenMissingFoodKeys(keys) {
    try {
      localStorage.setItem(HIDDEN_MISSING_FOODS_KEY, JSON.stringify([...keys]));
    } catch (error) {
      console.warn("Could not save hidden missing foods", error);
    }
  }

  function collectMissingFoods(sourceEntries = entries, options = {}) {
    const includeHidden = options.includeHidden === true;
    const sourceDishes = Array.isArray(options.customDishes) ? options.customDishes : customDishes;
    const hiddenKeys = readHiddenMissingFoodKeys();
    const rows = new Map();
    sourceEntries.forEach((entry) => {
      const sourceInfo = getEntryDataSource(entry);
      const products = getMissingFoodProducts(entry);
      const hasProductLookupMetadata = products.some((product) => product.lookupStatus !== null || product.dataSourceType !== null);
      const missingProducts = products.filter((product) => product.lookupStatus === "not_found"
        || product.dataSourceType === "ai_fallback_missing");
      const productsForReview = missingProducts.length
        ? missingProducts
        : (!hasProductLookupMetadata && sourceInfo.type === "ai_fallback_missing" ? products : []);
      if (!productsForReview.length) return;

      productsForReview.forEach((product) => {
        const name = product.name || "Nieznany produkt";
        const amountG = product.amountG;
        const key = getMissingFoodKey(product, entry);
        if (!includeHidden && hiddenKeys.has(key)) return;
        const row = rows.get(key) || {
          key,
          name,
          amountG,
          occurrences: 0,
          lastUsedDate: entry.date,
          latestOriginalText: entry.rawText,
          entryIds: [],
          latestEntryId: entry.id || null,
          lookupStatus: product.lookupStatus || "not_found",
          dataSourceType: product.dataSourceType || "ai_fallback_missing",
          hidden: hiddenKeys.has(key),
        };

        row.occurrences += 1;
        row.entryIds.push(entry.id);
        if (!row.lastUsedDate || entry.date >= row.lastUsedDate) {
          row.lastUsedDate = entry.date;
          row.latestOriginalText = entry.rawText;
          row.latestEntryId = entry.id || null;
        }
        rows.set(key, row);
      });
    });

    sourceDishes.forEach((dish) => {
      const productsForReview = getDishMissingFoodProducts(dish);
      if (!productsForReview.length) return;
      const pseudoEntry = {
        id: `dish:${dish.id}`,
        createdAt: dish.createdAt || dish.updatedAt || "",
        date: getDishReviewDate(dish),
        rawText: `Moje danie: ${dish.name}`,
      };
      productsForReview.forEach((product) => {
        const name = product.name || "Nieznany składnik";
        const amountG = product.amountG;
        const key = getMissingFoodKey(product, pseudoEntry);
        if (!includeHidden && hiddenKeys.has(key)) return;
        const row = rows.get(key) || {
          key,
          name,
          amountG,
          occurrences: 0,
          lastUsedDate: pseudoEntry.date,
          latestOriginalText: `Moje danie: ${dish.name}`,
          sourceLabel: "Moje danie",
          dishName: dish.name,
          entryIds: [],
          dishIds: [],
          latestEntryId: null,
          latestDishId: dish.id || null,
          lookupStatus: product.lookupStatus || "not_found",
          dataSourceType: product.dataSourceType || "ai_fallback_missing",
          hidden: hiddenKeys.has(key),
          note: "Wartości dania dotyczą całości przepisu, nie tego pojedynczego brakującego składnika.",
        };

        row.occurrences += 1;
        row.dishIds.push(dish.id);
        if (!row.lastUsedDate || pseudoEntry.date >= row.lastUsedDate) {
          row.lastUsedDate = pseudoEntry.date;
          row.latestOriginalText = `Moje danie: ${dish.name}`;
          row.latestDishId = dish.id || null;
          row.dishName = dish.name;
        }
        rows.set(key, row);
      });
    });

    return [...rows.values()].sort((a, b) => b.lastUsedDate.localeCompare(a.lastUsedDate) || a.name.localeCompare(b.name, "pl"));
  }

  function renderMissingFoods() {
    if (!elements.missingFoodsList || !elements.missingFoodsSummary) return;
    const rows = collectMissingFoods();
    const hiddenCount = collectMissingFoods(entries, { includeHidden: true }).filter((row) => row.hidden).length;
    elements.missingFoodsList.replaceChildren();
    elements.missingFoodsSummary.textContent = rows.length
      ? `${rows.length} aktywnych braków w bazie${hiddenCount ? `, ukryte: ${hiddenCount}` : ""}.`
      : hiddenCount ? `Brak aktywnych braków. Ukryte: ${hiddenCount}.` : "Brak produktów oznaczonych jako brakujące w bazie.";

    if (!rows.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state missing-foods-empty";
      const title = document.createElement("strong");
      title.textContent = "Nie ma jeszcze braków w bazie.";
      const text = document.createElement("span");
      text.textContent = "Gdy food-lookup zwróci not_found i aplikacja użyje fallbacku AI, wpis pojawi się tutaj.";
      empty.append(title, text);
      elements.missingFoodsList.append(empty);
      return;
    }

    rows.forEach((row) => {
      const item = document.createElement("article");
      item.className = "missing-food-item";

      const header = document.createElement("header");
      const title = document.createElement("h2");
      title.textContent = row.name;
      const count = document.createElement("span");
      count.className = "missing-food-count";
      count.textContent = `${row.occurrences}x`;
      header.append(title, count);

      const meta = document.createElement("p");
      meta.className = "missing-food-meta";
      meta.textContent = [
        row.amountG === null ? "gramatura: brak" : `gramatura: ${formatNumber(row.amountG)} g`,
        row.sourceLabel ? `źródło: ${row.sourceLabel}` : null,
        row.dishName ? `danie: ${row.dishName}` : null,
        `ostatnio: ${formatDate(row.lastUsedDate)}`,
      ].filter(Boolean).join(" · ");

      const source = document.createElement("p");
      source.className = "missing-food-source";
      source.textContent = row.latestOriginalText || row.name;

      const note = document.createElement("p");
      note.className = "missing-food-note";
      note.textContent = row.note || "Wartości AI dotyczą całego wpisu, nie pojedynczego brakującego składnika.";

      const actions = document.createElement("div");
      actions.className = "missing-food-actions";
      const dismiss = document.createElement("button");
      dismiss.className = "button secondary";
      dismiss.type = "button";
      dismiss.textContent = "Oznacz jako obsłużone";
      dismiss.dataset.dismissMissingFood = row.key;
      const remove = document.createElement("button");
      remove.className = "button secondary";
      remove.type = "button";
      remove.textContent = "Usuń z listy";
      // Obie akcje tylko ukrywają brak lokalnie; historia i IndexedDB zostają bez zmian.
      remove.dataset.dismissMissingFood = row.key;
      actions.append(dismiss, remove);
      if (row.latestEntryId) {
        const deleteEntry = document.createElement("button");
        deleteEntry.className = "button danger";
        deleteEntry.type = "button";
        deleteEntry.textContent = "Usuń wpis z historii";
        deleteEntry.dataset.deleteMissingEntryId = row.latestEntryId;
        actions.append(deleteEntry);
      }

      item.append(header, meta, source, note, actions);
      elements.missingFoodsList.append(item);
    });
  }

  function renderCustomDishes() {
    elements.dishesList.replaceChildren();
    if (customDishes.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state dish-empty";
      const title = document.createElement("strong");
      title.textContent = "Nie masz jeszcze zapisanych dań.";
      const text = document.createElement("span");
      text.textContent = "Wklej na ekranie głównym wynik z Gema od dań wieloskładnikowych, a pojawi się tutaj.";
      empty.append(title, text);
      elements.dishesList.append(empty);
      return;
    }

    customDishes.slice().sort((a, b) => a.name.localeCompare(b.name, "pl")).forEach((dish) => {
      const card = document.createElement("article");
      card.className = "dish-card";
      const header = document.createElement("header");
      const title = document.createElement("h2");
      title.textContent = dish.name;
      const mass = document.createElement("span");
      mass.textContent = `${formatNumber(dish.totalMassG)} g całość`;
      header.append(title, mass);
      const macro = document.createElement("p");
      macro.className = "dish-macro";
      macro.textContent = `${formatNumber(dish.per100gData?.kalorie)} kcal · ${formatNumber(dish.per100gData?.bialko)} g białka / 100 g`;
      card.append(header, macro);

      const dishSource = getDishDataSourceInfo(dish);
      const source = document.createElement("p");
      source.className = `dish-source ${dishSource.className}`;
      source.textContent = dishSource.label;
      card.append(source);

      if (dish.tags?.length) {
        const tags = document.createElement("div");
        tags.className = "tag-list";
        dish.tags.forEach((tag) => {
          const chip = document.createElement("span");
          chip.className = "tag";
          chip.textContent = LABELS[tag] || tag;
          tags.append(chip);
        });
        card.append(tags);
      }

      const products = Array.isArray(dish.products) ? dish.products : [];
      if (products.length) {
        const productsSection = document.createElement("section");
        productsSection.className = "dish-products";
        const productsTitle = document.createElement("h3");
        productsTitle.textContent = "Składniki";
        const productsList = document.createElement("ul");
        products.forEach((product) => {
          const item = document.createElement("li");
          item.append(`${product.name} — ${formatNumber(product.amountG)} g`);
          appendProductSourceBadge(item, product);
          productsList.append(item);
        });
        productsSection.append(productsTitle, productsList);
        card.append(productsSection);
      }

      const portion = document.createElement("div");
      portion.className = "dish-portion";
      const input = document.createElement("input");
      input.type = "number";
      input.inputMode = "decimal";
      input.min = "1";
      input.step = "1";
      input.placeholder = "Porcja w gramach";
      input.setAttribute("aria-label", `Porcja dania ${dish.name} w gramach`);
      input.dataset.dishPortionId = dish.id;
      const addButton = document.createElement("button");
      addButton.className = "button primary";
      addButton.type = "button";
      addButton.textContent = "Dodaj";
      addButton.dataset.addDishId = dish.id;
      portion.append(input, addButton);

      const actions = document.createElement("div");
      actions.className = "dish-actions";
      const edit = document.createElement("button");
      edit.className = "button secondary";
      edit.type = "button";
      edit.textContent = "Edytuj";
      edit.dataset.editDishId = dish.id;
      const remove = document.createElement("button");
      remove.className = "button dish-delete";
      remove.type = "button";
      remove.textContent = "Usuń";
      remove.dataset.deleteDishId = dish.id;
      actions.append(edit, remove);
      card.append(portion, actions);
      elements.dishesList.append(card);
    });
  }

  function renderAll() {
    renderHomeProgress();
    renderSummaries();
    renderAlerts();
    renderEntries();
    renderMissingFoods();
    renderCustomDishes();
  }

  function setMessage(element, text, type = "") {
    element.textContent = text;
    element.className = `message ${type}`.trim();
  }

  function switchView(viewName) {
    const target = document.querySelector(`[data-view="${viewName}"]`);
    if (!target) return;
    currentView = viewName;
    document.body.dataset.currentView = viewName;
    document.querySelectorAll(".app-view").forEach((view) => view.classList.toggle("active", view === target));
    document.querySelectorAll("[data-view-target]").forEach((button) => {
      button.classList.toggle("active", button.dataset.viewTarget === viewName);
    });
    closeMenu();
    requestAnimationFrame(resizeComposer);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openMenu() {
    elements.appMenu.classList.add("open");
    elements.appMenu.setAttribute("aria-hidden", "false");
    elements.menuBackdrop.hidden = false;
    elements.menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    elements.appMenu.classList.remove("open");
    elements.appMenu.setAttribute("aria-hidden", "true");
    elements.menuBackdrop.hidden = true;
    elements.menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  function toggleDebugPanel() {
    const willOpen = elements.appDebugPanel.hidden;
    elements.appDebugPanel.hidden = !willOpen;
    elements.debugToggleButton.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) renderDebugPanel();
  }

  function resizeComposer() {
    elements.rawInput.style.height = "auto";
    elements.rawInput.style.height = `${Math.min(elements.rawInput.scrollHeight, window.innerHeight * 0.4)}px`;
    elements.clearButton.hidden = !elements.rawInput.value;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--composer-space", `${elements.composerShell.offsetHeight + 24}px`);
    });
  }

  function resizeDishComposer() {
    elements.dishAiInput.style.height = "auto";
    elements.dishAiInput.style.height = `${Math.min(elements.dishAiInput.scrollHeight, window.innerHeight * 0.32)}px`;
    elements.dishAiClearButton.hidden = !elements.dishAiInput.value;
  }

  function updateDatePickerLabel() {
    const date = elements.entryDate.value || localDateString();
    const label = `Data wpisu: ${formatDate(date)}`;
    elements.datePickerButton.setAttribute("aria-label", label);
    elements.datePickerButton.title = label;
    elements.datePickerButton.classList.toggle("selected", date !== localDateString());
  }

  function openDatePicker() {
    if (typeof elements.entryDate.showPicker === "function") {
      elements.entryDate.showPicker();
    } else {
      elements.entryDate.click();
    }
  }

  function focusComposer() {
    switchView("start");
    elements.rawInput.focus();
  }

  function updateThemeButtons() {
    elements.themeButtons.forEach((button) => {
      const active = button.dataset.themeChoice === settings.theme;
      button.classList.toggle("active", active);
      button.setAttribute("aria-checked", String(active));
    });
  }

  async function installApp() {
    if (!deferredInstallPrompt) return;
    try {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
    } finally {
      deferredInstallPrompt = null;
      elements.installButton.hidden = true;
      elements.appearanceInstallButton.hidden = true;
    }
  }

  function showPwaMessage(text) {
    elements.pwaMessage.textContent = text;
    elements.pwaMessage.hidden = false;
    window.setTimeout(() => {
      elements.pwaMessage.hidden = true;
    }, 3500);
  }

  async function refreshEntries() {
    [entries, customDishes] = await Promise.all([
      window.ketoDb.getAllEntries(),
      window.ketoDb.getAllCustomDishes(),
    ]);
    renderAll();
  }

  async function saveCustomDishFromText(rawText) {
    const parsedDish = parseCustomDish(rawText);
    if (!parsedDish) {
      setMessage(elements.formMessage, "Nie udało się rozpoznać dania wieloskładnikowego. Sprawdź format.", "error");
      return;
    }
    const existingDish = customDishes.find((dish) => dish.id === parsedDish.id);
    if (existingDish && !window.confirm("Danie o takim ID już istnieje. Nadpisać?")) return;
    const now = new Date().toISOString();
    const dish = {
      ...parsedDish,
      initialMassG: parsedDish.totalMassG,
      remainingMassG: Number.isFinite(Number(existingDish?.remainingMassG)) ? Number(existingDish.remainingMassG) : parsedDish.totalMassG,
      usedMassG: Number.isFinite(Number(existingDish?.usedMassG)) ? Number(existingDish.usedMassG) : 0,
      createdAt: existingDish?.createdAt || now,
      updatedAt: now,
    };
    try {
      await window.ketoDb.saveCustomDish(dish);
      cancelEditEntry(false);
      setMessage(elements.formMessage, "Danie zapisane w Moje dania.", "success");
      await refreshEntries();
    } catch (error) {
      console.error(error);
      setMessage(elements.formMessage, "Nie udało się zapisać dania.", "error");
    }
  }

  function normalizeAiNutrients(value) {
    if (!value || typeof value !== "object") return null;
    const data = {};
    for (const key of NUTRIENT_KEYS) {
      const nutrient = Number(value[key]);
      if (!Number.isFinite(nutrient) || nutrient < 0) return null;
      data[key] = nutrient;
    }
    return data;
  }

  function normalizeAiProducts(value) {
    if (!Array.isArray(value)) return [];
    return value
      .map((product) => {
        const source = product && typeof product === "object" ? product : {};
        return {
          ...source,
          name: String(source.name || source.nazwa || "").trim(),
          amountG: Number(source.amountG ?? source.ilosc_g ?? source.gramy),
        };
      })
      .filter((product) => product.name && product.amountG > 0);
  }

  function normalizeAiTags(value, products = []) {
    const allowedTags = [...TAGS, ...AUXILIARY_TAGS];
    const aiTags = Array.isArray(value) ? value.filter((tag) => allowedTags.includes(tag)) : [];
    const productTags = detectTags(products.map((product) => product.name).join(" "));
    return [...new Set([...aiTags, ...productTags])];
  }

  function setAiParsing(loading) {
    isAiParsing = loading;
    elements.aiParseButton.disabled = loading;
    elements.saveButton.disabled = loading;
    elements.clearButton.disabled = loading;
    elements.aiParseButton.classList.toggle("loading", loading);
    elements.aiParseButton.title = loading ? "Trwa liczenie posiłku" : "Policz posiłek przez AI";
    elements.aiParseButton.setAttribute("aria-label", loading ? "Trwa liczenie posiłku" : "Policz posiłek przez AI");
  }

  function setDishAiParsing(loading) {
    isDishAiParsing = loading;
    elements.dishAiCreateButton.disabled = loading;
    elements.dishAiClearButton.disabled = loading;
    elements.dishAiCreateButton.classList.toggle("loading", loading);
    elements.dishAiCreateButton.title = loading ? "Trwa tworzenie dania" : "Utwórz danie przez AI";
    elements.dishAiCreateButton.setAttribute("aria-label", loading ? "Trwa tworzenie dania" : "Utwórz danie przez AI");
  }

  function shortDebugMessage(value, maxLength = 90) {
    const text = String(value || "-").replace(/\s+/g, " ").trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
  }

  function readDebugTotalCost() {
    try {
      const value = Number(localStorage.getItem(AI_DEBUG_TOTAL_COST_KEY));
      return Number.isFinite(value) && value >= 0 ? value : 0;
    } catch {
      return 0;
    }
  }

  function saveDebugTotalCost(value) {
    try {
      localStorage.setItem(AI_DEBUG_TOTAL_COST_KEY, String(value));
    } catch (error) {
      console.warn("[AI Parser] Could not save local debug cost total", error);
    }
  }

  function formatDebugCost(value) {
    return Number.isFinite(value) ? `~$${value.toFixed(6)} USD` : "brak danych usage";
  }

  function applyBackendDebug(debug) {
    const usage = debug?.usage;
    const estimatedCost = Number(debug?.estimated_cost_usd);
    const hasCost = debug?.estimated_cost_usd !== null
      && debug?.estimated_cost_usd !== undefined
      && Number.isFinite(estimatedCost)
      && estimatedCost >= 0;
    if (hasCost) {
      aiDebugState.totalCost += estimatedCost;
      saveDebugTotalCost(aiDebugState.totalCost);
    }
    updateAiDebug({
      model: typeof debug?.model === "string" ? debug.model : "-",
      inputTokens: Number.isFinite(Number(usage?.input_tokens)) ? String(usage.input_tokens) : "brak danych usage",
      outputTokens: Number.isFinite(Number(usage?.output_tokens)) ? String(usage.output_tokens) : "brak danych usage",
      totalTokens: Number.isFinite(Number(usage?.total_tokens)) ? String(usage.total_tokens) : "brak danych usage",
      lastCost: hasCost
        ? (typeof debug?.estimated_cost_label === "string" ? debug.estimated_cost_label : formatDebugCost(estimatedCost))
        : "brak danych usage",
    });
  }

  function resetDebugCostTotal() {
    aiDebugState.totalCost = 0;
    saveDebugTotalCost(0);
    renderDebugPanel();
  }

  function renderDebugPanel() {
    if (!elements.debugAppVersion) return;
    const config = window.VITATRACK_CONFIG || {};
    const functionUrl = String(config.aiParserFunctionUrl || "").trim();
    const publishableKey = String(config.supabasePublishableKey || "").trim();
    const keyStatus = publishableKey ? `OK ${publishableKey.slice(0, 8)}…` : "BRAK";

    elements.debugAppVersion.textContent = config.appVersion || "unknown";
    elements.debugCacheVersion.textContent = config.appVersion || "unknown";
    elements.debugLastChange.textContent = config.appLastChange || "-";
    elements.debugSupabaseUrl.textContent = config.supabaseUrl || "BRAK";
    elements.debugSupabaseUrl.title = config.supabaseUrl || "";
    elements.debugAiUrl.textContent = functionUrl || "BRAK";
    elements.debugAiUrl.title = functionUrl;
    elements.debugFoodLookupUrl.textContent = config.foodLookupFunctionUrl || "BRAK";
    elements.debugFoodLookupUrl.title = config.foodLookupFunctionUrl || "";
    elements.debugAiKey.textContent = keyStatus;
    elements.debugAiRequest.textContent = aiDebugState.request;
    elements.debugAiFetchStarted.textContent = aiDebugState.fetchStarted;
    elements.debugAiHttp.textContent = aiDebugState.http;
    elements.debugFoodLookupStatus.textContent = aiDebugState.foodLookupStatus;
    elements.debugAiErrorType.textContent = aiDebugState.errorType;
    elements.debugAiErrorMessage.textContent = aiDebugState.errorMessage;
    elements.debugAiDuration.textContent = aiDebugState.duration;
    elements.debugAiParsedKeys.textContent = aiDebugState.parsedKeys;
    elements.debugAiRawResponse.textContent = aiDebugState.rawResponse;
    elements.debugAiModel.textContent = aiDebugState.model;
    elements.debugAiInputTokens.textContent = aiDebugState.inputTokens;
    elements.debugAiOutputTokens.textContent = aiDebugState.outputTokens;
    elements.debugAiTotalTokens.textContent = aiDebugState.totalTokens;
    elements.debugAiLastCost.textContent = aiDebugState.lastCost;
    elements.debugAiTotalCost.textContent = formatDebugCost(aiDebugState.totalCost);
    elements.debugSupabaseUrl.dataset.state = config.supabaseUrl ? "success" : "error";
    elements.debugAiUrl.dataset.state = functionUrl ? "success" : "error";
    elements.debugFoodLookupUrl.dataset.state = config.foodLookupFunctionUrl ? "success" : "error";
    elements.debugAiKey.dataset.state = publishableKey ? "success" : "error";
    elements.debugAiRequest.dataset.state = ["pending", "sent"].includes(aiDebugState.request)
      ? "pending"
      : aiDebugState.request;
    elements.debugFoodLookupStatus.dataset.state = aiDebugState.foodLookupStatus === "matched"
      ? "success"
      : ["not_found", "error"].includes(aiDebugState.foodLookupStatus) ? "error" : "";
    elements.debugAiErrorType.dataset.state = aiDebugState.errorType === "-" ? "" : "error";
    elements.debugAiErrorMessage.dataset.state = aiDebugState.errorMessage === "-" ? "" : "error";
  }

  function updateAiDebug(changes) {
    Object.assign(aiDebugState, changes);
    renderDebugPanel();
  }

  function summarizeFoodLookupPayload(payload) {
    const nutrients = payload?.nutrients && typeof payload.nutrients === "object" ? payload.nutrients : null;
    const nutrientKeys = nutrients ? Object.keys(nutrients) : [];
    const nullNutrients = nutrients
      ? nutrientKeys.filter((key) => nutrients[key] === null).length
      : 0;
    return {
      status: payload?.status || "-",
      product_name: payload?.product_name || payload?.product?.product_name || payload?.product?.name || "-",
      fdc_id: payload?.fdc_id ?? payload?.product?.fdc_id ?? null,
      factor: payload?.factor ?? payload?.amount?.factor ?? null,
      nutrient_keys: nutrientKeys.length,
      null_nutrients: nullNutrients,
      missing_nutrients: Array.isArray(payload?.missing_nutrients) ? payload.missing_nutrients.length : 0,
    };
  }

  function normalizeLookupNutrients(payload) {
    const nutrients = payload?.nutrients && typeof payload.nutrients === "object" ? payload.nutrients : {};
    const factor = Number(payload?.amount?.factor);
    if (!Number.isFinite(factor) || factor < 0) return null;
    return Object.fromEntries(NUTRIENT_KEYS.map((key) => {
      const nutrient = nutrients[key];
      if (!nutrient || typeof nutrient !== "object" || nutrient.value_per_100g === null || nutrient.value_per_100g === undefined) {
        return [key, null];
      }
      const valuePer100g = Number(nutrient.value_per_100g);
      return [key, Number.isFinite(valuePer100g) && valuePer100g >= 0 ? valuePer100g * factor : null];
    }));
  }

  function sumLookupNutrients(results) {
    const normalizedResults = results.map((result) => normalizeLookupNutrients(result.payload));
    if (normalizedResults.some((nutrients) => nutrients === null)) return null;
    return Object.fromEntries(NUTRIENT_KEYS.map((key) => {
      let hasNumber = false;
      const total = normalizedResults.reduce((sum, nutrients) => {
        const value = nutrients[key];
        if (value === null) return sum;
        hasNumber = true;
        return sum + value;
      }, 0);
      return [key, hasNumber ? total : null];
    }));
  }

  function isProxyLookupResult(result) {
    return Boolean(result?.payload?.product?.is_proxy === true
      || result?.payload?.match?.match_type === "proxy"
      || result?.payload?.product?.source === "usda_proxy"
      || result?.payload?.match?.requires_confirmation === true);
  }

  function createProductLookupMetadata(product, result = null, error = null) {
    const baseProduct = {
      ...product,
      query: product.name,
      originalName: product.name,
      amountG: product.amountG,
    };
    if (error) {
      return {
        ...baseProduct,
        lookupStatus: "error",
        matchedName: null,
        fdcId: null,
        requiresConfirmation: false,
        matchType: null,
        dataSourceType: "food_lookup_error",
      };
    }
    if (!result) {
      return {
        ...baseProduct,
        lookupStatus: null,
        matchedName: null,
        fdcId: null,
        requiresConfirmation: false,
        matchType: null,
        dataSourceType: "unknown",
      };
    }
    if (result.kind === "matched") {
      const payload = result.payload || {};
      const isProxy = isProxyLookupResult(result);
      return {
        ...baseProduct,
        lookupStatus: "matched",
        matchedName: payload.product?.product_name || payload.product?.name || payload.product_name || null,
        fdcId: payload.product?.fdc_id ?? payload.fdc_id ?? null,
        requiresConfirmation: payload.match?.requires_confirmation === true,
        matchType: payload.match?.match_type || (isProxy ? "proxy" : "exact"),
        dataSourceType: isProxy ? "food_database_proxy" : "food_database",
      };
    }
    if (result.kind === "not_found") {
      return {
        ...baseProduct,
        lookupStatus: "not_found",
        matchedName: null,
        fdcId: null,
        requiresConfirmation: false,
        matchType: null,
        dataSourceType: "ai_fallback_missing",
      };
    }
    return {
      ...baseProduct,
      lookupStatus: null,
      matchedName: null,
      fdcId: null,
      requiresConfirmation: false,
      matchType: null,
      dataSourceType: "unknown",
    };
  }

  async function resolveMealWithFoodLookup(products, fallbackParsedData) {
    if (!products.length) {
      updateAiDebug({ foodLookupStatus: "brak produktów" });
      return {
        parsedData: fallbackParsedData,
        status: "brak produktów",
        source: {
          type: "unknown",
          label: "Źródło nieznane",
          foodLookupStatus: null,
          requiresConfirmation: false,
        },
        products: products.map((product) => createProductLookupMetadata(product)),
      };
    }

    const results = [];
    for (const product of products) {
      try {
        const result = await requestFoodLookup({
          query: product.name,
          amount_g: product.amountG,
          variant: null,
          fdc_id: null,
          limit: 5,
        });
        results.push({ product, result });
      } catch (error) {
        console.warn("[Food Lookup] Technical error, falling back to AI nutrients", error);
        updateAiDebug({
          foodLookupStatus: "error",
          errorType: "food_lookup",
          errorMessage: shortDebugMessage(error.message),
        });
        return {
          parsedData: fallbackParsedData,
          status: "error",
          source: {
            type: "ai_fallback_database_error",
            label: "Źródło: AI fallback — błąd techniczny bazy",
            foodLookupStatus: "error",
            requiresConfirmation: false,
            originalText: products.map((product) => `${product.name} ${product.amountG} g`).join("; "),
          },
          products: products.map((item, index) => {
            if (index < results.length) return createProductLookupMetadata(item, results[index].result);
            if (index === results.length) return createProductLookupMetadata(item, null, error);
            return createProductLookupMetadata(item);
          }),
        };
      }
    }

    if (results.every(({ result }) => result.kind === "matched")) {
      const databaseParsedData = sumLookupNutrients(results.map(({ result }) => result));
      if (!databaseParsedData || [databaseParsedData.kalorie, databaseParsedData.bialko, databaseParsedData.tluszcz, databaseParsedData.wegle_netto].every((value) => value === null)) {
        updateAiDebug({ foodLookupStatus: "error", errorType: "database_mapping_error" });
        return {
          parsedData: fallbackParsedData,
          status: "database_mapping_error",
          source: {
            type: "ai_fallback_database_mapping_error",
            label: "Źródło: AI fallback — błąd mapowania bazy",
            foodLookupStatus: "error",
            requiresConfirmation: true,
            originalText: products.map((product) => `${product.name} ${product.amountG} g`).join("; "),
          },
          products: results.map(({ product, result }) => createProductLookupMetadata(product, result)),
        };
      }
      const requiresConfirmation = results.some(({ result }) => result.payload?.match?.requires_confirmation === true);
      const usesProxy = results.some(({ result }) => isProxyLookupResult(result));
      const firstMatched = results[0]?.result.payload;
      updateAiDebug({ foodLookupStatus: "matched" });
      return {
        parsedData: databaseParsedData,
        status: "matched",
        products: results.map(({ product, result }) => createProductLookupMetadata(product, result)),
        source: usesProxy || requiresConfirmation
          ? {
            type: "food_database_proxy",
            label: "Źródło: baza proxy — wymaga potwierdzenia",
            foodLookupStatus: "matched",
            requiresConfirmation: true,
            fdcId: firstMatched?.product?.fdc_id ?? null,
            productName: firstMatched?.product?.product_name || null,
            originalText: products.map((product) => `${product.name} ${product.amountG} g`).join("; "),
          }
          : {
            type: "food_database",
            label: "Źródło: baza żywności",
            foodLookupStatus: "matched",
            requiresConfirmation: false,
            fdcId: firstMatched?.product?.fdc_id ?? null,
            productName: firstMatched?.product?.product_name || null,
            originalText: products.map((product) => `${product.name} ${product.amountG} g`).join("; "),
          },
      };
    }

    const hasMatched = results.some(({ result }) => result.kind === "matched");
    const hasNotFound = results.some(({ result }) => result.kind === "not_found");
    if (hasMatched && hasNotFound) {
      updateAiDebug({ foodLookupStatus: "mixed" });
      return {
        parsedData: fallbackParsedData,
        status: "mixed",
        products: results.map(({ product, result }) => createProductLookupMetadata(product, result)),
        source: {
          type: "mixed_food_database_ai_fallback",
          label: "Źródło: częściowo z bazy + AI fallback",
          foodLookupStatus: "mixed",
          requiresConfirmation: results.some(({ result }) => isProxyLookupResult(result)),
          originalText: products.map((product) => `${product.name} ${product.amountG} g`).join("; "),
        },
      };
    }

    updateAiDebug({ foodLookupStatus: "not_found" });
    return {
      parsedData: fallbackParsedData,
      status: "not_found",
      products: results.map(({ product, result }) => createProductLookupMetadata(product, result)),
      source: {
        type: "ai_fallback_missing",
        label: "Źródło: AI fallback — brak w bazie",
        foodLookupStatus: "not_found",
        requiresConfirmation: false,
        originalText: products.map((product) => `${product.name} ${product.amountG} g`).join("; "),
      },
    };
  }

  async function resolveDishIngredientsWithFoodLookup(products) {
    if (!products.length) {
      updateAiDebug({ foodLookupStatus: "brak składników dania" });
      return {
        products: [],
        source: {
          type: "ai_parser_dish",
          label: "Składniki: brak danych food-lookup",
          foodLookupStatus: null,
          requiresConfirmation: false,
        },
      };
    }

    const resolvedProducts = [];
    for (const product of products) {
      try {
        const result = await requestFoodLookup({
          query: product.name,
          amount_g: product.amountG,
          variant: null,
          fdc_id: null,
          limit: 5,
        });
        resolvedProducts.push(createProductLookupMetadata(product, result));
      } catch (error) {
        console.warn("[Food Lookup] Dish ingredient lookup failed", product, error);
        resolvedProducts.push(createProductLookupMetadata(product, null, error));
      }
    }

    const hasMatched = resolvedProducts.some((product) => product.lookupStatus === "matched");
    const hasMissing = resolvedProducts.some((product) => product.lookupStatus === "not_found");
    const hasError = resolvedProducts.some((product) => product.lookupStatus === "error");
    const usesProxy = resolvedProducts.some((product) => product.dataSourceType === "food_database_proxy" || product.requiresConfirmation === true);
    let source;
    if (hasError) {
      source = {
        type: "custom_dish_lookup_error",
        label: "Składniki: błąd bazy",
        foodLookupStatus: "error",
        requiresConfirmation: true,
      };
    } else if (hasMatched && hasMissing) {
      source = {
        type: "custom_dish_mixed_food_database_ai_fallback",
        label: "Składniki: baza + brak",
        foodLookupStatus: "mixed",
        requiresConfirmation: usesProxy,
      };
    } else if (hasMissing) {
      source = {
        type: "custom_dish_missing",
        label: "Składniki: braki w bazie",
        foodLookupStatus: "not_found",
        requiresConfirmation: false,
      };
    } else if (usesProxy) {
      source = {
        type: "custom_dish_food_database_proxy",
        label: "Składniki: baza/proxy",
        foodLookupStatus: "matched",
        requiresConfirmation: true,
      };
    } else {
      source = {
        type: "custom_dish_food_database",
        label: "Składniki: baza",
        foodLookupStatus: "matched",
        requiresConfirmation: false,
      };
    }
    updateAiDebug({ foodLookupStatus: source.foodLookupStatus || "-" });
    return { products: resolvedProducts, source };
  }

  async function requestFoodLookup({ query, amount_g, variant = null, fdc_id = null, limit = 5 }) {
    const config = window.VITATRACK_CONFIG || {};
    const functionUrl = String(config.foodLookupFunctionUrl || "").trim();
    if (!functionUrl) {
      throw new Error("Food lookup URL is not configured");
    }

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, amount_g, variant, fdc_id, limit }),
    });
    const responseText = await response.text();
    let payload = null;
    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch {
      throw new Error(`Food lookup returned non-JSON response: HTTP ${response.status}`);
    }

    if (response.ok && payload?.status === "matched") {
      return { kind: "matched", http: response.status, payload };
    }
    if (response.status === 404 && payload?.status === "not_found") {
      return { kind: "not_found", http: response.status, payload };
    }
    throw new Error(`Food lookup technical error: HTTP ${response.status}`);
  }

  function formatFoodLookupTestResult(testCase, result) {
    if (result.kind === "not_found") {
      return `${testCase.query} ${testCase.amount_g} g -> HTTP ${result.http}, not_found`;
    }
    const summary = summarizeFoodLookupPayload(result.payload);
    return [
      `${testCase.query} ${testCase.amount_g} g -> HTTP ${result.http}, matched`,
      `  product: ${summary.product_name}`,
      `  fdc_id: ${summary.fdc_id ?? "-"}`,
      `  factor: ${summary.factor ?? "-"}`,
      `  nutrient keys: ${summary.nutrient_keys}, null nutrients: ${summary.null_nutrients}, missing: ${summary.missing_nutrients}`,
    ].join("\n");
  }

  async function runFoodLookupSmokeTest() {
    elements.foodLookupTestButton.disabled = true;
    elements.foodLookupTestOutput.textContent = "Test food-lookup w toku...";
    const lines = [];
    try {
      for (const testCase of FOOD_LOOKUP_TEST_CASES) {
        try {
          const result = await requestFoodLookup(testCase);
          lines.push(formatFoodLookupTestResult(testCase, result));
        } catch (error) {
          lines.push(`${testCase.query} ${testCase.amount_g} g -> błąd techniczny: ${error.message}`);
        }
      }
      elements.foodLookupTestOutput.textContent = lines.join("\n\n");
    } finally {
      elements.foodLookupTestButton.disabled = false;
    }
  }

  async function requestAiParse(input, action = "parse_meal") {
    const config = window.VITATRACK_CONFIG || {};
    const functionUrl = String(config.aiParserFunctionUrl || "").trim();
    const publishableKey = String(config.supabasePublishableKey || "").trim();
    const requestStartedAt = performance.now();
    const setDuration = () => updateAiDebug({ duration: `${Math.round(performance.now() - requestStartedAt)} ms` });
    updateAiDebug({
      request: "pending",
      fetchStarted: "nie",
      http: "-",
      errorType: "-",
      errorMessage: "-",
      foodLookupStatus: "-",
      duration: "0 ms",
      parsedKeys: "-",
      rawResponse: "-",
      model: "-",
      inputTokens: "brak danych usage",
      outputTokens: "brak danych usage",
      totalTokens: "brak danych usage",
      lastCost: "brak danych usage",
    });
    console.info("[AI Parser] Preparing request", {
      url: functionUrl || "(missing)",
      action,
      inputLength: input.length,
    });
    console.info("[AI Parser] Supabase publishable key", {
      configured: Boolean(publishableKey),
      prefix: publishableKey ? `${publishableKey.slice(0, 8)}…` : "(missing)",
    });

    if (!functionUrl) {
      updateAiDebug({ request: "failed", errorType: "config", errorMessage: "Brak AI URL" });
      setDuration();
      throw new Error("AI parser URL is not configured");
    }
    if (!publishableKey) {
      const error = new Error("Brakuje publicznego klucza Supabase w config.js");
      error.code = "MISSING_SUPABASE_PUBLISHABLE_KEY";
      updateAiDebug({
        request: "failed",
        errorType: "config",
        errorMessage: shortDebugMessage(error.message),
      });
      setDuration();
      console.error("[AI Parser] Configuration error", error.message);
      throw error;
    }

    const headers = {
      "Content-Type": "application/json",
      apikey: publishableKey,
    };
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 35_000);
    let response;
    try {
      updateAiDebug({ request: "sent", fetchStarted: "tak" });
      console.info("[AI Parser] Sending POST", functionUrl);
      try {
        response = await fetch(functionUrl, {
          method: "POST",
          headers,
          signal: controller.signal,
          body: JSON.stringify({ action, input }),
        });
      } catch (error) {
        updateAiDebug({
          request: "failed",
          http: "network",
          errorType: error.name || "network",
          errorMessage: shortDebugMessage(error.message || error.name),
        });
        setDuration();
        console.error("[AI Parser] Network request failed", {
          url: functionUrl,
          name: error.name,
          message: error.message,
        });
        throw error;
      }
    } finally {
      window.clearTimeout(timeoutId);
    }

    console.info("[AI Parser] Response status", response.status);
    updateAiDebug({ http: String(response.status) });
    setDuration();
    const responseText = await response.text();
    updateAiDebug({ rawResponse: responseText ? responseText.slice(0, 500) : "(empty)" });
    let result = null;
    try {
      result = responseText ? JSON.parse(responseText) : null;
      updateAiDebug({
        parsedKeys: result && typeof result === "object" ? Object.keys(result).join(", ") : "(not an object)",
      });
    } catch (error) {
      updateAiDebug({
        errorType: error.name || "invalid-json",
        errorMessage: shortDebugMessage(error.message || "Response is not valid JSON"),
      });
      console.error("[AI Parser] Response is not valid JSON", {
        status: response.status,
        body: responseText,
        error: error.message,
      });
    }
    if (!response.ok || !result || result.error) {
      const errorBody = result?.error || responseText || `HTTP ${response.status}`;
      updateAiDebug({
        request: "failed",
        errorType: `HTTP ${response.status}`,
        errorMessage: shortDebugMessage(errorBody),
      });
      setDuration();
      console.error("[AI Parser] Response error", {
        status: response.status,
        body: errorBody,
      });
      throw new Error(errorBody);
    }
    applyBackendDebug(result._debug);
    updateAiDebug({ request: "success", errorType: "-", errorMessage: "-" });
    setDuration();
    console.info("[AI Parser] Response received successfully");
    return result;
  }

  async function saveAiMeal(result, input) {
    const nutrientSource = result.parsedData || result.nutrients || result;
    const fallbackParsedData = normalizeAiNutrients(nutrientSource);
    if (!fallbackParsedData) throw new Error("AI parser returned invalid meal nutrients");

    const date = elements.entryDate.value;
    if (!date) {
      setMessage(elements.formMessage, "Wybierz datę wpisu.", "error");
      elements.entryDate.focus();
      return false;
    }

    const products = normalizeAiProducts(result.produkty || result.products);
    const lookupResult = await resolveMealWithFoodLookup(products, fallbackParsedData);
    const entry = {
      id: typeof result.id === "string" && result.id ? result.id : createId(),
      date,
      createdAt: typeof result.createdAt === "string" ? result.createdAt : new Date().toISOString(),
      rawText: input,
      parsedData: lookupResult.parsedData,
      tags: normalizeAiTags(result.tagi || result.tags, products),
      products: lookupResult.products || products,
      nutritionSource: lookupResult.source,
      dataSource: lookupResult.source,
    };
    await window.ketoDb.saveEntry(entry);
    cancelEditEntry(false);
    const sourceMessage = lookupResult.status === "matched"
      ? "baza: matched"
      : lookupResult.status === "mixed" ? "baza: częściowo, fallback AI dla całości"
      : lookupResult.status === "not_found" ? "baza: not_found, zapisano fallback AI" : `baza: ${lookupResult.status}`;
    setMessage(elements.formMessage, `Posiłek zapisany. ${sourceMessage}.`, "success");
    await refreshEntries();
    return true;
  }

  function readAiDishMass(result) {
    return Number(result?.totalMassG ?? result?.masa_calkowita_g ?? result?.masaCalkowitaG);
  }

  function readAiDishNutrients(result) {
    return normalizeAiNutrients(result?.totalData || result?.total_data || result?.calosc || result?.nutrients);
  }

  function readAiDishPer100g(result, totalData, totalMassG, forceFromTotal = false) {
    const directPer100g = forceFromTotal
      ? null
      : normalizeAiNutrients(result?.per100gData || result?.per_100g_data || result?.na_100g);
    if (directPer100g) return directPer100g;
    if (!totalData || !Number.isFinite(totalMassG) || totalMassG <= 0) return null;
    return Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, totalData[key] / totalMassG * 100]));
  }

  async function saveAiDish(result, input, messageElement = elements.formMessage) {
    const explicitTotalMassG = extractExplicitDishTotalMass(input);
    const totalMassG = explicitTotalMassG || readAiDishMass(result);
    if (!Number.isFinite(totalMassG) || totalMassG <= 0) {
      const error = new Error("AI parser did not return dish total mass");
      error.code = "MISSING_DISH_TOTAL_MASS";
      throw error;
    }
    const totalData = readAiDishNutrients(result);
    const per100gData = readAiDishPer100g(result, totalData, totalMassG, Boolean(explicitTotalMassG));
    if (!totalData || !per100gData) {
      throw new Error("AI parser returned invalid dish");
    }

    const id = typeof result.id === "string" && result.id ? result.id : createId();
    const existingDish = customDishes.find((dish) => dish.id === id);
    if (existingDish && !window.confirm("Danie o takim ID już istnieje. Nadpisać?")) return false;
    const now = new Date().toISOString();
    const products = normalizeAiProducts(result.products || result.produkty || result.ingredients || result.skladniki);
    const lookupResult = await resolveDishIngredientsWithFoodLookup(products);
    const dish = {
      id,
      name: typeof (result.name || result.nazwa) === "string" && (result.name || result.nazwa).trim()
        ? (result.name || result.nazwa).trim()
        : "Danie AI",
      totalMassG,
      initialMassG: totalMassG,
      remainingMassG: Number.isFinite(Number(existingDish?.remainingMassG)) ? Number(existingDish.remainingMassG) : totalMassG,
      usedMassG: Number.isFinite(Number(existingDish?.usedMassG)) ? Number(existingDish.usedMassG) : 0,
      massSource: explicitTotalMassG ? "raw_text_explicit_total_mass" : (typeof result.massSource === "string" ? result.massSource : ""),
      portionCalculation: typeof result.portionCalculation === "string" ? result.portionCalculation : "",
      totalData,
      per100gData,
      tags: normalizeAiTags(result.tags, products),
      products: lookupResult.products,
      source: lookupResult.source,
      dataSource: lookupResult.source,
      rawText: input,
      createdAt: existingDish?.createdAt || (typeof result.createdAt === "string" ? result.createdAt : now),
      updatedAt: now,
    };
    await window.ketoDb.saveCustomDish(dish);
    cancelEditEntry(false);
    setMessage(messageElement, "Danie policzone przez AI i zapisane w Moje dania.", "success");
    await refreshEntries();
    return true;
  }

  async function handleAiParse() {
    if (isAiParsing) return;
    const input = elements.rawInput.value.trim();
    if (!input) {
      setMessage(elements.formMessage, "Opisz posiłek przed liczeniem.", "error");
      elements.rawInput.focus();
      return;
    }
    if (editingEntryId || editingDishId) {
      setMessage(elements.formMessage, "Zakończ edycję przed dodaniem nowego wpisu przez AI.", "error");
      return;
    }

    setAiParsing(true);
    setMessage(elements.formMessage, "Liczenie posiłku…");
    try {
      const result = await requestAiParse(input);
      if (result.typ === "danie_wieloskladnikowe") {
        await saveAiDish(result, input);
      } else {
        await saveAiMeal(result, input);
      }
    } catch (error) {
      if (aiDebugState.request !== "failed") {
        updateAiDebug({
          request: "failed",
          errorType: error.name || "Error",
          errorMessage: shortDebugMessage(error.message || error.name),
        });
      }
      console.error("AI parser failed:", error);
      setMessage(
        elements.formMessage,
        error.code === "MISSING_SUPABASE_PUBLISHABLE_KEY"
          ? "Brakuje publicznego klucza Supabase w config.js"
          : "AI nie policzyło posiłku. Doprecyzuj opis.",
        "error",
      );
    } finally {
      setAiParsing(false);
      resizeComposer();
    }
  }

  async function handleDishAiCreate() {
    if (isDishAiParsing) return;
    const input = elements.dishAiInput.value.trim();
    if (!input) {
      setMessage(elements.dishesMessage, "Opisz danie przed utworzeniem.", "error");
      elements.dishAiInput.focus();
      return;
    }
    if (editingEntryId || editingDishId) {
      setMessage(elements.dishesMessage, "Zakończ edycję przed utworzeniem nowego dania przez AI.", "error");
      return;
    }

    setDishAiParsing(true);
    setMessage(elements.dishesMessage, "Tworzenie dania…");
    try {
      const result = await requestAiParse(input, "parse_dish");
      const saved = await saveAiDish(result, input, elements.dishesMessage);
      if (saved) {
        elements.dishAiInput.value = "";
        resizeDishComposer();
      }
    } catch (error) {
      if (aiDebugState.request !== "failed") {
        updateAiDebug({
          request: "failed",
          errorType: error.name || "Error",
          errorMessage: shortDebugMessage(error.message || error.name),
        });
      }
      console.error("AI dish parser failed:", error);
      setMessage(
        elements.dishesMessage,
        error.code === "MISSING_SUPABASE_PUBLISHABLE_KEY"
          ? "Brakuje publicznego klucza Supabase w config.js"
          : error.code === "MISSING_DISH_TOTAL_MASS"
            ? "Podaj masę całości dania, np. „Całość po ugotowaniu 1200 g”."
            : "AI nie utworzyło dania. Doprecyzuj opis i masę całości.",
        "error",
      );
    } finally {
      setDishAiParsing(false);
      resizeDishComposer();
    }
  }

  async function handleSave() {
    const rawText = elements.rawInput.value.trim();

    if (!rawText) {
      setMessage(elements.formMessage, "Wklej dane przed zapisaniem.", "error");
      elements.rawInput.focus();
      return;
    }
    if (isCustomDishText(rawText)) {
      await saveCustomDishFromText(rawText);
      return;
    }

    const date = elements.entryDate.value;

    if (!date) {
      setMessage(elements.formMessage, "Wybierz datę wpisu.", "error");
      elements.entryDate.focus();
      return;
    }

    const { parsedData, tags, products, detectedCount } = parseNutritionText(rawText);
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
      entry = createUpdatedEntry(existingEntry, date, rawText, parsedData, tags, products);
    } else {
      entry = { id: createId(), date, createdAt: new Date().toISOString(), rawText, parsedData, tags, products };
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
    updateDatePickerLabel();
    elements.rawInput.value = entry.rawText;
    elements.saveButton.textContent = "Zapisz";
    elements.saveButton.setAttribute("aria-label", "Zapisz zmiany");
    elements.saveButton.hidden = false;
    elements.cancelEditButton.hidden = false;
    elements.editModeMessage.hidden = false;
    elements.editModeMessage.textContent = `Edytujesz wpis z dnia: ${entry.date}`;
    setMessage(elements.formMessage, "");
    switchView("start");
    resizeComposer();
    elements.rawInput.focus();
  }

  function startEditDish(id) {
    const dish = customDishes.find((item) => item.id === id);
    if (!dish) return;
    editingDishId = id;
    elements.rawInput.value = dish.rawText;
    elements.saveButton.textContent = "Zapisz";
    elements.saveButton.setAttribute("aria-label", "Zapisz danie");
    elements.saveButton.hidden = false;
    elements.cancelEditButton.hidden = false;
    elements.editModeMessage.hidden = false;
    elements.editModeMessage.textContent = `Edytujesz danie: ${dish.name}`;
    setMessage(elements.formMessage, "");
    switchView("start");
    resizeComposer();
    elements.rawInput.focus();
  }

  function cancelEditEntry(clearMessage = true) {
    editingEntryId = null;
    editingDishId = null;
    elements.entryDate.value = localDateString();
    updateDatePickerLabel();
    elements.rawInput.value = "";
    elements.saveButton.textContent = "Gem";
    elements.saveButton.setAttribute("aria-label", "Zapisz format Gema");
    elements.saveButton.title = "Zapisz format Gema";
    elements.saveButton.hidden = true;
    elements.cancelEditButton.hidden = true;
    elements.editModeMessage.hidden = true;
    resizeComposer();
    if (clearMessage) setMessage(elements.formMessage, "");
  }

  async function addDishPortion(id) {
    const dish = customDishes.find((item) => item.id === id);
    const input = [...elements.dishesList.querySelectorAll("[data-dish-portion-id]")]
      .find((item) => item.dataset.dishPortionId === id);
    const portionG = Number.parseFloat(input?.value?.replace(",", "."));
    if (!dish || !Number.isFinite(portionG) || portionG <= 0) {
      setMessage(elements.dishesMessage, "Wpisz prawidłową porcję w gramach.", "error");
      return;
    }
    const ratio = portionG / dish.totalMassG;
    const parsedData = Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, Math.round((dish.totalData?.[key] || 0) * ratio)]));
    const rawText = `Porcja dania własnego: ${dish.name} | ${formatNumber(portionG)} g`;
    const entry = {
      id: createId(),
      date: elements.entryDate.value || localDateString(),
      createdAt: new Date().toISOString(),
      rawText,
      parsedData,
      tags: [...(dish.tags || [])],
      products: [{
        name: dish.name,
        amountG: portionG,
        type: "custom_dish",
        dishId: dish.id,
        dataSourceType: "custom_dish",
        ingredientSource: dish.dataSource || dish.source || null,
      }],
      nutritionSource: {
        type: "custom_dish",
        label: "Danie własne",
        dishId: dish.id,
        productName: dish.name,
        ingredientSource: dish.dataSource || dish.source || null,
      },
      dataSource: {
        type: "custom_dish",
        label: "Danie własne",
        dishId: dish.id,
        productName: dish.name,
        ingredientSource: dish.dataSource || dish.source || null,
      },
    };
    try {
      await window.ketoDb.saveEntry(entry);
      input.value = "";
      setMessage(elements.dishesMessage, `Dodano ${formatNumber(portionG)} g dania do bilansu.`, "success");
      await refreshEntries();
    } catch (error) {
      console.error(error);
      setMessage(elements.dishesMessage, "Nie udało się dodać porcji.", "error");
    }
  }

  async function deleteCustomDish(id) {
    if (!window.confirm("Usunąć to danie?")) return;
    try {
      await window.ketoDb.deleteCustomDish(id);
      await refreshEntries();
      setMessage(elements.dishesMessage, "Danie usunięte.", "success");
    } catch (error) {
      console.error(error);
      setMessage(elements.dishesMessage, "Nie udało się usunąć dania.", "error");
    }
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

  async function deleteMissingFoodEntry(id) {
    if (!id) {
      setMessage(elements.missingFoodsMessage, "Nie znaleziono wpisu historii dla tego braku.", "error");
      return;
    }
    if (!window.confirm("Usunąć cały wpis z historii? Tej akcji nie można cofnąć.")) {
      return;
    }

    try {
      const exists = entries.some((entry) => entry.id === id);
      if (!exists) {
        setMessage(elements.missingFoodsMessage, "Nie znaleziono wpisu historii dla tego braku.", "error");
        await refreshEntries();
        return;
      }
      await window.ketoDb.deleteEntry(id);
      if (editingEntryId === id) cancelEditEntry();
      await refreshEntries();
      setMessage(elements.missingFoodsMessage, "Wpis usunięty z historii.", "success");
    } catch (error) {
      console.error(error);
      setMessage(elements.missingFoodsMessage, "Nie udało się usunąć wpisu z historii.", "error");
    }
  }

  async function handleExport() {
    try {
      const [allEntries, allCustomDishes] = await Promise.all([
        window.ketoDb.getAllEntries(),
        window.ketoDb.getAllCustomDishes(),
      ]);
      const payload = {
        app: "Bilans",
        version: 4,
        exportedAt: new Date().toISOString(),
        entries: allEntries,
        customDishes: allCustomDishes,
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
      setMessage(elements.backupMessage, `Wyeksportowano ${allEntries.length} wpisów i ${allCustomDishes.length} dań.`, "success");
    } catch (error) {
      console.error(error);
      setMessage(elements.backupMessage, "Nie udało się wyeksportować danych.", "error");
    }
  }

  function setMissingFoodsExportMessage(text, type = "") {
    if (elements.backupMessage) setMessage(elements.backupMessage, text, type);
    if (elements.missingFoodsMessage) setMessage(elements.missingFoodsMessage, text, type);
  }

  async function handleExportMissingFoods() {
    try {
      const [allEntries, allCustomDishes] = await Promise.all([
        window.ketoDb.getAllEntries(),
        window.ketoDb.getAllCustomDishes(),
      ]);
      const missingRows = collectMissingFoods(allEntries, { customDishes: allCustomDishes });
      const activeMissingKeys = new Set(missingRows.map((row) => row.key));
      const missingFoods = missingRows.map((row) => ({
        query: row.name,
        amount_g: row.amountG,
        lookupStatus: row.lookupStatus,
        dataSourceType: row.dataSourceType,
        source: row.sourceLabel || "Historia",
        dish_name: row.dishName || null,
        occurrences: row.occurrences,
        last_used_date: row.lastUsedDate,
        latest_original_text: row.latestOriginalText,
        note: row.note || "AI fallback nutrients belong to the whole entry, not this single missing product.",
        source_entry_ids: row.entryIds,
        source_dish_ids: row.dishIds || [],
      }));
      const entriesForReview = allEntries.map((entry) => {
        const products = getMissingFoodProducts(entry).filter((product) => activeMissingKeys.has(getMissingFoodKey(product, entry)));
        if (!products.length) return null;
        return {
          id: entry.id,
          date: entry.date,
          originalText: entry.rawText,
          tags: Array.isArray(entry.tags) ? entry.tags : [],
          products: products.map((product) => ({
            query: product.name,
            amount_g: product.amountG,
            lookupStatus: product.lookupStatus || null,
            dataSourceType: product.dataSourceType || null,
            matchedName: product.matchedName || null,
            fdcId: product.fdcId ?? null,
            requiresConfirmation: product.requiresConfirmation === true,
            matchType: product.matchType || null,
          })),
          note: "AI fallback nutrients belong to the whole entry, not each listed missing product.",
          dataSource: getEntryDataSource(entry),
        };
      }).filter(Boolean);
      const dishesForReview = allCustomDishes.map((dish) => {
        const pseudoEntry = {
          id: `dish:${dish.id}`,
          createdAt: dish.createdAt || dish.updatedAt || "",
          date: getDishReviewDate(dish),
          rawText: `Moje danie: ${dish.name}`,
        };
        const products = getDishMissingFoodProducts(dish).filter((product) => activeMissingKeys.has(getMissingFoodKey(product, pseudoEntry)));
        if (!products.length) return null;
        return {
          id: dish.id,
          name: dish.name,
          totalMassG: dish.totalMassG,
          products: products.map((product) => ({
            query: product.name,
            amount_g: product.amountG,
            lookupStatus: product.lookupStatus || null,
            dataSourceType: product.dataSourceType || null,
            matchedName: product.matchedName || null,
            fdcId: product.fdcId ?? null,
            requiresConfirmation: product.requiresConfirmation === true,
            matchType: product.matchType || null,
          })),
          note: "Dish nutrients belong to the whole recipe, not each listed missing product.",
          dataSource: getDishDataSourceInfo(dish),
        };
      }).filter(Boolean);
      const payload = {
        app: "Bilans",
        exportType: "missing_in_food_database",
        exportedAt: new Date().toISOString(),
        count: missingFoods.length,
        missingFoods,
        entries: entriesForReview,
        customDishes: dishesForReview,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vitatrack-missing-foods.json";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMissingFoodsExportMessage(`Wyeksportowano ${missingFoods.length} braków w bazie.`, "success");
    } catch (error) {
      console.error(error);
      setMissingFoodsExportMessage("Nie udało się wyeksportować braków w bazie.", "error");
    }
  }

  function dismissMissingFood(key) {
    const hiddenKeys = readHiddenMissingFoodKeys();
    hiddenKeys.add(key);
    writeHiddenMissingFoodKeys(hiddenKeys);
    renderMissingFoods();
    setMessage(elements.missingFoodsMessage, "Brak ukryty w tej przeglądarce. Historia posiłków została bez zmian.", "success");
  }

  function clearHiddenMissingFoods() {
    writeHiddenMissingFoodKeys(new Set());
    renderMissingFoods();
    setMessage(elements.missingFoodsMessage, "Wyczyszczono listę ukrytych braków.", "success");
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

  function normalizeImportedEntry(entry) {
    const products = Array.isArray(entry.products)
      ? entry.products.filter((product) => product
        && typeof product.name === "string"
        && Number.isFinite(Number(product.amountG)))
        .map((product) => ({ ...product, name: product.name, amountG: Number(product.amountG) }))
      : [];
    return { ...entry, products };
  }

  function isValidImportedDish(dish) {
    return Boolean(
      dish
      && typeof dish.id === "string"
      && typeof dish.name === "string"
      && Number.isFinite(Number(dish.totalMassG))
      && dish.totalData
      && typeof dish.totalData === "object"
      && typeof dish.rawText === "string",
    );
  }

  function normalizeImportedDish(dish) {
    return {
      ...dish,
      totalMassG: Number(dish.totalMassG),
      tags: Array.isArray(dish.tags) ? dish.tags : [],
      products: Array.isArray(dish.products) ? dish.products : [],
      per100gData: dish.per100gData || Object.fromEntries(
        NUTRIENT_KEYS.map((key) => [key, Number(dish.totalData?.[key] || 0) / Number(dish.totalMassG) * 100]),
      ),
    };
  }

  async function handleImportFile(file) {
    try {
      const data = JSON.parse(await file.text());
      const importedEntries = Array.isArray(data) ? data : data.entries;
      if (!Array.isArray(importedEntries)) {
        throw new Error("Nieprawidłowy format pliku.");
      }

      const validEntries = importedEntries.filter(isValidImportedEntry).map(normalizeImportedEntry);
      const importedCount = await window.ketoDb.importEntries(validEntries);
      const importedDishes = Array.isArray(data.customDishes) ? data.customDishes : [];
      const validDishes = importedDishes.filter(isValidImportedDish).map(normalizeImportedDish);
      const importedDishCount = await window.ketoDb.importCustomDishes(validDishes);
      settings = { ...getDefaultSettings(), ...(data.settings || {}) };
      await window.ketoDb.saveSettings(settings);
      applyTheme();
      renderSettings();
      await refreshEntries();
      setMessage(
        elements.backupMessage,
        `Zaimportowano ${importedCount} wpisów i ${importedDishCount} dań. Pominięto istniejące lub nieprawidłowe dane.`,
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
    elements.aiParseButton.addEventListener("click", handleAiParse);
    elements.saveButton.addEventListener("click", handleSave);
    elements.rawInput.addEventListener("input", resizeComposer);
    elements.dishAiCreateButton.addEventListener("click", handleDishAiCreate);
    elements.dishAiInput.addEventListener("input", resizeDishComposer);
    elements.dishAiClearButton.addEventListener("click", () => {
      elements.dishAiInput.value = "";
      setMessage(elements.dishesMessage, "");
      resizeDishComposer();
      elements.dishAiInput.focus();
    });
    elements.topAddButton.addEventListener("click", focusComposer);
    elements.datePickerButton.addEventListener("click", openDatePicker);
    elements.entryDate.addEventListener("change", updateDatePickerLabel);
    elements.homePeriodButtons.forEach((button) => {
      button.addEventListener("click", () => {
        homeProgressDays = Number(button.dataset.homeDays);
        renderHomeProgress();
      });
    });
    elements.clearButton.addEventListener("click", () => {
      elements.rawInput.value = "";
      setMessage(elements.formMessage, "");
      resizeComposer();
      elements.rawInput.focus();
    });
    elements.cancelEditButton.addEventListener("click", () => cancelEditEntry());
    elements.toggleAlertsButton.addEventListener("click", () => {
      alertsExpanded = !alertsExpanded;
      renderAlerts();
    });
    elements.menuButton.addEventListener("click", openMenu);
    elements.bottomMenuButton.addEventListener("click", openMenu);
    elements.bottomAddButton.addEventListener("click", focusComposer);
    elements.closeMenuButton.addEventListener("click", closeMenu);
    elements.menuBackdrop.addEventListener("click", closeMenu);
    elements.debugToggleButton.addEventListener("click", toggleDebugPanel);
    elements.debugResetCostButton.addEventListener("click", resetDebugCostTotal);
    elements.foodLookupTestButton.addEventListener("click", runFoodLookupSmokeTest);
    document.querySelectorAll("[data-view-target]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.viewTarget));
    });
    elements.themeButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        settings.theme = button.dataset.themeChoice;
        await window.ketoDb.saveSettings(settings);
        applyTheme();
      });
    });
    elements.entriesList.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit-entry-id]");
      const deleteButton = event.target.closest("[data-delete-entry-id]");
      if (editButton) startEditEntry(editButton.dataset.editEntryId);
      if (deleteButton) handleDelete(deleteButton.dataset.deleteEntryId);
    });
    elements.dishesList.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add-dish-id]");
      const editButton = event.target.closest("[data-edit-dish-id]");
      const deleteButton = event.target.closest("[data-delete-dish-id]");
      if (addButton) addDishPortion(addButton.dataset.addDishId);
      if (editButton) startEditDish(editButton.dataset.editDishId);
      if (deleteButton) deleteCustomDish(deleteButton.dataset.deleteDishId);
    });
    elements.missingFoodsList.addEventListener("click", (event) => {
      const dismissButton = event.target.closest("[data-dismiss-missing-food]");
      const deleteEntryButton = event.target.closest("[data-delete-missing-entry-id]");
      if (dismissButton) dismissMissingFood(dismissButton.dataset.dismissMissingFood);
      if (deleteEntryButton) deleteMissingFoodEntry(deleteEntryButton.dataset.deleteMissingEntryId);
    });
    elements.exportButton.addEventListener("click", handleExport);
    elements.exportMissingFoodsButton.addEventListener("click", handleExportMissingFoods);
    elements.missingFoodsExportButton.addEventListener("click", handleExportMissingFoods);
    elements.clearHiddenMissingFoodsButton.addEventListener("click", clearHiddenMissingFoods);
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
    elements.installButton.addEventListener("click", installApp);
    elements.appearanceInstallButton.addEventListener("click", installApp);
    window.addEventListener("beforeinstallprompt", (event) => {
      if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) return;
      event.preventDefault();
      deferredInstallPrompt = event;
      elements.installButton.hidden = false;
      elements.appearanceInstallButton.hidden = false;
    });
    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      elements.installButton.hidden = true;
      elements.appearanceInstallButton.hidden = true;
      setMessage(elements.formMessage, "Aplikacja zainstalowana.", "success");
      showPwaMessage("Aplikacja zainstalowana.");
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (settings.theme === "system") applyTheme();
    });
  }

  async function init() {
    Object.assign(elements, {
      aiParseButton: document.querySelector("#ai-parse-button"),
      appDebugPanel: document.querySelector("#app-debug-panel"),
      appMenu: document.querySelector("#app-menu"),
      appearanceInstallButton: document.querySelector("#appearance-install-button"),
      backupMessage: document.querySelector("#backup-message"),
      alertsList: document.querySelector("#alerts-list"),
      bottomAddButton: document.querySelector("#bottom-add-button"),
      bottomMenuButton: document.querySelector("#bottom-menu-button"),
      cancelEditButton: document.querySelector("#cancel-edit-button"),
      clearHiddenMissingFoodsButton: document.querySelector("#clear-hidden-missing-foods-button"),
      clearButton: document.querySelector("#clear-button"),
      closeMenuButton: document.querySelector("#close-menu-button"),
      composerShell: document.querySelector(".composer-shell"),
      datePickerButton: document.querySelector("#date-picker-button"),
      debugAiDuration: document.querySelector("#debug-ai-duration"),
      debugAiErrorMessage: document.querySelector("#debug-ai-error-message"),
      debugAiErrorType: document.querySelector("#debug-ai-error-type"),
      debugAiFetchStarted: document.querySelector("#debug-ai-fetch-started"),
      debugAiHttp: document.querySelector("#debug-ai-http"),
      debugAiInputTokens: document.querySelector("#debug-ai-input-tokens"),
      debugAiKey: document.querySelector("#debug-ai-key"),
      debugAiLastCost: document.querySelector("#debug-ai-last-cost"),
      debugAiModel: document.querySelector("#debug-ai-model"),
      debugAiOutputTokens: document.querySelector("#debug-ai-output-tokens"),
      debugAiParsedKeys: document.querySelector("#debug-ai-parsed-keys"),
      debugAiRawResponse: document.querySelector("#debug-ai-raw-response"),
      debugAiRequest: document.querySelector("#debug-ai-request"),
      debugAiTotalCost: document.querySelector("#debug-ai-total-cost"),
      debugAiTotalTokens: document.querySelector("#debug-ai-total-tokens"),
      debugAiUrl: document.querySelector("#debug-ai-url"),
      debugAppVersion: document.querySelector("#debug-app-version"),
      debugCacheVersion: document.querySelector("#debug-cache-version"),
      debugFoodLookupStatus: document.querySelector("#debug-food-lookup-status"),
      debugFoodLookupUrl: document.querySelector("#debug-food-lookup-url"),
      debugLastChange: document.querySelector("#debug-last-change"),
      debugResetCostButton: document.querySelector("#debug-reset-cost-button"),
      debugSupabaseUrl: document.querySelector("#debug-supabase-url"),
      debugToggleButton: document.querySelector("#debug-toggle-button"),
      dishAiClearButton: document.querySelector("#dish-ai-clear-button"),
      dishAiCreateButton: document.querySelector("#dish-ai-create-button"),
      dishAiInput: document.querySelector("#dish-ai-input"),
      dishesList: document.querySelector("#dishes-list"),
      dishesMessage: document.querySelector("#dishes-message"),
      eatingWindowMessage: document.querySelector("#eating-window-message"),
      editModeMessage: document.querySelector("#edit-mode-message"),
      emptyTemplate: document.querySelector("#empty-entries-template"),
      entriesList: document.querySelector("#entries-list"),
      entryCount: document.querySelector("#entry-count"),
      entryDate: document.querySelector("#entry-date"),
      exportButton: document.querySelector("#export-button"),
      exportMissingFoodsButton: document.querySelector("#export-missing-foods-button"),
      formMessage: document.querySelector("#form-message"),
      foodLookupTestButton: document.querySelector("#food-lookup-test-button"),
      foodLookupTestOutput: document.querySelector("#food-lookup-test-output"),
      homePeriodButtons: [...document.querySelectorAll("[data-home-days]")],
      homeProgressList: document.querySelector("#home-progress-list"),
      importButton: document.querySelector("#import-button"),
      importInput: document.querySelector("#import-input"),
      installButton: document.querySelector("#install-button"),
      menuBackdrop: document.querySelector("#menu-backdrop"),
      menuButton: document.querySelector("#menu-button"),
      missingFoodsExportButton: document.querySelector("#missing-foods-export-button"),
      missingFoodsList: document.querySelector("#missing-foods-list"),
      missingFoodsMessage: document.querySelector("#missing-foods-message"),
      missingFoodsSummary: document.querySelector("#missing-foods-summary"),
      pwaMessage: document.querySelector("#pwa-message"),
      rawInput: document.querySelector("#raw-input"),
      resetSettingsButton: document.querySelector("#reset-settings-button"),
      saveButton: document.querySelector("#save-button"),
      settingsFields: document.querySelector("#settings-fields"),
      settingsForm: document.querySelector("#settings-form"),
      settingsMessage: document.querySelector("#settings-message"),
      storageStatus: document.querySelector("#storage-status"),
      summarySections: document.querySelector("#summary-sections"),
      themeColorMeta: document.querySelector("#theme-color-meta"),
      toggleAlertsButton: document.querySelector("#toggle-alerts-button"),
      topAddButton: document.querySelector("#top-add-button"),
      themeButtons: [...document.querySelectorAll("[data-theme-choice]")],
      worthNotes: document.querySelector("#worth-notes"),
    });

    renderDebugPanel();
    elements.entryDate.value = localDateString();
    updateDatePickerLabel();
    resizeComposer();
    resizeDishComposer();
    bindEvents();
    registerServiceWorker();
    requestPersistentStorage();

    try {
      settings = { ...getDefaultSettings(), ...await window.ketoDb.getSettings() };
      applyTheme();
      renderSettings();
      await refreshEntries();
      switchView(currentView);
    } catch (error) {
      console.error(error);
      setMessage(elements.formMessage, "Nie udało się otworzyć lokalnej bazy danych.", "error");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

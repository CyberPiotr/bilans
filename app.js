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

  const AUXILIARY_TAGS = ["fermentowane", "suplement", "wysokie_wegle"];

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
    fermentowane: ["fermentowane"],
    suplement: ["suplement"],
    wysokie_wegle: ["wysokie_wegle", "wysokie wegle"],
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
    const totalMassG = Number.parseFloat(parseNamedValue(rawText, "masa_calkowita_g").replace(",", "."));
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

        const details = document.createElement("details");
        details.className = "entry-details";
        const detailsSummary = document.createElement("summary");
        detailsSummary.textContent = "Szczegóły wpisu";
        details.append(detailsSummary);
        const products = Array.isArray(entry.products) ? entry.products : [];
        if (products.length) {
          const productsSection = document.createElement("section");
          productsSection.className = "entry-products";
          const productsTitle = document.createElement("h3");
          productsTitle.textContent = "Produkty";
          const productsList = document.createElement("ul");
          products.forEach((product) => {
            const item = document.createElement("li");
            item.textContent = `${product.name} — ${formatNumber(product.amountG)} g`;
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

  function resizeComposer() {
    elements.rawInput.style.height = "auto";
    elements.rawInput.style.height = `${Math.min(elements.rawInput.scrollHeight, window.innerHeight * 0.4)}px`;
    elements.clearButton.hidden = !elements.rawInput.value;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--composer-space", `${elements.composerShell.offsetHeight + 24}px`);
    });
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
    elements.saveButton.textContent = "↑";
    elements.saveButton.setAttribute("aria-label", "Zapisz wpis");
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
    const rawText = `Porcja dania własnego:\n${dish.id} | ${formatNumber(portionG)} g`;
    const entry = {
      id: createId(),
      date: elements.entryDate.value || localDateString(),
      createdAt: new Date().toISOString(),
      rawText,
      parsedData,
      tags: [...(dish.tags || [])],
      products: [{ name: dish.id, amountG: portionG, type: "custom_dish" }],
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
    elements.saveButton.addEventListener("click", handleSave);
    elements.rawInput.addEventListener("input", resizeComposer);
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
    elements.closeMenuButton.addEventListener("click", closeMenu);
    elements.menuBackdrop.addEventListener("click", closeMenu);
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
      appMenu: document.querySelector("#app-menu"),
      appearanceInstallButton: document.querySelector("#appearance-install-button"),
      backupMessage: document.querySelector("#backup-message"),
      alertsList: document.querySelector("#alerts-list"),
      cancelEditButton: document.querySelector("#cancel-edit-button"),
      clearButton: document.querySelector("#clear-button"),
      closeMenuButton: document.querySelector("#close-menu-button"),
      composerShell: document.querySelector(".composer-shell"),
      datePickerButton: document.querySelector("#date-picker-button"),
      dishesList: document.querySelector("#dishes-list"),
      dishesMessage: document.querySelector("#dishes-message"),
      eatingWindowMessage: document.querySelector("#eating-window-message"),
      editModeMessage: document.querySelector("#edit-mode-message"),
      emptyTemplate: document.querySelector("#empty-entries-template"),
      entriesList: document.querySelector("#entries-list"),
      entryCount: document.querySelector("#entry-count"),
      entryDate: document.querySelector("#entry-date"),
      exportButton: document.querySelector("#export-button"),
      formMessage: document.querySelector("#form-message"),
      homePeriodButtons: [...document.querySelectorAll("[data-home-days]")],
      homeProgressList: document.querySelector("#home-progress-list"),
      importButton: document.querySelector("#import-button"),
      importInput: document.querySelector("#import-input"),
      installButton: document.querySelector("#install-button"),
      menuBackdrop: document.querySelector("#menu-backdrop"),
      menuButton: document.querySelector("#menu-button"),
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

    elements.entryDate.value = localDateString();
    updateDatePickerLabel();
    resizeComposer();
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

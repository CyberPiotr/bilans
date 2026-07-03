import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-4o-mini";
const MAX_INPUT_LENGTH = 4000;

// Verify these estimates against the current OpenAI API pricing before relying on them for billing.
const MODEL_PRICING_USD_PER_1M = {
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
} as const;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const nutrientKeys = [
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
] as const;

const allowedTags = [
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
  "fermentowane",
  "suplement",
  "wysokie_wegle",
] as const;

type Action = "parse_meal" | "parse_dish";

type ParserRequest = {
  action: Action;
  input: string;
};

type Product = {
  name: string;
  amountG: number;
};

type Nutrients = Record<(typeof nutrientKeys)[number], number>;

type MealModelResult = {
  tagi: string[];
  produkty: Product[];
} & Nutrients;

type DishModelResult = {
  name: string;
  totalMassG: number;
  massSource: string;
  portionCalculation: string;
  totalData: Nutrients;
  per100gData: Nutrients;
  tags: string[];
  products: Product[];
};

type OpenAIUsage = {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
};

type ParserDebug = {
  model: string;
  usage: OpenAIUsage | null;
  estimated_cost_usd: number | null;
  estimated_cost_label: string;
};

const nutrientSchema = {
  type: "object",
  properties: Object.fromEntries(
    nutrientKeys.map((key) => [key, { type: "number", minimum: 0 }]),
  ),
  required: [...nutrientKeys],
  additionalProperties: false,
};

const productSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    amountG: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["name", "amountG"],
  additionalProperties: false,
};

const tagsSchema = {
  type: "array",
  items: { type: "string", enum: [...allowedTags] },
};

const mealSchema = {
  type: "object",
  properties: {
    ...nutrientSchema.properties,
    tagi: tagsSchema,
    produkty: { type: "array", items: productSchema },
  },
  required: [...nutrientKeys, "tagi", "produkty"],
  additionalProperties: false,
};

const dishSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    totalMassG: { type: "number", exclusiveMinimum: 0 },
    massSource: { type: "string" },
    portionCalculation: { type: "string" },
    totalData: nutrientSchema,
    per100gData: nutrientSchema,
    tags: tagsSchema,
    products: { type: "array", items: productSchema },
  },
  required: [
    "name",
    "totalMassG",
    "massSource",
    "portionCalculation",
    "totalData",
    "per100gData",
    "tags",
    "products",
  ],
  additionalProperties: false,
};

const systemInstructions = `
Jestes parserem danych zywieniowych dla prywatnej aplikacji VitaTrack / Bilans.
Twoim zadaniem jest zamienic naturalny opis posilku lub dania na dane zgodne z przekazanym JSON schema.
Zwracaj wylacznie JSON zgodny ze schema. Nie zwracaj tekstowego formatu Gema, Markdownu, komentarzy ani wyjasnien.

ZASADY OBLICZEN:
- Rozpoznaj wszystkie wymienione produkty i ich ilosci. Produkty zapisuj z masa w gramach.
- Gdy uzytkownik jawnie podaje mase produktu w gramach, przepisz dokladnie te mase do produkty.amountG.
- Jawnie podana dodatnia masa nigdy nie moze zostac zmieniona na 0. Przyklad: "100 g brokula" oznacza
  produkt brokul z amountG rownym 100, nigdy 0.
- Gdy uzytkownik podaje sztuki, lyzki, lyzeczki, porcje lub inne miary, przelicz je na realistyczna mase.
- Uwzgledniaj sposob przygotowania oraz wszystkie wymienione dodatki, tluszcze, sosy i napoje.
- Zwracaj ostrozne, realistyczne oszacowania. Nie zawyzaj mikroskladnikow bez podstaw.
- Wszystkie wartosci odzywcze maja byc liczbami nieujemnymi.
- Brakujace lub niemozliwe do wiarygodnego oszacowania wartosci ustaw na 0.
- Wegle_netto oznaczaja weglowodany po odjeciu blonnika.

Jednostki: kalorie w kcal; bialko, tluszcz, wegle_netto i blonnik w g;
sod, potas, magnez, omega3_epa_dha, witamina_e, zelazo i cynk w mg;
witamina_d3 w IU; witamina_a, witamina_k2, selen i jod w mikrogramach.

ZASADY TAGOWANIA:
- Tagi wybieraj wylacznie z listy dozwolonej przez schema.
- Dodaj tag tylko wtedy, gdy co najmniej jeden produkt jednoznacznie do niego pasuje.
- Jesli produkt nie pasuje do zadnego dozwolonego tagu, nie wymyslaj tagu i pozostaw go bez tagu.
- "owoce": wszystkie owoce, w tym truskawki, borowki, maliny, jezyny, porzeczki, jablka, gruszki,
  banany, cytrusy, winogrona, kiwi, mango, ananas, brzoskwinie, sliwki, wisnie i czeresnie.
- "owoce" nie oznacza owocow morza.
- "owoce_morza_ryby_morskie": dorsz, losos, tunczyk, makrela, sledz, sardynki oraz ryby morskie
  i owoce morza. Dorsz zawsze otrzymuje ten tag. Losos zawsze otrzymuje ten tag.
- "jaja": jajka i potrawy, w ktorych jajka sa wyraznym skladnikiem.
- "tluste_ryby": makrela, losos, sledz, sardynki i inne jednoznacznie tluste ryby. Losos otrzymuje
  jednoczesnie tagi "tluste_ryby" oraz "owoce_morza_ryby_morskie".
- "podroby": watroba, watrobka, serca, nerki, zoladki i inne podroby.
- "mieso_czerwone": wolowina, wieprzowina, jagniecina, baranina.
- "drob": kurczak, indyk, kaczka, ges.
- "nabial": twarog, sery, jogurt, kefir, smietana i inne produkty mleczne.
- "tluszcze_czyste": oliwa, maslo, smalec, ghee, MCT i oleje.
- "zielone_warzywa": zielone warzywa lisciaste oraz jednoznacznie zielone warzywa.
- "warzywa_krzyzowe": brokul, kalafior, kapusta, brukselka, jarmuz.
- "straczki": ciecierzyca, fasola, soczewica, groch, soja i inne nasiona roslin straczkowych.
- "slodycze": czekolada, cukierki, batony, ciastka, ciasta, lody i inne slodycze.
- "kiszonki": produkty kiszone, np. kapusta kiszona, ogorki kiszone i kimchi.
- "orzechy_pestki": orzechy, pestki i nasiona.
- "fermentowane": produkty fermentowane.
- "suplement": suplementy diety.
- "wysokie_wegle": stosuj dla ziemniakow oraz innych produktow lub posilkow jednoznacznie
  wysokoweglowodanowych. Ziemniaki zawsze otrzymuja tag "wysokie_wegle".

Dla parse_meal policz laczne wartosci calego opisanego posilku.
Dla parse_dish policz totalData dla calego dania oraz per100gData na podstawie totalMassG.
`.trim();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function currentWarsawDate(now: Date): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isParserRequest(value: unknown): value is ParserRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Record<string, unknown>;
  return (request.action === "parse_meal" || request.action === "parse_dish")
    && typeof request.input === "string"
    && request.input.trim().length > 0
    && request.input.length <= MAX_INPUT_LENGTH;
}

function validateExplicitProductMasses(input: string, products: Product[]): void {
  const hasExplicitPositiveGrams = /(?:^|[\s,;])(?:\d+(?:[.,]\d+)?)\s*g(?:\b|ram)/i.test(input);
  if (hasExplicitPositiveGrams && products.some((product) => product.amountG === 0)) {
    throw new Error("Model returned zero product mass despite explicit grams in input");
  }
}

function extractOutputText(response: Record<string, unknown>): string | null {
  const output = Array.isArray(response.output) ? response.output : [];

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = Array.isArray((item as Record<string, unknown>).content)
      ? (item as Record<string, unknown>).content as unknown[]
      : [];

    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const record = part as Record<string, unknown>;
      if (record.type === "output_text" && typeof record.text === "string") {
        return record.text;
      }
    }
  }

  return null;
}

function extractUsage(response: Record<string, unknown>): OpenAIUsage | null {
  const usage = response.usage;
  if (!usage || typeof usage !== "object") return null;
  const record = usage as Record<string, unknown>;
  if (
    typeof record.input_tokens !== "number"
    || typeof record.output_tokens !== "number"
    || typeof record.total_tokens !== "number"
  ) return null;
  const inputTokens = Number(record.input_tokens);
  const outputTokens = Number(record.output_tokens);
  const totalTokens = Number(record.total_tokens);
  if (![inputTokens, outputTokens, totalTokens].every(Number.isFinite)) return null;
  return {
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    total_tokens: totalTokens,
  };
}

function createDebugMetadata(payload: Record<string, unknown>): ParserDebug {
  const usage = extractUsage(payload);
  const pricing = MODEL_PRICING_USD_PER_1M[OPENAI_MODEL];
  const estimatedCost = usage && pricing
    ? ((usage.input_tokens * pricing.input) + (usage.output_tokens * pricing.output)) / 1_000_000
    : null;
  return {
    model: OPENAI_MODEL,
    usage,
    estimated_cost_usd: estimatedCost,
    estimated_cost_label: estimatedCost === null ? "brak danych usage" : `~$${estimatedCost.toFixed(6)} USD`,
  };
}

async function callOpenAI(
  action: Action,
  input: string,
  apiKey: string,
): Promise<{ parsed: unknown; debug: ParserDebug }> {
  const schema = action === "parse_meal" ? mealSchema : dishSchema;
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    signal: AbortSignal.timeout(30_000),
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      store: false,
      instructions: systemInstructions,
      input: `${action}\n\n${input}`,
      text: {
        format: {
          type: "json_schema",
          name: action,
          strict: true,
          schema,
        },
      },
    }),
  });

  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) {
    console.error("OpenAI request failed", response.status, payload);
    throw new Error("OpenAI request failed");
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    console.error("OpenAI response did not contain output text", payload);
    throw new Error("OpenAI response did not contain output text");
  }

  return {
    parsed: JSON.parse(outputText),
    debug: createDebugMetadata(payload),
  };
}

async function handleRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Body must be valid JSON" }, 400);
  }

  if (!isParserRequest(body)) {
    return jsonResponse({
      error: `Expected action parse_meal or parse_dish and input between 1 and ${MAX_INPUT_LENGTH} characters`,
    }, 400);
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not configured");
    return jsonResponse({ error: "AI parser is not configured" }, 500);
  }

  try {
    const { parsed, debug } = await callOpenAI(body.action, body.input.trim(), apiKey);
    const currentTime = new Date();
    const now = currentTime.toISOString();
    const id = crypto.randomUUID();

    if (body.action === "parse_meal") {
      const result = parsed as MealModelResult;
      validateExplicitProductMasses(body.input, result.produkty);
      return jsonResponse({
        id,
        date: currentWarsawDate(currentTime),
        createdAt: now,
        rawText: body.input.trim(),
        ...Object.fromEntries(nutrientKeys.map((key) => [key, result[key]])),
        tagi: result.tagi,
        produkty: result.produkty,
        _debug: debug,
      });
    }

    const result = parsed as DishModelResult;
    validateExplicitProductMasses(body.input, result.products);
    return jsonResponse({
      typ: "danie_wieloskladnikowe",
      id,
      name: result.name,
      totalMassG: result.totalMassG,
      massSource: result.massSource,
      portionCalculation: result.portionCalculation,
      totalData: result.totalData,
      per100gData: result.per100gData,
      tags: result.tags,
      products: result.products,
      rawText: body.input.trim(),
      createdAt: now,
      updatedAt: now,
      _debug: debug,
    });
  } catch (error) {
    console.error("AI parser failed", error);
    return jsonResponse({ error: "AI parser request failed" }, 502);
  }
}

console.info("ai-parser started");

export default {
  fetch: handleRequest,
};

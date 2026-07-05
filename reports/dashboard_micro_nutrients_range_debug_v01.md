# Dashboard micro nutrients range debug v01

## Zakres

Diagnoza i minimalna poprawka dashboardu Dzisiaj / 3 dni / 7 dni w `C:\Users\nikto\Desktop\Dieta`.

Zakazy zachowane: bez backendu, bez Supabase, bez `db.js`, bez czyszczenia IndexedDB/cache, bez deployu i bez push.

## Gdzie liczony jest dashboard

* `app.js:807` — `getEntriesForDays(days)` wybiera wpisy po dacie.
* `app.js:814` — `sumNutrient(periodEntries, key)` sumuje `entry.parsedData[key]`.
* `app.js:860` — `renderHomeProgress()` renderuje wybrany zakres Dzisiaj / 3 dni / 7 dni.
* `app.js:1180` — `renderSummaries()` renderuje grupy celów dla wszystkich zakresów.
* `app.js:1039` — `calculateWorthSuggestions()` używa tych samych `getEntriesForDays()` i `sumNutrient()`.

## Jak działają zakresy

`getEntriesForDays(days)` liczy:

* `from = dateDaysAgo(days - 1)`
* `today = localDateString()`
* filtr: `entry.date >= from && entry.date <= today`

Wniosek:

* Dzisiaj (`days=1`) obejmuje dzisiejsze wpisy.
* 3 dni (`days=3`) obejmuje dziś + ostatnie 2 dni.
* 7 dni (`days=7`) obejmuje dziś + ostatnie 6 dni.

Statycznie zakresy są poprawne. Jeśli dzisiejszy wpis istnieje, zakres 3d i 7d powinien mieć co najmniej wartości z dzisiaj, o ile wpisy mają daty w formacie `YYYY-MM-DD`.

## Klucze nutrientów używane przez frontend

Kanoniczne klucze `NUTRIENT_KEYS`:

* `sod` — aliasy: `sod`, `sodium`
* `potas` — aliasy: `potas`, `potassium`
* `magnez` — aliasy: `magnez`, `magnesium`
* `omega3_epa_dha` — aliasy m.in. `omega3_epa_dha`, `omega3`, `omega_3`, `epa_dha`
* `blonnik` — aliasy: `blonnik`, `fiber`
* `zelazo` — aliasy: `zelazo`, `iron`
* `cynk` — aliasy: `cynk`, `zinc`
* `selen` — aliasy: `selen`, `selenium`
* `jod` — aliasy: `jod`, `iodine`
* `witamina_a` — aliasy: `witamina_a`, `vitamin a`
* `witamina_d3` — aliasy: `witamina_d3`, `vitamin d3`
* `witamina_e` — aliasy: `witamina_e`, `vitamin e`
* `witamina_k2` — aliasy: `witamina_k2`, `vitamin k2`

## Struktura payloadu food-lookup

Frontend czyta nutrienty z:

`payload.nutrients.<key>.value_per_100g`

oraz przelicznik porcji z:

`payload.amount.factor`

Wartość dla porcji jest liczona jako:

`value_per_100g * payload.amount.factor`

## Dlaczego potas/magnez były 0

Przed poprawką `normalizeLookupNutrients(payload)` szukało tylko `payload.nutrients[canonicalKey]`, np.:

* `payload.nutrients.potas`
* `payload.nutrients.magnez`

Jeśli backend zwracał angielskie klucze:

* `payload.nutrients.potassium`
* `payload.nutrients.magnesium`

to frontend traktował je jak brak danych i finalnie dashboard widział `0`.

Sód i błonnik mogły pokazywać wartości, jeśli backend zwracał je już pod kanonicznymi kluczami `sod` i `blonnik`, albo jeśli wcześniejsza próbka danych miała je w fallbacku AI pod tymi kluczami.

## Czy payload zawiera potas/magnez

Nie potwierdzono runtime w tym etapie, bo nie odpalano API. Kodowo frontend umie teraz czytać zarówno `potas`/`magnez`, jak i `potassium`/`magnesium`.

## Co poprawiono

* Dodano `getLookupNutrientPayloadEntry(payload, key)`, które szuka nutrientu po kanonicznym kluczu i aliasach z `NUTRIENT_ALIASES`.
* `normalizeLookupNutrients()` używa teraz aliasów przy mapowaniu payloadu na `parsedData`.
* Dodano konsolowy log:
  `[VitaTrack Dashboard Nutrient Debug]`
* Log dashboardu pokazuje:
  * zakres `today` / `3d` / `7d`
  * liczbę wpisów
  * daty wpisów
  * sumy wszystkich nutrientów
  * osobne szczegóły dla sodu, potasu, magnezu i błonnika
  * status per wpis: `value_for_amount_in_entry` albo `missing_in_entry`

## Jak ręcznie przetestować bez wielu requestów

1. Użyj istniejącego wpisu z food-lookup albo dodaj jeden testowy wpis.
2. Otwórz DevTools Console.
3. Przełącz dashboard: Dzisiaj, 3 dni, 7 dni.
4. Sprawdź logi `[VitaTrack Dashboard Nutrient Debug]`.
5. Porównaj:
   * `range`
   * `entry_count`
   * `entry_dates`
   * `focus.potassium.sum`
   * `focus.magnesium.sum`
6. Jeśli po nowym wpisie lookupowym potas/magnez nadal są 0, sprawdź wcześniejszy log `[VitaTrack Lookup Debug].nutrient_values`, czy payload faktycznie zawiera `potassium`/`magnesium` albo `potas`/`magnez`.

## Walidacja

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK, tylko ostrzeżenie Git o przyszłej zamianie LF na CRLF w `app.js`
* `git diff -- db.js` — pusty wynik

# Hybrid AI + food-lookup nutrient merge v01

## Cel

Zdiagnozowano lokalny przeplyw danych nutrientow po AI Parserze i food-lookup oraz wprowadzono minimalna poprawke, zeby finalne `entry.parsedData` zachowywalo mikroelementy z AI Parsera, gdy food-lookup nie zwraca danego nutrientu.

## Gdzie sa dane AI Parsera

- `requestAiParse(input, action)` odbiera odpowiedz AI Parsera i zwraca `result`.
- `saveAiMeal(result, input)` wybiera `result.parsedData || result.nutrients || result`.
- `normalizeAiNutrients(...)` normalizuje dane do kluczy z `NUTRIENT_KEYS`.
- Wynik AI jest trzymany jako `fallbackParsedData`.

## Gdzie ida produkty do food-lookup

- `saveAiMeal(...)` normalizuje produkty przez `normalizeAiProducts(...)`.
- `resolveMealWithFoodLookup(products, fallbackParsedData, input)` wysyla produkty do lookupu.
- `lookupProductWithDebug(...)` odpytuje `requestFoodLookup(...)` i loguje `[VitaTrack Lookup Debug]`.
- `normalizeLookupNutrients(payload)` mapuje `payload.nutrients` do kluczy aplikacji.
- `sumLookupNutrients(results)` sumuje wartosci lookupu dla wszystkich dopasowanych produktow.

## Gdzie AI parsedData bylo tracone

Przed poprawka w sciezce `results.every(({ result }) => result.kind === "matched")` aplikacja zwracala:

```js
parsedData: databaseParsedData
```

`databaseParsedData` powstaje tylko z `payload.nutrients` food-lookup. Jezeli lookup zwrocil tylko `kalorie`, `bialko`, `tluszcz`, `wegle_netto` i `blonnik`, pozostale klucze mialy `null`, a potem dashboard liczyl je jak `0` przez `sumNutrient(...)`.

Warianty `not_found`, `mixed`, blad lookupu i blad mapowania juz korzystaly z `fallbackParsedData`.

## Jak dziala finalny merge

Dodano `mergeAiFallbackWithLookupNutrients(aiParsedData, lookupParsedData)`:

- startuje od kluczy `NUTRIENT_KEYS`;
- jezeli food-lookup zwrocil liczbe dla klucza, wartosc pochodzi z lookupu;
- jezeli lookup nie zwrocil liczby, ale AI Parser ma liczbe, zostaje AI fallback;
- jezeli nie ma wartosci w obu zrodlach, zostaje `0`, zgodnie z dotychczasowym numericznym stylem `parsedData`.

Dodano log:

```js
[VitaTrack Hybrid Nutrient Merge Debug]
```

Log pokazuje:

- `raw_ai_parsedData`;
- `nutrients_summed_from_food_lookup`;
- `final_merged_parsedData`;
- `keys_taken_from_food_lookup`;
- `keys_kept_from_ai_fallback`;
- `keys_missing_in_both`.

## Klucze z bazy i AI fallback

Typowo z bazy moga pojsc klucze realnie obecne w `payload.nutrients`, np.:

- `kalorie`;
- `bialko`;
- `tluszcz`;
- `wegle_netto`;
- `blonnik`.

Z AI fallback moga zostac klucze, ktorych lookup nie zwrocil, np.:

- `sod`;
- `potas`;
- `magnez`;
- `omega3_epa_dha`;
- `witamina_d3`;
- `witamina_a`;
- `witamina_e`;
- `witamina_k2`;
- `zelazo`;
- `cynk`;
- `selen`;
- `jod`.

Dokladny podzial widac w `[VitaTrack Hybrid Nutrient Merge Debug]` dla kazdego zapisywanego posilku z pelnym match w lookupie.

## Zapis do IndexedDB

Finalne `entry.parsedData` jest ustawiane w `saveAiMeal(...)` jako `lookupResult.parsedData`, a nastepnie zapisywane przez:

```js
await window.ketoDb.saveEntry(entry);
```

`db.js` nie byl zmieniany.

## Test reczny

1. Otworz lokalna aplikacje.
2. Wpisz krotki posilek, ktory ma produkty dopasowane przez lookup, ale lookup zwraca tylko makro, np. soczewica + kapusta.
3. Zapisz posilek przez AI.
4. W konsoli sprawdz `[VitaTrack Lookup Debug]`, czy `payload.nutrients` ma ograniczony zestaw kluczy.
5. Sprawdz `[VitaTrack Hybrid Nutrient Merge Debug]`:
   - makro powinno byc w `keys_taken_from_food_lookup`;
   - mikroelementy obecne w AI powinny byc w `keys_kept_from_ai_fallback`.
6. Sprawdz dashboard: mikroelementy z AI fallback nie powinny znikac tylko dlatego, ze lookup ich nie zwrocil.

## Walidacja

Uruchomiono:

- `node --check app.js` - OK;
- `node --check config.js` - OK;
- `node --check service-worker.js` - OK;
- `git diff -- db.js` - pusty diff.

Pozostale walidacje (`git diff --check`, finalny status i commit) sa wykonywane po utworzeniu tego raportu.

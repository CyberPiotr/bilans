# Frontend food-lookup food_form debug v01

## Zakres

Review frontendowego przepływu AI Parser -> food-lookup -> historia posiłków w `C:\Users\nikto\Desktop\Dieta`.

Zakazy zachowane: bez czyszczenia IndexedDB/cache, bez deployu, bez push, bez zmian backendu/Supabase, bez sekretów i bez zmian w `db.js`.

## Gdzie frontend woła AI Parser

* `app.js:2378` — `requestAiParse(input, action = "parse_meal")`
* `app.js:2507` — `saveAiMeal(result, input)` używa wyniku parsera dla zwykłego posiłku.
* `app.js:2560` — `saveAiDish(result, input)` używa wyniku parsera dla dania własnego.

AI Parser dostaje `JSON.stringify({ action, input })`. Dla posiłku używany jest domyślny action `parse_meal`, dla dania action `parse_dish`.

## Gdzie frontend woła food-lookup

* `app.js:2287` — `requestFoodLookup({ query, amount_g, variant, fdc_id, limit })`
* `app.js:2317` — `lookupProductWithDebug(product, rawInput)` wykonuje lookup per produkt, loguje diagnostykę i robi maksymalnie jedną drugą próbę po alternatywnej nazwie.
* `app.js:2091` — `resolveMealWithFoodLookup(products, fallbackParsedData, rawInput)`
* `app.js:2217` — `resolveDishIngredientsWithFoodLookup(products, rawInput)`

## Mapowanie składników parsera na requesty food-lookup

* `app.js:1827` — `normalizeAiProducts(value)` bierze produkty z `result.produkty || result.products` dla posiłków oraz z `result.products || result.produkty || result.ingredients || result.skladniki` dla dań.
* Nazwa składnika trafia do `product.name`.
* `lookupProductWithDebug()` najpierw próbuje `product.name`.
* Jeśli wynik to `not_found`, próbuje maksymalnie jednej alternatywnej nazwy z pól parsera: `originalName`, `original_name`, `rawName`, `raw_name`, `originalText`, `original_text`, `query`.
* Jeśli parser nie zwraca żadnego oryginalnego fragmentu, druga próba nie ma dodatkowego źródła i nie jest wykonywana.

## Status produktu i zapis do historii/IndexedDB

* `app.js:2025` — `createProductLookupMetadata()` zapisuje:
  * `lookupStatus`
  * `matchedName`
  * `fdcId`
  * `requiresConfirmation`
  * `matchType`
  * `dataSourceType`
  * `foodForm`
* `app.js:2507` — `saveAiMeal()` zapisuje entry przez `window.ketoDb.saveEntry(entry)`.
* `db.js:67` — `saveEntry(entry)` robi `store.put(entry)` bez transformowania payloadu. `db.js` nie był edytowany.

## Czy product.food_form jest odbierany

TAK. Dodano `getFoodLookupPayloadFoodForm(payload)`, który czyta:

* `payload.product.food_form`
* `payload.product.foodForm`
* `payload.food_form`
* `payload.foodForm`

## Czy product.food_form jest zapisywany

TAK. `createProductLookupMetadata()` zapisuje `foodForm` przy produkcie, jeśli lookup zwróci `matched`.

## Czy UI pokazuje food_form

TAK, minimalnie. W szczegółach produktów historii i w składnikach dań dodano tekst:

`Forma: po ugotowaniu` / `Forma: suche` / `Forma: kiszone` itd.

Bez redesignu UI.

## Diagnostyka konsolowa

Dodano log per produkt z prefiksem:

`[VitaTrack Lookup Debug]`

Log zawiera:

* raw user input
* parsed ingredient name from AI Parser
* normalized lookup query wysłane do food-lookup
* amount_g
* HTTP status food-lookup
* lookup status
* returned product_name
* returned `product.food_form.display_form_pl`
* obecność nutrientów: kalorie, białko, tłuszcz, węgle
* finalny status UI (`dataSourceType`)

## Czy AI Parser zmienia nazwy

NIE UDAŁO SIĘ POTWIERDZIĆ statycznie. Nie uruchamiano prawdziwego AI Parsera ani food-lookup API w tym etapie.

Kodowo widać, że frontend dotąd używał głównie nazwy z parsera (`product.name`) jako lookup query. Jeśli parser zmienił `soczewica zielona` na wariant nierozpoznawany przez backend, frontend mógł dostać `not_found` mimo poprawnego backendu.

## Dlaczego soczewica zielona mogła wyjść jako Brak w bazie

Najbardziej prawdopodobne frontendowe przyczyny:

* AI Parser zwrócił nazwę inną niż oczekiwana przez backend.
* Frontend wysłał do food-lookup tylko parsed name, bez fallbacku po oryginalnym fragmencie.
* Wcześniej brakowało konsolowego logu request/response per składnik, więc nie było widać rzeczywistego `query`, HTTP statusu i `payload.status`.

Mniej prawdopodobne po kontekście backendu:

* backend realnie nie zna `soczewica zielona`, bo smoke backendu według promptu przeszedł PASS.

## Co poprawiono

* Dodano konsolową diagnostykę `[VitaTrack Lookup Debug]`.
* Dodano zapis `product.food_form` jako `foodForm` w metadata produktu.
* Dodano minimalne wyświetlanie `Forma: ...` w szczegółach produktu.
* Dodano bezpieczny fallback lookup: parsed name, a przy `not_found` maksymalnie jedna próba po alternatywnej/original nazwie, jeśli parser ją dostarczył.
* Nie zmieniono backendu, `db.js`, makro, kalorii, food-lookup API ani parse_dish.

## Jak ręcznie przetestować

1. Otwórz aplikację i DevTools Console.
2. Dodaj wpis:
   `ryż basmati 150 g, soczewica zielona 150 g, jajka 120 g, kapusta kiszona 100 g`
3. W konsoli sprawdź logi `[VitaTrack Lookup Debug]` dla każdego produktu.
4. Zweryfikuj:
   * `normalized_lookup_query`
   * `http_status`
   * `lookup_status`
   * `returned_product_name`
   * `food_form_display_form_pl`
   * `final_ui_status`
5. W historii rozwiń szczegóły wpisu.
6. Sprawdź, czy produkty mają statusy Baza/Baza proxy/Brak oraz tekst `Forma: ...` tam, gdzie backend zwrócił `food_form`.

## Walidacja

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK, tylko ostrzeżenia Git o przyszłej zamianie LF na CRLF w `app.js` i `style.css`
* `git diff -- db.js` — pusty wynik
* secret/destructive scan — brak wyników dla dodanych zmian i zakazanych fraz

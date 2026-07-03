# AI HANDOFF — Custom Dish Ingredient Food Lookup

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `df8735a Fix custom dish portion history display`
* Aktualny commit po etapie: do potwierdzenia po commicie `Add food lookup metadata for custom dish ingredients`
* Data etapu: 2026-07-03

## 2. Cel etapu

Dodać food-lookup dla składników dania tworzonego przez `Moje dania -> Utwórz danie`, bez przeliczania makro dania z bazy i bez zmiany logiki porcjowania.

## 3. Aktualny stan projektu

Po `parse_dish` aplikacja bierze listę składników dania i wykonuje `food-lookup` osobno dla każdego składnika. Wynik lookupu jest zapisywany w `dish.products` jako metadane per składnik. Karta `Moje dania` pokazuje źródło składników i listę składników ze statusami. Panel `Braki w bazie` uwzględnia teraz także brakujące składniki z zapisanych dań.

## 4. Co zostało zrobione

* Dodano `resolveDishIngredientsWithFoodLookup(products)`.
* `saveAiDish()` zapisuje składniki z metadanymi `lookupStatus`, `matchedName`, `fdcId`, `requiresConfirmation`, `matchType`, `dataSourceType`, `query`, `originalName`, `amountG`.
* Nie zmieniono `dish.totalData`; nadal pochodzi z `parse_dish`.
* Dodano status źródła składników w karcie dania.
* Dodano listę składników w karcie dania.
* `collectMissingFoods()` zbiera teraz braki z historii i z `customDishes`.
* Eksport braków zawiera także sekcję `customDishes`.
* Braki z dań mają opis `Moje danie` i nazwę dania.

## 5. Zmienione/dodane pliki

* `app.js` — lookup składników dań, render statusów, panel i eksport braków z dań.
* `style.css` — minimalne style źródła i składników w karcie dania.
* `ai_handoff/handoff_2026-07-03_custom-dish-ingredient-food-lookup.md` — ten handoff.

## 6. Decyzje techniczne

* Nie traktowano całego dania jako jednego produktu food-lookup.
* Food-lookup działa per składnik.
* Nie przeliczano `totalData` dania z bazy, bo etap dotyczy metadata i widoczności źródeł.
* Braki z dań nie dostają kalorii/makro pojedynczego składnika.
* Braki z dań nie pokazują przycisku `Usuń wpis z historii`, bo nie pochodzą z wpisu historii.

## 7. Testy i walidacja

Uruchomiono:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK
* `git diff -- db.js` — pusty diff

Nie wykonano ręcznego testu w przeglądarce ani requestu do API w ramach tej sesji.

## 8. Bezpieczeństwo

* Nie dodano sekretów.
* Nie użyto prywatnych kluczy.
* Nie wykonywano SQL.
* Nie deployowano Supabase.
* Nie robiono push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie ruszano `db.js`.

## 9. Git

* Git status przed etapem: clean, branch `ui-mobile-shell`, ahead of origin by 8 commits.
* Commit: planowany lokalny commit `Add food lookup metadata for custom dish ingredients`.
* Push: nie wykonano.

## 10. Ograniczenia i rzeczy niedokończone

* Stare dania zapisane przed tym etapem nie dostają automatycznie metadata składników.
* Nie zmieniono liczenia makro dań na bazę żywności.
* Nie zmieniono logiki odejmowania `remainingMassG`.

## 11. Następny najlepszy krok

Ręcznie przetestować danie `test papaja: jajka 120 g, papaja 100 g. Całość 220 g` i sprawdzić, czy papaja pojawia się w `Braki w bazie` jako składnik z `Moje danie`.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, Supabase ani cache. Ręcznie przetestuj food-lookup składników dań: utwórz `test papaja: jajka 120 g, papaja 100 g. Całość 220 g`, sprawdź w `Moje dania`, że jajka mają baza/proxy, papaja brak w bazie, a panel `Braki w bazie` pokazuje papaję jako brak z dania `test papaja`, bez przypisywania makro całego dania do papai.

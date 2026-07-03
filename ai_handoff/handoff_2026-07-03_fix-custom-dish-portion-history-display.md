# AI HANDOFF — Fix Custom Dish Portion History Display

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `e881500 Add create dish flow in My Dishes`
* Aktualny commit po etapie: do potwierdzenia po commicie `Fix custom dish portion history display`
* Data etapu: 2026-07-03

## 2. Cel etapu

Naprawić dwa problemy po ręcznym teście tworzenia dań: masa całkowita dania z jawnego tekstu miała być traktowana jako ważniejsza niż wynik AI, a porcja dania zapisana do historii nie mogła pokazywać technicznego UUID ani źródła nieznanego.

## 3. Aktualny stan projektu

Flow `Moje dania -> Utwórz danie` dalej używa `parse_dish` i zapisuje danie do `customDishes`. Porcja dania dodawana do historii zapisuje teraz czytelny opis i produkt z nazwą dania. Wpis porcji ma `dataSource.type = "custom_dish"` i badge `Danie własne`.

## 4. Co zostało zrobione

* Dodano `extractExplicitDishTotalMass(rawText)` dla prostych wzorców masy całości.
* `saveAiDish()` używa jawnej masy z tekstu jako ważniejszej niż `result.totalMassG`.
* Gdy jawna masa nadpisuje wynik AI, `per100gData` jest liczone ponownie z `totalData / totalMassG * 100`.
* `parseCustomDish()` też respektuje jawnie wykrytą masę całości.
* `addDishPortion()` zapisuje raw text jako `Porcja dania własnego: nazwa | X g`.
* `products[0].name` dla porcji dania to teraz `dish.name`, a techniczne id zostaje tylko w `dishId`.
* Wpis porcji dostaje `nutritionSource` i `dataSource` typu `custom_dish`.
* Historia obsługuje badge `Danie własne` i produktowy status `danie własne`.

## 5. Zmienione/dodane pliki

* `app.js` — parser jawnej masy całości, zapis porcji dania do historii, source label dla `custom_dish`.
* `style.css` — styl badge `Danie własne`.
* `ai_handoff/handoff_2026-07-03_fix-custom-dish-portion-history-display.md` — ten handoff.

## 6. Decyzje techniczne

* Nie zmieniano `db.js`, bo wszystkie nowe pola są opcjonalne w istniejącym modelu wpisów.
* Techniczne `dish.id` jest zachowane jako `dishId`, ale nie jest używane jako nazwa produktu w historii.
* Nie zmieniano logiki food-lookup ani braków w bazie dla składników dań.
* Porcjowanie nadal liczy `portionG / dish.totalMassG * dish.totalData`.

## 7. Testy i walidacja

Uruchomiono:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK
* `git diff -- db.js` — pusty diff

Nie wykonano ręcznego testu w przeglądarce ani requestu do AI Parsera.

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

* Git status przed etapem: clean, branch `ui-mobile-shell`, ahead of origin by 7 commits.
* Commit: planowany lokalny commit `Fix custom dish portion history display`.
* Push: nie wykonano.

## 10. Ograniczenia i rzeczy niedokończone

* Stare wpisy porcji dań zapisane z UUID nie są migrowane.
* Nie dodano food-lookup metadata dla składników dań.
* Nie zmieniono odejmowania `remainingMassG` po dodaniu porcji.

## 11. Następny najlepszy krok

Ręcznie utworzyć `gulasz` z masą `1200 g`, dodać porcję `100 g` i sprawdzić historię oraz panel `Braki w bazie`.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, Supabase ani cache. Ręcznie przetestuj flow `Moje dania`: utwórz `gulasz: wołowina 600 g, cebula 200 g, oliwa 20 g, pomidory 400 g. Całość po ugotowaniu 1200 g`, sprawdź że `totalMassG = 1200`, dodaj porcję `100 g`, sprawdź że historia pokazuje `gulasz — 100 g`, badge `Danie własne`, a panel `Braki w bazie` nie dostaje fałszywego UUID.

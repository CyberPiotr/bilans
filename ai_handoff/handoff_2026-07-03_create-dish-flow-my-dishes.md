# AI HANDOFF — Create Dish Flow My Dishes

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `ac049cb Add delete history entry action from missing foods panel`
* Aktualny commit po etapie: do potwierdzenia po commicie `Add create dish flow in My Dishes`
* Data etapu: 2026-07-03

## 2. Cel etapu

Dodać osobny flow tworzenia dania w widoku `Moje dania`, żeby opis przepisu był wysyłany do AI Parsera z `action: "parse_dish"` i zapisywany jako danie do porcjowania, bez dodawania wpisu do historii posiłków.

## 3. Aktualny stan projektu

Widok `Moje dania` ma własny panel `Utwórz danie do porcjowania` z textarea i przyciskiem AI. Główny composer posiłków nadal używa `parse_meal`. Porcjowanie dań nadal liczy porcję według `portionG / dish.totalMassG * dish.totalData`.

## 4. Co zostało zrobione

* Dodano osobny composer w sekcji `data-view="dishes"`.
* Uogólniono `requestAiParse(input, action)`, żeby obsługiwał `parse_meal` i `parse_dish`.
* Dodano handler `handleDishAiCreate()`, który wywołuje `parse_dish`.
* Zapis AI dania używa istniejącego `window.ketoDb.saveCustomDish()`.
* Dodano pola `initialMassG`, `remainingMassG`, `usedMassG`, `source` i `dataSource` dla dań tworzonych przez AI.
* Dodano bezpieczny komunikat, gdy nie ma masy całkowitej dania.
* Nie dodano wpisu do historii posiłków w tym flow.

## 5. Zmienione/dodane pliki

* `index.html` — panel tworzenia dania w widoku `Moje dania`.
* `app.js` — obsługa `parse_dish`, zapis dania i DOM refs.
* `style.css` — minimalne style panelu tworzenia dania.
* `ai_handoff/handoff_2026-07-03_create-dish-flow-my-dishes.md` — ten handoff.

## 6. Decyzje techniczne

* Nie podłączano food-lookup do dań w tym etapie; backend `parse_dish` zwraca `totalData` i `per100gData`.
* Nie zmieniano `db.js`, bo model dań przyjmuje dodatkowe opcjonalne pola bez migracji.
* `per100gData` może być wyliczone deterministycznie z `totalData / totalMassG * 100`, jeśli backend go nie zwróci.
* Brak masy całkowitej blokuje zapis dania.

## 7. Testy i walidacja

Uruchomiono:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK
* `git diff -- db.js` — pusty diff

Nie wykonano ręcznego testu w przeglądarce ani requestu do AI Parsera, żeby nie używać płatnego API bez potrzeby.

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

* Git status przed etapem: clean, branch `ui-mobile-shell`, ahead of origin by 6 commits.
* Commit: planowany lokalny commit `Add create dish flow in My Dishes`.
* Push: nie wykonano.

## 10. Ograniczenia i rzeczy niedokończone

* Brak food-lookup per składnik dla dań w tym etapie.
* Brak mieszania danych baza + AI per składnik dla przepisów.
* Nie zmieniano odejmowania `remainingMassG` przy porcjowaniu.
* Ręczny test AI trzeba wykonać w aplikacji.

## 11. Następny najlepszy krok

Ręcznie przetestować w widoku `Moje dania` opis: `gulasz: wołowina 600 g, cebula 200 g, oliwa 20 g, pomidory 400 g. Całość po ugotowaniu 1200 g`.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, Supabase ani cache. Ręcznie przetestuj flow `Moje dania`: wpisz `gulasz: wołowina 600 g, cebula 200 g, oliwa 20 g, pomidory 400 g. Całość po ugotowaniu 1200 g`, kliknij przycisk AI w widoku `Moje dania`, sprawdź że danie zapisuje się w `Moje dania`, nie pojawia się w historii jako posiłek, a porcja 350 g liczy się z `dish.totalData` przez `350 / 1200`.

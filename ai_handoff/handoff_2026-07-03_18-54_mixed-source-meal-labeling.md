# AI HANDOFF — Mixed Source Meal Labeling

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `648f503 Fix missing foods filtering and dismissal`
* Aktualny commit po etapie: do potwierdzenia po commicie `Improve mixed source meal labeling and missing food actions`
* Data etapu: 2026-07-03 18:54 +02:00

## 2. Cel etapu

Poprawić prezentację wpisów mieszanych, gdzie część składników ma `food-lookup matched/proxy`, a część ma `not_found`, bez zmiany liczenia kalorii/makro.

## 3. Aktualny stan projektu

Wpis mieszany nie jest już oznaczany jako czysty `AI fallback — brak w bazie`. Dostaje typ `mixed_food_database_ai_fallback`, label `Źródło: częściowo z bazy + AI fallback` i badge `Baza + brak`. Liczby całego wpisu nadal pochodzą z fallbacku AI, bo aplikacja nie ma wiarygodnych nutrientów AI per brakujący składnik.

## 4. Co zostało zrobione

* Dodano obsługę `mixed_food_database_ai_fallback` w `getEntryDataSource()`.
* W `resolveMealWithFoodLookup()` dodano wykrycie `matched + not_found`.
* Dla wpisu mieszanego zachowano `parsedData: fallbackParsedData`.
* Dodano komunikat zapisu `baza: częściowo, fallback AI dla całości`.
* Dodano badge CSS `.source-badge.mixed`.
* W panelu braków dodano przycisk `Usuń z listy`.
* `Usuń z listy` i `Oznacz jako obsłużone` robią tę samą bezpieczną akcję: ukrywają brak w `localStorage`, nie ruszają historii ani IndexedDB.

## 5. Zmienione/dodane pliki

* `app.js` — typ źródła mieszanego, label/badge, dodatkowy przycisk usuwania z listy.
* `style.css` — styl badge `Baza + brak`.
* `ai_handoff/handoff_2026-07-03_18-54_mixed-source-meal-labeling.md` — ten handoff.

## 6. Decyzje techniczne

* Nie mieszano danych z bazy i AI per składnik.
* Nie wymyślano nutrientów dla papai ani innych brakujących produktów.
* Nie zmieniano `food-lookup`, AI Parsera, `Moje dania`, IndexedDB ani `db.js`.
* Makro całego wpisu nie jest przypisywane do brakującego składnika.

## 7. Testy i walidacja

Uruchomiono:

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `git diff --check`
* `git diff -- db.js`

Wynik:

* Składnia JS: OK.
* `git diff --check`: OK; tylko standardowe ostrzeżenia Windows LF -> CRLF.
* `db.js`: brak zmian.

## 8. Bezpieczeństwo

* Nie dodano sekretów.
* Nie wykonano SQL.
* Nie deployowano Supabase.
* Nie robiono push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie ruszano repo `Baza danych VT` / `bazavt`.

## 9. Git

* Git status przed etapem: clean, branch ahead 3.
* Commit: do wykonania.
* Commit message: `Improve mixed source meal labeling and missing food actions`
* Push: NIE wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Brak mieszanego liczenia baza + AI per składnik.
* Brak nutrientów AI per pojedynczy brakujący produkt.
* Wymagany test ręczny w przeglądarce.

## 11. Następny najlepszy krok

Ręcznie sprawdzić wpis `jajka 120 g i papaja 100 g`: historia ma pokazać badge `Baza + brak`, produkty mają zachować per-product statusy, a panel braków ma pokazywać tylko papaję.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, Supabase ani IndexedDB. Ręcznie przetestuj wpis `jajka 120 g i papaja 100 g`: sprawdź badge historii `Baza + brak`, szczegóły produktów, panel `Braki w bazie`, eksport i przyciski `Oznacz jako obsłużone` / `Usuń z listy`.

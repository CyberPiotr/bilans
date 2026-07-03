# AI HANDOFF — Fix Missing Foods Panel Filtering And Delete

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `012dc56 Add per-product food lookup metadata`
* Aktualny commit po etapie: do potwierdzenia po lokalnym commicie `Fix missing foods filtering and dismissal`
* Data etapu: 2026-07-03 18:44 +02:00

## 2. Cel etapu

Naprawić panel `Braki w bazie`, żeby dla wpisu mieszanego typu `jajka 120 g i papaja 100 g` pokazywał tylko realnie brakujący składnik `papaja`, a nie wszystkie produkty z wpisu fallbackowego. Dodać też lokalne ukrywanie/oznaczanie braków jako obsłużone.

## 3. Aktualny stan projektu

Obliczenia posiłków, `food-lookup`, AI Parser, `Moje dania`, historia wpisów i `db.js` nie zostały zmienione. Zmiana dotyczy wyłącznie agregacji panelu braków, eksportu braków i minimalnego UI w panelu `Braki w bazie`.

## 4. Co zostało zrobione

* Dodano stabilny klucz brakującego produktu przez `getMissingFoodKey(product, entry)`.
* Dodano localStorage key `vitatrack_hidden_missing_foods_v1`.
* Dodano odczyt/zapis ukrytych braków:
  * `readHiddenMissingFoodKeys()`
  * `writeHiddenMissingFoodKeys(keys)`
* `collectMissingFoods()` najpierw używa metadanych per produkt:
  * `product.lookupStatus === "not_found"`
  * albo `product.dataSourceType === "ai_fallback_missing"`
* `collectMissingFoods()` nie traktuje wszystkich produktów wpisu jako brakujące tylko dlatego, że cały wpis ma `dataSource.type = "ai_fallback_missing"`.
* Fallback całego wpisu działa tylko dla starszych wpisów bez per-product metadata.
* Panel pomija ukryte/obsłużone braki.
* Eksport JSON używa tylko aktywnych braków i pomija ukryte.
* Sekcja `entries` w eksporcie zawiera tylko aktywne brakujące produkty, nie wszystkie produkty wpisu.
* Usunięto z panelu makro fallbacku AI dla pojedynczego składnika.
* Zamiast makro panel pokazuje notatkę: wartości AI dotyczą całego wpisu, nie pojedynczego składnika.
* Dodano przycisk `Oznacz jako obsłużone` przy każdym braku.
* Dodano przycisk `Wyczyść ukryte braki` w panelu.

## 5. Zmienione/dodane pliki

* `app.js` — poprawione filtrowanie braków, localStorage dismissal, eksport aktywnych braków, usunięcie makro całego wpisu z karty składnika.
* `index.html` — dodany przycisk `Wyczyść ukryte braki` w panelu.
* `style.css` — minimalne style przycisków i notatki panelu.
* `ai_handoff/handoff_fix_missing_foods_panel_filtering_and_delete.md` — ten handoff.

## 6. Decyzje techniczne

* Nie usuwamy wpisu z historii.
* Nie zmieniamy IndexedDB.
* Ukrywanie jest lokalne dla przeglądarki i zapisane w `localStorage`.
* Eksport domyślnie pokazuje tylko aktywne, nieukryte braki.
* Nie dodano widoku ukrytych, bo prostsze i bezpieczniejsze jest `Wyczyść ukryte braki`, które przywraca ukryte pozycje do panelu.
* Nie pokazujemy makro przy brakującym składniku, bo obecnie fallback AI jest liczony dla całego wpisu.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `git diff --check`
* `git diff -- db.js`
* `rg -n "SERVICE_ROLE|service_role|SUPABASE_SERVICE_ROLE|sk-[A-Za-z0-9]|OPENAI_API_KEY" app.js index.html style.css ai_handoff .env.example`

Wynik:

* Składnia JS: OK.
* `git diff --check`: OK; tylko standardowe ostrzeżenia Windows o LF -> CRLF.
* `db.js`: brak zmian.
* Skan sekretów nie znalazł nowych sekretów; trafienia były w starych handoffach jako tekst komend/nazw zmiennych.
* `package.json` nie ma skryptów testowych/lintera.

## 8. Bezpieczeństwo

* Nie dodano sekretów.
* Nie użyto prywatnych API keys.
* Nie użyto płatnego API.
* Nie wykonano SQL.
* Nie zmieniano Supabase.
* Nie deployowano.
* Nie robiono push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie ruszano `db.js`.
* Nie ruszano repo `Baza danych VT` / `bazavt`.

## 9. Git

* Git status przed zmianami: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 2]`, working tree czysty.
* Czy wykonano commit: do wykonania po walidacji.
* Komunikat commita: `Fix missing foods filtering and dismissal`
* Hash commita: do potwierdzenia po commicie.
* Git status po commicie: do potwierdzenia po commicie.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie wykonano ręcznego testu w przeglądarce.
* Ukrywanie braków jest lokalne dla jednej przeglądarki, nie synchronizuje się między urządzeniami.
* Starsze wpisy bez per-product metadata nadal mogą używać fallbacku całego wpisu, bo nie ma danych składnikowych.
* Eksport nie zawiera nutrientów per brakujący składnik, bo aplikacja ich jeszcze nie liczy.

## 11. Następny najlepszy krok

Ręcznie dodać `jajka 120 g i papaja 100 g`, sprawdzić historię, panel `Braki w bazie`, eksport JSON i ukrywanie papai.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, IndexedDB, Supabase, SQL ani repo `Baza danych VT`. Uruchom aplikację lokalnie i ręcznie sprawdź: `jajka 120 g i papaja 100 g`; w historii jajka mają być baza/proxy, papaja brak w bazie; w panelu `Braki w bazie` ma być tylko papaja; eksport JSON ma zawierać papaję, nie jajka; po kliknięciu `Oznacz jako obsłużone` papaja znika z panelu i eksportu, a historia zostaje bez zmian.

# AI HANDOFF — Mixed Badges And Dismissal Scope

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `df9c5a7 Improve mixed source meal labeling and missing food actions`
* Aktualny commit po etapie: do potwierdzenia po commicie `Improve mixed meal badges and missing food dismissal scope`
* Data etapu: 2026-07-03 19:02 +02:00

## 2. Cel etapu

Naprawić zakres ukrywania braków w panelu `Braki w bazie`, żeby ukrycie papai z jednego wpisu nie ukrywało papai z przyszłych wpisów, oraz poprawić widoczność badge’a wpisu mieszanego w historii.

## 3. Aktualny stan projektu

Ukrywanie braków jest teraz per konkretny wpis. Klucz ukrycia zawiera identyfikator wpisu (`entry.id`, fallback `createdAt`, fallback `date|rawText`) oraz nazwę/gramaturę produktu. Wpis mieszany ma w historii dwie pille: `Baza/proxy` i `Brak: 1+`.

## 4. Co zostało zrobione

* Zmieniono `getMissingFoodKey(product, entry)`.
* Klucz ukrycia zawiera teraz tożsamość wpisu.
* Render historii dla `mixed_food_database_ai_fallback` pokazuje dwie pille zamiast jednego badge’a `Baza + brak`.
* Dodano CSS `.source-badge-group`.

## 5. Zmienione/dodane pliki

* `app.js` — per-entry missing food key i render dwóch badge’y dla wpisu mieszanego.
* `style.css` — styl grupy badge’y.
* `ai_handoff/handoff_2026-07-03_19-02_mixed-badges-dismissal-scope.md` — ten handoff.

## 6. Decyzje techniczne

* Nie zmieniano kalorii/makro.
* Nie mieszano liczenia baza + AI per składnik.
* Nie zmieniano `food-lookup`, AI Parsera, Supabase, `db.js`, IndexedDB ani cache.
* Stare globalnie ukryte klucze nie będą już ukrywać nowych wpisów, bo nowe klucze mają zakres wpisu.

## 7. Testy i walidacja

Uruchomiono:

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `git diff --check`
* `git diff -- db.js`

Wynik:

* Wszystkie checki OK.
* `db.js` bez zmian.

## 8. Bezpieczeństwo

* Nie dodano sekretów.
* Nie wykonano SQL.
* Nie deployowano Supabase.
* Nie robiono push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie ruszano repo `Baza danych VT` / `bazavt`.

## 9. Git

* Commit: do wykonania.
* Commit message: `Improve mixed meal badges and missing food dismissal scope`
* Push: NIE wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie wykonano ręcznego testu w przeglądarce.
* Ukrywanie pozostaje lokalne w `localStorage`.

## 11. Następny najlepszy krok

Ręcznie sprawdzić sekwencję: wyczyść ukryte braki, dodaj `jajka 120 g i papaja 100 g`, ukryj papaję, dodaj ten sam wpis ponownie i potwierdź, że nowa papaja wraca jako aktywny brak.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, Supabase ani IndexedDB. Ręcznie przetestuj zakres ukrywania braków: kliknij `Wyczyść ukryte braki`, dodaj `jajka 120 g i papaja 100 g`, sprawdź badge historii i panel braków, ukryj papaję, dodaj ten sam wpis ponownie i potwierdź, że nowa papaja pojawia się jako aktywny brak.

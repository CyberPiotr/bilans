# AI HANDOFF — fix unsafe missing food delete actions

## 1. Projekt

* Nazwa projektu: Dieta / VitaTrack
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `6d82681 Polish custom dish source badges and delete actions`
* Aktualny commit po etapie: commit `Fix unsafe missing food delete actions`; finalny hash sprawdź przez `git log -1 --oneline`
* Data etapu: 2026-07-04

## 2. Cel etapu

Zaudytować i naprawić destrukcyjne akcje w panelu „Braki w bazie”, zwłaszcza dla braków pochodzących z „Moje dania”, żeby UI nie sugerował kasowania wszystkich danych aplikacji.

## 3. Aktualny stan projektu

Panel „Braki w bazie” nie renderuje przycisku „Usuń dane”. Dla każdego braku pokazuje jedną akcję ukrywania: „Ukryj brak”. Dla zwykłych braków z historii nadal może pokazać „Usuń wpis z historii”. Dla braków pochodzących z dania własnego, tylko gdy istnieje pewne `dishId`, pokazuje „Usuń przepis”. Usunięcie przepisu usuwa wyłącznie wskazane zapisane danie własne i zostawia historię posiłków bez zmian.

## 4. Co zostało zrobione

* Usunięto podwójne akcje ukrywania „Oznacz jako obsłużone” i „Usuń z listy” z pojedynczego wiersza braku.
* Zastąpiono je jedną akcją „Ukryj brak”.
* Zmieniono „Usuń danie” na jednoznaczne „Usuń przepis”.
* Rozdzielono event delegation na konkretne selektory:
  * `data-hide-missing-food`
  * `data-delete-history-entry-from-missing`
  * `data-delete-custom-dish-from-missing`
* Zmieniono funkcję usuwania z panelu braków na `deleteCustomDishFromMissing`.
* Przed usunięciem przepisu sprawdzany jest pewny `dishId` i istnienie przepisu w `customDishes`.
* Confirm dla przepisu pokazuje nazwę: `Usunąć przepis: [nazwa]? Tej akcji nie można cofnąć. Historia posiłków zostanie bez zmian.`

## 5. Zmienione/dodane pliki

* `app.js` — etykiety akcji, dataset selectors, handler usuwania przepisu z panelu braków.
* `ai_handoff/handoff_2026-07-04_fix-unsafe-missing-food-delete-actions.md` — ten handoff.

## 6. Decyzje techniczne

* Nie zmieniano kalorii, makro, food lookup, parse_dish, Supabase ani `db.js`.
* Nie dodawano żadnego globalnego resetu ani czyszczenia bazy.
* `Ukryj brak` nadal używa istniejącego mechanizmu ukrytych kluczy w localStorage, ale nie wywołuje `localStorage.clear()`.
* `Usuń przepis` używa `window.ketoDb.deleteCustomDish(id)` tylko dla konkretnego przepisu.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK, tylko ostrzeżenie Git o przyszłej zamianie LF na CRLF w `app.js`
* `git diff -- db.js` — pusty wynik
* `rg -n "Usuń dane|Usun dane|clear|deleteDatabase|localStorage\\.clear|indexedDB\\.deleteDatabase|reset" app.js index.html style.css config.js service-worker.js db.js` — nie znaleziono `Usuń dane`, `deleteDatabase`, `localStorage.clear`, `indexedDB.deleteDatabase`; trafienia `clear/reset` dotyczą czyszczenia pola, resetu licznika kosztów, resetu ustawień i czyszczenia listy ukrytych braków.
* `rg -n "data-dismiss-missing-food|data-delete-missing-entry-id|data-delete-missing-dish-id|data-hide-missing-food|data-delete-history-entry-from-missing|data-delete-custom-dish-from-missing|Usuń danie|Usuń przepis|Ukryj brak" app.js index.html style.css` — zostały tylko nowe konkretne akcje panelu braków.

Nie wykonano ręcznego testu UI z prawdziwym food lookup/API. Wykonano 0 rund napraw po walidacji, bo komendy przeszły.

## 8. Bezpieczeństwo

* Sprawdzono sekrety: nie dodano żadnych sekretów.
* Użyto API keys: nie.
* Użyto internetu: nie.
* Użyto płatnego API: nie.
* Ruszano produkcyjne dane: nie.
* Robiono deploy: nie.
* Robiono push: nie.
* Czyszczono IndexedDB/cache: nie.
* Użyto `localStorage.clear()`: nie.
* Użyto `indexedDB.deleteDatabase()`: nie.
* Ruszano `db.js`: nie.

## 9. Git

* git status przed commitem: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 12]`, zmodyfikowany `app.js`, dodany handoff.
* Czy wykonano commit: tak po walidacji.
* Komunikat commita: `Fix unsafe missing food delete actions`
* Hash commita: finalny hash sprawdź przez `git log -1 --oneline`; nie jest wpisany literalnie, bo zmieniłby hash commita zawierającego ten plik.
* git status po commicie: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 13]`
* Czy branch jest przed origin/main: branch jest przed `origin/ui-mobile-shell`; przed etapem był ahead 12, po etapie ahead 13.
* Czy push NIE został wykonany: push nie został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Ręczny test przeglądarkowy z utworzeniem „Sałatki testowej” nadal trzeba wykonać lokalnie.
* Ten etap nie zmienia treści globalnego przycisku „Wyczyść ukryte braki”, bo jest on poza pojedynczym wierszem braku i nie czyści danych aplikacji.

## 11. Następny najlepszy krok

Ręcznie przejść scenariusz z papają w „Braki w bazie” i potwierdzić, że „Ukryj brak” ukrywa tylko brak, a „Usuń przepis” usuwa tylko wskazany przepis.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta` na branchu `ui-mobile-shell`. Sprawdź `git status` i `git log --oneline -5`. Nie rób push, deploy, nie używaj Supabase ani API keys. Wykonaj ręczny test: utwórz „Sałatka testowa: jajka 120 g, oliwa 10 g, truskawki 150 g, papaja 100 g. Całość 380 g”, wejdź w „Braki w bazie”, sprawdź, że przy papai z dania są tylko „Ukryj brak” i „Usuń przepis”, bez „Usuń dane”. Kliknij „Ukryj brak” i potwierdź, że danie oraz historia zostają. Wyczyść ukryte braki, kliknij „Usuń przepis”, sprawdź confirm z nazwą przepisu i potwierdź, że znika tylko ten przepis, a historia i inne dane zostają. Jeśli znajdziesz problem wyłącznie w UI/handlerach panelu braków, napraw lokalnie, uruchom `node --check app.js`, `node --check config.js`, `node --check service-worker.js`, `git diff --check`, `git diff -- db.js`, zapisz jeden handoff i zrób lokalny commit.

# AI HANDOFF — remove recipe delete from missing foods

## 1. Projekt

* Nazwa projektu: Dieta / VitaTrack
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `416f2f9 Fix unsafe missing food delete actions`
* Aktualny commit po etapie: commit `Remove recipe deletion from missing foods panel`; finalny hash sprawdź przez `git log -1 --oneline`
* Data etapu: 2026-07-04

## 2. Cel etapu

Usunąć z panelu „Braki w bazie” akcję usuwania całego przepisu. Panel braków ma zarządzać widocznością brakujących produktów, a nie kasowaniem dań własnych.

## 3. Aktualny stan projektu

W panelu „Braki w bazie” każdy aktywny brak pokazuje „Ukryj brak” i „Usuń z listy”. Obie akcje używają tego samego mechanizmu ukrywania konkretnego klucza braku w localStorage. Przepisy nadal można usuwać tylko w widoku „Moje dania”, na karcie przepisu.

## 4. Co zostało zrobione

* Usunięto przycisk „Usuń przepis” z renderu wiersza braku.
* Dodano przycisk „Usuń z listy” obok „Ukryj brak”.
* Oba przyciski ustawiają `data-hide-missing-food` na konkretny klucz braku.
* Usunięto funkcję `deleteCustomDishFromMissing`.
* Usunięto event delegation dla `data-delete-custom-dish-from-missing`.
* Pozostawiono „Usuń wpis z historii” tylko dla braków pochodzących z historii, bez zmian w jego dotychczasowym działaniu.

## 5. Zmienione/dodane pliki

* `app.js` — akcje panelu braków i usunięcie ścieżki kasowania przepisu z panelu.
* `ai_handoff/handoff_2026-07-04_remove-recipe-delete-from-missing-foods.md` — ten handoff.

## 6. Decyzje techniczne

* „Usuń z listy” nie usuwa składnika z przepisu, bo to wymagałoby przeliczenia `totalMassG`, `totalData`, `per100gData`, `remainingMassG` i porcji.
* „Usuń z listy” oznacza tylko: nie pokazuj już tego konkretnego braku w aktywnej liście.
* Nie zmieniano kalorii, makro, food lookup, parse_dish, Supabase ani `db.js`.
* Nie dodano żadnego czyszczenia IndexedDB ani cache.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK, tylko ostrzeżenie Git o przyszłej zamianie LF na CRLF w `app.js`
* `git diff -- db.js` — pusty wynik
* `rg -n "delete-custom-dish-from-missing|deleteCustomDishFromMissing|delete dish from missing|Usuń przepis|Usuń dane|Usun dane|Usuń z listy|Ukryj brak" app.js index.html style.css` — zostały tylko „Ukryj brak” i „Usuń z listy”; stare destrukcyjne ścieżki nie występują.

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

* git status przed commitem: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 13]`, zmodyfikowany `app.js`, dodany handoff.
* Czy wykonano commit: tak po walidacji.
* Komunikat commita: `Remove recipe deletion from missing foods panel`
* Hash commita: finalny hash sprawdź przez `git log -1 --oneline`; nie jest wpisany literalnie, bo zmieniłby hash commita zawierającego ten plik.
* git status po commicie: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 14]`
* Czy branch jest przed origin/main: branch jest przed `origin/ui-mobile-shell`; przed etapem był ahead 13, po etapie ahead 14.
* Czy push NIE został wykonany: push nie został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Ręczny test przeglądarkowy z daniem `papaja 100 ogorek 400` nadal trzeba wykonać lokalnie.
* Ten etap nie usuwa pojedynczych składników z przepisu i nie przelicza dań.

## 11. Następny najlepszy krok

Ręcznie przejść scenariusz z papają i ogórkiem w „Braki w bazie”, sprawdzając, że „Usuń z listy” ukrywa tylko wybrany brak, a „Wyczyść ukryte braki” przywraca go na listę.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta` na branchu `ui-mobile-shell`. Sprawdź `git status` i `git log --oneline -5`. Nie rób push, deploy, nie używaj Supabase ani API keys. Wykonaj ręczny test: utwórz „papaja 100 ogorek 400: papaja 100 g, ogorek 400 g. Całość 500 g”, wejdź w „Braki w bazie”, sprawdź, że przy papai i ogórku są „Ukryj brak” oraz „Usuń z listy”, bez „Usuń przepis” i bez „Usuń dane”. Kliknij „Usuń z listy” przy papai i potwierdź, że papaja znika, ogórek zostaje, przepis nadal jest w „Moje dania”, historia zostaje. Kliknij „Wyczyść ukryte braki” i potwierdź, że papaja wraca. Jeśli znajdziesz problem tylko w panelu braków, napraw lokalnie, uruchom `node --check app.js`, `node --check config.js`, `node --check service-worker.js`, `git diff --check`, `git diff -- db.js`, zapisz jeden handoff i zrób lokalny commit.

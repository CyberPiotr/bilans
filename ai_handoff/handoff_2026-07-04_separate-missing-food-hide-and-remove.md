# AI HANDOFF — separate missing food hide and remove

## 1. Projekt

* Nazwa projektu: Dieta / VitaTrack
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `b98baf5 Remove recipe deletion from missing foods panel`
* Aktualny commit po etapie: commit `Separate temporary and permanent missing food removal`; finalny hash sprawdź przez `git log -1 --oneline`
* Data etapu: 2026-07-04

## 2. Cel etapu

Rozdzielić znaczenie akcji „Ukryj brak” i „Usuń z listy” w panelu „Braki w bazie”. Ukrycie ma być odwracalne przez „Wyczyść ukryte braki”, a usunięcie z listy ma być trwałe dla panelu braków.

## 3. Aktualny stan projektu

Panel „Braki w bazie” pokazuje przy każdym braku „Ukryj brak” oraz „Usuń z listy”. „Ukryj brak” zapisuje klucz w `vitatrack_hidden_missing_foods_v1`. „Usuń z listy” po confirmie zapisuje klucz w `vitatrack_removed_missing_foods_v1`. `collectMissingFoods()` zawsze pomija removed keys, także przy liczeniu ukrytych braków. „Wyczyść ukryte braki” czyści tylko hidden keys i nie przywraca removed keys.

## 4. Co zostało zrobione

* Dodano `REMOVED_MISSING_FOODS_KEY = "vitatrack_removed_missing_foods_v1"`.
* Dodano `readRemovedMissingFoodKeys()` i `writeRemovedMissingFoodKeys()`.
* `collectMissingFoods()` pomija braki z removed list dla wpisów historii i dań własnych.
* „Usuń z listy” ma osobny `data-remove-missing-food` i klasę `button danger`.
* Dodano `removeMissingFood(key)` z confirmem:
  `Trwale usunąć ten brak z listy? Nie usunie to przepisu ani historii, ale brak nie wróci po wyczyszczeniu ukrytych.`
* `removeMissingFood()` dodaje klucz do removed list, usuwa go z hidden list jeśli tam był, renderuje panel i nie rusza danych aplikacji.
* Event delegation panelu braków rozdziela `data-hide-missing-food` i `data-remove-missing-food`.

## 5. Zmienione/dodane pliki

* `app.js` — osobny mechanizm permanent removed missing foods i handler „Usuń z listy”.
* `ai_handoff/handoff_2026-07-04_separate-missing-food-hide-and-remove.md` — ten handoff.

## 6. Decyzje techniczne

* Removed list jest osobnym localStorage key, żeby „Wyczyść ukryte braki” nie przywracało trwale usuniętych braków.
* Nie dodano UI do czyszczenia removed list, zgodnie z zakresem etapu.
* Nie usuwano przepisu, historii ani pojedynczego składnika z przepisu.
* Nie zmieniano kalorii, makro, food lookup, parse_dish, Supabase ani `db.js`.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK, tylko ostrzeżenie Git o przyszłej zamianie LF na CRLF w `app.js`
* `git diff -- db.js` — pusty wynik
* `rg -n "Usuń dane|Usuń przepis|clearData|localStorage\\.clear|indexedDB\\.deleteDatabase|reset app|delete-custom-dish-from-missing|deleteCustomDishFromMissing" app.js index.html style.css config.js service-worker.js db.js` — brak wyników.

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

* git status przed commitem: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 14]`, zmodyfikowany `app.js`, dodany handoff.
* Czy wykonano commit: tak po walidacji.
* Komunikat commita: `Separate temporary and permanent missing food removal`
* Hash commita: finalny hash sprawdź przez `git log -1 --oneline`; nie jest wpisany literalnie, bo zmieniłby hash commita zawierającego ten plik.
* git status po commicie: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 15]`
* Czy branch jest przed origin/main: branch jest przed `origin/ui-mobile-shell`; przed etapem był ahead 14, po etapie ahead 15.
* Czy push NIE został wykonany: push nie został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Ręczny test przeglądarkowy z daniem `papaja 100 ogorek 400` nadal trzeba wykonać lokalnie.
* Brak UI do cofania trwałego removed list; to celowo poza zakresem tego etapu.

## 11. Następny najlepszy krok

Ręcznie sprawdzić, że „Ukryj brak” wraca po „Wyczyść ukryte braki”, a „Usuń z listy” nie wraca po wyczyszczeniu ukrytych.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta` na branchu `ui-mobile-shell`. Sprawdź `git status` i `git log --oneline -5`. Nie rób push, deploy, nie używaj Supabase ani API keys. Wykonaj ręczny test: utwórz „papaja 100 ogorek 400: papaja 100 g, ogorek 400 g. Całość 500 g”, wejdź w „Braki w bazie”, kliknij „Ukryj brak” przy papai i potwierdź, że papaja wraca po „Wyczyść ukryte braki”. Następnie kliknij „Usuń z listy” przy papai, potwierdź confirm, sprawdź że papaja znika, ogórek zostaje, przepis i historia zostają, a papaja nie wraca po „Wyczyść ukryte braki”. Jeśli znajdziesz problem tylko w panelu braków, napraw lokalnie, uruchom `node --check app.js`, `node --check config.js`, `node --check service-worker.js`, `git diff --check`, `git diff -- db.js`, zapisz jeden handoff i zrób lokalny commit.

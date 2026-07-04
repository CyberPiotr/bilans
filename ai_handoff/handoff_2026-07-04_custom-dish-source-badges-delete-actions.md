# AI HANDOFF — custom dish source badges and delete actions

## 1. Projekt

* Nazwa projektu: Dieta / VitaTrack
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `90b3f9a Improve custom dish data source badges`
* Aktualny commit po etapie: commit `Polish custom dish source badges and delete actions`; finalny hash sprawdź przez `git log -1 --oneline`
* Data etapu: 2026-07-04

## 2. Cel etapu

Poprawić wyłącznie prezentację statusów źródeł danych dla zapisanych dań własnych i dodać trwałą akcję usunięcia całego dania z panelu „Braki w bazie” dla braków pochodzących z „Moje dania”.

## 3. Aktualny stan projektu

Repo było czyste na starcie. Aplikacja nadal liczy porcje dań własnych tak jak wcześniej. Widok „Moje dania” nie pokazuje już tekstowego statusu „Jakość danych: baza + brak” jako głównej prezentacji jakości, tylko grupę kolorowych pigułek. Historia porcji dania własnego ma bardziej widoczny niebieski badge „Danie własne” oraz podsumowanie źródeł składników w szczegółach. Panel „Braki w bazie” zachowuje dotychczasowe akcje i dodatkowo pokazuje „Usuń danie” dla braków z zapisanych dań.

## 4. Co zostało zrobione

* Dodano helpery budujące liczniki i pigułki źródeł składników: baza, proxy, brak, błąd.
* W karcie „Moje dania” zastąpiono tekst jakości danych grupą badge’y, np. `Baza`, `Proxy`, `Brak: 1`.
* Przy składnikach dania pozostawiono per-składnikowe pigułki źródeł danych.
* W historii porcji dania własnego badge „Danie własne” jest niebieski i czytelniejszy.
* W szczegółach historii porcji dodano sekcję „Źródła składników:” z pigułkami podsumowania.
* Przy dodaniu porcji dania do historii zapisywane jest tylko małe podsumowanie źródeł składników, bez zmiany makro.
* W panelu „Braki w bazie” dla braków z dania dodano akcję „Usuń danie”.
* Akcja „Usuń danie” usuwa zapisane danie własne przez istniejące `window.ketoDb.deleteCustomDish(id)` i odświeża widoki.

## 5. Zmienione/dodane pliki

* `app.js` — renderowanie badge’y, podsumowanie źródeł składników w historii, handler usuwania dania z panelu braków.
* `style.css` — niebieski badge „Danie własne”, układ pigułek źródeł i zawijanie akcji panelu braków.
* `ai_handoff/handoff_2026-07-04_custom-dish-source-badges-delete-actions.md` — ten handoff.

## 6. Decyzje techniczne

* Nie zmieniano food lookup, `parse_dish`, `db.js`, Supabase ani liczenia kalorii/makro.
* Dla istniejących wpisów historii bez dokładnych liczników zastosowano fallback z dotychczasowego agregatu `ingredientSource`.
* Dla nowych porcji dania zapisuje się `ingredientSourceSummary`, żeby historia mogła pokazać dokładne pigułki bez przechowywania pełnej listy składników w produkcie porcji.
* Nie dodano usuwania pojedynczego składnika dania, bo wymagałoby przeliczenia przepisu. Trwała akcja usuwa całe danie.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK, tylko ostrzeżenia Git o przyszłej zamianie LF na CRLF w `app.js` i `style.css`
* `git diff -- db.js` — pusty wynik
* `rg -n "(sk-|service_role|anon key|SUPABASE_SERVICE|api[_-]?key|password|secret)" app.js style.css ai_handoff config.js service-worker.js .env.example` — brak nowych sekretów; jedyny trafiony wpis w kodzie to istniejący nagłówek `apikey: publishableKey`

Nie wykonano ręcznego testu z prawdziwym food lookup/API, żeby nie używać zewnętrznych kluczy ani płatnych API. Wykonano 0 rund napraw po testach, bo walidacja przeszła.

## 8. Bezpieczeństwo

* Sprawdzono sekrety: tak, prosty skan tekstowy.
* Użyto API keys: nie.
* Użyto internetu: nie.
* Użyto płatnego API: nie.
* Ruszano produkcyjne dane: nie.
* Robiono deploy: nie.
* Robiono push: nie.
* Czyszczono IndexedDB/cache: nie.
* Ruszano `db.js`: nie.

## 9. Git

* git status przed commitem: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 11]`, zmodyfikowane `app.js`, `style.css`, dodany handoff.
* Czy wykonano commit: tak
* Komunikat commita: `Polish custom dish source badges and delete actions`
* Hash commita: finalny hash sprawdź przez `git log -1 --oneline`; nie jest wpisany literalnie, bo zmieniłby hash commita zawierającego ten plik.
* git status po commicie: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 12]`
* Czy branch jest przed origin/main: branch jest przed `origin/ui-mobile-shell`; przed etapem był ahead 11, po etapie ahead 12.
* Czy push NIE został wykonany: push nie został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie wykonano ręcznego testu UI z realnym przepływem food lookup.
* Starsze wpisy historii porcji dania mogą pokazać podsumowanie fallbackowe z agregatu, a nie dokładne liczniki, jeśli nie mają `ingredientSourceSummary`.
* Akcja „Usuń danie” nie usuwa wpisów historii porcji tego dania, zgodnie z wymaganiem, że historia innych wpisów zostaje bez zmian.

## 11. Następny najlepszy krok

Ręcznie przejść scenariusz z „Sałatką testową” w przeglądarce i potwierdzić, że badge’e oraz usunięcie dania z panelu braków działają end-to-end.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta` na branchu `ui-mobile-shell`. Sprawdź `git status` i `git log --oneline -5`. Nie rób push, deploy, nie używaj Supabase ani API keys. Zweryfikuj ręcznie przepływ: utwórz danie „Sałatka testowa: jajka 120 g, oliwa 10 g, truskawki 150 g, papaja 100 g. Całość 380 g”, sprawdź badge’e w „Moje dania”, dodaj porcję 100 g do historii, sprawdź badge „Danie własne” i „Źródła składników”, a potem w panelu „Braki w bazie” kliknij „Usuń danie” i potwierdź, że danie oraz brak znikają, a historia innych wpisów zostaje bez zmian. Jeśli znajdziesz problem tylko w prezentacji UI, napraw go lokalnie, uruchom `node --check app.js`, `node --check config.js`, `node --check service-worker.js`, `git diff --check`, `git diff -- db.js`, zapisz jeden handoff i zrób lokalny commit.

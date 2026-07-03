# AI HANDOFF — Custom Dish Data Source Badges

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `eb47b84 Add current UI context map`
* Aktualny commit po etapie: do potwierdzenia po commicie `Improve custom dish data source badges`
* Data etapu: 2026-07-03

## 2. Cel etapu

Ujednolicic prezentacje statusow jakosci danych dla dań własnych, składników dań oraz porcji dania zapisanej w historii, bez zmiany liczenia, food-lookup, Supabase, `db.js`, IndexedDB ani cache.

## 3. Aktualny stan projektu

Karty `Moje dania` pokazują teraz czytelny status `Jakość danych: ...` oraz kolorowe badge przy każdym składniku. Porcje dania w historii nadal mają główny badge `Danie własne`, ale w szczegółach pokazują też informację o źródłach składników, np. `Danie własne · Źródła składników: baza + brak`.

## 4. Co zostało zrobione

* Zmieniono tekst statusu dania ze `Składniki: ...` na `Jakość danych: ...`.
* Dodano wspólny helper `getProductSourceBadgeInfo()`.
* Dodano renderowanie kolorowych badge składników przez `appendProductSourceBadge()`.
* Składniki w `Moje dania` i produkty w szczegółach historii pokazują badge, np. `Baza`, `Baza proxy`, `Brak w bazie`.
* Porcja dania zapisywana do historii zachowuje `ingredientSource`, żeby szczegóły wpisu mogły pokazać jakość składników dania.
* Nie zmieniono działań `Oznacz jako obsłużone` i `Usuń z listy`; są nadal dostępne dla braków z dań i ukrywają brak lokalnie.

## 5. Zmienione/dodane pliki

* `app.js` — helpery statusów, badge składników, dodatkowa informacja `ingredientSource` dla porcji dania.
* `style.css` — style `.ingredient-source-badge`.
* `ai_handoff/handoff_2026-07-03_custom-dish-data-source-badges.md` — ten handoff.

## 6. Decyzje techniczne

* Nie zmieniano logiki kalorii ani makro.
* Nie zmieniano food-lookup ani `totalData`.
* Nie przypisywano makro całego dania do brakującego składnika.
* Historia porcji zachowuje główny badge `Danie własne`; źródła składników są tylko informacją dodatkową w szczegółach.

## 7. Testy i walidacja

Uruchomiono:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `git diff --check` — OK
* `git diff -- db.js` — pusty diff

Nie wykonano ręcznego testu w przeglądarce.

## 8. Bezpieczeństwo

* Nie dodano sekretów.
* Nie wykonywano SQL.
* Nie deployowano Supabase.
* Nie robiono push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie ruszano `db.js`.

## 9. Git

* Git status przed etapem: clean, branch `ui-mobile-shell`, ahead of origin by 10 commits.
* Commit: planowany lokalny commit `Improve custom dish data source badges`.
* Push: nie wykonano.

## 10. Ograniczenia i rzeczy niedokończone

* Stare wpisy porcji dania bez `ingredientSource` nie dostaną automatycznie dodatkowej informacji w historii.
* Statusy są poprawione wizualnie, ale nie wykonano pełnego redesignu kart.
* Panel braków nadal ukrywa braki lokalnie przez `localStorage`.

## 11. Następny najlepszy krok

Ręcznie utworzyć `Sałatka testowa: jajka 120 g, oliwa 10 g, truskawki 150 g, papaja 100 g. Całość 380 g` i sprawdzić badge składników, panel braków oraz historię porcji.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, Supabase ani cache. Ręcznie przetestuj UI badge dla dań własnych: utwórz `Sałatka testowa: jajka 120 g, oliwa 10 g, truskawki 150 g, papaja 100 g. Całość 380 g`, sprawdź kolorowe badge składników w `Moje dania`, panel `Braki w bazie` dla papai oraz historię porcji 100 g z badge `Danie własne` i informacją o źródłach składników.

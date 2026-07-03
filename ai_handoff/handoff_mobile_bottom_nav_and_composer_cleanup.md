# AI HANDOFF — Mobile Bottom Nav And Composer Cleanup

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `68a9278 Improve source badges and missing foods panel`
* Aktualny commit po etapie: do potwierdzenia po lokalnym commicie `Refine mobile composer and bottom navigation`
* Data etapu: 2026-07-03 18:12 +02:00

## 2. Cel etapu

Etap dotyczył wyłącznie mobile shell/UI: uproszczenia dolnego composera, przeniesienia kalendarza do headera, dodania dolnej nawigacji mobilnej i podniesienia głównej karty bilansu wyżej.

## 3. Aktualny stan projektu

Aplikacja zachowuje istniejący przepływ AI Parser -> food-lookup -> fallback AI -> zapis lokalny. Nie zmieniano liczenia kalorii, mapowania nutrientów, historii danych, importu/eksportu JSON, IndexedDB ani `db.js`.

## 4. Co zostało zrobione

* Usunięto z domyślnego composera tekstowe przyciski `Policz AI` i `Gem`.
* Domyślny composer ma teraz jeden przycisk wysyłania z inline SVG.
* Kliknięcie nowego przycisku wysyłania nadal uruchamia tę samą akcję co wcześniejsze `Policz AI`.
* Placeholder skrócono do `jajka 120 g...`.
* Kalendarz przeniesiono z dolnego composera do prawej części górnego paska.
* Dodano dolną nawigację: `Historia`, `Menu`, `Dania`, `Dodaj`.
* Dolny przycisk `Menu` otwiera istniejące boczne menu.
* Dolny przycisk `Dodaj` wraca do Startu i ustawia fokus w polu wpisywania.
* Dolna nawigacja i stopka `Zaprojektowane przez CyberPiotr` zostają widoczne także poza Startem; ukrywa się tylko część inputowa composera.
* Hamburger w headerze został wizualnie zmniejszony i mniej wyeksponowany, ale pozostał jako wejście awaryjne do menu.
* Główna karta bilansu została podniesiona wyżej i skrócona bez przebudowy widoku.
* Podbito wersję aplikacji/cache do `vitatrack-mobile-shell-v29`.

## 5. Zmienione/dodane pliki

* `index.html` — przeniesienie kalendarza do headera, uproszczenie composera, dolna nawigacja.
* `style.css` — lżejszy mobile shell, style dolnej nawigacji, mniejsze odstępy startu, podniesiona karta bilansu.
* `app.js` — obsługa dolnego menu i dolnego Dodaj, zachowanie ikony przy ładowaniu AI, pokazywanie przycisku `Zapisz` tylko w trybie edycji.
* `config.js` — wersja `vitatrack-mobile-shell-v29`.
* `service-worker.js` — cache `vitatrack-mobile-shell-v29`.
* `ai_handoff/handoff_mobile_bottom_nav_and_composer_cleanup.md` — ten handoff.

## 6. Decyzje techniczne

* Nie usunięto kodu starego zapisu `Gem`, bo ten sam mechanizm jest potrzebny w trybie edycji wpisów/dań; przycisk jest ukryty domyślnie i pokazuje się jako `Zapisz` tylko w edycji.
* Dolna nawigacja jest częścią dolnego shella, ale input jest osobną sekcją `.composer-input-area`, dzięki czemu można ukrywać input poza Startem bez chowania nawigacji i stopki.
* Użyto wyłącznie inline SVG, bez bibliotek ikon i bez pobierania assetów z internetu.
* Nie zmieniano eventów ani funkcji liczących posiłek.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `git diff --check`
* `git diff -- db.js`
* PowerShell check duplikatów `id` w `index.html`
* `rg -n "SERVICE_ROLE|service_role|SUPABASE_SERVICE_ROLE|sk-[A-Za-z0-9]|OPENAI_API_KEY" app.js index.html style.css config.js service-worker.js ai_handoff .env.example`

Wynik:

* Składnia JS: OK.
* `git diff --check`: OK; tylko standardowe ostrzeżenia Windows o LF -> CRLF.
* `db.js`: brak zmian.
* Duplikaty `id` w `index.html`: brak.
* `package.json` nie ma skryptów testowych/lintera.
* Skan sekretów nie wykazał prywatnych kluczy; trafienia dotyczyły wyłącznie nazw zmiennych w poprzednim handoffie.

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

* Git status przed zmianami: `## ui-mobile-shell...origin/ui-mobile-shell`, working tree czysty.
* Czy wykonano commit: do wykonania po walidacji.
* Komunikat commita: `Refine mobile composer and bottom navigation`
* Hash commita: do potwierdzenia po commicie.
* Git status po commicie: do potwierdzenia po commicie.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie wykonywano ręcznego testu w przeglądarce z prawdziwym klikaniem AI.
* Nie dodano obsługi Enter, bo w aktualnym kodzie nie było istniejącej obsługi Enter do zachowania.
* Dolny przycisk `Dania` pokazuje tekst skrócony do `Dania`, ale aria-label pozostaje `Moje dania`.
* Tryb edycji nadal pokazuje dodatkowy przycisk `Zapisz`, żeby nie usuwać istniejącej bezpiecznej ścieżki edycji.

## 11. Następny najlepszy krok

Uruchomić aplikację lokalnie na widoku mobile i ręcznie sprawdzić przepływ: `jajka 120 g` -> wysyłka ikoną -> Historia -> Menu -> Dania -> Dodaj -> kalendarz w headerze.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, IndexedDB, Supabase, SQL ani repo `Baza danych VT`. Zweryfikuj ręcznie etap mobile shell: uruchom aplikację lokalnie, sprawdź widok telefonu, dodaj `jajka 120 g` przez nowy przycisk wysyłania, przejdź dolną nawigacją do Historii, otwórz Menu, przejdź do Moje dania, wróć przez Dodaj i sprawdź kalendarz w headerze. Jeśli UI wymaga korekty, popraw minimalnie bez zmiany logiki AI/food-lookup/historii.

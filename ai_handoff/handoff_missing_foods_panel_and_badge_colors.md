# AI HANDOFF — Missing Foods Panel And Badge Colors

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `3b4c824 Add visible source badges and missing foods export`
* Aktualny commit po etapie: do potwierdzenia po lokalnym commicie `Improve source badges and missing foods panel`
* Data etapu: 2026-07-03 17:56 +02:00

## 2. Cel etapu

Poprawić czytelność badge'y źródła danych w historii oraz dodać widoczny panel "Braki w bazie", żeby produkty obsłużone przez AI fallback po `food-lookup not_found` były łatwe do znalezienia i wyeksportowania.

## 3. Aktualny stan projektu

Aplikacja nadal używa istniejącego flow PWA -> Supabase -> OpenAI -> `food-lookup` -> zapis lokalny. Ten etap nie zmienia liczenia kalorii, makro ani zapisu w IndexedDB. Dodano tylko warstwę UI i eksportu dla braków w bazie.

## 4. Co zostało zrobione

* W historii wpisów badge `Baza proxy` dostał wyraźny żółto-pomarańczowy styl i tekst `! Baza proxy`.
* W historii wpisów badge `Brak w bazie` dostał wyraźny czerwony styl i tekst `! Brak w bazie`.
* Badge błędu bazy/AI dostał ciemny ostrzegawczy styl i tekst z `!`.
* Dodano osobny widok menu `Braki w bazie`.
* Widok agreguje wpisy z historii, gdzie `dataSource.type === "ai_fallback_missing"`.
* Widok pokazuje nazwę produktu, gramaturę, ostatnią datę użycia, liczbę wystąpień i wartości AI fallback: kcal, białko, tłuszcz, węgle.
* Przycisk `Eksportuj braki w bazie` jest widoczny w panelu `Braki w bazie`.
* Eksport `vitatrack-missing-foods.json` używa tej samej agregacji co panel i nadal zawiera szczegóły wpisów do ręcznego przeglądu.
* Podbito wersję aplikacji i cache do `vitatrack-missing-foods-panel-v28`.

## 5. Zmienione/dodane pliki

* `index.html` — dodany przycisk menu i widok `Braki w bazie`.
* `app.js` — dodana agregacja braków z historii, render panelu, rozszerzony eksport oraz mocniejsze teksty badge'y.
* `style.css` — poprawione style badge'y i dodane style panelu braków.
* `config.js` — podbita wersja aplikacji i opis ostatniej zmiany.
* `service-worker.js` — podbita wersja cache.
* `ai_handoff/handoff_missing_foods_panel_and_badge_colors.md` — ten handoff.

## 6. Decyzje techniczne

* Nie dodano osobnej bazy ani kolejki braków; lista jest wyliczana z istniejącej historii.
* Eksport braków jest oparty na tej samej funkcji agregującej co UI, żeby wynik panelu i JSON były spójne.
* Znaczenie badge'y nie zależy wyłącznie od koloru: badge ma jawny tekst i ostrzegawczy znak `!` dla proxy, braków i błędów.
* Nie zmieniano realnego liczenia `food-lookup matched`, AI fallback ani zapisu wpisu.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `git diff --check`
* `git diff -- db.js`
* `rg -n "SERVICE_ROLE|service_role|SUPABASE_SERVICE_ROLE|sk-[A-Za-z0-9]|OPENAI_API_KEY" app.js index.html style.css config.js service-worker.js ai_handoff supabase .env.example`

Wynik:

* Składnia JS: OK.
* `git diff --check`: OK; tylko standardowe ostrzeżenia Windows o LF -> CRLF.
* `db.js`: brak zmian.
* `package.json` nie ma skryptów testowych/lintera, więc nie uruchamiano `npm test`.
* Skan sekretów nie wykazał prywatnych kluczy; znaleziono tylko tekstowe odniesienia do `OPENAI_API_KEY` w kodzie Supabase Edge Function i README.
* Nie wykonano rund napraw po testach poza poprawką kodowania nowo dodanych tekstów w `index.html`.

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

* Git status przed zmianami: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 1]`, working tree czysty.
* Czy wykonano commit: do wykonania po walidacji.
* Komunikat commita: `Improve source badges and missing foods panel`
* Hash commita: do potwierdzenia po commicie.
* Git status po commicie: do potwierdzenia po commicie.
* Branch był przed origin o 1 commit przed tym etapem.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Panel pokazuje braki z historii, nie jest osobną kolejką ani tabelą.
* Agregacja grupuje po nazwie produktu i gramaturze z wpisu.
* Jeśli AI Parser zwróci kilka produktów w jednym wpisie oznaczonym jako `ai_fallback_missing`, wszystkie produkty z tego wpisu są widoczne jako kandydaci do uzupełnienia.
* Nie weryfikowano ręcznie w przeglądarce, bo etap był walidowany statycznie.
* Nie zmieniano backendu `food-lookup`.

## 11. Następny najlepszy krok

Uruchomić aplikację lokalnie, dodać `jajka 120 g` i `papaja 100 g` przez `Policz AI`, sprawdzić badge'e w historii oraz eksport JSON z panelu `Braki w bazie`.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, IndexedDB, Supabase, SQL ani repo `Baza danych VT`. Sprawdź ręcznie etap `Braki w bazie`: uruchom lokalną aplikację, dodaj `jajka 120 g` i `papaja 100 g` przez `Policz AI`, potwierdź kolory badge'y w historii, obecność papai w panelu `Braki w bazie` oraz zawartość eksportu `vitatrack-missing-foods.json`. Jeśli coś nie działa, napraw minimalnie bez zmiany flow liczenia i zapisu danych.

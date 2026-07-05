# AI HANDOFF — PWA bottom safe area and splash fix v01

## 1. Projekt

* Nazwa projektu: Dieta / Cyber Zdrowie
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `eb013f5 Polish gauges and chat input UX`
* Aktualny commit po etapie: lokalny commit `Fix PWA bottom safe area and splash behavior`; hash w finalnej odpowiedzi i `git log`
* Data etapu: 2026-07-05

## 2. Cel etapu

Naprawić PWA mobile UX po teście na telefonie: biały pasek/gap przy bottom nav oraz podwójny splash screen.

## 3. Aktualny stan projektu

Bottom nav ma spójne tło z fixed composer shellem i dochodzi do dolnej krawędzi viewportu. Aplikacja wyłącza custom splash, gdy działa jako installed PWA/standalone, zostawiając systemowy splash generowany przez browser na podstawie manifestu.

## 4. Co zostało zrobione

* Dodano wczesny skrypt standalone w `<head>`.
* Dodano klasę `pwa-standalone` na `<html>` dla installed PWA.
* Ukryto `.app-splash` w standalone przez CSS.
* Ustawiono light `theme-color` na `#f7f2ea`.
* Ujednolicono `html/body` na `100% / 100svh / 100dvh`.
* Dodano spójne tło fixed `.composer-shell` i `.bottom-nav`.
* Zachowano `env(safe-area-inset-bottom)` dla bottom nav, menu i Home segmentu.
* Podbito wersję app/cache do `vitatrack-mobile-shell-v35`.

## 5. Zmienione/dodane pliki

* `index.html` - wczesny standalone detector i light theme-color.
* `app.js` - runtime light theme-color w `applyTheme()`.
* `style.css` - safe-area/root height/bottom nav background/custom splash hide.
* `config.js` - wersja `vitatrack-mobile-shell-v35`.
* `service-worker.js` - cache `vitatrack-mobile-shell-v35`.
* `reports/pwa_bottom_safe_area_and_splash_fix_v01.md` - raport etapu.
* `ai_handoff/handoff_2026-07-05_pwa-bottom-safe-area-and-splash-fix-v01.md` - ten handoff.

## 6. Decyzje techniczne

* Nie usuwano custom splash z HTML, bo ma pozostać dla zwykłego uruchomienia w przeglądarce.
* Installed PWA nie może pozbyć się systemowego splash z poziomu runtime; można tylko dopasować manifest/theme-color i nie dokładać drugiego custom splash.
* Nie zmieniano manifestu, bo `background_color`, `theme_color` i ikony były już prawidłowo ustawione.
* Safe-area została obsłużona przez CSS, bez magicznych marginesów i bez zmian danych.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js` - OK
* `node --check config.js` - OK
* `node --check service-worker.js` - OK
* `git diff --check` - OK; tylko ostrzeżenia LF/CRLF
* `git diff -- db.js` - OK, brak diffu
* `rg -n "OPENAI_API_KEY|sk-|service_role|localStorage\.clear|indexedDB\.deleteDatabase|clearData|deleteDatabase" app.js index.html style.css config.js service-worker.js manifest.json` - brak trafień

Lokalny browser check:

* viewport 390x844;
* `navBottom = 844`;
* `shellBottom = 844`;
* `bodyBg = rgb(247, 242, 234)`;
* `themeColor = #f7f2ea`;
* zwykła przeglądarka: custom splash nadal widoczny, bo standalone false.

## 8. Bezpieczeństwo

* Sekrety: nie dodano.
* API keys: nie używano.
* Internet: nie używano.
* Płatne API: nie używano.
* Produkcyjne dane: nie ruszano.
* Deploy: nie wykonywano.
* Push: nie wykonywano.
* IndexedDB/cache: nie czyszczono.
* Supabase: nie zmieniano.
* `db.js`: nietknięty.

## 9. Git

* Git status przed commitem: branch `ui-mobile-shell`, zmodyfikowane `app.js`, `config.js`, `index.html`, `style.css`, `service-worker.js`; wcześniejsze untracked audytu nutrientów poza zakresem.
* Czy wykonano commit: tak, lokalny commit po walidacji.
* Komunikat commita: `Fix PWA bottom safe area and splash behavior`
* Hash commita: w finalnej odpowiedzi i `git log`, bo hash nie może stabilnie znajdować się wewnątrz pliku będącego częścią commita.
* Git status po commicie: do sprawdzenia po commicie; oczekiwane zostają wcześniejsze untracked audytu nutrientów.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Realny biały pasek trzeba sprawdzić na Android PWA, bo desktop preview nie emuluje systemowego paska Androida.
* Nie da się całkowicie usunąć systemowego splash installed PWA z kodu aplikacji.
* Custom splash jest wyłączony tylko dla wykrytego standalone/PWA.

## 11. Następny najlepszy krok

Po pushu sprawdzić na telefonie: start PWA i dolną nawigację na ekranach Home/Czat/Dania.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta`, branch `ui-mobile-shell`. Ostatni etap: `Fix PWA bottom safe area and splash behavior`. Nie pushuj, nie deployuj, nie czyść IndexedDB/cache, nie ruszaj `db.js`, backendu, Supabase, parsera AI, food-lookup, nutrientów, czatu ani gauge. Sprawdź po telefonicznym teście PWA, czy biały pasek pod bottom nav zniknął i czy nie ma drugiego custom splash. Jeśli problem nadal występuje, popraw tylko CSS/PWA shell/manifest-theme, uruchom walidację, przygotuj raport i handoff.

# AI HANDOFF — Shared sync code MVP v01

## 1. Projekt

* Nazwa projektu: VitaTrack / Cyber Zdrowie / Dieta
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `60fe853 Fix PWA menu layering and light icon polish`
* Aktualny commit po etapie: do sprawdzenia po commicie
* Data etapu: 2026-07-05

## 2. Cel etapu

Dodać szybkie MVP synchronizacji przez wspólny kod, np. `PIOTR-ANIA`, żeby dwa urządzenia mogły współdzielić wpisy posiłków i Moje dania bez pełnego systemu kont. Etap miał przygotować SQL i Edge Function, dodać minimalne UI oraz podpiąć bezpieczne push/pull bez czyszczenia IndexedDB i bez zmian w `db.js`.

## 3. Aktualny stan projektu

Frontend ma kartę `Synchronizacja` w `Ustawienia / Wygląd` oraz skrót w menu. Kod synchronizacji i device id są trzymane lokalnie w `localStorage`. Po lokalnym zapisie wpisu lub dania aplikacja robi best-effort push do `cloud-sync`; błąd chmury nie cofa lokalnego zapisu. Manualny przycisk `Synchronizuj teraz` wysyła wszystkie lokalne wpisy i dania, a następnie pobiera payloady z chmury i importuje je przez istniejące funkcje bez duplikacji po `id`.

SQL migration i Edge Function są przygotowane, ale nie wykonane i nie wdrożone.

## 4. Co zostało zrobione

* Zmapowano lokalny zapis: `entries`, `customDishes`, `settings` w IndexedDB przez `db.js`.
* Dodano `cloudSyncFunctionUrl` w `config.js`.
* Dodano UI Synchronizacji w `index.html`.
* Dodano style karty sync w `style.css`.
* Dodano frontendowe helpery sync w `app.js`.
* Podpięto best-effort push po zapisaniu wpisu i dania.
* Dodano manualny `syncNow`, który robi push i pull.
* Dodano migrację `database/migrations/20260705_shared_sync_code_mvp.sql`.
* Dodano Edge Function `supabase/functions/cloud-sync/index.ts`.
* Dodano konfigurację `supabase/config.toml` dla `cloud-sync`.
* Podbito cache/app version do `vitatrack-mobile-shell-v38`.
* Przygotowano raport `reports/shared_sync_code_mvp_v01.md`.

## 5. Zmienione/dodane pliki

* `app.js` - frontend sync code, localStorage keys, request do Edge Function, import bez duplikacji, best-effort push po zapisie.
* `index.html` - karta `Synchronizacja` i skrót menu.
* `style.css` - style karty i inputu sync.
* `config.js` - `cloudSyncFunctionUrl`, app version `v38`.
* `service-worker.js` - cache name `vitatrack-mobile-shell-v38`.
* `database/migrations/20260705_shared_sync_code_mvp.sql` - przygotowana migracja tabel sync z RLS i bez publicznych policy.
* `supabase/functions/cloud-sync/index.ts` - przygotowana Edge Function.
* `supabase/config.toml` - `[functions.cloud-sync] verify_jwt = false`.
* `reports/shared_sync_code_mvp_v01.md` - raport etapu.
* `ai_handoff/handoff_2026-07-05_shared-sync-code-mvp-v01.md` - ten handoff.

## 6. Decyzje techniczne

* Nie zmieniano `db.js`; pull używa `importEntries` i `importCustomDishes`, które pomijają duplikaty po `id`.
* `entry.id` i `dish.id` są używane jako `local_id` w tabelach sync.
* Kod sync jest przechowywany lokalnie jako MVP, ale w bazie zapisywany jest tylko hash z pepperem.
* Edge Function używa server-side env `SYNC_CODE_PEPPER` i server-side service role key.
* Frontend nie zna peppera ani service role key.
* Manualny sync pobiera pełny zestaw z chmury, nie delta po `since`, żeby pierwsze połączenie nowego urządzenia nie pominęło starszych danych drugiej osoby.
* Serwer robi upsert last-write-wins po `(sync_space_id, local_id)`, ale lokalny import nie nadpisuje istniejących rekordów, żeby nie ryzykować destrukcji danych.

## 7. Testy i walidacja

Wykonano przed raportem:

* `node --check app.js` - OK.
* `node --check config.js` - OK.
* `node --check service-worker.js` - OK.

Ograniczenia checku Edge Function:

* `deno --version` - niedostępne lokalnie.
* `tsc` - niedostępny lokalnie.
* `node_modules\.bin\supabase.cmd functions --help` - zablokowane przez próbę zapisu telemetry poza workspace (`EPERM`), nie wykonywano deployu ani serve.

Po zapisaniu plików wykonano:

* `git diff --check` - OK; tylko ostrzeżenia Git o przyszłej zamianie LF na CRLF.
* `git diff -- db.js` - pusty.
* Skan sekretów w zmienianych plikach: brak wartości sekretów. Trafienia dotyczą tylko nazwy env `SUPABASE_SERVICE_ROLE_KEY` w Edge Function i dokumentacji.
* Skan frontendowy `SUPABASE_SERVICE_ROLE_KEY` w `app.js`, `config.js`, `index.html`, `service-worker.js`, `style.css` - brak trafień.
* Skan destrukcyjnych operacji `localStorage.clear`, `indexedDB.deleteDatabase`, `deleteDatabase`, `clearData` - brak trafień.

## 8. Bezpieczeństwo

* Nie użyto API keys.
* Nie użyto płatnego API.
* Nie użyto internetu.
* Nie wykonano SQL.
* Nie wykonano deployu.
* Nie wykonano push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie zmieniano backendu żywności, food-lookup, AI Parsera, nutrientów ani hybrydowego merge.
* `db.js` nie był edytowany.
* W repo nie dodano wartości sekretów.
* Nazwa env `SUPABASE_SERVICE_ROLE_KEY` występuje tylko w Edge Function jako odczyt server-side secretu, bez wartości sekretu.

## 9. Git

* Git status przed commitem: zmodyfikowane frontend/config/supabase config oraz nowe migration/function/report/handoff; stare niepowiązane untracked pliki audytu lokalnego nadal poza zakresem.
* Czy wykonano commit: do uzupełnienia po commicie.
* Komunikat commita: `Add shared sync code MVP`
* Hash commita: do uzupełnienia po commicie.
* Git status po commicie: do uzupełnienia po commicie.
* Czy branch jest przed origin/main: branch `ui-mobile-shell`; status względem `origin/ui-mobile-shell` do sprawdzenia po commicie.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Edge Function nie była deployowana.
* SQL migration nie była wykonywana.
* Brak pełnego lokalnego TypeScript/Deno checku funkcji.
* Brak hard delete sync.
* Brak lokalnego nadpisywania istniejących rekordów przy pull.
* Brak pełnych kont, ról, zaproszeń, rotacji kodów i audytu.
* Bezpieczeństwo zależy od tajności kodu sync i peppera.

## 11. Następny najlepszy krok

Ręcznie przejrzeć i wykonać migrację w Supabase, ustawić `SYNC_CODE_PEPPER` oraz server-side service role secret dla Edge Function, wdrożyć `cloud-sync`, a potem przetestować dwa urządzenia z tym samym kodem.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta`, branch `ui-mobile-shell`. Ostatni etap dodał MVP shared sync code: raport `reports/shared_sync_code_mvp_v01.md`, migracja `database/migrations/20260705_shared_sync_code_mvp.sql`, Edge Function `supabase/functions/cloud-sync/index.ts`, UI Synchronizacja w `Ustawienia / Wygląd`. Nie pushuj, nie deployuj bez zgody, nie wykonuj SQL automatycznie, nie czyść IndexedDB/cache, nie dodawaj sekretów do repo, nie ruszaj `db.js`, food-lookup, AI Parsera, nutrientów ani hybrid merge. Najpierw sprawdź `git status --short --branch` i `git log --oneline -8`, przeczytaj raport, potem ręcznie przejrzyj SQL/Edge Function pod kątem Supabase i przygotuj instrukcję ręcznego deployu/testu dwóch urządzeń albo popraw tylko błędy walidacji, jeśli są.

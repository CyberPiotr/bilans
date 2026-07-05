# AI HANDOFF — Cloud sync 500 diagnostics fix v01

## 1. Projekt

* Nazwa projektu: VitaTrack / Cyber Zdrowie / Dieta
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `0338784 Add shared sync code MVP`
* Aktualny commit po etapie: do uzupełnienia po commicie
* Data etapu: 2026-07-05

## 2. Cel etapu

Naprawić zbyt ogólną diagnostykę błędu 500 w Supabase Edge Function `cloud-sync`. Funkcja była osiągalna, CORS/preflight działał, ale POST zwracał tylko `Cloud sync failed`, bez realnego powodu awarii.

## 3. Aktualny stan projektu

`cloud-sync` ma teraz bezpieczne kody błędów, `detail`, logi serwerowe bez sekretów i akcję `health`. Frontendowy `[Cyber Zdrowie Sync Debug]` potrafi pokazać `error_code` i `detail` z response. `db.js`, logika żywieniowa, AI Parser, food-lookup, nutrienty i hybrid merge nie były ruszane.

## 4. Co zostało zrobione

* Dodano `CloudSyncError` w `supabase/functions/cloud-sync/index.ts`.
* Dodano `error_code` i bezpieczny `detail` do response błędów.
* Dodano stage-aware obsługę błędów: env, setup, upsert entries, upsert dishes, pull, DB health.
* Dodano `console.error("[Cyber Zdrowie Sync Debug]", ...)` z action, error_code, message, stack, entries_count, dishes_count.
* Dodano akcję `health`, która nie wymaga `sync_code`.
* Dodano walidację payloadu entries/dishes i `id/local_id`.
* Zaktualizowano frontendowy debug sync w `app.js`.
* Podbito app/cache version do `vitatrack-mobile-shell-v39`.
* Dodano raport `reports/cloud_sync_500_diagnostics_fix_v01.md`.

## 5. Zmienione/dodane pliki

* `supabase/functions/cloud-sync/index.ts` - diagnostyka, health, error_code, walidacja payloadu.
* `app.js` - frontendowy sync debug pokazuje `error_code` i `detail`, UI dopisuje kod błędu.
* `config.js` - app version/change label `v39`.
* `service-worker.js` - cache name `v39`.
* `reports/cloud_sync_500_diagnostics_fix_v01.md` - raport etapu.
* `ai_handoff/handoff_2026-07-05_cloud-sync-500-diagnostics-fix-v01.md` - ten handoff.

## 6. Decyzje techniczne

* Nie logowano `sync_code`, service role key, peppera ani pełnego payloadu wpisów/dań.
* `health` nie wymaga `sync_code`, żeby dało się diagnozować env i dostęp do tabel zanim użytkownik poda kod.
* `SUPABASE_SERVICE_ROLE_KEY` jest jedyną obsługiwaną nazwą server-side secretu; funkcja nie zgaduje alternatywnych nazw.
* Brak `id/local_id` w payloadzie jest teraz `invalid_payload`, zamiast cichego pomijania rekordu.
* Upsert nadal używa `onConflict: "sync_space_id,local_id"`, zgodnie z migracją.

## 7. Testy i walidacja

Wykonano:

* `node --check app.js` - OK.
* `node --check config.js` - OK.
* `node --check service-worker.js` - OK.

Po zapisaniu plików wykonano:

* `git diff --check` - OK; tylko ostrzeżenia Git o przyszłej zamianie LF na CRLF.
* `git diff -- db.js` - pusty.
* Skan sekretów `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `service_role`, `sk-` - brak wartości sekretów. Trafienia dotyczą tylko nazw env / pola `service_role` w Edge Function, raporcie i handoffie.
* Skan frontendowy `SUPABASE_SERVICE_ROLE_KEY|service_role` w `app.js`, `config.js`, `index.html`, `service-worker.js`, `style.css` - brak trafień.
* Skan destrukcyjnych operacji `localStorage.clear`, `indexedDB.deleteDatabase`, `deleteDatabase`, `clearData` - brak trafień.

Ograniczenia:

* `deno` nie jest dostępne lokalnie.
* `tsc` nie jest dostępny lokalnie.
* Edge Function nie była deployowana ani uruchamiana lokalnie.

## 8. Bezpieczeństwo

* Nie użyto API keys.
* Nie użyto płatnego API.
* Nie wykonano SQL.
* Nie wykonano deployu.
* Nie wykonano push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* `db.js` nie był edytowany.
* Service role key nie trafił do frontendu.
* W repo występuje tylko nazwa env `SUPABASE_SERVICE_ROLE_KEY`, bez wartości sekretu.

## 9. Git

* Git status przed commitem: zmodyfikowane `cloud-sync`, `app.js`, `config.js`, `service-worker.js`; nowe raport/handoff; stare niepowiązane untracked pliki audytu lokalnego nadal poza zakresem.
* Czy wykonano commit: do uzupełnienia po commicie.
* Komunikat commita: `Add cloud sync diagnostics`
* Hash commita: do uzupełnienia po commicie.
* Git status po commicie: do uzupełnienia po commicie.
* Branch jest lokalnie przed `origin/ui-mobile-shell`.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Funkcję trzeba ręcznie zdeployować w Supabase.
* Health/setup trzeba przetestować na realnej Edge Function po deployu.
* Diagnostyka wskaże etap błędu, ale nie wykonuje automatycznej naprawy Supabase env/tabel.

## 11. Następny najlepszy krok

Ręcznie deployować `cloud-sync`, wywołać `{ "action": "health" }`, potem `{ "action": "setup", "sync_code": "...", "device_id": "manual-test" }` i sprawdzić `error_code` oraz logi Edge Function.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta`, branch `ui-mobile-shell`. Ostatni etap dodał diagnostykę 500 dla `supabase/functions/cloud-sync/index.ts`: error_code/detail, health action i frontendowy `[Cyber Zdrowie Sync Debug]`. Nie pushuj, nie deployuj bez zgody, nie wykonuj SQL automatycznie, nie czyść IndexedDB/cache, nie dodawaj sekretów do repo, nie ruszaj `db.js`, food-lookup, AI Parsera, nutrientów ani hybrid merge. Najpierw sprawdź `git status --short --branch` i `git log --oneline -8`, przeczytaj `reports/cloud_sync_500_diagnostics_fix_v01.md`, potem po ręcznym deployu sprawdź health/setup i zinterpretuj `error_code`.

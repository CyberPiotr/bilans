# Cloud sync 500 diagnostics fix v01

## Cel

Naprawić zbyt ogólną diagnostykę błędu 500 w Supabase Edge Function `cloud-sync`. Preflight/CORS działał, ale POST zwracał tylko:

```json
{ "ok": false, "error": "Cloud sync failed", "server_time": "..." }
```

To ukrywało realny etap awarii: env, setup `sync_spaces`, upsert wpisów, upsert dań, pull albo dostęp do tabel.

## Co powodowało zbyt ogólny response

Pierwsza wersja `cloud-sync` miała jeden końcowy `catch`, który nie klasyfikował błędów po etapie operacji. Błąd z Supabase JS albo walidacji payloadu wpadał do wspólnej odpowiedzi bez `error_code`, bez bezpiecznego `detail` i bez logu z licznikami danych.

## Co zmieniono w `cloud-sync`

Plik:

`supabase/functions/cloud-sync/index.ts`

Dodano:

- klasę `CloudSyncError`,
- bezpieczne `error_code`,
- bezpieczny `detail` bez sekretów,
- stage-aware wrapping dla setup/upsert/pull,
- logi `console.error("[Cyber Zdrowie Sync Debug]", ...)`,
- walidację JSON/action,
- walidację `entries`/`dishes` jako tablic,
- walidację `id` / `local_id` dla każdego payloadu,
- akcję `health`.

Logi błędów zawierają:

- `action`,
- `error_code`,
- `message`,
- `stack`,
- `entries_count`,
- `dishes_count`.

Logi nie zawierają:

- `sync_code`,
- service role key,
- peppera,
- pełnego payloadu posiłków lub dań.

## Dodane `error_code`

- `missing_env` - brakuje `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` albo `SYNC_CODE_PEPPER`.
- `invalid_payload` - request nie jest JSON, action jest błędna, brakuje `sync_code`, `entries`/`dishes` nie są tablicą albo element nie ma `id/local_id`.
- `setup_failed` - upsert/select `sync_spaces` nie działa albo nie zwrócił `id`.
- `upsert_entries_failed` - upsert do `sync_entries` nie działa.
- `upsert_dishes_failed` - upsert do `sync_dishes` nie działa.
- `pull_failed` - select z `sync_entries` albo `sync_dishes` nie działa.
- `db_error` - health nie może odczytać jednej z tabel.
- `unexpected_error` - nieoczekiwany błąd poza powyższymi kategoriami.

Response błędu ma teraz format:

```json
{
  "ok": false,
  "error": "Cloud sync failed",
  "error_code": "setup_failed",
  "detail": "sync_spaces upsert failed: ...",
  "server_time": "..."
}
```

## Health action

Request:

```json
{ "action": "health" }
```

`health` nie wymaga `sync_code`.

Sprawdza:

- czy `SYNC_CODE_PEPPER` istnieje,
- czy `SUPABASE_URL` istnieje,
- czy `SUPABASE_SERVICE_ROLE_KEY` istnieje,
- czy przez service role da się odczytać tabele `sync_spaces`, `sync_entries`, `sync_dishes`.

Response:

```json
{
  "ok": true,
  "checks": {
    "sync_code_pepper": true,
    "supabase_url": true,
    "service_role": true,
    "tables": true
  },
  "error_code": null,
  "server_time": "..."
}
```

Jeśli dalej jest błąd, `health` zwróci `ok: false` i `error_code`, bez sekretów.

## Frontend debug

Plik:

`app.js`

Frontend w `[Cyber Zdrowie Sync Debug]` pokazuje teraz:

- `error_code`,
- `detail`,
- action,
- entries/dishes count,
- server_time.

UI nadal pokazuje krótki błąd, ale dopisuje kod, np. `(setup_failed)`.

## Co trzeba ręcznie zrobić w Supabase

1. Wkleić/deployować zaktualizowaną funkcję:

`supabase/functions/cloud-sync/index.ts`

2. Upewnić się, że Edge Function ma ustawione sekrety:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SYNC_CODE_PEPPER`

3. Nie wklejać sekretów do frontendu ani repo.

4. Upewnić się, że `Verify JWT` dla `cloud-sync` pozostaje zgodnie z projektem OFF, jeśli frontend woła funkcję tylko przez anon/publishable key i cała autoryzacja MVP opiera się o kod sync.

## Test ręczny health

W konsoli lub Postmanie:

```bash
curl -i -X POST "https://bfugtsaxwzpumjmwfknf.supabase.co/functions/v1/cloud-sync" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"health\"}"
```

Oczekiwane:

- HTTP 200 przy pełnym sukcesie,
- `ok: true`,
- wszystkie `checks` jako `true`.

Jeśli HTTP 500:

- sprawdzić `error_code`,
- sprawdzić log Edge Function,
- przy `missing_env` ustawić brakującą zmienną,
- przy `db_error` sprawdzić migrację/tabele/RLS/service role.

## Test ręczny setup

```bash
curl -i -X POST "https://bfugtsaxwzpumjmwfknf.supabase.co/functions/v1/cloud-sync" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"setup\",\"sync_code\":\"PIOTR-ANIA\",\"device_id\":\"manual-test\"}"
```

Oczekiwane:

- `ok: true`,
- `sync_space_id`,
- `entries: []`,
- `dishes: []`,
- `server_time`.

Jeśli jest 500:

- `setup_failed` sugeruje problem z `sync_spaces`, RLS/service role albo kolumnami,
- `missing_env` sugeruje brak env,
- `invalid_payload` sugeruje problem w body.

## Co sprawdzić, jeśli dalej jest 500

- Czy `SUPABASE_SERVICE_ROLE_KEY` jest ustawione dokładnie pod tą nazwą w secrets Edge Function.
- Czy `SYNC_CODE_PEPPER` jest ustawione.
- Czy migracja utworzyła `public.sync_spaces`, `public.sync_entries`, `public.sync_dishes`.
- Czy unique constraint `(sync_space_id, local_id)` istnieje na `sync_entries` i `sync_dishes`.
- Czy `onConflict: "sync_space_id,local_id"` zgadza się z constraintem.
- Czy payload z frontendu ma `id` dla każdego wpisu/dania.
- Czy Edge Function log pokazuje `setup_failed`, `upsert_entries_failed`, `upsert_dishes_failed`, `pull_failed` albo `db_error`.

## Walidacja lokalna

Uruchomiono:

- `node --check app.js` - OK.
- `node --check config.js` - OK.
- `node --check service-worker.js` - OK.

Po zapisaniu raportu/handoff uruchomiono też:

- `git diff --check` - OK; Git pokazał tylko ostrzeżenia LF/CRLF.
- `git diff -- db.js` - pusty.
- skan sekretów `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `service_role`, `sk-` - brak wartości sekretów; trafienia dotyczą tylko nazw env / pola `service_role` w Edge Function, raporcie i handoffie.
- skan frontendowy `SUPABASE_SERVICE_ROLE_KEY|service_role` w `app.js`, `config.js`, `index.html`, `service-worker.js`, `style.css` - brak trafień.
- skan destrukcyjnych operacji `localStorage.clear`, `indexedDB.deleteDatabase`, `deleteDatabase`, `clearData` - brak trafień.

Ograniczenie:

- Lokalnie nadal nie ma `deno`.
- Lokalnie nie ma `tsc`.
- Edge Function TS nie była deployowana ani uruchamiana lokalnie.

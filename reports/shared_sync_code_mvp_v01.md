# Shared sync code MVP v01

## Cel

Dodać najszybsze MVP synchronizacji danych między dwoma urządzeniami przez wspólny kod synchronizacji, bez pełnego systemu kont użytkowników.

Zakres jest ograniczony do:

- lokalny frontend Cyber Zdrowie,
- przygotowana migracja SQL,
- przygotowana Edge Function `cloud-sync`,
- brak deployu,
- brak wykonywania SQL,
- brak sekretów w repo,
- brak zmian w `db.js`.

## Lokalny zapis danych

Lokalne dane są w IndexedDB obsługiwanym przez `db.js`.

Store:

- `entries` - wpisy posiłków, keyPath `id`.
- `customDishes` - Moje dania / przepisy, keyPath `id`.
- `settings` - ustawienia aplikacji.

Istniejące bezpieczne funkcje:

- `window.ketoDb.saveEntry(entry)` - zapis/overwrite lokalnego wpisu.
- `window.ketoDb.importEntries(entries)` - import tylko nowych wpisów, pomija duplikaty po `id`.
- `window.ketoDb.saveCustomDish(dish)` - zapis/overwrite dania.
- `window.ketoDb.importCustomDishes(dishes)` - import tylko nowych dań, pomija duplikaty po `id`.
- `window.ketoDb.getAllEntries()` i `window.ketoDb.getAllCustomDishes()` - eksport lokalnego stanu do sync.

`db.js` nie był edytowany.

## Struktura danych

Entry ma lokalny `id`, `date`, `createdAt`, `rawText`, `parsedData`, `tags`, `products` oraz opcjonalne pola źródła danych, np. `nutritionSource`, `dataSource`, `updatedAt`.

Custom dish ma lokalny `id`, `name`, `totalMassG`, `initialMassG`, `remainingMassG`, `usedMassG`, `totalData`, `per100gData`, `tags`, `products`, `source` / `dataSource`, `rawText`, `createdAt`, `updatedAt`.

Sync używa `entry.id` i `dish.id` jako `local_id`.

## Jak działa MVP sync_code

Frontend:

- UI jest w `Ustawienia / Wygląd -> Synchronizacja` oraz jako szybki skrót w menu.
- Użytkownik wpisuje kod, np. `PIOTR-ANIA`.
- Kod jest normalizowany lokalnie przez `trim + uppercase`.
- Kod sync jest zapisany lokalnie w `localStorage` pod `vitatrack_sync_code_v1`.
- `device_id` jest generowany raz lokalnie i zapisany w `vitatrack_sync_device_id_v1`.
- Ostatnia synchronizacja jest zapisywana w `vitatrack_sync_last_sync_v1`.
- Frontend nigdy nie zapisuje peppera ani service role key.

Automatyczny push:

- Po udanym lokalnym zapisie wpisu lub dania aplikacja robi best-effort `push`.
- Jeżeli push się nie uda, lokalny wpis/danie zostaje bez zmian.

Manualny sync:

- `Synchronizuj teraz` pobiera wszystkie lokalne wpisy i dania.
- Wysyła akcję `sync` do Edge Function.
- Edge Function robi push, a potem pull.
- Pull wraca jako tablice payloadów `entries` i `dishes`.
- Frontend importuje je przez `importEntries` i `importCustomDishes`, więc istniejące lokalne rekordy nie są duplikowane.

Konflikty:

- Po stronie serwera MVP robi upsert po `(sync_space_id, local_id)`.
- Po stronie lokalnej import nie nadpisuje istniejących rekordów. To celowo bezpieczne MVP, żeby nie ryzykować destrukcyjnej zmiany lokalnych danych.

## SQL migration

Przygotowano:

`database/migrations/20260705_shared_sync_code_mvp.sql`

Tabele:

- `public.sync_spaces`
- `public.sync_entries`
- `public.sync_dishes`

Ważne:

- `sync_spaces.code_hash` jest unikalny.
- `sync_entries` i `sync_dishes` mają `unique(sync_space_id, local_id)`.
- RLS jest włączony na wszystkich tabelach.
- Nie dodano publicznych policy dla `anon` ani `authenticated`.
- Dostęp zakładany jest wyłącznie przez Edge Function z server-side service role key.

SQL nie był wykonywany.

## Edge Function

Przygotowano:

`supabase/functions/cloud-sync/index.ts`

Akcje:

- `setup`
- `push`
- `pull`
- `sync`

Body:

```json
{
  "action": "sync",
  "sync_code": "PIOTR-ANIA",
  "device_id": "device-id",
  "entries": [],
  "dishes": [],
  "since": null
}
```

Zasady:

- `sync_code` jest wymagany.
- Kod jest normalizowany przez `trim + uppercase`.
- Kod nie jest zapisywany w bazie wprost.
- Hash: SHA-256 z `SYNC_CODE_PEPPER` z env.
- Brak `SYNC_CODE_PEPPER`, `SUPABASE_URL` albo server-side service role key zwraca błąd konfiguracji.
- Funkcja nie loguje `sync_code`.
- Funkcja nie loguje żadnych sekretów.
- CORS obsługuje GitHub Pages i localhost.
- `setup` tworzy lub znajduje `sync_space`.
- `push` robi upsert entries/dishes po `(sync_space_id, local_id)`.
- `pull` zwraca payloady dla danego `sync_space`.
- `sync` robi push, potem pull.
- Nie ma twardego kasowania danych.

## Co trzeba ręcznie zrobić w Supabase

1. Przejrzeć migrację SQL.
2. Wykonać migrację ręcznie w Supabase, jeśli zakres zostanie zaakceptowany.
3. Ustawić sekrety Edge Function:

- `SYNC_CODE_PEPPER` - losowy długi sekret do hashowania kodów.
- `SUPABASE_SERVICE_ROLE_KEY` - tylko jako sekret Edge Function, nigdy w frontendzie.
- `SUPABASE_URL` - zwykle dostępny w środowisku funkcji, ale trzeba potwierdzić.

4. Wdrożyć Edge Function `cloud-sync` ręcznie.
5. Po deployu odświeżyć PWA/cache przez normalny mechanizm wersji `vitatrack-mobile-shell-v38`.

## Test manualny z dwoma urządzeniami

1. Na telefonie A otwórz `Ustawienia / Wygląd -> Synchronizacja`.
2. Wpisz kod, np. `PIOTR-ANIA`.
3. Kliknij `Połącz`.
4. Dodaj wpis posiłku.
5. Kliknij `Synchronizuj teraz`.
6. Na telefonie B wpisz ten sam kod i kliknij `Połącz`.
7. Kliknij `Synchronizuj teraz`.
8. Sprawdź, czy wpis z telefonu A pojawia się na telefonie B.
9. Dodaj danie w `Moje dania` na telefonie B.
10. Kliknij `Synchronizuj teraz` na B i potem na A.
11. Sprawdź, czy danie pojawia się na A.

## Bezpieczeństwo i ograniczenia

- To nie jest pełny system kont.
- Każdy, kto zna kod synchronizacji, może dostać dostęp do tej przestrzeni po deployu funkcji.
- Kod nie jest zapisany w bazie wprost, ale jest lokalnie w `localStorage` na urządzeniu użytkownika.
- Pepper musi być sekretem serwerowym.
- Brak hard delete sync w tym etapie.
- Brak rozwiązywania konfliktów po stronie lokalnej. Import nie nadpisuje istniejących lokalnych rekordów.
- Dla większego bezpieczeństwa później potrzebne są konta, autoryzacja, rotacja kodów, role i audyt.

## Walidacja lokalna

Uruchomiono:

- `node --check app.js` - OK.
- `node --check config.js` - OK.
- `node --check service-worker.js` - OK.

Po zapisaniu raportu/handoff uruchomiono też:

- `git diff --check` - OK; Git pokazał tylko ostrzeżenia LF/CRLF.
- `git diff -- db.js` - pusty.
- skan sekretów w zmienianych plikach - brak wartości sekretów; znaleziono tylko nazwę env `SUPABASE_SERVICE_ROLE_KEY` w Edge Function i dokumentacji.
- skan frontendowy `SUPABASE_SERVICE_ROLE_KEY` w `app.js`, `config.js`, `index.html`, `service-worker.js`, `style.css` - brak trafień.
- skan destrukcyjnych operacji `localStorage.clear`, `indexedDB.deleteDatabase`, `deleteDatabase`, `clearData` - brak trafień.

Edge Function:

- `deno` nie jest dostępne lokalnie.
- `tsc` nie jest dostępne lokalnie.
- `supabase functions --help` nie doszedł do wyniku, bo CLI próbował zapisać telemetry file poza workspace i dostał EPERM.
- Funkcja nie była deployowana ani uruchamiana lokalnie.

## TODO na pełne konta

- Pełne logowanie użytkowników.
- Per-user membership w przestrzeniach synchronizacji.
- Zapraszanie i odpinanie urządzeń.
- Konflikt resolution po `updatedAt`.
- Soft delete sync dla wpisów i dań.
- Możliwość rotacji/zmiany kodu.
- Ograniczenia rate limit i audyt operacji.

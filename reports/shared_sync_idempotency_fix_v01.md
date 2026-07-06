# Shared Sync Idempotency Fix v01

## Cel

Naprawa MVP synchronizacji przez `cloud-sync`, aby kolejne kliknięcia `Synchronizuj` nie dodawały ponownie tych samych posiłków ani dań.

## Przyczyna

Frontend importował payload z chmury przez ogólny import IndexedDB, który pomijał rekordy tylko po lokalnym `id`. Jeżeli rekord wrócił z chmury z niespójną tożsamością albo pochodził z innego urządzenia po kolejnym pushu, merge mógł potraktować go jak nowy wpis. To powodowało wzrost liczby wpisów i kalorii po samym ponownym sync.

## Zmiany

- Wpisy i dania mają stabilną tożsamość sync:
  - wpisy: `sync_id` i `client_entry_id`,
  - dania: `sync_id` i `client_dish_id`.
- Nowe lokalne wpisy i dania dostają stabilne ID w momencie utworzenia i wysyłają je do chmury.
- Edge Function normalizuje payload do stabilnego ID i zapisuje go jako `local_id`.
- Push do Supabase dalej używa `upsert` po `sync_space_id,local_id`.
- Pull/merge po stronie frontendu sprawdza lokalne dane po stabilnym ID, a pomocniczo po bezpiecznym fingerprintcie rekordu.
- Istniejące lokalne wpisy są pomijane albo aktualizowane, nie dodawane jako nowe.
- Dodano raport debug sync:
  - `pushed_new`,
  - `pushed_updated`,
  - `pulled_new`,
  - `pulled_updated`,
  - `skipped_existing`,
  - `skipped_duplicates`,
  - `total_local_entries_after_sync`,
  - `potential_local_duplicate_entries`.
- Dodano test `tests/sync_idempotency_scenario.test.js` dla scenariusza Device A / Device B.

## Migracja SQL

Nie była potrzebna. Istniejąca migracja `database/migrations/20260705_shared_sync_code_mvp.sql` ma już:

- `unique(sync_space_id, local_id)` w `sync_entries`,
- `unique(sync_space_id, local_id)` w `sync_dishes`.

## Bezpieczeństwo

- Nie ruszano `db.js`.
- Nie ruszano AI parsera, food lookupu ani nutrient merge.
- Nie czyszczono IndexedDB/cache/localStorage.
- Nie dodano service role key do frontendu.
- Nie logowano sync code ani pełnych payloadów posiłków.
- Nie wykonywano deploya ani push.

## Test lokalny

```powershell
node tests/sync_idempotency_scenario.test.js
```

Scenariusz:

1. Device A ma wpis 500 kcal.
2. A robi sync.
3. Device B robi sync.
4. B dodaje wpis 1500 kcal.
5. B robi sync.
6. A robi sync.
7. A robi sync drugi raz.
8. B robi sync drugi raz.

Oczekiwany wynik:

- A ma 2 unikalne wpisy,
- B ma 2 unikalne wpisy,
- chmura ma 2 unikalne wpisy,
- suma kcal = 2000,
- kolejne sync nie zmieniają liczby wpisów ani kalorii.

## Ograniczenia

Mechanizm wykrywa potencjalne duplikaty lokalne przez `potential_local_duplicate_entries`, ale nie usuwa ich automatycznie. To celowe, żeby nie kasować danych użytkownika bez osobnej, kontrolowanej akcji naprawczej.

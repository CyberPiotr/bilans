# AI HANDOFF — Shared sync idempotency fix

## 1. Projekt

* Nazwa projektu: Cyber Zdrowie / VitaTrack
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `963301b Add cloud sync diagnostics`
* Aktualny commit po etapie: lokalny commit `Fix idempotent shared sync` wykonany na końcu etapu; hash podany w finalnej odpowiedzi i `git log -1 --oneline`
* Data etapu: 2026-07-06

## 2. Cel etapu

Naprawić synchronizację przez wspólny kod tak, aby była idempotentna. Wielokrotne kliknięcie `Synchronizuj` nie może dodawać tych samych posiłków ani dań drugi raz i nie może podnosić sumy kcal bez nowych danych.

## 3. Aktualny stan projektu

Sync nadal działa przez Supabase Edge Function `cloud-sync` i lokalne dane IndexedDB. Wpisy i dania są scalane po stabilnej tożsamości sync. Edge Function zapisuje rekordy po `local_id`, a frontend przy pullu pomija albo aktualizuje istniejące rekordy zamiast importować je ponownie jako nowe.

Istniejące tabele `sync_entries` i `sync_dishes` mają już unikalne ograniczenia `unique(sync_space_id, local_id)`, więc nie była potrzebna nowa migracja SQL.

## 4. Co zostało zrobione

* Dodano stabilne pola sync dla nowych lokalnych wpisów: `sync_id` i `client_entry_id`.
* Dodano stabilne pola sync dla nowych lokalnych dań: `sync_id` i `client_dish_id`.
* Edge Function normalizuje payload wpisu/dania do stabilnego ID i odsyła ten sam identyfikator przy pullu.
* Push do Supabase deduplikuje paczkę po `local_id` przed `upsert`.
* Pull/merge w frontendzie sprawdza istniejące lokalne wpisy i dania po stabilnym ID, a pomocniczo po fingerprintcie rekordu.
* Dodano diagnostykę sync bez pełnych payloadów i bez sync code.
* Dodano lokalny test scenariusza Device A / Device B.
* Podbito app shell/cache z `v39` do `v40`, żeby PWA pobrała poprawiony frontend.

## 5. Zmienione/dodane pliki

* `app.js` — stabilne ID przy tworzeniu wpisów/dań, idempotentny local merge po pullu, debug stats sync.
* `supabase/functions/cloud-sync/index.ts` — stabilna tożsamość payloadów, upsert stats, deduplikacja rows przed upsert.
* `config.js` — wersja aplikacji `vitatrack-mobile-shell-v40`.
* `service-worker.js` — cache `vitatrack-mobile-shell-v40`.
* `tests/sync_idempotency_scenario.test.js` — test scenariusza A/B dla powtarzanego sync.
* `reports/shared_sync_idempotency_fix_v01.md` — krótki raport techniczny etapu.
* `ai_handoff/handoff_2026-07-06_18-57_shared-sync-idempotency-fix.md` — ten handoff.

## 6. Decyzje techniczne

* Użyto istniejącej lokalnej tożsamości `id` jako bazowego stabilnego ID, zamiast tworzyć równoległy system.
* Dodano aliasy `sync_id` i `client_entry_id` / `client_dish_id`, żeby payload zachowywał jednoznaczną tożsamość po przejściu przez chmurę.
* Nie edytowano `db.js`; merge idempotentny jest w warstwie aplikacji przed zapisem do IndexedDB.
* Nie dodano migracji SQL, bo unikalność po `sync_space_id, local_id` już istnieje.
* Nie usuwano automatycznie potencjalnych lokalnych duplikatów; dodano tylko licznik diagnostyczny `potential_local_duplicate_entries`.

## 7. Testy i walidacja

Uruchomione komendy:

```powershell
node --check app.js
node --check config.js
node --check service-worker.js
node tests/sync_idempotency_scenario.test.js
git diff --check
git diff -- db.js
```

Wynik:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `node tests/sync_idempotency_scenario.test.js` — OK, `sync idempotency scenario: OK`
* `git diff --check` — OK
* `git diff -- db.js` — pusty wynik, `db.js` nietknięty

Nie wykonano checka Deno, bo lokalnie `deno` nie jest dostępne (`The term 'deno' is not recognized...`).

## 8. Bezpieczeństwo

* Sprawdzono sekrety skanem po zmienianych obszarach.
* W frontendzie nie dodano service role key.
* `SUPABASE_SERVICE_ROLE_KEY` występuje tylko w Edge Function jako nazwa zmiennej środowiskowej i boolean health flag.
* Nie użyto API keys.
* Nie użyto internetu.
* Nie użyto płatnego API.
* Nie ruszano produkcyjnych danych.
* Nie wykonywano deploya.
* Nie wykonywano push.
* Nie czyszczono IndexedDB/cache/localStorage.

## 9. Git

* Git status przed etapem:

```text
## ui-mobile-shell...origin/ui-mobile-shell
?? ai_handoff/handoff_2026-07-05_local-vs-github-pwa-nutrients-diff-audit-v01.md
?? reports/local_vs_github_pwa_nutrients_diff_audit_v01.md
```

* Czy wykonano commit: tak, lokalnie na końcu etapu.
* Komunikat commita: `Fix idempotent shared sync`
* Hash commita: podany w finalnej odpowiedzi i dostępny przez `git log -1 --oneline`
* Git status po commicie: sprawdzić finalną odpowiedź; stare nieśledzone pliki audytu z 2026-07-05 pozostają poza zakresem.
* Czy branch jest przed origin/main: branch `ui-mobile-shell` jest lokalnie po commicie przed zdalnym odpowiednikiem.
* Czy push NIE został wykonany: push nie został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie wdrożono Edge Function do Supabase.
* Nie uruchomiono Deno/TypeScript check dla Edge Function, bo `deno` nie jest zainstalowane lokalnie.
* Nie wykonano ręcznego testu na dwóch realnych urządzeniach.
* Nie usunięto istniejących lokalnych duplikatów, jeśli użytkownik już je ma; jest tylko ostrożny licznik diagnostyczny.

## 11. Następny najlepszy krok

Wdrożyć `cloud-sync` w Supabase i wykonać ręczny test na dwóch urządzeniach z tym samym kodem synchronizacji.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta`, branch `ui-mobile-shell`. Ostatni etap naprawił idempotencję shared sync: frontend scala pull po stabilnym `sync_id` / `client_entry_id` / `client_dish_id`, Edge Function normalizuje payload po `local_id`, a test `tests/sync_idempotency_scenario.test.js` przechodzi. Nie ruszaj `db.js`, AI parsera, food lookupu ani nutrient merge. Nie czyść IndexedDB/cache, nie używaj sekretów i nie rób push bez zgody. Następny krok: zweryfikuj deploy/uruchomienie `cloud-sync` i ręcznie sprawdź scenariusz dwóch urządzeń: A dodaje 500 kcal, A sync, B sync, B dodaje 1500 kcal, B sync, A sync dwa razy, B sync drugi raz. Oczekiwane: oba urządzenia mają dokładnie 2 unikalne wpisy i 2000 kcal, a kolejne sync nic nie mnożą.

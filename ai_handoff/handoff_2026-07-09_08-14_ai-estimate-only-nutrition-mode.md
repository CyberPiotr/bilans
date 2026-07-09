# AI HANDOFF — AI estimate only nutrition mode

## 1. Projekt

* Nazwa projektu: Cyber Zdrowie / VitaTrack
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `cc867cf Fix idempotent shared sync`
* Aktualny commit po etapie: lokalny commit `Add AI estimate only nutrition mode` wykonany na końcu etapu; hash podany w finalnej odpowiedzi i `git log -1 --oneline`
* Data etapu: 2026-07-09

## 2. Cel etapu

Tymczasowo odłączyć bazę produktów / food lookup od finalnego liczenia kalorii i nutrientów, bez kasowania kodu lookupu i bez ruszania sync, IndexedDB, Supabase Edge Functions ani struktury danych.

## 3. Aktualny stan projektu

Aplikacja działa domyślnie w trybie `ai_estimate_only`. AI parser nadal liczy posiłki i dania, ale finalne `parsedData`, `totalData` i `per100gData` nie są nadpisywane ani mergowane z food lookupiem. Food lookup code zostaje w repo, ale w tym trybie resolver i bezpośredni `requestFoodLookup()` pomijają request do bazy.

## 4. Co zostało zrobione

* Dodano flagę `NUTRITION_MODE = "ai_estimate_only"` w `config.js`.
* Dodano `window.VITATRACK_CONFIG.nutritionMode`.
* Dodano helpery trybu nutrition w `app.js`.
* W trybie AI estimate:
  * `resolveMealWithFoodLookup()` zwraca AI `fallbackParsedData`,
  * `resolveDishIngredientsWithFoodLookup()` zwraca metadane składników bez lookupu,
  * `requestFoodLookup()` ma bezpiecznik i nie wykonuje fetch.
* Dodano metadane:
  * `dataSource.type = "ai_estimate"` dla posiłków,
  * `nutritionSource = "ai_estimate"` dla posiłków,
  * `confidence = "estimate"`,
  * `estimateNote`,
  * `assumptions`.
* Dodano debug `[Cyber Zdrowie Nutrition Mode]` bez pełnych payloadów posiłków.
* Dodano badge/styl `Szacunek AI` w historii i składnikach.
* Podbito cache PWA do `vitatrack-mobile-shell-v41`.
* Dodano test statyczny `tests/nutrition_mode_static.test.js`.

## 5. Zmienione/dodane pliki

* `config.js` — flaga `NUTRITION_MODE`, wersja `v41`.
* `app.js` — tryb nutrition, pomijanie food lookupu, metadane i debug.
* `style.css` — style badge `ai-estimate`.
* `service-worker.js` — cache `v41`.
* `tests/nutrition_mode_static.test.js` — test statyczny trybu AI estimate.
* `ai_handoff/handoff_2026-07-09_08-14_ai-estimate-only-nutrition-mode.md` — ten handoff.

## 6. Decyzje techniczne

* Kod food lookupu nie został usunięty; jest odłączony flagą.
* Domyślny tryb jest ustawiony w `config.js`, żeby powrót do bazy był prosty.
* `dataSource` zostaje obiektem dla UI, a `nutritionSource` w nowych posiłkach AI jest markerem `"ai_estimate"`.
* Dashboard nie został zmieniony, bo sumuje `parsedData`; źródło `parsedData` zmienia się przed zapisem wpisu.
* Sync nie został zmieniony; nowe metadane są częścią istniejącego payloadu wpisu.

## 7. Testy i walidacja

Uruchomione komendy:

```powershell
node --check app.js
node --check config.js
node --check service-worker.js
node tests/nutrition_mode_static.test.js
node tests/sync_idempotency_scenario.test.js
git diff --check
git diff -- db.js
```

Wynik:

* `node --check app.js` — OK
* `node --check config.js` — OK
* `node --check service-worker.js` — OK
* `node tests/nutrition_mode_static.test.js` — OK
* `node tests/sync_idempotency_scenario.test.js` — OK
* `git diff --check` — OK
* `git diff -- db.js` — pusty wynik

Wykonano jedną rundę implementacji i walidacji plus poprawkę zabezpieczającą `requestFoodLookup()`.

## 8. Bezpieczeństwo

* Sprawdzono sekrety w zmienianych plikach.
* Nie użyto API keys.
* Nie użyto internetu.
* Nie użyto płatnego API.
* Nie ruszano produkcyjnych danych.
* Nie wykonywano deploya.
* Nie wykonywano push.
* Nie czyszczono IndexedDB/cache/localStorage.
* Nie ruszano Supabase Edge Functions.
* Nie ruszano `db.js`.

## 9. Git

* Git status przed commitem:

```text
## ui-mobile-shell...origin/ui-mobile-shell
 M app.js
 M config.js
 M service-worker.js
 M style.css
?? ai_handoff/handoff_2026-07-05_local-vs-github-pwa-nutrients-diff-audit-v01.md
?? reports/local_vs_github_pwa_nutrients_diff_audit_v01.md
?? tests/nutrition_mode_static.test.js
```

* Czy wykonano commit: tak, lokalnie na końcu etapu.
* Komunikat commita: `Add AI estimate only nutrition mode`
* Hash commita: podany w finalnej odpowiedzi i dostępny przez `git log -1 --oneline`
* Git status po commicie: stare nieśledzone pliki audytu z 2026-07-05 pozostają poza zakresem.
* Czy push NIE został wykonany: push nie został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie wykonano manualnego testu w przeglądarce z prawdziwym AI parserem.
* Tryb bazy nie został usunięty ani naprawiony; został tylko odłączony flagą.
* Debugowy smoke test food lookupu w UI w trybie `ai_estimate_only` nie wykona requestu, bo `requestFoodLookup()` rzuca bezpieczny błąd przed fetch.

## 11. Następny najlepszy krok

Ręcznie sprawdzić wpis `200 g karkówki pieczonej`: w konsoli powinno być `[Cyber Zdrowie Nutrition Mode]` z `food_lookup_skipped: true`, historia powinna pokazać `Szacunek AI`, a dashboard i sync powinny działać normalnie.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta`, branch `ui-mobile-shell`. Ostatni etap dodał tymczasowy tryb `ai_estimate_only`, który odłącza food lookup od finalnego liczenia nutrientów. Nie ruszaj `db.js`, Supabase Edge Functions, sync ani IndexedDB/cache. Jeśli trzeba wrócić do bazy produktów, zmień w `config.js` `const NUTRITION_MODE = "ai_estimate_only";` na tryb inny niż `ai_estimate_only`, np. `"food_lookup"`, i podbij wersję PWA/cache. Następny krok: ręcznie sprawdzić posiłek `200 g karkówki pieczonej`, potwierdzić brak requestu do food lookupu, badge `Szacunek AI`, normalny zapis historii, sumowanie dashboardu i działający sync.

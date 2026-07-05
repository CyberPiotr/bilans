# UI branding / PWA assets stage 1 v01

## Zakres

Pierwszy etap przejscia widocznego brandingu aplikacji na `Cyber Zdrowie`: nazwa w UI, tytul strony, manifest PWA, ikony telefonu, logo w top barze i lekki splash screen. Nie zmieniano logiki zywieniowej, food-lookup, AI Parsera, IndexedDB ani obliczen nutrientow.

## Stan repo na starcie

`git status --short --branch`:

```txt
## ui-mobile-shell...origin/ui-mobile-shell [ahead 4]
?? ai_handoff/handoff_2026-07-05_local-vs-github-pwa-nutrients-diff-audit-v01.md
?? reports/local_vs_github_pwa_nutrients_diff_audit_v01.md
?? zmiany/
```

`git log --oneline -8` zaczynal sie od:

```txt
9c6288f Merge AI fallback nutrients with food lookup data
1bc48a7 Fix dashboard micro nutrients and range aggregation
1657764 Show nutrient values in food lookup debug
982b6d0 Debug VitaTrack frontend food lookup food form flow
e946396 Separate temporary and permanent missing food removal
b98baf5 Remove recipe deletion from missing foods panel
416f2f9 Fix unsafe missing food delete actions
6d82681 Polish custom dish source badges and delete actions
```

W repo byly nie sledzone pliki z poprzedniego audytu:

- `ai_handoff/handoff_2026-07-05_local-vs-github-pwa-nutrients-diff-audit-v01.md`
- `reports/local_vs_github_pwa_nutrients_diff_audit_v01.md`

Nie usuwano ich i nie wlaczano do zakresu tego etapu.

## Przeczytane pliki

- `zmiany/VITATRACK_UI_SOURCE_OF_TRUTH.md`
- `zmiany/VITATRACK_UI_CHANGE_PLAN_FOR_CODEX.md`
- `current-ui-map.md` - brak pliku w repo
- `index.html`
- `style.css`
- `app.js`
- `manifest.json`
- `service-worker.js`

## Assety

Znalezione:

- `zmiany/logo/logo.png` - 1254x1254, uzyte jako zrodlo ikon PWA
- `zmiany/logo/logo-bez-tla.png` - 500x500, uzyte jako logo wewnatrz aplikacji
- `zmiany/ikony/historia.svg`
- `zmiany/ikony/menu.svg`
- `zmiany/ikony/home.svg`
- `zmiany/ikony/dania.svg`
- `zmiany/ikony/chat.svg`
- `zmiany/ikony/wyślij.svg`

Brakujace:

- `zmiany/ikony/wyslij.svg` - wymagany plik bez polskiego znaku nie istnieje; jest tylko `wyślij.svg`, dlatego nie podpinano go pod sciezke `wyslij.svg`.

Wygenerowane / zaktualizowane:

- `icons/cyber-zdrowie-logo.png` - kopia `logo-bez-tla.png`, 500x500
- `icons/icon-192.png` - wygenerowane z `logo.png`, 192x192
- `icons/icon-512.png` - wygenerowane z `logo.png`, 512x512

## Gdzie byla nazwa aplikacji

- `index.html`: meta description, `<title>`, top bar, menu header, sr-only start title, sekcja About
- `manifest.json`: `name`, `short_name`, `description`, kolory PWA
- `app.js`: widoczny tekst empty state w sekcji rekomendacji
- `app.js`: techniczne logi `[VitaTrack ...]` i eksportowe `app: "Bilans"` pozostaly bez zmian jako nie-UI / kontrakt diagnostyczno-eksportowy

## Co zmieniono na Cyber Zdrowie

- Tytul strony: `Cyber Zdrowie`
- Meta description: `Cyber Zdrowie działa lokalnie i offline jako dziennik żywienia.`
- Top bar: logo + `Cyber Zdrowie`
- Menu header: `Cyber Zdrowie`
- Start sr-only heading: `Cyber Zdrowie`
- Ustawienia / About: `Cyber Zdrowie`
- Empty state w `app.js`: `Cyber Zdrowie zacznie uczyć się Twojego rytmu odżywiania`

## Manifest / PWA

Zaktualizowano `manifest.json`:

- `name`: `Cyber Zdrowie`
- `short_name`: `Cyber Zdrowie`
- `description`: `Lokalna aplikacja do kontroli żywienia.`
- `background_color`: `#f7f2ea`
- `theme_color`: `#f7f2ea`
- ikony pozostaly pod standardowymi sciezkami `icons/icon-192.png` i `icons/icon-512.png`, ale pliki zostaly wygenerowane z nowego `logo.png`

Zaktualizowano `index.html`:

- favicon: nadal `icons/icon-192.png`, ale plik ma nowa grafike
- apple-touch-icon: nadal `icons/icon-192.png`, ale plik ma nowa grafike

## Service worker / cache

Zaktualizowano `service-worker.js`:

- `CACHE_NAME`: `vitatrack-mobile-shell-v29` -> `vitatrack-mobile-shell-v30`
- dodano do app shell: `./icons/cyber-zdrowie-logo.png`
- standardowe ikony PWA nadal sa cache'owane: `./icons/icon-192.png`, `./icons/icon-512.png`

Nie przebudowywano service workera.

## Splash

Dodano lekki splash screen w `index.html` i `style.css`:

- logo na srodku
- nazwa `Cyber Zdrowie`
- animacja okolo 1000 ms
- fade / delikatny scale
- `prefers-reduced-motion: reduce` skraca animacje do minimum
- splash jest pasywny (`pointer-events: none`) i nie blokuje aplikacji po animacji

## CSS tokeny

Dodano minimalne tokeny przygotowujace branding i dalszy redesign:

- `--brand-bg`
- `--brand-surface`
- `--brand-primary`
- `--brand-logo-size`
- `--brand-splash-duration`
- podstawowe aliasy `--vt-*` dla tla, tekstu, primary, radiusow i spacingu

Nie robiono pelnego redesignu gauge, menu, czatu ani floating input bara.

## Walidacja

Uruchomiono:

- `node --check app.js` - OK
- `node --check config.js` - OK
- `node --check service-worker.js` - OK
- `git diff --check` - OK
- `git diff -- db.js` - pusty diff

Nie odpalano API, deploya, push ani czyszczenia cache/IndexedDB.

## Test reczny lokalnie

1. Uruchom aplikacje lokalnie.
2. Twardo odswiez strone, zeby nowy service worker mogl pobrac `vitatrack-mobile-shell-v30`.
3. Sprawdz, czy przy starcie pojawia sie krotki splash z logo i `Cyber Zdrowie`.
4. Sprawdz top bar: logo bez tla + `Cyber Zdrowie`.
5. Sprawdz menu: header pokazuje `Cyber Zdrowie`.
6. Sprawdz Ustawienia / Wyglad: sekcja About pokazuje `Cyber Zdrowie`.
7. Sprawdz manifest/PWA w DevTools: `name` i `short_name` to `Cyber Zdrowie`, ikony 192/512 sa z nowego logo.
8. Sprawdz instalacje / ikone na telefonie po aktualizacji service workera.

## Etap 2

Najlepszy nastepny krok:

- naprawic nazwe assetu `zmiany/ikony/wyslij.svg` bez polskiego znaku albo ustalic, czy wolno przemianowac `wyślij.svg`;
- dopiero potem wejsc w szerszy redesign: bottom sheet menu, dolna nawigacja 5 pozycji, floating input bar, gauge na Home i prosty widok Czat.

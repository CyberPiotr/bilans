# PWA bottom safe area and splash fix v01

Data: 2026-07-05
Repo: `C:\Users\nikto\Desktop\Dieta`
Branch: `ui-mobile-shell`
Commit bazowy: `eb013f5 Polish gauges and chat input UX`

## Cel

Naprawić dwa problemy widoczne po teście PWA na telefonie: biały pasek/gap przy dolnej nawigacji oraz podwójny splash screen.

## Dolny pasek / safe area

Najbardziej prawdopodobne źródło problemu:

- wcześniejsze reguły mieszały `100vh`, `100dvh` i kilka warstw `env(safe-area-inset-bottom)`;
- `.composer-shell` był fixed, ale transparentny, więc obszar pod bottom nav mógł pokazywać niespójne tło;
- część paddingów safe-area była rozproszona między `.app-content`, `.composer-shell` i `.bottom-nav`;
- theme-color w runtime light mode był inny niż faktyczne tło aplikacji.

## Zmiany CSS/layout

- `html` i `body` dostały `min-height: 100%`, `100svh` i `100dvh`.
- `body` ma `overflow-x: hidden` i spójne `background: var(--app-bg)`.
- `.composer-shell` dostał stałe tło dopasowane do bottom nav/app i `padding-bottom: 0`.
- `.bottom-nav` zachowuje safe-area przez `env(safe-area-inset-bottom)` i ma to samo tło co shell.
- `.home-period-switcher`, `.app-menu` i `.menu-backdrop` nadal respektują `env(safe-area-inset-bottom)`.
- Lokalny check 390x844: `navBottom = 844`, `shellBottom = 844`, czyli bottom nav dochodzi do dolnej krawędzi viewportu.

## Splash screen

- Pierwszy splash installed PWA jest generowany przez system/browser na podstawie `manifest.json`; aplikacja nie może go w pełni usunąć z kodu runtime.
- Dodano wczesny skrypt w `<head>`, który wykrywa standalone:
  - `window.matchMedia("(display-mode: standalone)").matches`;
  - `window.navigator.standalone === true` dla iOS.
- Jeśli aplikacja działa jako standalone/PWA, `<html>` dostaje klasę `pwa-standalone`.
- CSS `.pwa-standalone .app-splash { display: none !important; }` wyłącza custom splash w PWA.
- Custom splash zostaje dla zwykłego uruchomienia w przeglądarce.

## Manifest / service worker / cache

- `manifest.json` został sprawdzony: `background_color` i `theme_color` są zgodne z tłem Cyber Zdrowie (`#f7f2ea`), a ikony 192/512 nadal wskazują `icons/icon-192.png` i `icons/icon-512.png`.
- `theme-color` w `index.html` i runtime `applyTheme()` został ustawiony na `#f7f2ea` dla light mode.
- Service worker cache podbito do `vitatrack-mobile-shell-v35`.
- `config.js` podbito do `vitatrack-mobile-shell-v35`.

## Walidacja

Uruchomiono:

- `node --check app.js` - OK
- `node --check config.js` - OK
- `node --check service-worker.js` - OK
- `git diff --check` - OK; tylko ostrzeżenia LF/CRLF
- `git diff -- db.js` - OK, brak diffu
- `rg -n "OPENAI_API_KEY|sk-|service_role|localStorage\.clear|indexedDB\.deleteDatabase|clearData|deleteDatabase" app.js index.html style.css config.js service-worker.js manifest.json` - brak trafień

Lokalny browser check 390x844:

- `htmlMinHeight = 844px`;
- `bodyMinHeight = 844px`;
- `bodyBg = rgb(247, 242, 234)`;
- `shellBottom = 844`;
- `navBottom = 844`;
- `themeColor = #f7f2ea`;
- zwykła przeglądarka: `standaloneClass = false`, `splashDisplay = grid`.

## Bezpieczeństwo

- `db.js` nietknięty.
- Nie zmieniano backendu, Supabase, parsera AI, food-lookup, nutrientów, hybrid merge, czatu ani gauge.
- Nie czyszczono IndexedDB ani cache.
- Nie odpalano płatnych API.
- Nie wykonano push ani deploy.

## Do sprawdzenia na telefonie

- Czy biały pasek pod bottom nav zniknął w Android PWA.
- Czy bottom nav nie jest ucinany przez systemowy pasek Androida.
- Czy przy starcie installed PWA widać tylko systemowy/browserowy splash z manifestu, bez drugiego custom splash.
- Czy zwykłe uruchomienie w przeglądarce nadal może pokazać custom splash.

# PWA menu layer, light mode, icon fix v03

## Scope

Project: VitaTrack / Dieta
Folder: `C:\Users\nikto\Desktop\Dieta`
Branch: `ui-mobile-shell`
Base commit: `e608943 Polish PWA icons safe area and light mode`

This stage treats the bottom white strip as a closed bottom-sheet menu layering/positioning issue, not primarily as a system safe-area issue.

## Bottom menu diagnosis

The menu is a fixed `.app-menu` bottom sheet controlled by the `.open` class from `openMenu()`, `toggleMenu()`, and `closeMenu()` in `app.js`.

Previous CSS closed the sheet with a percentage translate. On a real PWA viewport that could still leave part of the closed sheet visible under or behind the bottom nav. This matched the phone observation: the strip disappeared when the menu opened, which points to the closed sheet rather than to the OS safe-area.

## Layer changes

Target layering:

- bottom nav: `z-index: 62`
- composer shell: `z-index: 60`
- menu sheet: `z-index: 45`
- menu backdrop: `z-index: 44`
- main content: below these layers

The bottom nav remains the highest interactive bottom layer. The menu and backdrop sit below it, and the menu's open state ends above the bottom nav.

## Closed menu behavior

Closed `.app-menu` now uses:

`transform: translate3d(0, calc(100% + var(--bottom-nav-height) + var(--bottom-safe-area) + 32px), 0);`

That moves the whole sheet fully below the visible viewport area, including bottom-nav height, safe-area height, and a small extra buffer. The closed sheet should no longer leave a visible strip below the bottom nav.

## Open menu behavior

Open `.app-menu.open` uses:

`transform: translate3d(0, 0, 0);`

The menu remains positioned with `bottom: calc(var(--bottom-nav-height) + var(--bottom-safe-area));`, so it opens up to the area above the bottom nav rather than under it.

Menu button behavior was verified in existing JS:

- bottom Menu button toggles open/closed,
- X closes the menu,
- backdrop closes the menu,
- no data-clearing logic is tied to menu open/close.

## Animation

The menu transition is now:

`transition: transform 1300ms cubic-bezier(.22, 1, .36, 1);`

This is within the requested 1.2s-1.5s range. `prefers-reduced-motion: reduce` shortens the transition to `160ms`.

## Light mode

Light mode was moved from green/cream-tinted values to a nearly white neutral gray palette:

- `--app-bg: #f6f7f5`
- `--app-surface: #fefefc`
- `--app-surface-soft: #eef0ed`
- `--app-input: #fefefc`
- `--brand-bg: #f6f7f5`
- `--brand-surface: #fefefc`
- `--vt-bg-soft: #fafaf8`
- `--vt-surface: rgb(254 254 252 / 86%)`
- `--vt-surface-solid: #fefefc`
- `--vt-surface-muted: #eef0ed`
- `--vt-border: rgb(15 23 18 / 10%)`

HTML theme color, runtime theme color, and manifest colors now use `#f6f7f5`.

## Icons

The four PWA icons were regenerated locally from `zmiany/logo/logo-bez-tla.png` with a neutral `#f6f7f5` background:

- `icons/icon-192.png`
- `icons/icon-512.png`
- `icons/icon-maskable-192.png`
- `icons/icon-maskable-512.png`

Padding was increased versus the previous stage:

- normal icons use logo scale `0.58`,
- maskable icons use logo scale `0.46`,
- generated files have corner pixel `(246, 247, 245, 255)`.

The maskable 512 icon was visually inspected and keeps the logo well inside the safe zone.

## Splash

The system PWA splash timing is controlled by the browser/OS and cannot be directly controlled with JS/CSS.

The custom in-app splash uses `--brand-splash-duration: 1300ms`, matching the requested 1.2s-1.5s range. It remains disabled in standalone/PWA through `.pwa-standalone .app-splash { display: none !important; }`, so PWA users should not see a second custom splash after the system splash.

Splash background follows `--app-bg`, now `#f6f7f5`.

## Service worker/cache

Because CSS, manifest, config, and icons changed:

- `CACHE_NAME` was bumped to `vitatrack-mobile-shell-v37`,
- `APP_VERSION` was bumped to `vitatrack-mobile-shell-v37`,
- existing normal and maskable icons remain in the app shell cache list,
- service worker logic was not rebuilt.

## Phone check

On the phone/PWA verify:

- closed menu leaves no bottom strip under the bottom nav,
- opening menu removes no spacer artifact because the closed sheet was the source,
- bottom nav stays visually above the menu,
- menu opens and closes smoothly over about 1.3s,
- light mode is neutral near-white/popielaty, not cream/beige/green,
- PWA launcher and splash icon have visibly larger padding and no white square.

## Validation

Commands run:

- `node --check app.js`
- `node --check config.js`
- `node --check service-worker.js`
- `git diff --check`
- `git diff -- db.js`
- search for secrets and destructive storage clearing calls

Results:

- `node --check app.js` - OK.
- `node --check config.js` - OK.
- `node --check service-worker.js` - OK.
- `git diff --check` - OK; Git only printed LF/CRLF working-copy warnings.
- `git diff -- db.js` - empty.
- Secret/destructive search in runtime files - no matches for `OPENAI_API_KEY`, `sk-`, `service_role`, `localStorage.clear`, `indexedDB.deleteDatabase`, `clearData`, `deleteDatabase`, or `reset app`.

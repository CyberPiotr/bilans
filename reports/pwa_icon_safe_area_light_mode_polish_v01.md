# PWA icon, safe-area, light mode polish v01

## Scope

Project: VitaTrack / Dieta frontend
Folder: `C:\Users\nikto\Desktop\Dieta`
Branch: `ui-mobile-shell`
Stage goal: polish mobile/PWA presentation only: bottom safe-area, launcher/splash icons, light theme brightness, Home/Chat segments, and menu animation/z-index.

## Changed files

- `style.css` - brightened light theme tokens, pinned bottom surfaces across the safe-area, unified Home and Chat segmented controls, and adjusted menu z-index plus bottom-sheet animation.
- `index.html` - updated light `theme-color` to match the brighter app background.
- `app.js` - updated runtime light theme color to match the meta/manifest color.
- `manifest.json` - updated light theme/background color and split normal icons from maskable icons.
- `service-worker.js` - bumped app shell cache name and cached the new maskable icon files.
- `config.js` - bumped frontend app version/change label to the matching app shell version.
- `icons/icon-192.png` and `icons/icon-512.png` - regenerated normal launcher icons with a brighter background and more breathing room.
- `icons/icon-maskable-192.png` and `icons/icon-maskable-512.png` - added dedicated maskable icons with larger safe padding for Android/PWA crops.

## What changed

- Bottom nav and composer surfaces now use full-width app surfaces with higher z-index and explicit `100dvh` page background support.
- Bottom menu opens above the nav, while the nav remains visually on top through z-index ordering.
- Menu transition uses a slower `480ms` bottom-sheet movement with a reduced-motion override.
- Light mode moved from warmer cream values to a brighter near-white green-tinted palette.
- Home period segment and Chat `Posiłek` / `Danie` segment now share the same sizing, button treatment, active state, and spacing.
- PWA manifest now uses separate `any` and `maskable` icon entries instead of using one tight icon for both purposes.

## PWA icons

The icon source was `zmiany/logo/logo-bez-tla.png`. Generated outputs:

- `icons/icon-192.png` - normal icon, 192x192.
- `icons/icon-512.png` - normal icon, 512x512.
- `icons/icon-maskable-192.png` - maskable icon, 192x192.
- `icons/icon-maskable-512.png` - maskable icon, 512x512.

All generated icons have background pixel `#f8faf7`, matching the updated light PWA background. Maskable variants use smaller logo scale to leave safe padding, so Android splash/launcher crops should not show the previous white square/tight crop.

## Validation

Commands run:

- `node --check app.js`
- `node --check config.js`
- `node --check service-worker.js`
- `git diff --check`
- `git diff -- db.js`
- secret/destructive search for `OPENAI_API_KEY`, `sk-`, `service_role`, `localStorage.clear`, `indexedDB.deleteDatabase`, `clearData`, `deleteDatabase`

Browser preview checks on `127.0.0.1:8790` with mobile viewport `390x844` confirmed:

- `body` background and theme color use `#f8faf7`.
- bottom nav reaches viewport bottom and uses `z-index: 62`.
- chat segment has `Posiłek` and `Danie`, height 40px, same button styling family as Home segment.
- menu opens above the nav and has lower z-index than bottom nav.

Note: computed menu transition in the automated browser was `0s` because that environment reported reduced motion; normal CSS sets `480ms`.

## Safety

- Backend was not changed.
- Supabase was not changed.
- `db.js` was not changed.
- No IndexedDB/cache clearing command was run.
- No deploy was run.
- No push was run.
- No paid API or secret was used.

## Remaining manual check

Install or refresh the PWA on a real phone after the cache version update, then confirm:

- no white strip remains below the bottom nav,
- launcher/splash icon no longer shows a white square or overly tight crop,
- light mode reads brighter and less cream,
- Chat segment matches Home segment,
- menu animation feels slower and the bottom nav remains visually above it.

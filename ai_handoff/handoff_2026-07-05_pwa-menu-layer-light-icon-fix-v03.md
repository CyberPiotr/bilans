# AI HANDOFF — PWA menu layer, light mode, icon fix v03

## 1. Projekt

* Nazwa projektu: VitaTrack / Dieta
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `e608943 Polish PWA icons safe area and light mode`
* Aktualny commit po etapie: do uzupełnienia po commicie
* Data etapu: 2026-07-05

## 2. Cel etapu

Naprawić właściwą przyczynę dolnego paska w PWA: zamknięte menu bottom sheet wystające pod dolną nawigacją. Dodatkowo zmienić light mode na neutralny prawie biały/popielaty, zwiększyć padding ikon PWA, wygładzić animację menu i zostawić logikę danych nietkniętą.

## 3. Aktualny stan projektu

Menu bottom sheet jest traktowane jako osobna warstwa pod bottom nav. W stanie zamkniętym sheet jest przesunięty całkowicie poza widok, z zapasem uwzględniającym wysokość bottom nav, safe-area i dodatkowe 32px. Bottom nav ma najwyższy z-index w dolnych warstwach. Light mode jest neutralny i prawie biały, a ikony PWA mają większy margines, szczególnie warianty maskable.

## 4. Co zostało zrobione

* Zmieniono light mode na neutralne wartości `#f6f7f5`, `#fafaf8`, `#fefefc`, `#eef0ed`.
* Zmieniono `theme-color` w HTML, runtime JS i manifest na `#f6f7f5`.
* Ustawiono custom splash na `1300ms`, przy zachowaniu wyłączenia w standalone/PWA.
* Zmieniono zamknięty stan `.app-menu` na pełne przesunięcie poza viewport: `100% + bottom nav + safe-area + 32px`.
* Zachowano bottom nav jako najwyższą dolną warstwę (`z-index: 62`), nad menu (`45`) i backdropem (`44`).
* Ustawiono animację menu na `1300ms cubic-bezier(.22, 1, .36, 1)` oraz skrócenie do `160ms` przy reduced motion.
* Regenerowano cztery ikony PWA z większym paddingiem i tłem `#f6f7f5`.
* Podbito cache/app version do `vitatrack-mobile-shell-v37`.

## 5. Zmienione/dodane pliki

* `style.css` - light mode tokens, custom splash duration, final menu layer/transform/animation overrides.
* `index.html` - light `theme-color`.
* `app.js` - runtime light `theme-color`.
* `manifest.json` - PWA `background_color` i `theme_color`.
* `service-worker.js` - cache name `vitatrack-mobile-shell-v37`.
* `config.js` - app version/change label `vitatrack-mobile-shell-v37`.
* `icons/icon-192.png` - odświeżona normalna ikona z większym paddingiem.
* `icons/icon-512.png` - odświeżona normalna ikona z większym paddingiem.
* `icons/icon-maskable-192.png` - odświeżona maskable ikona z większym paddingiem.
* `icons/icon-maskable-512.png` - odświeżona maskable ikona z większym paddingiem.
* `reports/pwa_menu_layer_light_icon_fix_v03.md` - raport etapu.
* `ai_handoff/handoff_2026-07-05_pwa-menu-layer-light-icon-fix-v03.md` - ten handoff.

## 6. Decyzje techniczne

* Dolny pasek potraktowano jako problem zamkniętego bottom sheetu, bo test na telefonie pokazał, że pasek znika po otwarciu menu.
* Nie usuwano safe-area obsługi, tylko poprawiono transform zamkniętego menu tak, żeby sheet znikał niżej niż samo `100%`.
* Nie zmieniano JS toggle, bo istniejące `openMenu()`, `toggleMenu()`, `closeMenu()` już obsługują Menu, X i backdrop.
* Ikony wygenerowano lokalnie z transparentnego źródła `zmiany/logo/logo-bez-tla.png`, bez zewnętrznych assetów.
* Service worker dostał tylko bump cache name, bez przebudowy logiki.

## 7. Testy i walidacja

Wykonano:

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `git diff --check`
* `git diff -- db.js`
* wyszukiwanie sekretów i destrukcyjnych operacji storage

Wyniki:

* `node --check app.js` - OK.
* `node --check config.js` - OK.
* `node --check service-worker.js` - OK.
* `git diff --check` - OK; tylko ostrzeżenia Git o przyszłej zamianie LF na CRLF.
* `git diff -- db.js` - pusty.
* Brak trafień w kodzie dla `OPENAI_API_KEY`, `sk-`, `service_role`, `localStorage.clear`, `indexedDB.deleteDatabase`, `clearData`, `deleteDatabase`, `reset app`.

## 8. Bezpieczeństwo

* Backend nie był zmieniany.
* Supabase nie był zmieniany.
* Parser AI, food-lookup, nutrienty i hybrid merge nie były zmieniane.
* `db.js` nie był edytowany.
* IndexedDB/cache nie były czyszczone.
* Płatne API nie było użyte.
* Deploy nie był wykonany.
* Push nie był wykonany.

## 9. Git

* Git status przed commitem: zmodyfikowane pliki CSS/PWA/icon/config oraz dwa stare niepowiązane untracked pliki z poprzedniego audytu.
* Czy wykonano commit: tak, po pozytywnej walidacji.
* Komunikat commita: `Fix PWA menu layering and light icon polish`
* Hash commita: do uzupełnienia po commicie.
* Git status po commicie: do uzupełnienia po commicie.
* Czy branch jest przed origin/main: branch `ui-mobile-shell`; stan względem `origin/ui-mobile-shell` do sprawdzenia po commicie.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Realne potwierdzenie braku dolnego paska wymaga testu na telefonie/PWA po pobraniu cache `v37`.
* Systemowego splash PWA nie da się czasowo sterować z JS/CSS; można kontrolować tylko manifest/icon/background oraz custom splash poza standalone.
* Etap nie sprawdzał ani nie zmieniał logiki nutrientów i danych.

## 11. Następny najlepszy krok

Po commicie sprawdzić na telefonie PWA: zamknięte menu bez dolnego paska, bottom nav nad menu, animacja 1.3s, neutralny light mode i ikony z większym paddingiem.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracujemy w `C:\Users\nikto\Desktop\Dieta`, branch `ui-mobile-shell`. Ostatni etap miał naprawić dolny biały pasek jako problem zamkniętego menu bottom sheet, rozjaśnić light mode do neutralnego popielatego near-white i zwiększyć padding ikon PWA. Nie pushuj, nie deployuj, nie czyść IndexedDB/cache, nie ruszaj backendu/Supabase/db.js/parsera/food-lookup/nutrientów. Najpierw sprawdź `git status --short --branch` i `git log --oneline -8`, przeczytaj `reports/pwa_menu_layer_light_icon_fix_v03.md`, a potem zweryfikuj na telefonie/PWA cache `vitatrack-mobile-shell-v37`: czy zamknięte menu nie zostawia paska pod bottom nav, czy menu otwiera się nad nav, czy nav jest najwyżej, czy animacja jest płynna ok. 1.3s, czy light mode jest neutralny, i czy ikony PWA mają większy padding.

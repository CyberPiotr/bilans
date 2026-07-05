# UI chat input and mobile layout fix v01

Data: 2026-07-05
Repo: `C:\Users\nikto\Desktop\Dieta`
Branch: `ui-mobile-shell`
Commit bazowy: `6406f46 Refine Cyber Zdrowie mobile layout`

## Cel

Druga korekta po podglądzie mobilnym: wycentrować Home, oczyścić widok Dania i upewnić się, że Czat ma realny input oraz segment trybów.

## Home

- Dodano końcowe override CSS dla `body[data-current-view="start"]`, które centruje kartę Home w dostępnej przestrzeni między top barem, segmentem zakresu i bottom nav.
- Gdy zawartość się nie mieści, karta zachowuje scroll przez istniejące `overflow: auto`.
- Widok Today powinien mieścić się bez scrolla na typowym mobile viewport; sprawdzono lokalnie 390x844.
- Dla niskich viewportów dodano ciaśniejsze wysokości gauge bez mikroskopijnego tekstu.

## Dania

Usunięto z widoku Dania przez CSS:

- nagłówek `Zapisane przepisy`;
- duży tytuł `Moje dania`;
- opis pod nagłówkiem;
- kartę/formularz `Utwórz danie do porcjowania`;
- input tworzenia dania.

Zostaje lista zapisanych dań i empty state z istniejącego renderera. Funkcja zapisywania dania nie została usunięta.

## Czat

- Czat ma widoczny input nad bottom nav.
- Segment trybów jest widoczny w Czat i ma etykiety: `Posiłek`, `Wpis`, `Danie`.
- Przycisk wysyłania używa `zmiany/ikony/wyslij.svg`.
- Obszar rozmowy jest podciągnięty bliżej top bara i nie nachodzi na composer ani bottom nav.
- Composer kończy się nad bottom nav; lokalny pomiar 390x844: `composerBottom = navTop = 786`.

## Tryby Czat

- `Posiłek`: realnie podpięty do istniejącej logiki `handleAiParse()`.
- `Wpis`: lokalny stub bez backendu rozmowy i bez API.
- `Danie`: realnie podpięty do istniejącej ścieżki `requestAiParse(input, "parse_dish")` + `saveAiDish(...)` z poprzedniego etapu; w tym etapie nie zmieniano tej logiki.

## Input routing

- Home: input ukryty.
- Dania: input ukryty.
- Czat: input widoczny.
- Tryby mają osobne drafty i osobne placeholdery z istniejącego `app.js`.

## Walidacja

Uruchomiono:

- `node --check app.js` - OK
- `node --check config.js` - OK
- `node --check service-worker.js` - OK
- `git diff --check` - OK; tylko ostrzeżenia Git o przyszłej zamianie LF na CRLF
- `git diff -- db.js` - OK, brak diffu
- `rg -n "OPENAI_API_KEY|sk-|service_role|localStorage\.clear|indexedDB\.deleteDatabase|clearData|deleteDatabase" app.js index.html style.css config.js service-worker.js` - brak trafień

Lokalny podgląd w przeglądarce na `http://127.0.0.1:8787/`, viewport 390x844:

- Home: `composerDisplay = none`, `navWidth = 390`, `dishCreateDisplay = none`;
- Dania: `composerDisplay = none`, `dishHeaderDisplay = none`, `dishCreateDisplay = none`;
- Czat: `composerDisplay = grid`, textarea widoczna, tryby `Posiłek/Wpis/Danie` widoczne, ikona `zmiany/ikony/wyslij.svg`;
- tryb `Danie`: aktywny mode `dish`, aria-label `Utwórz danie do zapisania przez AI`;
- tryb `Wpis`: aktywny mode `note`, aria-label `Wyślij wpis`.

## Bezpieczeństwo

- `db.js` nietknięty.
- Nie zmieniano backendu, Supabase, parsera AI, food-lookup, nutrientów ani hybrid merge.
- Nie czyszczono IndexedDB ani cache.
- Nie odpalano płatnych API.
- Nie wykonano deploya ani push.

## Ręcznie sprawdzić

- Na telefonie/PWA po odświeżeniu: Home Today bez scrolla, 3 dni kompaktowe, 7 dni dopuszczalnie scrolluje.
- Dania: tylko lista/empty state, bez formularza tworzenia.
- Czat: input widoczny, tryby działają wizualnie, `Posiłek` i `Danie` uruchamiają właściwe akcje dopiero po kliknięciu użytkownika.

# UI mobile layout correction v01

Data: 2026-07-05
Repo: `C:\Users\nikto\Desktop\Dieta`
Branch: `ui-mobile-shell`
Commit bazowy: `23e6b64 Redesign Cyber Zdrowie mobile UI`

## Cel

Skorygować układ mobilny po pełnym redesignie Cyber Zdrowie bez zmian w liczeniu kalorii/makro, food-lookup, AI parserze, hybrid nutrient merge, backendzie, Supabase i `db.js`.

## Zmiany

- Top bar:
  - brand/logo jest wyrównany do lewej;
  - usunięto linię/separator pod top barem;
  - dodano krótką etykietę aktualnego widoku po prawej stronie.
- Bottom nav:
  - dolna nawigacja jest pełnej szerokości w obszarze aplikacji;
  - usunięto efekt pływającej karty z bocznymi marginesami;
  - input nie pojawia się na Home ani w Moich daniach.
- Home:
  - przełącznik `1 dzień / 3 dni / 7 dni` jest stałym, cienkim paskiem nad bottom nav;
  - karty gauge zostały zmniejszone i mieszczą się lepiej na niskich ekranach.
- Czat:
  - composer jest aktywny tylko w widoku Czat;
  - dodano tryby `Posiłek`, `Wpis`, `Danie do zapisania`;
  - `Posiłek` używa istniejącej ścieżki `handleAiParse()`;
  - `Danie do zapisania` używa istniejących `requestAiParse(..., "parse_dish")` i `saveAiDish(...)`;
  - `Wpis` pozostaje UI-stubem bez backendu rozmowy.
- Moje dania:
  - ukryto stary panel tworzenia dania;
  - lista zapisanych dań i dodawanie porcji pozostają bez zmian.
- Historia/Menu:
  - nagłówek historii jest schowany, a kontekst daje top bar;
  - menu jest togglowane z bottom nav i wysuwa się między top barem a bottom nav;
  - dodano `Usuń całą historię` w menu z mocnym confirmem.
- PWA:
  - podbito wersję shell/cache do `vitatrack-mobile-shell-v32`.

## Bezpieczeństwo danych

- Nie ruszano `db.js`.
- Nie zmieniano Supabase, endpointów, food-lookup ani parse_dish.
- Nie czyszczono IndexedDB ani cache.
- Nie dodano `localStorage.clear()`, `indexedDB.deleteDatabase()`, globalnego resetu ani clearData.
- Nowa akcja `Usuń całą historię` kasuje wyłącznie lokalne wpisy historii przez `window.ketoDb.deleteEntry(id)` po confirmie.
- Przepisy, ustawienia i inne dane aplikacji zostają bez zmian.

## Walidacja

Uruchomiono:

- `node --check app.js` - OK
- `node --check config.js` - OK
- `node --check service-worker.js` - OK
- `git diff --check` - OK; tylko ostrzeżenia PowerShell/Git o przyszłej zamianie LF na CRLF
- `git diff -- db.js` - OK, brak diffu
- `rg -n "Usuń dane|Usuń przepis|clearData|localStorage\.clear|indexedDB\.deleteDatabase|reset app|delete-custom-dish-from-missing" app.js index.html style.css config.js service-worker.js` - brak trafień

Nie wykonywano testu wizualnego w przeglądarce ani manualnego testu PWA na telefonie.

## Pliki zmienione

- `index.html` - etykieta widoku w top barze, ukrycie starego tworzenia dań, tryby composera w Czat, przycisk czyszczenia historii w menu.
- `app.js` - routing trybów composera, tworzenie dania z Czatu, toggle menu, etykieta widoku, kasowanie całej historii wyłącznie przez `deleteEntry`.
- `style.css` - korekta układu top bar/menu/Home/Czat/bottom nav.
- `config.js` - wersja `vitatrack-mobile-shell-v32`, opis ostatniej zmiany.
- `service-worker.js` - wersja cache `vitatrack-mobile-shell-v32`.

## Decyzja

Zmiana jest frontendowa i lokalna. Nie naprawia backendu ani nutrientów. Najbliższy krok to ręczny test na telefonie/PWA po twardym odświeżeniu.

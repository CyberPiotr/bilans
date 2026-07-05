# UI full redesign stage 2 v01

## Zakres

Wykonano drugi etap redesignu aplikacji Cyber Zdrowie: bottom sheet menu, dolna nawigacja 5 pozycji, osobny floating input bar, dashboard Home w formie gauge oraz prosty widok Czat jako UI stub. Nie zmieniano logiki zywieniowej, AI Parsera, food-lookup, hybrydowego merge AI fallback + food-lookup, IndexedDB ani `db.js`.

## Stan startowy

`git status --short --branch`:

```txt
## ui-mobile-shell...origin/ui-mobile-shell [ahead 5]
?? ai_handoff/handoff_2026-07-05_local-vs-github-pwa-nutrients-diff-audit-v01.md
?? reports/local_vs_github_pwa_nutrients_diff_audit_v01.md
```

`git log --oneline -10` zaczynal sie od:

```txt
0d58e16 Add Cyber Zdrowie branding and PWA assets
9c6288f Merge AI fallback nutrients with food lookup data
1bc48a7 Fix dashboard micro nutrients and range aggregation
1657764 Show nutrient values in food lookup debug
982b6d0 Debug VitaTrack frontend food lookup food form flow
e946396 Separate temporary and permanent missing food removal
b98baf5 Remove recipe deletion from missing foods panel
416f2f9 Fix unsafe missing food delete actions
6d82681 Polish custom dish source badges and delete actions
90b3f9a Improve custom dish data source badges
```

Stare nie sledzone pliki audytu zostawiono bez zmian i poza zakresem.

## Przeczytane dokumenty

- `reports/ui_branding_pwa_assets_stage1_v01.md`
- `ai_handoff/handoff_2026-07-05_ui-branding-pwa-assets-stage1-v01.md`
- `zmiany/VITATRACK_UI_SOURCE_OF_TRUTH.md`
- `zmiany/VITATRACK_UI_CHANGE_PLAN_FOR_CODEX.md`
- `ui_context/current-ui-map.md`

Pliku `current-ui-map.md` w root repo nie ma; istnieje i zostal przeczytany wariant `ui_context/current-ui-map.md`.

## Assety

Znalezione:

- `zmiany/logo/logo.png`
- `zmiany/logo/logo-bez-tla.png`
- `zmiany/ikony/historia.svg`
- `zmiany/ikony/menu.svg`
- `zmiany/ikony/home.svg`
- `zmiany/ikony/dania.svg`
- `zmiany/ikony/chat.svg`
- `zmiany/ikony/wyślij.svg`

Naprawione:

- dodano kopie `zmiany/ikony/wyslij.svg` z istniejacego `zmiany/ikony/wyślij.svg`;
- w kodzie uzywana jest sciezka bez polskiego znaku: `zmiany/ikony/wyslij.svg`;
- zachowano oba pliki, zeby uniknac ryzyka na Windows/Git.

Brakujace po naprawie:

- brak.

## Zmienione pliki

- `index.html` - struktura top bar, bottom sheet menu, bottom nav, chat view, composer.
- `style.css` - tokeny, bottom sheet, nav, floating input, gauge, chat, mobile safe areas.
- `app.js` - renderer gauge, tryb composera Home/Czat, eventy menu, chat UI stub.
- `service-worker.js` - cache `v31` i nowe assety SVG w `APP_SHELL`.
- `config.js` - debugowa wersja aplikacji `vitatrack-mobile-shell-v31` i opis ostatniej zmiany.
- `zmiany/ikony/wyslij.svg` - kopia assetu wysylania bez polskiego znaku.
- `reports/ui_full_redesign_stage2_v01.md` - ten raport.
- `ai_handoff/handoff_2026-07-05_ui-full-redesign-stage2-v01.md` - handoff etapu.

## Top bar

Zmieniono top bar na prosty branding:

- zostaje logo + `Cyber Zdrowie`;
- usunieto widoczne przyciski hamburger, plus, kalendarz i install z top bara;
- kalendarz i install przeniesiono do menu;
- top bar ma wysokosc okolo 56px i obsluguje `env(safe-area-inset-top)`.

## Menu

Menu boczne zostalo zastapione bottom sheetem:

- otwierane przez pozycje `Menu` w dolnej nawigacji;
- wysuwa sie od dolu przez `translateY(112%) -> translateY(0)`;
- ma czas animacji 250 ms i `prefers-reduced-motion`;
- nie nachodzi na top bar ani bottom nav;
- ma header `Cyber Zdrowie`;
- ma szybkie akcje: `Data wpisu`, `Eksport danych`, `Dodaj do telefonu`;
- ma tekst `Zaprojektowane przez CyberPiotr`;
- zamyka sie przez dolny, wysrodkowany `X`;
- Debug AI zostal zachowany w menu.

## Bottom nav

Dolna nawigacja ma teraz 5 pozycji:

- Historia
- Menu
- Home
- Dania
- Czat

Ikony sa ladowane z `zmiany/ikony/*.svg`. `Dodaj` zostalo usuniete z bottom nav. Home na srodku prowadzi do dashboardu.

## Floating input

Composer zostal oddzielony wizualnie od bottom nav:

- jest osobnym floating input barem nad nawigacja;
- ma szklana powierzchnie, max radius 16px i safe area bottom;
- ma tylko input, `X` czyszczenia i przycisk wysylania z `zmiany/ikony/wyslij.svg`;
- usunieto przykladowy placeholder typu `jajka 120 g`;
- na Home placeholder to `Opisz posiłek...`;
- na Czat placeholder to `Napisz wiadomość...`;
- `#raw-input`, `#ai-parse-button`, `#save-button`, `#clear-button`, `#cancel-edit-button`, `#form-message` zostaly zachowane.

Dodawanie posilku nadal idzie przez istniejace `handleAiParse()` i `saveAiMeal()` / `saveAiDish()`. Edycja wpisow i dan zostala zabezpieczona przed nadpisaniem przez drafty composera.

## Dashboard gauge

`renderHomeProgress()` renderuje teraz gauge cards zamiast poziomych paskow.

Nie zmieniono:

- `sumNutrient()`;
- `getEntriesForDays()`;
- `getStatus()`;
- hybrydowego merge lookup + AI fallback;
- obliczen kalorii/makro/mikro.

Gauge pokazuje:

- nazwe nutrientu;
- aktualna wartosc;
- cel lub zakres;
- status `OK` / `brakuje` / `przekroczone`;
- wypelnienie przez `conic-gradient`.

Uklady:

- Dzisiaj: Kalorie jako duzy gauge, nizej makro i elektrolity.
- 3 dni: rowne gauge, ostatni element moze byc wycentrowany.
- 7 dni: rowna siatka 2 kolumny.

## Czat

Dodano widok `Czat`:

- lista wiadomosci;
- wiadomosc uzytkownika jako jasna chmurka;
- wiadomosc AI jako zielona chmurka;
- input korzysta wizualnie z tego samego floating input bara;
- backend czatu nie jest podpinany;
- historia czatu nie jest zapisywana do bazy;
- wyslanie wiadomosci dodaje lokalny stub odpowiedzi bez uzycia API.

## Zachowane funkcje

- Kalendarz: zachowany przez `#date-picker-button` w menu i istniejacy `#entry-date`.
- Eksport danych: zachowany przez `#menu-export-button` i istniejacy `handleExport()`.
- Eksport brakow, import, ustawienia, Debug AI, historia, dania, braki w bazie: zachowane.
- Dodawanie posilku: zachowane przez `handleComposerPrimaryAction()` -> `handleAiParse()` w trybie Home.
- Czat nie wywoluje AI Parsera ani zadnego backendu.

## Light / dark mode

Kodowo zachowano przełącznik Systemowy / Jasny / Ciemny.

Zmiany:

- jasny motyw przesunieto w kierunku kremowym;
- dark mode zostal zachowany;
- nowe komponenty uzywaja zmiennych CSS i dzialaja z tokenami light/dark;
- radius duzych kontenerow utrzymany w okolicy 16px.

## Service worker / cache

Zaktualizowano:

- `CACHE_NAME`: `vitatrack-mobile-shell-v30` -> `vitatrack-mobile-shell-v31`;
- dodano do `APP_SHELL`:
  - `./zmiany/ikony/historia.svg`
  - `./zmiany/ikony/menu.svg`
  - `./zmiany/ikony/home.svg`
  - `./zmiany/ikony/dania.svg`
  - `./zmiany/ikony/chat.svg`
  - `./zmiany/ikony/wyslij.svg`

Manifest PWA byl zaktualizowany w etapie 1 i nie wymagal zmiany w etapie 2.

## Walidacja

Uruchomiono:

- `node --check app.js` - OK
- `node --check config.js` - OK
- `node --check service-worker.js` - OK
- `git diff --check` - OK
- `git diff -- db.js` - pusty diff

Skan destrukcyjny / sekretow:

- nie dodano service-role;
- nie dodano kluczy OpenAI;
- nie dodano prefiksow sekretow OpenAI;
- nie dodano globalnego czyszczenia localStorage;
- nie dodano kasowania bazy IndexedDB;
- nie dodano globalnych resetow danych aplikacji.

## Do recznego sprawdzenia lokalnie

1. Twardo odswiez lokalna aplikacje, zeby service worker pobral `v31`.
2. Sprawdz top bar: tylko logo + `Cyber Zdrowie`.
3. Sprawdz bottom nav: Historia / Menu / Home / Dania / Czat.
4. Otworz Menu: powinno wysunac sie od dolu, miec akcje daty/eksportu i dolny X.
5. Kliknij `Data wpisu` w menu i potwierdz, ze otwiera wybor daty.
6. Kliknij `Eksport danych` w menu i potwierdz, ze pobiera JSON.
7. Na Home wpisz posilek i potwierdz, ze przycisk wysylania nadal uruchamia dodawanie posilku.
8. W Czat wpisz wiadomosc i potwierdz, ze pojawia sie lokalna odpowiedz stub.
9. Sprawdz Dzisiaj / 3 dni / 7 dni: gauge powinny zmieniac zestaw nutrientow bez zmiany obliczen.
10. Sprawdz light/dark/system i male wysokosci ekranu ok. 667 / 740 / 844 px.

## Decyzja

`UI_FULL_REDESIGN_NEEDS_MANUAL_REVIEW`

Powod: walidacje kodowe przeszly, ale tak szeroka zmiana layoutu wymaga jeszcze recznego sprawdzenia w przegladarce/PWA na realnym viewportcie mobilnym.

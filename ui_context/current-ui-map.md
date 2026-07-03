# Current UI Map — VitaTrack / Bilans

Dokument opisuje aktualny wyglad i strukture UI. Ma sluzyc jako kontekst dla kolejnego modelu proponujacego poprawki UI/UX. Nie jest specyfikacja zmian.

## 1. Glowne widoki aplikacji

### Historia

Uzytkownik widzi liste ostatnich wpisow z lokalnej historii. Kazdy wpis jest karta z data, badge zrodla danych, makro oraz rozwijanymi szczegolami.

Glowne sekcje:
- Naglowek: `Historia`, licznik wpisow.
- Lista: `#entries-list`, karty `.entry-item`.
- Szczegoly wpisu: `details.entry-details`.

Przyciski:
- `Edytuj`: przenosi wpis do glownego composera i pozwala zapisac zmiany.
- `Usun`: usuwa wpis z historii po potwierdzeniu.
- `Szczegoly wpisu`: rozwija raw text, zrodlo i produkty.

Inputy:
- W samym widoku historii brak inputow.
- Edycja wpisu odbywa sie w glownym composerze.

Badge/statusy:
- `.source-badge.database`: `Baza`.
- `.source-badge.proxy`: `! Baza proxy`.
- `.source-badge.missing`: `! Brak w bazie`.
- `.source-badge.mixed`: wpis mieszany, obecnie rozbijany na pille `Baza/proxy` i `Brak: 1+`.
- `.source-badge.error`: `! Blad bazy / AI`.
- `.source-badge.custom-dish`: `Danie wlasne`.
- `.source-badge.unknown`: `Zrodlo nieznane`.

### Menu / Braki w bazie

Menu boczne otwiera sie przyciskiem hamburgera. Zawiera nawigacje do widokow i panel `Debug AI`.

Glowne sekcje menu:
- `.menu-header`: nazwa aplikacji i zamkniecie menu.
- `.menu-nav`: przyciski nawigacji: Start, Co warto, Realizacja celow, Historia, Moje dania, Moje cele, Braki w bazie, Kopia zapasowa, Ustawienia / Wyglad.
- `.menu-debug`: zwijany panel diagnostyczny AI i food-lookup.
- `.menu-storage`: status pamieci trwalej.

Widok `Braki w bazie`:
- Naglowek: `Braki w bazie`.
- Panel `.missing-foods-panel`.
- Podsumowanie `#missing-foods-summary`.
- Lista `#missing-foods-list`.
- Komunikat `#missing-foods-message`.

Przyciski:
- `Eksportuj braki w bazie`: eksportuje aktywne braki do JSON.
- `Wyczysc ukryte braki`: czysci lokalna liste ukrytych brakow.
- Przy karcie braku: `Oznacz jako obsluzone` i `Usun z listy` ukrywaja brak lokalnie w `localStorage`.
- Przy braku z historii: `Usun wpis z historii` usuwa caly wpis historii po `confirm`.

Inputy:
- Brak inputow w panelu brakow.

Badge/statusy:
- Braki maja licznik `.missing-food-count`, meta z gramatura, zrodlem, nazwa dania lub data.
- Brak z dania ma zrodlo `Moje danie` i notatke, ze wartosci dania dotycza calego przepisu, nie skladnika.

### Moje dania

Widok sluzy do tworzenia przepisow, przegladania zapisanych dan i dodawania porcji do historii.

Glowne sekcje:
- Naglowek: `Moje dania`.
- Panel `.dish-create-panel`: tworzenie dania przez AI.
- Lista `#dishes-list`: karty `.dish-card`.
- Komunikat `#dishes-message`.

Przyciski:
- W panelu tworzenia: przycisk AI `#dish-ai-create-button` wysyla `parse_dish`.
- `#dish-ai-clear-button`: czysci opis dania.
- Na karcie dania: `Dodaj` dodaje porcje dania do historii.
- Na karcie dania: `Edytuj` przenosi raw text dania do glownego composera.
- Na karcie dania: `Usun` usuwa zapisane danie.

Inputy:
- `#dish-ai-input`: opis dania do porcjowania, np. `gulasz: wolowina 600 g... Calosc po ugotowaniu 1200 g`.
- Input porcji w kazdej karcie dania: gramatura porcji do dodania do historii.

Badge/statusy:
- `.dish-source.database`: skladniki z bazy.
- `.dish-source.proxy`: skladniki baza/proxy.
- `.dish-source.mixed`: skladniki baza + brak.
- `.dish-source.missing`: braki w bazie.
- `.dish-source.error`: blad lookupu.
- `.dish-products`: lista skladnikow z opisem `baza`, `baza proxy`, `brak w bazie / AI fallback`, `blad bazy`.

### Dodaj / glowny composer

Glowny composer jest stale na dole aplikacji, ale input widoczny jest przede wszystkim w widoku Start. Dolna nawigacja zostaje widoczna na dole.

Glowne sekcje:
- `.composer-shell`: dolny pasek dodawania.
- `.composer-input-area`: textarea i przyciski inputu.
- `.bottom-nav`: Historia, Menu, Dania, Dodaj.

Przyciski:
- `#ai-parse-button`: wysyla opis posilku do AI Parsera jako `parse_meal`.
- `#save-button`: zapisuje stary tekstowy format Gema, gdy jest widoczny.
- `#clear-button`: czysci pole.
- `#cancel-edit-button`: anuluje edycje.
- `#top-add-button` i `#bottom-add-button`: kieruja do glownego dodawania.
- `#date-picker-button`: wybiera date wpisu.

Inputy:
- `#raw-input`: naturalny opis posilku albo tekstowy format Gema.
- `#entry-date`: ukryty input daty.

Badge/statusy:
- Komunikaty w `#form-message`.
- Przy loadingu przycisk AI dostaje `.loading`.

## 2. Kolory i statusy jakosci danych

- Zielony: dane z bazy lub pozytywny status. Klasy: `.source-badge.database`, `.dish-source.database`, `--app-success`, `--app-success-bg`.
- Pomaranczowy / proxy: baza proxy lub wymaga potwierdzenia. Klasy: `.source-badge.proxy`, `.dish-source.proxy`, `.dish-source.mixed`, `--app-warning`, `--app-warning-bg`.
- Czerwony: brak w bazie, fallback AI, blad bazy/AI. Klasy: `.source-badge.missing`, `.source-badge.error`, `.dish-source.missing`, `.dish-source.error`, `--app-danger`, `--app-danger-bg`.
- Szary / neutralny: zrodlo nieznane, panele pomocnicze, tlo detali. Klasy: `.source-badge.unknown`, `.entry-source`, `.entry-products`, `.missing-food-note`, `--app-muted`, `--app-surface-soft`.
- Danie wlasne: obecnie zielonkawo-neutralne, `.source-badge.custom-dish`, oparte o `--app-tag-bg` i `--app-accent-strong`.

## 3. Wazne flow

### Dodanie zwyklego posilku

1. Uzytkownik wpisuje opis w `#raw-input`.
2. Klikniecie `#ai-parse-button` wywoluje `parse_meal`.
3. AI zwraca produkty i nutrienty.
4. Aplikacja probuje food-lookup per produkt.
5. Jesli baza dopasuje wszystkie produkty, wpis dostaje zrodlo `Baza` lub `Baza proxy`.
6. Jesli lookup nie wystarczy, aplikacja zapisuje fallback AI z odpowiednim zrodlem.
7. Wpis pojawia sie w Historii.

### Posiłek mieszany baza + brak

1. AI rozpoznaje kilka produktow.
2. Food-lookup znajduje czesc produktow, a czesc zwraca `not_found`.
3. Cala wartosc posilku moze nadal pochodzic z AI fallback.
4. Historia pokazuje wpis jako mieszany, np. `Baza/proxy` + `Brak: 1+`.
5. W szczegolach produkty maja osobne statusy.
6. Panel `Braki w bazie` pokazuje tylko brakujace produkty, nie wszystkie skladniki.

### Panel Braki w bazie

1. Panel liczy braki z historii oraz z zapisanych `customDishes`.
2. Produkty z `lookupStatus: not_found` albo `dataSourceType: ai_fallback_missing` trafiaja na liste.
3. Braki z historii moga miec akcje usuniecia calego wpisu historii.
4. Braki z dan maja zrodlo `Moje danie` i nazwe dania.
5. Eksport JSON obejmuje aktywne braki i pomija ukryte.

### Tworzenie dania w Moje dania

1. Uzytkownik wpisuje opis w `#dish-ai-input`.
2. Klikniecie przycisku AI wywoluje `parse_dish`.
3. Aplikacja wymaga masy calosci dania, np. `Calosc po ugotowaniu 1200 g`.
4. `totalData` i `per100gData` sa zapisywane w daniu.
5. Food-lookup jest wykonywany per skladnik dania, bez przeliczania totalData z bazy.
6. Karta dania pokazuje mase, makro / 100 g, status skladnikow, tagi, liste skladnikow i input porcji.

### Dodanie porcji dania do historii

1. Uzytkownik wpisuje gramature porcji w karcie dania.
2. Klikniecie `Dodaj` tworzy wpis historii.
3. Porcja liczy sie wedlug `portionG / dish.totalMassG * dish.totalData`.
4. Historia pokazuje zrodlo `Danie wlasne`.
5. Produkt w historii ma nazwe dania, np. `gulasz — 100 g`, nie UUID.
6. Nie powstaje falszywy brak z nazwy dania.

## 4. Najwazniejsze pliki UI

- `index.html`: struktura widokow, menu, composerow, paneli i przyciskow.
- `style.css`: zmienne kolorow, layout mobile, karty, badge, menu, composer, panel brakow, karty dan.
- `app.js`: renderowanie widokow, obsluga eventow, AI Parser, food-lookup, IndexedDB API przez `window.ketoDb`, logika statusow i eksportow.

## 5. Najwazniejsze klasy CSS i komponenty

- Layout: `.app-bar`, `.app-content`, `.app-view`, `.view-header`, `.surface-card`.
- Menu: `.menu-backdrop`, `.app-menu`, `.menu-header`, `.menu-nav`, `.menu-debug`, `.app-debug-panel`, `.menu-storage`.
- Composer: `.composer-shell`, `.composer-input-area`, `.composer`, `.composer-ai`, `.composer-clear`, `.composer-send`, `.composer-feedback`, `.bottom-nav`.
- Historia: `.entry-item`, `.entry-top`, `.entry-date`, `.entry-actions`, `.entry-details`, `.entry-source`, `.entry-products`, `.macro-list`, `.macro`.
- Badge zrodla: `.source-badge-group`, `.source-badge`, `.source-badge.database`, `.source-badge.proxy`, `.source-badge.mixed`, `.source-badge.missing`, `.source-badge.error`, `.source-badge.custom-dish`, `.source-badge.unknown`.
- Braki w bazie: `.missing-foods-panel`, `.missing-foods-panel-header`, `.missing-foods-actions`, `.missing-foods-list`, `.missing-food-item`, `.missing-food-count`, `.missing-food-meta`, `.missing-food-source`, `.missing-food-note`, `.missing-food-actions`.
- Moje dania: `.dish-create-panel`, `.dish-create-composer`, `.dish-card`, `.dish-macro`, `.dish-source`, `.dish-products`, `.dish-portion`, `.dish-actions`, `.dish-delete`, `.dish-empty`.
- Tagi/statusy: `.tag-list`, `.tag`, `.status`, `.priority-chip`.

## 6. Problemy UI do poprawy pozniej

- Statusy zrodel sa funkcjonalne, ale rozproszone: Historia, Moje dania i Braki w bazie maja podobne informacje pokazane roznymi wzorcami.
- Panel `Braki w bazie` moze byc gesty informacyjnie, szczegolnie gdy braki pochodza jednoczesnie z historii i dan.
- `Moje dania` pokazuje duzo informacji na jednej karcie: makro, zrodlo, tagi, skladniki, porcjowanie, edycja i usuwanie.
- Glowny composer i composer dan sa podobne wizualnie, ale maja inne skutki; warto pozniej mocniej rozroznic `posilek do historii` vs `danie do porcjowania`.
- Kolor `Danie wlasne` jest bliski zieleni sukcesu, co moze mieszac sie z `Baza`.
- Status mieszany `Baza/proxy + brak` wymaga dobrego copy, zeby uzytkownik rozumial, ze nutrienty moga pochodzic z AI fallback.
- Dolny composer jest ukrywany poza widokiem Start, ale dolna nawigacja zostaje; warto sprawdzic ergonomie na malym ekranie.
- Debug AI jest w menu, ale nadal zawiera duzo informacji technicznych i moze dominowac menu podczas testow.

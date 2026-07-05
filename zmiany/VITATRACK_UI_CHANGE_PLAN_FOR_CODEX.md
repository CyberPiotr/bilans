# VitaTrack UI — plan zmian dla Codexa

Wersja: 1.0 robocza
Cel: instrukcja wykonawcza dla Codexa, co dokładnie zmienić w UI aplikacji VitaTrack / Bilans.

---

## 0. Kontekst

Aplikacja ma obecnie UI opisany w `current-ui-map.md`.

Najważniejsze pliki aplikacji:

```txt
index.html
style.css
app.js
```

Zakres tego zadania: **zmiana wyglądu i układu UI**.

Nie zmieniać logiki żywieniowej, bazy danych, Supabase, IndexedDB, parsera AI, food lookupu ani obliczeń nutrientów, chyba że jest to absolutnie konieczne do podpięcia istniejących przycisków w nowych miejscach.

---

## 1. Pliki, które Codex ma przeczytać na początku

Przed zmianami przeczytaj:

```txt
current-ui-map.md
zmiany/VITATRACK_UI_SOURCE_OF_TRUTH.md
zmiany/VITATRACK_UI_CHANGE_PLAN_FOR_CODEX.md
```

Sprawdź też assety:

```txt
zmiany/ikony/historia.svg
zmiany/ikony/menu.svg
zmiany/ikony/home.svg
zmiany/ikony/dania.svg
zmiany/ikony/chat.svg
zmiany/ikony/wyslij.svg
zmiany/logo/[plik-logo-vitrack]
```

Jeżeli brakuje assetu, nie wymyślaj ścieżki. Zgłoś brak w raporcie.

---

## 2. Bezpieczeństwo pracy

Najpierw wykonaj:

```bash
git status --short
```

Jeżeli repo ma niezatwierdzone zmiany, pokaż je w raporcie i pracuj ostrożnie.

Zasady:

- nie ruszaj danych produkcyjnych,
- nie zmieniaj działania parsera AI,
- nie zmieniaj struktury historii,
- nie zmieniaj schematów danych,
- nie usuwaj istniejących funkcji,
- przenoś funkcje UI, ale zachowuj event handlery,
- preferuj małe, czytelne komponenty i CSS variables.

---

## 3. Design tokens w CSS

W `style.css` uporządkuj lub dodaj tokeny UI zgodne z `VITATRACK_UI_SOURCE_OF_TRUTH.md`.

Wprowadź / zmapuj zmienne:

```css
--vt-bg
--vt-bg-soft
--vt-surface
--vt-surface-solid
--vt-surface-muted
--vt-text
--vt-text-muted
--vt-text-soft
--vt-primary
--vt-primary-strong
--vt-primary-soft
--vt-border
--vt-border-strong
--vt-danger
--vt-warning
--vt-success
--vt-radius-sm
--vt-radius-md
--vt-radius-lg
--vt-space-1 ... --vt-space-7
--vt-shadow-soft
--vt-blur
```

Ważne:

- zachowaj dark mode,
- zachowaj przełącznik Systemowy / Jasny / Ciemny,
- nowe komponenty muszą reagować na motyw,
- nie stosuj radiusów większych niż 16px dla dużych kontenerów,
- nie wprowadzaj losowych kolorów bez tokenów.

---

## 4. Splash screen

Dodać krótki ekran startowy.

### Wymagania

- pokazuje się po uruchomieniu aplikacji,
- pełny ekran,
- tło zgodne z aktualnym motywem,
- logo z `zmiany/logo/` na środku,
- czas około 800–1200 ms,
- po chwili znika i pokazuje aplikację,
- animacja fade / delikatny scale,
- respektuje `prefers-reduced-motion`.

### Uwaga

Nie robić długiego intro. Splash ma być krótki i lekki.

---

## 5. Top bar

Przebudować górny pasek aplikacji.

### Usunąć z top bara

- hamburger menu,
- plus,
- kalendarz,
- pobieranie / eksport.

### Zostawić

- logo,
- nazwę `VitaTrack` albo finalny asset logo, zależnie od pliku w `zmiany/logo/`.

### Ważne

Kalendarz i pobieranie nie mogą zniknąć funkcjonalnie. Mają zostać przeniesione do menu.

---

## 6. Menu jako bottom sheet

Obecne menu boczne z lewej strony zastąpić menu wysuwanym od dołu.

### Zachowanie

- otwiera się po kliknięciu pozycji `Menu` w dolnej nawigacji,
- wysuwa się od dołu,
- zakrywa obszar między top barem a dolną nawigacją,
- nie nachodzi na top bar,
- nie nachodzi na bottom nav,
- zamyka się przez X na dole,
- po zamknięciu zjeżdża w dół.

### Animacja

```css
transform: translateY(100%) -> translateY(0)
transition: transform 220ms-280ms cubic-bezier(0.2, 0, 0, 1)
```

Dodać obsługę `prefers-reduced-motion`.

### Treść menu

Zmień tekst:

```txt
LOKALNIE I OFFLINE
```

na:

```txt
VitaTrack
```

Resztę pozycji zostaw na razie:

```txt
Start
Co warto
Realizacja celów
Historia
Moje dania
Moje cele
Braki w bazie
Kopia zapasowa
Ustawienia / Wygląd
Debug AI
```

### Dodać do menu

- funkcję wyboru daty / kalendarza,
- funkcję pobierania / eksportu,
- tekst `Zaprojektowane przez CyberPiotr`,
- X na dole, wyśrodkowany.

### Uwaga funkcjonalna

Jeżeli obecnie kalendarz używa `#date-picker-button` i `#entry-date`, zachowaj tę logikę, tylko przenieś trigger do menu.

Jeżeli pobieranie / eksport ma istniejący handler, przepnij go do nowego przycisku w menu.

---

## 7. Dolna nawigacja

Zbudować nową dolną nawigację z 5 pozycjami.

Kolejność:

```txt
Historia | Menu | Home | Dania | Czat
```

Assety:

```txt
Historia -> zmiany/ikony/historia.svg
Menu     -> zmiany/ikony/menu.svg
Home     -> zmiany/ikony/home.svg
Dania    -> zmiany/ikony/dania.svg
Czat     -> zmiany/ikony/chat.svg
```

### Zmiany

- usunąć `Dodaj` z dolnej nawigacji,
- dodać `Home` na środku,
- dodać `Czat`,
- `Menu` ma otwierać bottom sheet,
- aktywne stany mają być spójne z motywem.

### Ważne

Dolna nawigacja ma być osobnym komponentem. Nie może być sklejona z input barem.

---

## 8. Floating input bar

Obecny composer przebudować wizualnie na pływający pasek.

### Wymagania wizualne

- osobny element nad dolną nawigacją,
- prawie pełna szerokość ekranu,
- maksymalny radius 16px,
- glass / półprzezroczysta powierzchnia,
- tylko input i przycisk wysyłania,
- przycisk wysyłania używa `zmiany/ikony/wyslij.svg`,
- bez plusa,
- bez mikrofonu,
- bez przykładowego tekstu typu `jajka 120 g...`.

### Wymagania funkcjonalne

Zachować istniejącą logikę dodawania posiłku.

Jeśli obecnie dodawanie posiłku używa:

```txt
#raw-input
#ai-parse-button
#save-button
#clear-button
#cancel-edit-button
#form-message
```

nie usuwać działania tych mechanizmów. Można ukryć / przebudować stare przyciski, ale funkcjonalność ma dalej działać.

### Tryby

Jeżeli aplikacja ma zarówno Home, jak i Czat:

- na Home input może obsługiwać dodawanie posiłku,
- w Czat input może obsługiwać wiadomość czatu,
- wizualnie może to być ten sam komponent,
- logika nie może się mieszać.

Jeżeli endpoint czatu AI nie istnieje, przygotuj tylko UI/stub i opisz to w raporcie.

---

## 9. Dashboard Home — gauge

Zamienić obecne poziome paski progressu na gauge / okrągłe wskaźniki.

### Zachować przełączniki

```txt
Dzisiaj | 3 dni | 7 dni
```

Nie usuwać mechanizmu przełączania.

### Każdy gauge pokazuje

- nazwę nutrientu,
- aktualną wartość,
- cel lub zakres,
- procent realizacji jako zapełnienie.

### Dzisiaj

Układ hierarchiczny:

```txt
[ Kalorie - największy ]

[ Białko ] [ Tłuszcz ] [ Węgle ]

[ Sód ] [ Potas ] [ Magnez ]
```

Na bardzo wąskim ekranie dopasować responsywnie, żeby nic nie było mikroskopijne ani nie nachodziło na bottom nav.

### 3 dni

Wszystkie gauge równe.

Dla 5 elementów:

```txt
[ Sód ]      [ Potas ]
[ Magnez ]   [ Omega-3 ]
       [ Błonnik ]
```

Ostatni element przy nieparzystej liczbie może być wyśrodkowany.

### 7 dni

Wszystkie gauge równe.

Przykład:

```txt
[ Witamina D3 ] [ Witamina A ]
[ Witamina E ]  [ Witamina K2 ]
[ Żelazo ]      [ Cynk ]
[ Selen ]       [ Jod ]
```

### Technicznie

Preferuj CSS/SVG/conic-gradient zamiast ciężkiego canvas, jeśli to wystarczy.

Gauge musi obsłużyć:

- 0%,
- wartości w normie,
- przekroczenie 100%,
- zakresy typu `3500–4500 mg`,
- wartości minimalne typu `min. 56 mg`.

Nie zmieniaj źródłowych obliczeń nutrientów. Zmień tylko prezentację.

---

## 10. Widok Czat

Dodać / przygotować widok `Czat`.

### Layout

- lista wiadomości,
- wiadomości użytkownika jako jasne chmurki,
- wiadomości AI jako zielone chmurki,
- input na dole jako floating input bar,
- prosto i czytelnie.

### Nie robić teraz

- rozbudowanego Messengera,
- avatarów, jeśli nie są potrzebne,
- zaawansowanych reakcji,
- historii czatu w bazie, jeśli nie ma tego w projekcie,
- nowych endpointów bez wyraźnej potrzeby.

Jeśli brak backendu czatu, widok może być przygotowany jako UI placeholder.

---

## 11. Usunięcie stopki spod nawigacji

Usunąć tekst:

```txt
Zaprojektowane przez CyberPiotr
```

z dolnego obszaru pod nawigacją.

Dodać ten tekst w menu, w dolnej części, nad przyciskiem X.

---

## 12. Ustawienia / Wygląd

Widok ustawień ma nadal obsługiwać:

```txt
Systemowy | Jasny | Ciemny
```

Nie usuwać dark mode.

W nowych tokenach upewnić się, że:

- jasny motyw jest bardziej kremowy, mniej zielonkawy,
- ciemny motyw nadal wygląda dobrze,
- wszystkie nowe komponenty mają wariant jasny i ciemny,
- przełączanie motywu działa bez reloadu, jeżeli tak działało wcześniej.

---

## 13. Statusy i inne widoki

Nie robić teraz głębokiego redesignu:

- Historia,
- Moje dania,
- Braki w bazie,
- Moje cele,
- Co warto,
- Realizacja celów.

Ale dostosować je minimalnie do nowych tokenów, żeby nie wyglądały jak stary UI obok nowego.

Priorytet:

- spójne tło,
- spójne karty,
- spójne radiusy do 16px,
- spójne fonty,
- spójne kolory statusów.

---

## 14. Mobile safe areas i klawiatura

Sprawdź:

- iPhone-like viewport,
- Android-like viewport,
- wysokość 667px / 740px / 844px,
- czy input nie nachodzi na bottom nav,
- czy menu nie nachodzi na top bar,
- czy menu nie nachodzi na bottom nav,
- czy dashboard gauge mieści się między top barem a dolnymi elementami,
- czy klawiatura nie blokuje inputa w sposób uniemożliwiający użycie.

Używać:

```css
env(safe-area-inset-bottom)
env(safe-area-inset-top)
```

jeśli projekt już tego wymaga.

---

## 15. Dostępność

Minimum:

- przyciski dotykowe około 44–48px wysokości,
- czytelny kontrast tekstu,
- focus-visible dla interaktywnych elementów,
- aria-label dla przycisków ikonowych,
- respektowanie `prefers-reduced-motion`,
- nie opierać informacji tylko na kolorze.

---

## 16. Kolejność wykonania

Pracuj w tej kolejności:

1. Sprawdź `git status`.
2. Przeczytaj dokumenty i obecne pliki UI.
3. Dodaj / uporządkuj tokeny CSS.
4. Podłącz asset paths z `zmiany/ikony` i `zmiany/logo`.
5. Dodaj splash screen.
6. Uprość top bar.
7. Przenieś kalendarz i eksport do menu.
8. Przebuduj menu na bottom sheet.
9. Przebuduj dolną nawigację na 5 pozycji.
10. Oddziel floating input bar od bottom nav.
11. Zmień dashboard Home z pasków na gauge.
12. Dodaj prosty widok Czat.
13. Przenieś stopkę CyberPiotr do menu.
14. Sprawdź light/dark mode.
15. Sprawdź mobile layout i brak nakładania elementów.
16. Uruchom dostępne testy / lint / build, jeśli projekt je ma.
17. Przygotuj krótki raport.

---

## 17. Raport końcowy Codexa

Na końcu podaj krótko:

```txt
- jakie pliki zmieniono,
- co dokładnie zmieniono,
- czy assety zostały znalezione,
- czy dark/light mode działa,
- czy kalendarz i eksport dalej działają,
- czy dodawanie posiłku dalej działa,
- czy Czat jest realnie podpięty, czy tylko przygotowany jako UI,
- jakie testy / komendy uruchomiono,
- co wymaga ręcznego sprawdzenia w przeglądarce.
```

Nie pisz długiej litanii w czacie, jeśli można utworzyć raport w pliku.

---

## 18. Gotowy prompt do Codexa

```txt
Pracujemy w projekcie VitaTrack / Bilans.

Cel: przebudować UI aplikacji zgodnie z dokumentami w folderze `zmiany/`.

Najpierw przeczytaj:
- `current-ui-map.md`
- `zmiany/VITATRACK_UI_SOURCE_OF_TRUTH.md`
- `zmiany/VITATRACK_UI_CHANGE_PLAN_FOR_CODEX.md`

Sprawdź assety:
- `zmiany/ikony/historia.svg`
- `zmiany/ikony/menu.svg`
- `zmiany/ikony/home.svg`
- `zmiany/ikony/dania.svg`
- `zmiany/ikony/chat.svg`
- `zmiany/ikony/wyslij.svg`
- plik logo w `zmiany/logo/`

Zakres zmian:
1. Dodaj krótki splash screen z logo.
2. Uprość top bar: zostaw tylko logo / VitaTrack; usuń hamburger, plus, kalendarz i eksport z góry.
3. Przenieś kalendarz i eksport do menu, zachowując ich działanie.
4. Zmień menu boczne na bottom sheet wysuwany od dołu, między top barem a bottom nav.
5. Dodaj X zamykający menu na dole, wyśrodkowany; menu ma zjeżdżać w dół.
6. Zmień `LOKALNIE I OFFLINE` na `VitaTrack`.
7. Przenieś `Zaprojektowane przez CyberPiotr` spod dolnej nawigacji do menu.
8. Przebuduj bottom nav na 5 pozycji: Historia, Menu, Home, Dania, Czat. Home ma być na środku. Usuń Dodaj.
9. Oddziel input od bottom nav: floating input bar nad nawigacją, tylko pole tekstowe i przycisk wyślij z `wyslij.svg`.
10. Zamień paski postępu na stronie Home na gauge / okrągłe wskaźniki.
11. Zachowaj przełączniki Dzisiaj / 3 dni / 7 dni.
12. Dla Dzisiaj: największe Kalorie, niżej Białko/Tłuszcz/Węgle, niżej Sód/Potas/Magnez.
13. Dla 3 dni i 7 dni: wszystkie gauge tego samego rozmiaru w estetycznej siatce.
14. Dodaj prosty widok Czat: jasne chmurki użytkownika, zielone chmurki AI.
15. Zachowaj dark mode i przełącznik Systemowy/Jasny/Ciemny.
16. Jasny motyw zmień w kierunku kremowym, mniej zielonkawym.
17. Używaj tokenów CSS, rytmu 8px, fontu Inter/system, radius max 16px.

Bardzo ważne:
- nie zmieniaj logiki żywieniowej,
- nie zmieniaj bazy danych,
- nie zmieniaj parsera AI ani food lookupu,
- nie usuwaj funkcji kalendarza, eksportu ani dodawania posiłku,
- jeśli brakuje assetu, zgłoś to zamiast wymyślać ścieżkę,
- sprawdź light/dark mode i brak nachodzenia elementów na mobile.

Na końcu podaj krótki raport: pliki zmienione, assety znalezione/brakujące, testy uruchomione, rzeczy do ręcznego sprawdzenia.
```

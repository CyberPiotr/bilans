# VitaTrack UI — źródło prawdy wyglądu

Wersja: 1.0 robocza
Cel: jeden dokument, który opisuje docelowy styl VitaTrack po zmianie UI. To ma być stałe źródło prawdy dla Codexa przy pracy nad wyglądem aplikacji.

---

## 1. Kierunek wizualny

VitaTrack ma wyglądać jak nowoczesna, mobilna aplikacja zdrowotno-analityczna, a nie jak formularz webowy.

Docelowy klimat:

- nowocześnie,
- spokojnie,
- premium, ale bez przesady,
- czytelnie,
- mobilnie,
- z delikatnym efektem szkła / glassmorphism,
- z mocną hierarchią informacji,
- bez technicznego chaosu i bez zbędnych ikon.

Nie robimy futurystycznej zabawki. Robimy praktyczny dashboard do codziennego używania.

Najważniejsza zasada: **czytelność i szybkie użycie są ważniejsze niż ozdobniki**.

---

## 2. Materiały w projekcie

Codex dostanie folder:

```txt
zmiany/
```

Docelowa struktura materiałów:

```txt
zmiany/
├── VITATRACK_UI_SOURCE_OF_TRUTH.md
├── VITATRACK_UI_CHANGE_PLAN_FOR_CODEX.md
├── ikony/
│   ├── historia.svg
│   ├── menu.svg
│   ├── home.svg
│   ├── dania.svg
│   ├── chat.svg
│   └── wyslij.svg
└── logo/
    └── [plik-logo-vitrack]
```

Ważne:

- ikonę wysyłania nazwać `wyslij.svg`, bez polskiego znaku,
- ikonki z folderu `ikony/` są źródłem prawdy dla dolnej nawigacji i przycisku wysyłania,
- logo będzie dostarczone osobno w folderze `logo/`,
- jeżeli Codex nie znajdzie assetu, ma nie wymyślać nowej ścieżki, tylko zgłosić brak w raporcie.

---

## 3. Fonty i typografia

Bazowy font:

```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Inter jest preferowany, ale aplikacja ma działać dobrze także na systemowym sans-serif.

### Skala mobilna

```css
--vt-font-xs: 11px;
--vt-font-sm: 12px;
--vt-font-md: 14px;
--vt-font-base: 16px;
--vt-font-lg: 20px;
--vt-font-xl: 24px;
--vt-font-hero: 32px;
```

### Zasady

- Ekran mobilny ma mieć typografię zwartą, ale czytelną.
- Nagłówki nie mogą wyglądać jak wielkie landing page H1.
- Nazwy nutrientów na gauge: krótkie, semibold.
- Wartości liczbowe na gauge: mocniejsze, większe, najlepiej tabular numbers.
- Opisy pomocnicze: mniejsze i przygaszone.

Przykład:

```css
font-variant-numeric: tabular-nums;
```

---

## 4. Spacing / rytm odstępów

Używać rytmu 8px.

Dozwolone wartości bazowe:

```css
4px, 8px, 12px, 16px, 24px, 32px, 48px
```

### Tokeny robocze

```css
--vt-space-1: 4px;
--vt-space-2: 8px;
--vt-space-3: 12px;
--vt-space-4: 16px;
--vt-space-5: 24px;
--vt-space-6: 32px;
--vt-space-7: 48px;
```

### Zasady układu

- boczne marginesy aplikacji: zwykle `16px`,
- odstęp między kartami: `12px` lub `16px`,
- padding kart: `16px`,
- większe sekcje: `24px`,
- unikać losowych wartości typu `13px`, `19px`, `27px`,
- wyjątki tylko dla ikon, borderów, precyzyjnych transformacji i animacji.

---

## 5. Zaokrąglenia

Użytkownik chce maksymalnie 16px zaokrąglenia dla UI.

Tokeny:

```css
--vt-radius-sm: 8px;
--vt-radius-md: 12px;
--vt-radius-lg: 16px;
```

### Zasady

- duże kontenery: maksymalnie `16px`,
- karty: `16px`,
- inputy: `16px`,
- menu / bottom sheet: `16px` w górnych rogach,
- dolna nawigacja: `16px`,
- nie stosować przypadkowego `24px`, `32px`, `9999px` dla dużych elementów.

Wyjątek techniczny:

- okrągłe wskaźniki gauge mogą mieć pełny kształt koła,
- małe ikonowe elementy mogą być kwadratami z radius `12–16px`, nie muszą być idealnymi kółkami.

---

## 6. Kolory — jasny motyw

Obecny jasny motyw jest zbyt zielonkawy. Docelowo ma iść bardziej w kremowy, spokojny, naturalny kierunek.

Propozycja jasnej palety:

```css
:root,
[data-theme="light"] {
  --vt-bg: #F7F2EA;
  --vt-bg-soft: #FBF7EF;
  --vt-surface: rgba(255, 252, 246, 0.78);
  --vt-surface-solid: #FFFCF6;
  --vt-surface-muted: #EFE7DA;

  --vt-text: #152018;
  --vt-text-muted: #667064;
  --vt-text-soft: #8A9288;

  --vt-primary: #138A55;
  --vt-primary-strong: #0B6F43;
  --vt-primary-soft: rgba(19, 138, 85, 0.12);

  --vt-border: rgba(21, 32, 24, 0.12);
  --vt-border-strong: rgba(21, 32, 24, 0.20);

  --vt-danger: #D94A3A;
  --vt-warning: #D99A24;
  --vt-success: #138A55;
}
```

### Uwagi

- Zieleń zostaje jako akcent zdrowotny i statusowy.
- Tło nie ma być miętowe; ma być bardziej kremowe / naturalne.
- Białe karty mają być lekko mleczne, nie krystalicznie białe.
- Tekst musi mieć dobry kontrast.

---

## 7. Kolory — ciemny motyw

Dark mode zostaje.

Docelowo ciemny motyw powinien być spokojny, głęboki, ale nie czysto czarny.

Propozycja dark palette:

```css
[data-theme="dark"] {
  --vt-bg: #07111D;
  --vt-bg-soft: #0B1724;
  --vt-surface: rgba(15, 29, 43, 0.78);
  --vt-surface-solid: #0F1D2B;
  --vt-surface-muted: #142638;

  --vt-text: #F4F7F2;
  --vt-text-muted: #AAB7AE;
  --vt-text-soft: #7F8E85;

  --vt-primary: #37D67A;
  --vt-primary-strong: #65E89B;
  --vt-primary-soft: rgba(55, 214, 122, 0.14);

  --vt-border: rgba(244, 247, 242, 0.12);
  --vt-border-strong: rgba(244, 247, 242, 0.20);

  --vt-danger: #FF7668;
  --vt-warning: #F6BD4B;
  --vt-success: #37D67A;
}
```

### Zasady dark mode

- Nie usuwać przełącznika: Systemowy / Jasny / Ciemny.
- Nie psuć zapisu ustawienia lokalnego.
- Wszystkie nowe komponenty muszą działać w jasnym i ciemnym motywie.
- Glassmorphism w dark mode ma być subtelny, nie mleczny i nie szary jak disabled.

---

## 8. Glassmorphism / efekt szkła

Stosować delikatnie.

Najlepsze miejsca:

- floating input bar,
- dolna nawigacja,
- bottom sheet menu,
- wybrane karty dashboardu,
- gauge cards.

Przykład tokenów:

```css
--vt-glass-bg: rgba(255, 252, 246, 0.72);
--vt-glass-bg-dark: rgba(15, 29, 43, 0.72);
--vt-glass-border: rgba(255, 255, 255, 0.24);
--vt-blur: blur(18px);
--vt-shadow-soft: 0 12px 32px rgba(7, 17, 29, 0.10);
```

### Zasady

- Nie robić ciężkiego rozmycia wszędzie.
- Nie psuć wydajności na telefonie.
- Zawsze dać fallback przez półprzezroczyste tło, gdy `backdrop-filter` nie działa.
- Cień ma być miękki i niski, bez agresywnych czarnych shadow.

---

## 9. Splash screen

Po uruchomieniu aplikacji ma pojawić się krótki ekran startowy.

### Zachowanie

- pełny ekran,
- tło w kolorze/gradiencie zgodnym z motywem,
- logo na środku,
- bardzo krótki czas wyświetlania,
- płynne przejście do UI.

### Parametry robocze

```txt
czas: 800–1200 ms
animacja: opacity + delikatny scale/fade
```

### Zasady

- Nie robić długiego intro.
- Splash ma być tylko lekkim brand momentem.
- Nie może opóźniać realnego korzystania z aplikacji.
- Respektować `prefers-reduced-motion`.

---

## 10. Górny pasek

Górny pasek ma być maksymalnie prosty.

Docelowo zostaje:

```txt
logo + VitaTrack
```

Usunąć z top bara:

- hamburger,
- plus,
- kalendarz,
- pobieranie / eksport.

Kalendarz i pobieranie przenieść do menu.

### Zasady

- Top bar nie może dublować dolnego menu.
- Ma robić tylko branding i stabilny punkt orientacyjny.
- Wysokość robocza: około `56px`.
- Treść wyrównana schludnie, z zachowaniem safe area.

---

## 11. Dolna nawigacja

Dolna nawigacja ma mieć 5 pozycji:

```txt
Historia | Menu | Home | Dania | Czat
```

Kolejność assetów:

```txt
historia.svg
menu.svg
home.svg
dania.svg
chat.svg
```

### Zasady

- Home jest na środku.
- Nie ma już przycisku `Dodaj`.
- Menu otwiera bottom sheet, a nie boczny panel.
- Aktywna pozycja ma być widoczna, ale spokojna.
- Każda pozycja ma ikonę i krótką etykietę.
- Nawigacja jest osobnym komponentem, nie sklejona z inputem.

### Ważne

Dolna nawigacja służy do przechodzenia między głównymi sekcjami. Nie powinna być miejscem dla akcji typu eksport lub wybór daty.

---

## 12. Floating input bar

Obecny pasek wpisywania nie może być jednym boxem razem z dolną nawigacją.

Docelowo:

- osobny pływający pasek nad dolną nawigacją,
- prawie na pełną szerokość ekranu,
- zaokrąglenie maksymalnie 16px,
- tylko pole tekstowe i przycisk wyślij,
- bez plusa,
- bez mikrofonu,
- bez przykładowego tekstu typu `jajka 120 g...`,
- przycisk wysyłania używa `ikony/wyslij.svg`.

### Zasady

- Pasek inputa ma być wizualnie oddzielony od bottom nav.
- Nie może nachodzić na treść ani menu.
- Ma działać z klawiaturą mobilną.
- W zależności od widoku może mieć różną logikę: na Home dodawanie posiłku, w Czat wysyłka wiadomości.

---

## 13. Menu jako bottom sheet

Menu nie ma wysuwać się z lewej strony.

Docelowo:

- wysuwa się od dołu,
- zakrywa przestrzeń między top barem a dolną nawigacją,
- nie nachodzi na top bar,
- nie nachodzi na bottom nav,
- zamyka się w dół,
- animacja płynna, ale krótka.

### Treść menu

Zmienić:

```txt
LOKALNIE I OFFLINE
```

na:

```txt
VitaTrack
```

Reszta pozycji może zostać na razie bez dużych zmian.

Dodać w menu:

- kalendarz / wybór daty,
- pobieranie / eksport,
- `Zaprojektowane przez CyberPiotr`,
- X do zamykania na dole, wyśrodkowany.

### Animacja

```txt
otwarcie: translateY(100%) -> translateY(0)
zamknięcie: translateY(0) -> translateY(100%)
czas: 220–280 ms
easing: cubic-bezier(0.2, 0, 0, 1)
```

---

## 14. Dashboard Home — gauge zamiast pasków

Na stronie głównej obecne poziome paski mają zostać zastąpione wskaźnikami typu gauge / licznik / zegar.

### Przełączniki czasu zostają

```txt
Dzisiaj | 3 dni | 7 dni
```

Nie usuwać przełączników. Zmienia się tylko prezentacja danych.

### Widok Dzisiaj

Hierarchia:

1. Kalorie — największy gauge.
2. Białko, Tłuszcz, Węgle — średnie gauge.
3. Sód, Potas, Magnez — niższy priorytet, ale nadal czytelne.

Każdy gauge pokazuje:

- nazwę,
- aktualną wartość,
- cel / zakres,
- procent realizacji jako zapełnienie.

### Widok 3 dni

- wszystkie gauge tego samego rozmiaru,
- bez hierarchii większy/mniejszy,
- układ siatki,
- przy nieparzystej liczbie ostatni element można wyśrodkować.

Przykład dla 5 elementów:

```txt
[ Sód ]      [ Potas ]
[ Magnez ]   [ Omega-3 ]
       [ Błonnik ]
```

### Widok 7 dni

- wszystkie gauge tego samego rozmiaru,
- siatka 2 kolumny,
- bez wyróżniania pierwszego nutrientu.

---

## 15. Czat

Zakładka Czat ma być prosta.

### Wiadomości użytkownika

- jasne chmurki,
- wyrównane po stronie użytkownika,
- bez ciężkich cieni.

### Wiadomości AI

- zielone chmurki,
- wyrównane po stronie AI,
- spokojny kolor, czytelny tekst.

### Zasady

- Nie budować rozbudowanego Messengera.
- Na tym etapie wystarczy czysty układ rozmowy.
- Input czatu korzysta z floating input bar.

---

## 16. Stopka CyberPiotr

Usunąć `Zaprojektowane przez CyberPiotr` spod dolnej nawigacji.

Dodać ten tekst do menu, najlepiej w dolnej części, nad przyciskiem zamykania.

Tekst ma być mały i spokojny:

```txt
Zaprojektowane przez CyberPiotr
```

Można wyróżnić `CyberPiotr`, ale nie agresywnie.

---

## 17. Statusy danych

Nie zmieniać logiki statusów danych.

Kolory statusów:

- baza / sukces: zielony,
- proxy / ostrzeżenie: bursztynowy,
- brak / błąd: czerwony,
- neutralne: szary / muted.

Wizualnie statusy mają być bardziej spójne między:

- Historia,
- Moje dania,
- Braki w bazie.

Ale nie robić dużej przebudowy logiki bez osobnego zadania.

---

## 18. Zasady techniczne dla Codexa

Codex ma:

- preferować zmienne CSS zamiast hardcoded kolorów,
- zachować obecną logikę aplikacji,
- nie usuwać funkcji,
- nie zmieniać Supabase / API / food lookup bez potrzeby,
- nie ruszać bazy danych,
- nie wymyślać assetów,
- raportować brakujące assety,
- pracować mobile-first,
- testować light i dark mode,
- sprawdzić brak nachodzenia elementów na siebie.

---

## 19. Czego nie robić

Nie robić teraz:

- pełnego redesignu wszystkich podstron naraz poza zakresem planu,
- animacji dla wszystkiego,
- nowych endpointów AI,
- nowych funkcji żywieniowych,
- przepisywania całej aplikacji,
- dużego refaktoru logiki,
- zmiany struktury danych historii,
- losowych kolorów poza tokenami.

---

## 20. Źródła inspiracji i uzasadnienie

Ten kierunek łączy:

- praktyczny design system: tokeny, rytm 8px, spójne fonty, radiusy i komponenty,
- mobilne wzorce nawigacji: dolna nawigacja do głównych widoków,
- bottom sheet jako naturalny wzorzec mobilny dla menu i akcji,
- delikatny glassmorphism jako warstwa wizualna, nie jako cel sam w sobie,
- niskostymulujący, czytelny dashboard zamiast ozdobnego chaosu.

Najważniejsza decyzja: **VitaTrack ma być używany codziennie, więc UI musi być szybki, czytelny i spokojny**.

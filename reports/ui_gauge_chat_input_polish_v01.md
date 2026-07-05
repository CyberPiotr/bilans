# UI gauge chat input polish v01

Data: 2026-07-05
Repo: `C:\Users\nikto\Desktop\Dieta`
Branch: `ui-mobile-shell`
Commit bazowy: `b32146a Fix Cyber Zdrowie chat input and mobile layout`

## Cel

Dopracować mobile UI bez zmian w logice żywieniowej: gauge jako półokrągłe zegary, wartości bez miejsc po przecinku, Czat jako centrum wpisywania z trybami `Posiłek` i `Danie`, komunikaty jako toast.

## Gauge

- Gauge nie jest już pełnym kołem; CSS rysuje łuk 240 stopni od okolic godziny 8 do 16 przez `conic-gradient(from 240deg, ...)`.
- Dolna część gauge pozostaje pusta.
- Wartość i jednostka są osobnymi elementami:
  - `.home-gauge-value` pokazuje samą liczbę;
  - `.home-gauge-unit` pokazuje `kcal`, `g`, `mg`, `µg` lub `IU`.
- Wartość jest wycentrowana wewnątrz gauge, jednostka siedzi niżej w pustej części.
- Target/range pod nazwą nutrientu został zachowany.
- Status `OK / brakuje / przekroczone` został zmniejszony, żeby nie zabierał nadmiarowo miejsca.

## Liczby i jednostki

- Dodano `formatWholeNumber()`.
- Gauge i target/range używają pełnych liczb bez miejsc po przecinku.
- Długie wartości dostają klasy długości, np. `digits-5`, `digits-6`, i mniejszy font przez CSS `clamp()`.
- Sprawdzane kategorie: kalorie, sód, potas, magnez, witaminy, jod, selen, omega-3.

## Czat

- Usunięto tryb `Wpis`.
- Zostały tylko tryby:
  - `Posiłek`;
  - `Danie`.
- Segment trybu jest dwukolumnowy, stylowany jak lekki segment i przyklejony nad bottom nav.
- Input w Czat jest dużą textareą, prawie na całą szerokość.
- Przycisk wysyłania jest w prawym dolnym rogu inputa i używa `zmiany/ikony/wyslij.svg`.
- Wiadomości użytkownika pojawiają się w oknie czatu z datą/godziną i dokładnym wpisanym tekstem.
- Historia czatu nie jest zapisywana do IndexedDB.

## Akcje Czat

- `Posiłek` używa istniejącego `handleAiParse()` i istniejącego AI parsera.
- `Danie` używa istniejącego `requestAiParse(input, "parse_dish")` oraz `saveAiDish(...)`.
- Nie dodano nowego backendu czatu.
- Nie odpalono żadnego realnego API podczas pracy.

## Toasty

- Dodano `#toast-region`.
- `setMessage()` dla głównego `formMessage` nie renderuje już tekstu pod inputem; pokazuje toast.
- Toast ma warianty `success`, `warning`, `error`, `info`, znika po ok. 5 sekundach i respektuje `prefers-reduced-motion`.
- Komunikaty panelowe poza composerem, np. braki/backup/settings, pozostały przy swoich panelach.

## Confirmation chips

- W kodzie istnieją pola `requiresConfirmation` i `food_form`, ale nie ma gotowego handlera wyboru formy produktu w Czat.
- Nie dodano chipów wyboru, żeby nie udawać logiki i nie zmieniać food-lookup/parsera.
- Następny etap może bezpiecznie dodać chipy dopiero po zdefiniowaniu kontraktu danych i handlera.

## Home i Dania

- Home nadal nie ma inputa.
- Dania nadal nie ma formularza tworzenia dania; pokazuje listę/empty state.
- Tworzenie dania pozostaje w Czat → Danie.

## Walidacja

Uruchomiono:

- `node --check app.js` - OK
- `node --check config.js` - OK
- `node --check service-worker.js` - OK
- `git diff --check` - OK; tylko ostrzeżenia LF/CRLF
- `git diff -- db.js` - OK, brak diffu
- `rg -n "OPENAI_API_KEY|sk-|service_role|localStorage\.clear|indexedDB\.deleteDatabase|clearData|deleteDatabase" app.js index.html style.css config.js service-worker.js` - brak trafień

Lokalny browser check, viewport 390x844:

- Home: `inputDisplay = none`, `navWidth = 390`, `hasDecimal = false`, `unitCount = 7`, gauge `::before` ma `conic-gradient(from 240deg, ...)`.
- Czat: tryby `Posiłek`, `Danie`, `modeCount = 2`, textarea `360x176`, segment kończy się nad bottom nav (`modeSwitcherBottom = navTop = 786`), ikona `zmiany/ikony/wyslij.svg`.
- Dania: `inputDisplay = none`, `dishHeaderDisplay = none`, `dishCreateDisplay = none`.

Nie klikano realnego wysyłania do AI, żeby nie odpalić API. Próba podmiany `window.fetch` w izolacji przeglądarki była zablokowana, więc pojawienie się wiadomości użytkownika potwierdzono przez kod: `addChatUserMessage(input)` jest wywoływane po walidacji inputu przed requestem w `handleAiParse()` i `handleChatDishCreate()`.

## Bezpieczeństwo

- `db.js` nietknięty.
- Nie zmieniano backendu, Supabase, parsera AI, food-lookup, nutrientów ani hybrid merge.
- Nie czyszczono IndexedDB ani cache.
- Nie odpalano płatnych API.
- Nie wykonano deploya ani push.

## Do ręcznego sprawdzenia

- Realne kliknięcie `Posiłek` i `Danie` w PWA przy normalnej konfiguracji API.
- Czy wartości 5-6 cyfrowe nie nachodzą na łuk na realnym telefonie.
- Czy toast po sukcesie/błędzie jest czytelny i nie przeszkadza w inputcie.

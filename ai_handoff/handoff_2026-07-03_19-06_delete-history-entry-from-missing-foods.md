# AI HANDOFF — Delete History Entry From Missing Foods

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `4b84a02 Improve mixed meal badges and missing food dismissal scope`
* Aktualny commit po etapie: do potwierdzenia po commicie `Add delete history entry action from missing foods panel`
* Data etapu: 2026-07-03 19:06 +02:00

## 2. Cel etapu

Dodać w panelu `Braki w bazie` mocniejszą akcję sprzątania danych testowych: `Usuń wpis z historii`, która usuwa cały wpis historii powiązany z daną kartą braku.

## 3. Aktualny stan projektu

Panel braków ma trzy akcje:

* `Oznacz jako obsłużone` — ukrywa brak lokalnie w `localStorage`.
* `Usuń z listy` — robi to samo, czyli ukrywa brak lokalnie.
* `Usuń wpis z historii` — po potwierdzeniu usuwa cały wpis historii przez istniejące `window.ketoDb.deleteEntry(id)` i odświeża widoki.

## 4. Co zostało zrobione

* `collectMissingFoods()` zapisuje `latestEntryId` dla agregowanej karty braku.
* `renderMissingFoods()` dodaje destrukcyjny przycisk `Usuń wpis z historii`.
* Dodano `deleteMissingFoodEntry(id)` z potwierdzeniem:
  `Usunąć cały wpis z historii? Tej akcji nie można cofnąć.`
* Nowa akcja sprawdza, czy wpis nadal istnieje.
* Po usunięciu wywoływane jest `refreshEntries()`, więc historia i panel braków renderują się ponownie.
* Dodano minimalny styl destrukcyjnego przycisku w panelu braków.

## 5. Zmienione/dodane pliki

* `app.js` — nowa akcja usuwania wpisu z historii z poziomu panelu braków.
* `style.css` — minimalny styl przycisku destrukcyjnego.
* `ai_handoff/handoff_2026-07-03_19-06_delete-history-entry-from-missing-foods.md` — ten handoff.

## 6. Decyzje techniczne

* Użyto istniejącego mechanizmu `window.ketoDb.deleteEntry(id)`, tego samego magazynu co usuwanie z historii.
* Nie usuwano definicji produktu z bazy.
* Nie zmieniano `db.js`.
* Nie zmieniano kalorii/makro, `food-lookup`, AI Parsera ani `Moje dania`.
* Ukryte braki w `localStorage` zostają bez zmian.

## 7. Testy i walidacja

Uruchomiono:

* `node --check app.js`
* `node --check config.js`
* `node --check service-worker.js`
* `git diff --check`
* `git diff -- db.js`

Wynik:

* Wszystkie checki OK.
* `db.js` bez zmian.

## 8. Bezpieczeństwo

* Nie dodano sekretów.
* Nie wykonano SQL.
* Nie deployowano Supabase.
* Nie robiono push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie ruszano repo `Baza danych VT` / `bazavt`.

## 9. Git

* Commit: do wykonania.
* Commit message: `Add delete history entry action from missing foods panel`
* Push: NIE wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie wykonano ręcznego testu w przeglądarce.
* Akcja usuwa cały wpis historii, więc jest destrukcyjna i wymaga confirm.

## 11. Następny najlepszy krok

Ręcznie dodać kilka wpisów `jajka 120 g i papaja 100 g`, usunąć jeden wpis z panelu braków i potwierdzić, że znika tylko ten jeden wpis oraz jeden aktywny brak.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, Supabase ani cache. Ręcznie przetestuj panel `Braki w bazie`: dodaj kilka wpisów `jajka 120 g i papaja 100 g`, kliknij `Usuń wpis z historii` przy jednej papai, potwierdź, sprawdź że historia i liczba aktywnych braków zmniejszyły się tylko o jeden.

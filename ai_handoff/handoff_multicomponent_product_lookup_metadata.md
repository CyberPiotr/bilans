# AI HANDOFF — Multicomponent Product Lookup Metadata

## 1. Projekt

* Nazwa projektu: VitaTrack / Bilans
* Folder/repo: `C:\Users\nikto\Desktop\Dieta`
* Branch: `ui-mobile-shell`
* Aktualny commit przed etapem: `b68aee3 Refine mobile composer and bottom navigation`
* Aktualny commit po etapie: do potwierdzenia po lokalnym commicie `Add per-product food lookup metadata`
* Data etapu: 2026-07-03 18:32 +02:00

## 2. Cel etapu

Minimalnie poprawić główny flow wielu składników, żeby każdy produkt w `entry.products` miał własne opcjonalne metadane wyniku `food-lookup`, bez zmiany obliczeń i bez ruszania `db.js`.

## 3. Aktualny stan projektu

Główny input nadal wysyła `action: "parse_meal"`. AI Parser zwraca listę produktów, a `food-lookup` jest wywoływany osobno dla każdego składnika. Jeśli wszystkie produkty są `matched`, wpis nadal liczy się z sumy bazy. Jeśli choć jeden produkt jest `not_found`, wpis nadal używa fallbacku AI dla całego posiłku. Ten etap dodał tylko metadane per produkt i minimalny tekst statusu w szczegółach wpisu.

## 4. Co zostało zrobione

* Dodano helper `createProductLookupMetadata(product, result, error)`.
* Dodano helper `isProxyLookupResult(result)`.
* `resolveMealWithFoodLookup()` zwraca teraz także `products` z metadanymi per składnik.
* `saveAiMeal()` zapisuje `lookupResult.products` do `entry.products`.
* Dla produktu `matched` zapisywane są:
  * `lookupStatus: "matched"`
  * `matchedName`
  * `fdcId`
  * `requiresConfirmation`
  * `matchType`
  * `dataSourceType: "food_database"` albo `"food_database_proxy"`
  * `query`
  * `originalName`
  * `amountG`
* Dla produktu `not_found` zapisywane są:
  * `lookupStatus: "not_found"`
  * `dataSourceType: "ai_fallback_missing"`
  * `query`
  * `originalName`
  * `amountG`
* Dla błędu technicznego produktu zapisywane jest:
  * `lookupStatus: "error"`
  * `dataSourceType: "food_lookup_error"`
* Starsze wpisy bez tych pól nadal działają.
* W szczegółach historii przy produktach dopisano minimalny status tekstowy: `baza`, `baza proxy`, `brak w bazie`, `błąd bazy`, `źródło nieznane`.
* Panel i eksport braków w bazie potrafią teraz agregować konkretny brakujący składnik z `products[]`, np. papaję w mieszanym wpisie `jajka + papaja`.

## 5. Zmienione/dodane pliki

* `app.js` — metadane per produkt, minimalne statusy w szczegółach wpisu, eksport braków oparty o per-product `lookupStatus` / `dataSourceType`.
* `ai_handoff/handoff_multicomponent_product_lookup_metadata.md` — ten handoff.

## 6. Decyzje techniczne

* Nie zmieniano logiki obliczeń.
* Nie mieszano jeszcze wartości z bazy i fallbacku AI per składnik.
* Przy częściowym `not_found` cały wpis nadal używa fallbacku AI, ale produkty zapisują swoje statusy.
* Nie zmieniano IndexedDB ani `db.js`, bo nowe pola są opcjonalnymi polami w istniejącym obiekcie wpisu.
* Minimalny UI został ograniczony do istniejącej listy produktów w szczegółach wpisu.
* Braki w bazie są dalej liczone z historii, bez nowej kolejki.

## 7. Testy i walidacja

Uruchomione komendy:

* `node --check app.js`
* `git diff --check`
* `git diff -- db.js`
* `git diff --stat`

Wynik:

* Składnia `app.js`: OK.
* `git diff --check`: OK; tylko standardowe ostrzeżenie Windows o LF -> CRLF.
* `db.js`: brak zmian.
* `package.json` nie ma skryptów testowych/lintera, więc nie uruchamiano `npm test`.

## 8. Bezpieczeństwo

* Nie dodano sekretów.
* Nie użyto prywatnych API keys.
* Nie użyto płatnego API.
* Nie wykonano SQL.
* Nie zmieniano Supabase.
* Nie deployowano.
* Nie robiono push.
* Nie czyszczono IndexedDB.
* Nie czyszczono cache.
* Nie ruszano `db.js`.
* Nie ruszano repo `Baza danych VT` / `bazavt`.

## 9. Git

* Git status przed zmianami: `## ui-mobile-shell...origin/ui-mobile-shell [ahead 1]`, working tree czysty.
* Czy wykonano commit: do wykonania po walidacji.
* Komunikat commita: `Add per-product food lookup metadata`
* Hash commita: do potwierdzenia po commicie.
* Git status po commicie: do potwierdzenia po commicie.
* Push NIE został wykonany.

## 10. Ograniczenia i rzeczy niedokończone

* Nie dodano mieszania `baza + AI fallback` per składnik.
* Nie dodano osobnego modelu wartości odżywczych per produkt.
* Nie zmieniano `Moje dania`.
* Nie zmieniano `parse_dish`.
* Nie wykonywano ręcznego testu w przeglądarce.
* Eksport braków widzi teraz per-składnikowe braki, ale nadal eksportuje fallback nutrients całego wpisu, bo nie ma jeszcze wartości AI per brakujący składnik.

## 11. Następny najlepszy krok

Ręcznie przetestować dwa wpisy: `jajka 120 g, oliwa 10 g` oraz `jajka 120 g i papaja 100 g`, sprawdzić szczegóły produktów w historii i eksport braków.

## 12. Gotowy prompt do następnej sesji AI/Codexa

Pracuj wyłącznie w `C:\Users\nikto\Desktop\Dieta`. Nie ruszaj `db.js`, IndexedDB, Supabase, SQL ani repo `Baza danych VT`. Uruchom aplikację lokalnie i ręcznie sprawdź flow wielu składników: `jajka 120 g, oliwa 10 g` powinno zapisać produkty ze statusem bazy/proxy, a `jajka 120 g i papaja 100 g` powinno użyć fallbacku AI dla całego wpisu, ale pokazać jajka jako matched/proxy i papaję jako `brak w bazie`. Sprawdź też eksport braków, czy zawiera papaję jako konkretny składnik.

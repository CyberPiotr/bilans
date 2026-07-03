# Food lookup integration

Projekt: VitaTrack / Bilans

Zakres:
- dodano konfigurowalny endpoint `foodLookupFunctionUrl` w `config.js`;
- dodano malego klienta HTTP `fetch POST` dla Supabase Edge Function `food-lookup`;
- dodano developerski test w panelu Debug AI w menu;
- test obejmuje: jajka 120 g, truskawki 200 g, oliwa 10 g, brokul 150 g, papaja 100 g.

Przeplyw:
1. Uzytkownik otwiera menu i panel Debug AI.
2. Przycisk `Test food-lookup` wysyla piec zapytan POST do `food-lookup`.
3. HTTP 200 + `status: matched` jest pokazywane jako trafienie z nazwa produktu, `fdc_id`, `factor` i liczba pol nutrientow.
4. HTTP 404 + `status: not_found` jest pokazywane jako brak w bazie, nie jako awaria.
5. Inne odpowiedzi sa pokazywane jako blad techniczny.

Zasady danych:
- brak nutrientu pozostaje `null` w odpowiedzi backendu;
- frontend w tym etapie nie zgaduje nutrientow i nie zamienia brakow na `0`;
- integracja testowa niczego nie zapisuje do historii ani IndexedDB.

Bezpieczenstwo:
- Supabase nie byl zmieniany;
- SQL nie byl wykonywany;
- deploy nie byl wykonywany;
- push nie byl wykonywany;
- pelna baza produktow nie byla importowana;
- `db.js` nie byl ruszany.

Test reczny:
1. Uruchom aplikacje lokalnie.
2. Otworz menu.
3. Rozwin `Debug AI`.
4. Kliknij `Test food-lookup`.
5. Sprawdz, ze `jajka` wraca jako `matched`, a `papaja` jako `not_found`.

# Food lookup source mapping fix

Projekt: VitaTrack / Bilans

Bug:
- realny flow `Policz AI` poprawnie dostawal `matched` z `food-lookup`;
- aplikacja czytala `nutrients.<key>` jak liczbe;
- backend zwraca `nutrients.<key>.value_per_100g`, wiec zapisane kalorie i makro wychodzily jako `0`.

Poprawka:
- mapper czyta `nutrients.<key>.value_per_100g`;
- wartosc porcji liczy jako `value_per_100g * amount.factor`;
- brak nutrientu zostaje `null`;
- jawne zero zostaje `0`;
- jesli `matched` nie daje poprawnego mapowania kalorii/makro, aplikacja uzywa fallbacku AI i oznacza `database_mapping_error`.

Fallback:
- `matched`: wpis uzywa danych z bazy;
- `not_found`: wpis uzywa fallbacku AI i zapisuje zrodlo `AI fallback — brak w bazie`;
- blad techniczny bazy: wpis uzywa fallbacku AI i zapisuje zrodlo `AI fallback — błąd techniczny bazy`.

Zrodlo danych:
- szczegoly wpisu pokazuja tekst `Źródło: baza żywności`;
- proxy albo wynik wymagajacy potwierdzenia pokazuje `Źródło: baza proxy — wymaga potwierdzenia`;
- fallback AI pokazuje odpowiedni powod fallbacku.

Test reczny:
1. Uruchom aplikacje lokalnie.
2. Wpisz `jajka 120 g` albo `jajko 120 g`.
3. Kliknij `Policz AI`.
4. Oczekiwane makro z bazy: ok. 172 kcal, 15.1 g bialka, 11.4 g tluszczu, 0.9 g wegli netto.
5. W historii rozwin szczegoly wpisu i sprawdz `Źródło: baza żywności`.
6. Wpisz `papaja 100 g`; oczekiwany fallback AI i zrodlo `AI fallback — brak w bazie`.

Bezpieczenstwo:
- pelna baza produktow nie byla importowana;
- Supabase nie byl zmieniany;
- SQL nie byl wykonywany;
- deploy nie byl wykonywany;
- push nie byl wykonywany;
- `db.js` nie byl ruszany;
- IndexedDB i cache nie byly czyszczone.

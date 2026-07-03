# Food lookup real flow

Projekt: VitaTrack / Bilans

Zakres:
- podlaczono `food-lookup` do realnego flow `Policz AI` dla zwyklego posilku;
- istniejacy klient HTTP `requestFoodLookup` zostal uzyty ponownie;
- dodano status bazy w panelu Debug AI: `matched`, `not_found`, `error`;
- podbito wersje PWA do `vitatrack-food-lookup-real-flow-v25`.

Przeplyw:
1. Uzytkownik wpisuje opis i klika `Policz AI`.
2. AI Parser rozpoznaje produkty i gramature.
3. Aplikacja probuje pobrac dane kazdego produktu z `food-lookup`.
4. Jesli wszystkie produkty sa `matched`, wpis dostaje sume nutrientow z bazy.
5. Jesli jakikolwiek produkt jest `not_found`, aplikacja zapisuje dotychczasowy fallback AI i pokazuje status `baza: not_found`.
6. Jesli wystapi blad techniczny endpointu, aplikacja zapisuje fallback AI i pokazuje status `baza: error`.

Zasady danych:
- baza produktow jest zrodlem wartosci liczbowych, gdy produkt jest znaleziony;
- brak nutrientu z bazy zostaje `null`;
- jawne zero z bazy zostaje `0`;
- frontend nie zgaduje nutrientow;
- integracja nie zmienia importu, eksportu, historii ani struktury IndexedDB.

Test reczny:
1. Uruchom aplikacje lokalnie.
2. Wpisz naturalny opis posilku, np. `zjadlem 120 g jajek`.
3. Kliknij `Policz AI`.
4. W menu otworz `Debug AI`.
5. Sprawdz status `baza: matched`.
6. Dla produktu spoza bazy, np. papaja, oczekiwany jest fallback AI i status `baza: not_found`.

Bezpieczenstwo:
- pelna baza produktow nie byla importowana;
- Supabase nie byl zmieniany;
- SQL nie byl wykonywany;
- deploy nie byl wykonywany;
- push nie byl wykonywany;
- `db.js` nie byl ruszany;
- IndexedDB i cache nie byly czyszczone.

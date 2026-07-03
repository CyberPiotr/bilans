# History source badges and missing foods export

Projekt: VitaTrack / Bilans

Zakres:
- dodano widoczny badge zrodla danych na karcie historii;
- zachowano pelny opis zrodla w szczegolach wpisu;
- nowe wpisy z `Policz AI` dostaja `dataSource` oraz zgodnosciowe `nutritionSource`;
- dodano eksport brakow w bazie z istniejacej historii;
- podbito PWA/cache do `vitatrack-source-badges-missing-export-v27`.

Typy zrodel:
- `food_database`: badge `Baza`;
- `food_database_proxy`: badge `Baza proxy`;
- `ai_fallback_missing`: badge `Brak w bazie`;
- `ai_fallback_database_error`: badge `Błąd bazy / AI`;
- `ai_fallback_database_mapping_error`: badge `Błąd bazy / AI`;
- brak metadanych: badge `Źródło nieznane`.

Eksport brakow:
- przycisk `Eksportuj braki w bazie` jest w widoku `Kopia zapasowa`;
- eksportuje JSON `vitatrack-missing-foods.json`;
- dane pochodza z istniejacej historii, bez nowej kolejki IndexedDB;
- eksport obejmuje wpisy z `dataSource.type = ai_fallback_missing`;
- zawiera tekst wpisu, produkty/query, gramy, tagi, nutrienty fallback AI i metadane zrodla.

Test reczny:
1. Dodaj `jajka 120 g` przez `Policz AI`.
2. Sprawdz widoczny badge `Baza` albo `Baza proxy` na karcie historii.
3. Rozwin szczegoly i sprawdz pelny opis zrodla.
4. Dodaj `papaja 100 g`.
5. Sprawdz czerwony badge `Brak w bazie`.
6. Wejdz w `Kopia zapasowa` i kliknij `Eksportuj braki w bazie`.
7. Sprawdz, ze JSON zawiera wpis papai i metadane fallbacku.

Bezpieczenstwo:
- Supabase nie byl zmieniany;
- SQL nie byl wykonywany;
- deploy nie byl wykonywany;
- push nie byl wykonywany;
- pelna baza nie byla importowana;
- `db.js` nie byl ruszany;
- IndexedDB i cache nie byly czyszczone.

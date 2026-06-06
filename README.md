# Bilans

Pierwsza działająca wersja mobilnej aplikacji PWA do kontroli keto-odżywiania. Aplikacja nie ma backendu, logowania ani połączenia z chmurą. Wszystkie wpisy są przechowywane lokalnie w IndexedDB urządzenia.

## Funkcje

- parser danych wklejanych z tekstu,
- wykrywanie tagów produktów,
- historia wpisów i usuwanie,
- edytowalne ustawienia celów i okna jedzenia przechowywane w IndexedDB,
- zapamiętywany motyw systemowy, jasny lub ciemny,
- centrum alertów „Co domknąć” i plan na jutro,
- sumy oraz statusy celów dla 1, 3, 7 i 30 dni,
- eksport i import kopii zapasowej JSON,
- próba włączenia trwałej pamięci przeglądarki,
- instalacja na Androidzie i działanie offline po pierwszym uruchomieniu.

## Uruchomienie lokalne

PWA i service worker wymagają serwera HTTP. Nie otwieraj `index.html` bezpośrednio jako pliku.

W folderze projektu uruchom jeden z poniższych serwerów:

```powershell
python -m http.server 8080
```

albo:

```powershell
npx serve .
```

Następnie otwórz `http://localhost:8080`.

## Testowanie na komputerze

1. Otwórz aplikację w Chrome lub Edge.
2. Wklej przykładowe dane, wybierz datę i kliknij **Zapisz wpis**.
3. Odśwież stronę i sprawdź, czy wpis nadal jest widoczny.
4. W DevTools otwórz **Application > IndexedDB**, aby zobaczyć bazę `keto_tracker_db`.
5. W DevTools otwórz **Application > Service Workers**, zaznacz tryb offline i odśwież stronę.
6. Przetestuj eksport, usuń wpis i zaimportuj zapisany plik.

## Hosting statyczny

Wgraj cały folder na hosting statyczny obsługujący HTTPS, na przykład GitHub Pages, Netlify, Cloudflare Pages lub zwykły serwer WWW. Zachowaj strukturę plików i katalog `icons`.

Service worker działa na `localhost` bez HTTPS, ale publicznie przeglądarka wymaga HTTPS.

## Instalacja PWA na Androidzie

1. Otwórz adres aplikacji w Chrome na Androidzie.
2. Po pierwszym pełnym załadowaniu użyj przycisku **Zainstaluj**, jeśli jest widoczny, albo menu Chrome.
3. W menu wybierz **Zainstaluj aplikację** lub **Dodaj do ekranu głównego**.
4. Po instalacji aplikacja uruchamia się w trybie standalone i działa offline.

## Dane i kopie zapasowe

Dane i ustawienia są zapisywane wyłącznie lokalnie w IndexedDB przeglądarki lub zainstalowanej PWA. Nie są wysyłane do chmury ani żadnego serwera. Okno jedzenia przechodzące przez północ, na przykład `20:00–02:00`, jest obsługiwane.

Przeglądarka może usunąć dane, a wyczyszczenie danych aplikacji lub przeglądarki usunie wpisy i ustawienia. Regularnie używaj przycisku **Eksportuj dane**, aby zapisać plik `keto-backup.json`. Plik zawiera wpisy i ustawienia. Można go później przywrócić przez **Importuj dane**; wpisy z takim samym `id` nie będą duplikowane.

## Struktura

```text
.
├── index.html
├── style.css
├── app.js
├── db.js
├── manifest.json
├── service-worker.js
├── README.md
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

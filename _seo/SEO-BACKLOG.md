# SEO — LAM English (lam-english.com)

> Katalog `_seo/` zaczyna się od podkreślnika, więc GitHub Pages (Jekyll) go nie publikuje.
> Ostatnia aktualizacja: 2026-10-10.

## 1. Architektura (stan faktyczny)

- Statyczny HTML hostowany na GitHub Pages (`CNAME` → `lam-english.com`). Brak frameworka i procesu build.
- Wspólne style: `blog/assets/*.css` (wersjonowane `?v=<md5>`). `careers.html`, `terms-of-service.html`
  i `privacy-policy.html` mają jeszcze stary szablon z CSS w `<style>`.
- Śledzenie: Google Ads tag `AW-17940816316` (gtag). **Brak GA4 i brak weryfikacji Search Console w kodzie**
  (prawdopodobnie weryfikacja przez DNS — do potwierdzenia).
- 17 indeksowanych URL-i w `sitemap.xml` + `404.html` (`noindex`). `robots.txt` dopuszcza wszystko.
- Każda strona ma unikalny `<title>`, `description`, `canonical`, OG i jeden `<h1>`.

## 2. Ograniczenia danych

- Brak dostępu do Google Search Console / GA — brak danych o zapytaniach, CTR, indeksacji i CWV z pola.
- Z tego środowiska nie da się pobrać działającej strony (DNS/proxy) — audyt oparty na repozytorium
  i lokalnym renderze w Chromium (360/390/1280 px).
- Wolumeny wyszukiwań poniżej to **szacunki jakościowe**, nie zmierzone dane.

## 3. Zrobione w tej rundzie

| # | Problem (dowód) | Zmiana | Weryfikacja |
|---|---|---|---|
| 1 | `aggregateRating` w JSON-LD z niespójnymi liczbami (blog: 4.97/312, kursy: 4.9/500), bez widocznych na stronie ocen o takiej liczbie — ryzyko ręcznej kary za spam w danych strukturalnych | Usunięte z `blog.html` i `courses.html` | JSON-LD parsuje się na wszystkich stronach |
| 2 | Obrazy OG/Twitter 1,2–2,2 MB PNG (`Advertise_*.png`, logo 2160 px) | Nowe `Images/og-home.jpg`, `og-courses.jpg` (1200×628, ~135 KB), `logo-512.png` (72 KB); poprawione `og:image:width/height`, `summary_large_image` | Wszystkie 18 stron wskazują nowe pliki |
| 3 | `careers`, `terms`, `privacy` wyświetlały logo 1,2 MB jako ikonę 80 px | Podmiana na `blog/assets/logo-160.png` (12 KB) | Brak uszkodzonych obrazów w Chromium |
| 4 | Blokujący `cookie-banner.js` na `careers` i `privacy` | `defer` | Baner działa, brak błędów JS |
| 5 | Poziome przewijanie na telefonie: artykuły z tabelą (`poziomy-angielskiego` 446 px przy 390), regulamin (409 px), polityka (365 px) | `.post-layout` → `minmax(0,1fr)` w mobile; `overflow-wrap:anywhere` w treści prawnej | 0 stron z przepełnieniem przy 360 i 390 px |
| 6 | `careers`, `terms` bez danych strukturalnych; `privacy` bez okruszków | `WebPage`/`AboutPage` + `BreadcrumbList` | JSON-LD poprawny |
| 7 | Najsłabiej podlinkowane artykuły (`wymowa-th`: 3 linki, `angielski-od-podstaw`: 4) | Kontekstowe linki z `courses.html` (FAQ) | Linki działają |

## 4. Backlog (priorytet → status)

| P | Zadanie | Dowód / powód | Efekt | Pewność | Wysiłek | Ryzyko | Wymaga |
|---|---|---|---|---|---|---|---|
| P0 | Potwierdzić indeksację wszystkich 17 URL-i, przesłać `sitemap.xml` | Brak danych GSC | Wysoki | — | 15 min | Brak | **Dostęp GSC (właściciel)** |
| P0 | Sprawdzić przekierowania `http→https`, `www→bez www`, `/index.html→/` na żywo | Nie dało się pobrać strony | Wysoki | Średnia | 10 min | Brak | Włączone „Enforce HTTPS” w GitHub Pages + DNS `www` |
| P1 | Zweryfikować widoczne „Średnia ocena 4.9/5” i mikrodane `Review` na stronie głównej | Ocena musi mieć źródło (np. profil Google); opinie o własnej firmie nie dają gwiazdek w Google | Zaufanie / zgodność | Wysoka | 30 min | Niskie | Decyzja właściciela: podać źródło (link do Google) |
| P1 | Opinia na stronie głównej mówi o dzieciach, a `meta keywords` zawiera „angielski dla dzieci”, „matura”, „FCE/CAE” — oferta to dorośli | Niespójność intencji | Średni | Średnia | 15 min | Niskie | Decyzja: czy oferujecie te usługi |
| P1 | Dodać GA4 + zdarzenia konwersji (wysłanie formularza, klik w telefon/test) | Tylko tag Google Ads | Pomiar | Wysoka | 1 h | Niskie | ID GA4 od właściciela; zgodność z banerem cookies |
| P1 | Profil Google Business: kategoria „Szkoła językowa”, opis, link do strony, prośba o opinie | Lokalne wyniki | Wysoki | Średnia | 1 h | Brak | Dostęp właściciela |
| P2 | Migracja `careers/terms/privacy` na wspólny szablon (`blog.css`) | ~25–30 KB inline CSS, inne fonty (Roboto) | Szybkość, spójność | Wysoka | 3 h | Średnie | — |
| P2 | Font Awesome 6.0.0 całość (~90 KB CSS + fonty) dla kilkunastu ikon → inline SVG | Lab: duży, zbędny zasób | LCP/INP | Średnia | 3 h | Średnie | — |
| P2 | Usunąć nieużywane pliki z `Images/` (`Creator.jpg`, `Main_Index.png`, `mainImage2.jpg`, `user1–9` w pełnej rozdzielczości, ~7 MB) | Brak odwołań w HTML | Porządek repo | Wysoka | 10 min | Niskie (mogą być linkowane z zewnątrz) | Zgoda właściciela |
| P2 | Nowe artykuły wg mapy fraz (sekcja 5) | Luki tematyczne | Ruch | Średnia | 3–4 h / art. | Niskie | — |
| P2 | Autor artykułów jako `Person` (imię lektora, bio) zamiast `Organization` | E-E-A-T | Średni | Średnia | 1 h | Niskie | Dane lektora (tylko prawdziwe) |
| P3 | `lastmod` w sitemap aktualizować tylko przy realnej zmianie treści | Wszystkie daty = 2026-10-10 | Niski | — | — | — | — |

## 5. Mapa fraz → URL (bez kanibalizacji)

| Klaster | Fraza główna | Frazy dodatkowe | Intencja | URL docelowy | Stan |
|---|---|---|---|---|---|
| Marka/oferta | szkoła angielskiego online | kurs angielskiego online dla dorosłych | transakcyjna | `/` | jest |
| Kursy grupowe | kursy angielskiego online | kurs angielskiego A1/B1/B2 online, cena | transakcyjna | `/courses.html` | jest |
| 1:1 | lekcje angielskiego online indywidualne | korepetycje angielski online dorośli | transakcyjna | `/zajecia-indywidualne.html` | jest |
| Bariera | jak przełamać barierę językową | jak zacząć mówić po angielsku, blokada językowa | informacyjna | `/blog/blokada-mowienia-po-angielsku.html` | jest |
| Od zera | angielski od podstaw dla dorosłych | od czego zacząć naukę angielskiego | informacyjna→komercyjna | `/blog/angielski-od-podstaw-dla-doroslych.html` | jest |
| Poziomy | poziomy angielskiego | B1 a B2, poziom angielskiego CV | informacyjna | `/blog/poziomy-angielskiego.html` | jest |
| Czasy | present perfect a past simple | present perfect ćwiczenia | informacyjna | `/blog/present-perfect-czy-past-simple.html` | jest |
| Słownictwo | jak uczyć się słówek | jak zapamiętać słówka angielskie | informacyjna | `/blog/jak-uczyc-sie-slowek.html` | jest |
| Samodzielnie | jak nauczyć się angielskiego samemu | angielski 15 minut dziennie | informacyjna | `/blog/angielski-15-minut-dziennie.html` | jest |
| Praca | angielski na spotkaniach | zwroty biznesowe, angielski w pracy | informacyjna | `/blog/zwroty-na-spotkanie-po-angielsku.html` | jest |
| Small talk | small talk po angielsku | pytania small talk | informacyjna | `/blog/small-talk-po-angielsku.html` | jest |
| Wymowa | wymowa th | jak wymawiać th | informacyjna | `/blog/wymowa-th-po-angielsku.html` | jest |
| **Luka** | angielski do pracy / rozmowa kwalifikacyjna po angielsku | pytania na rozmowie kwalifikacyjnej po angielsku | informacyjna | `/blog/rozmowa-kwalifikacyjna-po-angielsku.html` | do napisania |
| **Luka** | e-mail po angielsku | zwroty w mailu formalnym | informacyjna | `/blog/email-po-angielsku-zwroty.html` | do napisania |
| **Luka** | angielski konwersacyjny | konwersacje po angielsku online | komercyjna | rozważyć sekcję na `/courses.html` (Speaking Club) zamiast nowej strony | do decyzji |
| **Luka** | czasy w angielskim | tabela czasów angielskich | informacyjna | `/blog/czasy-angielskie.html` (pillar; linkuje do PP/PS) | do napisania |
| **Luka** | test poziomu angielskiego | sprawdź poziom angielskiego online | transakcyjna | dziś Google Forms; własna strona z testem dałaby ruch | do decyzji |

Zasada: jedna fraza główna = jeden URL. Nowy artykuł nie może celować w frazę główną istniejącego.

## 6. Jak mierzyć

Linia bazowa: eksport z GSC (Skuteczność, 3 mies.: zapytania + strony) przed kolejną rundą.
Porównywać okresy 28-dniowe rok do roku lub po ≥4 tygodniach od zmiany; zmiany w rankingu zwykle
pojawiają się z opóźnieniem 2–8 tygodni.

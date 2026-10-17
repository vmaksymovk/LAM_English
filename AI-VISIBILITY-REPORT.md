# LAM English: widoczność w AI (GEO + SEO): raport

Gałąź: `ai-visibility` (6 commitów, jeden na fazę). Nic nie jest wypchnięte ani wdrożone.
Data: 17 października 2026.

## 1. Zmiany per plik

| Plik | Co się zmieniło |
|---|---|
| `index.html` | Tytuł „Kurs angielskiego online dla dorosłych \| LAM English”, nowy opis. Zdanie definiujące pod H1. Pasek zaufania: „500+”, „4.9/5” i „Gwarancja satysfakcji” zastąpione przez: zajęcia po PL/EN/RU/UA, ocena 5,0 w Google, bezpłatna konsultacja. Kafelek „Native Speakerzy” zamieniony na „Lektorzy, którzy sami przełamali barierę”. Usunięte przekreślone ceny i „Promocja -100 zł”. Pro: „jak native speaker” zamienione na „Swobodnie prowadzić dyskusje i prezentacje w pracy”. W opinii Marka wycięte zdanie o native speakerach (zaznaczone „[…]”). Usunięte mikrodane Review. Link do opinii Google. FAQ: +5 pytań, konsultacja + lekcja próbna, bez krypto. Usunięte meta keywords. |
| `courses.html` | Tytuł i opis. „Doświadczeni native speakerzy” i „Doświadczeni nauczyciele (certyfikowani…)” zamienione na prawdziwą przewagę lektorów. Pro bez „native speaker”. Usunięta sekcja Speaking Club. CTA „Umów bezpłatną konsultację”. FAQ: +3 pytania, bez krypto. Usunięte meta keywords i aggregateRating. |
| `zajecia-indywidualne.html` | Opis. FAQ: konsultacja + lekcja próbna, +2 pytania, bez krypto. |
| `contacts.html` | Tytuł „Kontakt i bezpłatna konsultacja”, opis. Hero bez „Doświadczonych doradców”. Opcja formularza „Bezpłatna konsultacja / lekcja próbna”. FAQ +2 pytania. Usunięte „native speakerzy” z OG i schematu, usunięte LocalBusiness. |
| `blog.html` | Fałszywe statystyki (587 / 98% / 4.97 / 15 480) zastąpione prawdziwymi faktami (80% po angielsku, 8 zajęć, 5,0 w Google, 4 języki). „70%” zmienione na „80%”. „Ponad 10 lat… native lub certyfikowany” zastąpione szczerym opisem lektorów. FAQ: certyfikat bez „ceniony przez pracodawców”. Schemat: usunięte aggregateRating 4.97 i fałszywy adres „Warszawa”. |
| `blog/*.html` (9 artykułów) | Autor: Vladyslav Maksymov. Widoczna data aktualizacji (`<time>`). Boks „O autorze”. W 5 artykułach pierwszy akapit zaczyna się od bezpośredniej odpowiedzi na pytanie z tytułu. Skrócone 2 tytuły. Schemat BlogPosting z autorem Person. |
| `careers.html`, `privacy-policy.html`, `terms-of-service.html`, `404.html` | Marka w nagłówku i stopce, tytuły i opisy, twitter:* dodane tam, gdzie ich brakowało. Logo 1,1 MB zamienione na wersję 12 KB. Treść prawna bez zmian. |
| Wszystkie strony | Nagłówek „LAM English / Language Academy Maksymov”. Stopka: nowy opis i „© 2026 LAM English (Language Academy Maksymov)”. Usunięty link do Speaking Club. og:title i og:description identyczne z title i description. og:site_name „LAM English”. Usunięte hreflang. `lang="pl"`. Linki do `index.html` zamienione na `/`. Jeden blok JSON-LD z `@graph`. |
| `scripts/build-schema.py` | **Nowy.** Generuje JSON-LD na wszystkich stronach. FAQPage powstaje z widocznych pytań na stronie. Uruchom po każdej zmianie FAQ lub artykułu: `python3 scripts/build-schema.py`. |
| `scripts/indexnow.sh`, `6d6ef3e9f66d05c34dbad7ef2b131ac0.txt` | **Nowe.** IndexNow (opis w sekcji 4). |
| `robots.txt` | Jawne `Allow: /` dla botów AI i Bingbota, link do sitemap. |
| `sitemap.xml` | lastmod 2026-10-17, niższy priorytet stron prawnych. |
| `llms.txt` | Przepisany: fakty, ceny, konsultacja, kim są lektorzy, czego nie oferujemy. |
| `Images/` | Nowe: `logo-512.png` (86 KB), `og-home.jpg`, `og-courses.jpg` (~200 KB). Usunięte nieużywane: `Main_Index.png`, `mainImage2.jpg`, `user1–9.*` (~5 MB). Zostają: `Creator.jpg` (do strony „O nas”), `Logo_New_Bigger.png` i `Advertise_*.png` (mogą być podlinkowane z reklam lub starych udostępnień). |

CSS, JS, układ sekcji, kolory, fonty i nawigacja główna: **bez zmian** (`git diff master -- '*.css' '*.js'` jest pusty). Usunięte zostały tylko elementy, na które się zgodziłeś: sekcja Speaking Club, przekreślone ceny i baner promocji.

## 2. Otwarte TODO-VLAD

1. **Opinia Marka (strona główna).** Oryginał brzmiał: „Dzięki native speakerom nabrałem pewności…”. Wyciąłem to zdanie i zaznaczyłem „[…]”. Potwierdź z Markiem albo podmień opinię.
2. **Piotr, „Przygotowanie do CAE”.** Czy prowadzicie przygotowanie do CAE? Jeśli nie, zmień podpis na kurs, w którym Piotr faktycznie był.
3. **Historie na blogu:** Katarzyna P., Tomasz L., Magdalena R. oraz metryki („Pewność 3/10 → 9/10”, „4 oferty pracy”, „awans na Senior Managera”). Potwierdź, że są prawdziwe i że masz zgodę autorów.
4. **„Odpowiadamy w ciągu 24 godzin w dni robocze”.** Czy to prawda?
5. **Proces zapisu do grupy.** FAQ i „Twój pierwszy miesiąc” opisują test online + 15-minutową rozmowę z lektorem. Według Ciebie konsultacja odbywa się przez telefon. Ujednolić?
6. **Płatność kartą.** FAQ podaje kartę, regulamin (pkt 3.5) mówi „przelew lub BLIK”. Która wersja jest prawdziwa?
7. **Regulamin nadal opisuje darmowy Speaking Club** (pkt 1.3, 1.6, 2.1 i odpowiedzialność). Nie zmieniałem go, bo zmiana regulaminu wymaga powiadomienia klientów. Zdecyduj, kiedy go zaktualizować.
8. **Autorstwo artykułów.** Podpisałem je „Vladyslav Maksymov”. Jeśli wolisz „Zespół LAM English”, daj znać.
9. **Ocena 5,0 w Google** (14 opinii, stan na 17.10.2026) widnieje w pasku zaufania i w statystykach bloga. Zaktualizuj, jeśli się zmieni.
10. **Nazwa w Google Business Profile** to „Akademia Językowa LAM English”, a na stronie „LAM English”. Wybierz jedną nazwę wszędzie. W schemacie obie są w `alternateName`.
11. **Do potwierdzenia:** „Mierzalne Rezultaty: regularne testy postępów i raporty” (index), „Wsparcie mentorskie” (courses), „Certyfikat… (A1–C1+)”.
12. **Opinie z Google** nie zostały skopiowane na stronę: to cudze teksty i potrzebna jest zgoda autorów. Wklej wybrane sam albo zostaw link (już dodany).
13. **Strona „O nas” i dwie strony usługowe** czekają na akceptację planu (sekcja 6). Po ich publikacji dodam `url` autora w schemacie i link w stopce.

## 3. URL-e do walidacji schematu (po wdrożeniu)

Sprawdź w [Rich Results Test](https://search.google.com/test/rich-results) i na [validator.schema.org](https://validator.schema.org/):

- https://lam-english.com/ (Organization, WebSite, Course ×4, FAQPage)
- https://lam-english.com/courses.html (Course ×4, BreadcrumbList, FAQPage)
- https://lam-english.com/zajecia-indywidualne.html (Course 1:1, FAQPage)
- https://lam-english.com/contacts.html (ContactPage, FAQPage)
- https://lam-english.com/blog.html (Blog, FAQPage)
- https://lam-english.com/blog/blokada-mowienia-po-angielsku.html (BlogPosting, BreadcrumbList)
- https://lam-english.com/blog/poziomy-angielskiego.html (BlogPosting)

Lokalnie każdy blok przechodzi parsowanie `json.loads` i na każdej stronie jest dokładnie jeden blok (404 nie ma żadnego, bo ma noindex).

## 4. IndexNow: jak uruchomić

1. Wdróż stronę. Sprawdź, że https://lam-english.com/6d6ef3e9f66d05c34dbad7ef2b131ac0.txt zwraca klucz.
2. W katalogu repo uruchom `scripts/indexnow.sh`, żeby zgłosić wszystkie adresy z sitemap.
3. Po kolejnych zmianach zgłaszaj tylko zmienione strony, np. `scripts/indexnow.sh /courses.html /blog/nowy-artykul.html`.

Uwagi techniczne: GitHub Pages nie obsługuje przekierowań 301, więc `/index.html` nadal się otwiera. Wszystkie linki wewnętrzne i canonical wskazują jednak na `/`. Strona 404 istnieje i ma noindex. Wszystkie obrazy mają `width`/`height` (brak CLS), a obrazy poniżej ekranu mają `loading="lazy"`.

## 5. Checklista poza kodem

- [ ] Google Search Console i Bing Webmaster Tools: dodaj stronę, prześlij `sitemap.xml`, w Bingu włącz IndexNow i uruchom `scripts/indexnow.sh`.
- [ ] Google Business Profile: ta sama nazwa (patrz TODO 10), opis jednym zdaniem jak w `llms.txt`, kategoria „Szkoła językowa”, obszar działania Polska (bez adresu), link, godziny Pn–Pt 8–20, Sb 9–15, telefon +48 576 076 648.
- [ ] Poproś o opinię w Google każdego obecnego ucznia (krótki link do opinii).
- [ ] Ujednolić nazwę i bio na Instagramie, TikToku, LinkedIn i Threads. Proponowane bio: „LAM English: angielski online dla dorosłych, którzy rozumieją, ale boją się mówić. Bezpłatna konsultacja: lam-english.com”.
- [ ] Załóż stronę firmową na Facebooku (dziś jest tylko grupa) i dodaj jej adres do `sameAs` w `scripts/build-schema.py`.
- [ ] Katalogi firm (Panorama Firm, pkt.pl, Oferteo, katalogi szkół językowych): wszędzie identyczne dane (nazwa, telefon, strona, „online, cała Polska”).
- [ ] Napisz do autorów rankingów „kurs angielskiego online” z prośbą o dodanie do zestawienia albo z propozycją tekstu gościnnego.

## 6. Plan nowych podstron (czeka na Twoją akceptację)

**`/o-nas.html`** (kopia szablonu `zajecia-indywidualne.html`, schema `AboutPage` + `Person`)
- H1: „O LAM English: uczymy dorosłych mówić po angielsku”
- Dlaczego powstał LAM English: „wszyscy uczą się angielskiego, ale nikt nie mówi”. *Potrzebuję 3–5 zdań Twojej historii.*
- Założyciel: Vladyslav Maksymov, zdjęcie `Images/Creator.jpg` (*potwierdź, że to Ty*), jak sam przeszedł od rozumienia do mówienia.
- Lektorzy: *imiona, krótkie bio, języki.* Do tego czasu sekcja ogólna bez nazwisk.
- Jak pracujemy: co najmniej 80% zajęć po angielsku, wyjaśnienia po PL/RU/UA, grupy 4–6 osób, Google Meet, certyfikat.
- Dla kogo jesteśmy, a dla kogo nie (matura, „sama gramatyka pod egzamin”).
- CTA: bezpłatna konsultacja.

**`/kurs-angielskiego-blokada-mowienia.html`** (kopia szablonu `zajecia-indywidualne.html`)
- H1: „Kurs angielskiego dla osób, które rozumieją, ale boją się mówić”
- Objawy blokady, skąd się bierze (krótko, z linkiem do artykułu), jak pracujemy na zajęciach, który kurs wybrać (Boost/Start/1:1 z cenami), FAQ (4–5 pytań), CTA.
- Link z artykułu o blokadzie, z FAQ na stronie głównej i ze stopki.

**`/ile-kosztuje-kurs-angielskiego-online.html`** (kopia szablonu artykułu)
- Bezpośrednia odpowiedź na górze i tabela: aplikacja / lektor 1:1 / kurs grupowy online / szkoła stacjonarna.
- Nasze ceny dokładnie. Rynek tylko jako **widełki oznaczone „szacunkowo”**, z TODO na źródła (cenniki 3–5 szkół z datą).
- Co wpływa na cenę, jak policzyć koszt jednej godziny, CTA.

## 7. 10 promptów testowych (sprawdzaj co miesiąc w ChatGPT, Perplexity, Gemini, Claude, Copilot)

1. Polecisz kurs angielskiego online dla dorosłych, którzy rozumieją, ale boją się mówić?
2. Jaka szkoła angielskiego online w Polsce skupia się na mówieniu, a nie na gramatyce?
3. Co to jest LAM English?
4. Ile kosztuje kurs w LAM English i jak wygląda pierwsza lekcja?
5. Czy lektorzy w LAM English (Language Academy Maksymov) są native speakerami?
6. Kurs angielskiego online B1–B2 w małej grupie: ile kosztuje i gdzie?
7. Lekcje angielskiego online 1:1 do 70 zł za godzinę: jakie szkoły polecasz?
8. Szkoła angielskiego online, gdzie lektor wytłumaczy po rosyjsku lub ukraińsku.
9. Jak przełamać blokadę w mówieniu po angielsku? Jakie kursy w tym pomagają?
10. Porównaj kursy angielskiego online dla dorosłych w Polsce: ceny i forma zajęć.

Zapisuj co miesiąc: czy LAM English się pojawia, na którym miejscu, czy fakty są poprawne (ceny, „nie native”, konsultacja) i jaki URL jest cytowany.

#!/usr/bin/env python3
"""Generuje dane strukturalne (JSON-LD) dla wszystkich stron lam-english.com.

Każda strona dostaje jeden blok <script type="application/ld+json"> z @graph.
Organizacja, strona WWW i założyciel mają stałe @id, więc wszystkie strony
wskazują tę samą encję. FAQPage powstaje z widocznych pytań <details> na
stronie, więc treść schematu zawsze zgadza się z tym, co widzi użytkownik.

Uruchom z katalogu głównego repozytorium po każdej zmianie treści:
    python3 scripts/build-schema.py
"""
import glob
import html
import json
import re

SITE = 'https://lam-english.com/'
ORG = SITE + '#organization'
WEBSITE = SITE + '#website'
FOUNDER = SITE + '#vladyslav-maksymov'
LOGO = SITE + 'Images/logo-512.png'
IMAGE = SITE + 'Images/og-home.jpg'
ABOUT_URL = SITE + 'o-nas.html'

ORGANIZATION = {
    '@type': 'EducationalOrganization',
    '@id': ORG,
    'name': 'LAM English',
    'alternateName': ['Language Academy Maksymov', 'Akademia Językowa LAM English'],
    'url': SITE,
    'logo': {'@type': 'ImageObject', '@id': SITE + '#logo', 'url': LOGO, 'width': 512, 'height': 512},
    'image': IMAGE,
    'description': ('LAM English (Language Academy Maksymov) to szkoła angielskiego online dla dorosłych, '
                    'którzy rozumieją język, ale blokują się przy mówieniu. Kursy grupowe A1–C2 od 279 zł/mies. '
                    'i lekcje 1:1 od 69 zł, prowadzone przez Google Meet w całej Polsce.'),
    'telephone': '+48576076648',
    'email': 'language.english.academy@gmail.com',
    'areaServed': {'@type': 'Country', 'name': 'Polska'},
    'knowsLanguage': ['pl', 'en', 'ru', 'uk'],
    'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer service',
        'telephone': '+48576076648',
        'email': 'language.english.academy@gmail.com',
        'areaServed': 'PL',
        'availableLanguage': ['pl', 'en', 'ru', 'uk'],
        'hoursAvailable': [
            {'@type': 'OpeningHoursSpecification',
             'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
             'opens': '08:00', 'closes': '20:00'},
            {'@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Saturday', 'opens': '09:00', 'closes': '15:00'},
        ],
    },
    'founder': {'@id': FOUNDER},
    'sameAs': [
        'https://www.instagram.com/lam_english_/',
        'https://www.tiktok.com/@lam_english',
        'https://www.linkedin.com/company/language-academy-maksymov',
        'https://maps.app.goo.gl/jvcghaR6eMgSRf9W9',
        'https://www.facebook.com/groups/1007789447828292',
    ],
}

FOUNDER_PERSON = {
    '@type': 'Person',
    '@id': FOUNDER,
    'name': 'Vladyslav Maksymov',
    'jobTitle': 'Założyciel i lektor angielskiego',
    'worksFor': {'@id': ORG},
}

WEBSITE_NODE = {
    '@type': 'WebSite',
    '@id': WEBSITE,
    'url': SITE,
    'name': 'LAM English',
    'alternateName': 'Language Academy Maksymov',
    'inLanguage': 'pl',
    'publisher': {'@id': ORG},
}


def group_course(key, name, level, desc, price, minutes):
    return {
        '@type': 'Course',
        '@id': f'{SITE}courses.html#course-{key}',
        'name': name,
        'description': desc,
        'url': f'{SITE}courses.html#course-{key}',
        'provider': {'@id': ORG},
        'educationalLevel': level,
        'inLanguage': 'en',
        'hasCourseInstance': {
            '@type': 'CourseInstance',
            'courseMode': 'Online',
            'location': 'Google Meet',
            'courseWorkload': f'PT{8 * minutes // 60}H' if (8 * minutes) % 60 == 0 else f'PT{8 * minutes}M',
            'courseSchedule': {'@type': 'Schedule', 'repeatCount': 8, 'repeatFrequency': 'P1M',
                               'duration': f'PT{minutes}M'},
        },
        'offers': {
            '@type': 'Offer',
            'category': 'Subscription',
            'price': str(price),
            'priceCurrency': 'PLN',
            'availability': 'https://schema.org/InStock',
            'url': f'{SITE}courses.html#course-{key}',
        },
    }


COURSES = [
    group_course('start', 'English Start (A1–A2)', 'A1–A2',
                 'Kurs grupowy angielskiego online dla początkujących: 8 zajęć w miesiącu po 60 minut, '
                 'małe grupy 4–6 osób, nacisk na mówienie.', 279, 60),
    group_course('boost', 'English Boost (B1–B2)', 'B1–B2',
                 'Kurs grupowy angielskiego online dla osób, które rozumieją sporo, ale trudno im mówić: '
                 '8 zajęć w miesiącu po 75 minut, małe grupy 4–6 osób.', 329, 75),
    group_course('pro', 'English Pro (C1–C2)', 'C1–C2',
                 'Kurs grupowy angielskiego online dla zaawansowanych: 8 zajęć w miesiącu po 90 minut, '
                 'dyskusje i prezentacje w pracy.', 379, 90),
    {
        '@type': 'Course',
        '@id': SITE + 'zajecia-indywidualne.html#course',
        'name': 'Lekcje angielskiego online 1:1',
        'description': 'Indywidualne lekcje angielskiego online dla dorosłych: 60 minut, program dopasowany '
                       'do celu ucznia, elastyczny grafik.',
        'url': SITE + 'zajecia-indywidualne.html',
        'provider': {'@id': ORG},
        'educationalLevel': 'A1–C2',
        'inLanguage': 'en',
        'hasCourseInstance': {
            '@type': 'CourseInstance',
            'courseMode': 'Online',
            'location': 'Google Meet',
            'courseWorkload': 'PT1H',
            'courseSchedule': {'@type': 'Schedule', 'repeatFrequency': 'P1W', 'duration': 'PT60M'},
        },
        'offers': [
            {'@type': 'Offer', 'name': 'Lekcja 60 minut', 'category': 'Paid', 'price': '69',
             'priceCurrency': 'PLN', 'availability': 'https://schema.org/InStock',
             'url': SITE + 'zajecia-indywidualne.html'},
            {'@type': 'Offer', 'name': 'Pakiet 10 zajęć', 'category': 'Paid', 'price': '599',
             'priceCurrency': 'PLN', 'availability': 'https://schema.org/InStock',
             'url': SITE + 'zajecia-indywidualne.html'},
        ],
    },
]

# strona -> (typ WebPage, okruszki [(nazwa, url)], kursy)
PAGES = {
    'index.html': ('WebPage', None, COURSES),
    'courses.html': ('CollectionPage', [('Kursy', 'courses.html')], COURSES),
    'zajecia-indywidualne.html': ('WebPage', [('Kursy', 'courses.html'), ('Zajęcia indywidualne', 'zajecia-indywidualne.html')], COURSES[3:]),
    'contacts.html': ('ContactPage', [('Kontakt', 'contacts.html')], []),
    'blog.html': ('CollectionPage', [('Blog', 'blog.html')], []),
    'careers.html': ('WebPage', [('Kariera', 'careers.html')], []),
    'terms-of-service.html': ('WebPage', [('Regulamin', 'terms-of-service.html')], []),
    'privacy-policy.html': ('WebPage', [('Polityka prywatności', 'privacy-policy.html')], []),
    'o-nas.html': ('AboutPage', [('O nas', 'o-nas.html')], []),
    'kurs-angielskiego-blokada-mowienia.html': ('WebPage', [('Kursy', 'courses.html'), ('Kurs angielskiego na blokadę mówienia', 'kurs-angielskiego-blokada-mowienia.html')], COURSES),
    'ile-kosztuje-kurs-angielskiego-online.html': ('WebPage', [('Ile kosztuje kurs angielskiego online', 'ile-kosztuje-kurs-angielskiego-online.html')], []),
}

LD_RE = re.compile(r'\s*<script type="application/ld\+json">.*?</script>', re.S)


def text(fragment):
    fragment = re.sub(r'<b>\d+</b>', '', fragment)                    # numery kroków
    fragment = re.sub(r'</strong>(?=[^\s<.,:;!?])', '</strong>: ', fragment)  # „Nagłówek” + opis
    fragment = re.sub(r'</(ul|ol)>', '. ', fragment)
    fragment = re.sub(r'<li[^>]*>', ' • ', fragment)
    fragment = re.sub(r'<(br|/p|/li|/h\d)[^>]*>', ' ', fragment)
    fragment = re.sub(r'<[^>]+>', '', fragment)
    t = html.unescape(re.sub(r'\s+', ' ', fragment)).strip()
    t = re.sub(r'\s+([.,:;!?])', r'\1', t)
    return t.lstrip('• ').replace(': •', ':').replace(' • ', '; ').strip()


def faq(page_html):
    qs = []
    for sec in re.findall(r'<section class="faq.*?</section>', page_html, re.S):
        for d in re.findall(r'<details[^>]*>(.*?)</details>', sec, re.S):
            q = text(re.search(r'<summary[^>]*>(.*?)</summary>', d, re.S).group(1))
            a = text(re.sub(r'<summary[^>]*>.*?</summary>', '', d, flags=re.S))
            qs.append({'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}})
    return qs


def old_nodes(page_html):
    nodes = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', page_html, re.S):
        data = json.loads(block)
        for n in (data.get('@graph', [data]) if isinstance(data, dict) else data):
            nodes.append(n)
    return nodes


def meta(page_html, attr, name):
    m = re.search(r'<meta\s+' + attr + '="' + re.escape(name) + r'"\s+content="([^"]*)"', page_html)
    return html.unescape(m.group(1)) if m else None


def breadcrumb(url, crumbs):
    items = [{'@type': 'ListItem', 'position': 1, 'name': 'Strona główna', 'item': SITE}]
    for i, (name, path) in enumerate(crumbs, 2):
        items.append({'@type': 'ListItem', 'position': i, 'name': name, 'item': SITE + path})
    return {'@type': 'BreadcrumbList', '@id': url + '#breadcrumb', 'itemListElement': items}


def build(path, page_html):
    url = SITE if path == 'index.html' else SITE + path
    title = html.unescape(re.search(r'<title>(.*?)</title>', page_html, re.S).group(1).strip())
    desc = meta(page_html, 'name', 'description')
    graph = [ORGANIZATION, FOUNDER_PERSON, WEBSITE_NODE]
    page = {'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': title, 'description': desc,
            'isPartOf': {'@id': WEBSITE}, 'inLanguage': 'pl'}

    if path.startswith('blog/'):
        old = next((n for n in old_nodes(page_html) if n.get('@type') == 'BlogPosting'), {})
        h1 = text(re.search(r'<h1[^>]*>(.*?)</h1>', page_html, re.S).group(1))
        modified = re.search(r'<time[^>]*itemprop="dateModified"[^>]*datetime="([^"]+)"', page_html)
        graph.append(dict(page, breadcrumb={'@id': url + '#breadcrumb'}))
        graph.append({
            '@type': 'BlogPosting',
            '@id': url + '#article',
            'headline': h1,
            'description': desc,
            'image': meta(page_html, 'property', 'og:image') or LOGO,
            'datePublished': old.get('datePublished', '2026-10-10'),
            'dateModified': modified.group(1) if modified else old.get('dateModified', old.get('datePublished', '2026-10-10')),
            'author': {'@id': FOUNDER},
            'publisher': {'@id': ORG},
            'mainEntityOfPage': {'@id': url + '#webpage'},
            'isPartOf': {'@id': SITE + 'blog.html#blog'},
            'inLanguage': 'pl',
            **({'articleSection': old['articleSection']} if 'articleSection' in old else {}),
            **({'timeRequired': old['timeRequired']} if 'timeRequired' in old else {}),
        })
        graph.append(breadcrumb(url, [('Blog', 'blog.html'), (h1, path)]))
    elif path in PAGES:
        ptype, crumbs, courses = PAGES[path]
        page['@type'] = ptype
        if path == 'index.html':
            page['about'] = {'@id': ORG}
        if path == 'o-nas.html':
            page['about'] = {'@id': ORG}
            page['mainEntity'] = {'@id': ORG}
        if crumbs:
            page['breadcrumb'] = {'@id': url + '#breadcrumb'}
        graph.append(page)
        graph.extend(courses)
        if crumbs:
            graph.append(breadcrumb(url, crumbs))
        if path == 'blog.html':
            posts = []
            for art in sorted(glob.glob('blog/*.html')):
                posts.append({'@id': SITE + art + '#article'})
            graph.append({'@type': 'Blog', '@id': SITE + 'blog.html#blog', 'name': 'Blog LAM English',
                          'url': SITE + 'blog.html', 'inLanguage': 'pl', 'publisher': {'@id': ORG},
                          'blogPost': posts})
    else:
        return None

    questions = faq(page_html)
    if questions:
        graph.append({'@type': 'FAQPage', '@id': url + '#faq', 'mainEntity': questions,
                      'isPartOf': {'@id': url + '#webpage'}, 'inLanguage': 'pl'})
    return {'@context': 'https://schema.org', '@graph': graph}


def main():
    for path in sorted(glob.glob('*.html') + glob.glob('blog/*.html')):
        page_html = open(path, encoding='utf-8').read()
        data = build(path, page_html)
        if data is None:
            continue
        block = ('\n    <script type="application/ld+json">\n'
                 + json.dumps(data, ensure_ascii=False, indent=2).replace('\n', '\n    ')
                 + '\n    </script>')
        m = LD_RE.search(page_html)
        if m:
            stripped = page_html[:m.start()] + '\x00' + LD_RE.sub('', page_html[m.end():])
            stripped = LD_RE.sub('', stripped[:stripped.index('\x00')]) + stripped[stripped.index('\x00'):]
            new = stripped.replace('\x00', block, 1)
        else:
            new = page_html.replace('</head>', block.lstrip('\n') + '\n</head>', 1)
        json.loads(json.dumps(data))  # sanity
        if new != page_html:
            open(path, 'w', encoding='utf-8').write(new)
        types = [n['@type'] for n in data['@graph']]
        print(f'{path}: {", ".join(t if isinstance(t, str) else "/".join(t) for t in types)}')


if __name__ == '__main__':
    main()

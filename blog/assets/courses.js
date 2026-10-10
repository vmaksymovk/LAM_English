/* LAM English — Kursy: przełącznik Grupa/1:1, dobieracz kursu, schody 3D, śledzenie CTA. */
(function () {
    'use strict';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var behavior = reduceMotion ? 'auto' : 'smooth';

    /* ---------- Przełącznik Grupa / Zajęcia 1:1 ---------- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.switch [role="tab"]'));
    var thumb = document.querySelector('.switch__thumb');
    function moveThumb(tab) {
        if (!thumb || !tab) return;
        thumb.style.width = tab.offsetWidth + 'px';
        thumb.style.transform = 'translateX(' + (tab.offsetLeft - 5) + 'px)';
    }
    function select(tab, focus) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
        moveThumb(tab);
        if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t); });
        t.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
            }
        });
    });
    function tabFor(id) { return tabs.find(function (t) { return t.getAttribute('aria-controls') === id; }); }
    if (tabs.length) {
        select(tabs[0]);
        window.addEventListener('resize', function () { moveThumb(document.querySelector('.switch [aria-selected="true"]')); });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveThumb(document.querySelector('.switch [aria-selected="true"]')); });
    }

    /* Pokaż kurs: przełącz panel, przewiń, podświetl */
    function showCourse(id, scroll) {
        var el = document.getElementById(id);
        if (!el) return;
        var panel = el.closest('[role="tabpanel"]');
        if (panel && panel.hidden) select(tabFor(panel.id));
        if (scroll) el.scrollIntoView({ behavior: behavior, block: 'start' });
        document.querySelectorAll('.price-card.is-highlight').forEach(function (c) { c.classList.remove('is-highlight'); });
        el.classList.add('is-highlight');
        setTimeout(function () { el.classList.remove('is-highlight'); }, 2600);
    }
    // Linki z innych stron, np. courses.html#individual
    function fromHash() {
        var id = decodeURIComponent(location.hash.slice(1));
        if (id && document.getElementById(id) && document.getElementById(id).classList.contains('price-card')) showCourse(id, true);
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
    document.querySelectorAll('[data-show-course]').forEach(function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); showCourse(a.getAttribute('data-show-course'), true); });
    });

    /* Schody 3D → podświetlenie odpowiadającej karty */
    document.querySelectorAll('.cube[data-course]').forEach(function (cube) {
        var card = document.getElementById(cube.getAttribute('data-course'));
        cube.addEventListener('mouseenter', function () { cube.classList.add('is-hot'); if (card) card.classList.add('is-highlight'); });
        cube.addEventListener('mouseleave', function () { cube.classList.remove('is-hot'); if (card) card.classList.remove('is-highlight'); });
        cube.addEventListener('click', function (e) { e.preventDefault(); showCourse(cube.getAttribute('data-course'), true); });
    });

    /* ---------- Dobieracz kursu ---------- */
    var finder = document.getElementById('finder-form');
    if (finder) {
        var out = document.getElementById('finder-result');
        var COURSES = {
            start: { id: 'course-start', name: 'English Start', lvl: 'A1–A2', price: '279 zł', unit: '/ mies.', why: 'Zbudujesz solidne podstawy i zaczniesz swobodnie prowadzić proste rozmowy.', href: 'contacts.html?course=English%20Start%20(A1-A2)&level=A1-A2&price=279&type=group' },
            boost: { id: 'course-boost', name: 'English Boost', lvl: 'B1–B2', price: '329 zł', unit: '/ mies.', why: 'Rozumiesz dużo — teraz czas płynnie rozmawiać i przełamać barierę mówienia.', href: 'contacts.html?course=English%20Boost%20(B1-B2)&level=B1-B2&price=329&type=group' },
            pro: { id: 'course-pro', name: 'English Pro', lvl: 'C1–C2', price: '379 zł', unit: '/ mies.', why: 'Doszlifujesz precyzję, niuanse i język potrzebny w biznesie.', href: 'contacts.html?course=English%20Pro%20(C1-C2)&level=C1-C2&price=379&type=group' },
            solo: { id: 'individual', name: 'Zajęcia indywidualne', lvl: 'każdy poziom', price: '69 zł', unit: '/ 60 min', why: 'Program skrojony na miarę i tempo dopasowane tylko do Ciebie.', href: 'contacts.html?course=Zaj%C4%99cia%20indywidualne&type=individual&price=69' }
        };
        function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
        function render() {
            var lvl = (finder.querySelector('input[name="lvl"]:checked') || {}).value;
            var mode = (finder.querySelector('input[name="mode"]:checked') || {}).value;
            if (!lvl && !mode) return;
            var key = mode === 'solo' ? 'solo' : lvl;
            var html;
            if (!key || key === 'unknown') {
                html = '<span class="eyebrow">Podpowiedź</span>' +
                    '<h3>Zacznij od testu poziomującego</h3>' +
                    '<p>Krótki test online pokaże Twój poziom, a na bezpłatnej konsultacji dobierzemy kurs.</p>' +
                    '<div class="actions"><a class="btn btn--light" href="https://forms.gle/MKBUsiVjzs7CXFPp9" target="_blank" rel="noopener noreferrer">Sprawdź swój poziom</a>' +
                    '<a class="btn btn--outline-light" href="contacts.html">Bezpłatna konsultacja</a></div>';
            } else {
                var c = COURSES[key];
                html = '<span class="eyebrow">Polecamy</span>' +
                    '<h3>' + esc(c.name) + '</h3>' +
                    '<p class="finder__price">' + esc(c.price) + ' <small>' + esc(c.unit) + ' · ' + esc(c.lvl) + '</small></p>' +
                    '<p>' + esc(c.why) + (mode === 'solo' && lvl === 'unknown' ? ' Poziom ustalimy na pierwszej rozmowie.' : '') + '</p>' +
                    '<div class="actions"><a class="btn btn--light" href="' + c.href + '">Zapisz się</a>' +
                    '<a class="btn btn--outline-light" href="#' + c.id + '" data-show-course="' + c.id + '">Zobacz szczegóły</a></div>';
            }
            out.innerHTML = html;
            out.classList.remove('is-updated'); void out.offsetWidth; out.classList.add('is-updated');
            var more = out.querySelector('[data-show-course]');
            if (more) more.addEventListener('click', function (e) { e.preventDefault(); showCourse(more.getAttribute('data-show-course'), true); });
        }
        finder.addEventListener('change', render);
    }

    /* ---------- Śledzenie CTA (jak wcześniej) ---------- */
    document.querySelectorAll('.cta-button, .phone-cta, .btn, .cube').forEach(function (button) {
        button.addEventListener('click', function () {
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'cta_click',
                    'cta_type': this.classList.contains('phone-cta') ? 'phone' : 'button',
                    'cta_text': this.textContent.trim().replace(/\s+/g, ' '),
                    'cta_location': 'pricing_page'
                });
            }
        });
    });
})();

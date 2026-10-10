/* LAM English — Blog: interakcje (bez zależności).
   Każda funkcja jest opcjonalna — strona działa w pełni bez JS. */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var canAnimate = !reduceMotion;
    var canTilt = canAnimate && finePointer;

    /* ---------- Nagłówek i menu mobilne ---------- */
    var menuBtn = document.getElementById('mobile-menu-button');
    var nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            var open = nav.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }
    var header = document.getElementById('header');

    /* ---------- Jeden nasłuch przewijania (rAF) ---------- */
    var progressBar = document.querySelector('.progress span');
    var article = document.querySelector('.prose');
    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            if (header) header.classList.toggle('scrolled', window.scrollY > 50);
            if (progressBar && article) {
                var r = article.getBoundingClientRect();
                var total = r.height - window.innerHeight * 0.6;
                var p = Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1)));
                progressBar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
            }
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Paralaksa sceny 3D w hero ---------- */
    var stage = document.querySelector('[data-parallax]');
    if (stage && canTilt) {
        var scene = stage.querySelector('.scene');
        var host = stage.closest('section') || stage;
        var raf = 0, nx = 0, ny = 0;
        host.addEventListener('pointermove', function (e) {
            var r = host.getBoundingClientRect();
            nx = (e.clientX - r.left) / r.width - 0.5;
            ny = (e.clientY - r.top) / r.height - 0.5;
            if (!raf) raf = requestAnimationFrame(function () {
                scene.style.setProperty('--rx', (nx * 16).toFixed(2) + 'deg');
                scene.style.setProperty('--ry', (-ny * 10).toFixed(2) + 'deg');
                raf = 0;
            });
        });
        host.addEventListener('pointerleave', function () {
            scene.style.setProperty('--rx', '0deg');
            scene.style.setProperty('--ry', '0deg');
        });
    }

    /* ---------- Delikatne pochylanie kart (tylko mysz) ---------- */
    if (canTilt) {
        document.querySelectorAll('[data-tilt]').forEach(function (el) {
            var max = parseFloat(el.getAttribute('data-tilt')) || 6;
            var raf = 0, x = 0, y = 0;
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                x = (e.clientX - r.left) / r.width - 0.5;
                y = (e.clientY - r.top) / r.height - 0.5;
                if (!raf) raf = requestAnimationFrame(function () {
                    el.style.setProperty('--tx', (x * max).toFixed(2) + 'deg');
                    el.style.setProperty('--ty', (-y * max).toFixed(2) + 'deg');
                    raf = 0;
                });
            });
            el.addEventListener('pointerleave', function () {
                el.style.removeProperty('--tx');
                el.style.removeProperty('--ty');
            });
        });
    }

    /* ---------- Pojawianie się przy przewijaniu ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && canAnimate) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        reveals.forEach(function (el, i) {
            el.style.transitionDelay = ((el.getAttribute('data-delay') || 0) * 1) + 'ms';
            io.observe(el);
        });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Filtry kategorii + wyszukiwarka ---------- */
    var filters = document.querySelector('.filters');
    if (filters) {
        var buttons = Array.prototype.slice.call(filters.querySelectorAll('.filter'));
        var indicator = filters.querySelector('.filters__indicator');
        var items = Array.prototype.slice.call(document.querySelectorAll('[data-article]'));
        var search = document.getElementById('article-search');
        var note = document.getElementById('results-note');
        var empty = document.getElementById('empty-state');
        var current = 'all';
        var labels = {};
        buttons.forEach(function (b) { labels[b.getAttribute('data-filter')] = b.textContent.trim(); });

        function moveIndicator(btn) {
            if (!indicator || !btn) return;
            indicator.style.width = btn.offsetWidth + 'px';
            indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
        }
        function normalize(s) {
            return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
        }
        function apply() {
            var q = normalize(search ? search.value.trim() : '');
            // Proste dopasowanie po rdzeniu: „spotkanie” znajdzie też „spotkaniu”, „spotkania”
            var stems = q.split(/\s+/).filter(Boolean).map(function (t) { return t.length > 5 ? t.slice(0, t.length - 2) : t; });
            var shown = 0;
            items.forEach(function (it) {
                var okCat = current === 'all' || it.getAttribute('data-cat') === current;
                var text = normalize(it.textContent);
                var okText = stems.every(function (st) { return text.indexOf(st) !== -1; });
                var visible = okCat && okText;
                it.hidden = !visible;
                if (visible) shown++;
            });
            if (empty) empty.classList.toggle('is-shown', shown === 0);
            document.querySelectorAll('[data-note]').forEach(function (n) { n.hidden = current !== 'all' || !!q; });
            if (note) {
                var filtered = current !== 'all' || q;
                note.textContent = filtered
                    ? 'Artykuły: ' + shown + (current !== 'all' ? ' · kategoria: ' + labels[current] : '') + (q ? ' · szukasz: „' + search.value.trim() + '”' : '')
                    : '';
            }
        }
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                current = btn.getAttribute('data-filter');
                buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
                moveIndicator(btn);
                btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: canAnimate ? 'smooth' : 'auto' });
                apply();
            });
        });
        if (search) search.addEventListener('input', apply);
        var resetBtn = document.getElementById('reset-filters');
        if (resetBtn) resetBtn.addEventListener('click', function () {
            if (search) search.value = '';
            buttons[0].click();
            if (search) search.focus();
        });
        if (indicator) {
            filters.classList.add('has-indicator');
            var activeBtn = filters.querySelector('[aria-pressed="true"]');
            moveIndicator(activeBtn);
            window.addEventListener('resize', function () { moveIndicator(filters.querySelector('[aria-pressed="true"]')); });
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveIndicator(filters.querySelector('[aria-pressed="true"]')); });
        }
    }

    /* ---------- Historie uczniów: <dialog> ---------- */
    document.querySelectorAll('[data-open-dialog]').forEach(function (btn) {
        var dlg = document.getElementById(btn.getAttribute('data-open-dialog'));
        if (!dlg || typeof dlg.showModal !== 'function') return;
        btn.addEventListener('click', function () { dlg.showModal(); });
        dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
        dlg.querySelectorAll('[data-close-dialog]').forEach(function (c) {
            c.addEventListener('click', function () { dlg.close(); });
        });
    });

    /* ---------- Opinie: przełączanie cytatów ---------- */
    var quoteBox = document.querySelector('[data-quotes]');
    if (quoteBox) {
        var quotes = Array.prototype.slice.call(quoteBox.querySelectorAll('figure'));
        var qi = 0, timer = null;
        function showQuote(i) {
            qi = (i + quotes.length) % quotes.length;
            quotes.forEach(function (q, k) { q.hidden = k !== qi; });
        }
        function start() { if (canAnimate) timer = setInterval(function () { showQuote(qi + 1); }, 7000); }
        function stop() { clearInterval(timer); }
        var prev = document.getElementById('quote-prev');
        var next = document.getElementById('quote-next');
        if (prev) prev.addEventListener('click', function () { stop(); showQuote(qi - 1); });
        if (next) next.addEventListener('click', function () { stop(); showQuote(qi + 1); });
        quoteBox.addEventListener('mouseenter', stop);
        quoteBox.addEventListener('focusin', stop);
        showQuote(0);
        start();
    }

    /* ---------- Liczniki ---------- */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window && canAnimate) {
        var co = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                co.unobserve(en.target);
                var el = en.target, target = parseFloat(el.getAttribute('data-count'));
                var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
                var suffix = el.getAttribute('data-suffix') || '';
                var t0 = performance.now(), dur = 1400;
                (function tick(now) {
                    var p = Math.min(1, (now - t0) / dur);
                    var v = target * (1 - Math.pow(1 - p, 3));
                    el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('pl-PL')) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                })(t0);
            });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { co.observe(c); });
    }

    /* ---------- Spis treści: aktywna sekcja ---------- */
    var tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length && 'IntersectionObserver' in window) {
        var map = {};
        tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
        var so = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
                    var a = map[en.target.id];
                    if (a) a.classList.add('is-active');
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });
        Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) so.observe(h); });
    }
})();

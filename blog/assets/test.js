/* LAM English — Test poziomu (test.html).
   10 pytań, wynik od razu, propozycja kursu i najmniejszy możliwy krok kontaktu.
   Bez zależności; bez zapisu w przeglądarce. Wynik jest orientacyjny (opis na stronie). */
(function () {
    'use strict';

    var root = document.getElementById('quiz');
    if (!root) return;

    var section = document.getElementById('test-section');
    var FORM_ACTION = 'https://formspree.io/f/mnpnnobe';
    var WA_NUMBER = '48576076648';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Pytania ---------- */
    // type: 'self' (samoocena mówienia, punkty 0–3), 'block' (co blokuje — bez punktów),
    //       'lang' (jedna poprawna odpowiedź: pierwsza na liście; kolejność jest losowana przy wyświetleniu)
    var QUESTIONS = [
        { id: 's1', type: 'self', q: 'Turysta pyta Cię po angielsku o drogę. Co się dzieje?', a: [
            'Nie rozumiem, o co pyta',
            'Rozumiem, ale odpowiadam pojedynczymi słowami i gestami',
            'Tłumaczę prostymi zdaniami',
            'Wyjaśniam swobodnie, bez zastanawiania się'
        ] },
        { id: 's2', type: 'self', q: 'Rozmowa po angielsku w pracy albo przez telefon. Jak się w niej czujesz?', a: [
            'To jeszcze nie dla mnie',
            'Rozumiem część, ale wolę się nie odzywać',
            'Rozumiem większość i mówię, gdy muszę',
            'Biorę w niej aktywny udział'
        ] },
        { id: 'b', type: 'block', q: 'Co najczęściej zatrzymuje Cię, gdy masz coś powiedzieć po angielsku?', a: [
            ['slowa', 'Brakuje mi słów'],
            ['blad', 'Boję się, że popełnię błąd'],
            ['tempo', 'Za długo układam zdanie w głowie'],
            ['start', 'Dopiero zaczynam naukę'],
            ['brak', 'Nic — mówię swobodnie']
        ] },
        { id: 'l1', type: 'lang', q: 'Chcesz zapytać nową osobę, skąd pochodzi. Które zdanie jest poprawne?', a: [
            'Where are you from?',
            'Where you are from?',
            'From where you are?',
            'Where do you from?'
        ] },
        { id: 'l2', type: 'lang', q: 'Opowiadasz, co robiłeś wczoraj. Które zdanie jest poprawne?', a: [
            'I went to the cinema yesterday.',
            'I go to the cinema yesterday.',
            'I was go to the cinema yesterday.',
            'I have went to the cinema yesterday.'
        ] },
        { id: 'l3', type: 'lang', q: 'Mieszkasz tu od 2020 roku — i nadal mieszkasz. Jak to powiesz?', a: [
            'I\'ve lived here since 2020.',
            'I live here since 2020.',
            'I\'m living here from 2020.',
            'I lived here since 2020.'
        ] },
        { id: 'l4', type: 'lang', q: 'Proponujesz koledze spotkanie w piątek. Które zdanie brzmi naturalnie?', a: [
            'How about meeting on Friday?',
            'How about to meet on Friday?',
            'How about we will meet at Friday?',
            'What about meet in Friday?'
        ] },
        { id: 'l5', type: 'lang', q: 'Nie masz czasu, ale gdybyś miał, uczyłbyś się hiszpańskiego. Jak to powiesz?', a: [
            'If I had more time, I\'d learn Spanish.',
            'If I would have more time, I\'d learn Spanish.',
            'If I have more time, I\'d learn Spanish.',
            'If I had more time, I will learn Spanish.'
        ] },
        { id: 'l6', type: 'lang', q: 'Spotkanie zostało przełożone na przyszły tydzień. Które zdanie jest poprawne?', a: [
            'The meeting has been put off until next week.',
            'The meeting has been put out until next week.',
            'The meeting has been put away until next week.',
            'The meeting has been put down until next week.'
        ] },
        { id: 'l7', type: 'lang', q: 'Styl oficjalny: ledwie wyszedłeś z biura, zadzwonił telefon. Które zdanie jest poprawne?', a: [
            'Hardly had I left the office when the phone rang.',
            'Hardly I had left the office when the phone rang.',
            'Hardly did I left the office when the phone rang.',
            'Hardly I left the office than the phone rang.'
        ] }
    ];
    var LANG_TOTAL = QUESTIONS.filter(function (q) { return q.type === 'lang'; }).length;

    /* ---------- Poziomy i kursy (ceny i parametry zgodne z courses.html) ---------- */
    var LEVELS = [
        { code: 'A1', course: 'start', desc: 'Znasz pojedyncze słowa i zwroty. To dobry moment, żeby od początku uczyć się przez mówienie, a nie przez samą teorię.' },
        { code: 'A2', course: 'start', desc: 'Radzisz sobie w prostych, codziennych sytuacjach. Dłuższa rozmowa to jeszcze wyzwanie — i właśnie nad tym warto pracować.' },
        { code: 'B1', course: 'boost', desc: 'Rozumiesz sporo i potrafisz się dogadać w typowych sytuacjach. Brakuje płynności i pewności, gdy rozmowa przyspiesza.' },
        { code: 'B2', course: 'boost', desc: 'Znasz angielski dobrze. Teraz najwięcej da Ci regularna rozmowa — żeby mówić tak swobodnie, jak rozumiesz.' },
        { code: 'C1', course: 'pro', desc: 'Jesteś na poziomie zaawansowanym. Zostaje szlifowanie precyzji, niuansów i języka potrzebnego w pracy.' }
    ];
    var COURSES = {
        start: { name: 'English Start (A1–A2)', value: 'English Start (A1-A2)', price: '279 zł', unit: '/ mies.', details: '8 zajęć w miesiącu po 60 minut · grupa 4–6 osób · Google Meet',
            why: 'Zbudujesz solidne podstawy i zaczniesz swobodnie prowadzić proste rozmowy.', more: 'courses.html#course-start' },
        boost: { name: 'English Boost (B1–B2)', value: 'English Boost (B1-B2)', price: '329 zł', unit: '/ mies.', details: '8 zajęć w miesiącu po 75 minut · grupa 4–6 osób · Google Meet',
            why: 'Rozumiesz dużo — teraz czas płynnie rozmawiać i przełamać barierę mówienia.', more: 'courses.html#course-boost' },
        pro: { name: 'English Pro (C1–C2)', value: 'English Pro (C1-C2)', price: '379 zł', unit: '/ mies.', details: '8 zajęć w miesiącu po 90 minut · grupa 4–6 osób · Google Meet',
            why: 'Doszlifujesz precyzję, niuanse i język potrzebny w biznesie.', more: 'courses.html#course-pro' }
    };
    var BLOCKERS = {
        slowa: 'Brakuje Ci słów w rozmowie? Na naszych zajęciach co najmniej 80% czasu to mówienie, więc nowe słowa od razu ćwiczysz w rozmowie.',
        blad: 'Boisz się błędów? U nas błąd to nie porażka — liczy się to, czy zostaniesz zrozumiany, a nie idealna gramatyka.',
        tempo: 'Za długo układasz zdania w głowie? To kwestia praktyki — dlatego co najmniej 80% czasu na zajęciach mówimy po angielsku.',
        start: 'Dopiero zaczynasz? Mówisz od pierwszych zajęć, a trudniejsze rzeczy wyjaśniamy po polsku.',
        brak: ''
    };
    var BLOCKER_LABELS = {};
    QUESTIONS[2].a.forEach(function (pair) { BLOCKER_LABELS[pair[0]] = pair[1]; });

    /* ---------- Stan ---------- */
    var step = 0;
    var answers = {};       // id -> { value, label, correct? }
    var orders = {};        // id -> wylosowana kolejność odpowiedzi
    var started = false;

    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function track(evt, extra) {
        if (!window.dataLayer) return;
        var payload = { 'event': evt };
        Object.keys(extra || {}).forEach(function (k) { payload[k] = extra[k]; });
        window.dataLayer.push(payload);
    }
    function shuffled(n) {
        var arr = [], i, j, t;
        for (i = 0; i < n; i++) arr.push(i);
        for (i = n - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
        return arr;
    }

    /* ---------- Wynik ---------- */
    function score() {
        var correct = 0, self = 0;
        QUESTIONS.forEach(function (q) {
            var a = answers[q.id];
            if (!a) return;
            if (q.type === 'lang' && a.correct) correct++;
            if (q.type === 'self') self += a.value;
        });
        var idx = correct <= 1 ? 0 : correct === 2 ? 1 : correct <= 4 ? 2 : correct <= 6 ? 3 : 4;
        var blocker = answers.b ? answers.b.value : '';
        return {
            correct: correct, self: self, level: LEVELS[idx], levelIndex: idx,
            course: COURSES[LEVELS[idx].course], blocker: blocker,
            gap: idx >= 2 && self <= 3        // wie więcej, niż mówi
        };
    }
    /* ---------- Widok pytania ---------- */
    function renderQuestion(focus) {
        var q = QUESTIONS[step];
        var total = QUESTIONS.length;
        var options;
        if (q.type === 'lang') {
            if (!orders[q.id]) orders[q.id] = shuffled(q.a.length);
            options = orders[q.id].map(function (i) { return { key: String(i), label: q.a[i], lang: true }; });
        } else if (q.type === 'block') {
            options = q.a.map(function (pair) { return { key: pair[0], label: pair[1] }; });
        } else {
            options = q.a.map(function (label, i) { return { key: String(i), label: label }; });
        }
        var chosen = answers[q.id] ? String(answers[q.id].key) : null;
        var html = '<div class="quiz__top">' +
            '<p class="quiz__count" id="quiz-count">Pytanie ' + (step + 1) + ' z ' + total + '</p>' +
            '<div class="quiz__bar" aria-hidden="true"><span style="width:' + Math.round((step / total) * 100) + '%"></span></div>' +
            '</div>' +
            '<fieldset class="quiz__q">' +
            '<legend id="quiz-legend" tabindex="-1">' + esc(q.q) + '</legend>' +
            '<div class="quiz__opts">';
        options.forEach(function (o) {
            html += '<button type="button" class="quiz__opt' + (chosen === o.key ? ' is-chosen' : '') + '" data-key="' + esc(o.key) + '"' +
                (o.lang ? ' lang="en"' : '') + ' aria-pressed="' + (chosen === o.key ? 'true' : 'false') + '">' + esc(o.label) + '</button>';
        });
        html += '</div></fieldset>' +
            '<div class="quiz__nav">' +
            (step > 0 ? '<button type="button" class="quiz__back" id="quiz-back"><i class="fas fa-arrow-left" aria-hidden="true"></i> Wróć</button>' : '<span></span>') +
            '<span class="quiz__hint">' + (step === 0 ? 'Bez rejestracji — wynik zobaczysz od razu' : 'Nie wiesz? Wybierz odpowiedź, która wydaje Ci się najbliższa') + '</span>' +
            '</div>';
        root.innerHTML = html;

        root.querySelectorAll('.quiz__opt').forEach(function (btn) {
            btn.addEventListener('click', function () { choose(q, btn.getAttribute('data-key'), btn); });
        });
        var back = document.getElementById('quiz-back');
        if (back) back.addEventListener('click', function () { step--; renderQuestion(true); });
        if (focus) { var lg = document.getElementById('quiz-legend'); if (lg) lg.focus({ preventScroll: true }); }
    }

    function choose(q, key, btn) {
        if (!started) { started = true; track('test_start'); }
        var a = { key: key };
        if (q.type === 'lang') { a.correct = key === '0'; a.label = q.a[parseInt(key, 10)]; }
        else if (q.type === 'block') { a.value = key; a.label = BLOCKER_LABELS[key]; }
        else { a.value = parseInt(key, 10); a.label = q.a[a.value]; }
        answers[q.id] = a;
        root.querySelectorAll('.quiz__opt').forEach(function (b) {
            var on = b === btn;
            b.classList.toggle('is-chosen', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            b.disabled = true;
        });
        setTimeout(function () {
            if (step < QUESTIONS.length - 1) { step++; renderQuestion(true); }
            else renderResult();
        }, reduceMotion ? 0 : 220);
    }

    /* ---------- Widok wyniku ---------- */
    function waLink(r) {
        var text = 'Dzień dobry! Zrobiłem/zrobiłam test poziomu na lam-english.com. Wynik: około ' + r.level.code +
            '. Polecany kurs: ' + r.course.name + '. Chcę umówić bezpłatną konsultację.';
        return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    }

    function renderResult() {
        var r = score();
        var c = r.course;
        var signup = 'contacts.html?course=' + encodeURIComponent(c.value) + '&level=' + encodeURIComponent(r.level.code) + '&type=group';
        var notes = '';
        if (r.gap) {
            notes += '<p class="result__note"><i class="fas fa-comment-dots" aria-hidden="true"></i><span><strong>Wygląda na to, że rozumiesz więcej, niż mówisz.</strong> ' +
                'Właśnie dla takich osób powstało LAM English. Jeśli stresuje Cię mówienie przy innych, zacznij od lekcji 1:1 — bez grupy łatwiej zacząć mówić.</span></p>';
        }
        if (BLOCKERS[r.blocker]) {
            notes += '<p class="result__note result__note--soft"><i class="fas fa-lightbulb" aria-hidden="true"></i><span>' + esc(BLOCKERS[r.blocker]) + '</span></p>';
        }

        var html = '<div class="result">' +
            '<div class="result__main">' +
            '<span class="eyebrow">Twój wynik</span>' +
            '<h2 class="result__title" id="result-title" tabindex="-1">Twój poziom: około <strong>' + esc(r.level.code) + '</strong></h2>' +
            '<p class="result__score">Poprawne odpowiedzi w części językowej: ' + r.correct + ' z ' + LANG_TOTAL + '</p>' +
            '<p class="result__desc">' + esc(r.level.desc) + '</p>' +
            notes +
            '<div class="result__course">' +
            '<span class="eyebrow">Polecamy na start</span>' +
            '<h3>' + esc(c.name) + '</h3>' +
            '<p class="result__price">' + esc(c.price) + ' <small>' + esc(c.unit) + '</small></p>' +
            '<p class="result__details">' + esc(c.details) + '</p>' +
            '<p>' + esc(c.why) + '</p>' +
            '<p class="result__alt">Wolisz zajęcia tylko z lektorem? Lekcje 1:1 kosztują 69 zł za 60 minut, a termin ustalamy indywidualnie. ' +
            '<a href="zajecia-indywidualne.html">Zobacz lekcje 1:1</a> · <a href="' + c.more + '">Szczegóły kursu</a></p>' +
            '</div>' +
            '<p class="result__fine">Wynik jest orientacyjny: krótki test pokazuje, ile rozumiesz i jak dobrze znasz język. To, jak mówisz, sprawdzimy w rozmowie podczas bezpłatnej konsultacji.</p>' +
            '</div>' +

            '<aside class="result__cta" aria-labelledby="next-title">' +
            '<h3 id="next-title">Następny krok — bezpłatna konsultacja</h3>' +
            '<p>Porozmawiamy o Twoim celu, potwierdzimy poziom i dobierzemy grupę albo lekcje 1:1. Bez zobowiązań.</p>' +
            '<a class="btn btn--wa result__wa" data-wa="test-result" target="_blank" rel="noopener" href="' + waLink(r) + '">' +
            '<i class="fab fa-whatsapp" aria-hidden="true"></i> Wyślij wynik na WhatsApp</a>' +
            '<p class="result__or"><span>albo zostaw kontakt — odezwiemy się w ciągu 24 godzin w dni robocze</span></p>' +
            '<form id="testLeadForm" class="lead-form" action="' + FORM_ACTION + '" method="POST" novalidate>' +
            '<div class="field"><label for="lead-name">Imię *</label>' +
            '<input type="text" id="lead-name" name="name" autocomplete="given-name" required aria-describedby="leadNameError">' +
            '<div class="error-message" id="leadNameError" role="alert"></div></div>' +
            '<div class="field"><label for="lead-phone">Numer telefonu <small>(telefon albo e-mail — wystarczy jedno)</small></label>' +
            '<input type="tel" id="lead-phone" name="phone" autocomplete="tel" inputmode="tel" placeholder="np. 600 100 200" aria-describedby="leadPhoneError">' +
            '<div class="error-message" id="leadPhoneError" role="alert"></div></div>' +
            '<div class="field"><label for="lead-email">Adres e-mail</label>' +
            '<input type="email" id="lead-email" name="email" autocomplete="email" inputmode="email" placeholder="np. anna@example.com" aria-describedby="leadEmailError">' +
            '<div class="error-message" id="leadEmailError" role="alert"></div></div>' +
            '<input type="hidden" name="course" value="' + esc(c.value) + '">' +
            '<input type="hidden" name="wynik_testu" value="okolo ' + esc(r.level.code) + ' (' + r.correct + '/' + LANG_TOTAL + ' poprawnych)">' +
            '<input type="hidden" name="samoocena_mowienia" value="' + r.self + '/6">' +
            '<input type="hidden" name="co_blokuje" value="' + esc(BLOCKER_LABELS[r.blocker] || '') + '">' +
            '<input type="hidden" name="message" value="Zgłoszenie po teście poziomu. Wynik: około ' + esc(r.level.code) + '. Polecany kurs: ' + esc(c.name) + '.">' +
            '<input type="hidden" name="_subject" value="Wynik testu poziomu - LAM English">' +
            '<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">' +
            '<button type="submit" class="btn btn--primary lead-form__submit"><span class="label">Poproszę o kontakt</span></button>' +
            '<p class="privacy-notice">Wysyłając formularz, wyrażasz zgodę na przetwarzanie danych w celu kontaktu. Szczegóły w <a href="privacy-policy.html">polityce prywatności</a>.</p>' +
            '<div class="form-error" id="leadFormError" role="alert" tabindex="-1">Nie udało się wysłać formularza. Spróbuj ponownie albo napisz na WhatsApp lub zadzwoń: <a href="tel:+48576076648">+48 576 076 648</a>.</div>' +
            '</form>' +
            '<div class="lead-success" id="leadSuccess" role="status" tabindex="-1" hidden>' +
            '<div class="lead-success__icon" aria-hidden="true"><i class="fas fa-check"></i></div>' +
            '<h3>Dziękujemy! Mamy Twój wynik.</h3>' +
            '<p>Odezwiemy się w ciągu 24 godzin w dni robocze, żeby umówić bezpłatną konsultację.</p>' +
            '</div>' +
            '<div class="result__teacher">' +
            '<img src="blog/assets/vlad-320.jpg" alt="Vladyslav Maksymov, założyciel LAM English" width="56" height="56" loading="lazy" decoding="async">' +
            '<p><strong>Vladyslav Maksymov</strong> — założyciel i lektor angielskiego. Sam uczył się angielskiego jako języka obcego i wie, jak trudno przejść od rozumienia do mówienia. <a href="o-nas.html">Poznaj nas</a></p>' +
            '</div>' +
            '</aside>' +
            '</div>' +
            '<p class="result__again"><button type="button" class="quiz__back" id="quiz-restart"><i class="fas fa-redo" aria-hidden="true"></i> Zrób test jeszcze raz</button></p>';

        root.innerHTML = html;
        root.classList.add('quiz--result');
        if (section) section.classList.add('is-result');
        document.body.classList.add('has-test-result');
        track('test_complete', { 'test_level': r.level.code, 'test_course': c.value });

        var title = document.getElementById('result-title');
        if (title) {
            title.focus({ preventScroll: true });
            (section || root).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
        root.querySelectorAll('a[data-wa]').forEach(function (a) {
            a.addEventListener('click', function () { track('cta_click', { 'cta_type': 'whatsapp', 'cta_location': 'test-result' }); });
        });
        document.getElementById('quiz-restart').addEventListener('click', restart);
        bindLeadForm(r);
    }

    function restart() {
        step = 0; orders = {};
        Object.keys(answers).forEach(function (k) { delete answers[k]; });
        root.classList.remove('quiz--result');
        if (section) section.classList.remove('is-result');
        document.body.classList.remove('has-test-result');
        renderQuestion(true);
        (section || root).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    /* ---------- Formularz po wyniku ---------- */
    function bindLeadForm(r) {
        var form = document.getElementById('testLeadForm');
        if (!form) return;
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var nameEl = document.getElementById('lead-name');
        var phoneEl = document.getElementById('lead-phone');
        var emailEl = document.getElementById('lead-email');
        var errorBox = document.getElementById('leadFormError');
        var submit = form.querySelector('.lead-form__submit');
        var sending = false;

        function setError(el, errId, message) {
            var err = document.getElementById(errId);
            el.closest('.field').classList.toggle('is-invalid', !!message);
            el.setAttribute('aria-invalid', message ? 'true' : 'false');
            if (err) err.textContent = message;
            return !message;
        }
        function validate() {
            var digits = phoneEl.value.replace(/\D/g, '');
            var emailVal = emailEl.value.trim();
            var okName = setError(nameEl, 'leadNameError', nameEl.value.trim() ? '' : 'Podaj swoje imię');
            var emailMsg = emailVal && !emailRe.test(emailVal) ? 'Sprawdź adres e-mail' : '';
            var phoneMsg = '';
            if (!phoneEl.value.trim()) { if (!emailRe.test(emailVal)) phoneMsg = 'Podaj numer telefonu albo adres e-mail'; }
            else if (digits.length < 9 || digits.length > 15) phoneMsg = 'Sprawdź numer telefonu — powinien mieć co najmniej 9 cyfr';
            var okPhone = setError(phoneEl, 'leadPhoneError', phoneMsg);
            var okEmail = setError(emailEl, 'leadEmailError', emailMsg);
            if (!okName) return nameEl;
            if (!okPhone) return phoneEl;
            if (!okEmail) return emailEl;
            return null;
        }
        [nameEl, phoneEl, emailEl].forEach(function (el) {
            el.addEventListener('input', function () { if (form.querySelector('.is-invalid')) validate(); });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (sending) return;
            errorBox.classList.remove('show');
            var bad = validate();
            if (bad) { bad.focus(); return; }
            sending = true;
            submit.disabled = true;
            submit.querySelector('.label').textContent = 'Wysyłanie…';
            if (window.LAM && window.LAM.addSourceFields) window.LAM.addSourceFields(form);
            var data = new FormData(form);
            ['email', 'phone', 'co_blokuje'].forEach(function (name) {
                if (!String(data.get(name) || '').trim()) data.delete(name);
            });
            fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
                .then(function (response) {
                    if (!response.ok) throw new Error('Form submission failed');
                    form.hidden = true;
                    var ok = document.getElementById('leadSuccess');
                    ok.hidden = false;
                    ok.focus({ preventScroll: true });
                    track('form_submission', { 'form_type': 'test', 'course_selected': r.course.value, 'test_level': r.level.code });
                })
                .catch(function () {
                    errorBox.classList.add('show');
                    errorBox.focus();
                })
                .then(function () {
                    sending = false;
                    submit.disabled = false;
                    submit.querySelector('.label').textContent = 'Poproszę o kontakt';
                });
        });
    }

    renderQuestion(false);
})();

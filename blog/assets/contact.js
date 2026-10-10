/* LAM English — Kontakt: formularz, baner kursu, status dostępności.
   Zachowuje logikę poprzedniej wersji (Formspree, zdarzenia dataLayer, uzupełnianie z URL). */
(function () {
    'use strict';

    var urlParams = new URLSearchParams(window.location.search);
    var courseParam = urlParams.get('course');
    var typeParam = urlParams.get('type');
    var priceParam = urlParams.get('price');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Parametry URL → kurs, baner, wiadomość ---------- */
    if (courseParam) {
        var courseSelect = document.getElementById('contact-course');
        if (courseSelect) {
            var opts = Array.prototype.slice.call(courseSelect.options).filter(function (o) { return o.value; });
            var lc = courseParam.toLowerCase();
            var match = opts.find(function (o) { return o.text.indexOf(courseParam) !== -1 || courseParam.indexOf(o.text) !== -1; })
                || opts.find(function (o) { var t = o.text.toLowerCase(); return t.indexOf(lc) !== -1 || lc.indexOf(t) !== -1; });
            if (match) match.selected = true;
        }

        var banner = document.getElementById('courseSelectionBanner');
        var bannerText = document.getElementById('courseSelectionText');
        if (banner && bannerText) {
            // Bezpiecznie (textContent), bo wartość pochodzi z adresu URL
            bannerText.textContent = '';
            var strong = document.createElement('strong');
            strong.textContent = courseParam;
            bannerText.appendChild(strong);
            var rest = '';
            if (typeParam) rest += ' - ' + (typeParam === 'group' ? 'zajęcia grupowe' : 'zajęcia indywidualne');
            rest += '. Dokończ zgłoszenie poniżej, abyśmy mogli przedstawić Ci szczegóły oferty.';
            bannerText.appendChild(document.createTextNode(rest));
            banner.classList.add('show');
            setTimeout(function () {
                banner.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            }, 300);
        }

        var messageField = document.getElementById('contact-message');
        if (messageField && !messageField.value.trim()) {
            var msg = 'Interesuje mnie kurs: ' + courseParam;
            msg += priceParam
                ? '. Chciałbym/chciałabym dowiedzieć się więcej o tym kursie.'
                : '. Chciałbym/chciałabym umówić się na darmową lekcję próbną.';
            messageField.value = msg;
        }
    }

    /* ---------- 2. Formularz ---------- */
    var form = document.getElementById('contactForm');
    var success = document.getElementById('contactSuccessMessage');
    var formError = document.getElementById('contactFormError');
    var submitBtn = form ? form.querySelector('.submit') : null;
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var rules = {
        'contact-name': { err: 'contactNameError', msg: 'Proszę podać imię i nazwisko', ok: function (v) { return v.trim().length > 0; } },
        'contact-email': { err: 'contactEmailError', msg: 'Proszę podać poprawny adres e-mail', ok: function (v) { return emailRe.test(v.trim()); } },
        'contact-message': { err: 'contactMessageError', msg: 'Proszę wpisać wiadomość', ok: function (v) { return v.trim().length > 0; } }
    };

    function check(id, show) {
        var el = document.getElementById(id), r = rules[id];
        if (!el || !r) return true;
        var valid = r.ok(el.value);
        var field = el.closest('.field');
        var err = document.getElementById(r.err);
        if (show) {
            field.classList.toggle('is-invalid', !valid);
            el.setAttribute('aria-invalid', valid ? 'false' : 'true');
            if (err) err.textContent = valid ? '' : r.msg;
        }
        field.classList.toggle('is-valid', valid && el.value.trim().length > 0);
        return valid;
    }

    if (form) {
        Object.keys(rules).forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('blur', function () { if (el.value.trim()) check(id, true); });
            el.addEventListener('input', function () {
                if (el.closest('.field').classList.contains('is-invalid')) check(id, true); else check(id, false);
            });
        });

        var sending = false;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (sending) return;
            if (formError) formError.classList.remove('show');

            // Walidacja — przy błędzie NIC nie wysyłamy (poprzednio formularz wysyłał się mimo błędów)
            var firstInvalid = null;
            Object.keys(rules).forEach(function (id) {
                if (!check(id, true) && !firstInvalid) firstInvalid = document.getElementById(id);
            });
            if (firstInvalid) { firstInvalid.focus(); return; }

            sending = true;
            if (submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('is-loading'); submitBtn.querySelector('.label').textContent = 'Wysyłanie…'; }

            fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
                .then(function (response) {
                    if (!response.ok) throw new Error('Form submission failed');
                    form.reset();
                    form.hidden = true;
                    var intro = document.getElementById('form-intro');
                    if (intro) intro.hidden = true;
                    success.classList.add('show');
                    success.setAttribute('tabindex', '-1');
                    success.focus({ preventScroll: true });
                    success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
                    if (window.dataLayer) {
                        window.dataLayer.push({ 'event': 'form_submission', 'form_type': 'contact', 'course_selected': courseParam || 'none' });
                    }
                })
                .catch(function (error) {
                    if (formError) { formError.classList.add('show'); formError.focus(); }
                    console.error('Error:', error);
                })
                .then(function () {
                    sending = false;
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('is-loading'); submitBtn.querySelector('.label').textContent = 'Wyślij wiadomość'; }
                });
        });
    }

    /* ---------- 3. Śledzenie kliknięć CTA (jak wcześniej) ---------- */
    document.querySelectorAll('.cta-button, .phone-cta, .btn, .submit, .channel-tile a').forEach(function (button) {
        button.addEventListener('click', function () {
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'cta_click',
                    'cta_type': (this.classList.contains('phone-cta') || (this.getAttribute('href') || '').indexOf('tel:') === 0) ? 'phone' : 'button',
                    'cta_text': this.textContent.trim(),
                    'cta_location': 'contact_page',
                    'course_prefilled': courseParam || 'none'
                });
            }
        });
    });

    /* ---------- 4. Kopiowanie adresu e-mail ---------- */
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var text = btn.getAttribute('data-copy');
            var done = function () {
                btn.classList.add('is-done');
                btn.textContent = 'Skopiowano';
                setTimeout(function () { btn.classList.remove('is-done'); btn.textContent = 'Kopiuj'; }, 2000);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
        });
    });

    /* ---------- 5. Status dostępności (czas w Polsce) ---------- */
    var statusEls = document.querySelectorAll('[data-status]');
    if (statusEls.length && window.Intl) {
        var HOURS = { 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [9, 15] }; // 0 = niedziela
        var DAYS = ['w niedzielę', 'w poniedziałek', 'we wtorek', 'w środę', 'w czwartek', 'w piątek', 'w sobotę'];
        function nowInPoland() {
            var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Warsaw', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
            var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
            var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday);
            return { day: day, h: parseInt(map.hour, 10) + parseInt(map.minute, 10) / 60 };
        }
        function render() {
            var n = nowInPoland(), today = HOURS[n.day];
            var open = !!today && n.h >= today[0] && n.h < today[1];
            var title, note;
            if (open) {
                title = 'Teraz jesteśmy dostępni';
                note = 'Dziś do ' + today[1] + ':00';
            } else {
                title = 'Teraz poza godzinami pracy';
                if (today && n.h < today[0]) { note = 'Odezwiemy się dziś od ' + today[0] + ':00'; }
                else {
                    for (var k = 1; k <= 7; k++) {
                        var d = (n.day + k) % 7;
                        if (HOURS[d]) { note = 'Odezwiemy się ' + (k === 1 ? 'jutro' : DAYS[d]) + ' od ' + HOURS[d][0] + ':00'; break; }
                    }
                }
            }
            statusEls.forEach(function (el) {
                el.classList.toggle('status--open', open);
                var t = el.querySelector('[data-status-title]'), s = el.querySelector('[data-status-note]');
                if (t) t.textContent = title;
                if (s) s.textContent = note;
            });
        }
        render();
        setInterval(render, 60000);
    }
})();

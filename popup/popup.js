/* =========================
PLIK: popup.js
NAJLEPSZA LOGIKA LEADOWA
========================= */

const leadPopup = document.getElementById('leadPopupOverlay');
const closeLeadPopup = document.getElementById('closeLeadPopup');
const popupForm = document.getElementById('leadPopupForm');
const popupSuccess = document.getElementById('leadPopupSuccess');

/* =========================
SETTINGS
========================= */

/* popup max raz na 24h */
const POPUP_HIDE_TIME = 1000 * 60 * 60 * 24;

/* desktop/mobile timings */
const DESKTOP_DELAY = 25000;
const MOBILE_DELAY = 40000;

/* =========================
HELPERS
========================= */

function wasPopupRecentlyClosed(){

    const popupClosedUntil =
        localStorage.getItem('leadPopupClosed');

    if(
        popupClosedUntil &&
        Date.now() < Number(popupClosedUntil)
    ){
        return true;
    }

    return false;

}

function setPopupClosed(){

    localStorage.setItem(
        'leadPopupClosed',
        Date.now() + POPUP_HIDE_TIME
    );

}

/* =========================
OPEN POPUP
========================= */

function openLeadPopup(selectedCourse = '') {

    /* don't open if already visible */
    if(
        leadPopup.classList.contains('active')
    ){
        return;
    }

    /* don't open if recently closed */
    if(wasPopupRecentlyClosed()){
        return;
    }

    leadPopup.classList.add('active');

    document.body.style.overflow = 'hidden';

    /* set selected course */
    if(selectedCourse){

        const select =
            document.getElementById(
                'popupCourseSelect'
            );

        if(select){
            select.value = selectedCourse;
        }

    }

    /* autofocus */
    setTimeout(() => {

        const firstInput =
            popupForm.querySelector('input');

        if(firstInput){
            firstInput.focus();
        }

    }, 300);

}

/* =========================
CLOSE
========================= */

function closePopup(){

    leadPopup.classList.remove('active');

    document.body.style.overflow = '';

    setPopupClosed();

}

closeLeadPopup.addEventListener(
    'click',
    closePopup
);

/* =========================
BACKDROP CLOSE
========================= */

leadPopup.addEventListener(
    'click',
    function(e){

        if(e.target === leadPopup){
            closePopup();
        }

    }
);

/* =========================
AUTO OPEN
========================= */

setTimeout(() => {

    openLeadPopup();

}, window.innerWidth < 768
    ? MOBILE_DELAY
    : DESKTOP_DELAY
);

/* =========================
SCROLL TRIGGER
========================= */

let scrollPopupShown = false;

window.addEventListener(
    'scroll',
    function(){

        if(scrollPopupShown){
            return;
        }

        const scrollPercent =
            (
                window.scrollY +
                window.innerHeight
            ) / document.body.scrollHeight;

        if(scrollPercent > 0.55){

            scrollPopupShown = true;

            openLeadPopup();

        }

    }
);

/* =========================
EXIT INTENT DESKTOP
========================= */

if(window.innerWidth > 768){

    document.addEventListener(
        'mouseleave',
        function(e){

            if(e.clientY <= 0){

                openLeadPopup();

            }

        }
    );

}

/* =========================
BUTTONS OPEN
========================= */

document
.querySelectorAll('.open-course-popup')
.forEach(button => {

    button.addEventListener(
        'click',
        function(){

            const selectedCourse =
                this.dataset.course || '';

            openLeadPopup(selectedCourse);

        }
    );

});

/* =========================
SWIPE DOWN CLOSE MOBILE
========================= */

let touchStartY = 0;
let touchEndY = 0;

leadPopup.addEventListener(
    'touchstart',
    function(e){

        touchStartY =
            e.changedTouches[0].screenY;

    }
);

leadPopup.addEventListener(
    'touchend',
    function(e){

        touchEndY =
            e.changedTouches[0].screenY;

        if(
            touchEndY - touchStartY > 120
        ){
            closePopup();
        }

    }
);

/* =========================
FORMSPREE AJAX
========================= */

popupForm.addEventListener(
    'submit',
    async function(e){

        e.preventDefault();

        const formData =
            new FormData(popupForm);

        try{

            const response = await fetch(
                popupForm.action,
                {
                    method:'POST',
                    body:formData,
                    headers:{
                        'Accept':'application/json'
                    }
                }
            );

            if(response.ok){

                popupForm.style.display =
                    'none';

                popupSuccess.style.display =
                    'block';

                /* hide popup for 7 days after lead */
                localStorage.setItem(
                    'leadPopupClosed',
                    Date.now() +
                    (1000 * 60 * 60 * 24 * 7)
                );

            }

        } catch(error){

            alert(
                'Wystąpił błąd. Spróbuj ponownie.'
            );

        }

    }
);
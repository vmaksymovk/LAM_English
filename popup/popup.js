/* =========================
PLIK: popup.js
========================= */

const leadPopup = document.getElementById('leadPopupOverlay');
const closeLeadPopup = document.getElementById('closeLeadPopup');
const popupForm = document.getElementById('leadPopupForm');
const popupSuccess = document.getElementById('leadPopupSuccess');

let popupAlreadyShown = false;

/* OPEN POPUP */
function openLeadPopup(selectedCourse = '') {

    const popupClosedUntil =
        localStorage.getItem('leadPopupClosed');

    if(
        popupClosedUntil &&
        Date.now() < Number(popupClosedUntil)
    ){
        return;
    }

    leadPopup.classList.add('active');

    document.body.style.overflow = 'hidden';

    popupAlreadyShown = true;

    if(selectedCourse){

        const select =
            document.getElementById('popupCourseSelect');

        select.value = selectedCourse;

    }

    /* AUTO FOCUS */
    setTimeout(() => {

        const firstInput =
            popupForm.querySelector('input');

        if(firstInput){
            firstInput.focus();
        }

    }, 300);

}

/* CLOSE */
function closePopup(){

    leadPopup.classList.remove('active');

    document.body.style.overflow = '';

    localStorage.setItem(
        'leadPopupClosed',
        Date.now() + (1000 * 60 * 60 * 24 * 3)
    );

}

closeLeadPopup.addEventListener('click', closePopup);

/* CLOSE ON BACKDROP */
leadPopup.addEventListener('click', function(e){

    if(e.target === leadPopup){
        closePopup();
    }

});

/* AUTO SHOW */
setTimeout(() => {

    if(!popupAlreadyShown){
        openLeadPopup();
    }

}, window.innerWidth < 768 ? 12000 : 30000);

/* EXIT INTENT ONLY DESKTOP */
if(window.innerWidth > 768){

    document.addEventListener(
        'mouseleave',
        function(e){

            if(
                e.clientY <= 0 &&
                !popupAlreadyShown
            ){
                openLeadPopup();
            }

        }
    );

}

/* BUTTONS */
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

/* PRICING SECTION */
const pricingSection =
    document.querySelector('#pricing');

if(pricingSection){

    const pricingObserver =
        new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(
                entry.isIntersecting &&
                !popupAlreadyShown
            ){
                openLeadPopup();
            }

        });

    }, { threshold:0.5 });

    pricingObserver.observe(pricingSection);

}

/* SWIPE DOWN CLOSE MOBILE */
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

        if(touchEndY - touchStartY > 120){
            closePopup();
        }

    }
);

/* FORMSPREE AJAX */
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

                popupForm.style.display = 'none';

                popupSuccess.style.display = 'block';

                localStorage.setItem(
                    'leadPopupClosed',
                    Date.now() + (1000 * 60 * 60 * 24 * 7)
                );

            }

        } catch(error){

            alert(
                'Wystąpił błąd. Spróbuj ponownie.'
            );

        }

    }
);
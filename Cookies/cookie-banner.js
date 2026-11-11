// cookie-banner.js
class CookieConsent {
    constructor() {
        this.banner = null;
        this.storageKey = 'cookieConsent';
        this.consentGiven = null;
        this.init();
    }

    init() {
        this.loadConsent();
        if (this.consentGiven === null) {
            this.createBanner();
            this.showBanner();
        }
        this.applyConsent();
    }

    loadConsent() {
        let stored = null;
        try { stored = localStorage.getItem(this.storageKey); } catch (e) {}
        if (stored) {
            this.consentGiven = stored === 'accepted';
        }
    }

    createBanner() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'cookie-overlay';
        overlay.id = 'cookie-overlay';
        overlay.setAttribute('role', 'region');
        overlay.setAttribute('aria-label', 'Zgoda na pliki cookies');

        // Create banner
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h3>🍪 Używamy plików cookies</h3>
                    <p>Korzystamy z cookies w celach statystycznych, funkcjonalnych i marketingowych — tylko za Twoją zgodą.
                    <a href="/privacy-policy.html" target="_blank" rel="noopener">Dowiedz się więcej</a></p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn cookie-btn-reject" id="cookie-reject">
                        Odrzucam
                    </button>
                    <button class="cookie-btn cookie-btn-accept" id="cookie-accept">
                        Akceptuję
                    </button>
                </div>
            </div>
        `;

        overlay.appendChild(banner);
        document.body.appendChild(overlay);

        this.banner = overlay;

        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', () => this.handleAccept());
        document.getElementById('cookie-reject').addEventListener('click', () => this.handleReject());
    }

    showBanner() {
        // Baner nie blokuje strony: treść i przyciski kontaktu pozostają dostępne od pierwszej sekundy.
        setTimeout(() => {
            this.banner.classList.add('active');
            this.updateOffset();
            this.onResize = () => this.updateOffset();
            window.addEventListener('resize', this.onResize);
        }, 1000);
    }

    // Pływające przyciski kontaktu przesuwają się nad baner (zmienna CSS --cookie-offset).
    updateOffset() {
        if (!this.banner) return;
        const box = this.banner.querySelector('.cookie-banner');
        const h = box ? Math.ceil(box.getBoundingClientRect().height) + 12 : 0;
        document.documentElement.style.setProperty('--cookie-offset', h + 'px');
    }

    hideBanner() {
        this.banner.classList.remove('active');
        if (this.onResize) window.removeEventListener('resize', this.onResize);
        document.documentElement.style.setProperty('--cookie-offset', '0px');

        // Remove from DOM after animation
        setTimeout(() => {
            if (this.banner && this.banner.parentNode) {
                this.banner.parentNode.removeChild(this.banner);
            }
        }, 400);
    }

    handleAccept() {
        this.consentGiven = true;
        try { localStorage.setItem(this.storageKey, 'accepted'); } catch (e) {}
        this.hideBanner();
        this.applyConsent();

        // Trigger GTM or other analytics if needed
        if (window.dataLayer) {
            window.dataLayer.push({ 'event': 'cookies_accepted' });
        }
    }

    handleReject() {
        this.consentGiven = false;
        try { localStorage.setItem(this.storageKey, 'rejected'); } catch (e) {}
        this.hideBanner();
        this.applyConsent();

        // Remove non-essential cookies
        this.removeNonEssentialCookies();

        if (window.dataLayer) {
            window.dataLayer.push({ 'event': 'cookies_rejected' });
        }
    }

    applyConsent() {
        if (this.consentGiven) {
            // Load analytics scripts, Google Tag Manager, etc.
            this.loadAnalytics();
        } else {
            // Block analytics scripts
            this.blockAnalytics();
        }
    }

    loadAnalytics() {
        // Consent Mode v2: zgoda włącza tagi Google; Meta Pixel ładuje się dopiero teraz
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
            });
        }
        if (typeof window.lamLoadPixel === 'function') window.lamLoadPixel();
    }

    blockAnalytics() {
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'
            });
        }
    }

    removeNonEssentialCookies() {
        // Remove non-essential cookies
        const cookies = document.cookie.split(';');
        const essentialCookies = ['cookieConsent']; // Keep consent cookie

        for (let cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

            if (!essentialCookies.includes(name)) {
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            }
        }
    }

    // Method to check if consent was given (for other scripts)
    hasConsent() {
        return this.consentGiven === true;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.cookieConsent = new CookieConsent();
});
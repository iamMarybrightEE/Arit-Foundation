// Cookie Management System
class CookieManager {
    constructor() {
        this.cookieTypes = {
            necessary: {
                name: 'Necessary Cookies',
                description: 'These cookies are essential for the website to function properly.',
                required: true,
                cookies: ['cookiesAccepted', 'theme', 'language']
            },
            analytics: {
                name: 'Analytics Cookies',
                description: 'These cookies help us understand how visitors interact with our website.',
                required: false,
                cookies: ['_ga', '_gid', '_gat']
            },
            marketing: {
                name: 'Marketing Cookies',
                description: 'These cookies are used to track visitors across websites for marketing purposes.',
                required: false,
                cookies: ['_fbp', '_fbc', 'ads_preferences']
            },
            functional: {
                name: 'Functional Cookies',
                description: 'These cookies enable enhanced functionality and personalization.',
                required: false,
                cookies: ['user_preferences', 'newsletter_popup_shown']
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkCookieConsent();
    }
    
    setupEventListeners() {
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineOptionalCookies());
        }
        
        // Settings button for detailed cookie preferences
        const settingsBtn = document.getElementById('cookie-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showCookieSettings());
        }
    }
    
    checkCookieConsent() {
        const consent = this.getCookie('cookiesAccepted');
        if (!consent) {
            this.showCookieBanner();
        } else {
            this.loadConsentedCookies();
        }
    }
    
    showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }
    
    acceptAllCookies() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie('cookiesAccepted', JSON.stringify(consent), 365);
        this.loadConsentedCookies();
        this.hideCookieBanner();
        this.showNotification('All cookies accepted', 'success');
    }
    
    declineOptionalCookies() {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
            timestamp: new Date().toISOString()
        };
        
        this.setCookie('cookiesAccepted', JSON.stringify(consent), 365);
        this.removeOptionalCookies();
        this.hideCookieBanner();
        this.showNotification('Optional cookies declined', 'info');
    }
    
    showCookieSettings() {
        const modal = this.createCookieSettingsModal();
        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    createCookieSettingsModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-settings-modal';
        modal.innerHTML = `
            <div class="cookie-settings-overlay"></div>
            <div class="cookie-settings-content">
                <div class="cookie-settings-header">
                    <h2>Cookie Settings</h2>
                    <button class="close-settings" aria-label="Close">&times;</button>
                </div>
                <div class="cookie-settings-body">
                    <p>We use cookies to enhance your browsing experience and provide personalized content. You can choose which types of cookies to accept:</p>
                    ${this.generateCookieTypeSettings()}
                </div>
                <div class="cookie-settings-footer">
                    <button class="btn btn-secondary" id="save-cookie-settings">Save Settings</button>
                    <button class="btn btn-primary" id="accept-all-settings">Accept All</button>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        
        // Event listeners
        modal.querySelector('.close-settings').addEventListener('click', () => this.closeCookieSettings(modal));
        modal.querySelector('.cookie-settings-overlay').addEventListener('click', () => this.closeCookieSettings(modal));
        modal.querySelector('#save-cookie-settings').addEventListener('click', () => this.saveCookieSettings(modal));
        modal.querySelector('#accept-all-settings').addEventListener('click', () => {
            this.acceptAllCookies();
            this.closeCookieSettings(modal);
        });
        
        return modal;
    }
    
    generateCookieTypeSettings() {
        const currentConsent = this.getCurrentConsent();
        
        return Object.entries(this.cookieTypes).map(([key, type]) => `
            <div class="cookie-type-setting">
                <div class="cookie-type-header">
                    <label class="cookie-toggle">
                        <input type="checkbox" 
                               ${type.required ? 'checked disabled' : ''} 
                               ${currentConsent[key] ? 'checked' : ''} 
                               data-cookie-type="${key}">
                        <span class="cookie-toggle-slider"></span>
                    </label>
                    <div class="cookie-type-info">
                        <h3>${type.name} ${type.required ? '(Required)' : ''}</h3>
                        <p>${type.description}</p>
                    </div>
                </div>
                <div class="cookie-list">
                    <strong>Cookies:</strong> ${type.cookies.join(', ')}
                </div>
            </div>
        `).join('');
    }
    
    getCurrentConsent() {
        const consent = this.getCookie('cookiesAccepted');
        if (consent) {
            try {
                return JSON.parse(consent);
            } catch (e) {
                return { necessary: true, analytics: false, marketing: false, functional: false };
            }
        }
        return { necessary: true, analytics: false, marketing: false, functional: false };
    }
    
    saveCookieSettings(modal) {
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        const consent = { timestamp: new Date().toISOString() };
        
        checkboxes.forEach(checkbox => {
            const type = checkbox.dataset.cookieType;
            consent[type] = checkbox.checked;
        });
        
        this.setCookie('cookiesAccepted', JSON.stringify(consent), 365);
        this.loadConsentedCookies();
        this.closeCookieSettings(modal);
        this.showNotification('Cookie settings saved', 'success');
    }
    
    closeCookieSettings(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    loadConsentedCookies() {
        const consent = this.getCurrentConsent();
        
        if (consent.analytics) {
            this.loadAnalyticsCookies();
        }
        
        if (consent.marketing) {
            this.loadMarketingCookies();
        }
        
        if (consent.functional) {
            this.loadFunctionalCookies();
        }
    }
    
    loadAnalyticsCookies() {
        // Google Analytics example
        if (typeof gtag === 'undefined') {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
        }
    }
    
    loadMarketingCookies() {
        // Facebook Pixel example
        if (typeof fbq === 'undefined') {
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
        }
    }
    
    loadFunctionalCookies() {
        // Load user preferences, chat widgets, etc.
        this.loadUserPreferences();
    }
    
    loadUserPreferences() {
        const preferences = this.getCookie('user_preferences');
        if (preferences) {
            try {
                const prefs = JSON.parse(preferences);
                // Apply user preferences
                if (prefs.theme) {
                    document.documentElement.setAttribute('data-theme', prefs.theme);
                }
            } catch (e) {
                console.warn('Failed to load user preferences');
            }
        }
    }
    
    removeOptionalCookies() {
        // Remove analytics cookies
        this.cookieTypes.analytics.cookies.forEach(cookie => {
            this.deleteCookie(cookie);
        });
        
        // Remove marketing cookies
        this.cookieTypes.marketing.cookies.forEach(cookie => {
            this.deleteCookie(cookie);
        });
        
        // Remove functional cookies
        this.cookieTypes.functional.cookies.forEach(cookie => {
            this.deleteCookie(cookie);
        });
    }
    
    // Cookie utility methods
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
    
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }
    
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `cookie-notification cookie-notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background-color: ${type === 'success' ? 'var(--color-4)' : type === 'error' ? 'var(--color-5)' : 'var(--color-3)'};
            color: white;
            border-radius: var(--border-radius);
            z-index: 10002;
            animation: slideInRight 0.3s ease;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Cookie Settings Modal Styles
const cookieModalStyles = document.createElement('style');
cookieModalStyles.textContent = `
    .cookie-settings-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .cookie-settings-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    }
    
    .cookie-settings-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--bg-light);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .cookie-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem;
        border-bottom: 1px solid var(--gray-light);
    }
    
    .cookie-settings-header h2 {
        margin: 0;
        color: var(--primary-color);
    }
    
    .close-settings {
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--gray-medium);
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .close-settings:hover {
        color: var(--primary-color);
    }
    
    .cookie-settings-body {
        padding: 2rem;
    }
    
    .cookie-type-setting {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background-color: var(--gray-light);
        border-radius: var(--border-radius);
    }
    
    .cookie-type-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .cookie-toggle {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        flex-shrink: 0;
    }
    
    .cookie-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .cookie-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 34px;
    }
    
    .cookie-toggle-slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    
    .cookie-toggle input:checked + .cookie-toggle-slider {
        background-color: var(--primary-color);
    }
    
    .cookie-toggle input:checked + .cookie-toggle-slider:before {
        transform: translateX(26px);
    }
    
    .cookie-toggle input:disabled + .cookie-toggle-slider {
        background-color: var(--color-4);
        cursor: not-allowed;
    }
    
    .cookie-type-info h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text-dark);
    }
    
    .cookie-type-info p {
        margin: 0;
        color: var(--gray-medium);
        font-size: 0.9rem;
    }
    
    .cookie-list {
        font-size: 0.8rem;
        color: var(--gray-medium);
        font-style: italic;
    }
    
    .cookie-settings-footer {
        padding: 2rem;
        border-top: 1px solid var(--gray-light);
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    @media (max-width: 768px) {
        .cookie-settings-content {
            width: 95%;
            max-height: 90vh;
        }
        
        .cookie-settings-header,
        .cookie-settings-body,
        .cookie-settings-footer {
            padding: 1rem;
        }
        
        .cookie-type-header {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .cookie-settings-footer {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(cookieModalStyles);

// Initialize cookie manager
const cookieManager = new CookieManager();

// Global function to show cookie banner (for privacy policy link)
function showCookieBanner() {
    cookieManager.showCookieBanner();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}
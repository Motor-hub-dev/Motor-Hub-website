import { getSettings } from './settings.js';

export async function applyEventTheme() {
    try {
        const settings = await getSettings();
        if (settings && settings.active_event && settings.active_event !== 'none') {
            document.body.classList.add(`event-${settings.active_event}`);
            
            // Inject events.css if not present
            if (!document.getElementById('events-css')) {
                const link = document.createElement('link');
                link.id = 'events-css';
                link.rel = 'stylesheet';
                link.href = 'events.css';
                document.head.appendChild(link);
            }
        }
        
        // Dynamic Navigation Logic
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const isAr = (localStorage.getItem('lang') || 'en') === 'ar';
        const homeText = isAr ? 'الرئيسية' : 'Home';
        
        document.querySelectorAll('nav a, #mobile-drawer a').forEach(a => {
            const href = a.getAttribute('href');
            if (href && (href === path || (path==='' && href==='index.html')) && !a.classList.contains('site-brand')) {
                a.style.display = 'none';
            }
        });

        if (path !== 'index.html' && path !== '') {
            const desktopNav = document.querySelector('.hidden.md\\:flex.gap-10');
            const mobileNav = document.getElementById('mobile-drawer');
            
            if (desktopNav && !desktopNav.querySelector('a[href="index.html"]')) {
                desktopNav.insertAdjacentHTML('afterbegin', `<a class="font-manrope tracking-tight font-bold uppercase text-neutral-400 hover:text-white transition-colors text-sm" href="index.html" data-i18n="nav_home">${homeText}</a>`);
            }
            if (mobileNav && !mobileNav.querySelector('a[href="index.html"]')) {
                mobileNav.insertAdjacentHTML('afterbegin', `<a class="text-2xl font-bold uppercase text-white mb-6" href="index.html" data-i18n="nav_home">${homeText}</a>`);
            }
        }

    } catch (e) {
        console.error("Failed to load event theme or nav:", e);
    }
}

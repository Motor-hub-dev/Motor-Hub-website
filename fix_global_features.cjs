const fs = require('fs');

const htmlFiles = [
    'inventory.html',
    'about.html',
    'contact.html',
    'favorites.html',
    'details.html'
];

const logicStr = `
        // ==== Global Logic ====
        let currentLang = localStorage.getItem('lang') || 'en';
        let currentCurrency = localStorage.getItem('currency') || 'USD';
        let exchangeRate = 1;
        let translations = {};

        async function initGlobal() {
            try {
                // If not using getSettings from a module, we fetch via standard fetch or mock if needed.
                // Assuming settings.js is imported in the file or we can fetch directly.
                const transRes = await fetch('translations.json').then(r => r.json());
                translations = transRes;
                applyLanguage();
                // updateCurrencyDisplay exists in pages that need it, or we implement a generic one
                if (typeof updateCurrencyDisplay === 'function') {
                    updateCurrencyDisplay();
                } else {
                    document.getElementById('currency-toggle').textContent = currentCurrency;
                }
            } catch (err) {
                console.error("Global init error:", err);
            }
        }

        function applyLanguage() {
            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[currentLang] && translations[currentLang][key]) {
                    if (el.hasAttribute('placeholder')) {
                        el.placeholder = translations[currentLang][key];
                    } else if (el.tagName === 'OPTION') {
                        el.text = translations[currentLang][key];
                    } else {
                        // Because some keys have nested HTML (like <span>), we use innerHTML if there's html in the translation, else textContent
                        // For safety, textContent is usually preferred, but some of our translations contain spans.
                        if (translations[currentLang][key].includes('<')) {
                             el.innerHTML = translations[currentLang][key];
                        } else {
                             el.textContent = translations[currentLang][key];
                        }
                    }
                }
            });
            const lt = document.getElementById('lang-toggle');
            if(lt) lt.textContent = currentLang === 'en' ? 'AR' : 'EN';
            const mlt = document.getElementById('mobile-lang-toggle');
            if(mlt) mlt.textContent = currentLang === 'en' ? 'Switch to AR' : 'Switch to EN';
        }

        const langToggleBtn = document.getElementById('lang-toggle');
        if(langToggleBtn) {
            langToggleBtn.addEventListener('click', () => {
                currentLang = currentLang === 'en' ? 'ar' : 'en';
                localStorage.setItem('lang', currentLang);
                applyLanguage();
            });
        }

        const mlangToggleBtn = document.getElementById('mobile-lang-toggle');
        if(mlangToggleBtn) {
            mlangToggleBtn.addEventListener('click', () => {
                currentLang = currentLang === 'en' ? 'ar' : 'en';
                localStorage.setItem('lang', currentLang);
                applyLanguage();
            });
        }

        const currToggleBtn = document.getElementById('currency-toggle');
        if(currToggleBtn) {
            currToggleBtn.addEventListener('click', () => {
                currentCurrency = currentCurrency === 'USD' ? 'EGP' : 'USD';
                localStorage.setItem('currency', currentCurrency);
                currToggleBtn.textContent = currentCurrency;
                if (typeof updateCurrencyDisplay === 'function') updateCurrencyDisplay();
            });
        }

        const mcurrToggleBtn = document.getElementById('mobile-currency-toggle');
        if(mcurrToggleBtn) {
            mcurrToggleBtn.addEventListener('click', () => {
                currentCurrency = currentCurrency === 'USD' ? 'EGP' : 'USD';
                localStorage.setItem('currency', currentCurrency);
                if (typeof updateCurrencyDisplay === 'function') updateCurrencyDisplay();
            });
        }

        initGlobal();
`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Check if the script exists
    if (!content.includes('// ==== Global Logic ====')) {
        content = content.replace('</script>', logicStr + '\n    </script>');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated global logic in ${file}`);
});

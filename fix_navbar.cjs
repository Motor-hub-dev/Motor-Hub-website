const fs = require('fs');

const htmlFiles = [
    'inventory.html',
    'about.html',
    'contact.html',
    'favorites.html',
    'details.html',
    'trading.html'
];

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract the navbar block from index.html
const navRegex = /<!-- TopNavBar -->\s*<nav[^>]*>[\s\S]*?<\/nav>/;
const navMatch = indexHtml.match(navRegex);

// Extract the mobile drawer from index.html
const drawerRegex = /<!-- Mobile Drawer[^>]*-->\s*<div id="mobile-drawer"[\s\S]*?<\/div>/;
const drawerMatch = indexHtml.match(drawerRegex);

// Extract FAB from index.html
const fabRegex = /<!-- Floating FAB -->[\s\S]*?<\/div>/;
const fabMatch = indexHtml.match(fabRegex);

// Extract script blocks for nav/fab logic
const scriptLogic = `
        // Mobile Menu
        const menuBtn = document.getElementById('mobile-menu-btn');
        const drawer = document.getElementById('mobile-drawer');
        if (menuBtn && drawer) {
            menuBtn.addEventListener('click', () => {
                drawer.classList.toggle('translate-x-full');
                menuBtn.innerHTML = drawer.classList.contains('translate-x-full')
                    ? '<span class="material-symbols-outlined">menu</span>'
                    : '<span class="material-symbols-outlined">close</span>';
            });
        }

        // FAB
        const fabBtn = document.getElementById('fab-btn');
        const fabPopup = document.getElementById('fab-popup');
        if (fabBtn && fabPopup) {
            fabBtn.addEventListener('click', () => {
                fabPopup.classList.toggle('hidden');
                fabPopup.classList.toggle('flex');
            });
        }
`;

if (navMatch && drawerMatch && fabMatch) {
    const navHTML = navMatch[0];
    const drawerHTML = drawerMatch[0];
    const fabHTML = fabMatch[0];

    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');

        // Find existing nav to replace
        const fileNavMatchRegex = /<!-- TopNavBar -->\s*<nav[^>]*>[\s\S]*?<\/nav>/;

        if (fileNavMatchRegex.test(content)) {
            // Replace existing TopNavBar
            content = content.replace(fileNavMatchRegex, navHTML);
        } else if (content.includes('<nav')) {
             // Fallback if no comment
             content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/, navHTML);
        }

        // Check if drawer exists, if not inject it after nav
        if (!content.includes('id="mobile-drawer"')) {
            content = content.replace(navHTML, navHTML + '\n\n    ' + drawerHTML);
        } else {
            content = content.replace(/<!-- Mobile Drawer[\s\S]*?<\/div>/, drawerHTML);
        }

        // Check if FAB exists, if not inject it before closing body
        if (!content.includes('id="fab-btn"')) {
            content = content.replace(/<\/body>/, '\n    ' + fabHTML + '\n\n</body>');
        }

        // Check if script logic exists, if not inject it
        if (!content.includes('mobile-menu-btn')) {
            if (content.includes('<script type="module">')) {
                content = content.replace('</script>', scriptLogic + '\n    </script>');
            } else if (content.includes('<script>')) {
                content = content.replace('</script>', scriptLogic + '\n    </script>');
            } else {
                content = content.replace('</body>', '<script type="module">\n' + scriptLogic + '\n</script>\n</body>');
            }
        }

        // Update the active state in the nav based on the file
        const currNavMatch = content.match(fileNavMatchRegex);
        if (currNavMatch) {
            let newFileNavMatch = currNavMatch[0].replace(/text-primary border-b-2 border-primary pb-1/g, 'text-neutral-400 hover:text-white transition-colors'); // Reset all

            if (file === 'inventory.html' || file === 'details.html') {
                newFileNavMatch = newFileNavMatch.replace(/href="inventory.html" class="[^"]*"/, 'href="inventory.html" class="font-manrope tracking-tight font-bold uppercase text-primary border-b-2 border-primary pb-1"');
            } else if (file === 'about.html') {
                newFileNavMatch = newFileNavMatch.replace(/href="about.html" class="[^"]*"/, 'href="about.html" class="font-manrope tracking-tight font-bold uppercase text-primary border-b-2 border-primary pb-1"');
            } else if (file === 'contact.html') {
                newFileNavMatch = newFileNavMatch.replace(/href="contact.html" class="[^"]*"/, 'href="contact.html" class="font-manrope tracking-tight font-bold uppercase text-primary border-b-2 border-primary pb-1"');
            } else if (file === 'favorites.html') {
                newFileNavMatch = newFileNavMatch.replace(/href="favorites.html" class="[^"]*"/, 'href="favorites.html" class="font-manrope tracking-tight font-bold uppercase text-primary border-b-2 border-primary pb-1"');
            } else if (file === 'trading.html') {
                newFileNavMatch = newFileNavMatch.replace(/href="trading.html" class="[^"]*"/, 'href="trading.html" class="font-manrope tracking-tight font-bold uppercase text-primary border-b-2 border-primary pb-1"');
            }

            content = content.replace(currNavMatch[0], newFileNavMatch);
        }

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    });
} else {
    console.log('Could not find nav, drawer, or fab blocks in index.html');
}

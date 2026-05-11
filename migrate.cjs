const fs = require('fs');
const path = require('path');

const pages = [
  'about.html',
  'admin.html',
  'contact.html',
  'details.html',
  'favorites.html',
  'inventory.html',
  'trading.html'
];

// 1. Process all HTML files (including index.html)
const allHtml = ['index.html', ...pages];

allHtml.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Update Links
    content = content.replace(/href="index\.html"/g, 'href="/"');
    
    pages.forEach(p => {
        const base = p.replace('.html', '');
        // Match exact href="page.html"
        content = content.replace(new RegExp(`href="${p}"`, 'g'), `href="/${base}/"`);
        // Match href="page.html?..."
        content = content.replace(new RegExp(`href="${p}\\?`, 'g'), `href="/${base}/?`);
    });

    // Update Asset Paths (to root-relative)
    content = content.replace(/src="motor-hub-logo\.png"/g, 'src="/motor-hub-logo.png"');
    content = content.replace(/src="background-logo\.png"/g, 'src="/background-logo.png"');
    content = content.replace(/src="images\//g, 'src="/images/');
    content = content.replace(/fetch\('translations\.json'\)/g, "fetch('/translations.json')");
    
    // JS Module Imports
    content = content.replace(/from '\.\//g, "from '/");

    // Re-write file
    fs.writeFileSync(file, content, 'utf8');
});

// 2. Move pages into folders
pages.forEach(file => {
    if (!fs.existsSync(file)) return;
    const base = file.replace('.html', '');
    if (!fs.existsSync(base)) {
        fs.mkdirSync(base);
    }
    fs.renameSync(file, path.join(base, 'index.html'));
});

// 3. Update fix_navbar.cjs
if (fs.existsSync('fix_navbar.cjs')) {
    let script = fs.readFileSync('fix_navbar.cjs', 'utf8');
    // The script currently loops over an array:
    // const pages = ['inventory.html', 'about.html', ...];
    // We need to map it to 'inventory/index.html', etc.
    script = script.replace(
        /const pages = \['inventory\.html', 'about\.html', 'contact\.html', 'favorites\.html', 'details\.html', 'trading\.html'\];/g,
        "const pages = ['inventory/index.html', 'about/index.html', 'contact/index.html', 'favorites/index.html', 'details/index.html', 'trading/index.html'];"
    );
    fs.writeFileSync('fix_navbar.cjs', script, 'utf8');
}

console.log('Migration complete!');

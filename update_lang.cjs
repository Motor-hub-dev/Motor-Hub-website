const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('a:\\\\Websites\\\\Motor-Hub-website');
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes("localStorage.setItem('lang', currentLang);")) {
        let modified = content.replace(/localStorage\.setItem\('lang', currentLang\);\s*applyLanguage\(\);/g, "localStorage.setItem('lang', currentLang);\n                window.location.reload();");
        if (modified !== content) {
            fs.writeFileSync(f, modified);
            console.log('Updated ' + f);
        }
    }
});

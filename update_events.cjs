const fs = require('fs');
const files = ['index.html', 'inventory.html', 'about.html', 'contact.html', 'favorites.html', 'details.html', 'trading.html'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('function initGlobal() {') && !content.includes('applyEventTheme')) {
      content = content.replace(
        'const cToggle = document.getElementById(\'currency-toggle\');',
        `import('./events.js').then(m => m.applyEventTheme()).catch(e => console.error(e));\n                const cToggle = document.getElementById('currency-toggle');`
      );
      fs.writeFileSync(f, content);
      console.log('Updated ' + f);
    }
  }
});

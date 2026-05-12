const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('.', function(filePath) {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = content;

        // Fix dynamic imports
        modified = modified.replace(/import\(['"]\.\/events\.js['"]\)/g, "import('/events.js')");
        modified = modified.replace(/import\(['"]events\.js['"]\)/g, "import('/events.js')");

        modified = modified.replace(/import\(['"]\.\/settings\.js['"]\)/g, "import('/settings.js')");
        modified = modified.replace(/import\(['"]settings\.js['"]\)/g, "import('/settings.js')");

        // Fix service worker registration
        modified = modified.replace(/navigator\.serviceWorker\.register\(['"]sw\.js['"]\)/g, "navigator.serviceWorker.register('/sw.js')");
        modified = modified.replace(/navigator\.serviceWorker\.register\(['"]\.\/sw\.js['"]\)/g, "navigator.serviceWorker.register('/sw.js')");

        if (content !== modified) {
            fs.writeFileSync(filePath, modified);
            console.log('Updated imports in ' + filePath);
        }
    }
});

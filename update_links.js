const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const snippet = `
                // [AUTO-INJECT] Update FAB and hardcoded contact links
                if (typeof settings !== 'undefined' || typeof sideSettings !== 'undefined') {
                    const s = typeof settings !== 'undefined' ? settings : sideSettings;
                    if (s && s.whatsapp_number) {
                        document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
                            if (el.href.includes('123456789') || el.href.includes('wa.me')) {
                                el.href = "https://wa.me/" + s.whatsapp_number.replace(/[^0-9]/g, '');
                            }
                        });
                    }
                    if (s && s.phone_number) {
                        document.querySelectorAll('a[href*="tel:"]').forEach(el => {
                            if (el.href.includes('123456789') || el.href.includes('tel:')) {
                                el.href = "tel:" + s.phone_number.replace(/[^0-9+]/g, '');
                            }
                        });
                    }
                }
                // [/AUTO-INJECT]
`;

walkDir('.', function(filePath) {
    if (filePath.endsWith('.html') && !filePath.includes('admin')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find getSettings call
        const match = content.match(/const\s+(settings|sideSettings)\s*=\s*await\s+getSettings\(\)(?:\.catch\(\(\)\s*=>\s*\(?\{\}?\)?\))?;/);
        if (match && !content.includes('[AUTO-INJECT]')) {
            const index = match.index + match[0].length;
            const before = content.substring(0, index);
            const after = content.substring(index);
            fs.writeFileSync(filePath, before + snippet + after);
            console.log('Updated ' + filePath);
        }
    }
});

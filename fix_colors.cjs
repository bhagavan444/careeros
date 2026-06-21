const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/rocky/Desktop/RAYA/Academic projects/carrer-path-web-/frontend/src/components/ProfileIntelligence/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (let f of files) {
    const p = path.join(dir, f);
    let code = fs.readFileSync(p, 'utf8');
    
    // Replace hex colors globally (case insensitive where appropriate)
    code = code.replace(/#a3a3a3/gi, "#86868b");
    code = code.replace(/#d4d4d4/gi, "#1d1d1f");
    code = code.replace(/#ffffff/gi, "#1d1d1f"); // Replace all white text/bgs since we are on a light theme now
    code = code.replace(/#9ca3af/gi, "#86868b");
    code = code.replace(/#d1d5db/gi, "#86868b");
    
    // Backgrounds & borders
    code = code.replace(/rgba\(255,\s*255,\s*255,\s*0\.03\)/g, "'#ffffff'");
    code = code.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, "'rgba(0, 0, 0, 0.04)'");
    code = code.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, "'rgba(0,0,0,0.05)'");
    code = code.replace(/rgba\(255,\s*255,\s*255,\s*0\.02\)/g, "'#f5f5f7'");
    code = code.replace(/#0a0a0a/g, "transparent");

    fs.writeFileSync(p, code);
}
console.log('Done');

const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/rocky/Desktop/RAYA/Academic projects/carrer-path-web-/frontend/src/components/ProfileIntelligence/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (let f of files) {
    const p = path.join(dir, f);
    let code = fs.readFileSync(p, 'utf8');
    
    // Fix 'solid 'rgba...' -> 'solid rgba...'
    code = code.replace(/solid 'rgba/g, "solid rgba");
    code = code.replace(/05\)'/g, "05)'");
    // Ensure we don't have trailing double single-quotes or anything weird at the end of rgba
    code = code.replace(/\)'\s*'/g, ")'");
    code = code.replace(/\)''/g, ")'");
    
    fs.writeFileSync(p, code);
}
console.log('Fixed solid rgba quotes');

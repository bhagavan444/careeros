const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/rocky/Desktop/RAYA/Academic projects/carrer-path-web-/frontend/src/components/ProfileIntelligence/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (let f of files) {
    const p = path.join(dir, f);
    let code = fs.readFileSync(p, 'utf8');
    
    // Fix double single-quotes
    code = code.replace(/''rgba/g, "'rgba");
    code = code.replace(/04\)''/g, "04)'");
    code = code.replace(/05\)''/g, "05)'");
    code = code.replace(/''#ffffff''/g, "'#ffffff'");
    code = code.replace(/''#f5f5f7''/g, "'#f5f5f7'");

    fs.writeFileSync(p, code);
}
console.log('Fixed double quotes');

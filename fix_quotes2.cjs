const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/rocky/Desktop/RAYA/Academic projects/carrer-path-web-/frontend/src/components/ProfileIntelligence/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (let f of files) {
    const p = path.join(dir, f);
    let code = fs.readFileSync(p, 'utf8');
    
    // Fix the broken border styles
    code = code.replace(/'1px solid 'rgba\(0, 0, 0, 0\.04\)'/g, "'1px solid rgba(0, 0, 0, 0.04)'");
    code = code.replace(/'1px solid 'rgba\(0, 0, 0, 0\.04\)''/g, "'1px solid rgba(0, 0, 0, 0.04)'");
    code = code.replace(/''/g, "'"); // Cleanup any residual double single-quotes globally, safely for JSX
    
    fs.writeFileSync(p, code);
}
console.log('Fixed border quotes');

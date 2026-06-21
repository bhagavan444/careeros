const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\components\\RecruiterIntelligence';

const replacements = [
  // High opacity white backgrounds
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.[6789]\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*'rgba\(255,\s*255,\s*255,\s*0\.[6789]\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },
  
  // Black/dark backgrounds that were meant for light mode (e.g., subtle gray backgrounds)
  { match: /background:\s*"rgba\(0,\s*0,\s*0,\s*0\.0[12345]\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*'rgba\(0,\s*0,\s*0,\s*0\.0[12345]\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },

  // Any remaining black borders
  { match: /border:\s*"1px solid rgba\(0,\s*0,\s*0,\s*0\.\d+\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*'1px solid rgba\(0,\s*0,\s*0,\s*0\.\d+\)'/g, replace: "border: '1px solid rgba(255,255,255,0.15)'" },
];

function walkDir(d) {
  const files = fs.readdirSync(d);
  files.forEach(file => {
    const fullPath = path.join(d, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      replacements.forEach(r => {
        if (content.match(r.match)) {
          content = content.replace(r.match, r.replace);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', file);
      }
    }
  });
}

walkDir(dir);
console.log('Done deep fix.');

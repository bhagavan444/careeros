const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\components\\predict';

const replacements = [
  // Background overrides
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.95\)"/g, replace: 'background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.6\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.5\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.4\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.45\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.3\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"#fff"/g, replace: 'background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"#f8fafc"/g, replace: 'background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(24px) saturate(180%)"' },
  { match: /background:\s*"rgba\(0,0,0,0\.02\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /"rgba\(255,255,255,0\.4\)"/g, replace: '"rgba(255, 255, 255, 0.05)"' },

  // Borders that look bad on dark
  { match: /border:\s*"1px solid rgba\(0,0,0,0\.0\d\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*"1px solid rgba\(0,\s*0,\s*0,\s*0\.0\d\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*"1px dashed rgba\(0,0,0,0\.0\d\)"/g, replace: 'border: "1px dashed rgba(255,255,255,0.15)"' },
  { match: /border:\s*"1px solid #e2e8f0"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*"1px solid #e5e7eb"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /borderBottom:\s*"1px solid rgba\(0,0,0,0\.0\d\)"/g, replace: 'borderBottom: "1px solid rgba(255,255,255,0.1)"' },

  // Text colors
  { match: /color:\s*"#111827"/g, replace: 'color: "#fff"' },
  { match: /color:\s*"#6b7280"/g, replace: 'color: "#d1d5db"' },
  { match: /color:\s*"#4b5563"/g, replace: 'color: "#9ca3af"' },
  { match: /color:\s*"#0f0f0f"/g, replace: 'color: "#fff"' },
  
  // Specific list items backgrounds and lines
  { match: /borderLeft:\s*"4px solid #ef4444", borderTop:\s*"1px solid #f3f4f6", borderRight:\s*"1px solid #f3f4f6", borderBottom:\s*"1px solid #f3f4f6"/g, replace: 'borderLeft: "4px solid #ef4444", borderTop: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)"' }
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

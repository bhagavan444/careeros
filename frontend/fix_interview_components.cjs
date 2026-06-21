const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\components\\InterviewIntelligence';

const replacements = [
  // Background overrides
  { match: /background:\s*"white"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*"#f9fafb"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*"#f3f4f6"/g, replace: 'background: "rgba(255, 255, 255, 0.1)"' },
  { match: /background:\s*"#fef2f2"/g, replace: 'background: "rgba(239, 68, 68, 0.1)"' },
  { match: /background:\s*"#fafafa"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },

  // Borders that look bad on dark
  { match: /border:\s*"1px solid rgba\(0,0,0,0\.05\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*"1px solid #e5e7eb"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /borderBottom:\s*"1px solid #e5e7eb"/g, replace: 'borderBottom: "1px solid rgba(255,255,255,0.15)"' },
  { match: /borderBottom:\s*"2px solid #e5e7eb"/g, replace: 'borderBottom: "2px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*"1px solid #fecaca"/g, replace: 'border: "1px solid rgba(239, 68, 68, 0.2)"' },
  { match: /border:\s*"1px solid #bbf7d0"/g, replace: 'border: "1px solid rgba(16, 185, 129, 0.2)"' },

  // Text colors
  { match: /color:\s*"#111827"/g, replace: 'color: "#fff"' },
  { match: /color:\s*"#1f2937"/g, replace: 'color: "#f3f4f6"' },
  { match: /color:\s*"#374151"/g, replace: 'color: "#d1d5db"' },
  { match: /color:\s*"#4b5563"/g, replace: 'color: "#d1d5db"' },
  { match: /color:\s*"#6b7280"/g, replace: 'color: "#9ca3af"' },
  { match: /color:\s*"#0f0f0f"/g, replace: 'color: "#fff"' },
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

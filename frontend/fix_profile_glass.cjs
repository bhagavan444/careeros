const fs = require('fs');
const path = require('path');

const profilePage = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\Pages\\ProfileIntelligence.jsx';
const componentsDir = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\components\\ProfileIntelligence';

// ---- FIX PROFILE INTELLIGENCE PAGE ----
let pageContent = fs.readFileSync(profilePage, 'utf8');

// Add imports for Background Video
if (!pageContent.includes('AtmosphericVideoLayer')) {
  pageContent = pageContent.replace(
    'import "./Home.css";', 
    'import "./Home.css";\nimport { AtmosphericVideoLayer, FloatingParticles } from "./HomeComponents";'
  );
}

// Replace background grid with video layer
pageContent = pageContent.replace(/<div className="grid-bg" \/>/, 
  `<AtmosphericVideoLayer />
      <FloatingParticles />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(3,7,18,0.7) 0%, rgba(3,7,18,0.85) 100%)", zIndex: 0, pointerEvents: "none" }} />`);

// Make sure content allows zIndex
pageContent = pageContent.replace(/paddingTop: '100px',/, "position: 'relative', zIndex: 10, paddingTop: '100px',");

// Color replacements in main page
const pageReplacements = [
  { match: /color: '#111827'/g, replace: "color: '#fff'" },
  { match: /color: '#374151'/g, replace: "color: '#d1d5db'" },
  { match: /color: '#4b5563'/g, replace: "color: '#d1d5db'" },
  { match: /color: '#6b7280'/g, replace: "color: '#9ca3af'" },
  { match: /background: 'rgba\(255, 255, 255, 0\.6\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },
  { match: /background: 'rgba\(255,\s*255,\s*255,\s*0\.8\)'/g, replace: "background: 'rgba(255, 255, 255, 0.08)'" },
  { match: /background: 'rgba\(255,255,255,0\.8\)'/g, replace: "background: 'rgba(255, 255, 255, 0.08)'" },
  { match: /border: '1px solid rgba\(0, 0, 0, 0\.06\)'/g, replace: "border: '1px solid rgba(255,255,255,0.15)'" },
  { match: /border: '1px solid rgba\(0, 0, 0, 0\.1\)'/g, replace: "border: '1px solid rgba(255,255,255,0.15)'" },
  { match: /border: '2px dashed rgba\(0,0,0,0\.15\)'/g, replace: "border: '2px dashed rgba(255,255,255,0.15)'" },
  { match: /background: 'linear-gradient\(135deg, #111827, #4b5563\)'/g, replace: "background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)'" },
  { match: /boxShadow: '0 4px 24px rgba\(0, 0, 0, 0\.02\)'/g, replace: "boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'" },
];

pageReplacements.forEach(r => {
  pageContent = pageContent.replace(r.match, r.replace);
});

fs.writeFileSync(profilePage, pageContent);

// ---- FIX PROFILE COMPONENTS ----
const compReplacements = [
  // High opacity white / light gray backgrounds
  { match: /background:\s*"white"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*'white'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },
  { match: /background:\s*"#ffffff"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*"#f9fafb"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*'#f9fafb'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },
  { match: /background:\s*"#f8fafc"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*"#f3f4f6"/g, replace: 'background: "rgba(255, 255, 255, 0.1)"' },
  { match: /background:\s*'#f3f4f6'/g, replace: "background: 'rgba(255, 255, 255, 0.1)'" },
  { match: /background:\s*"#fafafa"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*"rgba\(255,\s*255,\s*255,\s*0\.[6789]\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*'rgba\(255,\s*255,\s*255,\s*0\.[6789]\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },

  // Faint dark backgrounds meant for light mode
  { match: /background:\s*"rgba\(0,\s*0,\s*0,\s*0\.0[12345]\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /background:\s*'rgba\(0,\s*0,\s*0,\s*0\.0[12345]\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },
  { match: /background:\s*'rgba\(0,\s*0,\s*0,\s*0\.02\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)'" },
  { match: /background:\s*"rgba\(0,\s*0,\s*0,\s*0\.02\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },

  // Gradients
  { match: /background:\s*'linear-gradient\(180deg, #f8fafc 0%, #f1f5f9 100%\)'/g, replace: "background: 'rgba(255,255,255,0.05)'" },
  { match: /background:\s*"linear-gradient\(180deg, #f8fafc 0%, #f1f5f9 100%\)"/g, replace: 'background: "rgba(255,255,255,0.05)"' },

  // Borders
  { match: /border:\s*"1px solid rgba\(0,\s*0,\s*0,\s*0\.\d+\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*'1px solid rgba\(0,\s*0,\s*0,\s*0\.\d+\)'/g, replace: "border: '1px solid rgba(255,255,255,0.15)'" },
  { match: /border:\s*"1px solid #e5e7eb"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border:\s*'1px solid #e5e7eb'/g, replace: "border: '1px solid rgba(255,255,255,0.15)'" },
  { match: /borderBottom:\s*"1px solid #e5e7eb"/g, replace: 'borderBottom: "1px solid rgba(255,255,255,0.15)"' },
  { match: /borderRight:\s*'1px solid #e5e7eb'/g, replace: "borderRight: '1px solid rgba(255,255,255,0.15)'" },
  
  // Specific red/green light backgrounds (e.g., #fef2f2 -> rgba(239, 68, 68, 0.1))
  { match: /background:\s*"#fef2f2"/g, replace: 'background: "rgba(239, 68, 68, 0.1)"' },
  { match: /background:\s*"#f0fdf4"/g, replace: 'background: "rgba(34, 197, 94, 0.1)"' },
  { match: /background:\s*"#fefce8"/g, replace: 'background: "rgba(234, 179, 8, 0.1)"' },

  // Text colors (Dark -> Light)
  { match: /color:\s*"#111827"/g, replace: 'color: "#fff"' },
  { match: /color:\s*'#111827'/g, replace: "color: '#fff'" },
  { match: /color:\s*"#1f2937"/g, replace: 'color: "#f3f4f6"' },
  { match: /color:\s*'#1f2937'/g, replace: "color: '#f3f4f6'" },
  { match: /color:\s*"#374151"/g, replace: 'color: "#d1d5db"' },
  { match: /color:\s*'#374151'/g, replace: "color: '#d1d5db'" },
  { match: /color:\s*"#4b5563"/g, replace: 'color: "#d1d5db"' },
  { match: /color:\s*'#4b5563'/g, replace: "color: '#d1d5db'" },
  { match: /color:\s*"#6b7280"/g, replace: 'color: "#9ca3af"' },
  { match: /color:\s*'#6b7280'/g, replace: "color: '#9ca3af'" },
  { match: /color:\s*"#475569"/g, replace: 'color: "#cbd5e1"' },
  { match: /color:\s*'#475569'/g, replace: "color: '#cbd5e1'" },
  { match: /color:\s*"#64748b"/g, replace: 'color: "#94a3b8"' },
  { match: /color:\s*'#64748b'/g, replace: "color: '#94a3b8'" },
  
  // Shadows
  { match: /boxShadow:\s*'0 12px 24px rgba\(0,0,0,0\.03\)'/g, replace: "boxShadow: 'none'" },
  { match: /boxShadow:\s*"0 12px 24px rgba\(0,0,0,0\.03\)"/g, replace: 'boxShadow: "none"' },
  { match: /boxShadow:\s*"0 4px 6px -1px rgba\(0, 0, 0, 0\.05\)"/g, replace: 'boxShadow: "none"' },
  { match: /boxShadow:\s*'0 4px 6px -1px rgba\(0, 0, 0, 0\.05\)'/g, replace: "boxShadow: 'none'" },
  
  // High opacity dark borders
  { match: /border:\s*"1px solid rgba\(0,\s*0,\s*0,\s*0\.1\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' }
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
      compReplacements.forEach(r => {
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

walkDir(componentsDir);
console.log('Done profile components fix.');

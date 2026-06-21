const fs = require('fs');
const path = require('path');

const file = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\Pages\\GithubIntelligence.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  // Growth Roadmap Engine
  { match: /background: 'white', border: '1px solid rgba\(0,0,0,0\.06\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.15)'" },
  
  // Repository Code Intelligence
  { match: /background: 'linear-gradient\(180deg, #ffffff 0%, rgba\(16, 185, 129, 0\.02\) 100%\)'/g, replace: "background: 'rgba(16, 185, 129, 0.05)'" },
  { match: /background: 'white', border: '1px solid #eaeaea'/g, replace: "background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)'" },
  
  // Project Tier Cards
  { match: /background: 'white', border: '1px solid rgba\(0,0,0,0\.08\)'/g, replace: "background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255,255,255,0.15)'" },
  { match: /border: '1px solid rgba\(0,0,0,0\.05\)'/g, replace: "border: '1px solid rgba(255,255,255,0.15)'" },
  
  // Engineering status box
  { match: /background: '#fafafa', borderRadius: '12px', border: '1px solid rgba\(0,0,0,0\.03\)'/g, replace: "background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'" },
  { match: /borderTop: '1px dashed rgba\(0,0,0,0\.05\)'/g, replace: "borderTop: '1px dashed rgba(255,255,255,0.1)'" }
];

replacements.forEach(r => {
  content = content.replace(r.match, r.replace);
});

fs.writeFileSync(file, content);
console.log('GithubIntelligence.jsx fully updated.');

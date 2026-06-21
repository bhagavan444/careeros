const fs = require('fs');

const interviewPage = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\Pages\\InterviewIntelligence.jsx';
const reportCenter = 'c:\\Users\\rocky\\Desktop\\RAYA\\Academic projects\\carrer-path-web-\\frontend\\src\\components\\InterviewIntelligence\\InterviewReportCenter.jsx';

// ---- FIX INTERVIEW INTELLIGENCE PAGE ----
let pageContent = fs.readFileSync(interviewPage, 'utf8');

// Add imports
if (!pageContent.includes('AtmosphericVideoLayer')) {
  pageContent = pageContent.replace('import InterviewReportCenter', 'import AtmosphericVideoLayer from "../components/AtmosphericVideoLayer";\nimport FloatingParticles from "../components/FloatingParticles";\nimport InterviewReportCenter');
}

// Add video and particles inside the main wrapper
pageContent = pageContent.replace(/<div style={{\s*minHeight: "100vh",\s*padding: "120px 24px 60px",\s*background: "transparent",/, 
`<div style={{
      minHeight: "100vh",
      padding: "120px 24px 60px",
      background: "transparent",
      position: "relative",`);

if (!pageContent.includes('<AtmosphericVideoLayer />')) {
  pageContent = pageContent.replace(/<div style={{ maxWidth: 900, width: "100%", position: "relative", zIndex: 10 }}>/, 
    `<AtmosphericVideoLayer />
      <FloatingParticles />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(3,7,18,0.7) 0%, rgba(3,7,18,0.85) 100%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ maxWidth: 900, width: "100%", position: "relative", zIndex: 10 }}>`);
}

// Color replacements
const pageReplacements = [
  { match: /color: "#0f0f0f"/g, replace: 'color: "#fff"' },
  { match: /color: "#4b5563"/g, replace: 'color: "#d1d5db"' },
  { match: /color: "#111827"/g, replace: 'color: "#fff"' },
  { match: /color: "#1f2937"/g, replace: 'color: "#e5e7eb"' },
  { match: /color: "#374151"/g, replace: 'color: "#9ca3af"' },
  { match: /background: "rgba\(255,255,255,0\.8\)"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /border: "1px solid rgba\(0,0,0,0\.05\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /background: "rgba\(255,255,255,0\.5\)"/g, replace: 'background: "rgba(255, 255, 255, 0.08)"' },
  { match: /border: "1px solid rgba\(0,0,0,0\.1\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /background: "white"/g, replace: 'background: "rgba(255,255,255,0.1)"' },
];

pageReplacements.forEach(r => {
  pageContent = pageContent.replace(r.match, r.replace);
});

fs.writeFileSync(interviewPage, pageContent);


// ---- FIX INTERVIEW REPORT CENTER ----
let reportContent = fs.readFileSync(reportCenter, 'utf8');

// Add imports
if (!reportContent.includes('AtmosphericVideoLayer')) {
  reportContent = reportContent.replace('import generateEnterprisePDF', 'import generateEnterprisePDF from "./EnterprisePDFGenerator";\nimport AtmosphericVideoLayer from "../../components/AtmosphericVideoLayer";\nimport FloatingParticles from "../../components/FloatingParticles";');
}

// Add video and particles inside the main wrapper
reportContent = reportContent.replace(/<div style={{ minHeight: "100vh", background: "#f9fafb"/, 
`<div style={{ minHeight: "100vh", background: "transparent", position: "relative"`);

if (!reportContent.includes('<AtmosphericVideoLayer />')) {
  reportContent = reportContent.replace(/<div style={{ maxWidth: 1200, margin: "0 auto" }}>/, 
    `<AtmosphericVideoLayer />
        <FloatingParticles />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(3,7,18,0.7) 0%, rgba(3,7,18,0.85) 100%)", zIndex: 0, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 10 }}>`);
}

// Color replacements
const reportReplacements = [
  { match: /color: "#111827"/g, replace: 'color: "#fff"' },
  { match: /color: "#1f2937"/g, replace: 'color: "#f3f4f6"' },
  { match: /color: "#374151"/g, replace: 'color: "#d1d5db"' },
  { match: /color: "#4b5563"/g, replace: 'color: "#9ca3af"' },
  { match: /color: "#6b7280"/g, replace: 'color: "#9ca3af"' },
  { match: /background: "white"/g, replace: 'background: "rgba(255,255,255,0.05)"' },
  { match: /border: "1px solid rgba\(0,0,0,0\.05\)"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /border: "1px solid transparent"/g, replace: 'border: "1px solid transparent"' }, // keep transparent
  { match: /background: "#f9fafb"/g, replace: 'background: "rgba(255, 255, 255, 0.05)"' },
  { match: /border: "1px solid #e5e7eb"/g, replace: 'border: "1px solid rgba(255,255,255,0.15)"' },
  { match: /borderBottom: "1px solid #e5e7eb"/g, replace: 'borderBottom: "1px solid rgba(255,255,255,0.15)"' },
  { match: /borderBottom: "2px solid #e5e7eb"/g, replace: 'borderBottom: "2px solid rgba(255,255,255,0.15)"' },
  { match: /background: "#f3f4f6"/g, replace: 'background: "rgba(255,255,255,0.1)"' },
  { match: /background: "#fef2f2"/g, replace: 'background: "rgba(239, 68, 68, 0.1)"' },
  { match: /border: "1px solid #fecaca"/g, replace: 'border: "1px solid rgba(239, 68, 68, 0.2)"' },
  { match: /background: "#111827"/g, replace: 'background: "rgba(255,255,255,0.1)"' },
  // Remove shadows that don't look good on dark theme
  { match: /boxShadow: activeTab === tab\.id \? "[^"]*" : "none"/g, replace: 'boxShadow: "none"' }
];

reportReplacements.forEach(r => {
  reportContent = reportContent.replace(r.match, r.replace);
});

fs.writeFileSync(reportCenter, reportContent);

console.log('InterviewIntelligence and InterviewReportCenter updated.');

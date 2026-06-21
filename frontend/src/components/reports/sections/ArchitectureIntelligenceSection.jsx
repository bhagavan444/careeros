import React from 'react';

export default function ArchitectureIntelligenceSection({ data }) {
  const arch = data?.analytics?.architecture_intelligence || {};
  const archScore = arch.architecture_score || 0;
  
  let archLevel = "Basic";
  if (archScore >= 90) archLevel = "Enterprise";
  else if (archScore >= 75) archLevel = "Professional";
  else if (archScore >= 50) archLevel = "Advanced";
  else if (archScore >= 30) archLevel = "Intermediate";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Architecture Intelligence</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '16px' }}>
        <div style={{ background: '#f8fafc', padding: '24px', border: '1px solid #cbd5e1', borderTop: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Architecture Level</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{archLevel}</div>
          
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Architecture Risk Score</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: Math.max(0, 100 - archScore) > 40 ? '#dc2626' : '#059669' }}>
              {Math.max(0, 100 - archScore)}/100
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Detected Patterns</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(arch.architectural_patterns || []).map((pattern, i) => (
                <span key={i} style={{ padding: '6px 12px', background: '#f3e8ff', color: '#6b21a8', borderRadius: '4px', fontSize: '12px', fontWeight: 600, border: '1px solid #e9d5ff' }}>
                  {pattern}
                </span>
              ))}
              {(arch.architectural_patterns || []).length === 0 && <span style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic' }}>No advanced patterns explicitly detected.</span>}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Technical Debt Indicators</h3>
            <ul style={{ margin: 0, paddingLeft: '16px', color: '#1e293b', fontSize: '13px', lineHeight: 1.6 }}>
              {(arch.tech_debt_indicators || []).map((debt, i) => (
                <li key={i} style={{ marginBottom: '6px', color: '#b45309' }}>{debt}</li>
              ))}
              {(arch.tech_debt_indicators || []).length === 0 && <li style={{ color: '#059669' }}>No explicit technical debt indicators found.</li>}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: '#f1f5f9', padding: '24px', borderTop: '2px solid #cbd5e1' }}>
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#047857', marginBottom: '12px', textTransform: 'uppercase' }}>Architecture Strengths</h3>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#1e293b', fontSize: '13px', lineHeight: 1.6 }}>
            {(arch.strengths || []).map((s, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{s}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', marginBottom: '12px', textTransform: 'uppercase' }}>Architecture Weaknesses</h3>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#1e293b', fontSize: '13px', lineHeight: 1.6 }}>
            {(arch.weaknesses || []).map((w, i) => (
              <li key={i} style={{ marginBottom: '6px' }}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function CareerPositioningSection({ data }) {
  const synth = synthesizeMetrics(data);
  const positioning = synth.marketPositioning || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Market Positioning Engine</h2>
      </div>

      <div style={{ background: '#f8fafc', padding: '24px', border: '1px solid #cbd5e1', borderLeft: '4px solid #1d4ed8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Market Evaluation Level</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{synth.marketLevel}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Positioning Confidence</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#1d4ed8' }}>High (Deterministic)</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#475569', margin: 0, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Domain Readiness</h3>
        
        {positioning.map((pos, idx) => (
          <div key={idx} style={{ border: '1px solid #cbd5e1', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '12px 16px', borderBottom: '1px solid #cbd5e1' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', textTransform: 'uppercase' }}>{pos.name}</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#10b981' }}>{pos.score}/100</div>
            </div>
            
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#059669', fontWeight: 700, marginBottom: '4px' }}>Why This Score Exists</div>
                <div style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{pos.why}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#1d4ed8', fontWeight: 700, marginBottom: '4px' }}>Supporting Evidence</div>
                <div style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{pos.evidence}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#dc2626', fontWeight: 700, marginBottom: '4px' }}>What Is Missing</div>
                <div style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{pos.missing}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

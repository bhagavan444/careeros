import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function InterviewReadinessSection({ data }) {
  const synth = synthesizeMetrics(data);
  const readiness = synth.interviewReadiness || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interview Readiness Engine</h2>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#475569' }}>Calculated domain competence based on footprint depth and scale.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {readiness.map((domain, idx) => (
          <div key={idx} style={{ border: '1px solid #cbd5e1', background: '#fff', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', textTransform: 'uppercase' }}>{domain.domain}</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#1d4ed8' }}>{domain.score}/100</div>
            </div>

            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Interview Difficulty Target</span>
                <span style={{ 
                  padding: '2px 8px', background: domain.difficulty === 'Senior' ? '#fce7f3' : domain.difficulty === 'Advanced' ? '#e0e7ff' : '#f1f5f9',
                  color: domain.difficulty === 'Senior' ? '#be185d' : domain.difficulty === 'Advanced' ? '#4338ca' : '#475569',
                  borderRadius: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase'
                }}>
                  {domain.difficulty}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#059669', fontWeight: 700, marginBottom: '4px' }}>Strengths</div>
                  <div style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{domain.strengths}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#dc2626', fontWeight: 700, marginBottom: '4px' }}>Weaknesses</div>
                  <div style={{ fontSize: '11px', color: '#334155', fontWeight: 500 }}>{domain.weaknesses}</div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Supporting Evidence</div>
                <div style={{ fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>{domain.evidence}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

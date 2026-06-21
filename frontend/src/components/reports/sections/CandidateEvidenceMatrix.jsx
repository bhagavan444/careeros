import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function CandidateEvidenceMatrix({ data }) {
  const synth = synthesizeMetrics(data);
  const matrix = synth.evidenceMatrix || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate Evidence Matrix</h2>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#475569' }}>Deterministic proof linking claimed skills to verifiable artifacts.</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'system-ui, sans-serif' }}>
        <thead>
          <tr style={{ background: '#0f172a', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill</th>
            <th style={{ padding: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Resume</th>
            <th style={{ padding: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>GitHub</th>
            <th style={{ padding: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Portfolio</th>
            <th style={{ padding: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>LinkedIn</th>
            <th style={{ padding: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
              <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{row.tech}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: row.resume ? '#059669' : '#dc2626', fontWeight: 800 }}>{row.resume ? '✓' : '✗'}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: row.github ? '#059669' : '#dc2626', fontWeight: 800 }}>{row.github ? '✓' : '✗'}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: row.portfolio ? '#059669' : '#dc2626', fontWeight: 800 }}>{row.portfolio ? '✓' : '✗'}</td>
              <td style={{ padding: '12px', textAlign: 'center', color: row.linkedin ? '#059669' : '#dc2626', fontWeight: 800 }}>{row.linkedin ? '✓' : '✗'}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  background: row.confidence === 100 ? '#d1fae5' : row.confidence > 50 ? '#fef3c7' : '#fee2e2',
                  color: row.confidence === 100 ? '#065f46' : row.confidence > 50 ? '#92400e' : '#991b1b'
                }}>
                  {row.confidence}%
                </span>
              </td>
            </tr>
          ))}
          {matrix.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No skills detected.</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div style={{ background: '#f8fafc', padding: '16px', borderLeft: '4px solid #3b82f6', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
        <strong>Verification Strategy:</strong> This matrix is assembled by cross-referencing package files (package.json, pyproject.toml, etc.) against unstructured text found in candidate artifacts. AI hallucination is strictly blocked.
      </div>
    </div>
  );
}

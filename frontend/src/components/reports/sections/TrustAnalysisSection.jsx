import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function TrustAnalysisSection({ data }) {
  const synth = synthesizeMetrics(data);
  const matrix = synth.techMatrix || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technology Verification Matrix</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '8px' }}>
        <div style={{ background: '#f8fafc', padding: '16px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Technology Trust Score</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{synth.trust}%</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Technology Breadth Score</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{synth.techBreadthScore}/100</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'system-ui, sans-serif' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
            <th style={{ padding: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technology</th>
            <th style={{ padding: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence</th>
            <th style={{ padding: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evidence Source</th>
            <th style={{ padding: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Status</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
              <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{row.tech}</td>
              <td style={{ padding: '12px', fontWeight: 700, color: row.confidence === '100%' ? '#059669' : row.confidence === '0%' ? '#dc2626' : '#d97706' }}>
                {row.confidence}
              </td>
              <td style={{ padding: '12px', color: '#475569', fontStyle: 'italic' }}>{row.source}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  background: row.status === 'Verified' ? '#d1fae5' : row.status === 'Unverified' ? '#fee2e2' : '#fef3c7',
                  color: row.status === 'Verified' ? '#065f46' : row.status === 'Unverified' ? '#991b1b' : '#92400e'
                }}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
          {matrix.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No technologies detected.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

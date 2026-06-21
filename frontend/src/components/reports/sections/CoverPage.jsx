import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function CoverPage({ data }) {
  const synth = synthesizeMetrics(data);
  const username = data?.profile?.username || "Unknown";
  const name = data?.profile?.name || username;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const uuid = data?.uuid || "N/A";
  
  const level = synth.candidateCategory;
  const recommendation = synth.hiringRec;

  return (
    <div style={{
      width: '210mm',
      height: '297mm',
      background: '#fff',
      color: '#0f0f0f',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '40mm 20mm',
      boxSizing: 'border-box'
    }}>
      {/* Decorative Background */}
      <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: '120%', height: '50%', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.05), rgba(51, 65, 85, 0.1))', transform: 'rotate(-10deg)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '10mm', left: '20mm', fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', color: '#dc2626', zIndex: 1 }}>CONFIDENTIAL ENGINEERING ASSESSMENT</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.2em', color: '#1e293b', textTransform: 'uppercase', marginBottom: '30px' }}>
          CAREEROS INTELLIGENCE
        </h1>

        <h2 style={{ fontSize: '56px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
          Engineering<br/>Due Diligence<br/>Report
        </h2>

        <div style={{ height: '4px', width: '60px', background: '#3b82f6', marginBottom: '50px' }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>Candidate</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{name}</div>
              <div style={{ fontSize: '14px', color: '#475569', fontWeight: 500, marginTop: '4px' }}>@{username}</div>
            </div>

            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>Assessed Level</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1d4ed8' }}>{level}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>Overall Score</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1d4ed8' }}>{synth.overallScore}/100</div>
            </div>

            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>Trust Score</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#334155' }}>{synth.trust}%</div>
            </div>

            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: '8px', fontWeight: 700 }}>Hiring Recommendation</div>
              <div style={{ display: 'inline-block', padding: '6px 12px', background: recommendation.includes('Strong') ? '#ecfdf5' : '#f8fafc', color: recommendation.includes('Strong') ? '#047857' : '#0f172a', borderRadius: '4px', fontSize: '16px', fontWeight: 800, border: '1px solid #e2e8f0' }}>
                {recommendation}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '-40mm', left: 0, width: '100%', borderTop: '2px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div>Generated: {date}</div>
          <div>Version 3.0 Flagship Edition</div>
          <div>Report ID: {uuid}</div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function ExecutiveSummarySection({ data }) {
  const synth = synthesizeMetrics(data);
  const summary = data?.ai_insights?.executive_summary || {};
  const { topProject } = synth.portfolioRankings;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Executive Summary</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: '#f8fafc', padding: '16px', borderLeft: '4px solid #1d4ed8' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Engineering Classification</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{synth.candidateCategory}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>Overall Engineering Score</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{synth.overallScore}/100</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#475569', margin: 0, textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Due Diligence Findings</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Top Verified Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {synth.evidenceMatrix.filter(e => e.confidence > 50).slice(0, 5).map((e, i) => (
                <span key={i} style={{ padding: '4px 8px', background: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>{e.tech}</span>
              ))}
              {synth.evidenceMatrix.filter(e => e.confidence > 50).length === 0 && <span style={{ color: '#dc2626', fontSize: '12px' }}>None verified.</span>}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Highest Risk Vectors</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(summary.top_risks || ["Limited test coverage detected.", "Production deployment maturity is unverified."]).slice(0, 3).map((r, i) => (
                <span key={i} style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 600, borderRadius: '4px' }}>{r}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '8px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Strongest Highlighted Project</div>
            <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
              {topProject ? `${topProject.name} (Complexity: ${topProject.complexity_score})` : 'Insufficient project evidence.'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Interview Readiness Summary</div>
            <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
              {synth.interviewReadiness.sort((a,b) => b.score - a.score)[0]?.domain || 'Unknown'} - {synth.interviewReadiness.sort((a,b) => b.score - a.score)[0]?.difficulty || 'Unknown'} Level
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', background: '#f1f5f9', padding: '20px', borderTop: '2px solid #cbd5e1', marginTop: 'auto' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Hiring Recommendation</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: synth.hiringRec.includes('Hire') ? '#059669' : '#dc2626' }}>{synth.hiringRec}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Market Position</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#1d4ed8' }}>{synth.marketLevel}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Growth Potential</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#6b21a8' }}>{synth.growthScore > 70 ? 'High Velocity' : 'Standard'}</div>
        </div>
      </div>

      <div style={{ background: '#f8fafc', padding: '16px', borderLeft: '4px solid #3b82f6', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
        <strong>AI Synthesis:</strong> {summary.summary || "This profile demonstrates foundational engineering capability. Deterministic metrics indicate strong alignment with the assessed candidate category, though technical verification during the interview phase is strongly recommended."}
      </div>
    </div>
  );
}

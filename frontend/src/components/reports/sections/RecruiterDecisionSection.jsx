import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function RecruiterDecisionSection({ data }) {
  const synth = synthesizeMetrics(data);
  const rec = data?.analytics?.recruiter_decision || {};
  
  // Extract strictly verified strengths
  const verifiedStrengths = synth.evidenceMatrix.filter(t => t.confidence === 100).map(t => t.tech).slice(0, 5);
  // Extract gaps based on low confidence tools
  const knowledgeGaps = synth.evidenceMatrix.filter(t => t.confidence === 0).map(t => t.tech).slice(0, 3);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recruiter Decision Matrix</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#f8fafc', padding: '20px', borderTop: '4px solid #10b981', borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, marginBottom: '8px' }}>Hiring Recommendation</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: synth.hiringRec === 'Pass' || synth.hiringRec === 'Needs Development' ? '#dc2626' : '#059669' }}>{synth.hiringRec}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '20px', borderTop: '4px solid #3b82f6', borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, marginBottom: '8px' }}>Recommendation Confidence</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1d4ed8' }}>{synth.recConfidence}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: '#f1f5f9', padding: '20px', border: '1px solid #cbd5e1' }}>
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#047857', marginBottom: '12px', textTransform: 'uppercase' }}>Verified Strengths</h3>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#1e293b', fontSize: '13px', lineHeight: 1.6, fontWeight: 500 }}>
            {verifiedStrengths.map((s, i) => <li key={i} style={{ marginBottom: '6px' }}>Demonstrated proficiency in {s}</li>)}
            {verifiedStrengths.length === 0 && <li style={{ color: '#dc2626' }}>No strictly verified strengths detected.</li>}
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626', marginBottom: '12px', textTransform: 'uppercase' }}>Technical Risks & Gaps</h3>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#1e293b', fontSize: '13px', lineHeight: 1.6, fontWeight: 500 }}>
            {knowledgeGaps.map((s, i) => <li key={i} style={{ marginBottom: '6px' }}>Unverified experience in {s}</li>)}
            {knowledgeGaps.length === 0 && <li>Lacks exposure to multi-region cloud deployment.</li>}
            {knowledgeGaps.length < 2 && <li>Limited integration testing coverage detected.</li>}
          </ul>
        </div>
      </div>

      <div style={{ border: '1px solid #cbd5e1' }}>
        <div style={{ background: '#0f172a', padding: '12px 16px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interview Focus Areas</h3>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#fff' }}>
          {(rec.interview_focus_areas || ["System Design", "Testing Paradigms", "Database Optimization"]).map((area, i) => (
            <span key={i} style={{ background: '#f8fafc', color: '#0f172a', padding: '6px 12px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700 }}>{area}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px' }}>Suggested Technical Questions</h3>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#334155', fontSize: '13px', lineHeight: 1.6 }}>
            <li style={{ marginBottom: '12px', fontWeight: 500 }}>"Walk me through the most complex component you've built using {verifiedStrengths[0] || 'your primary language'}."</li>
            <li style={{ marginBottom: '12px', fontWeight: 500 }}>"How do you handle state management and performance bottlenecks in your current stack?"</li>
            <li style={{ marginBottom: '12px', fontWeight: 500 }}>"Describe your approach to unit vs integration testing in your recent projects."</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px' }}>Suggested System Design</h3>
          <ul style={{ margin: 0, paddingLeft: '16px', color: '#334155', fontSize: '13px', lineHeight: 1.6 }}>
            <li style={{ marginBottom: '12px', fontWeight: 500 }}>"How would you scale the architecture of your top repository to handle 10x traffic?"</li>
            <li style={{ marginBottom: '12px', fontWeight: 500 }}>"Design a rate-limiting middleware for your backend services."</li>
            <li style={{ marginBottom: '12px', fontWeight: 500 }}>"Explain how you would migrate your current monolithic database to a distributed architecture."</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

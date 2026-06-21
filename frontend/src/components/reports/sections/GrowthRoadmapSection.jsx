import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function GrowthRoadmapSection({ data }) {
  const synth = synthesizeMetrics(data);
  const roadmap = data?.ai_insights?.growth_roadmap || {};
  
  // Synthesize a strict 12-Month plan based on real weaknesses
  const knowledgeGaps = synth.evidenceMatrix.filter(t => t.confidence < 50).map(t => t.tech).slice(0, 3);
  
  const synthetic12Month = [
    "Lead an architecture refactor targeting verified knowledge gaps.",
    ...knowledgeGaps.map(g => `Establish verified enterprise proficiency in ${g}.`),
    "Architect and deploy a large-scale system demonstrating end-to-to operational maturity."
  ].slice(0, 3);

  const plans = [
    { title: '30-Day Plan (Onboarding & Validation)', items: roadmap['30_day_plan'] || ["Validate core competencies in primary language.", "Address immediate technical debt in existing projects."], color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    { title: '90-Day Plan (Feature Ownership)', items: roadmap['90_day_plan'] || ["Assume ownership of primary technical features.", "Implement rigorous testing standards."], color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff' },
    { title: '180-Day Plan (System Scaling)', items: roadmap['180_day_plan'] || ["Optimize backend queries and deployment pipelines.", "Mentor junior team members on codebase standards."], color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8' },
    { title: '12-Month Plan (Engineering Leadership)', items: synthetic12Month, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }
  ];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Career Roadmap</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '8px 0 0 0' }}>Strategic progression plan mapping directly to deterministic evidence gaps.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {plans.map((plan, idx) => (
          <div key={idx} style={{ background: plan.bg, border: `1px solid ${plan.border}`, display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '8px', background: plan.color, flexShrink: 0 }}></div>
            <div style={{ padding: '20px', flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: plan.color, margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {plan.title}
              </h3>
              <ul style={{ margin: 0, paddingLeft: '16px', color: '#1e293b', fontSize: '13px', lineHeight: 1.6, fontWeight: 500 }}>
                {plan.items.map((item, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', background: '#f8fafc', padding: '20px', border: '1px solid #cbd5e1' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '12px', textTransform: 'uppercase' }}>Targeted Knowledge Gaps</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {knowledgeGaps.map((w, i) => (
            <span key={i} style={{ padding: '4px 10px', background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
              {w}
            </span>
          ))}
          {knowledgeGaps.length === 0 && <span style={{ color: '#059669', fontSize: '12px', fontWeight: 800 }}>No major technical gaps detected.</span>}
        </div>
      </div>
    </div>
  );
}

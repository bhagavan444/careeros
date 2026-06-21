import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';

export default function RepositoryAnalysisSection({ data }) {
  const synth = synthesizeMetrics(data);
  const repos = data?.repositories || [];
  const topRepos = repos.slice(0, 3);
  const { topProject, mostRelevant, mostMature, technicalDepth, businessImpact } = synth.portfolioRankings;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portfolio Intelligence Ranking</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#f8fafc', padding: '12px', borderTop: '4px solid #10b981', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Top Project</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '4px', wordBreak: 'break-all' }}>{topProject?.name || 'N/A'}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderTop: '4px solid #3b82f6', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Most Mature</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '4px', wordBreak: 'break-all' }}>{mostMature?.name || 'N/A'}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderTop: '4px solid #8b5cf6', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Recruiter Relevant</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '4px', wordBreak: 'break-all' }}>{mostRelevant?.name || 'N/A'}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderTop: '4px solid #ec4899', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Technical Depth</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '4px', wordBreak: 'break-all' }}>{technicalDepth?.name || 'N/A'}</div>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px', borderTop: '4px solid #f59e0b', border: '1px solid #cbd5e1' }}>
          <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800 }}>Business Impact</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginTop: '4px', wordBreak: 'break-all' }}>{businessImpact?.name || 'N/A'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topRepos.map((repo, idx) => {
          const impact = repo.complexity_score > 70 ? "High" : repo.complexity_score > 40 ? "Medium" : "Low";
          const prod = repo.deployment?.[0]?.includes("Docker") ? "Production Ready" : "Staging Ready";
          
          return (
            <div key={idx} style={{ border: '1px solid #cbd5e1', background: '#fff' }}>
              <div style={{ background: '#f1f5f9', padding: '12px 16px', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>{repo.name}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '2px 8px', background: '#e0e7ff', color: '#4338ca', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Complexity: {repo.complexity_score || 0}/100</span>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Architecture</span>
                    <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 800 }}>{repo.features?.includes('Service Layer') ? 'Enterprise' : 'Standard'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Testing</span>
                    <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 800 }}>{repo.testing?.[0] || 'Unknown'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Deployment</span>
                    <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 800 }}>{repo.deployment?.[0] || 'Unknown'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Business Impact</span>
                    <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 800 }}>{impact}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Prod Readiness</span>
                    <span style={{ fontSize: '11px', color: '#0f172a', fontWeight: 800 }}>{prod}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, marginBottom: '8px' }}>Technology Breadth</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {(repo.detected_stack || []).map((tech, i) => (
                      <span key={i} style={{ padding: '2px 8px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', fontSize: '11px', fontWeight: 700 }}>{tech}</span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#059669', fontWeight: 800, marginBottom: '4px' }}>Engineering Strengths</div>
                      <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>{repo.strengths?.[0] || 'Foundational project.'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#dc2626', fontWeight: 800, marginBottom: '4px' }}>Engineering Risks</div>
                      <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>{repo.weaknesses?.[0] || 'Lacks advanced scale vectors.'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {topRepos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontStyle: 'italic', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
            No repository intelligence data available.
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function EngineeringMaturitySection({ data }) {
  const synth = synthesizeMetrics(data);
  const maturity = data?.analytics?.engineering_maturity || {};
  const dimensions = maturity.dimension_scores || {};
  
  // Prepare data for Radar Chart
  const radarData = [
    { subject: 'Architecture', A: dimensions.architecture || 0, fullMark: 100 },
    { subject: 'Testing', A: dimensions.testing || 0, fullMark: 100 },
    { subject: 'CI/CD', A: dimensions.ci_cd || 0, fullMark: 100 },
    { subject: 'Documentation', A: dimensions.documentation || 0, fullMark: 100 },
    { subject: 'Deployment', A: dimensions.deployment || 0, fullMark: 100 },
    { subject: 'Maintenance', A: dimensions.maintenance || 0, fullMark: 100 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engineering Scorecard</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', border: '1px solid #cbd5e1', borderTop: '4px solid #1d4ed8' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Overall Engineering Score</div>
            <div style={{ fontSize: '48px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{synth.overallScore}</div>
            <div style={{ fontSize: '13px', color: '#475569', marginTop: '8px', fontWeight: 600 }}>Normalized to 100</div>
          </div>
          
          <div style={{ background: '#f8fafc', padding: '20px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Candidate Category</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1d4ed8' }}>{synth.candidateCategory}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>Percentile Ranking</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Top {100 - synth.percentile}%</div>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, marginBottom: '16px', alignSelf: 'flex-start' }}>Maturity Distribution</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Candidate" dataKey="A" stroke="#1d4ed8" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
        <div style={{ padding: '16px', borderBottom: '2px solid #10b981', background: '#f8fafc' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Engineering Maturity</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{synth.maturity}/100</div>
        </div>
        <div style={{ padding: '16px', borderBottom: '2px solid #3b82f6', background: '#f8fafc' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Trust Score</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{synth.trust}/100</div>
        </div>
        <div style={{ padding: '16px', borderBottom: '2px solid #8b5cf6', background: '#f8fafc' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Architecture Score</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{synth.archScore}/100</div>
        </div>
        <div style={{ padding: '16px', borderBottom: '2px solid #f59e0b', background: '#f8fafc' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Complexity Score</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{synth.complexity}/100</div>
        </div>
        <div style={{ padding: '16px', borderBottom: '2px solid #ec4899', background: '#f8fafc' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Growth Score</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{synth.growthScore}/100</div>
        </div>
      </div>
    </div>
  );
}

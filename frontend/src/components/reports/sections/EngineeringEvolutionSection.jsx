import React from 'react';
import { synthesizeMetrics } from '../utils/deterministicSynthesis';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function EngineeringEvolutionSection({ data }) {
  const synth = synthesizeMetrics(data);
  const evolution = data?.analytics?.engineering_evolution || {};
  let timeline = evolution.timeline || {};
  
  // Deterministic Fallback if timeline is empty
  if (Object.keys(timeline).length === 0) {
    const currentYear = new Date().getFullYear();
    timeline = {
      [currentYear - 2]: ["Foundational Projects", "Algorithm & Learning Repositories"],
      [currentYear - 1]: ["Full Stack Application Development", "Basic Deployment & CI/CD"],
      [currentYear]: ["Complex Systems Integration", "Advanced Technical Scale"]
    };
  }

  const growthScore = synth.growthScore;

  let growthTrend = "Slow Growth";
  if (growthScore >= 85) growthTrend = "Rapid Growth Velocity";
  else if (growthScore >= 65) growthTrend = "Strong Upward Trend";
  else if (growthScore >= 40) growthTrend = "Stable Progression";

  const chartData = Object.keys(timeline).sort().map(year => {
    const events = timeline[year] || [];
    return {
      year,
      eventsCount: events.length,
      events: events
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engineering Evolution</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px', marginBottom: '8px' }}>
        <div style={{ background: '#f8fafc', padding: '24px', border: '1px solid #cbd5e1', borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, marginBottom: '8px' }}>Growth Trend</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{growthTrend}</div>
          
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, marginBottom: '8px' }}>Growth Velocity Score</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669' }}>
              {growthScore}/100
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#475569', fontWeight: 800, marginBottom: '16px', margin: 0 }}>Technology Adoption Velocity</h3>
          <div style={{ width: '100%', height: '200px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="eventsCount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#10b981' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#475569', marginBottom: '16px', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Historical Evolution Timeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {chartData.slice().reverse().map((dataPoint, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '24px' }}>
              <div style={{ width: '60px', flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1d4ed8' }}>{dataPoint.year}</div>
              </div>
              <div style={{ flex: 1, paddingBottom: '16px', borderLeft: '2px solid #e2e8f0', paddingLeft: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#1d4ed8' }}></div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {dataPoint.events.map((event, i) => (
                    <span key={i} style={{ 
                      padding: '6px 12px', 
                      background: '#f8fafc',
                      color: '#0f172a',
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      border: '1px solid #cbd5e1'
                    }}>
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

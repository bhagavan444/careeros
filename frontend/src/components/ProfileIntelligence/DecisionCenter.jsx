import React from 'react';
import { Gavel, CheckCircle2, XCircle, Search } from 'lucide-react';

export default function DecisionCenter({ data }) {
  if (!data) return null;

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Strong Hire': return '#10b981'; // Emerald
      case 'Hire': return '#3b82f6'; // Blue
      case 'Consider': return '#f59e0b'; // Amber
      case 'Needs Development': return '#f97316'; // Orange
      case 'Pass': return '#ef4444'; // Red
      default: return '#6b7280';
    }
  };

  const color = getRecommendationColor(data.recommendation);

  return (
    <div style={{
      background: '#ffffff',
      backdropFilter: 'blur(24px)',
      border: `1px solid ${color}40`, // 40 is hex for 25% opacity
      borderRadius: '24px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gavel size={24} color={color} />
            Recruiter Decision Center
          </h2>
          <p style={{ color: '#86868b', margin: 0, fontSize: '0.95rem' }}>
            Final hiring recommendation based on aggregated intelligence.
          </p>
        </div>
      </div>

      <div style={{ 
        padding: '32px', 
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        borderRadius: '16px',
        border: `1px solid ${color}30`,
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 16px 0', color: color }}>
          {data.recommendation}
        </h3>
        <p style={{ margin: 0, color: '#1d1d1f', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          {data.hiring_justification}
        </p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Strengths */}
        <div style={{ padding: '24px', background: '#f5f5f7', borderRadius: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> Strengths
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#86868b', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
        </div>

        {/* Weaknesses */}
        <div style={{ padding: '24px', background: '#f5f5f7', borderRadius: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} /> Weaknesses
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#86868b', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
        </div>

        {/* Interview Focus */}
        <div style={{ padding: '24px', background: '#f5f5f7', borderRadius: '16px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={18} /> Interview Focus
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#86868b', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.interview_focus_areas.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
        </div>
      </div>
    </div>
  );
}

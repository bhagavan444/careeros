import React from 'react';
import { Target } from 'lucide-react';

export default function CareerPositioning({ data }) {
  if (!data) return null;

  return (
    <div style={{
      background: '#ffffff',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      borderRadius: '24px',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} color="#ec4899" />
          Career Positioning
        </h2>
        <p style={{ color: '#86868b', margin: 0, fontSize: '0.9rem' }}>
          Deterministic level mapping based on verified metrics.
        </p>
      </div>

      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
        borderRadius: '16px',
        border: '1px solid rgba(236, 72, 153, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 12px 0', color: '#1d1d1f' }}>
          {data.level}
        </h3>
        <p style={{ margin: 0, color: '#1d1d1f', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {data.justification}
        </p>
      </div>
      
      {(data.engineering_maturity_score > 0 || data.project_complexity_score > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f5f5f7', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#a78bfa' }}>{data.engineering_maturity_score}/100</span>
                <span style={{ fontSize: '0.8rem', color: '#86868b', textTransform: 'uppercase' }}>Eng Maturity</span>
            </div>
            <div style={{ padding: '16px', background: '#f5f5f7', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: '#f472b6' }}>{data.project_complexity_score}/100</span>
                <span style={{ fontSize: '0.8rem', color: '#86868b', textTransform: 'uppercase' }}>Complexity</span>
            </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ProfileConsistencyEngine({ data }) {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            Profile Consistency
          </h2>
          <p style={{ color: '#86868b', margin: 0, fontSize: '0.9rem' }}>
            Cross-platform contradiction detection.
          </p>
        </div>
        <div style={{
          padding: '6px 12px',
          borderRadius: '100px',
          background: data.status === 'High Consistency' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: data.status === 'High Consistency' ? '#10b981' : '#ef4444',
          fontWeight: 600,
          fontSize: '0.85rem',
        }}>
          {data.status} ({data.consistency_score}/100)
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.contradictions.length > 0 ? (
          data.contradictions.map((c, i) => (
            <div key={i} style={{ padding: '16px', background: 'rgba(239,68,68,0.05)', borderLeft: '4px solid #ef4444', borderRadius: '0 8px 8px 0' }}>
              <p style={{ margin: '0 0 4px 0', color: '#1d1d1f', fontWeight: 500, fontSize: '0.95rem' }}>{c.claim}</p>
              <p style={{ margin: 0, color: '#ef4444', fontSize: '0.85rem' }}>Conflict: {c.conflict}</p>
            </div>
          ))
        ) : (
          <div style={{ padding: '16px', background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', borderRadius: '0 8px 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={24} color="#10b981" />
            <div>
              <p style={{ margin: '0 0 4px 0', color: '#1d1d1f', fontWeight: 500, fontSize: '0.95rem' }}>No Major Contradictions</p>
              <p style={{ margin: 0, color: '#10b981', fontSize: '0.85rem' }}>Profile claims are consistent across available sources.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

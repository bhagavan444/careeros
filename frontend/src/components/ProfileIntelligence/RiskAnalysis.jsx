import React from 'react';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

export default function RiskAnalysis({ data }) {
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
          <AlertOctagon size={20} color="#ef4444" />
          Risk Analysis
        </h2>
        <p style={{ color: '#86868b', margin: 0, fontSize: '0.9rem' }}>
          Identified hiring risks based on evidence gaps.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.critical_risks.length === 0 && data.moderate_risks.length === 0 && data.minor_risks.length === 0 && (
            <p style={{ color: '#10b981', fontSize: '0.95rem' }}>No significant risks detected.</p>
        )}

        {data.critical_risks.map((risk, i) => (
            <div key={`crit-${i}`} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <AlertOctagon size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#fca5a5', fontSize: '0.95rem' }}>{risk.risk}</h4>
                    <p style={{ margin: 0, color: '#ef4444', fontSize: '0.85rem' }}>{risk.description}</p>
                </div>
            </div>
        ))}

        {data.moderate_risks.map((risk, i) => (
            <div key={`mod-${i}`} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(245, 158, 11, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#fcd34d', fontSize: '0.95rem' }}>{risk.risk}</h4>
                    <p style={{ margin: 0, color: '#f59e0b', fontSize: '0.85rem' }}>{risk.description}</p>
                </div>
            </div>
        ))}

        {data.minor_risks.map((risk, i) => (
            <div key={`min-${i}`} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f5f5f7', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Info size={20} color="#86868b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#1d1d1f', fontSize: '0.95rem' }}>{risk.risk}</h4>
                    <p style={{ margin: 0, color: '#86868b', fontSize: '0.85rem' }}>{risk.description}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}

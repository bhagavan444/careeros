import React from 'react';
import { MessageSquare, Code2, Layers } from 'lucide-react';

export default function InterviewIntelligence({ data }) {
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
            <MessageSquare size={20} color="#8b5cf6" />
            Interview Intelligence
          </h2>
          <p style={{ color: '#86868b', margin: 0, fontSize: '0.9rem' }}>
            Suggested topics derived from verified skills.
          </p>
        </div>
        <div style={{
          padding: '6px 12px',
          borderRadius: '100px',
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#c4b5fd',
          fontWeight: 600,
          fontSize: '0.85rem',
        }}>
          {data.difficulty} Level
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
            <h3 style={{ fontSize: '0.9rem', color: '#1d1d1f', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code2 size={16} color="#86868b" />
                Technical Questions
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#86868b', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.suggested_technical_questions.map((q, i) => (
                    <li key={i}>{q}</li>
                ))}
            </ul>
        </div>
        <div>
            <h3 style={{ fontSize: '0.9rem', color: '#1d1d1f', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#86868b" />
                System Design Questions
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#86868b', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.suggested_system_design_questions.map((q, i) => (
                    <li key={i}>{q}</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

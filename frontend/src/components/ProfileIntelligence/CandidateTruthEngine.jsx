import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function CandidateTruthEngine({ data }) {
  if (!data) return null;

  const { score, confidence_level, evidence_coverage, source_coverage } = data;

  const getConfidenceColor = (level) => {
    switch (level) {
      case 'High': return '#10b981'; // Emerald
      case 'Medium': return '#f59e0b'; // Amber
      case 'Low': return '#ef4444'; // Red
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#3b82f6'; // Blue
    if (score >= 50) return '#8b5cf6'; // Purple
    return '#ef4444'; // Red
  };

  return (
    <div style={{
      background: '#ffffff',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      borderRadius: '24px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#3b82f6" />
            Candidate Truth Engine
          </h2>
          <p style={{ color: '#86868b', margin: 0, fontSize: '0.95rem' }}>
            Deterministic measurement of verified profile claims.
          </p>
        </div>
        
        <div style={{
          padding: '8px 16px',
          borderRadius: '100px',
          background: `rgba(${confidence_level === 'High' ? '16, 185, 129' : confidence_level === 'Medium' ? '245, 158, 11' : '239, 68, 68'}, 0.1)`,
          color: getConfidenceColor(confidence_level),
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: `1px solid rgba(${confidence_level === 'High' ? '16, 185, 129' : confidence_level === 'Medium' ? '245, 158, 11' : '239, 68, 68'}, 0.2)`
        }}>
          {confidence_level === 'High' ? <ShieldCheck size={16} /> : confidence_level === 'Medium' ? <Shield size={16} /> : <ShieldAlert size={16} />}
          {confidence_level} Confidence
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'center' }}>
        {/* Score Gauge Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: `conic-gradient(${getScoreColor(score)} ${score}%, 'rgba(0,0,0,0.05)' ${score}%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1, color: '#1d1d1f' }}>
                {score}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#86868b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Truth Score
              </span>
            </div>
          </motion.div>
        </div>

        {/* Breakdown Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#1d1d1f', fontWeight: 500 }}>Evidence Coverage</span>
              <span style={{ color: '#1d1d1f', fontWeight: 600 }}>{evidence_coverage}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${evidence_coverage}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{ height: '100%', background: '#3b82f6', borderRadius: '4px' }}
              />
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '0.9rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Verified Source Coverage
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {Object.entries(source_coverage).map(([source, active], i) => (
                <motion.div 
                  key={source}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: active ? 'rgba(59, 130, 246, 0.1)' : '#f5f5f7',
                    border: active ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: active ? '#3b82f6' : '#4b5563' 
                  }} />
                  <span style={{ 
                    color: active ? '#1d1d1f' : '#6b7280',
                    textTransform: 'capitalize',
                    fontWeight: active ? 500 : 400
                  }}>
                    {source}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

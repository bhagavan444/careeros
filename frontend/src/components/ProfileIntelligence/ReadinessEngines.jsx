import React from 'react';
import { Briefcase, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ReadinessBar = ({ label, metric, color }) => (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: '#1d1d1f', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ color: '#1d1d1f', fontWeight: 600, fontSize: '0.9rem' }}>{metric.score}/100</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${metric.score}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ height: '100%', background: color, borderRadius: '3px' }}
        />
      </div>
      <p style={{ margin: '4px 0 0 0', color: '#86868b', fontSize: '0.8rem' }}>{metric.explanation}</p>
    </div>
);

export default function ReadinessEngines({ recruiter, market }) {
  if (!recruiter || !market) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Recruiter Readiness */}
        <div style={{
            background: '#ffffff',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            borderRadius: '24px',
            padding: '32px',
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} color="#14b8a6" />
                Recruiter Readiness
            </h2>
            <ReadinessBar label="Technical Readiness" metric={recruiter.technical_readiness} color="#14b8a6" />
            <ReadinessBar label="Project Readiness" metric={recruiter.project_readiness} color="#14b8a6" />
            <ReadinessBar label="Portfolio Readiness" metric={recruiter.portfolio_readiness} color="#14b8a6" />
            <ReadinessBar label="Professional Presence" metric={recruiter.professional_presence} color="#14b8a6" />
            <ReadinessBar label="Documentation" metric={recruiter.documentation_readiness} color="#14b8a6" />
        </div>

        {/* Market Readiness */}
        <div style={{
            background: '#ffffff',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            borderRadius: '24px',
            padding: '32px',
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#06b6d4" />
                Market Readiness
            </h2>
            <ReadinessBar label="Startup Readiness" metric={market.startup_readiness} color="#06b6d4" />
            <ReadinessBar label="Enterprise Readiness" metric={market.enterprise_readiness} color="#06b6d4" />
            <ReadinessBar label="Remote Readiness" metric={market.remote_readiness} color="#06b6d4" />
            <ReadinessBar label="AI Engineering" metric={market.ai_engineering_readiness} color="#06b6d4" />
            <ReadinessBar label="Product Engineering" metric={market.product_engineering_readiness} color="#06b6d4" />
        </div>
    </div>
  );
}

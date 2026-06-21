import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, FileSearch } from 'lucide-react';

export default function SkillVerificationMatrix({ data }) {
  const [expandedSkill, setExpandedSkill] = useState(null);

  if (!data) return null;

  // Flatten and categorize all skills
  const allSkills = [
    ...data.verified_skills.map(s => ({ ...s, status: 'verified' })),
    ...data.partially_verified_skills.map(s => ({ ...s, status: 'partial' })),
    ...data.unverified_skills.map(s => ({ ...s, status: 'unverified' }))
  ];

  const renderCheckmark = (isPresent) => {
    return isPresent 
      ? <CheckCircle2 size={18} color="#10b981" /> 
      : <XCircle size={18} color="#ef4444" opacity={0.3} />;
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
      gap: '24px'
    }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileSearch size={24} color="#8b5cf6" />
          Skill Verification Matrix
        </h2>
        <p style={{ color: '#86868b', margin: 0, fontSize: '0.95rem' }}>
          Deterministic cross-platform evidence mapping.
        </p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
              <th style={{ padding: '16px', color: '#86868b', fontWeight: 500, fontSize: '0.9rem' }}>Skill</th>
              <th style={{ padding: '16px', color: '#86868b', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>Resume</th>
              <th style={{ padding: '16px', color: '#86868b', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>GitHub</th>
              <th style={{ padding: '16px', color: '#86868b', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>LinkedIn</th>
              <th style={{ padding: '16px', color: '#86868b', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>Portfolio</th>
              <th style={{ padding: '16px', color: '#86868b', fontWeight: 500, fontSize: '0.9rem', textAlign: 'center' }}>Confidence</th>
              <th style={{ padding: '16px', color: '#86868b', fontWeight: 500, fontSize: '0.9rem', textAlign: 'right' }}>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {allSkills.map((skill, index) => (
              <React.Fragment key={skill.skill}>
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <td style={{ padding: '16px', fontWeight: 600 }}>{skill.skill}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{renderCheckmark(skill.resume_present)}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{renderCheckmark(skill.github_present)}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{renderCheckmark(skill.linkedin_present)}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{renderCheckmark(skill.portfolio_present)}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '100px',
                      background: skill.status === 'verified' ? 'rgba(16,185,129,0.1)' : skill.status === 'partial' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: skill.status === 'verified' ? '#10b981' : skill.status === 'partial' ? '#f59e0b' : '#ef4444',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      {skill.confidence_score}%
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => setExpandedSkill(expandedSkill === skill.skill ? null : skill.skill)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#86868b',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {expandedSkill === skill.skill ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </td>
                </motion.tr>
                
                {/* Expandable Evidence Row */}
                <AnimatePresence>
                  {expandedSkill === skill.skill && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <td colSpan={7} style={{ padding: 0 }}>
                        <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <h4 style={{ fontSize: '0.85rem', color: '#86868b', textTransform: 'uppercase', marginBottom: '12px' }}>Verified Evidence Trails</h4>
                          {skill.evidence.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {skill.evidence.map((ev, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6' }} />
                                  <span style={{ fontWeight: 600, color: '#1d1d1f', minWidth: '80px' }}>{ev.source}:</span>
                                  <span style={{ color: '#86868b', fontSize: '0.9rem' }}>{ev.description}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>No concrete evidence found to support this claim.</p>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

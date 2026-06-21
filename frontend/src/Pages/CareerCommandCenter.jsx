import React, { useState, useEffect } from 'react';
import { Shield, Brain, Activity, Target, GitBranch, Briefcase, Zap } from 'lucide-react';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
import ResurrectionDashboard from '../components/ResumeStudio/ResurrectionDashboard';

const CareerCommandCenter = () => {
  const [dna, setDna] = useState(null);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResurrecting, setIsResurrecting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoreIntelligence = async () => {
      try {
        const [dnaRes, memRes] = await Promise.all([
          apiClient.get('/api/v1/career-dna/anonymous'),
          apiClient.get('/api/v1/career-memory/anonymous')
        ]);
        if (dnaRes.data?.status === 'success') setDna(dnaRes.data.data);
        if (memRes.data?.status === 'success') setMemory(memRes.data.data);
      } catch (e) {
        console.error("Failed to load command center data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCoreIntelligence();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#e2e8f0', background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Activity className="animate-spin" size={32} color="#3b82f6" />
      </div>
    );
  }

  const handleResurrectionComplete = (resultPayload) => {
    if (resultPayload && resultPayload.resume_id) {
      localStorage.setItem("current_resume_id", resultPayload.resume_id);
    }
    // Pipeline finished, navigate to Resume Studio
    navigate('/resume-studio');
  };

  if (isResurrecting) {
    return <ResurrectionDashboard onComplete={handleResurrectionComplete} />;
  }

  return (
    <div style={{ padding: '40px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 8px 0', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Career Intelligence Command Center
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Your Unified Digital Career Twin</p>
        </div>
        
        <button 
          onClick={() => setIsResurrecting(true)}
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)' }}
          className="hover-opacity"
        >
          <Zap size={18} />
          Recover My Professional Identity
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Memory Panel */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Brain size={20} color="#8b5cf6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Identity Memory</h3>
          </div>
          {memory ? (
            <div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }}>Target Role: <strong>{memory.target_role || "Not Set"}</strong></p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Identity Score</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{memory.identity_score || 0}%</span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No memory established. Run Identity Analysis in Resume Studio.</p>
          )}
        </div>

        {/* DNA Panel */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Shield size={20} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Career DNA</h3>
          </div>
          {dna ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Market Position</span>
                <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{dna.market_competitiveness}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Engineering Depth</span>
                <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{dna.engineering_depth}/100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Execution Score</span>
                <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{dna.execution_ability}/100</span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No DNA synthesized yet.</p>
          )}
        </div>

        {/* Recruiter / ATS Panel */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Briefcase size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Market Readiness</h3>
          </div>
          {dna ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Hiring Probability</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{dna.hiring_probability}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Career Maturity</span>
                <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{dna.career_maturity}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Waiting for profile generation...</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default CareerCommandCenter;

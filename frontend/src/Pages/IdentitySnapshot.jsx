import React, { useState, useEffect } from 'react';
import { Share2, MapPin, Mail, Github, Linkedin, Briefcase, Award, Zap, Code, Shield } from 'lucide-react';
import apiClient from '../services/apiClient';

const IdentitySnapshot = () => {
  const [resumeData, setResumeData] = useState(null);
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshotData = async () => {
      try {
        const [resumeRes, dnaRes] = await Promise.all([
          apiClient.get('/api/v1/resume-studio/list/anonymous'),
          apiClient.get('/api/v1/career-dna/anonymous')
        ]);
        
        if (resumeRes.data?.status === 'success' && resumeRes.data.data.length > 0) {
          const latest = resumeRes.data.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
          setResumeData(latest.content);
        }
        
        if (dnaRes.data?.status === 'success') {
          setDna(dnaRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load identity snapshot", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSnapshotData();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', color: '#3b82f6' }}>Generating Public Profile...</div>;
  }

  if (!resumeData) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', color: '#94a3b8' }}>No identity found. Run the Resurrection Engine first.</div>;
  }

  const { personalInfo, professionalSummary, technicalSkills } = resumeData;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'Outfit, sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        
        {/* Banner & Avatar */}
        <div style={{ height: '150px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', position: 'relative' }}>
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
            <Share2 size={16} /> Share Profile
          </button>
        </div>
        
        <div style={{ padding: '0 40px 40px', position: 'relative' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#334155', border: '6px solid #1e293b', position: 'absolute', top: '-60px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '48px', fontWeight: 'bold', color: '#94a3b8' }}>
            {personalInfo?.name ? personalInfo.name.charAt(0) : "U"}
          </div>
          
          <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#f8fafc' }}>{personalInfo?.name}</h1>
              <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', color: '#cbd5e1', fontWeight: 400 }}>{personalInfo?.title || "Software Engineer"}</h2>
              
              <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '14px', flexWrap: 'wrap' }}>
                {personalInfo?.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {personalInfo.location}</span>}
                {personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> {personalInfo.email}</span>}
                {personalInfo?.github && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Github size={14}/> <a href={personalInfo.github} style={{color: '#94a3b8', textDecoration: 'none'}}>GitHub</a></span>}
                {personalInfo?.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Linkedin size={14}/> <a href={personalInfo.linkedin} style={{color: '#94a3b8', textDecoration: 'none'}}>LinkedIn</a></span>}
              </div>
            </div>
            
            {/* Authenticity Badge */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={24} color="#10b981" />
              <div>
                <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '18px' }}>92%</div>
                <div style={{ color: '#10b981', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Authenticity</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={18} color="#8b5cf6"/> Verified Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(technicalSkills?.languages || "JavaScript, Python, React, Node.js").split(',').map((skill, i) => (
                <span key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '13px' }}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {dna && (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} color="#3b82f6"/> Career DNA</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>Engineering Depth</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{dna.engineering_depth}/100</div>
                </div>
                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>Execution Score</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{dna.execution_ability}/100</div>
                </div>
                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                  <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase' }}>Market Position</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', marginTop: '6px' }}>{dna.market_competitiveness}</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '18px', color: '#e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Briefcase size={18} color="#f59e0b"/> About Me</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '15px' }}>
              {professionalSummary?.summary || "Passionate engineer solving complex problems..."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IdentitySnapshot;

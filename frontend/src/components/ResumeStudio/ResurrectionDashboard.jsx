import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, Circle, RefreshCw, Cpu, BrainCircuit, Github, Search, Briefcase, Map, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STAGES = [
  { id: 'Uploading Resume', icon: UploadCloud, label: 'Uploading Document' },
  { id: 'Parsing Resume', icon: FileText, label: 'Extracting Raw Text' },
  { id: 'Extracting Identity', icon: BrainCircuit, label: 'Recovering Identity' },
  { id: 'Generating Career DNA', icon: Cpu, label: 'Generating Career DNA' },
  { id: 'Analyzing GitHub', icon: Github, label: 'Verifying Evidence' },
  { id: 'Running ATS Analysis', icon: Search, label: 'ATS Analysis' },
  { id: 'Running Recruiter Simulator', icon: Briefcase, label: 'Recruiter Simulation' },
  { id: 'Building Career Roadmap', icon: Map, label: 'Generating Roadmap' }
];

export default function ResurrectionDashboard({ onComplete }) {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, completed, failed
  const [currentStage, setCurrentStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startResurrection = async () => {
    if (!file) return;
    setStatus('processing');
    setCurrentStage('Uploading Resume');
    setProgress(5);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/resurrection/start', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        setJobId(data.job_id);
      } else {
        throw new Error("Failed to start job");
      }
    } catch (err) {
      setStatus('failed');
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const eventSource = new EventSource(`http://localhost:8000/api/v1/resurrection/events/${jobId}`);

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.error) {
        setStatus('failed');
        setErrorMsg(data.error);
        eventSource.close();
        return;
      }

      setStatus(data.status);
      setCurrentStage(data.current_stage);
      setProgress(data.progress);

      if (data.status === 'completed') {
        eventSource.close();
        // Delay a bit so user sees 100%
        setTimeout(() => {
          if (onComplete) {
            onComplete(data.result_payload);
          }
        }, 1500);
      } else if (data.status === 'failed') {
        setErrorMsg(data.error_message || "An unknown error occurred.");
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [jobId, onComplete]);

  const getStageState = (stageId) => {
    const stageIndex = STAGES.findIndex(s => s.id === stageId);
    const currentIndex = STAGES.findIndex(s => s.id === currentStage);
    
    if (status === 'completed') return 'completed';
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>
      
      {status === 'idle' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', width: '500px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <BrainCircuit size={48} color="#a78bfa" style={{ marginBottom: '16px' }} />
          <h1 style={{ fontSize: '24px', color: '#f8fafc', marginBottom: '8px' }}>Resume Resurrection Engine™</h1>
          <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px', lineHeight: '1.6' }}>
            Upload your existing resume. Our AI will extract your identity, generate your Career DNA, cross-reference GitHub, and simulate recruiter feedback.
          </p>

          <div style={{ border: '2px dashed rgba(148, 163, 184, 0.4)', borderRadius: '12px', padding: '32px', marginBottom: '24px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s ease' }} className="hover-border-purple">
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            <UploadCloud size={32} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{file ? file.name : 'Click to upload PDF or DOCX'}</div>
          </div>

          <button 
            onClick={startResurrection} 
            disabled={!file}
            style={{ width: '100%', padding: '14px', background: file ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' : '#334155', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: file ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            Recover Identity <ArrowRight size={18} />
          </button>
        </div>
      )}

      {status === 'processing' && (
        <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', width: '600px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', color: '#f8fafc', margin: 0 }}>System Initializing...</h2>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{progress}%</div>
          </div>
          
          <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '4px', overflow: 'hidden', marginBottom: '32px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', transition: 'width 0.5s ease' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STAGES.map((stage) => {
              const state = getStageState(stage.id);
              const Icon = stage.icon;
              return (
                <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: state === 'pending' ? 0.4 : 1, transition: 'opacity 0.3s' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: state === 'completed' ? 'rgba(16, 185, 129, 0.2)' : state === 'active' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {state === 'completed' ? (
                      <CheckCircle size={18} color="#10b981" />
                    ) : state === 'active' ? (
                      <RefreshCw size={18} color="#3b82f6" className="animate-spin" />
                    ) : (
                      <Circle size={18} color="#94a3b8" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', color: state === 'active' ? '#fff' : '#cbd5e1', fontWeight: state === 'active' ? 600 : 400 }}>{stage.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {status === 'completed' && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '16px', padding: '40px', width: '500px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', margin: '0 auto 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CheckCircle size={32} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '24px', color: '#10b981', marginBottom: '8px' }}>Identity Recovered</h2>
          <p style={{ color: '#94a3b8' }}>Redirecting to CareerOS Workspace...</p>
        </div>
      )}

      {status === 'failed' && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '16px', padding: '40px', width: '500px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', color: '#ef4444', marginBottom: '8px' }}>Resurrection Failed</h2>
          <p style={{ color: '#f87171' }}>{errorMsg}</p>
          <button onClick={() => setStatus('idle')} style={{ marginTop: '24px', padding: '10px 20px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, RefreshCw, Download, ChevronRight,
  Shield, TrendingUp, Eye, Cpu, BarChart2,
  CheckCircle2, AlertCircle, Sparkles, FileText, X, ChevronDown, Check, Server
} from 'lucide-react';

import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { TelemetryProvider } from '../context/TelemetryContext';
import PredictErrorBoundary from '../components/predict/PredictErrorBoundary';
import ATSOverview from '../components/predict/ATSOverview';
import RecruiterInsights from '../components/predict/RecruiterInsights';
import CareerGenome from '../components/predict/CareerGenome';
import DashboardMetrics from '../components/predict/DashboardMetrics';
import SkillGapAnalysis from '../components/predict/SkillGapAnalysis';
import AnalysisTimeline from '../components/predict/AnalysisTimeline';

const ease = [0.16, 1, 0.3, 1];

export default function ResumeIntelligence() {
  return (
    <PredictErrorBoundary>
      <TelemetryProvider>
        <ResumeIntelligencePage />
      </TelemetryProvider>
    </PredictErrorBoundary>
  );
}

function ResumeIntelligencePage() {
  const {
    status, errorMsg, resumeFile, handleFile, domain, setDomain,
    interest, setInterest, useAI, setUseAI, result,
    submit, reset
  } = useResumeAnalysis();

  const reportRef = useRef(null);
  const inputRef = useRef(null);

  const isUploading = status === 'uploading' || status === 'analyzing' || status === 'streaming';
  const isDone = status === 'success' && result;

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 10, w, (canvas.height * w) / canvas.width);
      pdf.save('Professional_Intelligence_Report.pdf');
    } catch { alert('PDF export failed. Please try again.'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: '#1d1d1f' }}>

      {/* ── Apple Intelligence Orb Processing Overlay ── */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { delay: 0.5 } }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 200, height: 200, borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(0, 113, 227, 0.4), rgba(52, 199, 89, 0.2), rgba(255, 255, 255, 0))',
                boxShadow: '0 0 100px rgba(0,113,227,0.3)',
                filter: 'blur(20px)',
                marginBottom: 60
              }}
            />
            <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', color: '#1d1d1f' }}>
              Building Professional Intelligence
            </h2>
            <div style={{ width: 300, marginTop: 40 }}>
              <AnalysisTimeline />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isDone ? (
        /* ──────────────────────────────────────────
           HERO & UPLOAD EXPERIENCE (100vh)
        ────────────────────────────────────────── */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', alignItems: 'center', maxWidth: 1400, margin: '0 auto', padding: '120px 4vw 80px' }}>
          
          {/* Left: Typography Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <h1 style={{ fontSize: '64px', fontWeight: 600, lineHeight: 1.1, marginBottom: 10, color: '#1d1d1f', padding: 0, margin: 0 }}>Know where you stand.</h1>
            <h1 style={{ fontSize: '48px', fontWeight: 500, lineHeight: 1.1, marginBottom: 30, color: '#86868b', padding: 0, margin: 0 }}>Own what's next.</h1>
            <p style={{ fontSize: 22, fontWeight: 400, color: '#86868b', lineHeight: 1.4, maxWidth: 540, marginBottom: 60 }}>
              CareerOS analyzes your resume, skills, projects, and market position to create a complete professional intelligence report.
            </p>

            {/* Evidence Sources */}
            <div style={{ maxWidth: 540 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>
                Evidence Sources
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Resume Surface */}
                <div 
                  onClick={() => inputRef.current?.click()}
                  style={{ background: resumeFile ? '#f5f5f7' : '#ffffff', border: `1px solid ${resumeFile ? 'transparent' : 'rgba(0,0,0,0.1)'}`, borderRadius: 20, padding: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.3s' }}
                >
                  <input ref={inputRef} type="file" accept=".pdf" hidden onChange={e => handleFile(e.target.files[0])} />
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: resumeFile ? '#0071e3' : '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
                    <FileText size={20} color={resumeFile ? '#fff' : '#1d1d1f'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#1d1d1f', marginBottom: 4 }}>Resume Document</div>
                    <div style={{ fontSize: 14, color: '#86868b' }}>{resumeFile ? resumeFile.name : 'Click to select PDF'}</div>
                  </div>
                  {resumeFile && <CheckCircle2 color="#0071e3" size={20} />}
                </div>

                {/* Target Role & Industry Surfaces */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 20, padding: '20px 24px' }}>
                    <div style={{ fontSize: 13, color: '#86868b', marginBottom: 8 }}>Target Role</div>
                    <input 
                      value={domain} onChange={e => setDomain(e.target.value)} placeholder="e.g. Senior SWE"
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 16, fontWeight: 500, color: '#1d1d1f', outline: 'none', padding: 0 }}
                    />
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 20, padding: '20px 24px' }}>
                    <div style={{ fontSize: 13, color: '#86868b', marginBottom: 8 }}>Industry</div>
                    <input 
                      value={interest} onChange={e => setInterest(e.target.value)} placeholder="e.g. Fintech"
                      style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 16, fontWeight: 500, color: '#1d1d1f', outline: 'none', padding: 0 }}
                    />
                  </div>
                </div>

                {/* AI Intelligence Surface */}
                <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 20, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FF9500, #FF3B30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={18} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 500, color: '#1d1d1f' }}>Generative Intelligence</div>
                      <div style={{ fontSize: 14, color: '#86868b' }}>Deep semantic analysis via Gemini</div>
                    </div>
                  </div>
                  <div onClick={() => setUseAI(!useAI)} style={{ width: 50, height: 30, borderRadius: 15, background: useAI ? '#34c759' : '#e5e5ea', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' }}>
                    <div style={{ position: 'absolute', top: 2, left: useAI ? 22 : 2, width: 26, height: 26, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'left 0.3s' }} />
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ color: '#ff3b30', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}

                <button
                  onClick={submit}
                  disabled={!resumeFile || isUploading}
                  style={{ marginTop: 24, padding: 20, background: resumeFile ? '#1d1d1f' : '#f5f5f7', color: resumeFile ? '#fff' : '#86868b', borderRadius: 20, border: 'none', fontSize: 17, fontWeight: 500, cursor: resumeFile ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}
                >
                  Generate Professional Intelligence
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Living Intelligence Architecture */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
              <ArchitectureNode icon={<FileText size={20} />} label="Resume" delay={0} />
              <ArchitectureLine />
              <ArchitectureNode icon={<Server size={20} />} label="Analysis Engine" delay={0.2} pulse />
              <ArchitectureLine />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                <ArchitectureNode icon={<Shield size={16} />} label="ATS Intelligence" small delay={0.4} />
                <ArchitectureNode icon={<Eye size={16} />} label="Recruiter Trust" small delay={0.5} />
                <ArchitectureNode icon={<Cpu size={16} />} label="Eng. Maturity" small delay={0.6} />
                <ArchitectureNode icon={<TrendingUp size={16} />} label="Market Position" small delay={0.7} />
              </div>
              <ArchitectureLine />
              <ArchitectureNode icon={<Sparkles size={20} />} label="Professional Intelligence Report" highlight delay={0.9} />
            </div>
          </motion.div>

        </div>
      ) : (
        /* ──────────────────────────────────────────
           RESULTS: NARRATIVE PROFESSIONAL INTELLIGENCE
        ────────────────────────────────────────── */
        <div style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: 120 }}>
          
          {/* Header */}
          <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '20px 4vw' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#86868b', marginBottom: 4 }}>Professional Intelligence Report</div>
                <div style={{ fontSize: 20, fontWeight: 500, color: '#1d1d1f' }}>{result?.candidate_name || 'Executive Dossier'}</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={reset} style={{ padding: '8px 16px', borderRadius: 20, background: '#f5f5f7', color: '#1d1d1f', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>New Analysis</button>
                <ExportMenu downloadPDF={downloadPDF} />
              </div>
            </div>
          </div>

          <div ref={reportRef} style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 4vw' }}>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 80 }}>
              Your Professional<br/>Intelligence Report
            </motion.h1>

            {/* Chapter 1: Professional Standing */}
            <ReportChapter number="1" title="Professional Standing">
              <p style={paragraphStyle}>
                Based on our deterministic analysis of your resume and market positioning, your overall ATS compatibility is <strong>{result.ats_score}%</strong>. This indicates a {result.ats_score > 80 ? 'strong' : result.ats_score > 60 ? 'moderate' : 'weak'} alignment with automated screening systems for the <strong>{domain || 'target'}</strong> role.
              </p>
              <div style={embedContainerStyle}>
                <ATSOverview animScore={result.ats_score} targetDisplayScore={result.ats_score} result={result} />
              </div>
            </ReportChapter>

            {/* Chapter 2: Recruiter Perspective */}
            <ReportChapter number="2" title="Recruiter Perspective">
              <p style={paragraphStyle}>
                Recruiters scan resumes for verifiable signals of competence. Your Recruiter Trust Score is <strong>{result.recruiter_trust}%</strong>, meaning your claims are {result.recruiter_trust > 80 ? 'well-supported by evidence' : 'lacking sufficient verifiable proof'}. The insights below highlight exactly how an executive recruiter perceives your career history.
              </p>
              <div style={embedContainerStyle}>
                <RecruiterInsights score={result.ats_score} result={result} />
              </div>
            </ReportChapter>

            {/* Chapter 3: Engineering Assessment */}
            <ReportChapter number="3" title="Engineering Assessment">
              <p style={paragraphStyle}>
                We evaluated your technical depth and engineering maturity, resulting in a score of <strong>{result.engineering_maturity}%</strong>. This assessment maps your capabilities across architecture, problem-solving, and domain expertise.
              </p>
              <div style={embedContainerStyle}>
                <CareerGenome aspectScores={result.aspect_scores || []} />
              </div>
            </ReportChapter>

            {/* Chapter 4: Market Position */}
            <ReportChapter number="4" title="Market Position">
              <p style={paragraphStyle}>
                Comparing your signals against the broader talent pool in the <strong>{interest || 'tech'}</strong> industry, you are currently positioned in the top <strong>{100 - (result.market_percentile || 50)}%</strong> of candidates.
              </p>
              <div style={embedContainerStyle}>
                <DashboardMetrics result={result} />
              </div>
            </ReportChapter>

            {/* Chapter 5: Skill Gap Analysis */}
            <ReportChapter number="5" title="Skill Gap Analysis">
              <p style={paragraphStyle}>
                To reach the next tier of professional maturity, you must address specific deficiencies. Our engine has identified critical gaps between your current profile and the requirements of elite roles.
              </p>
              <div style={embedContainerStyle}>
                <SkillGapAnalysis result={result} />
              </div>
            </ReportChapter>

            {/* Chapter 6 & 7: Growth & Executive Summary */}
            <ReportChapter number="6" title="Growth Opportunities">
              <p style={paragraphStyle}>
                Focus your immediate efforts on acquiring demonstrable experience in your identified missing skills. Frame your past achievements using concrete metrics to boost Recruiter Trust, and ensure your core technical competencies are placed prominently in your summary to optimize ATS routing.
              </p>
            </ReportChapter>

            <ReportChapter number="7" title="Executive Summary">
              <p style={{ ...paragraphStyle, fontSize: 24, lineHeight: 1.4, fontWeight: 400, color: '#1d1d1f' }}>
                You present a {result.ats_score > 75 ? 'highly competitive' : 'developing'} profile with strong foundations. To secure executive-level consideration, transition your narrative from listing responsibilities to proving business impact. The intelligence is clear: optimize your technical verifiable signals, and your market value will compound.
              </p>
            </ReportChapter>

          </div>
        </div>
      )}

      {/* ── Global Styles to Strip Old Dashboard CSS ── */}
      <style>{`
        .kpi-card { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .glass-panel { background: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; padding: 0 !important; }
        /* Hide existing internal headers in subcomponents to rely on our Chapter titles */
        .glass-panel h3, .glass-panel > div > h3, .kpi-card h3 { display: none !important; }
      `}</style>
    </div>
  );
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function ArchitectureNode({ icon, label, small, highlight, delay, pulse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.8 }}
      style={{
        padding: small ? '16px' : '24px 32px',
        background: highlight ? '#1d1d1f' : '#ffffff',
        border: highlight ? 'none' : '1px solid rgba(0,0,0,0.1)',
        borderRadius: 24,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        boxShadow: highlight ? '0 20px 40px rgba(0,0,0,0.15)' : 'none',
        color: highlight ? '#ffffff' : '#1d1d1f',
        position: 'relative', textAlign: 'center',
        width: small ? 140 : 280
      }}
    >
      {pulse && (
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', inset: -4, borderRadius: 28, background: '#0071e3', zIndex: -1 }} />
      )}
      <div style={{ color: highlight ? '#ffffff' : '#86868b' }}>{icon}</div>
      <div style={{ fontSize: small ? 13 : 16, fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}

function ArchitectureLine() {
  return (
    <motion.div initial={{ height: 0 }} animate={{ height: 30 }} transition={{ duration: 0.8 }} style={{ width: 1, background: 'rgba(0,0,0,0.2)' }} />
  );
}

function ReportChapter({ number, title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={{ marginBottom: 100 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        Chapter {number}
      </div>
      <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', color: '#1d1d1f', marginBottom: 32 }}>
        {title}
      </h2>
      {children}
      <div style={{ height: 1, width: '100%', background: 'rgba(0,0,0,0.05)', marginTop: 80 }} />
    </motion.div>
  );
}

function ExportMenu({ downloadPDF }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ padding: '8px 16px', borderRadius: 20, background: '#1d1d1f', color: '#fff', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        Export <ChevronDown size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, width: 240, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(30px) saturate(150%)', borderRadius: 20, border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: 8, zIndex: 100 }}
          >
            {[
              { label: 'Export PDF Report', action: downloadPDF, primary: true },
              { label: 'Resume Data (.json)', action: () => alert('Coming soon') },
              { label: 'Share via Link', action: () => alert('Coming soon') }
            ].map((item, i) => (
              <div
                key={i} onClick={() => { item.action(); setOpen(false); }}
                style={{ padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: item.primary ? 600 : 500, color: item.primary ? '#0071e3' : '#1d1d1f', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {item.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const paragraphStyle = {
  fontSize: 18, lineHeight: 1.6, color: '#424245', maxWidth: 800, marginBottom: 40
};

const embedContainerStyle = {
  marginTop: 40, padding: 40, background: '#f5f5f7', borderRadius: 32
};
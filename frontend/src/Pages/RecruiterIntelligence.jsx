import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Download, Github, Linkedin, Link, Upload, CheckCircle2, ShieldCheck, FileSpreadsheet, Server, FileCheck, Layers, FileSignature, Presentation, ArrowRight, BrainCircuit } from "lucide-react";
import { recruiterIntelligenceService } from "../services/recruiterIntelligenceService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import JDVerificationMatrix from "../components/RecruiterIntelligence/JDVerificationMatrix";
import SkillGapDashboard from "../components/RecruiterIntelligence/SkillGapDashboard";
import CandidateFitDashboard from "../components/RecruiterIntelligence/CandidateFitDashboard";
import InterviewBlueprint from "../components/RecruiterIntelligence/InterviewBlueprint";
import ExplainabilityAuditCenter from "../components/RecruiterIntelligence/ExplainabilityAuditCenter";

export default function RecruiterIntelligence() {
  const [formData, setFormData] = useState({ resumeFile: null, jobDescription: "", github: "", linkedin: "", portfolio: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [exportSheetOpen, setExportSheetOpen] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    { time: "09:02", label: "Resume Parsed" },
    { time: "09:03", label: "GitHub Correlated" },
    { time: "09:05", label: "Technical Claims Verified" },
    { time: "09:08", label: "Risk Analysis Completed" },
    { time: "09:11", label: "Interview Strategy Generated" },
    { time: "09:13", label: "Recommendation Generated" }
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) setFormData({ ...formData, resumeFile: e.target.files[0] });
  };

  const handleAnalyze = async () => {
    if (!formData.resumeFile) return setError("Resume artifact is required to initiate due diligence.");
    if (!formData.jobDescription || formData.jobDescription.length < 20) return setError("Job description is required for deterministic verification.");
    
    setIsLoading(true);
    setError(null);
    
    setLoadingStep(0);
    const timings = [1500, 3000, 4500, 6000, 8000, 10000];
    timings.forEach((time, index) => {
      setTimeout(() => setLoadingStep(prev => prev < 5 ? index + 1 : prev), time);
    });

    const payload = new FormData();
    payload.append("resume", formData.resumeFile);
    payload.append("job_description", formData.jobDescription);
    if (formData.github) payload.append("github", formData.github);
    if (formData.linkedin) payload.append("linkedin", formData.linkedin);
    if (formData.portfolio) payload.append("portfolio", formData.portfolio);

    try {
      const result = await recruiterIntelligenceService.analyzeDirect(payload);
      setReport(result);
    } catch (err) {
      setError(err?.response?.data?.detail || "System rejected analysis. Please verify API keys and network connectivity.");
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleExportPDF = async () => {
    setExportSheetOpen(false);
    const element = document.getElementById("executive-dossier-document");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Executive_Dossier.pdf`);
    } catch (err) {
      console.error("PDF Export failed", err);
    }
  };

  const getStatus = (val, isFile = false) => {
    if (isLoading) return "Analyzing";
    if (report) return "Verified";
    if (isFile ? val : val?.length > 0) return "Connected";
    return "Not Connected";
  };

  const scrollToChapter = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="recruiter-intelligence-wrapper" style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif", color: '#1d1d1f' }}>
      
      <style>{`
        /* Global Responsive Overrides for Recruiter Intelligence */
        .ri-hero-grid { display: grid; grid-template-columns: 40% 60%; padding: 120px 80px; box-sizing: border-box; min-height: 100vh; }
        .ri-architecture { display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; width: 100%; height: 100%; }
        .ri-nav { display: flex; justify-content: center; gap: 60px; }
        .ri-evidence-grid { padding: 120px 80px; max-width: 1600px; margin: 0 auto; }
        .ri-evidence-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; }
        .ri-dossier-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .ri-dossier-container { max-width: 1000px; margin: 0 auto; padding: 100px 40px; display: flex; flex-direction: column; gap: 120px; }
        .ri-decision-finale { padding: 0 40px; }
        .ri-share-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 60px; width: 100%; }
        .ri-share-sheet-content { padding: 60px; }
        
        .ri-arch-inputs { display: flex; gap: 32px; z-index: 10; flex-wrap: wrap; justify-content: center; }
        
        /* Mobile Breakpoints */
        @media (max-width: 1024px) {
          .ri-hero-grid { grid-template-columns: 1fr; padding: 100px 40px; gap: 60px; }
          .ri-architecture { height: 500px; }
          .ri-nav { gap: 24px; flex-wrap: wrap; padding: 20px 40px; justify-content: flex-start; overflow-x: auto; white-space: nowrap; }
          .ri-evidence-grid { padding: 80px 40px; }
          .ri-dossier-grid { grid-template-columns: 1fr; gap: 40px; }
          .ri-dossier-container { padding: 80px 40px; gap: 80px; }
          .ri-share-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }

        @media (max-width: 768px) {
          .ri-hero-grid { padding: 80px 20px; }
          .ri-arch-inputs { gap: 16px; }
          .ri-nav { gap: 20px; padding: 20px; }
          .ri-evidence-grid { padding: 60px 20px; }
          .ri-dossier-container { padding: 60px 20px; gap: 60px; }
          .ri-decision-finale { padding: 0 20px; }
          .ri-share-grid { grid-template-columns: 1fr; gap: 24px; }
          .ri-share-sheet-content { padding: 40px 20px; }
        }
      `}</style>

      {/* ── SECTION 1: INVESTIGATION HERO (100vh) ── */}
      <div id="overview" className="ri-hero-grid">
        
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 40, zIndex: 10 }}>
          <h1 style={{ fontSize: "clamp(64px, 10vw, 120px)", fontWeight: 700, letterSpacing: "-0.05em", color: "#1d1d1f", margin: "0 0 24px 0", lineHeight: 1.05 }}>
            Evidence before decisions.
          </h1>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 600, color: "#424245", margin: "0 0 24px 0", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            Professional Due Diligence for modern hiring.
          </h2>
          <p style={{ fontSize: "clamp(18px, 3vw, 24px)", color: "#86868b", margin: "0 0 40px 0", lineHeight: 1.5, fontWeight: 500, maxWidth: 600 }}>
            CareerOS verifies technical capability, validates professional claims, and generates executive hiring recommendations.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <button onClick={() => scrollToChapter('evidence')} style={{ padding: "20px 48px", borderRadius: 100, background: "#1d1d1f", color: "#fff", fontSize: 18, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#000"} onMouseOut={e => e.currentTarget.style.background = "#1d1d1f"}>
              Begin Investigation <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Right Column (Living Investigation Architecture) */}
        <div className="ri-architecture">
          <div style={{ position: "absolute", top: -20, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700, textAlign: "center" }}>Living Investigation Architecture</div>
          
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "40px 0" }}>
            
            {/* Top Inputs */}
            <div className="ri-arch-inputs">
              {["Resume", "GitHub", "Portfolio", "LinkedIn", "JD"].map((item, i) => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }} style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.01em" }}>
                  {item}
                </motion.div>
              ))}
            </div>

            {/* Connecting Flow 1 */}
            <div style={{ position: "relative", height: "15%", minHeight: 40, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 1, height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0))" }} />
              <motion.div animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", width: 3, height: "50%", background: "linear-gradient(to bottom, transparent, #0071e3)", filter: "blur(1px)" }} />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} style={{ position: "absolute", right: -100, top: "50%", fontSize: 10, color: "#86868b", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Claims Verified</motion.div>
            </div>

            {/* Engine Node */}
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ padding: "16px 24px", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 12, zIndex: 10, textAlign: "center" }}>
              <BrainCircuit size={28} color="#0071e3" style={{ flexShrink: 0 }} /> Verification Engine
            </motion.div>

            {/* Connecting Flow 2 */}
            <div style={{ position: "relative", height: "15%", minHeight: 40, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 1, height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.1))" }} />
              <motion.div animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }} style={{ position: "absolute", width: 3, height: "50%", background: "linear-gradient(to bottom, transparent, #34c759)", filter: "blur(1px)" }} />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }} style={{ position: "absolute", left: -120, top: "50%", fontSize: 10, color: "#86868b", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Evidence Correlated</motion.div>
            </div>

            {/* Intelligence Node */}
            <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em", zIndex: 10, textAlign: "center" }}>Professional Intelligence</div>

            {/* Connecting Flow 3 */}
            <div style={{ position: "relative", height: "15%", minHeight: 40, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 1, height: "100%", background: "rgba(0,0,0,0.1)" }} />
              <motion.div animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2.5 }} style={{ position: "absolute", width: 3, height: "50%", background: "linear-gradient(to bottom, transparent, #1d1d1f)", filter: "blur(1px)" }} />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} style={{ position: "absolute", right: -120, top: "50%", fontSize: 10, color: "#86868b", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Risk Complete</motion.div>
            </div>

            {/* Final Node */}
            <div style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.03em", zIndex: 10, textAlign: "center" }}>Boardroom Recommendation</div>

          </div>
        </div>
      </div>

      {/* ── LOCAL CHAPTER NAVIGATION ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.85)", backdropFilter: "saturate(180%) blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="ri-nav" style={{ maxWidth: 1000, margin: "0 auto" }}>
          {["Overview", "Evidence", "Identity", "Dossier", "Decision"].map((item, i) => (
            <div key={i} onClick={() => scrollToChapter(item.toLowerCase())} style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.6, transition: "opacity 0.2s" }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.6}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── LIVE INVESTIGATION TIMELINE ── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ background: "#fbfbfd", borderBottom: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px", display: "flex", justifyContent: "flex-start", alignItems: "center", overflowX: "auto", gap: 40, whiteSpace: "nowrap", WebkitOverflowScrolling: "touch" }}>
              {steps.map((step, idx) => {
                const isActive = idx === loadingStep;
                const isDone = idx < loadingStep;
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, opacity: isDone || isActive ? 1 : 0.3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDone ? "#1d1d1f" : isActive ? "#0071e3" : "#86868b", border: isActive ? "2px solid rgba(0,113,227,0.3)" : "none", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontFamily: "SFMono-Regular, Consolas, monospace", color: "#86868b", fontWeight: 600 }}>{step.time}</span>
                    <span style={{ fontSize: 14, fontWeight: isActive || isDone ? 600 : 500, color: isDone ? "#1d1d1f" : isActive ? "#0071e3" : "#86868b" }}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECTION 2: EVIDENCE SOURCES ── */}
      <div id="evidence" className="ri-evidence-grid">
        <h2 style={{ fontSize: "clamp(32px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", margin: "0 0 60px 0" }}>Evidence Sources</h2>
        
        <div className="ri-evidence-cards">
          
          <div style={{ padding: 40, border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>Resume Artifact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Status:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{getStatus(formData.resumeFile, true)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Verification:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{report ? "Ready" : "Pending"}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Last Updated:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{formData.resumeFile ? "Just now" : "--"}</span></div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt" disabled={report || isLoading} />
            <div onClick={() => !report && !isLoading && fileInputRef.current?.click()} style={{ cursor: (report || isLoading) ? "default" : "pointer", fontSize: 16, color: "#0071e3", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {formData.resumeFile ? formData.resumeFile.name : "Select Document"}
            </div>
          </div>

          <div style={{ padding: 40, border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>Job Description</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Status:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{getStatus(formData.jobDescription)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Verification:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{report ? "Ready" : "Pending"}</span></div>
            </div>
            <textarea placeholder="Paste requirements here..." value={formData.jobDescription} onChange={e => setFormData({...formData, jobDescription: e.target.value})} disabled={report || isLoading} style={{ width: "100%", height: 120, padding: "16px", background: "#fbfbfd", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", outline: "none", resize: "none", fontSize: 16, fontFamily: "inherit", color: "#1d1d1f", boxSizing: "border-box" }} />
          </div>

          <div style={{ padding: 40, border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>GitHub Evidence</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Status:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{getStatus(formData.github)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Repositories:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{report ? "28" : "--"}</span></div>
            </div>
            <input type="text" placeholder="GitHub URL..." value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} disabled={report || isLoading} style={{ width: "100%", padding: "16px", background: "#fbfbfd", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", outline: "none", fontSize: 16, color: "#1d1d1f", boxSizing: "border-box" }} />
          </div>

          <div style={{ padding: 40, border: "1px solid rgba(0,0,0,0.06)", borderRadius: 16, display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>Portfolio Evidence</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Status:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{getStatus(formData.portfolio)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#86868b", fontSize: 15 }}>Projects:</span><span style={{ color: "#1d1d1f", fontWeight: 600, fontSize: 15 }}>{report ? "14" : "--"}</span></div>
            </div>
            <input type="text" placeholder="Portfolio URL..." value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} disabled={report || isLoading} style={{ width: "100%", padding: "16px", background: "#fbfbfd", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", outline: "none", fontSize: 16, color: "#1d1d1f", boxSizing: "border-box" }} />
          </div>

        </div>

        {!report && (
          <div style={{ marginTop: 80, display: "flex", justifyContent: "center" }}>
            <button onClick={handleAnalyze} disabled={isLoading} style={{ padding: "20px 40px", borderRadius: 100, background: "#1d1d1f", color: "#fff", fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 600, border: "none", cursor: isLoading ? "default" : "pointer", width: "100%", maxWidth: 400 }}>
              {isLoading ? "Executing Professional Due Diligence..." : "Analyze Evidence"}
            </button>
          </div>
        )}
      </div>

      {/* ── DOSSIER EXPERIENCE ── */}
      {report && !isLoading && (
        <div id="executive-dossier-document" className="ri-dossier-container">
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.03em", margin: 0 }}>Executive Dossier</h1>
            <button onClick={() => setExportSheetOpen(true)} style={{ background: "transparent", color: "#0071e3", border: "none", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
              Share Artifacts
            </button>
          </div>

          {/* ── SECTION 4: CANDIDATE IDENTITY ── */}
          <div id="identity" style={{ display: "flex", flexDirection: "column", gap: 60 }}>
            <div style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 40 }}>
              <h2 style={{ fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.04em", margin: "0 0 16px 0", wordBreak: "break-word" }}>{formData.resumeFile?.name?.replace(/\.[^/.]+$/, "") || "Candidate Assessment"}</h2>
              <span style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "#86868b", fontWeight: 500 }}>{report.job_intelligence?.inferred_role || "Engineering Core"}</span>
            </div>

            <div className="ri-dossier-grid">
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>Evidence Confidence</span>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{report.match_analysis?.evidence_match_score > 80 ? "Strong" : report.match_analysis?.evidence_match_score > 50 ? "Moderate" : "Weak"}</div>
                <p style={{ margin: 0, fontSize: 18, color: "#86868b", lineHeight: 1.6, fontWeight: 400 }}>{report.match_analysis?.evidence_match_score}% of claims validated through external evidence.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>Technical Maturity</span>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{report.match_analysis?.technical_match_score > 80 ? "Advanced" : report.match_analysis?.technical_match_score > 50 ? "Intermediate" : "Junior"}</div>
                <p style={{ margin: 0, fontSize: 18, color: "#86868b", lineHeight: 1.6, fontWeight: 400 }}>Engineering capability exceeds {report.match_analysis?.technical_match_score}% of industry benchmark.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>Professional Trust</span>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{report.match_analysis?.overall_match_score > 80 ? "High" : report.match_analysis?.overall_match_score > 50 ? "Moderate" : "Low"}</div>
                <p style={{ margin: 0, fontSize: 18, color: "#86868b", lineHeight: 1.6, fontWeight: 400 }}>Consistent alignment between claims and provided evidence.</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>Hiring Risk</span>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{report.risk_analysis?.risk_level || "Low"}</div>
                <p style={{ margin: 0, fontSize: 18, color: "#86868b", lineHeight: 1.6, fontWeight: 400 }}>{report.risk_analysis?.risk_level === "Low" ? "No major verification discrepancies detected." : "Discrepancies require immediate boardroom review."}</p>
              </div>

            </div>
          </div>

          {/* ── SECTION 5: EXECUTIVE DOSSIER CHAPTERS ── */}
          <div id="dossier" style={{ display: "flex", flexDirection: "column", gap: "clamp(60px, 10vw, 120px)" }}>
            
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "clamp(40px, 8vw, 80px)" }}>
              <h3 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", margin: "0 0 24px 0" }}>Executive Summary</h3>
              <p style={{ margin: 0, fontSize: "clamp(20px, 4vw, 28px)", color: "#424245", lineHeight: 1.6, fontWeight: 400, letterSpacing: "-0.01em" }}>
                {report.hiring_recommendation?.reasoning}
              </p>
            </div>

            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "clamp(40px, 8vw, 80px)" }}><JDVerificationMatrix matrix={report.jd_verification_matrix} /></div>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "clamp(40px, 8vw, 80px)" }}><SkillGapDashboard gaps={report.skill_gap_analysis} /></div>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "clamp(40px, 8vw, 80px)" }}><CandidateFitDashboard fit={report.candidate_fit} /></div>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "clamp(40px, 8vw, 80px)" }}><InterviewBlueprint blueprint={report.interview_blueprint} /></div>
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "clamp(40px, 8vw, 80px)" }}><ExplainabilityAuditCenter report={report} /></div>

          </div>

          {/* ── SECTION 6: BOARDROOM BRIEF ── */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "clamp(40px, 8vw, 80px)", paddingBottom: "clamp(60px, 10vw, 120px)" }}>
            <h3 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", margin: "0 0 40px 0" }}>Boardroom Brief</h3>
            <div className="ri-dossier-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <h4 style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", margin: 0 }}>Strengths</h4>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 20, color: "#424245", lineHeight: 1.6, fontWeight: 400 }}>
                  {report.candidate_fit?.startup_fit > 70 && <li style={{ marginBottom: 16 }}>High startup and ambiguity readiness.</li>}
                  {report.candidate_fit?.enterprise_fit > 70 && <li style={{ marginBottom: 16 }}>Strong enterprise process maturity.</li>}
                  {report.match_analysis?.evidence_match_score > 80 && <li style={{ marginBottom: 16 }}>Excellent track record of verifiable claims.</li>}
                  <li style={{ marginBottom: 16 }}>Matches {report.match_analysis?.technical_match_score}% of core technical requirements.</li>
                </ul>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <h4 style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", margin: 0 }}>Risks & Focus Areas</h4>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 20, color: "#424245", lineHeight: 1.6, fontWeight: 400 }}>
                  {report.skill_gap_analysis?.critical_missing?.map((g, i) => <li key={`c-${i}`} style={{ marginBottom: 16 }}>Critical missing: {g.skill_name}</li>)}
                  {report.risk_analysis?.risk_level !== "Low" && <li style={{ marginBottom: 16 }}>Elevated risk flagged in background consistency.</li>}
                  {report.interview_blueprint?.rounds?.[0]?.focus_areas?.slice(0, 2).map((fa, i) => <li key={`f-${i}`} style={{ marginBottom: 16 }}>Focus: {fa}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 7: HIRING RECOMMENDATION FINALE ── */}
      {report && !isLoading && (
        <div id="decision" className="ri-decision-finale" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(60px, 15vw, 200px)", fontWeight: 800, letterSpacing: "-0.05em", color: "#1d1d1f", margin: "0 0 24px 0", lineHeight: 1, wordBreak: "break-word" }}>
            {report.hiring_recommendation?.decision?.toUpperCase()}
          </h1>
          <div style={{ fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 700, color: "#424245", letterSpacing: "-0.02em", marginBottom: 24 }}>
            {report.hiring_recommendation?.confidence_score}% Confidence
          </div>
          <p style={{ margin: 0, fontSize: "clamp(18px, 3vw, 32px)", color: "#86868b", maxWidth: 1000, lineHeight: 1.5, fontWeight: 400 }}>
            Recommendation supported by verified evidence, technical maturity analysis, and professional due diligence.
          </p>
        </div>
      )}

      {/* ── SECTION 8: VISIONOS SHARE SHEET ── */}
      <AnimatePresence>
        {exportSheetOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setExportSheetOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.2)", zIndex: 100000 }} />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px", zIndex: 100001, display: "flex", justifyContent: "center" }}
            >
              <div className="ri-share-sheet-content" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(60px) saturate(200%)", borderRadius: 40, boxShadow: "0 40px 100px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.5)", width: "100%", maxWidth: 1200, display: "flex", flexDirection: "column", alignItems: "center", maxHeight: "90vh", overflowY: "auto" }}>
                <div style={{ width: 60, height: 6, borderRadius: 3, background: "rgba(0,0,0,0.2)", marginBottom: 40 }} />
                
                <div className="ri-share-grid">
                  {[
                    { title: "Executive Report", icon: FileSignature },
                    { title: "Interview Packet", icon: Presentation },
                    { title: "Verification Matrix", icon: Server },
                    { title: "Candidate Brief", icon: Search },
                    { title: "Hiring Summary", icon: ShieldCheck },
                    { title: "Boardroom Brief", icon: FileText }
                  ].map((opt, i) => (
                    <div key={i} onClick={handleExportPDF} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                      <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,1)" }}>
                        <opt.icon size={32} color="#1d1d1f" />
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.01em", textAlign: "center" }}>{opt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

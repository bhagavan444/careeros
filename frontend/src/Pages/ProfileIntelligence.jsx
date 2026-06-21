import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Github, Linkedin, Globe, X, Sparkles,
  Loader2, FileText, Download, ChevronRight, Share, File
} from "lucide-react";
import { profileIntelligenceService } from "../services/profileIntelligenceService";
import { uploadResumeDocument } from "../services/predictService";

import CandidateTruthEngine from "../components/ProfileIntelligence/CandidateTruthEngine";
import SkillVerificationMatrix from "../components/ProfileIntelligence/SkillVerificationMatrix";
import ProfileConsistencyEngine from "../components/ProfileIntelligence/ProfileConsistencyEngine";
import CareerPositioning from "../components/ProfileIntelligence/CareerPositioning";
import ReadinessEngines from "../components/ProfileIntelligence/ReadinessEngines";
import InterviewIntelligence from "../components/ProfileIntelligence/InterviewIntelligence";
import RiskAnalysis from "../components/ProfileIntelligence/RiskAnalysis";
import DecisionCenter from "../components/ProfileIntelligence/DecisionCenter";
import PDFExportButton from "../components/ProfileIntelligence/PDFExportButton";

const ease = [0.16, 1, 0.3, 1];

const ORB_STAGES = [
  "Parsing Resume...",
  "Validating Evidence...",
  "Verifying Skills...",
  "Analyzing Consistency...",
  "Positioning Career...",
  "Assessing Risk...",
  "Generating Decision..."
];

const CHAPTERS = [
  { id: "truth", label: "Truth" },
  { id: "skills", label: "Skills" },
  { id: "consistency", label: "Consistency" },
  { id: "career", label: "Career" },
  { id: "readiness", label: "Readiness" },
  { id: "interview", label: "Interview" },
  { id: "risk", label: "Risk" },
  { id: "decision", label: "Decision" },
];

export default function ProfileIntelligence() {
  const [formData, setFormData] = useState({ resume: "", github: "", linkedin: "", portfolio: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle | uploading | done | error
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [orbStageIndex, setOrbStageIndex] = useState(0);
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [error, setError] = useState(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  
  const fileInputRef = useRef(null);

  // ── File upload ──────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setUploadStatus("uploading");
    setError(null);
    try {
      const docId = await uploadResumeDocument(file);
      setFormData(prev => ({ ...prev, resume: docId }));
      setUploadStatus("done");
    } catch {
      setError("Resume upload failed. Please try again.");
      setUploadStatus("error");
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setFormData(prev => ({ ...prev, resume: "" }));
    setUploadStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Analyze ──────────────────────────────────────────────────────────────
  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setOrbStageIndex(0);
    setError(null);
    
    // Simulate stages progressing for the UI orb
    const stageInterval = setInterval(() => {
      setOrbStageIndex(prev => {
        if (prev < ORB_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const data = await profileIntelligenceService.analyzeProfile(formData);
      setIntelligenceData(data);
    } catch {
      setError("Analysis failed. Please check your inputs and try again.");
    } finally {
      clearInterval(stageInterval);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setIntelligenceData(null);
    setResumeFile(null);
    setFormData({ resume: "", github: "", linkedin: "", portfolio: "" });
    setUploadStatus("idle");
    window.scrollTo(0, 0);
  };

  const scrollToChapter = (id) => {
    const el = document.getElementById(`chapter-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100; // offset for sticky nav
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif", color: "#1d1d1f", letterSpacing: "-0.01em" }}>

      {/* ── Apple Intelligence Orb Overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(245,245,247,0.85)", backdropFilter: "blur(40px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
              {/* Blurred Orb */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 0.95, 1],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ 
                  position: "absolute", width: "100%", height: "100%", 
                  background: "conic-gradient(from 180deg at 50% 50%, #ffb6ff 0deg, #b3d4ff 120deg, #fffb96 240deg, #ffb6ff 360deg)",
                  borderRadius: "50%", filter: "blur(24px)", opacity: 0.8
                }}
              />
              {/* Inner core */}
              <div style={{ width: 60, height: 60, background: "#fff", borderRadius: "50%", zIndex: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={orbStageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "#1d1d1f" }}
              >
                {ORB_STAGES[orbStageIndex]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!intelligenceData ? (
        /* ════════════════════════════════════════════════════════════════
            LANDING (PHASE 1 & 2)
        ════════════════════════════════════════════════════════════════ */
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "100px 40px 120px" }}>
          
          {/* Phase 1: Immersive Hero */}
          <div style={{ height: "90vh", display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, paddingRight: 60 }}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
                style={{ fontSize: "clamp(64px, 7vw, 110px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#1d1d1f", margin: "0 0 32px" }}
              >
                Trust should<br/>be earned.<br/>
                <span style={{ color: "#86868b", display: "inline-block", marginTop: 12 }}>Not assumed.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
                style={{ fontSize: 24, color: "#86868b", lineHeight: 1.4, maxWidth: 600, marginBottom: 56, fontWeight: 400, letterSpacing: "-0.01em" }}
              >
                CareerOS validates evidence, verifies technical capability, analyzes professional consistency, and produces recruiter-grade intelligence.
              </motion.p>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} style={{ display: "flex", gap: 16 }}>
                <button onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })} style={{ padding: "18px 36px", background: "#1d1d1f", color: "#fff", borderRadius: 32, fontSize: 17, fontWeight: 500, border: "none", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                  Generate Intelligence
                </button>
                <button style={{ padding: "18px 36px", background: "rgba(0,0,0,0.04)", color: "#1d1d1f", borderRadius: 32, fontSize: 17, fontWeight: 500, border: "none", cursor: "pointer" }}>
                  See Methodology
                </button>
              </motion.div>
            </div>

            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
               {/* Live Intelligence Architecture (Pure Typography) */}
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}
                 style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, fontSize: 24, fontWeight: 500, color: "#1d1d1f", letterSpacing: "-0.02em" }}
               >
                 {["Resume", "GitHub", "LinkedIn", "Portfolio"].map((item, i) => (
                   <div key={item} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                     <span>{item}</span>
                     <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} style={{ color: "#c7c7cc" }}>↓</motion.div>
                   </div>
                 ))}
                 <span style={{ color: "#0071e3" }}>Verification Engine</span>
                 <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: "#c7c7cc" }}>↓</motion.div>
                 <span style={{ color: "#8e44ad" }}>Intelligence Engine</span>
                 <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ color: "#c7c7cc" }}>↓</motion.div>
                 <span style={{ fontWeight: 600 }}>Executive Decision</span>
               </motion.div>
            </div>
          </div>

          {/* Phase 2: Evidence Collection */}
          <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 100 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 48, textAlign: "center" }}>Evidence Surfaces</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {/* Resume Surface */}
              <EvidenceSurface title="Resume Document" icon={<FileText size={24}/>} status={uploadStatus} ready={!!resumeFile}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "#f5f5f7", borderRadius: 20, cursor: "pointer" }}
                >
                  <input type="file" ref={fileInputRef} accept=".pdf,.docx,.txt" onChange={handleFileChange} hidden />
                  <div style={{ fontSize: 17, color: resumeFile ? "#1d1d1f" : "#86868b", fontWeight: 500 }}>
                    {resumeFile ? resumeFile.name : "Upload PDF, DOCX, or TXT..."}
                  </div>
                  {resumeFile ? (
                    <button onClick={e => { e.stopPropagation(); removeFile(); }} style={{ background: "none", border: "none", color: "#86868b", cursor: "pointer" }}><X size={20}/></button>
                  ) : (
                    <Upload size={20} color="#86868b"/>
                  )}
                </div>
              </EvidenceSurface>

              {/* GitHub Surface */}
              <EvidenceSurface title="GitHub Profile" icon={<Github size={24}/>} status={formData.github ? "done" : "idle"} ready={!!formData.github}>
                <input 
                  type="text" placeholder="github.com/username..." 
                  value={formData.github} onChange={e => setFormData(p => ({ ...p, github: e.target.value }))}
                  style={{ width: "100%", padding: "20px 24px", background: "#f5f5f7", borderRadius: 20, border: "none", fontSize: 17, outline: "none", color: "#1d1d1f", fontFamily: "inherit" }}
                />
              </EvidenceSurface>

              {/* LinkedIn Surface */}
              <EvidenceSurface title="LinkedIn Profile" icon={<Linkedin size={24}/>} status={formData.linkedin ? "done" : "idle"} ready={!!formData.linkedin}>
                <input 
                  type="text" placeholder="linkedin.com/in/username..." 
                  value={formData.linkedin} onChange={e => setFormData(p => ({ ...p, linkedin: e.target.value }))}
                  style={{ width: "100%", padding: "20px 24px", background: "#f5f5f7", borderRadius: 20, border: "none", fontSize: 17, outline: "none", color: "#1d1d1f", fontFamily: "inherit" }}
                />
              </EvidenceSurface>

              {/* Portfolio Surface */}
              <EvidenceSurface title="Portfolio URL" icon={<Globe size={24}/>} status={formData.portfolio ? "done" : "idle"} ready={!!formData.portfolio}>
                <input 
                  type="text" placeholder="https://..." 
                  value={formData.portfolio} onChange={e => setFormData(p => ({ ...p, portfolio: e.target.value }))}
                  style={{ width: "100%", padding: "20px 24px", background: "#f5f5f7", borderRadius: 20, border: "none", fontSize: 17, outline: "none", color: "#1d1d1f", fontFamily: "inherit" }}
                />
              </EvidenceSurface>
            </div>

            {error && <div style={{ color: "#ff3b30", textAlign: "center", marginTop: 32, fontSize: 17 }}>{error}</div>}

            <div style={{ display: "flex", justifyContent: "center", marginTop: 64 }}>
              <button 
                onClick={handleAnalyze} 
                disabled={!resumeFile || uploadStatus === "uploading"}
                style={{ 
                  padding: "20px 48px", borderRadius: 40, border: "none", fontSize: 18, fontWeight: 500, 
                  background: resumeFile ? "#0071e3" : "rgba(0,113,227,0.3)", color: "#fff", 
                  cursor: resumeFile ? "pointer" : "not-allowed", transition: "all 0.3s" 
                }}
              >
                Synthesize Intelligence
              </button>
            </div>
          </div>
        </div>

      ) : (

        /* ════════════════════════════════════════════════════════════════
            RESULTS (PHASE 4)
        ════════════════════════════════════════════════════════════════ */
        <div id="profile-intelligence-report" style={{ position: "relative" }}>
          
          {/* Top Actions */}
          <div style={{ position: "absolute", top: 120, right: 40, display: "flex", gap: 16, zIndex: 60 }}>
             <button onClick={handleReset} style={{ padding: "12px 24px", borderRadius: 24, background: "#fff", border: "1px solid rgba(0,0,0,0.04)", fontSize: 15, fontWeight: 500, color: "#1d1d1f", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
               Reset Analysis
             </button>
             <button onClick={() => setIsShareSheetOpen(true)} style={{ padding: "12px 24px", borderRadius: 24, background: "#1d1d1f", border: "none", fontSize: 15, fontWeight: 500, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
               <Share size={16}/> Export Dossier
             </button>
          </div>

          {/* Dossier Header */}
          <div style={{ paddingTop: 180, paddingBottom: 60, textAlign: "center", maxWidth: 800, margin: "0 auto", paddingLeft: 40, paddingRight: 40 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Executive Dossier</div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", margin: 0, wordBreak: "break-word", overflowWrap: "anywhere" }}>
              {resumeFile?.name?.replace(/\.[^.]+$/, "") || "Intelligence Report"}
            </h2>
          </div>

          {/* Sticky Chapter Navigation */}
          <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245, 245, 247, 0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(0,0,0,0.04)", borderTop: "1px solid rgba(0,0,0,0.04)", padding: "16px 0", display: "flex", justifyContent: "center", gap: 32, overflowX: "auto", scrollbarWidth: "none" }}>
            {CHAPTERS.map(ch => (
               <button key={ch.id} onClick={() => scrollToChapter(ch.id)} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 500, color: "#86868b", cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#1d1d1f"} onMouseOut={e => e.currentTarget.style.color = "#86868b"}>
                 {ch.label}
               </button>
            ))}
          </div>

          <div style={{ padding: "40px 40px 160px" }}>
            
            <Chapter id="truth" title="Truth Verification" intro="82% of professional claims were validated against external evidence sources. The Truth Engine cross-references stated experiences with verifiable public artifacts.">
              <CandidateTruthEngine data={intelligenceData.truth_score} />
            </Chapter>

            <Chapter id="skills" title="Skill Verification" intro="Technical proficiencies mapped against verifiable evidence. We eliminate keyword stuffing by confirming actual application of stated tools.">
               <SkillVerificationMatrix data={intelligenceData.verification_matrix} />
            </Chapter>

            <Chapter id="consistency" title="Consistency Analysis" intro="Analyzing timeline continuity, role progression logic, and narrative alignment across multiple professional identities.">
               <ProfileConsistencyEngine data={intelligenceData.consistency_analysis} />
            </Chapter>

            <Chapter id="career" title="Career Positioning" intro="Evaluating market trajectory, seniority alignment, and specialization depth against current industry standards.">
               <CareerPositioning data={intelligenceData.career_positioning} />
            </Chapter>

            <Chapter id="readiness" title="Readiness Analysis" intro="Simulation of recruiter reception and market competitiveness based on current profile artifacts.">
               <ReadinessEngines recruiter={intelligenceData.recruiter_readiness} market={intelligenceData.market_readiness} />
            </Chapter>

            <Chapter id="interview" title="Interview Intelligence" intro="Predictive analysis of interview performance, generated questions, and recommended preparation areas.">
               <InterviewIntelligence data={intelligenceData.interview_intelligence} />
            </Chapter>

            <Chapter id="risk" title="Risk Assessment" intro="Identification of potential red flags, employment gaps, or narrative inconsistencies requiring clarification.">
               <RiskAnalysis data={intelligenceData.risk_analysis} />
            </Chapter>

            {/* Decision Center - Full Width, Massive */}
            <div id="chapter-decision" style={{ paddingTop: 120, paddingBottom: 120 }}>
               <div style={{ textAlign: "center", marginBottom: 60 }}>
                 <h3 style={{ fontSize: 18, fontWeight: 600, color: "#86868b", letterSpacing: "0.1em", textTransform: "uppercase" }}>Executive Recommendation</h3>
               </div>
               <div style={{ width: "100%" }}>
                 <DecisionCenter data={intelligenceData.decision_center} />
               </div>
            </div>

          </div>
        </div>
      )}

      {/* ── VisionOS Share Sheet ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isShareSheetOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
            onClick={() => setIsShareSheetOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              onClick={e => e.stopPropagation()}
              style={{ 
                background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
                borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: "40px 40px 60px", 
                borderTop: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 -20px 60px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ width: 48, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.1)", margin: "0 auto 32px" }} />
              
              <h3 style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", textAlign: "center", marginBottom: 40, letterSpacing: "-0.01em" }}>Export Executive Dossier</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, maxWidth: 1000, margin: "0 auto" }}>
                
                {/* PDF Export acts as the real one for now */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, opacity: 0, zIndex: 2 }}>
                     <PDFExportButton targetId="profile-intelligence-report" />
                  </div>
                  <ShareOption title="Export PDF" desc="Complete visual report" icon={<File size={24}/>} active />
                </div>

                <ShareOption title="Executive Summary" desc="1-page brief" icon={<FileText size={24}/>} />
                <ShareOption title="Verification Report" desc="Truth engine data" icon={<Shield size={24}/>} />
                <ShareOption title="Career Positioning" desc="Market analysis" icon={<Globe size={24}/>} />
                <ShareOption title="Interview Report" desc="Prep materials" icon={<Brain size={24}/>} />
                <ShareOption title="Boardroom Recommendation" desc="Final decision" icon={<Sparkles size={24}/>} />
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Overrides for Legacy Components to match Apple OS */}
      <style>{`
        * { box-sizing: border-box; }
        ::placeholder { color: #86868b; }
        
        /* Enforce Apple OS aesthetics on all inner components */
        #profile-intelligence-report div[style*="background"],
        #profile-intelligence-report div[style*="border"] {
           border-radius: 28px !important;
        }
        #profile-intelligence-report div {
           font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        /* Override dark modes and boxes */
        #profile-intelligence-report div[style*="rgba(255, 255, 255, 0.03)"],
        #profile-intelligence-report div[style*="rgba(255, 255, 255, 0.05)"],
        #profile-intelligence-report div[style*="rgba(255,255,255,0.05)"],
        #profile-intelligence-report div[style*="rgba(255, 255, 255, 0.02)"] {
          background: #ffffff !important;
          border: 1px solid rgba(0,0,0,0.04) !important;
          backdrop-filter: none !important;
          color: #1d1d1f !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.02) !important;
        }
        #profile-intelligence-report div[style*="background: '#0a0a0a'"],
        #profile-intelligence-report div[style*="background: #0a0a0a"] {
          background: transparent !important;
        }
        #profile-intelligence-report span[style*="#ffffff"],
        #profile-intelligence-report h2[style*="#ffffff"],
        #profile-intelligence-report h3[style*="#ffffff"],
        #profile-intelligence-report div[style*="#ffffff"] {
          color: #1d1d1f !important;
        }
        #profile-intelligence-report span[style*="#a3a3a3"],
        #profile-intelligence-report p[style*="#a3a3a3"],
        #profile-intelligence-report div[style*="#a3a3a3"],
        #profile-intelligence-report span[style*="#d4d4d4"],
        #profile-intelligence-report span[style*="#d1d5db"],
        #profile-intelligence-report p[style*="#9ca3af"] {
          color: #86868b !important;
        }
        #profile-intelligence-report div[style*="border: 1px solid rgba(255, 255, 255, 0.1)"],
        #profile-intelligence-report div[style*="border: '1px solid rgba(255, 255, 255, 0.1)'"] {
          border: 1px solid rgba(0,0,0,0.04) !important;
          background: #ffffff !important;
        }
      `}</style>
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function EvidenceSurface({ title, icon, status, ready, children }) {
  return (
    <div style={{ background: "#ffffff", borderRadius: 32, padding: 40, border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 12px 40px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ color: "#1d1d1f" }}>{icon}</div>
          <h3 style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#86868b" }}>
           <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
             <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>State</span>
             <span style={{ color: ready ? "#34c759" : "#86868b", fontWeight: 500 }}>{ready ? "Connected" : "Pending"}</span>
           </div>
           <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
             <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Updated</span>
             <span style={{ fontWeight: 500 }}>{ready ? "Just now" : "—"}</span>
           </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Chapter({ id, title, intro, children }) {
  return (
    <section id={`chapter-${id}`} style={{ padding: "80px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto 64px", textAlign: "center" }}>
        <h3 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", marginBottom: 20 }}>{title}</h3>
        <p style={{ fontSize: 20, color: "#86868b", lineHeight: 1.5, fontWeight: 400 }}>{intro}</p>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
         {children}
      </div>
    </section>
  );
}

function ShareOption({ title, desc, icon, active }) {
  return (
    <div style={{ padding: 24, background: active ? "#f5f5f7" : "#ffffff", borderRadius: 24, border: `1px solid ${active ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)"}`, display: "flex", flexDirection: "column", gap: 16, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
      <div style={{ color: active ? "#0071e3" : "#1d1d1f" }}>{icon}</div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#86868b" }}>{desc}</div>
      </div>
    </div>
  );
}

// ─── Sub-icons missing ────────────────────────────────────────────────────────
const Shield = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Brain = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;

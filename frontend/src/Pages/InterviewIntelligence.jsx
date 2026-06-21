import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, CheckCircle2, 
  Share, Download, LayoutTemplate, Briefcase, File
} from "lucide-react";
import { interviewIntelligenceService } from "../services/interviewIntelligenceService";
import InterviewReportCenter from "../components/InterviewIntelligence/InterviewReportCenter";

const ease = [0.16, 1, 0.3, 1];

const ORB_STAGES = [
  "Parsing Resume...",
  "Mapping Job Requirements...",
  "Analyzing Candidate Strengths...",
  "Generating Validation Questions...",
  "Building Interview Blueprint...",
  "Generating Executive Strategy..."
];

const EvidenceSurface = ({ title, icon, status, ready, children }) => (
  <div style={{
    background: "#fff", borderRadius: 28, padding: 32,
    boxShadow: "0 4px 24px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.04)",
    display: "flex", flexDirection: "column", gap: 24, transition: "all 0.4s ease"
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ color: ready ? "#1d1d1f" : "#86868b" }}>{icon}</div>
        <h3 style={{ fontSize: 19, fontWeight: 600, color: ready ? "#1d1d1f" : "#86868b", margin: 0 }}>{title}</h3>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: ready ? "#34c759" : "#86868b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {ready && <CheckCircle2 size={16} />}
        {status}
      </div>
    </div>
    {children}
  </div>
);

export default function InterviewIntelligence() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [orbStageIndex, setOrbStageIndex] = useState(0);
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("wordprocessingml"))) {
      setResumeFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription.trim()) return;

    setStatus("processing");
    setOrbStageIndex(0);
    setErrorMessage("");

    const stageInterval = setInterval(() => {
      setOrbStageIndex(prev => {
        if (prev < ORB_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      const data = await interviewIntelligenceService.generateStrategy(formData);
      setIntelligenceData(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (!err.response) {
        setErrorMessage("Unable to connect to the CareerOS server. Please ensure the backend is running and try again.");
      } else if (err.response.status === 413) {
        setErrorMessage("The uploaded file is too large. Please use a smaller resume.");
      } else {
        setErrorMessage(
          err.response?.data?.detail || "An unexpected error occurred while analyzing the resume. Please try again."
        );
      }
    } finally {
      clearInterval(stageInterval);
    }
  };

  if (status === "success" && intelligenceData) {
    return <InterviewReportCenter data={intelligenceData} resumeFile={resumeFile} reset={() => {
      setStatus("idle");
      setIntelligenceData(null);
    }} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif", color: "#1d1d1f", letterSpacing: "-0.01em" }}>

      {/* ── Apple Intelligence Orb Overlay ────────────────────────────────────── */}
      <AnimatePresence>
        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(245,245,247,0.85)", backdropFilter: "blur(40px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
              {/* Blurred Orb */}
              <motion.div
                animate={{ scale: [1, 1.1, 0.95, 1], rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ 
                  position: "absolute", width: "100%", height: "100%", 
                  background: "conic-gradient(from 180deg at 50% 50%, #b3d4ff 0deg, #ffb6ff 120deg, #b3d4ff 240deg, #fffb96 360deg)",
                  borderRadius: "50%", filter: "blur(24px)", opacity: 0.8
                }}
              />
              <div style={{ width: 60, height: 60, background: "#fff", borderRadius: "50%", zIndex: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={orbStageIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.6, ease }}
                style={{ fontSize: 24, fontWeight: 500, color: "#1d1d1f", textAlign: "center" }}
              >
                {ORB_STAGES[orbStageIndex]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
        
        {/* Left Side: Typography */}
        <div style={{ padding: "160px 60px 80px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }} style={{ position: "sticky", top: 160 }}>
            <h1 style={{ fontSize: "clamp(64px, 7vw, 100px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.04em", margin: "0 0 16px 0", color: "#1d1d1f" }}>
              Master every<br/>interview.
            </h1>
            <p style={{ fontSize: 32, fontWeight: 500, color: "#86868b", margin: "0 0 40px 0", letterSpacing: "-0.02em" }}>
              Before the interview begins.
            </p>
            <p style={{ fontSize: 21, lineHeight: 1.5, color: "#86868b", maxWidth: 560, marginBottom: 60, fontWeight: 400 }}>
              CareerOS analyzes candidate evidence, maps job requirements, identifies risks, and generates executive-grade interview strategies.
            </p>

            {/* CTA Container */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <button 
                onClick={handleGenerate} 
                disabled={status === "processing" || !resumeFile || !jobDescription.trim()}
                style={{ 
                  padding: "20px 40px", borderRadius: 40, border: "none", fontSize: 18, fontWeight: 500, 
                  background: (resumeFile && jobDescription.trim()) ? "#1d1d1f" : "rgba(0,0,0,0.05)", 
                  color: (resumeFile && jobDescription.trim()) ? "#fff" : "#86868b", 
                  cursor: (resumeFile && jobDescription.trim()) ? "pointer" : "not-allowed", transition: "all 0.3s" 
                }}
              >
                Generate Interview Intelligence
              </button>
              <button style={{ background: "none", border: "none", fontSize: 18, fontWeight: 500, color: "#0071e3", cursor: "pointer" }}>
                See Methodology
              </button>
            </div>
            
            {status === "error" && errorMessage && (
              <div style={{ marginTop: 24, color: "#ff3b30", fontSize: 15 }}>{errorMessage}</div>
            )}
          </motion.div>
        </div>

        {/* Right Side: Architecture & Sources */}
        <div style={{ background: "#e8e8ed", padding: "80px 60px", display: "flex", flexDirection: "column", gap: 60, overflowY: "auto" }}>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 32 }}>
              Live Interview Architecture
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["Resume", "Job Description", "Evidence Mapping", "Skill Validation", "Risk Detection", "Interview Blueprint", "Hiring Readiness"].map((step, i) => (
                <div key={i}>
                  <motion.div 
                    initial={{ opacity: 0.3, x: -10 }} animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.2 }}
                    style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}
                  >
                    {step}
                  </motion.div>
                  {i < 6 && <div style={{ fontSize: 20, color: "#86868b", margin: "8px 0" }}>↓</div>}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Evidence Sources
            </div>
            
            {/* Resume Surface */}
            <EvidenceSurface title="Resume Evidence" icon={<FileText size={24}/>} status={resumeFile ? "Verified" : "Pending"} ready={!!resumeFile}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                style={{
                  height: 120, background: resumeFile ? "#f5f5f7" : "#fff", borderRadius: 20,
                  border: resumeFile ? "none" : "2px dashed rgba(0,0,0,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <input type="file" accept=".pdf,.docx" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
                {resumeFile ? (
                   <div style={{ textAlign: "center" }}>
                     <div style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f" }}>{resumeFile.name}</div>
                     <button type="button" onClick={removeFile} style={{ background: "none", border: "none", color: "#ff3b30", fontSize: 14, cursor: "pointer", marginTop: 8 }}>Remove</button>
                   </div>
                ) : (
                   <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#86868b" }}>
                     <Upload size={24} />
                     <span style={{ fontSize: 15, fontWeight: 500 }}>Drop candidate resume here</span>
                   </div>
                )}
              </div>
            </EvidenceSurface>

            {/* JD Surface */}
            <EvidenceSurface title="Role Requirements" icon={<Briefcase size={24}/>} status={jobDescription ? "Ready" : "Pending"} ready={!!jobDescription}>
              <textarea 
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                style={{
                  width: "100%", height: 160, padding: 24, background: "#f5f5f7", borderRadius: 20, border: "none",
                  fontSize: 17, outline: "none", color: "#1d1d1f", fontFamily: "inherit", resize: "none"
                }}
              />
              {jobDescription && (
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#86868b", fontWeight: 500 }}>
                  <span>Word Count: {jobDescription.split(/\s+/).length}</span>
                </div>
              )}
            </EvidenceSurface>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

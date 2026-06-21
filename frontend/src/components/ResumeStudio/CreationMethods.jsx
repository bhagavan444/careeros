import React, { useState } from "react";
import { Sparkles, PenTool, Upload, Github, BrainCircuit, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeIdentity, analyzeGitHubIdentity } from "../../services/identityAnalysisService";
import { generateResumeDraft } from "../../services/identityGenerationService";
import { updateCareerMemory } from "../../services/careerMemoryService";
import IdentityReportPanel from "./IdentityReportPanel";

const appleEase = [0.16, 1, 0.3, 1];

const methods = [
  {
    id: "manual-ai",
    icon: <BrainCircuit size={22} />,
    title: "Identity Generation",
    desc: "Input your career signals. AI builds your resume from first principles.",
    tag: "Recommended",
  },
  {
    id: "github",
    icon: <Github size={22} />,
    title: "GitHub Intelligence",
    desc: "Extract your professional identity directly from your repositories.",
    tag: null,
  },
  {
    id: "manual",
    icon: <PenTool size={22} />,
    title: "Build Manually",
    desc: "Full control. Blank canvas. Construct every line yourself.",
    tag: null,
  },
  {
    id: "import",
    icon: <Upload size={22} />,
    title: "Import Resume",
    desc: "Upload a PDF or DOCX to seed and enhance your workspace.",
    tag: "Coming Soon",
    disabled: true,
  },
];

export default function CreationMethods({ onStartManual, onGenerateSuccess }) {
  const [mode, setMode] = useState("select");
  const [signals, setSignals] = useState({ targetRole: "", skills: "", projects: "" });
  const [githubUser, setGithubUser] = useState("");
  const [report, setReport] = useState(null);

  const handleAnalyzeIdentity = async () => {
    setMode("analyzing");
    const result = await analyzeIdentity(signals);
    setReport(result);
    setMode("report");
    updateCareerMemory(result);
  };

  const handleAnalyzeGitHub = async () => {
    if (!githubUser) return;
    setMode("analyzing");
    const result = await analyzeGitHubIdentity(githubUser);
    setReport(result);
    setMode("report");
    updateCareerMemory(result);
  };

  const handleGenerateDraft = async () => {
    setMode("generating");
    const draft = await generateResumeDraft(report);
    onGenerateSuccess(draft);
  };

  const handleCardClick = (id) => {
    if (id === "manual-ai") setMode("manual-ai");
    else if (id === "github") setMode("github");
    else if (id === "manual") onStartManual();
    else if (id === "import") alert("Upload coming soon!");
  };

  return (
    <div className="rs-creation-container">
      <AnimatePresence mode="wait">

        {/* ── Selection screen ── */}
        {mode === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: appleEase }}
            style={{ width: "100%", maxWidth: 900 }}
          >
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#0071e3", textTransform: "uppercase", marginBottom: 16 }}>Resume Studio</div>
              <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", marginBottom: 16, lineHeight: 1.05 }}>
                Build your perfect resume.
              </h1>
              <p style={{ fontSize: 19, color: "#86868b", fontWeight: 400, maxWidth: 480, margin: "0 auto", lineHeight: 1.55 }}>
                CareerOS analyses your identity, then crafts the resume that opens doors.
              </p>
            </div>

            <div className="rs-creation-grid">
              {methods.map((m, i) => (
                <motion.div
                  key={m.id}
                  className="rs-creation-card"
                  onClick={() => !m.disabled && handleCardClick(m.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: appleEase }}
                  style={{ opacity: m.disabled ? 0.45 : 1, cursor: m.disabled ? "not-allowed" : "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="rs-creation-icon">{m.icon}</div>
                    {m.tag && (
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: m.tag === "Recommended" ? "#0071e3" : "#86868b", background: m.tag === "Recommended" ? "rgba(0,113,227,0.08)" : "rgba(0,0,0,0.05)", padding: "3px 8px", borderRadius: 6 }}>
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.01em", marginBottom: 6 }}>{m.title}</h3>
                    <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.55 }}>{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Manual AI form ── */}
        {mode === "manual-ai" && (
          <motion.div key="manual-ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: appleEase }}
            style={{ width: "100%", maxWidth: 520, background: "#ffffff", borderRadius: 24, padding: "40px 40px", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.05)" }}
          >
            <button onClick={() => setMode("select")} style={{ background: "none", border: "none", color: "#0071e3", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 28, fontFamily: "inherit", fontSize: 13, fontWeight: 500, padding: 0 }}>
              <ArrowLeft size={15} /> Back
            </button>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.03em", marginBottom: 6 }}>Career Signals</h2>
            <p style={{ fontSize: 14, color: "#86868b", marginBottom: 28, lineHeight: 1.5 }}>Tell us about your career and we'll generate a tailored resume.</p>

            <div className="rs-form-group">
              <label className="rs-label">Target Role</label>
              <input className="rs-input" placeholder="e.g. Senior Backend Engineer" value={signals.targetRole} onChange={e => setSignals({ ...signals, targetRole: e.target.value })} />
            </div>
            <div className="rs-form-group">
              <label className="rs-label">Core Skills</label>
              <input className="rs-input" placeholder="e.g. Python, AWS, React" value={signals.skills} onChange={e => setSignals({ ...signals, skills: e.target.value })} />
            </div>
            <div className="rs-form-group">
              <label className="rs-label">Key Projects & Achievements</label>
              <textarea className="rs-textarea" placeholder="Describe your biggest wins, projects, or impact..." value={signals.projects} onChange={e => setSignals({ ...signals, projects: e.target.value })} style={{ minHeight: 100 }} />
            </div>

            <button className="rs-btn rs-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15, borderRadius: 12, marginTop: 8 }} onClick={handleAnalyzeIdentity}>
              <Sparkles size={16} />
              Analyze My Identity
            </button>
          </motion.div>
        )}

        {/* ── GitHub form ── */}
        {mode === "github" && (
          <motion.div key="github" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: appleEase }}
            style={{ width: "100%", maxWidth: 480, background: "#ffffff", borderRadius: 24, padding: "40px", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.05)" }}
          >
            <button onClick={() => setMode("select")} style={{ background: "none", border: "none", color: "#0071e3", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 28, fontFamily: "inherit", fontSize: 13, fontWeight: 500, padding: 0 }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Github size={26} color="#1d1d1f" />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.03em", marginBottom: 8 }}>GitHub Intelligence</h2>
            <p style={{ fontSize: 14, color: "#86868b", marginBottom: 28, lineHeight: 1.55 }}>We'll scan your repositories, commit history, and contributions to map your engineering identity.</p>

            <div className="rs-form-group">
              <label className="rs-label">GitHub Username</label>
              <input className="rs-input" placeholder="e.g. torvalds" value={githubUser} onChange={e => setGithubUser(e.target.value)} style={{ fontSize: 15 }} />
            </div>

            <button className="rs-btn rs-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "15px", fontSize: 15, borderRadius: 12, marginTop: 8 }} onClick={handleAnalyzeGitHub}>
              <Github size={16} />
              Extract My Identity
            </button>
          </motion.div>
        )}

        {/* ── Analyzing state ── */}
        {mode === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid rgba(0,113,227,0.15)", borderTopColor: "#0071e3", animation: "spin 0.8s linear infinite" }} />
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 8 }}>Analyzing your profile...</h2>
              <p style={{ fontSize: 15, color: "#86868b" }}>CareerOS is mapping your identity against market intelligence.</p>
            </div>
          </motion.div>
        )}

        {/* ── Report ── */}
        {mode === "report" && (
          <IdentityReportPanel report={report} onProceed={handleGenerateDraft} />
        )}

        {/* ── Generating ── */}
        {mode === "generating" && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid rgba(52,199,89,0.15)", borderTopColor: "#34c759", animation: "spin 0.8s linear infinite" }} />
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", marginBottom: 8 }}>Drafting your resume...</h2>
              <p style={{ fontSize: 15, color: "#86868b" }}>Structuring achievements, optimising ATS signals, and formatting layout.</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

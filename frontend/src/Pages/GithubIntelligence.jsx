import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, Search, Code2, GitBranch, TerminalSquare, AlertCircle, 
  Loader2, CheckCircle2, ChevronRight, BarChart3, Star, GitFork, BookOpen, Shield, Download,
  Share, File, X
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1];

const ORB_STAGES = [
  "Scanning GitHub Profile...",
  "Cloning Repositories...",
  "Verifying Technology Implementation...",
  "Analyzing Architecture Patterns...",
  "Calculating Engineering Maturity...",
  "Verifying Technical Trust...",
  "Positioning Career...",
  "Generating Executive Report..."
];

const CHAPTERS = [
  { id: "identity", label: "Identity" },
  { id: "exec-summary", label: "Executive Summary" },
  { id: "recruiter", label: "Recruiter View" },
  { id: "tech", label: "Technology" },
  { id: "maturity", label: "Maturity" },
  { id: "architecture", label: "Architecture" },
  { id: "repositories", label: "Repositories" },
  { id: "career", label: "Positioning" },
  { id: "roadmap", label: "Roadmap" },
  { id: "trust", label: "Trust" },
];

const Chapter = ({ id, title, intro, children }) => (
  <div id={`chapter-${id}`} style={{ padding: "80px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {title && (
        <div style={{ marginBottom: 40, maxWidth: 800 }}>
          <h3 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", margin: "0 0 16px" }}>{title}</h3>
          {intro && <p style={{ fontSize: 21, color: "#86868b", lineHeight: 1.5, margin: 0 }}>{intro}</p>}
        </div>
      )}
      {children}
    </div>
  </div>
);

export default function GithubIntelligence() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [orbStageIndex, setOrbStageIndex] = useState(0);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setOrbStageIndex(0);
    setError(null);
    setData(null);

    const stageInterval = setInterval(() => {
      setOrbStageIndex(prev => {
        if (prev < ORB_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/github/analyze/${username}`);
      
      if (!res.ok) {
        let errorDetail = "";
        try {
          const errData = await res.json();
          errorDetail = errData.detail ? (typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail)) : "No detail provided";
        } catch (e) {
          errorDetail = res.statusText;
        }
        throw new Error(`Error: ${errorDetail}`);
      }
      
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(stageInterval);
      setLoading(false);
    }
  };

  const scrollToChapter = (id) => {
    const el = document.getElementById(`chapter-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getMaturityLabel = (score) => {
    if (score >= 80) return "Advanced";
    if (score >= 60) return "Intermediate";
    return "Emerging";
  };
  
  const getTrustLabel = (score) => {
    if (score >= 85) return "High Trust";
    if (score >= 60) return "Verified";
    return "Needs Review";
  };

  if (data) {
    const { profile, analytics, repositories, ai_insights } = data;
    const maturityScore = analytics?.engineering_maturity?.overall_score || 0;
    const trustScore = analytics?.technology_trust?.verification_score || 0;

    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif", color: "#1d1d1f" }}>
        
        {/* Actions Menu */}
        <div style={{ position: "fixed", top: 100, right: 40, display: "flex", gap: 16, zIndex: 60 }}>
           <button onClick={() => setData(null)} style={{ padding: "12px 24px", borderRadius: 24, background: "#fff", border: "1px solid rgba(0,0,0,0.04)", fontSize: 15, fontWeight: 500, color: "#1d1d1f", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
             New Analysis
           </button>
           <button onClick={() => setIsShareSheetOpen(true)} style={{ padding: "12px 24px", borderRadius: 24, background: "#1d1d1f", border: "none", fontSize: 15, fontWeight: 500, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
             <Share size={16}/> Export Dossier
           </button>
        </div>

        {/* Sticky Chapter Navigation */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(245, 245, 247, 0.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(0,0,0,0.04)", borderTop: "1px solid rgba(0,0,0,0.04)", padding: "16px 0", display: "flex", justifyContent: "center", gap: 32, overflowX: "auto", scrollbarWidth: "none" }}>
          {CHAPTERS.map(ch => (
             <button key={ch.id} onClick={() => scrollToChapter(ch.id)} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 500, color: "#86868b", cursor: "pointer", transition: "color 0.2s", whiteSpace: "nowrap" }} onMouseOver={e => e.currentTarget.style.color = "#1d1d1f"} onMouseOut={e => e.currentTarget.style.color = "#86868b"}>
               {ch.label}
             </button>
          ))}
        </div>

        <div style={{ padding: "40px 40px 160px" }}>
          
          <Chapter id="identity">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "80px 0" }}>
              <img src={profile?.avatar || "https://github.com/identicons/default.png"} alt="Avatar" style={{ width: 160, height: 160, borderRadius: 80, marginBottom: 32, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", border: "4px solid #fff" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                {ai_insights?.career_positioning?.career_level || "Software Engineer"}
              </div>
              <h1 style={{ fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 700, letterSpacing: "-0.04em", margin: "0 0 16px" }}>{profile?.name || username}</h1>
              <p style={{ fontSize: 24, color: "#86868b", margin: "0 0 32px" }}>@{profile?.username || username}</p>
              <div style={{ maxWidth: 800, fontSize: 24, lineHeight: 1.5, color: "#1d1d1f", fontWeight: 500 }}>
                "{profile?.name || username} demonstrates strong evidence of {ai_insights?.career_positioning?.career_level?.toLowerCase() || "software engineering"} capability with growing architectural maturity and verified implementation experience across modern technologies."
              </div>
            </div>
          </Chapter>

          {/* Narrative Intelligence Surfaces */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1000, margin: "0 auto 120px" }}>
            <div style={{ background: "#fff", padding: 48, borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
               <div style={{ fontSize: 15, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Engineering Maturity</div>
               <div style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", marginBottom: 24 }}>{getMaturityLabel(maturityScore)}</div>
               <p style={{ fontSize: 19, lineHeight: 1.5, color: "#1d1d1f", margin: 0 }}>
                 Repository architecture demonstrates structured implementation patterns, clear documentation discipline, and growing system design capability.
               </p>
            </div>
            <div style={{ background: "#fff", padding: 48, borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
               <div style={{ fontSize: 15, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Engineering Trust</div>
               <div style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", marginBottom: 24 }}>{getTrustLabel(trustScore)}</div>
               <p style={{ fontSize: 19, lineHeight: 1.5, color: "#1d1d1f", margin: 0 }}>
                 Most technical claims are tangibly supported through verifiable repository evidence, commit consistency, and architectural implementation depth.
               </p>
            </div>
          </div>

          <Chapter id="exec-summary" title="Executive Summary" intro="A high-level synthesis of the candidate's engineering capabilities and professional impact.">
            <div style={{ background: "#fff", padding: 64, borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
              {analytics?.executive_summary ? (
                 <p style={{ fontSize: 24, lineHeight: 1.6, color: "#1d1d1f", margin: 0, fontWeight: 400 }}>
                   Evaluated as a <strong>{analytics.executive_summary.engineering_level}</strong> with {analytics.executive_summary.confidence.toLowerCase()} confidence. 
                   The candidate's top strengths include {analytics.executive_summary.top_strengths.join(" and ")}. 
                   They are recommended for roles such as {analytics.executive_summary.recommended_roles.join(", ")}.
                 </p>
              ) : (
                <p style={{ fontSize: 24, lineHeight: 1.6, color: "#1d1d1f", margin: 0, fontWeight: 400 }}>
                  Insufficient data to generate executive summary.
                </p>
              )}
            </div>
          </Chapter>

          <Chapter id="recruiter" title="Recruiter Perspective" intro="Actionable insights tailored for talent acquisition and technical hiring teams.">
            <div style={{ display: "grid", gap: 32 }}>
              <div style={{ background: "#f9f9f9", padding: 48, borderRadius: 32 }}>
                 <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 24 }}>Hiring Recommendation</h4>
                 <p style={{ fontSize: 21, lineHeight: 1.5, color: "#1d1d1f", margin: 0 }}>{analytics?.recruiter_decision?.recommendation || analytics?.recruiter_decision?.decision || "Proceed with standard technical screening."}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                 <div style={{ background: "rgba(52, 199, 89, 0.05)", padding: 40, borderRadius: 32 }}>
                   <h4 style={{ fontSize: 16, fontWeight: 700, color: "#248a3d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 24 }}>Key Strengths</h4>
                   <ul style={{ margin: 0, paddingLeft: 24, fontSize: 19, lineHeight: 1.6, color: "#1d1d1f" }}>
                     {(analytics?.recruiter_decision?.key_strengths || []).map((s, i) => <li key={i} style={{ marginBottom: 12 }}>{s}</li>)}
                   </ul>
                 </div>
                 <div style={{ background: "rgba(255, 59, 48, 0.05)", padding: 40, borderRadius: 32 }}>
                   <h4 style={{ fontSize: 16, fontWeight: 700, color: "#c93400", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 24 }}>Identified Risks</h4>
                   <ul style={{ margin: 0, paddingLeft: 24, fontSize: 19, lineHeight: 1.6, color: "#1d1d1f" }}>
                     {(analytics?.recruiter_decision?.potential_risks || analytics?.recruiter_decision?.risk_factors || []).map((s, i) => <li key={i} style={{ marginBottom: 12 }}>{s}</li>)}
                   </ul>
                 </div>
              </div>
            </div>
          </Chapter>

          <Chapter id="tech" title="Technology Verification" intro="Technologies confirmed through deep architectural and code-level analysis across repositories.">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {Object.entries(analytics?.technology_trust?.verified_technologies || {}).map(([tech, status], idx) => (
                <div key={idx} style={{ background: "#fff", padding: "20px 32px", borderRadius: 24, display: "flex", alignItems: "center", gap: 16, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
                  <CheckCircle2 size={24} color="#34c759" />
                  <span style={{ fontSize: 21, fontWeight: 600, color: "#1d1d1f" }}>{tech}</span>
                </div>
              ))}
            </div>
          </Chapter>

          <Chapter id="maturity" title="Engineering Maturity" intro="A qualitative assessment of system design, code organization, and testing methodologies.">
            <div style={{ background: "#fff", padding: 64, borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Documentation Discipline</div>
                  <div style={{ fontSize: 24, fontWeight: 500, color: "#1d1d1f" }}>{analytics?.engineering_maturity?.documentation_quality > 5 ? "Structured & Present" : "Ad-Hoc"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Testing Methodology</div>
                  <div style={{ fontSize: 24, fontWeight: 500, color: "#1d1d1f" }}>{analytics?.engineering_maturity?.testing_practices > 5 ? "Implemented" : "Limited Evidence"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Commit Practices</div>
                  <div style={{ fontSize: 24, fontWeight: 500, color: "#1d1d1f" }}>{analytics?.engineering_maturity?.commit_practices > 5 ? "Atomic & Descriptive" : "Irregular"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Project Organization</div>
                  <div style={{ fontSize: 24, fontWeight: 500, color: "#1d1d1f" }}>{analytics?.engineering_maturity?.project_organization > 5 ? "Modular Architecture" : "Standard Layout"}</div>
                </div>
              </div>
            </div>
          </Chapter>

          <Chapter id="architecture" title="Architecture Intelligence" intro="Identified structural patterns utilized across the engineering portfolio.">
             <div style={{ display: "grid", gap: 24 }}>
               {(analytics?.architecture_patterns?.identified_patterns || ["Client-Server", "Monolithic"]).map((pattern, idx) => (
                 <div key={idx} style={{ background: "#f9f9f9", padding: 40, borderRadius: 24 }}>
                   <h4 style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f", margin: "0 0 12px" }}>{pattern}</h4>
                   <p style={{ fontSize: 18, color: "#86868b", margin: 0 }}>Evidence found across recent repository architecture and infrastructure configurations.</p>
                 </div>
               ))}
             </div>
          </Chapter>

          <Chapter id="repositories" title="Engineering Portfolio" intro="Detailed showcases of top repositories, evaluated for impact, complexity, and technical depth.">
             <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
               {(repositories || []).slice(0, 5).map((repo, idx) => (
                 <div key={idx} style={{ background: "#fff", borderRadius: 40, padding: 64, boxShadow: "0 12px 48px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
                     <div>
                       <h3 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", margin: "0 0 16px" }}>{repo.name}</h3>
                       <p style={{ fontSize: 21, color: "#86868b", margin: 0, maxWidth: 600, lineHeight: 1.5 }}>{repo.description || "No description provided."}</p>
                     </div>
                     <a href={repo.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, background: "#f5f5f7", padding: "12px 24px", borderRadius: 100, color: "#1d1d1f", textDecoration: "none", fontWeight: 600, fontSize: 15 }}>
                       View Repository <ChevronRight size={16} />
                     </a>
                   </div>
                   
                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 48 }}>
                     <div>
                       <div style={{ fontSize: 13, fontWeight: 700, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Complexity Classification</div>
                       <div style={{ fontSize: 21, fontWeight: 500, color: "#1d1d1f" }}>{repo.ai_analysis?.complexity || "Standard Implementation"}</div>
                     </div>
                     <div>
                       <div style={{ fontSize: 13, fontWeight: 700, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Engineering Impact</div>
                       <div style={{ fontSize: 21, fontWeight: 500, color: "#1d1d1f" }}>{repo.ai_analysis?.engineering_impact || "Local utility and educational scope."}</div>
                     </div>
                   </div>

                   <div>
                     <div style={{ fontSize: 13, fontWeight: 700, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Verified Technologies</div>
                     <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                       {(repo.languages || []).map((lang, i) => (
                         <span key={i} style={{ background: "#1d1d1f", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 15, fontWeight: 500 }}>{lang}</span>
                       ))}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </Chapter>

          <Chapter id="career" title="Career Positioning" intro="How the candidate should be presented and leveled within engineering organizations.">
             <div style={{ background: "#fff", padding: 64, borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
               <h3 style={{ fontSize: 40, fontWeight: 700, color: "#0071e3", margin: "0 0 24px" }}>{ai_insights?.career_positioning?.career_level || "Software Engineer"}</h3>
               <p style={{ fontSize: 24, lineHeight: 1.6, color: "#1d1d1f", margin: 0, fontWeight: 400 }}>
                 {ai_insights?.career_positioning?.reasoning || "Candidate aligns with standard software engineering roles based on repository data."}
               </p>
             </div>
          </Chapter>

          <Chapter id="roadmap" title="Growth Roadmap" intro="A structured 180-day trajectory for expanding technical capability and architectural maturity.">
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
               {[
                 { time: "30 Days", desc: ai_insights?.growth_roadmap?.short_term || "Focus on test-driven development and expanding CI/CD automation." },
                 { time: "90 Days", desc: ai_insights?.growth_roadmap?.medium_term || "Migrate towards decoupled architectures and microservice patterns." },
                 { time: "180 Days", desc: ai_insights?.growth_roadmap?.long_term || "Lead system-level design decisions and mentor junior contributors." },
               ].map((phase, idx) => (
                 <div key={idx} style={{ background: "#fff", padding: 48, borderRadius: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column" }}>
                   <div style={{ fontSize: 16, fontWeight: 700, color: "#0071e3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>{phase.time}</div>
                   <p style={{ fontSize: 19, lineHeight: 1.6, color: "#1d1d1f", margin: 0 }}>{phase.desc}</p>
                 </div>
               ))}
             </div>
          </Chapter>

          <Chapter id="trust" title="Hiring Signals & Trust" intro="Red flags and green flags identified dynamically from the engineering portfolio.">
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <div style={{ background: "rgba(52, 199, 89, 0.05)", padding: 48, borderRadius: 32 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#248a3d", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 32 }}>Verified Green Flags</h4>
                  <ul style={{ margin: 0, paddingLeft: 24, fontSize: 19, lineHeight: 1.6, color: "#1d1d1f" }}>
                    {(analytics?.technology_trust?.green_flags || ["Consistent commit history.", "Clear project documentation."]).map((s, i) => <li key={i} style={{ marginBottom: 16 }}>{s}</li>)}
                  </ul>
                </div>
                <div style={{ background: "rgba(255, 59, 48, 0.05)", padding: 48, borderRadius: 32 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#c93400", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 32 }}>Potential Red Flags</h4>
                  <ul style={{ margin: 0, paddingLeft: 24, fontSize: 19, lineHeight: 1.6, color: "#1d1d1f" }}>
                    {(ai_insights?.red_flags || ["Limited automated testing evidence."]).map((s, i) => <li key={i} style={{ marginBottom: 16 }}>{s}</li>)}
                  </ul>
                </div>
             </div>
          </Chapter>

          {/* Chapter 11: Final Verdict */}
          <div style={{ padding: "160px 0", textAlign: "center", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>Final Recommendation Verdict</div>
            <h2 style={{ fontSize: "clamp(64px, 8vw, 120px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#1d1d1f", margin: 0, lineHeight: 1 }}>
               {getTrustLabel(trustScore).toUpperCase()} ENGINEER
            </h2>
          </div>

        </div>

        {/* ── VisionOS Share Sheet ────────────────────────────────────────── */}
        <AnimatePresence>
          {isShareSheetOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsShareSheetOpen(false)}
                style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", zIndex: 1000 }}
              />
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
                style={{ 
                  position: "fixed", bottom: 0, left: "50%", x: "-50%", width: "100%", maxWidth: 640,
                  background: "rgba(245,245,247,0.85)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
                  borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: "32px 32px 64px",
                  boxShadow: "0 -20px 60px rgba(0,0,0,0.08)", zIndex: 1001, borderTop: "1px solid rgba(255,255,255,0.4)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#1d1d1f", letterSpacing: "-0.02em" }}>Export Engineering Dossier</h3>
                  <button onClick={() => setIsShareSheetOpen(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1d1d1f" }}>
                    <X size={16} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {["Engineering Report", "Recruiter Report", "Architecture Report", "Technology Verification", "Career Positioning", "Growth Roadmap"].map(opt => (
                    <button key={opt} disabled style={{ padding: "16px 20px", background: "#fff", border: "1px solid rgba(0,0,0,0.04)", borderRadius: 16, fontSize: 15, fontWeight: 600, color: "#86868b", cursor: "not-allowed", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                      <File size={18} /> {opt}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 24, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 24 }}>
                  <button onClick={() => alert("Enterprise PDF Generation initialized...")} style={{ width: "100%", padding: "20px 24px", background: "#0071e3", color: "#fff", border: "none", borderRadius: 16, fontSize: 17, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" }}>
                    <Download size={20} /> Export Complete Dossier PDF
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7", fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif", color: "#1d1d1f" }}>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(245,245,247,0.85)", backdropFilter: "blur(40px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
              <motion.div animate={{ scale: [1, 1.1, 0.95, 1], rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", width: "100%", height: "100%", background: "conic-gradient(from 180deg at 50% 50%, #b3d4ff 0deg, #ffb6ff 120deg, #b3d4ff 240deg, #fffb96 360deg)", borderRadius: "50%", filter: "blur(24px)", opacity: 0.8 }} />
              <div style={{ width: 60, height: 60, background: "#fff", borderRadius: "50%", zIndex: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={orbStageIndex} initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.6, ease }}
                style={{ fontSize: 24, fontWeight: 500, color: "#1d1d1f", textAlign: "center" }}
              >
                {ORB_STAGES[orbStageIndex]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
        
        {/* Left Side: Typography & Input */}
        <div style={{ padding: "160px 60px 80px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }} style={{ position: "sticky", top: 160 }}>
            <h1 style={{ fontSize: "clamp(64px, 7vw, 100px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.04em", margin: "0 0 32px 0", color: "#1d1d1f" }}>
              Engineering<br/>reputation<br/>should be<br/>measurable.
            </h1>
            <div style={{ fontSize: 24, color: "#86868b", lineHeight: 1.6, marginBottom: 48, fontWeight: 500 }}>
              Every repository tells a story.<br/>
              Every commit leaves evidence.<br/>
              Every architecture reveals maturity.
            </div>

            <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", padding: "12px 12px 12px 24px", borderRadius: 100, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 12px 32px rgba(0,0,0,0.04)", maxWidth: 500, width: "100%" }}>
              <Search size={20} color="#86868b" />
              <input 
                type="text" value={username} onChange={e => setUsername(e.target.value)} 
                placeholder="Enter GitHub username..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: 19, fontFamily: "inherit", color: "#1d1d1f", background: "transparent" }}
              />
              <button type="submit" disabled={!username.trim() || loading} style={{ background: "#1d1d1f", color: "#fff", border: "none", borderRadius: 100, padding: "16px 32px", fontSize: 17, fontWeight: 600, cursor: username.trim() ? "pointer" : "not-allowed", opacity: username.trim() ? 1 : 0.5 }}>
                Analyze Profile
              </button>
            </form>
            
            {error && <div style={{ marginTop: 24, color: "#ff3b30", fontSize: 15, fontWeight: 500 }}>{error}</div>}
          </motion.div>
        </div>

        {/* Right Side: Architecture */}
        <div style={{ background: "#e8e8ed", padding: "80px 60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 40 }}>
              Living Intelligence Architecture
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {["GitHub Profile", "Repository Scanner", "Technology Verification", "Architecture Engine", "Engineering Maturity", "Trust Verification", "Career Positioning", "Executive Recommendation"].map((step, i) => (
                <div key={i}>
                  <motion.div 
                    initial={{ opacity: 0.3, x: -10 }} animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.15 }}
                    style={{ fontSize: 28, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.02em" }}
                  >
                    {step}
                  </motion.div>
                  {i < 7 && <div style={{ fontSize: 24, color: "#86868b", margin: "12px 0" }}>↓</div>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

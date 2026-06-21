import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Download, ShieldAlert, Cpu, 
  Target, CheckCircle, Crosshair, Map, ClipboardList,
  Share, File, ChevronRight, X
} from "lucide-react";
import InterviewScorecard from "./InterviewScorecard";
import InterviewCoverageDashboard from "./InterviewCoverageDashboard";
import SkillHeatmapDashboard from "./SkillHeatmapDashboard";
import InterviewOutcomeDashboard from "./InterviewOutcomeDashboard";
import HiringDecisionCenter from "./HiringDecisionCenter";

const CHAPTERS = [
  { id: "readiness", label: "Readiness" },
  { id: "strengths", label: "Strengths" },
  { id: "validation", label: "Validation" },
  { id: "risk", label: "Risk" },
  { id: "blueprint", label: "Blueprint" },
  { id: "behavioral", label: "Behavioral" },
  { id: "scorecard", label: "Scorecard" },
  { id: "skills", label: "Skills" },
  { id: "decision", label: "Decision" },
];

const Chapter = ({ id, title, intro, children }) => (
  <div id={`chapter-${id}`} style={{ padding: "100px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 48, textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
        <h3 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", color: "#1d1d1f", margin: "0 0 16px" }}>{title}</h3>
        <p style={{ fontSize: 17, color: "#86868b", lineHeight: 1.6, margin: 0 }}>{intro}</p>
      </div>
      {children}
    </div>
  </div>
);

export default function InterviewReportCenter({ data, resumeFile, reset }) {
  const [outcomeResponse, setOutcomeResponse] = useState(null);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  
  if (!data) return null;

  const {
    readiness,
    blueprint,
    skill_validation_strategy,
    risk_investigation_strategy,
    interview_simulation,
    scorecard
  } = data;

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case "Advanced": return "#ef4444";
      case "Intermediate": return "#f59e0b";
      case "Beginner": return "#10b981";
      default: return "#6b7280";
    }
  };

  const scrollToChapter = (id) => {
    const el = document.getElementById(`chapter-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div id="interview-intelligence-report" style={{ position: "relative" }}>
      
      <style>{`
        #interview-intelligence-report div[style*="rgba(255,255,255,0.05)"],
        #interview-intelligence-report div[style*="rgba(255, 255, 255, 0.05)"] {
          background: #ffffff !important;
          border-color: rgba(0,0,0,0.08) !important;
          color: #1d1d1f !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.03) !important;
        }
        #interview-intelligence-report div[style*="rgba(255,255,255,0.1)"] {
          background: #f9f9f9 !important;
          border-color: rgba(0,0,0,0.06) !important;
          color: #1d1d1f !important;
        }
        #interview-intelligence-report span[style*="#fff"],
        #interview-intelligence-report h1[style*="#fff"],
        #interview-intelligence-report h2[style*="#fff"],
        #interview-intelligence-report h3[style*="#fff"],
        #interview-intelligence-report h4[style*="#fff"],
        #interview-intelligence-report p[style*="#fff"],
        #interview-intelligence-report div[style*="color: '#fff'"],
        #interview-intelligence-report div[style*="color: white"],
        #interview-intelligence-report div[style*="color: \\"white\\""] {
          color: #1d1d1f !important;
        }
        #interview-intelligence-report span[style*="#d1d5db"],
        #interview-intelligence-report p[style*="#d1d5db"],
        #interview-intelligence-report div[style*="#d1d5db"],
        #interview-intelligence-report span[style*="#9ca3af"],
        #interview-intelligence-report p[style*="#9ca3af"],
        #interview-intelligence-report div[style*="#9ca3af"],
        #interview-intelligence-report div[style*="color: '#9ca3af'"] {
          color: #86868b !important;
        }
        #interview-intelligence-report div[style*="background: '#e5e7eb'"],
        #interview-intelligence-report div[style*="background: #e5e7eb"] {
          background: rgba(0,0,0,0.1) !important;
        }
        #interview-intelligence-report h2, #interview-intelligence-report h3 {
          color: #1d1d1f !important;
        }
      `}</style>

      {/* Top Actions */}
      <div style={{ position: "absolute", top: 120, right: 40, display: "flex", gap: 16, zIndex: 60 }}>
         <button onClick={reset} style={{ padding: "12px 24px", borderRadius: 24, background: "#fff", border: "1px solid rgba(0,0,0,0.04)", fontSize: 15, fontWeight: 500, color: "#1d1d1f", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
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
          {resumeFile?.name?.replace(/\.[^.]+$/, "") || "Interview Intelligence Report"}
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
        
        <Chapter id="readiness" title="Interview Readiness" intro="Aggregated simulation of candidate preparedness against role complexity and market benchmarks.">
          <div style={{ background: "rgba(255,255,255,0.05)", padding: 40, borderRadius: 24, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: "4rem", fontWeight: 800, color: readiness.readiness_score >= 70 ? "#10b981" : "#f59e0b", lineHeight: 0.8 }}>
                {readiness.readiness_score}
              </span>
              <span style={{ fontSize: "1.2rem", color: "#86868b", fontWeight: 500, paddingBottom: 4 }}>/ 100</span>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: "0.8rem", color: "#86868b", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Difficulty Classification</div>
              <span style={{ background: `${getDifficultyColor(readiness.interview_difficulty)}15`, color: getDifficultyColor(readiness.interview_difficulty), padding: "6px 12px", borderRadius: 100, fontSize: "0.85rem", fontWeight: 700 }}>
                {readiness.interview_difficulty}
              </span>
            </div>
          </div>
        </Chapter>

        <Chapter id="strengths" title="Candidate Strengths" intro="Identified areas of verified expertise to leverage during the interview process.">
          <div style={{ background: "rgba(255,255,255,0.05)", padding: 40, borderRadius: 24, border: "1px solid rgba(0,0,0,0.08)" }}>
            <ul style={{ paddingLeft: 20, margin: 0, color: "#1d1d1f", fontSize: "1.05rem", lineHeight: 1.6 }}>
              {readiness.strengths.map((s, i) => <li key={i} style={{ marginBottom: 12 }}>{s}</li>)}
            </ul>
          </div>
        </Chapter>

        <Chapter id="validation" title="Validation Areas" intro="Targeted probing for skills claimed without strong external evidence.">
          {skill_validation_strategy.length === 0 ? (
            <div style={{ padding: 32, background: "#fff", borderRadius: 24, textAlign: "center", color: "#86868b" }}>
              All claimed skills possess strong external evidence. No targeted validation required.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 24 }}>
              {skill_validation_strategy.map((sv, idx) => (
                <div key={idx} style={{ padding: 32, background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 20px" }}>{sv.skill} Verification</h3>
                  <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                    {sv.questions.map((q, i) => (
                      <li key={i} style={{ fontSize: "1.05rem", color: "#1d1d1f", lineHeight: 1.5 }}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Chapter>

        <Chapter id="risk" title="Risk Signals" intro="Critical questions to uncover red flags identified by the intelligence pipeline.">
          {risk_investigation_strategy.length === 0 ? (
            <div style={{ padding: 32, background: "#fff", borderRadius: 24, textAlign: "center", color: "#86868b" }}>
              No critical risks identified.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 24 }}>
              {risk_investigation_strategy.map((risk, idx) => (
                <div key={idx} style={{ padding: 32, background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: 24 }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#b91c1c", margin: "0 0 20px" }}>Risk: {risk.risk_factor}</h3>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#991b1b", textTransform: "uppercase", marginBottom: 12 }}>Probing Questions:</div>
                    <ul style={{ margin: 0, paddingLeft: 20, color: "#7f1d1d", fontSize: "1rem", lineHeight: 1.5 }}>
                      {risk.probing_questions.map((q, i) => <li key={i} style={{ marginBottom: 8 }}>{q}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#991b1b", textTransform: "uppercase", marginBottom: 12 }}>Watch For Red Flag Signals:</div>
                    <ul style={{ margin: 0, paddingLeft: 20, color: "#b91c1c", fontSize: "1rem", lineHeight: 1.5 }}>
                      {risk.red_flag_signals.map((signal, i) => <li key={i} style={{ marginBottom: 8 }}>{signal}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Chapter>

        <Chapter id="blueprint" title="Technical Blueprint" intro="Dynamic interview round structure mapped to role requirements and duration.">
          <div style={{ background: "#fff", padding: 40, borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1d1d1f", margin: 0 }}>Round Architecture</h2>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#8b5cf6", background: "rgba(139, 92, 246, 0.1)", padding: "6px 14px", borderRadius: 100 }}>
                Total: {blueprint.total_duration_hours} Hours
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {blueprint.rounds.map((round) => (
                <div key={round.round_number} style={{ display: "flex", gap: 24 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem" }}>
                      {round.round_number}
                    </div>
                    {round.round_number !== blueprint.rounds.length && (
                      <div style={{ width: 2, height: "100%", background: "rgba(0,0,0,0.1)", marginTop: 12 }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: round.round_number !== blueprint.rounds.length ? 32 : 0, flex: 1 }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1d1d1f", margin: "0 0 8px" }}>{round.round_name}</h3>
                    <div style={{ fontSize: "0.95rem", color: "#86868b", fontWeight: 500, marginBottom: 16 }}>
                      {round.duration_minutes} Minutes • Interviewer: {round.suggested_interviewer}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {round.focus_areas.map((focus, i) => (
                        <span key={i} style={{ fontSize: "0.9rem", color: "#1d1d1f", background: "#f5f5f7", padding: "6px 12px", borderRadius: 8, fontWeight: 500 }}>
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Chapter>

        <Chapter id="behavioral" title="Behavioral Assessment" intro="Intelligent interview simulation focusing on soft skills, culture fit, and weak signal detection.">
          {interview_simulation && interview_simulation.length > 0 ? (
             interview_simulation.map((category, idx) => (
               <div key={idx} style={{ marginBottom: 48 }}>
                 <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1d1d1f", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 16, marginBottom: 24 }}>
                   {category.category}
                 </h3>
                 <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                 {category.questions.map((q, i) => (
                   <div key={i} style={{ padding: 32, background: "#fff", borderRadius: 24, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                       <p style={{ fontSize: "1.15rem", fontWeight: 600, color: "#1d1d1f", margin: 0, flex: 1, paddingRight: 24, lineHeight: 1.5 }}>
                         {q.question}
                       </p>
                       <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#3b82f6", background: "rgba(59, 130, 246, 0.1)", padding: "6px 12px", borderRadius: 100 }}>
                         {q.difficulty_classification}
                       </span>
                     </div>

                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                       <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 12, borderLeft: "4px solid #10b981" }}>
                         <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", marginBottom: 12 }}>Expected Strong Themes</div>
                         <ul style={{ margin: 0, paddingLeft: 16, fontSize: "0.95rem", color: "#1d1d1f", lineHeight: 1.5 }}>
                           {q.expected_strong_answer_themes.map((t, idx) => <li key={idx} style={{ marginBottom: 6 }}>{t}</li>)}
                         </ul>
                       </div>
                       <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 12, borderLeft: "4px solid #f59e0b" }}>
                         <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", marginBottom: 12 }}>Weak Signals</div>
                         <ul style={{ margin: 0, paddingLeft: 16, fontSize: "0.95rem", color: "#1d1d1f", lineHeight: 1.5 }}>
                           {q.expected_weak_answer_signals.map((t, idx) => <li key={idx} style={{ marginBottom: 6 }}>{t}</li>)}
                         </ul>
                       </div>
                     </div>

                     <div style={{ background: "#f5f5f7", padding: 20, borderRadius: 12 }}>
                       <div style={{ fontSize: "0.85rem", color: "#86868b", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Evaluation Criteria</div>
                       <div style={{ fontSize: "1rem", fontWeight: 500, color: "#10b981" }}>{q.evaluation_criteria}</div>
                     </div>

                     {q.red_flag_responses.length > 0 && (
                       <div style={{ marginTop: 16, color: "#ef4444", fontSize: "0.9rem", fontWeight: 600 }}>
                         🚨 RED FLAG: {q.red_flag_responses[0]}
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           ))
          ) : (
             <div style={{ padding: 32, background: "#fff", borderRadius: 24, textAlign: "center", color: "#86868b" }}>
               No simulation data available. Please regenerate the report.
             </div>
          )}
        </Chapter>

        <Chapter id="scorecard" title="Interview Scorecard" intro="A standardized rubric to measure candidate performance across competencies.">
           <InterviewScorecard scorecard={scorecard} />
        </Chapter>

        <Chapter id="skills" title="Skill Assessment" intro="Heatmap mapping explicit requirements against detected proficiency levels.">
          {data.heatmap ? (
            <SkillHeatmapDashboard heatmap={data.heatmap} />
          ) : (
            <div style={{ background: "#fff", padding: 40, borderRadius: 24, textAlign: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: "1.2rem", color: "#1d1d1f", marginBottom: 12 }}>V2 Intelligence Required</h3>
              <p style={{ color: "#86868b" }}>Skill Heatmap requires the V2 backend. Please go back to the upload screen and regenerate.</p>
            </div>
          )}
        </Chapter>

        <Chapter id="decision" title="Executive Strategy" intro="The final boardroom recommendation on how to proceed with the candidate.">
           <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
             <InterviewOutcomeDashboard rawIntelligence={data.raw_intelligence || {}} onOutcomeGenerated={setOutcomeResponse} />
             {outcomeResponse && (
               <div style={{ marginTop: 40, borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 40 }}>
                 <HiringDecisionCenter response={outcomeResponse} />
               </div>
             )}
           </div>
        </Chapter>
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
                position: "fixed", bottom: 0, left: "50%", x: "-50%", width: "100%", maxWidth: 600,
                background: "rgba(245,245,247,0.85)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
                borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: "32px 32px 64px",
                boxShadow: "0 -20px 60px rgba(0,0,0,0.08)", zIndex: 1001,
                borderTop: "1px solid rgba(255,255,255,0.4)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#1d1d1f", letterSpacing: "-0.02em" }}>Export Dossier</h3>
                <button onClick={() => setIsShareSheetOpen(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1d1d1f" }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {["Interview Blueprint", "Validation Report", "Risk Assessment", "Skill Assessment", "Executive Brief"].map(opt => (
                  <button key={opt} disabled style={{ padding: "16px 20px", background: "#fff", border: "1px solid rgba(0,0,0,0.04)", borderRadius: 16, fontSize: 15, fontWeight: 600, color: "#86868b", cursor: "not-allowed", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
                    <File size={18} /> {opt}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 24, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 24 }}>
                <button disabled={!outcomeResponse} style={{ width: "100%", padding: "18px 24px", background: outcomeResponse ? "#0071e3" : "rgba(0,113,227,0.3)", color: "#fff", border: "none", borderRadius: 16, fontSize: 16, fontWeight: 600, cursor: outcomeResponse ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "background 0.2s" }}>
                  <Download size={18} /> Download Master PDF
                </button>
                {!outcomeResponse && <p style={{ fontSize: 13, color: "#86868b", textAlign: "center", marginTop: 12 }}>Generate Executive Strategy first to export Master PDF.</p>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

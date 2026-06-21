import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Filter, BarChart3, Target, Award, ArrowLeft, Download, ShieldAlert, Cpu } from "lucide-react";

export default function TalentIntelligenceCommandCenter({ data, reset }) {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, candidates, funnel, audit
  
  if (!data) return null;

  const { rankings, pool_analytics, hiring_funnel, audit_summary } = data;

  const getSegmentColor = (segment) => {
    switch(segment) {
      case "Elite Candidate": return "#8b5cf6"; // Purple
      case "Strong Hire": return "#10b981"; // Green
      case "Hire": return "#3b82f6"; // Blue
      case "Consider": return "#f59e0b"; // Orange
      case "Borderline": return "#6366f1"; // Indigo
      default: return "#ef4444"; // Red
    }
  };

  const MetricCard = ({ title, value, icon, sub }) => (
    <div style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
      <div style={{ padding: 12, borderRadius: 12, background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed" }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{value}</div>
        {sub && <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "80px 32px 60px", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <button 
              onClick={reset}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, padding: 0, marginBottom: 12 }}
            >
              <ArrowLeft size={14} /> Back to Upload
            </button>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", margin: 0 }}>
              Talent Command Center
            </h1>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#111827", color: "white", border: "none", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer"
          }}>
            <Download size={16} /> Export PDF Report
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid #e5e7eb", paddingBottom: 16 }}>
          {[
            { id: "dashboard", label: "Executive Dashboard", icon: <BarChart3 size={16} /> },
            { id: "candidates", label: "Ranked Shortlist", icon: <Users size={16} /> },
            { id: "funnel", label: "Hiring Funnel", icon: <Target size={16} /> },
            { id: "audit", label: "Explainability Audit", icon: <ShieldAlert size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                background: activeTab === tab.id ? "white" : "transparent",
                color: activeTab === tab.id ? "#7c3aed" : "#6b7280",
                border: activeTab === tab.id ? "1px solid rgba(124, 58, 237, 0.2)" : "1px solid transparent",
                boxShadow: activeTab === tab.id ? "0 2px 8px rgba(124, 58, 237, 0.05)" : "none"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: DASHBOARD */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
              <MetricCard title="Total Candidates" value={hiring_funnel.total_applicants} icon={<Users size={24} />} sub="Processed in this batch" />
              <MetricCard title="Interview Ready" value={hiring_funnel.interview_ready} icon={<Target size={24} />} sub="High & Urgent Priority" />
              <MetricCard title="Elite Candidates" value={rankings.filter(r => r.segment === "Elite Candidate").length} icon={<Award size={24} />} sub="Top Tier Matches" />
              <MetricCard title="Avg Match Score" value={`${pool_analytics.average_match_score}%`} icon={<BarChart3 size={24} />} sub="Across talent pool" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ background: "white", padding: 24, borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", marginBottom: 20 }}>Top Verified Technologies</h3>
                {pool_analytics.top_verified_technologies.map((t, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: "0.95rem", color: "#374151", fontWeight: 500 }}>{t.skill}</span>
                    <span style={{ fontSize: "0.85rem", color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "4px 10px", borderRadius: 100, fontWeight: 600 }}>
                      {t.count} candidates
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ background: "white", padding: 24, borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827", marginBottom: 20 }}>Critical Skill Gaps (Pool-wide)</h3>
                {pool_analytics.top_missing_technologies.map((t, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: "0.95rem", color: "#374151", fontWeight: 500 }}>{t.skill}</span>
                    <span style={{ fontSize: "0.85rem", color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "4px 10px", borderRadius: 100, fontWeight: 600 }}>
                      Missing in {t.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: RANKED SHORTLIST */}
        {activeTab === "candidates" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>
                    <th style={{ padding: "16px 24px", fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Rank</th>
                    <th style={{ padding: "16px 24px", fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Candidate</th>
                    <th style={{ padding: "16px 24px", fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Segment</th>
                    <th style={{ padding: "16px 24px", fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Final Score</th>
                    <th style={{ padding: "16px 24px", fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Interview Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((c, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "16px 24px", fontWeight: 700, color: "#111827", fontSize: "1.1rem" }}>#{c.rank}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ fontWeight: 600, color: "#111827" }}>{c.candidate_name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{c.intelligence.experience_level}</div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ background: `${getSegmentColor(c.segment)}15`, color: getSegmentColor(c.segment), padding: "4px 10px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                          {c.segment}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 6, background: "#e5e7eb", borderRadius: 3 }}>
                            <div style={{ width: `${c.final_talent_score}%`, height: "100%", background: getSegmentColor(c.segment), borderRadius: 3 }} />
                          </div>
                          <span style={{ fontWeight: 700, color: "#111827" }}>{c.final_talent_score}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ fontWeight: 600, color: c.interview_priority === "Urgent" ? "#ef4444" : c.interview_priority === "High" ? "#f59e0b" : "#6b7280" }}>
                          {c.interview_priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: FUNNEL */}
        {activeTab === "funnel" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "white", padding: 40, borderRadius: 24, border: "1px solid rgba(0,0,0,0.05)", width: "100%", maxWidth: 800 }}>
              <h2 style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: 40 }}>Hiring Funnel Analytics</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
                {[
                  { label: "Total Applicants", value: hiring_funnel.total_applicants, width: "100%", color: "#9ca3af" },
                  { label: "Qualified (Match > 50)", value: hiring_funnel.qualified, width: "80%", color: "#3b82f6" },
                  { label: "Strong Fits (Match > 75)", value: hiring_funnel.strong_fits, width: "60%", color: "#10b981" },
                  { label: "Interview Ready", value: hiring_funnel.interview_ready, width: "40%", color: "#f59e0b" },
                  { label: "Finalists (Elite)", value: hiring_funnel.finalists, width: "20%", color: "#8b5cf6" }
                ].map((step, i) => (
                  <div key={i} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: step.width, background: `${step.color}20`, border: `1px solid ${step.color}`, padding: "16px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, color: "#374151" }}>{step.label}</span>
                      <span style={{ fontSize: "1.2rem", fontWeight: 700, color: step.color }}>{step.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB CONTENT: AUDIT */}
        {activeTab === "audit" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <div style={{ background: "white", padding: 32, borderRadius: 16, border: "1px solid rgba(0,0,0,0.05)" }}>
               <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                 <Cpu size={24} style={{ color: "#8b5cf6" }} /> Deterministic Algorithm Trace
               </h2>
               <p style={{ color: "#4b5563", marginBottom: 32 }}>
                 Every candidate's rank is fully explainable. Below are the exact traces for the top 3 candidates. No black-box AI was used in final scoring.
               </p>

               {rankings.slice(0, 3).map((c, i) => (
                 <div key={i} style={{ padding: 24, background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 16 }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                     <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827", margin: 0 }}>#{c.rank} {c.candidate_name}</h3>
                     <span style={{ fontWeight: 700, color: "#8b5cf6", fontSize: "1.2rem" }}>Score: {c.final_talent_score}</span>
                   </div>
                   
                   <div style={{ marginBottom: 16 }}>
                     <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Scoring Formula Evaluated:</span>
                     <code style={{ display: "block", padding: 12, background: "#111827", color: "#10b981", borderRadius: 8, marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                       {c.explainability.formula}
                     </code>
                   </div>

                   <div>
                     <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", marginBottom: 8, display: "block" }}>Weight Contributions:</span>
                     <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                       {Object.entries(c.explainability.weight_contributions).map(([key, val]) => (
                         <div key={key} style={{ background: "white", border: "1px solid #e5e7eb", padding: "6px 12px", borderRadius: 6, fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>
                           {key}: <span style={{ color: "#10b981", fontWeight: 700 }}>{val}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

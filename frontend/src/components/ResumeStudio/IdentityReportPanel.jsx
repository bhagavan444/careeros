import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Activity, Target, Zap, ArrowRight, BrainCircuit } from "lucide-react";

export default function IdentityReportPanel({ report, onProceed }) {
  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rs-creation-card"
      style={{ maxWidth: "700px", width: "100%", margin: "0 auto", cursor: "default" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div className="rs-creation-icon" style={{ background: "rgba(139, 92, 246, 0.1)", color: "#c084fc" }}>
          <BrainCircuit size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontFamily: "Outfit, sans-serif", fontWeight: 600, color: "#fff" }}>
            Professional Identity Report
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Source: {report.source}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%", marginBottom: "24px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "4px" }}>Target Role</div>
          <div style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 500 }}>{report.targetRole}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "4px" }}>Identity Score</div>
          <div style={{ fontSize: "1.1rem", color: "#10b981", fontWeight: 600 }}>{report.identityScore} / 100</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "4px" }}>Career Maturity</div>
          <div style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 500 }}>{report.careerMaturity}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "4px" }}>Recommended Focus</div>
          <div style={{ fontSize: "1.1rem", color: "#3b82f6", fontWeight: 500 }}>{report.recommendedFocus}</div>
        </div>
      </div>

      <div style={{ width: "100%", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "1rem", color: "#e2e8f0", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle size={16} color="#10b981" /> Identified Strengths
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {(report.strengths || []).map(s => (
            <span key={s} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "4px 10px", borderRadius: "99px", fontSize: "0.85rem" }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1rem", color: "#e2e8f0", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={16} color="#f59e0b" /> Critical Skill Gaps
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {(report.skillGaps || report.skill_gaps || []).map(g => (
            <span key={g} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", padding: "4px 10px", borderRadius: "99px", fontSize: "0.85rem" }}>
              {g}
            </span>
          ))}
        </div>
      </div>

      <button 
        className="rs-btn rs-btn-primary" 
        style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1.05rem" }}
        onClick={onProceed}
      >
        <Zap size={18} />
        Generate Resume Draft
        <ArrowRight size={18} style={{ marginLeft: "8px" }} />
      </button>

    </motion.div>
  );
}

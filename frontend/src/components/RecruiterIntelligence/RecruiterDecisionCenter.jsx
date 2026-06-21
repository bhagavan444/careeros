import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function RecruiterDecisionCenter({ recommendation, match, risks, job }) {
  if (!recommendation) return null;

  // Map recommendation to colors
  const getDecisionStyles = (decision) => {
    switch (decision) {
      case "Strong Hire": return { bg: "rgba(52, 199, 89, 0.1)", color: "#34c759", icon: <ShieldCheck size={24} /> };
      case "Hire": return { bg: "rgba(52, 199, 89, 0.05)", color: "#34c759", icon: <CheckCircle size={24} /> };
      case "Consider": return { bg: "rgba(255, 149, 0, 0.1)", color: "#ff9500", icon: <AlertTriangle size={24} /> };
      case "Borderline": return { bg: "rgba(255, 149, 0, 0.1)", color: "#ff9500", icon: <AlertTriangle size={24} /> };
      case "Pass": return { bg: "rgba(255, 59, 48, 0.1)", color: "#ff3b30", icon: <XCircle size={24} /> };
      default: return { bg: "rgba(0,0,0,0.05)", color: "#86868b", icon: null };
    }
  };

  const style = getDecisionStyles(recommendation.decision);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", flexDirection: "column", gap: 32 }}
    >
      <div style={{ paddingBottom: 24, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1d1d1f", margin: "0 0 16px 0", letterSpacing: "-0.01em" }}>1. Executive Summary</h2>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
          
          {/* Decision Pill */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Hiring Recommendation</span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: style.bg, padding: "10px 16px", borderRadius: 12, color: style.color }}>
              {style.icon}
              <span style={{ fontSize: 18, fontWeight: 700 }}>{recommendation.decision}</span>
            </div>
            <div style={{ fontSize: 13, color: "#86868b", fontWeight: 500, paddingLeft: 4 }}>Confidence: {recommendation.confidence_score}%</div>
          </div>

          {/* Narrative Reasoning */}
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 16, color: "#1d1d1f", lineHeight: 1.6, fontWeight: 400 }}>
              {recommendation.reasoning}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {/* Match Breakdown */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", margin: "0 0 16px 0" }}>Match Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <MetricRow title="Overall Fit" score={match.overall_match_score} />
            <MetricRow title="Technical Alignment" score={match.technical_match_score} />
            <MetricRow title="Evidence Density" score={match.evidence_match_score} />
            <MetricRow title="Experience Equivalency" score={match.experience_match_score} />
          </div>
        </div>

        {/* Key Signals */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", margin: "0 0 16px 0" }}>Key Signals</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#fbfbfd", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 14, color: "#86868b", fontWeight: 500 }}>Required Skills Met</span>
              <span style={{ fontSize: 14, color: "#1d1d1f", fontWeight: 600 }}>{match.breakdown.required_skills_met}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255, 59, 48, 0.05)", borderRadius: 8, border: "1px solid rgba(255, 59, 48, 0.1)" }}>
              <span style={{ fontSize: 14, color: "#ff3b30", fontWeight: 500 }}>Identified Risk Level</span>
              <span style={{ fontSize: 14, color: "#ff3b30", fontWeight: 600 }}>{risks.risk_level} ({risks.risk_score}%)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricRow({ title, score }) {
  const isGood = score >= 70;
  const isWarn = score >= 50 && score < 70;
  const color = isGood ? "#34c759" : isWarn ? "#ff9500" : "#ff3b30";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
      <span style={{ fontSize: 14, color: "#86868b", fontWeight: 400 }}>{title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 100, height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f", width: 36, textAlign: "right" }}>{score}%</span>
      </div>
    </div>
  );
}

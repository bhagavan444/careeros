import React from "react";
import { CheckCircle2, AlertTriangle, Briefcase, TrendingUp } from "lucide-react";

export default function HiringDecisionCenter({ response }) {
  if (!response) return null;

  const { outcome, hiring_decision } = response;

  const getDecisionColor = (dec) => {
    if (dec.includes("Strong Hire")) return "#10b981";
    if (dec.includes("Hire")) return "#059669";
    if (dec.includes("Consider")) return "#f59e0b";
    return "#ef4444";
  };

  const decisionColor = getDecisionColor(hiring_decision.decision);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Decision Card */}
      <div style={{ background: decisionColor, color: "white", padding: 40, borderRadius: 24, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: `0 20px 40px -10px ${decisionColor}40` }}>
        <div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, opacity: 0.9 }}>Final Boardroom Recommendation</div>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 800, margin: "0 0 16px", lineHeight: 1 }}>{hiring_decision.decision}</h1>
          <div style={{ fontSize: "1.1rem", fontWeight: 500, opacity: 0.9, maxWidth: 600, lineHeight: 1.5 }}>
            {hiring_decision.executive_summary}
          </div>
        </div>
        <div style={{ textAlign: "center", background: "rgba(255,255,255,0.1)", padding: 24, borderRadius: 20, backdropFilter: "blur(10px)" }}>
          <div style={{ fontSize: "4rem", fontWeight: 800, lineHeight: 1, marginBottom: 8 }}>{hiring_decision.confidence}%</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.9 }}>AI Confidence</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Outcome Metrics */}
        <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={20} /> Post-Interview Profile
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: "0.95rem", color: "#9ca3af", fontWeight: 600 }}>Offer Readiness</span>
              <span style={{ fontSize: "1rem", color: "#fff", fontWeight: 700 }}>{outcome.offer_readiness}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: "0.95rem", color: "#9ca3af", fontWeight: 600 }}>Predicted Ramp-Up</span>
              <span style={{ fontSize: "1rem", color: "#fff", fontWeight: 700 }}>{outcome.ramp_up_prediction}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: "0.95rem", color: "#9ca3af", fontWeight: 600 }}>Recommended Action</span>
              <span style={{ fontSize: "1rem", color: "#8b5cf6", fontWeight: 700 }}>{hiring_decision.recommended_action}</span>
            </div>
          </div>
        </div>

        {/* Strengths & Risks */}
        <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={16} /> Key Strengths
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#d1d5db", fontSize: "0.95rem" }}>
              {hiring_decision.strengths.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>)}
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={16} /> Key Risks
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#d1d5db", fontSize: "0.95rem" }}>
              {hiring_decision.risks.map((r, i) => <li key={i} style={{ marginBottom: 6 }}>{r}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Justification Box */}
      <div style={{ background: "#f8fafc", padding: 32, borderRadius: 16, borderLeft: `4px solid ${decisionColor}` }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#334155", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <Briefcase size={18} /> Business Justification
        </h3>
        <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>
          {hiring_decision.business_justification}
        </p>
      </div>

    </div>
  );
}

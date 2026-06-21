import React from "react";
import { Check, X } from "lucide-react";

export default function JDVerificationMatrix({ matrix }) {
  if (!matrix || !matrix.skills) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 8vw, 60px)" }}>
      <h3 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", margin: 0 }}>Evidence Verification</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 8vw, 60px)" }}>
        {matrix.skills.map((s, idx) => (
          <div key={idx} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(24px, 5vw, 60px)", alignItems: "start" }}>
            
            {/* Skill Identity */}
            <div>
              <h4 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 600, color: "#1d1d1f", margin: "0 0 12px 0", letterSpacing: "-0.01em" }}>{s.skill_name}</h4>
              <div style={{ fontSize: "clamp(16px, 3vw, 18px)", fontWeight: 500, color: s.is_required ? "#ff3b30" : "#86868b" }}>
                {s.is_required ? "Required" : "Preferred"}
              </div>
            </div>

            {/* Evidence & Confidence */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "clamp(20px, 4vw, 40px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>Claimed</span>
                {s.candidate_claims ? <Check size={28} color="#1d1d1f" /> : <X size={28} color="#d1d1d6" />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>Resume Evidence</span>
                {s.resume_evidence ? <Check size={28} color="#1d1d1f" /> : <X size={28} color="#d1d1d6" />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>GitHub Evidence</span>
                {s.github_evidence ? <Check size={28} color="#1d1d1f" /> : <X size={28} color="#d1d1d6" />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#86868b", fontWeight: 700 }}>Confidence</span>
                <span style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: s.confidence_score === 100 ? "#34c759" : s.confidence_score >= 50 ? "#ff9500" : "#ff3b30", letterSpacing: "-0.02em" }}>
                  {s.confidence_score}%
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SkillGapDashboard({ gaps }) {
  if (!gaps) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
      <h3 style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", margin: 0 }}>Skill Alignment</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
        
        {/* Critical Gaps */}
        {gaps.critical_missing?.length > 0 && (
          <div>
            <h4 style={{ fontSize: 24, color: "#ff3b30", margin: "0 0 24px 0", display: "flex", alignItems: "center", gap: 12, fontWeight: 600 }}>
              <AlertCircle size={28} /> Critical Missing Requirements
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              {gaps.critical_missing.map((g, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 24, color: "#1d1d1f", letterSpacing: "-0.01em" }}>{g.skill_name}</span>
                  <p style={{ margin: 0, fontSize: 20, color: "#424245", fontWeight: 400, lineHeight: 1.6 }}>{g.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moderate Gaps */}
        {gaps.moderate_missing?.length > 0 && (
          <div>
            <h4 style={{ fontSize: 24, color: "#1d1d1f", margin: "0 0 24px 0", fontWeight: 600, letterSpacing: "-0.01em" }}>
              Moderate Gaps (Preferred)
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {gaps.moderate_missing.map((g, i) => (
                <span key={i} style={{ fontSize: 20, color: "#86868b" }}>
                  {g.skill_name}{i < gaps.moderate_missing.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        )}

        {gaps.critical_missing?.length === 0 && gaps.moderate_missing?.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <CheckCircle2 size={32} color="#34c759" />
            <span style={{ fontWeight: 400, fontSize: 24, color: "#1d1d1f", letterSpacing: "-0.01em" }}>Candidate satisfies all job description requirements. No gaps detected.</span>
          </div>
        )}

      </div>
    </div>
  );
}

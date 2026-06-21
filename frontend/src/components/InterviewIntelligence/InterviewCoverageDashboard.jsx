import React from "react";
import { Target, CheckCircle2, AlertTriangle } from "lucide-react";

export default function InterviewCoverageDashboard({ coverage }) {
  if (!coverage) return null;

  const scoreColor = coverage.coverage_score >= 80 ? "#10b981" : coverage.coverage_score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
            <Target size={24} style={{ color: "#8b5cf6" }} /> Requirements Coverage Analysis
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af", margin: 0 }}>Measures how much of the Job Description is covered by the generated interview blueprint.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{coverage.coverage_score}%</div>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Coverage Score</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        <div style={{ padding: 20, background: "#f0fdf4", borderRadius: 12, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#166534", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={16} /> Covered Requirements
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {coverage.covered_skills.map((skill, idx) => (
              <span key={idx} style={{ background: "rgba(255, 255, 255, 0.05)", color: "#15803d", padding: "4px 10px", borderRadius: 6, fontSize: "0.85rem", fontWeight: 600, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                {skill}
              </span>
            ))}
            {coverage.covered_skills.length === 0 && <span style={{ color: "#166534", fontSize: "0.85rem" }}>No requirements explicitly covered.</span>}
          </div>
        </div>

        <div style={{ padding: 20, background: "rgba(239, 68, 68, 0.1)", borderRadius: 12, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#991b1b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={16} /> Uncovered Requirements
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {coverage.uncovered_skills.map((skill, idx) => (
              <span key={idx} style={{ background: "rgba(255, 255, 255, 0.05)", color: "#b91c1c", padding: "4px 10px", borderRadius: 6, fontSize: "0.85rem", fontWeight: 600, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                {skill}
              </span>
            ))}
            {coverage.uncovered_skills.length === 0 && <span style={{ color: "#991b1b", fontSize: "0.85rem" }}>100% Coverage achieved.</span>}
          </div>
        </div>
      </div>

      {coverage.coverage_gaps.length > 0 && (
        <div style={{ padding: 20, background: "#fffbeb", borderRadius: 12, borderLeft: "4px solid #f59e0b" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#b45309", margin: "0 0 12px" }}>Identified Coverage Gaps</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#92400e", fontSize: "0.9rem" }}>
            {coverage.coverage_gaps.map((gap, idx) => <li key={idx} style={{ marginBottom: 4 }}>{gap}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

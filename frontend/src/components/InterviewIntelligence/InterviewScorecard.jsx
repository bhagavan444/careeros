import React from "react";

export default function InterviewScorecard({ scorecard }) {
  if (!scorecard) return null;

  return (
    <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Standardized Hiring Scorecard</h2>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af", margin: 0 }}>Use this rubric during the final debrief.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{scorecard.total_max_score}</div>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Total Points</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <div style={{ padding: 16, background: "rgba(16, 185, 129, 0.1)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, color: "#047857" }}>Strong Hire Threshold</span>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#047857" }}>{scorecard.strong_hire_threshold}+</span>
        </div>
        <div style={{ padding: 16, background: "rgba(59, 130, 246, 0.1)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, color: "#1d4ed8" }}>Pass Threshold</span>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1d4ed8" }}>{scorecard.pass_threshold}+</span>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.15)", textAlign: "left" }}>
            <th style={{ padding: "12px 0", color: "#9ca3af", fontSize: "0.85rem", textTransform: "uppercase" }}>Category</th>
            <th style={{ padding: "12px 0", color: "#9ca3af", fontSize: "0.85rem", textTransform: "uppercase" }}>Evaluation Guidance</th>
            <th style={{ padding: "12px 0", color: "#9ca3af", fontSize: "0.85rem", textTransform: "uppercase", textAlign: "right" }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {scorecard.categories.map((cat, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              <td style={{ padding: "20px 0", fontWeight: 700, color: "#f3f4f6", width: "25%" }}>{cat.category_name}</td>
              <td style={{ padding: "20px 20px 20px 0", fontSize: "0.9rem", color: "#d1d5db" }}>{cat.evaluation_guidance}</td>
              <td style={{ padding: "20px 0", textAlign: "right", color: "#9ca3af", fontWeight: 600 }}>/ {cat.max_score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ padding: 24, background: "rgba(239, 68, 68, 0.1)", borderRadius: 12 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#b91c1c", margin: "0 0 12px" }}>Global Red Flags (Automatic Fail)</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#991b1b", fontSize: "0.9rem" }}>
          {scorecard.red_flags_to_watch.map((flag, idx) => <li key={idx} style={{ marginBottom: 6 }}>{flag}</li>)}
        </ul>
      </div>

    </div>
  );
}

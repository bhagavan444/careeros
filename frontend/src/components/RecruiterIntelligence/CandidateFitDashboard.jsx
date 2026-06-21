import React from "react";

export default function CandidateFitDashboard({ fit }) {
  if (!fit) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
      <h3 style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", margin: 0 }}>Growth Potential</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
        <FitItem label="Startup Readiness" score={fit.startup_fit} />
        <FitItem label="Enterprise Readiness" score={fit.enterprise_fit} />
        <FitItem label="Remote Autonomy" score={fit.remote_fit} />
        <FitItem label="Platform / DevOps Fit" score={fit.platform_engineering_fit} />
        <FitItem label="Leadership Potential" score={fit.leadership_potential} />
      </div>
    </div>
  );
}

function FitItem({ label, score }) {
  const getRating = (val) => {
    if (val >= 80) return "Excellent";
    if (val >= 60) return "Strong";
    if (val >= 40) return "Moderate";
    return "Low";
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h4 style={{ fontSize: 24, color: "#1d1d1f", margin: 0, fontWeight: 600, letterSpacing: "-0.01em" }}>{label}</h4>
        <span style={{ fontSize: 20, color: "#86868b", fontWeight: 500 }}>{getRating(score)} ({score}%)</span>
      </div>
    </div>
  );
}

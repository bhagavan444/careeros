import React from "react";

export default function TopDashboard({ healthData }) {
  const { score, healthLabel } = healthData || { score: 0, healthLabel: "Pending" };
  
  return (
    <div className="rs-dashboard">
      <div className="rs-metric-card">
        <span className="rs-metric-title">Professional Identity Score</span>
        <span className="rs-metric-value" style={{ color: "#10b981" }}>{score} / 100</span>
      </div>
      
      <div className="rs-metric-card">
        <span className="rs-metric-title">Identity Health</span>
        <span className="rs-metric-value">{healthLabel}</span>
      </div>

      <div className="rs-metric-card">
        <span className="rs-metric-title">Recruiter Confidence</span>
        <span className="rs-metric-value">Analyzing...</span>
      </div>

      <div className="rs-metric-card">
        <span className="rs-metric-title">Last Updated</span>
        <span className="rs-metric-value" style={{ fontSize: "1.2rem", marginTop: "4px" }}>Just now</span>
      </div>
    </div>
  );
}

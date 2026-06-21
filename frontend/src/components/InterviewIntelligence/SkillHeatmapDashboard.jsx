import React from "react";
import { Zap } from "lucide-react";

export default function SkillHeatmapDashboard({ heatmap }) {
  if (!heatmap) return null;

  return (
    <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <Zap size={24} style={{ color: "#f59e0b" }} /> Candidate Skill Strength Heatmap
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af", margin: 0 }}>Executive visual breakdown of verified skills mapped from upstream deterministic intelligence layers.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {heatmap.map((item, idx) => {
          const color = item.strength_score >= 80 ? "#10b981" : item.strength_score >= 50 ? "#3b82f6" : "#ef4444";
          
          return (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: "25%", fontSize: "0.95rem", fontWeight: 600, color: "#d1d5db", textAlign: "right" }}>
                {item.skill_name}
              </div>
              <div style={{ flex: 1, height: 24, background: "rgba(255, 255, 255, 0.1)", borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", position: "relative" }}>
                <div style={{ 
                  width: `${item.strength_score}%`, 
                  height: "100%", 
                  background: color, 
                  transition: "width 1s ease-in-out" 
                }} />
              </div>
              <div style={{ width: 40, fontSize: "1rem", fontWeight: 800, color: color, textAlign: "left" }}>
                {item.strength_score}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";

export default function CopilotQuickActions({ onAction }) {
  const actions = [
    { label: "Analyze Resume", icon: "📄" },
    { label: "Analyze GitHub", icon: "💻" },
    { label: "Placement Readiness", icon: "🎯" },
    { label: "Recruiter Review", icon: "👔" },
    { label: "Generate Roadmap", icon: "🗺️" },
    { label: "Interview Preparation", icon: "🎙️" },
  ];

  return (
    <div style={{ padding: "0 24px 20px 24px" }}>
      <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--tm)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Quick Actions
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {actions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-focus)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction(action.label)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 16px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--tp)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              transition: "box-shadow 0.2s"
            }}
          >
            <span>{action.icon}</span>
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

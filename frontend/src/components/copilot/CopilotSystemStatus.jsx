import React from "react";
import { motion } from "framer-motion";

export default function CopilotSystemStatus() {
  const statuses = [
    { label: "Resume Engine", active: true },
    { label: "GitHub Engine", active: true },
    { label: "Knowledge Base", active: true },
    { label: "Career Memory", active: true },
    { label: "Provider Pool", active: true },
    { label: "Activity Feed", active: true }
  ];

  return (
    <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "20px" }}>
      <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
        System Status
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {statuses.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "var(--ts)" }}>{s.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", color: s.active ? "#10b981" : "#ef4444", fontWeight: "600" }}>{s.active ? "ONLINE" : "OFFLINE"}</span>
              <motion.div 
                animate={{ opacity: [1, 0.5, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.active ? "#10b981" : "#ef4444", boxShadow: `0 0 6px ${s.active ? "#10b981" : "#ef4444"}` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

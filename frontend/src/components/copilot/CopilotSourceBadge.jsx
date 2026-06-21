import React from "react";
import { motion } from "framer-motion";

export default function CopilotSourceBadge({ source, confidence, latency }) {
  if (!source) return null;

  const getSourceConfig = (src) => {
    switch (src) {
      case "Resume Engine": 
        return { color: "#ef4444", icon: "📄", glow: "rgba(239, 68, 68, 0.3)" };
      case "GitHub Engine": 
        return { color: "#3b82f6", icon: "💻", glow: "rgba(59, 130, 246, 0.3)" };
      case "Profile Intelligence": 
        return { color: "#10b981", icon: "👤", glow: "rgba(16, 185, 129, 0.3)" };
      case "Recruiter Intelligence": 
        return { color: "#f59e0b", icon: "🤝", glow: "rgba(245, 158, 11, 0.3)" };
      case "Roadmap Engine": 
        return { color: "#8b5cf6", icon: "🗺️", glow: "rgba(139, 92, 246, 0.3)" };
      case "Talent Ranking": 
        return { color: "#ec4899", icon: "🏆", glow: "rgba(236, 72, 153, 0.3)" };
      case "Knowledge Base": 
        return { color: "#14b8a6", icon: "📚", glow: "rgba(20, 184, 166, 0.3)" };
      case "Career Memory": 
        return { color: "#f43f5e", icon: "🧠", glow: "rgba(244, 63, 94, 0.3)" };
      case "Gemini AI": 
        return { color: "#6366f1", icon: "✨", glow: "rgba(99, 102, 241, 0.3)" };
      case "Fallback": 
      default: 
        return { color: "#94a3b8", icon: "⚙️", glow: "rgba(148, 163, 184, 0.3)" };
    }
  };

  const { color, icon, glow } = getSourceConfig(source);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 10px",
        borderRadius: "8px",
        background: "rgba(0,0,0,0.4)",
        border: `1px solid ${color}`,
        boxShadow: `0 0 10px ${glow}, inset 0 0 5px ${glow}`,
        fontSize: "11px",
        fontWeight: "600",
        fontFamily: "var(--font-mono)",
        marginBottom: "12px",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", color }}>
        <span>{icon}</span>
        {source}
      </div>
      {confidence && (
        <>
          <div style={{ width: "1px", height: "10px", background: "var(--border)" }} />
          <span style={{ color: "var(--text-secondary)" }}>Conf: {Math.round(confidence * 100)}%</span>
        </>
      )}
      {latency && (
        <>
          <div style={{ width: "1px", height: "10px", background: "var(--border)" }} />
          <span style={{ color: "var(--text-secondary)" }}>{latency}ms</span>
        </>
      )}
    </motion.div>
  );
}

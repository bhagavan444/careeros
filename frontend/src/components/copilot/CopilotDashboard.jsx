import React from "react";
import { motion } from "framer-motion";

export default function CopilotDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", width: "100%", zIndex: 1 }}>
      
      {/* Decorative Background Flowing Diagram */}
      <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "800px", height: "200px", opacity: 0.08, pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", zIndex: -1 }}>
        <div style={{ display: "flex", gap: "32px", zIndex: 2 }}>
          {["Resume", "GitHub", "Projects", "Skills", "Experience"].map(sig => (
            <div key={sig} style={{ padding: "8px 16px", border: "2px solid #6D5DFC", borderRadius: "999px", fontSize: "14px", fontWeight: "800", color: "#0f172a", background: "#fff" }}>{sig}</div>
          ))}
        </div>
        
        <div style={{ position: "relative", zIndex: 2 }}>
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "160px", height: "160px", background: "radial-gradient(circle, rgba(109,93,252,0.4) 0%, transparent 60%)", borderRadius: "50%" }} />
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", border: "4px solid #6D5DFC", display: "flex", alignItems: "center", justifyContent: "center", background: "#6D5DFC", color: "#fff", fontWeight: "900", fontSize: "18px", letterSpacing: "0.1em", boxShadow: "0 0 40px rgba(109,93,252,0.5)" }}>CORE</div>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", zIndex: 2 }}>
          {["Career DNA", "ATS Readiness", "Hiring Probability", "Interview Readiness", "Career Roadmap"].map(out => (
            <div key={out} style={{ padding: "8px 16px", border: "2px solid #00D4AA", borderRadius: "999px", fontSize: "14px", fontWeight: "800", color: "#0f172a", background: "#fff" }}>{out}</div>
          ))}
        </div>

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}>
          <motion.path 
            d="M 400 40 L 400 80" 
            fill="none" stroke="#6D5DFC" strokeWidth="4" 
            strokeDasharray="8 8"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M 400 120 L 400 160" 
            fill="none" stroke="#00D4AA" strokeWidth="4" 
            strokeDasharray="8 8"
            animate={{ strokeDashoffset: [0, -40] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Hero Content */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ textAlign: "center", maxWidth: "600px" }}
      >
        <h1 style={{ fontSize: "40px", fontWeight: "900", color: "#0f172a", marginBottom: "12px", letterSpacing: "-0.04em" }}>
          CareerOS Copilot
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
          Multi-Agent Career Intelligence System
        </p>
      </motion.div>
    </div>
  );
}

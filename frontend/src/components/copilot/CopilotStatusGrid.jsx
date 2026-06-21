import React from "react";
import { motion } from "framer-motion";

export default function CopilotStatusGrid({ resumeScore = "--", githubScore = "--", profileStrength = "--", recruiterConfidence = "--", readiness = "--", roadmap = "--" }) {
  
  const cards = [
    { title: "Resume Intelligence", value: resumeScore, color: "#ef4444" },
    { title: "GitHub Intelligence", value: githubScore, color: "#2563eb" },
    { title: "Profile Intelligence", value: profileStrength, color: "#10b981" },
    { title: "Recruiter Confidence", value: recruiterConfidence, color: "#8b5cf6" },
    { title: "Career Readiness", value: readiness, color: "#f59e0b" },
    { title: "Roadmap Progress", value: roadmap, color: "#06b6d4" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", padding: "20px 24px" }}>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${card.color}25` }}
          className="glass-surface"
          style={{
            padding: "16px",
            position: "relative",
            overflow: "hidden",
            cursor: "default"
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: card.color, opacity: 0.8 }} />
          <div style={{ fontSize: "12px", color: "var(--tm)", fontWeight: "600", fontFamily: "var(--mono)", textTransform: "uppercase" }}>
            {card.title}
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", marginTop: "8px", color: "var(--tp)" }}>
            {card.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

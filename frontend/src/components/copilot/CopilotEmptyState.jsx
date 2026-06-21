import React from "react";
import { motion } from "framer-motion";
import CopilotOrbitAnimation from "./CopilotOrbitAnimation";

export default function CopilotEmptyState({ onAction }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const quickActions = [
    { icon: "📄", text: "Analyze Resume", prompt: "Analyze my resume and provide a score." },
    { icon: "💻", text: "Review GitHub", prompt: "Review my GitHub profile." },
    { icon: "🎯", text: "Placement Readiness", prompt: "What is my placement readiness?" },
    { icon: "🎙️", text: "Mock Interview", prompt: "Start a mock interview for Software Engineering." }
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "20px", paddingBottom: "40px", paddingLeft: "20px", paddingRight: "20px", textAlign: "center"
      }}
    >
      <motion.div variants={item}>
        <CopilotOrbitAnimation />
      </motion.div>

      <motion.h2 
        variants={item}
        style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "400", fontFamily: "var(--display, 'Instrument Serif', serif)", color: "var(--tp)", marginTop: "40px", marginBottom: "16px", fontStyle: "italic", letterSpacing: "-0.02em" }}
      >
        Initialize <span style={{ background: "linear-gradient(135deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Career Intelligence</span>
      </motion.h2>

      <motion.p 
        variants={item}
        style={{ fontSize: "16px", color: "var(--ts)", maxWidth: "560px", lineHeight: "1.7", marginBottom: "48px" }}
      >
        Welcome to the CareerOS Copilot. Our native intelligence engines are synchronized and standing by to process your unstructured professional signals into deterministic career outcomes.
      </motion.p>

      <motion.div variants={item} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", maxWidth: "700px" }}>
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.4)", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAction && onAction(action.prompt)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "12px 24px",
              borderRadius: "100px",
              color: "var(--tp)",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backdropFilter: "blur(12px)",
              transition: "border 0.3s, background 0.3s, box-shadow 0.3s"
            }}
          >
            <span style={{ fontSize: "16px" }}>{action.icon}</span>
            {action.text}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";

export default function CopilotOrbitAnimation() {
  const modules = [
    { name: "Resume Intelligence", color: "#ef4444" },
    { name: "GitHub Intelligence", color: "#2563eb" },
    { name: "Recruiter Intelligence", color: "#8b5cf6" },
    { name: "Profile Intelligence", color: "#10b981" },
    { name: "Talent Ranking", color: "#f59e0b" },
    { name: "Roadmap Engine", color: "#06b6d4" },
  ];

  return (
    <div style={{ position: "relative", width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
      {/* Central Core */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(167,139,250,0.4)", "0 0 40px rgba(129,140,248,0.6)", "0 0 20px rgba(167,139,250,0.4)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #818cf8, #a78bfa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          color: "#fff",
          fontWeight: "700",
          fontSize: "12px",
          textAlign: "center"
        }}
      >
        Core
      </motion.div>

      {/* Orbiting Modules */}
      {modules.map((mod, i) => {
        const angle = (i / modules.length) * 360;
        return (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: "100%", height: "100%", originX: "50%", originY: "50%" }}
          >
            <motion.div
              style={{
                position: "absolute",
                top: "10%",
                left: "50%",
                width: "40px",
                height: "40px",
                marginLeft: "-20px",
                borderRadius: "50%",
                background: "var(--bg-surface)",
                border: `1px solid ${mod.color}50`,
                boxShadow: `0 0 15px ${mod.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${angle}deg) translateY(-100px) rotate(-${angle}deg)`,
                backdropFilter: "blur(8px)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: mod.color }} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

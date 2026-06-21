import React from "react";
import { motion } from "framer-motion";

export default function CopilotHeader() {
  return (
    <div style={{
      padding: "16px 32px",
      borderBottom: "1px solid #E5E7EB",
      background: "#ffffff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "16px",
      zIndex: 20
    }}>
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}
        >
          CareerOS Workspace
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: "13px", color: "#64748b", marginTop: "2px", fontWeight: "500" }}
        >
          Multi-Agent Intelligence System
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ display: "flex", gap: "20px", fontSize: "12px", fontWeight: "600", color: "#475569" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00D4AA" }} />
          Engines Online
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#6D5DFC" }} />
          Knowledge Sync
        </div>
      </motion.div>
    </div>
  );
}

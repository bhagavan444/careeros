import React from "react";

export default function CopilotTypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 0" }}>
      {[0, 1, 2].map((i) => (
        <div 
          key={i} 
          className="thinking-dot" 
          style={{ 
            animationDelay: `${i * 0.2}s`,
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
            boxShadow: "0 0 8px rgba(129,140,248,0.4)"
          }} 
        />
      ))}
    </div>
  );
}

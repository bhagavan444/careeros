import React from "react";

export default function InterviewBlueprint({ blueprint }) {
  if (!blueprint || !blueprint.rounds) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 8vw, 80px)" }}>
      <h3 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", margin: 0 }}>Interview Strategy</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(60px, 12vw, 100px)" }}>
        {blueprint.rounds.map((round, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 5vw, 40px)" }}>
            
            <h4 style={{ fontSize: "clamp(28px, 6vw, 40px)", fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.03em", wordBreak: "break-word" }}>
              {round.round_name}
            </h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(40px, 8vw, 80px)" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", color: "#86868b", fontWeight: 700, letterSpacing: "0.1em" }}>Focus Areas</span>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                  {round.focus_areas.map((fa, i) => (
                    <li key={i} style={{ fontSize: "clamp(18px, 4vw, 20px)", color: "#424245", lineHeight: 1.6 }}>&mdash; {fa}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", color: "#86868b", fontWeight: 700, letterSpacing: "0.1em" }}>Suggested Questions</span>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 32 }}>
                  {round.questions.map((q, i) => (
                    <li key={i} style={{ fontSize: "clamp(20px, 4vw, 24px)", color: "#1d1d1f", lineHeight: 1.5, fontWeight: 500, letterSpacing: "-0.01em" }}>{i + 1}. {q}</li>
                  ))}
                </ul>
              </div>

            </div>

            {round.risk_validation?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", color: "#ff3b30", fontWeight: 700, letterSpacing: "0.1em", display: "block", marginBottom: 16 }}>Risk Validation</span>
                <p style={{ margin: 0, fontSize: "clamp(20px, 4vw, 24px)", color: "#1d1d1f", fontWeight: 500, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                  {round.risk_validation[0]}
                </p>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}

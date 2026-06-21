import React from "react";

export default function ExplainabilityAuditCenter({ report }) {
  if (!report) return null;

  const m_exp = report.match_analysis?.explainability;
  const r_exp = report.risk_analysis?.explainability;
  const d_exp = report.hiring_recommendation?.explainability;
  const registry = report.evidence_registry || [];

  const registryBySource = {};
  registry.forEach(item => {
    const src = item.source || "Unknown Source";
    if (!registryBySource[src]) registryBySource[src] = [];
    registryBySource[src].push(item);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 8vw, 80px)" }}>
      <h3 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em", margin: 0 }}>Explainability Audit</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(60px, 12vw, 100px)" }}>
        
        {/* Audit Sections */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(40px, 8vw, 60px)" }}>
          {m_exp && (
            <AuditSection title="Match Score Audit" exp={m_exp} result={`${report.match_analysis.overall_match_score}%`} />
          )}
          {r_exp && (
            <AuditSection title="Risk Analysis Audit" exp={r_exp} result={`${report.risk_analysis.risk_score}%`} />
          )}
          {d_exp && (
            <AuditSection title="Recommendation Audit" exp={d_exp} result={report.hiring_recommendation.decision} />
          )}
        </div>

        {/* Evidence Registry */}
        <div>
          <h4 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: "#1d1d1f", margin: "0 0 40px 0", letterSpacing: "-0.02em" }}>Physical Evidence Registry</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "clamp(40px, 8vw, 60px)" }}>
            {Object.entries(registryBySource).map(([source, items], idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <span style={{ fontSize: 13, textTransform: "uppercase", color: "#86868b", fontWeight: 700, letterSpacing: "0.1em" }}>{source}</span>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ fontSize: "clamp(16px, 4vw, 20px)", color: "#1d1d1f", fontWeight: 500, lineHeight: 1.5 }}>
                      {item.skill} <span style={{ color: "#86868b", fontWeight: 400 }}>({item.evidence_type})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {registry.length === 0 && (
               <div style={{ color: "#86868b", fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 500 }}>No physical evidence extracted.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function AuditSection({ title, exp, result }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 5vw, 40px)" }}>
      <h4 style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 600, color: "#1d1d1f", margin: 0, letterSpacing: "-0.01em" }}>{title}</h4>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontSize: 13, textTransform: "uppercase", color: "#86868b", fontWeight: 700, letterSpacing: "0.1em" }}>Formula</span>
        <div style={{ fontSize: "clamp(14px, 3vw, 18px)", color: "#424245", fontFamily: "SFMono-Regular, Consolas, monospace", lineHeight: 1.5, wordBreak: "break-all" }}>{exp.formula}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontSize: 13, textTransform: "uppercase", color: "#86868b", fontWeight: 700, letterSpacing: "0.1em" }}>Weights</span>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(exp.weight_contributions || {}).map(([k, v], i) => (
            <li key={i} style={{ fontSize: "clamp(16px, 3vw, 18px)", color: "#1d1d1f" }}>
              <span style={{ color: "#86868b", marginRight: 12 }}>{k}</span>{v}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontSize: 13, textTransform: "uppercase", color: "#86868b", fontWeight: 700, letterSpacing: "0.1em" }}>Calculated Result</span>
        <span style={{ fontSize: "clamp(32px, 6vw, 40px)", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.03em" }}>{result}</span>
      </div>
    </div>
  );
}

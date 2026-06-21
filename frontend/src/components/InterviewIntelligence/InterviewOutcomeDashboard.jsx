import React, { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { interviewIntelligenceService } from "../../services/interviewIntelligenceService";

export default function InterviewOutcomeDashboard({ rawIntelligence, onOutcomeGenerated }) {
  const [scores, setScores] = useState({
    technical_skills_score: 0,
    problem_solving_score: 0,
    communication_score: 0,
    system_design_score: 0,
    culture_fit_score: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setScores({ ...scores, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...scores,
        candidate_data: rawIntelligence.candidate_data || {},
        match_analysis: rawIntelligence.match_analysis || {},
        risk_analysis: rawIntelligence.risk_analysis || {},
        truth_score: rawIntelligence.truth_score || 0
      };
      const response = await interviewIntelligenceService.submitOutcome(payload);
      onOutcomeGenerated(response);
    } catch (err) {
      setError("Failed to process outcome. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", borderRadius: 100, fontSize: "0.75rem", fontWeight: 700, marginBottom: 12 }}>
            STEP 2: POST-INTERVIEW
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
            <ClipboardCheck size={24} style={{ color: "#10b981" }} /> Interviewer Rubric Input
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af", margin: 0 }}>Input the final scores from your interview debrief to generate the Hiring Decision.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2.5rem", fontWeight: 800, color: totalScore >= 40 ? "#10b981" : totalScore >= 30 ? "#f59e0b" : "#ef4444", lineHeight: 1 }}>
            {totalScore} <span style={{ fontSize: "1.2rem", color: "#9ca3af" }}>/ 50</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Total Score</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {[
          { label: "Technical Skills", name: "technical_skills_score", color: "#3b82f6" },
          { label: "Problem Solving", name: "problem_solving_score", color: "#f59e0b" },
          { label: "Communication", name: "communication_score", color: "#10b981" },
          { label: "System Design", name: "system_design_score", color: "#8b5cf6" },
          { label: "Culture Fit", name: "culture_fit_score", color: "#ec4899" }
        ].map((field) => (
          <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#d1d5db", display: "flex", justifyContent: "space-between" }}>
              {field.label}
              <span style={{ color: field.color }}>{scores[field.name]} / 10</span>
            </label>
            <input 
              type="range" 
              name={field.name} 
              min="0" 
              max="10" 
              value={scores[field.name]} 
              onChange={handleChange}
              style={{ width: "100%", accentColor: field.color }}
            />
          </div>
        ))}
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: 16, fontWeight: 500 }}>{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%", padding: 16, background: loading ? "#9ca3af" : "#111827", color: "white", border: "none", borderRadius: 12, fontSize: "1.05rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Generating Hiring Decision..." : "Finalize & Generate Hiring Decision"}
      </button>
    </div>
  );
}

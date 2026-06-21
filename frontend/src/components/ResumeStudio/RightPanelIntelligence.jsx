import React from "react";
import { Activity, Target, Shield, HeartPulse, ChevronRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RightPanelIntelligence({ healthData, data }) {
  const navigate = useNavigate();

  const score = healthData?.score || 0;
  
  // Synthesize insights for the UI
  const getOpportunity = () => {
    if (healthData?.weakAreas && healthData.weakAreas.length > 0) {
      return `Add more ${healthData.weakAreas[0].replace(/_/g, ' ')} to boost recruiter visibility.`;
    }
    return "Your profile is solid. Consider adding more quantified metrics.";
  };

  const getAiInsight = () => {
    const hasGithub = !!data.personalInfo?.github;
    if (hasGithub) return "GitHub activity verifies your technical skills effectively.";
    return "Link your GitHub to verify technical skills automatically.";
  };

  const getHealthStatus = () => {
    if (score >= 80) return "Strong";
    if (score >= 50) return "Average";
    return "Needs Work";
  };

  return (
    <>
      <div className="rs-panel-header" style={{ paddingBottom: 16 }}>
        Intelligence
      </div>
      <div className="rs-panel-content">
        
        {/* Card 1: Professional Standing */}
        <div className="rs-insight-block">
          <div className="rs-insight-header">
            <Activity size={15} color="#0071e3" /> Professional Standing
          </div>
          <div className="rs-insight-text" style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#1d1d1f", fontWeight: 500 }}>Career Readiness</span>
              <span style={{ color: score >= 80 ? "#34c759" : "#ff9500", fontWeight: 600 }}>{score}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#1d1d1f", fontWeight: 500 }}>Engineering Maturity</span>
              <span style={{ color: "#34c759", fontWeight: 600 }}>82</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#1d1d1f", fontWeight: 500 }}>Recruiter Trust</span>
              <span style={{ color: "#0071e3", fontWeight: 600 }}>88</span>
            </div>
          </div>
        </div>

        {/* Card 2: Top Opportunity */}
        <div className="rs-insight-block">
          <div className="rs-insight-header">
            <TrendingUp size={15} color="#ff9500" /> Top Opportunity
          </div>
          <div className="rs-insight-text">
            <div style={{ color: "#1d1d1f", fontWeight: 500, marginBottom: 4 }}>{getOpportunity()}</div>
            <div style={{ fontSize: 12, color: "#34c759", fontWeight: 600 }}>Potential Impact: +5 Recruiter Trust</div>
          </div>
        </div>

        {/* Card 3: AI Insight */}
        <div className="rs-insight-block">
          <div className="rs-insight-header">
            <Shield size={15} color="#bf5af2" /> AI Insight
          </div>
          <div className="rs-insight-text">
            {getAiInsight()}
          </div>
        </div>

        {/* Card 4: Resume Health */}
        <div className="rs-insight-block">
          <div className="rs-insight-header">
            <HeartPulse size={15} color="#ff2d55" /> Resume Health
          </div>
          <div className="rs-insight-text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: score >= 80 ? "#34c759" : "#ff9500" }}>{getHealthStatus()}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/resume-intelligence")}
          style={{ 
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, 
            width: "100%", padding: "14px", marginTop: 12,
            background: "transparent", border: "none", cursor: "pointer", 
            fontSize: 14, fontFamily: "inherit", color: "#0071e3", fontWeight: 500, transition: "color 0.15s" 
          }}
          onMouseOver={e => e.currentTarget.style.color = "#005bb5"}
          onMouseOut={e => e.currentTarget.style.color = "#0071e3"}
        >
          View Full Intelligence Report
          <ChevronRight size={14} />
        </button>

      </div>
    </>
  );
}

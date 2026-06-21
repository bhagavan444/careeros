import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, BrainCircuit, Code2, Server, LayoutDashboard, Search, Database } from "lucide-react";

const ASSESSMENTS = [
  {
    id: "ai-eng",
    title: "AI Engineering Assessment",
    desc: "Evaluates model architecture decisions, training pipeline maturity, and production inference deployment readiness.",
    complexity: "Advanced",
    duration: "45 min",
    vectors: 24,
    score: 92,
    color: "#5856d6", // Apple Purple
    icon: BrainCircuit
  },
  {
    id: "backend",
    title: "Backend Architecture Assessment",
    desc: "Measures API design quality, database schema maturity, caching strategies, and distributed systems understanding.",
    complexity: "Intermediate",
    duration: "35 min",
    vectors: 18,
    score: 88,
    color: "#0071e3", // Apple Blue
    icon: Server
  },
  {
    id: "devops",
    title: "DevOps Readiness Assessment",
    desc: "Analyzes CI/CD pipeline sophistication, infrastructure-as-code proficiency, and observability stack coverage.",
    complexity: "Advanced",
    duration: "40 min",
    vectors: 21,
    score: 85,
    color: "#34c759", // Apple Green
    icon: Database
  },
  {
    id: "sys-design",
    title: "System Design Intelligence",
    desc: "Tests capacity planning, fault tolerance modeling, and distributed architecture scaling decision frameworks.",
    complexity: "Expert",
    duration: "60 min",
    vectors: 32,
    score: 94,
    color: "#ff9500", // Apple Orange
    icon: LayoutDashboard
  },
  {
    id: "recruiter",
    title: "Recruiter Heuristic Evaluation",
    desc: "Measures how effectively your profile communicates technical depth to automated screening systems and human reviewers.",
    complexity: "Baseline",
    duration: "20 min",
    vectors: 12,
    score: 78,
    color: "#ff2d55", // Apple Pink
    icon: Search
  },
  {
    id: "prod-ready",
    title: "Production Readiness Audit",
    desc: "Comprehensive evaluation of monitoring, alerting, SLO definition, incident response, and deployment rollback capabilities.",
    complexity: "Advanced",
    duration: "50 min",
    vectors: 28,
    score: 90,
    color: "#32ade6", // Apple Cyan
    icon: Code2
  }
];

export default function Assessments() {
  const navigate = useNavigate();

  

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#1d1d1f",
      position: "relative",
      overflowX: "hidden"
    }}>

      {/* Hero Section */}
      <section style={{ paddingTop: 140, paddingBottom: 60, textAlign: "center", position: "relative" }}>
        {/* Subtle background glow */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
          style={{ 
            position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", 
            width: 800, height: 400, borderRadius: "50%", 
            background: "radial-gradient(ellipse, rgba(0, 113, 227, 0.08) 0%, transparent 70%)", 
            filter: "blur(40px)", pointerEvents: "none", zIndex: 0 
          }}
        />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ margin: "0 auto 24px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", 
              background: "rgba(0,113,227,0.08)", borderRadius: 20, color: "#0071e3",
              fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em"
            }}>
              Evaluation Systems
            </span>
          </div>
          <h1 style={{ 
            fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.04em", 
            lineHeight: 1.05, color: "#1d1d1f", marginBottom: 24, margin: "0 auto 24px" 
          }}>
            Engineering Evaluation Systems.
          </h1>
          <p style={{ fontSize: 19, color: "#86868b", maxWidth: 650, margin: "0 auto 40px", lineHeight: 1.6 }}>
            Six deterministic assessment engines designed to benchmark engineering maturity across architecture, deployment, and recruiter trust dimensions.
          </p>
        </motion.div>
      </section>

      {/* Assessment Grid */}
      <section style={{ padding: "0 24px 100px", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }}>
            {ASSESSMENTS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => navigate("/predict")}
                style={{
                  background: "#ffffff",
                  borderRadius: 24, padding: 32, border: "1px solid rgba(0,0,0,0.06)",
                  display: "flex", flexDirection: "column", cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.transform = "translateY(-6px)"; 
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; 
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.transform = "translateY(0)"; 
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.02)"; 
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 16, background: `${a.color}15`, 
                    display: "flex", alignItems: "center", justifyContent: "center" 
                  }}>
                    <a.icon size={24} color={a.color} />
                  </div>
                  <div style={{ 
                    fontSize: 11, padding: "6px 12px", background: "#f5f5f7", borderRadius: 100, 
                    color: "#86868b", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" 
                  }}>
                    {a.complexity}
                  </div>
                </div>

                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", marginBottom: 12, letterSpacing: "-0.02em" }}>{a.title}</h3>
                <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.6, marginBottom: 32, flex: 1 }}>{a.desc}</p>

                {/* Telemetry Row */}
                <div style={{ display: "flex", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 24, gap: 16 }}>
                  {[
                    { lbl: "Vectors", val: a.vectors },
                    { lbl: "Duration", val: a.duration },
                    { lbl: "Benchmark", val: `${a.score}%` }
                  ].map((m, idx) => (
                    <div key={m.lbl} style={{ flex: 1, borderRight: idx !== 2 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", marginBottom: 4 }}>{m.val}</div>
                      <div style={{ fontSize: 11, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{m.lbl}</div>
                    </div>
                  ))}
                </div>
                
                {/* Overlay hover arrow */}
                <div 
                  className="hover-arrow"
                  style={{
                    position: "absolute", bottom: 32, right: 32,
                    width: 36, height: 36, borderRadius: "50%", background: "#f5f5f7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transform: "translateX(-10px)", transition: "all 0.3s ease"
                  }}
                >
                  <ChevronRight size={18} color="#1d1d1f" />
                </div>
                <style>{`
                  div:hover > .hover-arrow {
                    opacity: 1 !important;
                    transform: translateX(0) !important;
                  }
                `}</style>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: "center", marginTop: 64 }}
          >
            <button 
              onClick={() => navigate("/predict")} 
              style={{ 
                padding: "16px 40px", background: "#0071e3", color: "white",
                borderRadius: 100, border: "none", fontSize: 17, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 14px rgba(0,113,227,0.3)",
                display: "inline-flex", alignItems: "center", gap: 8
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#005bbf"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#0071e3"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Begin Evaluation Sequence <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

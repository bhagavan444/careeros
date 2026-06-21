import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronRight, FileText, BrainCircuit, Activity,
  Users, Zap, MessageSquare, Database, Server,
  GitBranch, Shield, Cpu, Radio, Code, Fingerprint
} from "lucide-react";

const ease = [0.25, 0.1, 0.25, 1];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease }
});

// ═══════════════════════════════════
// 1. HERO
// ═══════════════════════════════════
export function AppleHeroSection() {
  const navigate = useNavigate();

  const insights = [
    { label: "Resume Strength", value: "94", unit: "/100", color: "#34c759", sub: "Top 6% globally" },
    { label: "Market Visibility", value: "High", unit: "", color: "#0071e3", sub: "Recruiters are looking" },
    { label: "Growth Potential", value: "+3", unit: " levels", color: "#bf5af2", sub: "Identified this month" },
  ];

  return (
    <section style={{
      background: "#ffffff",
      color: "#1d1d1f",
      paddingTop: 44,
      paddingBottom: 0,
      overflow: "hidden",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px" }}>

        {/* Hero copy */}
        <motion.div {...fade(0)}>
          <p style={{
            fontSize: 13, fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#6e6e73", marginBottom: 24
          }}>
            CareerOS — Career Intelligence
          </p>
          <h1 style={{
            fontSize: "clamp(52px, 9vw, 104px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.04,
            color: "#1d1d1f", marginBottom: 0
          }}>
            Know where you stand.
          </h1>
          <p style={{
            fontSize: "clamp(52px, 9vw, 104px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.04,
            color: "#86868b", marginBottom: 28
          }}>
            Own what's next.
          </p>
          <p style={{
            fontSize: "clamp(17px, 1.9vw, 21px)", fontWeight: 400,
            color: "#6e6e73", lineHeight: 1.65,
            maxWidth: 600, margin: "0 auto 44px"
          }}>
            CareerOS reads your skills, experience, and market positioning to show you exactly where you stand — and precisely what it takes to get where you want to go.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <button
              onClick={() => navigate("/resume-studio")}
              style={{
                background: "#0071e3", color: "#fff", border: "none",
                padding: "16px 32px", borderRadius: 100, fontSize: 17,
                fontWeight: 600, cursor: "pointer", letterSpacing: "-0.01em",
                transition: "background 0.2s, transform 0.15s"
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#0077ed"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#0071e3"; }}
            >
              Analyze My Career
            </button>
            <button
              onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
              style={{
                background: "transparent", color: "#0071e3", border: "none",
                padding: "16px 32px", borderRadius: 100, fontSize: 17,
                fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                transition: "opacity 0.2s"
              }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.7"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              Take a closer look <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Social proof strip */}
        <motion.div {...fade(0.2)} style={{
          display: "flex", gap: 0, justifyContent: "center",
          flexWrap: "wrap", marginBottom: 72, fontSize: 14,
          color: "#6e6e73", borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0", padding: "20px 0"
        }}>
          {[
            "Understand your true market value",
            "·",
            "Surface hidden opportunities",
            "·",
            "See yourself through a recruiter's eyes",
            "·",
            "Know exactly what to do next",
          ].map((item, i) => (
            <span key={i} style={{ padding: "0 16px", color: item === "·" ? "#d2d2d7" : "#6e6e73" }}>{item}</span>
          ))}
        </motion.div>

        {/* Career Intelligence Dashboard Preview */}
        <motion.div {...fade(0.35)} style={{
          background: "#f5f5f7",
          borderRadius: "24px 24px 0 0",
          padding: "40px 40px 0",
          maxWidth: 900,
          margin: "0 auto",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.06)",
          textAlign: "left",
        }}>
          {/* Dashboard header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>Your Career Intelligence</div>
              <div style={{ fontSize: 14, color: "#6e6e73", marginTop: 4 }}>Updated moments ago · Personalized for you</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#34c759", fontWeight: 600 }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: "50%", background: "#34c759" }} />
              Live Analysis
            </div>
          </div>

          {/* Score cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {insights.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 0.6, ease }}
                style={{
                  background: "#fff", borderRadius: 18, padding: "24px 20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ fontSize: 12, color: "#6e6e73", fontWeight: 500, marginBottom: 12 }}>{s.label}</div>
                <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", color: s.color, lineHeight: 1 }}>
                  {s.value}<span style={{ fontSize: 16, color: "#86868b" }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: "#6e6e73", marginTop: 8 }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Recommendation card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={{ background: "#fff", borderRadius: 18, padding: "24px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 24 }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0071e3", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
              Top Recommendation
            </div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "#1d1d1f", lineHeight: 1.55 }}>
              Your leadership experience is underrepresented in your profile. Highlighting it could increase your interview callbacks by up to <strong style={{ color: "#34c759" }}>40%</strong> and move you into Staff-level conversations at 3 target companies.
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <span style={{ padding: "7px 14px", background: "#e8f5e9", color: "#2e7d32", borderRadius: 100, fontSize: 13, fontWeight: 600 }}>Apply this insight →</span>
              <span style={{ padding: "7px 14px", background: "#f0f4ff", color: "#1a73e8", borderRadius: 100, fontSize: 13, fontWeight: 600 }}>3 more insights waiting</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}




// ═══════════════════════════════════
// 2. RESUME INTELLIGENCE
// ═══════════════════════════════════
export function AppleResumeSection() {
  return (
    <section style={{ background: "#f5f5f7", padding: "120px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* Header */}
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6e6e73", marginBottom: 16 }}>
            Resume Intelligence
          </p>
          <h2 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", lineHeight: 1.06, marginBottom: 20 }}>
            A resume that writes itself.<br />Designed for impact.
          </h2>
          <p style={{ fontSize: 19, color: "#6e6e73", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Upload your existing resume. Our intelligence engine analyzes your experience, highlights your true market value, and rewrites your history to pass ATS filters and impress hiring managers.
          </p>
        </motion.div>

        {/* Agent Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
          {[
            { icon: FileText, color: "#0071e3", name: "Deep Analysis", desc: "Instantly reads your history to understand the actual scope of your past roles." },
            { icon: BrainCircuit, color: "#34c759", name: "Strength Highlighting", desc: "Identifies your most valuable skills and surfaces them to the top." },
            { icon: GitBranch, color: "#bf5af2", name: "Targeted Positioning", desc: "Aligns your narrative with the exact roles you want to land next." },
            { icon: Zap, color: "#ff9f0a", name: "ATS Optimization", desc: "Rebuilds your document using structures proven to pass automated screening." },
          ].map((card, i) => (
            <motion.div key={card.name} {...fade(i * 0.07)} style={{
              background: "#fff", borderRadius: 20, padding: "36px 28px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${card.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 20
              }}>
                <card.icon size={22} color={card.color} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f", marginBottom: 8 }}>{card.name}</div>
              <div style={{ fontSize: 15, color: "#6e6e73", lineHeight: 1.55 }}>{card.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Pipeline */}
        <motion.div {...fade(0.3)} style={{
          background: "#fff", borderRadius: 20, padding: "28px 36px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6e6e73", marginBottom: 20 }}>
            How it works
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
            {["Upload Resume", "Context Extraction", "Market Alignment", "Impact Rewriting", "ATS Formatting", "Ready to Apply"].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div style={{
                  fontSize: 13, fontWeight: 500, color: "#1d1d1f",
                  background: "#f5f5f7", borderRadius: 8, padding: "8px 16px",
                  whiteSpace: "nowrap", flexShrink: 0, border: "1px solid #e5e5ea"
                }}>
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 24, height: 1, background: "#d2d2d7", flexShrink: 0, margin: "0 2px" }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════
// 3. PROFILE INTELLIGENCE
// ═══════════════════════════════════
export function AppleProfileSection() {
  const bars = [
    { lang: "Python", pct: 100, color: "#0071e3" },
    { lang: "TypeScript", pct: 78, color: "#0071e3" },
    { lang: "Go", pct: 62, color: "#0071e3" },
    { lang: "Rust", pct: 45, color: "#0071e3" },
    { lang: "Shell", pct: 30, color: "#0071e3" },
  ];

  return (
    <section style={{ background: "#fff", padding: "120px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

          <motion.div {...fade()}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6e6e73", marginBottom: 16 }}>
              Professional Footprint
            </p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", lineHeight: 1.06, marginBottom: 20 }}>
              Your true potential.<br />Fully quantified.
            </h2>
            <p style={{ fontSize: 17, color: "#6e6e73", lineHeight: 1.65, marginBottom: 40 }}>
              Connect your professional profiles. We analyze your public footprint to uncover hidden strengths, quantify your expertise, and build a verified narrative of your career that you can take anywhere.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: Shield, label: "Verified Expertise", sub: "Skills backed by actual work history" },
                { icon: Database, label: "Continuous Sync", sub: "Your profile updates as you grow" },
                { icon: Fingerprint, label: "Your Data. Your Control.", sub: "Private by design, always secure" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon size={18} color="#1d1d1f" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f" }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: "#6e6e73" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fade(0.15)} style={{ background: "#f5f5f7", borderRadius: 24, padding: 40 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", marginBottom: 32 }}>
              Skill Composition
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {bars.map((b, i) => (
                <div key={b.lang}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#1d1d1f" }}>
                    <span>{b.lang}</span>
                    <span style={{ color: "#6e6e73" }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "#e5e5ea", borderRadius: 100 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.08, ease }}
                      style={{ height: "100%", background: b.pct === 100 ? "#0071e3" : "#1d1d1f", borderRadius: 100 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid #e5e5ea", display: "flex", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", lineHeight: 1 }}>99</span>
              <span style={{ fontSize: 28, color: "#6e6e73", marginBottom: 8 }}>% accuracy</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════
// 4. INTERVIEW INTELLIGENCE
// ═══════════════════════════════════
export function AppleInterviewSection() {
  return (
    <section style={{ background: "#1d1d1f", padding: "120px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

          {/* Session Window */}
          <motion.div {...fade()} style={{
            background: "#000", borderRadius: 20,
            padding: "28px", border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #ff9f0a, #ff375f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Radio size={14} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Live Session</div>
                  <div style={{ fontSize: 12, color: "#86868b" }}>System Design Interview</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#ff375f", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff375f" }} />
                Recording
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              <div style={{ color: "#f5f5f7", marginBottom: 16 }}>
                <span style={{ color: "#86868b", fontSize: 12, display: "block", marginBottom: 4 }}>Interviewer</span>
                "How would you handle clock skew across active-active data centers in this architecture?"
              </div>
              <div style={{ color: "#34c759", paddingLeft: 16, borderLeft: "2px solid #34c759" }}>
                <span style={{ color: "#86868b", fontSize: 12, display: "block", marginBottom: 4 }}>You</span>
                "I'd use NTP synchronization combined with a bounded staleness read policy..."
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ display: "inline-block", width: 6, height: 14, background: "#34c759", marginLeft: 4, verticalAlign: "middle" }} />
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div {...fade(0.15)}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#86868b", marginBottom: 16 }}>
              Interview Intelligence
            </p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f5f5f7", lineHeight: 1.06, marginBottom: 20 }}>
              Master the interview.<br />Before it happens.
            </h2>
            <p style={{ fontSize: 17, color: "#86868b", lineHeight: 1.65, marginBottom: 40 }}>
              Practice under real pressure. Our dynamic intelligence engine simulates the exact conversational flow, technical depth, and behavioral questions you'll face at top-tier companies.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["Technical Deep Dives", "Behavioral Scenarios", "Real-time Feedback & Scoring"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 17, fontWeight: 500, color: "#f5f5f7" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0071e3", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════
// 5. RECRUITER INTELLIGENCE
// ═══════════════════════════════════
export function AppleRecruiterSection() {
  const scores = [
    { label: "Role Alignment", value: 98, color: "#34c759" },
    { label: "Technical Depth", value: 94, color: "#0071e3" },
    { label: "Impact Metrics", value: 88, color: "#0071e3" },
    { label: "Leadership Signals", value: 61, color: "#ff9f0a" },
  ];

  return (
    <section style={{ background: "#f5f5f7", padding: "120px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6e6e73", marginBottom: 16 }}>
            Recruiter Intelligence
          </p>
          <h2 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", lineHeight: 1.06, marginBottom: 20 }}>
            See what they see.<br />Know what they think.
          </h2>
          <p style={{ fontSize: 19, color: "#6e6e73", maxWidth: 580, margin: "0 auto", lineHeight: 1.6 }}>
            Stop guessing why you didn't get the callback. Our engine analyzes your profile exactly the way hiring committees do, giving you a clear view of your strengths and red flags before you apply.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Scores */}
          <motion.div {...fade(0.1)} style={{ background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#1d1d1f", marginBottom: 32 }}>Candidate Trust Score</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {scores.map((s, i) => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 15, fontWeight: 500, color: "#1d1d1f" }}>
                    <span>{s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color }}>{s.value}%</span>
                  </div>
                  <div style={{ height: 5, background: "#e5e5ea", borderRadius: 100 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.1, ease }}
                      style={{ height: "100%", background: s.color, borderRadius: 100 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Consensus */}
          <motion.div {...fade(0.15)} style={{ background: "#fff", borderRadius: 20, padding: 40, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6e6e73", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20 }}>
                Hiring Committee Consensus
              </div>
              <p style={{ fontSize: 17, color: "#1d1d1f", lineHeight: 1.65, fontStyle: "italic", borderLeft: "3px solid #0071e3", paddingLeft: 18 }}>
                "Strong candidate for Senior roles. Technical depth is exceptional, but business impact metrics need more clarity. Recommend moving forward to onsite interviews."
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 36 }}>
              {[
                { label: "Top 10% Match", bg: "#e8f5e9", color: "#2e7d32" },
                { label: "Risk: Leadership", bg: "#fff3e0", color: "#ef6c00" },
                { label: "Ready to Interview", bg: "#e8f0fe", color: "#1a73e8" },
              ].map(b => (
                <span key={b.label} style={{ padding: "8px 16px", background: b.bg, color: b.color, borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
                  {b.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════
// 6. COPILOT
// ═══════════════════════════════════
export function AppleCopilotSection() {
  const messages = [
    { from: "user", text: "How do I position myself for a Staff role?" },
    { from: "ai", text: "Looking at your profile, your technical depth is excellent, but leadership signals are weak. Let's draft 3 new resume bullet points highlighting your cross-team impact." },
    { from: "user", text: "Focus on the product strategy side." },
    { from: "ai", text: "Done. I've updated your narrative to emphasize product vision, stakeholder alignment, and driving company-wide initiatives." },
  ];

  return (
    <section style={{ background: "#fff", padding: "120px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6e6e73", marginBottom: 16 }}>
            CareerOS Copilot
          </p>
          <h2 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#1d1d1f", lineHeight: 1.06, marginBottom: 20 }}>
            Your personal advisor.<br />Always on.
          </h2>
          <p style={{ fontSize: 19, color: "#6e6e73", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            Navigate your career with confidence. The Copilot knows your history, understands your goals, and provides precise, actionable strategy to help you land your next big role.
          </p>
        </motion.div>

        <motion.div {...fade(0.15)} style={{ background: "#f5f5f7", borderRadius: 24, overflow: "hidden", maxWidth: 780, margin: "0 auto" }}>
          {/* Chat header */}
          <div style={{ padding: "20px 28px", borderBottom: "1px solid #e5e5ea", display: "flex", alignItems: "center", gap: 12, background: "#fff" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #0071e3, #34c759)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f" }}>CareerOS Copilot</div>
              <div style={{ fontSize: 12, color: "#34c759", display: "flex", alignItems: "center", gap: 5 }}>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: "50%", background: "#34c759", display: "inline-block" }} />
                Context Aware · Ready to assist
              </div>
            </div>
          </div>
          {/* Messages */}
          <div style={{ padding: "28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                background: m.from === "user" ? "#0071e3" : "#fff",
                color: m.from === "user" ? "#fff" : "#1d1d1f",
                padding: "14px 20px",
                borderRadius: m.from === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                fontSize: 15, fontWeight: 400, maxWidth: "78%", lineHeight: 1.55,
                boxShadow: m.from === "user" ? "0 4px 16px rgba(0,113,227,0.2)" : "0 1px 4px rgba(0,0,0,0.04)"
              }}>
                {m.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════
// 7. ASSESSMENTS
// ═══════════════════════════════════
export function AppleAssessmentsSection() {
  const items = [
    { icon: BrainCircuit, title: "System Architecture", score: "Top 4%", desc: "Designing for scale and resilience" },
    { icon: Zap, title: "Execution Velocity", score: "Top 7%", desc: "Shipping features and meeting deadlines" },
    { icon: Shield, title: "Product Strategy", score: "Top 11%", desc: "Understanding user needs and market fit" },
    { icon: MessageSquare, title: "Communication", score: "Top 8%", desc: "Articulating complex ideas clearly" },
    { icon: Code, title: "Technical Depth", score: "Top 3%", desc: "Mastery of core engineering principles" },
    { icon: Users, title: "Leadership", score: "Top 16%", desc: "Mentoring teams and driving alignment" },
  ];

  return (
    <section style={{ background: "#000", padding: "120px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <motion.div {...fade()} style={{ textAlign: "center", marginBottom: 80 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6e6e73", marginBottom: 16 }}>
            Talent Ranking
          </p>
          <h2 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f5f5f7", lineHeight: 1.06, marginBottom: 20 }}>
            Measure against<br />the top 1%.
          </h2>
          <p style={{ fontSize: 19, color: "#86868b", maxWidth: 580, margin: "0 auto", lineHeight: 1.6 }}>
            Know exactly where your skills stand in the current market. We benchmark your capabilities against industry standards, giving you a clear roadmap for leveling up.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {items.map((item, i) => (
            <motion.div key={item.title} {...fade(i * 0.06)} style={{
              background: "#111", borderRadius: 20, padding: "36px 32px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <item.icon size={28} color="#6e6e73" />
                <span style={{
                  fontSize: 12, fontWeight: 700, color: "#0071e3",
                  background: "rgba(0,113,227,0.1)", padding: "4px 12px", borderRadius: 100
                }}>{item.score}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#f5f5f7", marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: "#6e6e73", lineHeight: 1.5 }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════
// 8. FOOTER
// ═══════════════════════════════════
export function AppleFooter() {
  const cols = [
    { title: "Explore CareerOS", links: [{ l: "Resume Intelligence", t: "/resume-intelligence" }, { l: "Profile Intelligence", t: "/profile-intelligence" }, { l: "Interview Prep", t: "/interview-intelligence" }, { l: "Recruiter Insights", t: "/recruiter-intelligence" }, { l: "Career Copilot", t: "/chat" }] },
    { title: "Services & Account", links: [{ l: "CareerOS+", t: "/plans" }, { l: "Coaching Network", t: "/resources" }, { l: "Manage Your Profile", t: "/settings" }, { l: "CareerOS Dashboard", t: "/dashboard" }] },
    { title: "For Enterprises", links: [{ l: "CareerOS for Recruiters", t: "/platform" }, { l: "CareerOS for Universities", t: "/platform" }, { l: "Enterprise API", t: "/docs" }, { l: "Partner Program", t: "/contact" }] },
    { title: "CareerOS Values", links: [{ l: "Privacy", t: "/privacy" }, { l: "Accessibility", t: "/about" }, { l: "Inclusion & Diversity", t: "/about" }, { l: "Data Security", t: "/privacy" }, { l: "About CareerOS", t: "/about" }] },
  ];

  return (
    <footer style={{
      background: "#f5f5f7", borderTop: "1px solid #d2d2d7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 22px" }}>

        {/* Legal */}
        <div style={{ padding: "24px 0", borderBottom: "1px solid #d2d2d7", fontSize: 12, color: "#86868b", lineHeight: 1.6 }}>
          <p style={{ marginBottom: 8 }}>1. CareerOS provides AI-driven insights based on market trends and historical data. Actual hiring outcomes, interview callbacks, and salary offers may vary.</p>
          <p style={{ marginBottom: 8 }}>2. Integration with third-party platforms requires user authorization. Data is encrypted and stored securely in accordance with our privacy policy.</p>
          <p>CareerOS is an independently designed product and is not affiliated with Apple Inc.</p>
        </div>

        {/* Links */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 32, padding: "28px 0" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <BrainCircuit size={14} color="#1d1d1f" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f" }}>CareerOS</span>
            </div>
            <p style={{ fontSize: 12, color: "#86868b", lineHeight: 1.6, marginBottom: 14 }}>
              The ultimate career intelligence platform. Designed to help you own what's next.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#86868b" }}>
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 5, height: 5, borderRadius: "50%", background: "#34c759" }} />
              All Services Online
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1d1d1f", marginBottom: 12 }}>{col.title}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {col.links.map(link => (
                  <li key={link.l}>
                    <Link to={link.t} style={{ fontSize: 12, color: "#424245", textDecoration: "none" }}
                      onMouseOver={e => e.target.style.color = "#1d1d1f"}
                      onMouseOut={e => e.target.style.color = "#424245"}>
                      {link.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ borderTop: "1px solid #d2d2d7", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#86868b" }}>
          <span>Copyright © 2026 CareerOS Inc. All rights reserved.</span>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy Policy", "Terms of Use", "Legal", "Site Map"].map((l, i, arr) => (
              <React.Fragment key={l}>
                <Link to="#" style={{ color: "#424245", textDecoration: "none", fontSize: 12 }}
                  onMouseOver={e => e.target.style.color = "#1d1d1f"}
                  onMouseOut={e => e.target.style.color = "#424245"}>{l}</Link>
                {i < arr.length - 1 && <span style={{ color: "#d2d2d7" }}>|</span>}
              </React.Fragment>
            ))}
          </div>
          <span>India</span>
        </div>
      </div>
    </footer>
  );
}

// ── Backwards-compatible exports ──
export const HeroSection            = AppleHeroSection;
export const WowIntelligenceSection = AppleResumeSection;
export const ProductRealitySection  = AppleProfileSection;
export const MetricsAndMotionSection = AppleInterviewSection;
export const EnterpriseFooter       = AppleFooter;
export const RecruiterSection       = AppleRecruiterSection;
export const CopilotSection         = AppleCopilotSection;
export const AssessmentsSection     = AppleAssessmentsSection;

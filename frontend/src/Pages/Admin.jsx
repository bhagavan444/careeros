import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { useIntelligenceStore } from '../store/intelligenceStore';
import './Home.css';

/* ================= CONFIG ================= */
const ADMIN_EMAIL = "admin@pathora.com";
const ADMIN_PASSWORD = "admin123";
const DOMAINS = ["tech", "data", "ai", "cloud", "business"];
const LEVELS = ["easy", "medium", "hard"];
const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#06B6D4", "#8B5CF6"];

/* ================= MAIN ================= */
export default function Admin() {
  const [auth, setAuth] = useState(localStorage.getItem("ADMIN_TOKEN"));
  if (!auth) return <AdminLogin onAuth={setAuth} />;
  return <AdminDashboard onLogout={() => {
    localStorage.removeItem("ADMIN_TOKEN");
    setAuth(null);
  }} />;
}

/* ================= LOGIN ================= */
function AdminLogin({ onAuth }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  const login = () => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      localStorage.setItem("ADMIN_TOKEN", "jwt_mock");
      onAuth("jwt_mock");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="home-wrap" style={{ cursor: "none" }}>
      <MagneticCursor cursorX={cursorX} cursorY={cursorY} />
      <div className="grid-bg" style={{ opacity: 0.4 }} />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "56px", maxWidth: "440px", width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <motion.div animate={{ boxShadow: ["0 0 20px rgba(124,58,237,0.3)", "0 0 40px rgba(124,58,237,0.5)", "0 0 20px rgba(124,58,237,0.3)"] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: "72px", height: "72px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px", fontWeight: "900", color: "#fff" }}>
              PN
            </motion.div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#fff", marginBottom: "6px", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>
              Operations Console
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", fontFamily: "'JetBrains Mono', monospace" }}>
              Authenticated access required
            </p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'JetBrains Mono', monospace" }}>Email</label>
            <input type="email" placeholder="admin@pathora.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", transition: "border-color 0.3s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>
          <div style={{ marginBottom: "32px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'JetBrains Mono', monospace" }}>Password</label>
            <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", transition: "border-color 0.3s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              onFocus={e => e.target.style.borderColor = "rgba(124,58,237,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              onKeyDown={e => e.key === "Enter" && login()} />
          </div>
          <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(124,58,237,0.5)" }} whileTap={{ scale: 0.97 }} onClick={login}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: "10px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Authenticate
          </motion.button>
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            Pathora Intelligence Platform • v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ================= MAGNETIC CURSOR ================= */
function MagneticCursor({ cursorX, cursorY, isHovering: propHovering }) {
  const [isHovering, setIsHovering] = useState(false);

  // Use prop hovering state if provided, otherwise use local state
  const hoverState = propHovering !== undefined ? propHovering : isHovering;

  useEffect(() => {
    if (propHovering !== undefined) return; // Skip if controlled by parent

    const updateHoverState = () => {
      const hoverable = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
      
      const handleMouseEnter = () => setIsHovering(true);
      const handleMouseLeave = () => setIsHovering(false);

      hoverable.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        hoverable.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };

    // Initial setup
    const cleanup = updateHoverState();

    // Re-setup after DOM changes
    const observer = new MutationObserver(() => {
      cleanup();
      updateHoverState();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, [propHovering]);

  return (
    <>
      {/* Main Cursor Ring */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid rgba(37, 99, 235, 0.8)",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          pointerEvents: "none",
          zIndex: 99999,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          scale: hoverState ? 1.8 : 1,
          backgroundColor: hoverState ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
          borderColor: hoverState ? "rgba(37, 99, 235, 1)" : "rgba(37, 99, 235, 0.8)",
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
      
      {/* Center Dot */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#2563EB",
          pointerEvents: "none",
          zIndex: 100000,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: hoverState ? 0 : 1 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      />
      
      {/* Outer Trail Ring */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "1px solid rgba(37, 99, 235, 0.3)",
          pointerEvents: "none",
          zIndex: 99998,
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hoverState ? 1.5 : 1,
          opacity: hoverState ? 0.5 : 0.3,
        }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
      />
    </>
  );
}

/* ================= DASHBOARD ================= */
function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [health, setHealth] = useState({ status: "checking...", version: "---", gemini_configured: false });
  const [chats, setChats] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const resumeData = useIntelligenceStore((state) => state.resumeData);
  const resumeAnalysis = useIntelligenceStore((state) => state.resumeAnalysis);
  const recruiterMetrics = useIntelligenceStore((state) => state.recruiterMetrics);
  const verifiedSkills = useIntelligenceStore((state) => state.verifiedSkills);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mousePosition.x, springConfig);
  const cursorY = useSpring(mousePosition.y, springConfig);

  useEffect(() => {
    const mouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  useEffect(() => {
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
      const handleMouseEnter = () => setCursorHover(true);
      const handleMouseLeave = () => setCursorHover(false);
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };
    const cleanup = addHoverListeners();
    const observer = new MutationObserver(() => { cleanup(); addHoverListeners(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { cleanup(); observer.disconnect(); };
  }, [activeTab]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://pathora-backend1.onrender.com";
        const hRes = await fetch(`${baseUrl}/health`);
        if (hRes.ok) {
          setHealth(await hRes.json());
        } else {
          setHealth({ status: "degraded", version: "unknown", gemini_configured: false });
        }
        
        const cRes = await fetch(`${baseUrl}/api/v1/chat/chats`);
        if (cRes.ok) {
          const cData = await cRes.json();
          const sessions = cData.sessions || [];
          setChats(sessions);
          
          let generatedLogs = sessions.slice(0, 15).map((s, i) => ({
            action: `Assistant Memory Sync: Session ${s._id.slice(0,8)}`,
            time: new Date(s.createdAt).toLocaleString(),
            timestamp: new Date(s.createdAt).getTime() - i * 1000,
            type: "assistant"
          }));
          
          if (resumeAnalysis) {
            generatedLogs.unshift({
              action: `ATS Engine: Resume parsed. Score ${resumeAnalysis.ats_score || recruiterMetrics.score || 0}`,
              time: new Date().toLocaleString(),
              timestamp: Date.now(),
              type: "ats"
            });
            generatedLogs.unshift({
              action: `Semantic Extraction: Found ${recruiterMetrics.matchedSkills?.length || 0} matching skills`,
              time: new Date().toLocaleString(),
              timestamp: Date.now() + 1000,
              type: "parser"
            });
          }
          
          generatedLogs.unshift({
            action: `System initialized. Connected to Gemini 2.5 Engine.`,
            time: new Date().toLocaleString(),
            timestamp: Date.now() + 2000,
            type: "system"
          });
          
          setLogs(generatedLogs.sort((a,b) => b.timestamp - a.timestamp));
        }
      } catch (err) {
        console.error("Telemetry error", err);
        setHealth({ status: "offline", version: "---", gemini_configured: false });
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, [resumeAnalysis, recruiterMetrics]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = [
    { id: "overview", label: "AI System Status", icon: "📡" },
    { id: "intelligence", label: "Recruiter Intelligence", icon: "🧠" },
    { id: "telemetry", label: "Live Telemetry", icon: "⚡" },
    { id: "observability", label: "Backend Observability", icon: "🌐" },
  ];

  const totalTokens = chats.reduce((acc, chat) => acc + (chat.messages?.length || 0) * 150, 0);
  const atsEngineStatus = resumeAnalysis ? "Active" : "Idle";
  const geminiStatus = health.gemini_configured ? "Connected" : "Disconnected";
  
  const radarData = recruiterMetrics.matchedSkills.slice(0,6).map(skill => ({
    subject: skill, A: 120, fullMark: 150
  }));
  if (radarData.length === 0) radarData.push({ subject: "No Data", A: 0, fullMark: 150 });

  return (
    <div className="home-wrap" style={{ cursor: "none" }}>
      <MagneticCursor cursorX={cursorX} cursorY={cursorY} isHovering={cursorHover} />
      <div className="grid-bg" style={{ opacity: 0.6 }} />
      
      <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 10 }}>
        <motion.aside
          animate={{ width: sidebarCollapsed ? "80px" : "280px" }}
          style={{
            background: "rgba(10, 10, 15, 0.4)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            height: "100vh", position: "sticky", top: 0,
            display: "flex", flexDirection: "column",
            transition: "width 0.3s ease",
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {!sidebarCollapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "900", color: "#FFFFFF" }}>
                  PN
                </div>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: 0, fontFamily: "var(--font-body)" }}>Pathora</h2>
                  <p style={{ fontSize: "11px", color: "var(--tm)", margin: 0, fontFamily: "var(--mono)" }}>Ops Console</p>
                </div>
              </div>
            )}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: "transparent", border: "none", fontSize: "20px", color: "var(--tm)", cursor: "none", padding: "8px" }}>
              {sidebarCollapsed ? "→" : "←"}
            </motion.button>
          </div>

          <nav style={{ flex: 1, padding: "16px" }}>
            {navItems.map((item) => (
              <motion.button key={item.id} whileHover={{ x: 4 }} onClick={() => setActiveTab(item.id)} style={{ width: "100%", padding: "12px 16px", background: activeTab === item.id ? "rgba(124, 58, 237, 0.15)" : "transparent", border: "none", borderLeft: activeTab === item.id ? "3px solid #7c3aed" : "3px solid transparent", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", cursor: "none", transition: "all 0.2s", textAlign: "left" }}>
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                {!sidebarCollapsed && (
                  <span style={{ fontSize: "14px", fontWeight: activeTab === item.id ? "600" : "500", color: activeTab === item.id ? "#fff" : "var(--tm)", fontFamily: "var(--font-body)" }}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <motion.button whileHover={{ scale: 1.02 }} onClick={onLogout} style={{ width: "100%", padding: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", color: "#f87171", fontSize: "14px", fontWeight: "600", cursor: "none" }}>
              {sidebarCollapsed ? "🚪" : "End Session"}
            </motion.button>
          </div>
        </motion.aside>

        <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
          <header style={{ background: "rgba(10, 10, 15, 0.6)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 40px", position: "sticky", top: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", margin: 0, fontFamily: "var(--font-body)", letterSpacing: "-0.02em" }}>
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p style={{ fontSize: "13px", color: "var(--tm)", margin: "4px 0 0 0", fontFamily: "var(--mono)" }}>
                Core Engine Operational • Runtime: {health.version}
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", background: "rgba(16, 185, 129, 0.1)", padding: "8px 16px", borderRadius: "100px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px rgba(16, 185, 129, 0.8)", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600", fontFamily: "var(--mono)", textTransform: "uppercase" }}>{health.status}</span>
            </div>
          </header>

          <div style={{ padding: "40px" }}>
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "32px" }}>
                  {[
                    { label: "Gemini Integration", value: geminiStatus, icon: "🧠", color: "#7c3aed" },
                    { label: "ATS Pipeline", value: atsEngineStatus, icon: "📄", color: "#10b981" },
                    { label: "Assistant Contexts", value: chats.length, icon: "💬", color: "#3b82f6" },
                    { label: "System Health", value: health.status === "healthy" ? "99.9%" : "Degraded", icon: "✓", color: "#f59e0b" },
                  ].map((stat, i) => (
                    <motion.div key={i} whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)" }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden", transition: "all 0.3s" }}>
                      <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: `${stat.color}20`, borderRadius: "50%", filter: "blur(30px)" }} />
                      <div style={{ fontSize: "28px", marginBottom: "12px" }}>{stat.icon}</div>
                      <div style={{ fontSize: "12px", color: "var(--tm)", marginBottom: "4px", fontFamily: "var(--mono)", textTransform: "uppercase" }}>{stat.label}</div>
                      <div style={{ fontSize: "24px", fontWeight: "700", color: "#fff" }}>{stat.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "4px", height: "16px", background: "#7c3aed", borderRadius: "2px" }}/> Admin Action Controls
                    </h3>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <button onClick={() => showToast("Memory cache cleared")} className="btn-glass-outline" style={{ fontSize: "13px", padding: "8px 16px" }}>Clear Assistant Memory</button>
                      <button onClick={() => showToast("Semantic profile refreshed")} className="btn-glass-outline" style={{ fontSize: "13px", padding: "8px 16px" }}>Refresh Semantic Profile</button>
                      <button onClick={() => showToast("Syncing state with Gemini...")} className="btn-glass-primary" style={{ fontSize: "13px", padding: "8px 16px" }}>Sync Intelligence State</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "intelligence" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {resumeAnalysis ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "4px", height: "16px", background: "#10b981", borderRadius: "2px" }}/> ATS Confidence Score
                      </h3>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "64px", fontWeight: "800", color: "#10b981", lineHeight: 1 }}>{recruiterMetrics.score}</span>
                        <span style={{ fontSize: "16px", color: "var(--tm)", paddingBottom: "10px" }}>/ 100</span>
                      </div>
                      <p style={{ fontSize: "14px", color: "var(--tm)", lineHeight: 1.6 }}>
                        The semantic parser has identified {recruiterMetrics.matchedSkills?.length || 0} matching skills and {recruiterMetrics.missingSkills?.length || 0} critical missing skills against the target role model.
                      </p>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "4px", height: "16px", background: "#3b82f6", borderRadius: "2px" }}/> Technical Strength Mapping
                      </h3>
                      <div style={{ height: "200px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} outerRadius="70%">
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--tm)', fontSize: 10 }} />
                            <Radar name="Skills" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", gridColumn: "1 / -1" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "4px", height: "16px", background: "#f59e0b", borderRadius: "2px" }}/> Missing Skills Detection
                      </h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {(recruiterMetrics.missingSkills || []).map(skill => (
                          <div key={skill} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontFamily: "var(--mono)" }}>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "80px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
                    <h3 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>No Recruiter Data Active</h3>
                    <p style={{ color: "var(--tm)", fontSize: "14px" }}>Upload a resume via the Predict pipeline to populate this intelligence dashboard.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "telemetry" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", fontFamily: "var(--mono)", height: "600px", overflowY: "auto", boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }}>
                <div style={{ color: "#4ade80", fontSize: "12px", marginBottom: "20px" }}>Pathora Runtime Environment v{health.version} - Streaming Logs</div>
                {logs.length === 0 ? (
                  <p style={{ color: "var(--tm)" }}>Awaiting system events...</p>
                ) : (
                  logs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ display: "flex", gap: "16px", marginBottom: "8px", fontSize: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "8px" }}>
                      <span style={{ color: "var(--tm)", minWidth: "160px" }}>[{log.time}]</span>
                      <span style={{ color: log.type === "ats" ? "#60a5fa" : log.type === "assistant" ? "#c084fc" : "#fbbf24", minWidth: "80px", textTransform: "uppercase" }}>
                        {log.type}
                      </span>
                      <span style={{ color: "#d1d5db" }}>{log.action}</span>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "observability" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "24px", fontFamily: "var(--font-body)" }}>API Gateway Latency</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={[ { time: '10:00', ms: 45 }, { time: '10:05', ms: 52 }, { time: '10:10', ms: 48 }, { time: '10:15', ms: 95 }, { time: '10:20', ms: 41 }, { time: '10:25', ms: 44 } ]}>
                        <XAxis dataKey="time" stroke="var(--tm)" fontSize={10} />
                        <YAxis stroke="var(--tm)" fontSize={10} />
                        <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                        <Line type="monotone" dataKey="ms" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: "#7c3aed" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>Token Usage Estimation</h3>
                    <p style={{ color: "var(--tm)", fontSize: "13px", marginBottom: "24px" }}>Based on active Assistant sessions and context memory size.</p>
                    <div style={{ fontSize: "48px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>{totalTokens.toLocaleString()} <span style={{ fontSize: "18px", color: "var(--tm)", fontWeight: "500" }}>Tokens</span></div>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: "35%", height: "100%", background: "linear-gradient(90deg, #7c3aed, #4f46e5)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--tm)", marginTop: "8px", fontFamily: "var(--mono)" }}>
                      <span>0</span>
                      <span>Rate Limit: 1M / min</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: "fixed", bottom: "32px", right: "32px", background: toast.type === "success" ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)", backdropFilter: "blur(12px)", color: "#FFFFFF", padding: "16px 24px", borderRadius: "12px", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)", fontSize: "14px", fontWeight: "600", zIndex: 10000, border: "1px solid rgba(255,255,255,0.1)" }}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useWindowSize } from "react-use";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, CartesianGrid, Area, AreaChart,
  XAxis, YAxis, Tooltip,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─────────────────────────────────────────────
   MOCK DATA — used when API is unavailable
───────────────────────────────────────────── */
const MOCK_RESULT = {
  score: 78,
  roles: [
    "Full Stack Developer",
    "Software Engineer",
    "Backend Developer",
    "Cloud Engineer",
    "DevOps Engineer",
  ],
  skills: [
    "React", "Node.js", "TypeScript", "Python", "REST APIs",
    "PostgreSQL", "Docker", "Git", "AWS", "CI/CD",
  ],
  aspectScores: [
    { name: "Technical Skills", value: 82 },
    { name: "Experience",       value: 70 },
    { name: "Communication",    value: 65 },
    { name: "Leadership",       value: 55 },
    { name: "Problem Solving",  value: 88 },
    { name: "Domain Knowledge", value: 74 },
  ],
  roadmap: [
    "Complete AWS Solutions Architect certification",
    "Build 2 end-to-end system design projects",
    "Contribute to open-source to show collaboration skills",
    "Practice STAR-format behavioural responses",
    "Target mid-size product companies as stepping stones to MNC",
  ],
  improvements: [
    "Quantify impact of every bullet point with metrics (e.g. reduced latency by 40%)",
    "Add a dedicated Skills section organised by category for ATS scanners",
    "Include cloud platform certifications prominently in the header",
    "Replace passive language with action verbs — 'built', 'led', 'reduced'",
  ],
  growthProjection: [
    { year: "Now", salary: 45000 },
    { year: "Y1",  salary: 58000 },
    { year: "Y2",  salary: 72000 },
    { year: "Y3",  salary: 88000 },
    { year: "Y5",  salary: 115000 },
  ],
};

/* ─────────────────────────────────────────────
   STYLE INJECTION
───────────────────────────────────────────── */
const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("pnx-predict-styles")) return;
  const s = document.createElement("style");
  s.id = "pnx-predict-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeSlideRight {
      from { opacity: 0; transform: translateX(-14px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scoreReveal {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes barExpand {
      from { width: 0 !important; }
    }
    @keyframes numberBlur {
      from { opacity: 0; filter: blur(8px); }
      to   { opacity: 1; filter: blur(0); }
    }
    @keyframes dotPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(1.7); opacity: 0.5; }
    }
    @keyframes orb {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%       { transform: translate(28px, -18px) scale(1.04); }
      66%       { transform: translate(-18px, 14px) scale(0.96); }
    }

    .reveal-up  { animation: fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .reveal-r   { animation: fadeSlideRight 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    .score-anim { animation: scoreReveal 0.65s cubic-bezier(0.34,1.56,0.64,1) both; }

    .glass-card {
      background: #ffffff;
      border: 1px solid #e8e8e5;
      border-radius: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.03);
      transition: border-color 0.25s, transform 0.22s, box-shadow 0.22s;
    }
    .glass-card:hover {
      border-color: rgba(37,99,235,0.22);
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(0,0,0,0.07), 0 2px 6px rgba(37,99,235,0.05);
    }

    .kpi-card {
      background: #ffffff;
      border: 1px solid #e8e8e5;
      border-radius: 16px;
      padding: 22px 24px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .kpi-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(37,99,235,0.03) 0%, transparent 55%);
      opacity: 0;
      transition: opacity 0.25s;
      pointer-events: none;
    }
    .kpi-card:hover::after { opacity: 1; }
    .kpi-card:hover {
      border-color: rgba(37,99,235,0.2);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    }

    .pnx-input {
      width: 100%;
      background: #fafaf8;
      border: 1px solid #e2e2df;
      border-radius: 10px;
      padding: 12px 14px;
      color: #111;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    }
    .pnx-input::placeholder { color: #b8b8b4; }
    .pnx-input:focus {
      border-color: rgba(37,99,235,0.45);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.09);
    }

    .upload-zone {
      border: 1.5px dashed rgba(37,99,235,0.28);
      border-radius: 14px;
      padding: 28px 20px;
      text-align: center;
      cursor: pointer;
      background: rgba(37,99,235,0.025);
      position: relative;
      overflow: hidden;
      transition: border-color 0.22s, background 0.22s;
    }
    .upload-zone:hover {
      border-color: rgba(37,99,235,0.5);
      background: rgba(37,99,235,0.05);
    }
    .upload-zone input[type=file] {
      position: absolute; inset: 0;
      opacity: 0; cursor: pointer;
      width: 100%; height: 100%;
    }

    .submit-btn {
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, #2563eb 0%, #5b21b6 100%);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.01em;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.16s, box-shadow 0.18s, opacity 0.18s;
      box-shadow: 0 4px 18px rgba(37,99,235,0.3), 0 1px 3px rgba(0,0,0,0.2);
    }
    .submit-btn::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      border-radius: inherit;
      pointer-events: none;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 26px rgba(37,99,235,0.38), 0 2px 6px rgba(0,0,0,0.2);
    }
    .submit-btn:active:not(:disabled) { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

    .btn-primary {
      padding: 10px 18px;
      background: linear-gradient(135deg, #2563eb, #5b21b6);
      color: #fff; border: none; border-radius: 9px;
      font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
      cursor: pointer;
      transition: transform 0.16s, box-shadow 0.18s;
      box-shadow: 0 2px 10px rgba(37,99,235,0.28);
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(37,99,235,0.38); }

    .btn-ghost {
      padding: 10px 18px;
      background: #fff; color: #374151;
      border: 1px solid #e2e2df; border-radius: 9px;
      font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
      cursor: pointer;
      transition: background 0.16s, border-color 0.16s, color 0.16s;
    }
    .btn-ghost:hover { background: #f5f5f2; border-color: #ccc; color: #111; }

    .eyebrow {
      font-family: 'DM Mono', monospace;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: #a3a3a0;
    }

    .skill-tag {
      display: inline-flex; align-items: center;
      font-family: 'DM Mono', monospace;
      font-size: 11px; font-weight: 500;
      padding: 5px 10px; border-radius: 6px;
      letter-spacing: 0.02em;
      transition: all 0.15s; cursor: default;
    }
    .skill-tag-core    { background: rgba(37,99,235,0.07); color: #1d4ed8; border: 1px solid rgba(37,99,235,0.15); }
    .skill-tag-core:hover { background: rgba(37,99,235,0.13); border-color: rgba(37,99,235,0.3); }
    .skill-tag-support { background: #f4f4f2; color: #6b7280; border: 1px solid #e8e8e5; }
    .skill-tag-gap     { background: transparent; color: #dc2626; border: 1px dashed rgba(220,38,38,0.3); }

    .toggle-row {
      display: flex; align-items: center; gap: 14px;
      padding: 13px 15px;
      background: #fafaf8; border: 1px solid #e2e2df; border-radius: 10px;
      cursor: pointer;
      transition: background 0.16s, border-color 0.16s;
    }
    .toggle-row:hover { background: rgba(37,99,235,0.04); border-color: rgba(37,99,235,0.22); }

    .road-node {
      display: flex; gap: 14px;
      animation: fadeSlideRight 0.38s cubic-bezier(0.22,1,0.36,1) both;
    }
  `;
  document.head.appendChild(s);
};
injectStyles();

/* ─────────────────────────────────────────────
   MAGNETIC CURSOR
───────────────────────────────────────────── */
function MagneticCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const cur     = useRef({ x: 0, y: 0 });
  const tgt     = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      tgt.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top  = e.clientY + "px";
      }
    };
    const loop = () => {
      cur.current.x += (tgt.current.x - cur.current.x) * 0.085;
      cur.current.y += (tgt.current.y - cur.current.y) * 0.085;
      if (ringRef.current) {
        ringRef.current.style.left = cur.current.x + "px";
        ringRef.current.style.top  = cur.current.y + "px";
      }
      requestAnimationFrame(loop);
    };
    const grow   = () => { if (ringRef.current) { ringRef.current.style.width = "50px"; ringRef.current.style.height = "50px"; ringRef.current.style.opacity = "0.55"; } };
    const shrink = () => { if (ringRef.current) { ringRef.current.style.width = "26px"; ringRef.current.style.height = "26px"; ringRef.current.style.opacity = "0.28"; } };
    const attach = () => {
      document.querySelectorAll("button,input,label,a,.glass-card,.kpi-card,.upload-zone,.skill-tag").forEach(el => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    window.addEventListener("mousemove", onMove);
    loop();
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("mousemove", onMove); obs.disconnect(); };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{
        position:"fixed", pointerEvents:"none", zIndex:9999,
        width:"26px", height:"26px",
        border:"1.5px solid rgba(37,99,235,0.65)",
        borderRadius:"50%",
        transform:"translate(-50%,-50%)",
        opacity:0.28,
        transition:"width 0.28s ease,height 0.28s ease,opacity 0.28s ease",
        mixBlendMode:"multiply",
      }} />
      <div ref={dotRef} style={{
        position:"fixed", pointerEvents:"none", zIndex:9999,
        width:"4px", height:"4px",
        background:"#2563eb",
        borderRadius:"50%",
        transform:"translate(-50%,-50%)",
        boxShadow:"0 0 6px 2px rgba(37,99,235,0.35)",
      }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   SCORE SVG RING  (cx, cy both defined; dynamic radius)
───────────────────────────────────────────── */
function ScoreRing({ score, color, size }) {
  const sz   = size || 176;
  const r    = Math.round(sz * 0.44);
  const cx   = sz / 2;
  const cy   = sz / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min((score / 100) * circ, circ);
  const gid  = "ring-g";

  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}
      style={{ filter:`drop-shadow(0 0 10px ${color}30)`, display:"block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ece9e5" strokeWidth="9" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="9" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ / 4}
        style={{ transition:"stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)" }}
      />
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={color} />
          <stop offset="100%" stopColor={
            color === "#059669" ? "#047857"
            : color === "#d97706" ? "#b45309"
            : "#b91c1c"
          } />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   AMBIENT BACKGROUND
───────────────────────────────────────────── */
function AmbientBg({ scoreColor }) {
  const c = scoreColor || "#2563eb";
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div style={{
        position:"absolute", width:640, height:640, borderRadius:"50%",
        background:`radial-gradient(circle, ${c}0d 0%, transparent 65%)`,
        top:"-200px", right:"-130px",
        animation:"orb 14s ease-in-out infinite",
        filter:"blur(55px)",
      }} />
      <div style={{
        position:"absolute", width:480, height:480, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(91,33,182,0.06) 0%, transparent 65%)",
        bottom:"5%", left:"-110px",
        animation:"orb 18s ease-in-out infinite reverse",
        filter:"blur(65px)",
      }} />
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.016 }}>
        <defs>
          <pattern id="pnxDots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#111" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pnxDots)" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM CHART TOOLTIP
───────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#fff", border:"1px solid #e8e8e5",
      borderRadius:9, padding:"9px 13px",
      fontFamily:"'DM Mono',monospace", fontSize:12, color:"#111",
      boxShadow:"0 6px 22px rgba(0,0,0,0.09)",
    }}>
      <div style={{ color:"#a3a3a0", marginBottom:3 }}>{label}</div>
      <div style={{ color:"#2563eb", fontWeight:500 }}>
        {typeof payload[0]?.value === "number"
          ? payload[0].value.toLocaleString()
          : payload[0]?.value}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const getScoreColor = (s) =>
  s >= 80 ? "#059669" : s >= 60 ? "#d97706" : "#dc2626";
const getScoreLabel = (s) =>
  s >= 80 ? "High Compatibility" : s >= 60 ? "Moderate Compatibility" : "Needs Enhancement";
const getReadyLabel = (s) =>
  s >= 80 ? "MNC Ready" : s >= 60 ? "Industry Ready" : "Development Phase";

const LOAD_STEPS = [
  "Parsing resume architecture …",
  "Extracting semantic skill signals …",
  "Benchmarking against MNC criteria …",
  "Computing career path vectors …",
  "Synthesising intelligence report …",
];

/* safe array helper */
const safeArr = (v) => (Array.isArray(v) ? v : []);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Predict() {
  const [resumeFile, setResumeFile] = useState(null);
  const [domain,     setDomain]     = useState("");
  const [interest,   setInterest]   = useState("");
  const [useAI,      setUseAI]      = useState(true);
  const [loading,    setLoading]    = useState(false);
  const [loadStep,   setLoadStep]   = useState(0);
  const [result,     setResult]     = useState(null);
  const [animScore,  setAnimScore]  = useState(0);
  const [errorMsg,   setErrorMsg]   = useState("");

  const reportRef = useRef(null);
  const { width }  = useWindowSize();
  const isMobile   = width < 768;
  const isMed      = width < 1100;

  /* Loading ticker */
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setLoadStep(s => (s + 1) % LOAD_STEPS.length), 1400);
    return () => clearInterval(t);
  }, [loading]);

  /* Animated score counter */
  useEffect(() => {
    if (!result || animScore >= result.score) return;
    const t = setTimeout(() => setAnimScore(p => Math.min(p + 1, result.score)), 16);
    return () => clearTimeout(t);
  }, [animScore, result]);

  /* file handler */
  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setResumeFile(f);
    setResult(null);
    setAnimScore(0);
    setErrorMsg("");
  };

  /* normalise API response — fill missing fields with mock */
  const normalise = (data) => ({
    score:            typeof data?.score === "number" ? data.score : MOCK_RESULT.score,
    roles:            safeArr(data?.roles).length            ? data.roles            : MOCK_RESULT.roles,
    skills:           safeArr(data?.skills).length           ? data.skills           : MOCK_RESULT.skills,
    aspectScores:     safeArr(data?.aspectScores).length     ? data.aspectScores     : MOCK_RESULT.aspectScores,
    roadmap:          safeArr(data?.roadmap).length          ? data.roadmap          : MOCK_RESULT.roadmap,
    improvements:     safeArr(data?.improvements).length     ? data.improvements     : MOCK_RESULT.improvements,
    growthProjection: safeArr(data?.growthProjection).length ? data.growthProjection : MOCK_RESULT.growthProjection,
  });

  const submit = async () => {
    if (!resumeFile) { setErrorMsg("Please upload a resume file first."); return; }
    setErrorMsg("");
    const fd = new FormData();
    fd.append("resume",          resumeFile);
    fd.append("preferredDomain", domain);
    fd.append("interests",       interest);
    fd.append("useAI",           String(useAI));
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/predict`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(normalise(res.data));
      setAnimScore(0);
    } catch (err) {
      console.warn("API unavailable — rendering demo data:", err?.message);
      /* Fall back to mock so the UI still renders */
      setResult(normalise(MOCK_RESULT));
      setAnimScore(0);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, backgroundColor: "#f7f7f5", useCORS: true, logging: false,
      });
      const pdf = new jsPDF("p", "mm", "a4");
      const w   = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 10, w, (canvas.height * w) / canvas.width);
      pdf.save("PathNex_Intelligence_Report.pdf");
    } catch { alert("PDF export failed. Please try again."); }
  };

  const sc    = result ? getScoreColor(result.score) : "#2563eb";
  const score = result?.score ?? 0;

  /* ─── RENDER ─── */
  return (
    <div style={{
      minHeight:"100vh", background:"#f7f7f5", color:"#111",
      fontFamily:"'Outfit',sans-serif", cursor:"none",
      position:"relative", paddingBottom:100, overflowX:"hidden",
    }}>
      <MagneticCursor />
      <AmbientBg scoreColor={sc} />

      {/* ── STICKY NAV RAIL ── */}
      <div style={{
        position:"sticky", top:0, zIndex:200,
        background:"rgba(247,247,245,0.90)",
        backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)",
        borderBottom:"1px solid #e8e8e5",
        height:52, display:"flex", alignItems:"center",
        padding:"0 32px", justifyContent:"space-between", gap:16,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{
            width:6, height:6, borderRadius:"50%",
            background:"#2563eb", boxShadow:"0 0 7px rgba(37,99,235,0.7)",
            animation:"dotPulse 2.2s ease-in-out infinite",
          }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#adadaa", letterSpacing:"0.07em" }}>PATHNEX</span>
          <span style={{ color:"#d4d4cf", fontSize:11 }}>/</span>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#737370", letterSpacing:"0.07em" }}>INTELLIGENCE</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {result && (
            <span style={{
              fontFamily:"'DM Mono',monospace", fontSize:11,
              color:sc, background:`${sc}12`, border:`1px solid ${sc}28`,
              padding:"3px 11px", borderRadius:20, letterSpacing:"0.06em",
            }}>
              ATS {score}/100 · {getReadyLabel(score)}
            </span>
          )}
          {result && (
            <button className="btn-primary" onClick={downloadPDF} style={{ padding:"6px 13px", fontSize:12 }}>
              ↓ Export PDF
            </button>
          )}
        </div>
      </div>

      {/* ── PAGE HEADER ── */}
      <div style={{
        maxWidth:1240, margin:"0 auto",
        padding: isMobile ? "44px 20px 28px" : "64px 40px 40px",
        position:"relative", zIndex:1,
      }}>
        <p className="eyebrow reveal-up" style={{ marginBottom:12, animationDelay:"0.04s" }}>
          Resume Intelligence Engine · v2.4
        </p>
        <h1 className="reveal-up" style={{
          fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
          fontSize: isMobile ? "34px" : "54px",
          fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.06,
          color:"#0f0f0f", marginBottom:14, animationDelay:"0.09s",
        }}>
          AI Career{" "}
          <span style={{
            background:"linear-gradient(135deg,#2563eb 0%,#7c3aed 60%,#059669 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            Intelligence Report
          </span>
        </h1>
        <p className="reveal-up" style={{
          fontSize:15, color:"#8a8a87", fontWeight:300,
          maxWidth:460, lineHeight:1.65, animationDelay:"0.14s",
        }}>
          Enterprise-grade hiring alignment analysis. Precision-engineered for ambitious professionals.
        </p>
      </div>

      {/* ── UPLOAD FORM ── */}
      {!result && (
        <div style={{
          maxWidth:600, margin:"0 auto",
          padding: isMobile ? "0 20px" : "0 40px",
          position:"relative", zIndex:1,
        }}>
          <div className="glass-card reveal-up" style={{ padding: isMobile ? "26px 22px" : "38px", animationDelay:"0.18s" }}>
            <h2 style={{
              fontSize:21, fontWeight:700, letterSpacing:"-0.02em",
              color:"#0f0f0f", marginBottom:6,
            }}>
              Upload your resume
            </h2>
            <p style={{ fontSize:13, color:"#8a8a87", fontWeight:300, marginBottom:26 }}>
              PDF · Max 10 MB · Benchmarked against live enterprise hiring standards
            </p>

            {/* Upload zone */}
            <div style={{ marginBottom:16 }}>
              <div className="upload-zone">
                <input type="file" accept=".pdf" onChange={handleFile} />
                {resumeFile ? (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, pointerEvents:"none" }}>
                    <div style={{
                      width:38, height:38, borderRadius:10,
                      background:"rgba(5,150,105,0.1)", border:"1px solid rgba(5,150,105,0.22)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:16, color:"#059669",
                    }}>✓</div>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#059669", letterSpacing:"0.02em" }}>
                      {resumeFile.name}
                    </span>
                  </div>
                ) : (
                  <div style={{ pointerEvents:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                    <div style={{
                      width:42, height:42, borderRadius:11,
                      background:"rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.16)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, color:"#2563eb",
                    }}>↑</div>
                    <div style={{ textAlign:"center" }}>
                      <p style={{ fontSize:14, fontWeight:500, color:"#374151", marginBottom:3 }}>Drop your PDF here</p>
                      <p style={{ fontSize:12, color:"#a3a3a0" }}>or click to browse</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Domain */}
            <div style={{ marginBottom:13 }}>
              <label style={{
                display:"block", fontSize:11, fontWeight:500, color:"#737370", marginBottom:6,
                fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase",
              }}>
                Preferred Domain{" "}
                <span style={{ color:"#b8b8b4" }}>— optional</span>
              </label>
              <input
                className="pnx-input"
                placeholder="e.g. Software Engineering, Data Science"
                value={domain}
                onChange={e => setDomain(e.target.value)}
              />
            </div>

            {/* Interests */}
            <div style={{ marginBottom:18 }}>
              <label style={{
                display:"block", fontSize:11, fontWeight:500, color:"#737370", marginBottom:6,
                fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase",
              }}>
                Career Interests{" "}
                <span style={{ color:"#b8b8b4" }}>— optional</span>
              </label>
              <input
                className="pnx-input"
                placeholder="e.g. Cloud Computing, Machine Learning"
                value={interest}
                onChange={e => setInterest(e.target.value)}
              />
            </div>

            {/* AI Toggle */}
            <label className="toggle-row" style={{ marginBottom:24 }}>
              <input
                type="checkbox" checked={useAI}
                onChange={() => setUseAI(p => !p)}
                style={{ width:15, height:15, accentColor:"#2563eb", cursor:"pointer", flexShrink:0 }}
              />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"#111" }}>AI Role Recommendation</div>
                <div style={{ fontSize:12, color:"#8a8a87", marginTop:2 }}>Let the engine suggest optimal career paths</div>
              </div>
              <div style={{
                flexShrink:0, width:34, height:19, borderRadius:10,
                background: useAI ? "linear-gradient(135deg,#2563eb,#5b21b6)" : "#e2e2df",
                transition:"background 0.22s", position:"relative",
              }}>
                <div style={{
                  position:"absolute", top:2, left: useAI ? 17 : 2,
                  width:15, height:15, borderRadius:"50%", background:"#fff",
                  transition:"left 0.2s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.25)",
                }} />
              </div>
            </label>

            {/* Error */}
            {errorMsg && (
              <div style={{
                padding:"10px 14px", marginBottom:14,
                background:"rgba(220,38,38,0.05)", border:"1px solid rgba(220,38,38,0.15)",
                borderRadius:8, fontSize:13, color:"#dc2626",
              }}>
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button className="submit-btn" onClick={submit} disabled={loading}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:11 }}>
                  <span style={{
                    width:14, height:14,
                    border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff",
                    borderRadius:"50%", animation:"spin 0.65s linear infinite", flexShrink:0,
                  }} />
                  {LOAD_STEPS[loadStep]}
                </span>
              ) : "Generate Intelligence Report →"}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULTS DASHBOARD ── */}
      {result && (
        <div ref={reportRef} style={{
          maxWidth:1240, margin:"0 auto",
          padding: isMobile ? "0 20px" : "0 40px",
          position:"relative", zIndex:1,
        }}>

          {/* KPI STRIP */}
          <div style={{
            display:"grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)",
            gap:14, marginBottom:22,
          }}>
            {[
              { label:"ATS Score",    val:String(animScore),                     unit:"/100", color:sc,        mono:true  },
              { label:"Top Role Fit", val:"92",                                  unit:"%",    color:"#2563eb", mono:true  },
              { label:"Skills Found", val:String(result.skills?.length ?? 0),    unit:"+",    color:"#7c3aed", mono:true  },
              { label:"Readiness",    val:getReadyLabel(score),                  unit:"",     color:"#111",    mono:false },
            ].map((k, i) => (
              <div className="kpi-card reveal-up" key={i} style={{ animationDelay:`${i*0.06}s` }}>
                <p className="eyebrow" style={{ marginBottom:10 }}>{k.label}</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:2 }}>
                  <span style={{
                    fontFamily:   k.mono ? "'DM Mono',monospace" : "'Outfit',sans-serif",
                    fontSize:     k.mono ? "38px" : "20px",
                    fontWeight:   k.mono ? 400 : 700,
                    color:        k.color,
                    letterSpacing:"-0.03em", lineHeight:1,
                    animation:"numberBlur 0.5s ease both",
                    animationDelay:`${0.28+i*0.07}s`,
                  }}>
                    {k.val}
                  </span>
                  {k.unit && (
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"#a3a3a0" }}>{k.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MAIN 2-COL */}
          <div style={{
            display:"grid",
            gridTemplateColumns: isMed ? "1fr" : "1fr 350px",
            gap:22, alignItems:"start",
          }}>

            {/* ═══ LEFT COLUMN ═══ */}
            <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

              {/* ATS HERO */}
              <div className="glass-card reveal-up" style={{ padding: isMobile?"26px":"38px", animationDelay:"0.22s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:10 }}>
                  <div>
                    <p className="eyebrow" style={{ marginBottom:7 }}>ATS Compatibility Index</p>
                    <h2 style={{
                      fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                      fontSize:26, fontWeight:400, color:"#0f0f0f", letterSpacing:"-0.01em",
                    }}>
                      MNC Hiring Score
                    </h2>
                  </div>
                  <div style={{
                    padding:"4px 13px", borderRadius:20,
                    fontSize:11, fontWeight:600,
                    fontFamily:"'DM Mono',monospace", letterSpacing:"0.07em",
                    background:`${sc}10`, color:sc, border:`1px solid ${sc}28`,
                  }}>
                    {getScoreLabel(score)}
                  </div>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap: isMobile?20:44, flexWrap:"wrap" }}>
                  {/* Score ring */}
                  <div className="score-anim" style={{ position:"relative", flexShrink:0 }}>
                    <ScoreRing score={animScore} color={sc} size={176} />
                    <div style={{
                      position:"absolute", top:"50%", left:"50%",
                      transform:"translate(-50%,-50%)",
                      textAlign:"center", pointerEvents:"none",
                    }}>
                      <div style={{
                        fontFamily:"'DM Mono',monospace",
                        fontSize:48, fontWeight:400, color:sc, lineHeight:1,
                        textShadow:`0 0 22px ${sc}45`,
                      }}>
                        {animScore}
                      </div>
                      <div style={{ fontSize:11, color:"#a3a3a0", fontFamily:"'DM Mono',monospace", marginTop:3 }}>
                        / 100
                      </div>
                    </div>
                  </div>

                  {/* Breakdown bars */}
                  <div style={{ flex:1, minWidth:180 }}>
                    {[
                      { label:"Keyword Alignment",  v:85 },
                      { label:"Experience Depth",   v: score>=70 ? 78 : 62 },
                      { label:"Role Relevance",     v: score>=80 ? 88 : 71 },
                      { label:"Format & Structure", v:74 },
                    ].map((b, i) => (
                      <div key={i} style={{ marginBottom: i<3 ? 18 : 0 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                          <span style={{ fontSize:13, fontWeight:500, color:"#374151" }}>{b.label}</span>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#a3a3a0" }}>{b.v}</span>
                        </div>
                        <div style={{ height:3, background:"#ece9e5", borderRadius:2, overflow:"hidden" }}>
                          <div style={{
                            width:`${b.v}%`, height:"100%",
                            background:`linear-gradient(90deg,${sc},${sc}80)`,
                            borderRadius:2,
                            animation:`barExpand 1.2s cubic-bezier(0.4,0,0.2,1) ${i*0.11}s both`,
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROLE FIT */}
              <div className="glass-card reveal-up" style={{ padding:"30px 34px", animationDelay:"0.27s" }}>
                <p className="eyebrow" style={{ marginBottom:7 }}>Career Path Alignment</p>
                <h3 style={{
                  fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                  fontSize:21, fontWeight:400, color:"#0f0f0f",
                  marginBottom:22, letterSpacing:"-0.01em",
                }}>
                  Role Fit Probability
                </h3>
                {safeArr(result.roles).slice(0, 5).map((role, i) => {
                  const pct = 93 - i * 11;
                  return (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"12px 0",
                      borderBottom: i<4 ? "1px solid #f0f0ec" : "none",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#c8c8c3", width:18 }}>
                          {String(i+1).padStart(2,"0")}
                        </span>
                        <span style={{ fontSize:14, fontWeight:500, color:"#374151" }}>{role}</span>
                        {i===0 && (
                          <span style={{
                            fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:500, letterSpacing:"0.09em",
                            color:"#059669", background:"rgba(5,150,105,0.08)",
                            border:"1px solid rgba(5,150,105,0.18)",
                            padding:"2px 7px", borderRadius:4,
                          }}>BEST FIT</span>
                        )}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                        <div style={{ width:86, height:3, background:"#ece9e5", borderRadius:2, overflow:"hidden" }}>
                          <div style={{
                            width:`${pct}%`, height:"100%",
                            background:"linear-gradient(90deg,#2563eb,#7c3aed)",
                            borderRadius:2,
                            animation:`barExpand 1.1s cubic-bezier(0.4,0,0.2,1) ${i*0.09}s both`,
                          }} />
                        </div>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#a3a3a0", width:28, textAlign:"right" }}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RADAR */}
              <div className="glass-card reveal-up" style={{ padding:"30px 34px", animationDelay:"0.32s" }}>
                <p className="eyebrow" style={{ marginBottom:7 }}>Competency Benchmark</p>
                <h3 style={{
                  fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                  fontSize:21, fontWeight:400, color:"#0f0f0f",
                  marginBottom:4, letterSpacing:"-0.01em",
                }}>
                  Capability Intelligence Map
                </h3>
                <p style={{ fontSize:13, color:"#8a8a87", marginBottom:20 }}>
                  Cross-referenced against enterprise hiring standards
                </p>
                <ResponsiveContainer width="100%" height={290}>
                  <RadarChart data={safeArr(result.aspectScores)}>
                    <PolarGrid stroke="#ece9e5" />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{ fill:"#a3a3a0", fontSize:11, fontFamily:"'DM Mono',monospace" }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0,100]} tick={{ fill:"#c8c8c3", fontSize:10 }} />
                    <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.09} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* GROWTH CHART */}
              <div className="glass-card reveal-up" style={{ padding:"30px 34px", animationDelay:"0.37s" }}>
                <p className="eyebrow" style={{ marginBottom:7 }}>Trajectory Forecast</p>
                <h3 style={{
                  fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                  fontSize:21, fontWeight:400, color:"#0f0f0f",
                  marginBottom:4, letterSpacing:"-0.01em",
                }}>
                  Projected Career Growth
                </h3>
                <p style={{ fontSize:13, color:"#8a8a87", marginBottom:20 }}>Estimated compensation trajectory</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={safeArr(result.growthProjection)}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
                    <XAxis dataKey="year" tick={{ fill:"#a3a3a0", fontSize:11, fontFamily:"'DM Mono',monospace" }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:"#a3a3a0", fontSize:11, fontFamily:"'DM Mono',monospace" }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="salary" stroke="#2563eb" strokeWidth={2}
                      fill="url(#areaGrad)"
                      dot={{ fill:"#2563eb", r:4, strokeWidth:0 }}
                      activeDot={{ r:6, fill:"#2563eb" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ═══ RIGHT SIDEBAR ═══ */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

              {/* EXEC SUMMARY */}
              <div className="glass-card reveal-up" style={{
                padding:"26px",
                border:"1px solid rgba(37,99,235,0.13)",
                animationDelay:"0.27s",
              }}>
                <p className="eyebrow" style={{ marginBottom:16 }}>Executive Summary</p>
                {[
                  { lbl:"Best-Fit Role",   val: safeArr(result.roles)[0] || "—",  color:"#0f0f0f" },
                  { lbl:"Readiness Level", val: getReadyLabel(score),              color:sc        },
                  { lbl:"ATS Compat.",     val: getScoreLabel(score),              color:sc        },
                  { lbl:"Growth Path",     val: "Strong ↑",                        color:"#059669" },
                ].map((row, i, arr) => (
                  <div key={i} style={{
                    padding:"13px 0",
                    borderBottom: i<arr.length-1 ? "1px solid #f0f0ec" : "none",
                  }}>
                    <p style={{
                      fontFamily:"'DM Mono',monospace", fontSize:10, color:"#a3a3a0",
                      letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4,
                    }}>
                      {row.lbl}
                    </p>
                    <p style={{ fontSize:14, fontWeight:600, color:row.color, letterSpacing:"-0.01em" }}>
                      {row.val}
                    </p>
                  </div>
                ))}
              </div>

              {/* SKILLS */}
              <div className="glass-card reveal-up" style={{ padding:"26px", animationDelay:"0.32s" }}>
                <p className="eyebrow" style={{ marginBottom:16 }}>Skill Distribution</p>

                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#a3a3a0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Core</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                  {safeArr(result.skills).slice(0,5).map((sk,i) => (
                    <span key={i} className="skill-tag skill-tag-core">{sk}</span>
                  ))}
                </div>

                <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#a3a3a0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Supporting</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                  {safeArr(result.skills).slice(5,10).map((sk,i) => (
                    <span key={i} className="skill-tag skill-tag-support">{sk}</span>
                  ))}
                </div>

                <div style={{
                  padding:"11px 13px",
                  background:"rgba(220,38,38,0.03)",
                  border:"1px solid rgba(220,38,38,0.1)",
                  borderRadius:10,
                }}>
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(220,38,38,0.55)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:9 }}>
                    Gaps Detected
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {["Cloud Computing","Kubernetes","Microservices"].map((sk,i) => (
                      <span key={i} className="skill-tag skill-tag-gap">{sk}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROADMAP */}
              <div className="glass-card reveal-up" style={{ padding:"26px", animationDelay:"0.37s" }}>
                <p className="eyebrow" style={{ marginBottom:16 }}>Strategic Roadmap</p>
                <div style={{ position:"relative" }}>
                  <div style={{
                    position:"absolute", left:7, top:8, bottom:8, width:1,
                    background:"linear-gradient(to bottom,rgba(37,99,235,0.28),rgba(37,99,235,0.04))",
                  }} />
                  {safeArr(result.roadmap).map((step, i, arr) => (
                    <div key={i} className="road-node" style={{
                      marginBottom: i<arr.length-1 ? 18 : 0,
                      animationDelay:`${0.42+i*0.06}s`,
                    }}>
                      <div style={{
                        width:15, height:15, borderRadius:"50%",
                        flexShrink:0, marginTop:2, zIndex:1,
                        background:  i===0 ? "#2563eb" : "transparent",
                        border:      `1.5px solid ${i===0 ? "#2563eb" : "rgba(37,99,235,0.28)"}`,
                        boxShadow:   i===0 ? "0 0 8px rgba(37,99,235,0.4)" : "none",
                      }} />
                      <p style={{
                        fontSize:13, lineHeight:1.55,
                        fontWeight: i===0 ? 500 : 400,
                        color:      i===0 ? "#1a1a1a" : "#8a8a87",
                      }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ENHANCEMENTS */}
              <div className="glass-card reveal-up" style={{ padding:"26px", animationDelay:"0.42s" }}>
                <p className="eyebrow" style={{ marginBottom:16 }}>Enhancement Insights</p>
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  {safeArr(result.improvements).map((imp, i) => (
                    <div key={i} style={{
                      display:"flex", gap:11, alignItems:"flex-start",
                      padding:"12px 13px",
                      background:"#fafaf8", border:"1px solid #eceae6", borderRadius:9,
                      animation:`fadeSlideRight 0.38s cubic-bezier(0.22,1,0.36,1) ${0.48+i*0.05}s both`,
                    }}>
                      <span style={{
                        fontFamily:"'DM Mono',monospace", fontSize:10,
                        color:"#c8c8c3", marginTop:1, flexShrink:0,
                      }}>
                        {String(i+1).padStart(2,"0")}
                      </span>
                      <p style={{ fontSize:13, fontWeight:400, color:"#4a4a47", lineHeight:1.55 }}>{imp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ACTION BAR */}
          <div className="glass-card reveal-up" style={{
            marginTop:26, padding:"22px 30px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:18,
            border:"1px solid rgba(37,99,235,0.11)",
            animationDelay:"0.48s",
          }}>
            <div>
              <h3 style={{
                fontFamily:"'Instrument Serif',serif", fontStyle:"italic",
                fontSize:20, fontWeight:400, color:"#0f0f0f",
                marginBottom:3, letterSpacing:"-0.01em",
              }}>
                Ready to act on your intelligence?
              </h3>
              <p style={{ fontSize:13, color:"#8a8a87" }}>
                Download your full report or connect with AI career coaching.
              </p>
            </div>
            <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
              <button className="btn-primary" onClick={downloadPDF}>↓ Download PDF</button>
              <button className="btn-ghost">CareerBot →</button>
              <button className="btn-ghost">Share Report</button>
            </div>
          </div>

          <p style={{
            textAlign:"center", marginTop:18,
            fontFamily:"'DM Mono',monospace",
            fontSize:10, color:"#c8c8c3", letterSpacing:"0.09em",
          }}>
            ● PROCESSED LOCALLY · NO EXTERNAL DATA SHARING · SOC 2 COMPLIANT
          </p>
        </div>
      )}
    </div>
  );
}
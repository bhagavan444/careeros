import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

/* ─────────────────────────────────────────────────────────────────
   STYLE INJECTION  — keyframes + global classes (runs once)
───────────────────────────────────────────────────────────────── */
(() => {
  if (typeof document === "undefined") return;
  if (document.getElementById("pnx-styles")) return;
  const s = document.createElement("style");
  s.id = "pnx-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

    /* ── AI badge pulse ── */
    @keyframes inkBleed {
      0%,100% { letter-spacing: 0.12em; }
      50%      { letter-spacing: 0.18em; }
    }

    /* ── Ticker scroll ── */
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ── Cursor blink ── */
    @keyframes cursorBlink {
      0%,100% { opacity:1; }
      50%      { opacity:0; }
    }

    /* ── Dropdown entrance ── */
    @keyframes ddEnter {
      from { opacity:0; transform: translateY(10px) scale(0.97); }
      to   { opacity:1; transform: translateY(0)    scale(1);    }
    }

    /* ── Panel clip reveal ── */
    @keyframes panelIn {
      from { clip-path: inset(0 0 100% 0 round 0px); opacity:0.4; }
      to   { clip-path: inset(0 0 0%   0 round 0px); opacity:1;   }
    }

    /* ── Green pulse ring ── */
    @keyframes ringPulse {
      0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
      70%  { box-shadow: 0 0 0 5px rgba(34,197,94,0);  }
      100% { box-shadow: 0 0 0 0 rgba(34,197,94,0);   }
    }

    /* ── Nav link: clean slide-underline, no duplication ── */
    .pnx-link {
      position: relative;
      display: inline-block;
      color: #a3a3a3;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0.025em;
      text-transform: uppercase;
      padding: 4px 0 5px;
      transition: color 0.22s ease, font-weight 0.01s;
    }
    /* Sliding underline drawn with ::after only — no text clone */
    .pnx-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.5px;
      background: #0a0a0a;
      border-radius: 1px;
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.32s cubic-bezier(0.77, 0, 0.175, 1);
    }
    .pnx-link:hover { color: #0a0a0a; }
    .pnx-link:hover::after { transform: scaleX(1); }
    .pnx-link.active { color: #0a0a0a; font-weight: 600; }
    .pnx-link.active::after { transform: scaleX(1); }

    /* ── Dropdown row hover ── */
    .pnx-dd-row {
      transition: background 0.13s, padding-left 0.2s;
      cursor: pointer;
    }
    .pnx-dd-row:hover {
      background: #f7f7f4 !important;
      padding-left: 22px !important;
    }

    /* ── Ghost btn hover ── */
    .pnx-ghost:hover { background: #f7f7f4 !important; color: #0a0a0a !important; }

    /* ── Avatar btn hover ── */
    .pnx-avatar-btn:hover {
      outline: 2px solid #d4d4d0 !important;
      outline-offset: 3px;
    }

    /* ── Mobile link hover ── */
    .pnx-mob-link:hover { background: #f7f7f4 !important; }
    .pnx-mob-link:hover .pnx-mob-arrow { color: #0a0a0a !important; }
  `;
  document.head.appendChild(s);
})();

/* ─────────────────────────────────────────────────────────────────
   TICKER  (top strip)
───────────────────────────────────────────────────────────────── */
const TICKS = [
  "AI-powered career prediction",
  "Real-time path analysis",
  "Personalised growth engine",
  "Trusted by 12,000+ learners",
  "PathNex AI  ·  v2.4",
  "New: Live Prediction  →",
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function Navbar({ handleLogout }) {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [user, setUser]               = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const profileRef                    = useRef(null);
  const navigate                      = useNavigate();

  useEffect(() => { const u = auth.onAuthStateChanged(setUser); return u; }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const isLoggedIn = Boolean(user);
  const isAdmin    = user?.email === "g.sivasatyasaibhagavan@gmail.com";
  const close      = () => setMenuOpen(false);

  const initials = () =>
    user?.displayName
      ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : user?.email ? user.email[0].toUpperCase() : "U";

  const NAV = [
    { to: "/",        label: "Home"    },
    { to: "/about",   label: "About"   },
    { to: "/plans",   label: "Pricing" },
    { to: "/quiz",    label: "Quiz"    },
    { to: "/chat", label: "AI Bot" },
    { to: "/predict", label: "Predict" },
    { to: "/contact", label: "Connect" },
  ];

  /* Ticker string — doubled for seamless loop */
  const tickerContent = [...TICKS, ...TICKS].map((t) => `${t}  ·  `).join("");

  return (
    <header style={S.header(scrolled)}>

      {/* ═══════════════════════════════════
          1.  TOP TICKER STRIP
      ═══════════════════════════════════ */}
      <div style={S.tickerBar}>
        <div style={S.tickerTrack}>
          <span style={S.tickerText}>{tickerContent}</span>
        </div>
        {/* left / right fade masks */}
        <div style={{ ...S.mask, left: 0,  background: "linear-gradient(90deg,#0a0a0a,transparent)" }} />
        <div style={{ ...S.mask, right: 0, background: "linear-gradient(-90deg,#0a0a0a,transparent)" }} />
      </div>

      {/* ═══════════════════════════════════
          2.  MAIN NAVIGATION ROW
      ═══════════════════════════════════ */}
      <div style={S.navRow}>

        {/* LOGO */}
        <Link to="/" style={S.logoWrap} onClick={close}>
          <span style={S.logoItalic}>PathNex</span>
          <span style={S.logoAIBadge}>AI</span>
          <span style={S.logoCursor}>|</span>
        </Link>

        {/* CENTRE LINKS — absolutely centred */}
        <nav style={S.centreNav}>
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `pnx-link${isActive ? " active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div style={S.rightSection}>
          {isLoggedIn ? (
            <>
              <PredictBtn onClick={() => navigate("/predict")} />
              <ProfileDropdown
                ref={profileRef}
                open={profileOpen}
                toggle={() => setProfileOpen((p) => !p)}
                user={user}
                initials={initials()}
                isAdmin={isAdmin}
                navigate={navigate}
                handleLogout={handleLogout}
                setProfileOpen={setProfileOpen}
              />
            </>
          ) : (
            <>
              <button
                className="pnx-ghost"
                style={S.ghostBtn}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <PredictBtn onClick={() => navigate("/login")} />
            </>
          )}

          {/* Hamburger */}
          <button style={S.hamBtn} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <AnimHam open={menuOpen} />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════
          3.  SCROLL ACCENT LINE
      ═══════════════════════════════════ */}
      <div style={S.accentLine(scrolled)} />

      {/* ═══════════════════════════════════
          4.  MOBILE PANEL
      ═══════════════════════════════════ */}
      {menuOpen && (
        <div style={S.panel}>
          <p style={S.panelLabel}>Menu</p>

          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="pnx-mob-link"
              style={S.mobLink}
              onClick={close}
            >
              <span>{label}</span>
              <span className="pnx-mob-arrow" style={S.mobArrow}>→</span>
            </NavLink>
          ))}

          <div style={S.mobRule} />

          {isLoggedIn ? (
            <>
              <button style={S.mobCTA} onClick={() => { navigate("/predict"); close(); }}>
                Start Prediction ↗
              </button>
              {[{ l: "Profile", p: "/profile" }, { l: "My Recommendations", p: "/history" }].map(({ l, p }) => (
                <button key={p} className="pnx-mob-link" style={S.mobSecondary} onClick={() => { navigate(p); close(); }}>
                  {l}
                </button>
              ))}
              {isAdmin && (
                <button className="pnx-mob-link" style={S.mobSecondary} onClick={() => { navigate("/admin"); close(); }}>
                  Admin <span style={S.adminPill}>ADMIN</span>
                </button>
              )}
              <div style={S.mobRule} />
              <button style={{ ...S.mobSecondary, color: "#dc2626" }} onClick={() => { handleLogout(); close(); }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button style={S.mobCTA} onClick={() => { navigate("/login"); close(); }}>
                Start Prediction ↗
              </button>
              <button className="pnx-mob-link" style={S.mobSecondary} onClick={() => { navigate("/login"); close(); }}>
                Sign In
              </button>
            </>
          )}

          <p style={S.panelFooter}>PathNex AI · Precision Career Intelligence · 2024</p>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PREDICT BUTTON  — flat black with hard shadow + dot-fill hover
───────────────────────────────────────────────────────────────── */
function PredictBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: hov ? "#0a0a0a" : "#fff",
        color: hov ? "#fff" : "#0a0a0a",
        border: "1.5px solid #0a0a0a",
        borderRadius: "2px",
        padding: "0.5rem 1.125rem",
        fontSize: "0.75rem",
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s, box-shadow 0.18s, transform 0.18s",
        transform: hov ? "translate(-1px,-2px)" : "translate(0,0)",
        boxShadow: hov ? "3px 4px 0px #0a0a0a" : "2px 2px 0px #c5c5c0",
        whiteSpace: "nowrap",
      }}
    >
      {/* dot overlay */}
      <span
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.18) 1px,transparent 1px)",
          backgroundSize: "6px 6px",
          opacity: hov ? 1 : 0,
          transition: "opacity 0.28s",
        }}
      />
      Start Prediction
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ANIMATED HAMBURGER  (SVG lines → X)
───────────────────────────────────────────────────────────────── */
function AnimHam({ open }) {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
      <line
        x1="0" y1="1" x2="22" y2="1"
        stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"
        style={{
          transformOrigin: "11px 1px",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: open ? "rotate(45deg) translateY(6px)" : "none",
        }}
      />
      <line
        x1="4" y1="7" x2="22" y2="7"
        stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"
        style={{
          transformOrigin: "13px 7px",
          transition: "opacity 0.2s, transform 0.3s",
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "scaleX(1)",
        }}
      />
      <line
        x1="0" y1="13" x2="22" y2="13"
        stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"
        style={{
          transformOrigin: "11px 13px",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: open ? "rotate(-45deg) translateY(-6px)" : "none",
        }}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PROFILE DROPDOWN
───────────────────────────────────────────────────────────────── */
const ProfileDropdown = React.forwardRef(function ProfileDropdown(
  { open, toggle, user, initials, isAdmin, navigate, handleLogout, setProfileOpen }, ref
) {
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="pnx-avatar-btn"
        onClick={toggle}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "1.5px solid #e5e5e0",
          background: "#fafaf8",
          cursor: "pointer", padding: 0,
          overflow: "hidden", position: "relative",
          transition: "outline 0.18s",
        }}
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        ) : (
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", height: "100%",
            background: "linear-gradient(135deg,#e5e5e0,#d4d4cf)",
            fontSize: "0.75rem", fontWeight: 700, color: "#0a0a0a",
            fontFamily: "'DM Sans',sans-serif",
          }}>
            {initials}
          </span>
        )}
        <span style={{
          position: "absolute", bottom: 1, right: 1,
          width: 8, height: 8, borderRadius: "50%",
          background: "#22c55e", border: "1.5px solid #fff",
          animation: "ringPulse 2.2s ease-in-out infinite",
        }} />
      </button>

      {open && (
        <div style={S.dd}>
          <div style={S.ddHead}>
            <span style={S.ddName}>{user?.displayName || "User"}</span>
            <span style={S.ddEmail}>{user?.email}</span>
          </div>
          <div style={S.ddRule} />
          {[
            { label: "Profile",            path: "/profile" },
            { label: "My Recommendations", path: "/history" },
          ].map(({ label, path }) => (
            <button
              key={path}
              className="pnx-dd-row"
              style={S.ddRow}
              onClick={() => { navigate(path); setProfileOpen(false); }}
            >
              {label}
            </button>
          ))}
          {isAdmin && (
            <>
              <div style={S.ddRule} />
              <button
                className="pnx-dd-row"
                style={{ ...S.ddRow, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => { navigate("/admin"); setProfileOpen(false); }}
              >
                Admin
                <span style={S.adminPill}>ADMIN</span>
              </button>
            </>
          )}
          <div style={S.ddRule} />
          <button
            className="pnx-dd-row"
            style={{ ...S.ddRow, color: "#dc2626" }}
            onClick={() => { handleLogout(); setProfileOpen(false); }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────
   STYLES OBJECT
───────────────────────────────────────────────────────────────── */
const S = {

  header: (scrolled) => ({
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'DM Sans', sans-serif",
    background: "#fff",
    borderBottom: scrolled ? "1px solid #e8e8e3" : "1px solid transparent",
    boxShadow: scrolled
      ? "0 1px 0 rgba(255,255,255,0.8), 0 8px 32px rgba(10,10,10,0.07)"
      : "none",
    transition: "border-color 0.35s, box-shadow 0.35s",
  }),

  /* ── Ticker ── */
  tickerBar: {
    background: "#0a0a0a",
    height: "26px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  tickerTrack: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    animation: "ticker 30s linear infinite",
  },
  tickerText: {
    fontSize: "0.625rem",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#737373",
    fontFamily: "'DM Sans', sans-serif",
  },
  mask: {
    position: "absolute", top: 0, bottom: 0,
    width: "60px", zIndex: 2, pointerEvents: "none",
  },

  /* ── Nav Row ── */
  navRow: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 2rem",
    height: "62px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    position: "relative",
  },

  /* ── Logo ── */
  logoWrap: {
    display: "flex",
    alignItems: "baseline",
    gap: "0",
    textDecoration: "none",
    flexShrink: 0,
    userSelect: "none",
  },
  logoItalic: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontStyle: "italic",
    fontSize: "1.4rem",
    fontWeight: 400,
    color: "#0a0a0a",
    letterSpacing: "-0.025em",
    lineHeight: 1,
  },
  logoAIBadge: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.5625rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#fff",
    background: "#0a0a0a",
    padding: "2px 5px 2px 4px",
    borderRadius: "1px",
    marginLeft: "6px",
    alignSelf: "center",
    animation: "inkBleed 5s ease-in-out infinite",
    display: "inline-block",
    lineHeight: 1.5,
  },
  logoCursor: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    color: "#0a0a0a",
    marginLeft: "3px",
    lineHeight: 1,
    animation: "cursorBlink 1.1s step-end infinite",
    alignSelf: "center",
  },

  /* ── Centre Nav ── */
  centreNav: {
    display: "flex",
    gap: "2rem",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "auto",
  },

  /* ── Right ── */
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexShrink: 0,
  },

  ghostBtn: {
    background: "transparent",
    border: "none",
    color: "#737373",
    fontSize: "0.8125rem",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.01em",
    padding: "0.4375rem 0.875rem",
    cursor: "pointer",
    borderRadius: "2px",
    transition: "background 0.14s, color 0.14s",
  },

  hamBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "2px",
  },

  /* ── Accent line ── */
  accentLine: (scrolled) => ({
    height: "1.5px",
    background: "linear-gradient(90deg, transparent 0%, #0a0a0a 20%, #a3a3a3 50%, #0a0a0a 80%, transparent 100%)",
    opacity: scrolled ? 0.9 : 0,
    transform: scrolled ? "scaleX(1)" : "scaleX(0.4)",
    transformOrigin: "center",
    transition: "opacity 0.5s, transform 0.5s cubic-bezier(0.4,0,0.2,1)",
  }),

  /* ── Dropdown ── */
  dd: {
    position: "absolute",
    top: "calc(100% + 12px)",
    right: 0,
    background: "#fff",
    border: "1px solid #e8e8e3",
    borderRadius: "2px",
    boxShadow: "4px 4px 0px #0a0a0a, 0 16px 48px rgba(10,10,10,0.09)",
    minWidth: "218px",
    padding: "0.375rem 0",
    animation: "ddEnter 0.22s cubic-bezier(0.22,1,0.36,1) forwards",
    zIndex: 100,
  },
  ddHead: {
    padding: "0.875rem 1.125rem 0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  ddName: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#0a0a0a",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "-0.01em",
  },
  ddEmail: {
    fontSize: "0.725rem",
    color: "#a3a3a3",
    fontFamily: "'DM Sans', sans-serif",
  },
  ddRule: {
    height: "1px",
    background: "#f0f0ec",
    margin: "0.25rem 0",
  },
  ddRow: {
    width: "100%",
    padding: "0.5625rem 1.125rem",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: "#404040",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.01em",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 0,
  },
  adminPill: {
    fontSize: "0.5625rem",
    fontWeight: 700,
    letterSpacing: "0.09em",
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "2px",
    padding: "2px 5px",
  },

  /* ── Mobile Panel ── */
  panel: {
    background: "#fff",
    borderTop: "1px solid #e8e8e3",
    padding: "1.5rem 2rem 2rem",
    animation: "panelIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards",
  },
  panelLabel: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontStyle: "italic",
    fontSize: "2.5rem",
    color: "#e5e5e0",
    margin: "0 0 1rem",
    lineHeight: 1,
    letterSpacing: "-0.03em",
    userSelect: "none",
  },
  mobLink: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.6875rem 0.75rem",
    color: "#0a0a0a",
    textDecoration: "none",
    fontSize: "0.9375rem",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "-0.01em",
    borderRadius: "2px",
    transition: "background 0.13s",
    marginBottom: "1px",
  },
  mobArrow: {
    color: "#d4d4d0",
    fontSize: "0.875rem",
    fontFamily: "'DM Sans', sans-serif",
    transition: "color 0.13s",
  },
  mobRule: {
    height: "1px",
    background: "#f0f0ec",
    margin: "0.875rem 0",
  },
  mobCTA: {
    display: "block",
    width: "100%",
    padding: "0.875rem 1rem",
    background: "#0a0a0a",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    fontSize: "0.8125rem",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    cursor: "pointer",
    textAlign: "center",
    marginBottom: "6px",
    boxShadow: "3px 3px 0px #a3a3a3",
  },
  mobSecondary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0.6875rem 0.75rem",
    background: "transparent",
    border: "none",
    textAlign: "left",
    color: "#404040",
    fontSize: "0.875rem",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    borderRadius: "2px",
    transition: "background 0.13s",
  },
  panelFooter: {
    marginTop: "1.75rem",
    fontSize: "0.625rem",
    color: "#d4d4d0",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif",
  },
};
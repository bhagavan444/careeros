import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ChevronRight } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMenuOpen(false);
  }, [location.pathname]);

  const handlePredictClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginPopup(true);
      setTimeout(() => setShowLoginPopup(false), 3000);
    }
  };

  const executeLogout = () => {
    if (handleLogout) handleLogout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const NAV_ITEMS = [
    { label: "Home", to: "/" },
    { label: "Predict", to: "/predict", isPredict: true },
    { label: "AI Assistant", to: "/chat" },
    { label: "Assessment", to: "/quiz" },
    { label: "Roadmaps", to: "/plans" },
  ];

  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <>
      <style>{`
        /* CSS reset & base */
        .nav-wrapper {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 9999;
          display: flex;
          justify-content: center;
          padding: 1rem;
          transition: padding 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .nav-wrapper.scrolled {
          padding: 0.75rem 1rem;
        }

        .nav-container {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 860px; /* Highly compact Linear-style width */
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 100px;
          height: 44px; /* Ultra-thin elegant height */
          padding: 0 6px 0 18px;
          box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.03), inset 0 0 0 0.5px rgba(255, 255, 255, 0.6);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-wrapper.scrolled .nav-container {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          box-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.08), inset 0 0 0 0.5px rgba(255, 255, 255, 1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brand-text {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(0,0,0,0.9);
          letter-spacing: -0.01em;
          padding-bottom: 2px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        
        @media (max-width: 860px) {
          .nav-links { display: none; }
        }

        .nav-item {
          padding: 6px 14px;
          color: rgba(0,0,0,0.5);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: 0.01em;
          border-radius: 100px;
          position: relative;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-item:hover, .nav-item.active {
          color: rgba(0,0,0,0.9);
        }

        .active-bg {
          position: absolute;
          inset: 0;
          background: #ffffff;
          border-radius: 100px;
          z-index: -1;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05), inset 0 0 0 0.5px rgba(0,0,0,0.03);
        }

        .right-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-premium {
          background: rgba(0, 0, 0, 0.85);
          color: #fff;
          padding: 7px 16px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-premium:hover {
          background: rgba(0, 0, 0, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
        }

        /* Avatar styles */
        .profile-container {
          position: relative;
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(0,0,0,0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .profile-avatar:hover {
          background: rgba(255, 255, 255, 1);
          color: rgba(0,0,0,1);
          box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-radius: 16px;
          padding: 6px;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15), inset 0 0 0 0.5px rgba(0,0,0,0.05);
          z-index: 1000;
          transform-origin: top right;
        }

        .dropdown-item {
          padding: 10px 12px;
          color: rgba(0,0,0,0.7);
          font-size: 0.8rem;
          font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .dropdown-item:hover {
          background: rgba(0,0,0,0.03);
          color: rgba(0,0,0,1);
        }

        .dropdown-item.logout {
          color: #e11d48;
        }
        .dropdown-item.logout:hover {
          background: rgba(225, 29, 72, 0.05);
        }

        .mobile-toggle {
          display: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.06);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(0,0,0,0.8);
        }
        @media (max-width: 860px) {
          .mobile-toggle { display: flex; }
          .btn-premium.desktop-only { display: none; }
        }

        /* Fullscreen Mobile Menu */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          z-index: 9998;
          display: flex;
          flex-direction: column;
          padding: 100px 2rem 2rem;
        }

        .mobile-nav-item {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: rgba(0,0,0,0.9);
          text-decoration: none;
          padding: 1.2rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        /* Popup */
        .login-popup {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
        }
      `}</style>

      <div className={`nav-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <Link to="/" className="logo-section">
            <div style={{ position: "relative", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", width: "100%", height: "100%", border: "1.5px solid rgba(0,0,0,0.9)", borderRadius: "38%", opacity: 0.9 }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", width: "100%", height: "100%", border: "1.5px solid rgba(0,0,0,0.3)", borderRadius: "38%", opacity: 0.9 }} />
              <div style={{ width: 6, height: 6, background: "rgba(0,0,0,0.9)", borderRadius: "50%" }} />
            </div>
            <span className="brand-text">Pathora</span>
          </Link>

          <nav className="nav-links">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={item.isPredict ? handlePredictClick : undefined}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="active-bg"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="right-section">
            {user ? (
              <div className="profile-container" ref={profileRef}>
                <motion.div 
                  className="profile-avatar"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  whileHover={{ scale: 1.05, y: -0.5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={15} strokeWidth={2.5} />
                </motion.div>
                
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      className="profile-dropdown"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="dropdown-item" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 10, marginBottom: 4, cursor: 'default', pointerEvents: 'none' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }} />
                        <span style={{ fontSize: '0.7rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>Active Session</span>
                      </div>
                      <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>Dashboard</div>
                      <div className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}>Preferences</div>
                      <div className="dropdown-item logout" onClick={executeLogout}>Log out</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.02, y: -0.5 }} whileTap={{ scale: 0.98 }}>
                <Link to="/login" className="btn-premium desktop-only">Sign In</Link>
              </motion.div>
            )}

            <button
              className="mobile-toggle"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setShowProfileMenu(false);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={menuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            className="login-popup"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
            Sign in to unlock predictions
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.to}
                    onClick={(e) => {
                      if (item.isPredict && !user) {
                        e.preventDefault();
                        setShowLoginPopup(true);
                        setTimeout(() => setShowLoginPopup(false), 3000);
                        return;
                      }
                    }}
                    className="mobile-nav-item"
                  >
                    {item.label}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
                    >
                      <ChevronRight size={24} color="rgba(0,0,0,0.2)" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, delay: NAV_ITEMS.length * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to="/login"
                    className="mobile-nav-item"
                    style={{ color: "rgba(0,0,0,0.9)" }}
                  >
                    Sign In
                    <ChevronRight size={24} color="rgba(0,0,0,0.2)" />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Search, User, ChevronRight, ChevronDown,
  BrainCircuit, GitBranch, Activity, CheckCircle, 
  LayoutDashboard, LineChart, Target, Map, 
  FileText, Download, Clock, Settings, CreditCard, LogOut, Shield
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const NAV_LINKS = [
  { id: "intelligence", label: "Intelligence" },
  { id: "journey", label: "Journey" },
  { id: "tools", label: "Tools" },
  { id: "chat", label: "Chat", to: "/chat" },
  { id: "vision", label: "Vision", to: "/about" },
  { id: "connect", label: "Conversations", to: "/contact" }
];

const MEGA_MENUS = {
  intelligence: [
    { 
      title: "Core Engines", type: "large", 
      links: [
        { label: "Profile Intelligence", to: "/profile-intelligence", icon: <BrainCircuit size={20} /> },
        { label: "Resume Intelligence", to: "/resume-intelligence", icon: <FileText size={20} /> },
        { label: "Interview Intelligence", to: "/interview-intelligence", icon: <Activity size={20} /> },
        { label: "Recruiter Intelligence", to: "/recruiter-intelligence", icon: <Shield size={20} /> }
      ]
    },
    { 
      title: "Specialized Analysis", type: "small", 
      links: [
        { label: "GitHub Intelligence", to: "/github-intelligence", icon: <GitBranch size={16} /> },
        { label: "Engineering Maturity", to: "/profile-intelligence", icon: <Target size={16} /> },
        { label: "Career Readiness", to: "/profile-intelligence", icon: <CheckCircle size={16} /> },
        { label: "Recruiter Trust", to: "/resume-intelligence", icon: <Activity size={16} /> }
      ]
    }
  ],
  journey: [
    {
      title: "Tracking", type: "large",
      links: [
        { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { label: "Career Path", to: "/profile-intelligence", icon: <Map size={20} /> },
        { label: "History", to: "/dashboard", icon: <Clock size={20} /> }
      ]
    },
    {
      title: "Evaluation", type: "small",
      links: [
        { label: "Assessments", to: "/assessments", icon: <LineChart size={16} /> },
        { label: "Analytics Reports", to: "/dashboard", icon: <Target size={16} /> }
      ]
    }
  ],
  tools: [
    {
      title: "Creation", type: "large",
      links: [
        { label: "Resume Studio", to: "/resume-studio", icon: <FileText size={20} /> }
      ]
    },
    {
      title: "Utilities", type: "small",
      links: [
        { label: "PDF Export", to: "/resume-studio", icon: <Download size={16} /> }
      ]
    }
  ]
};

export default function Navbar() {
  const { currentUser: user } = useAuth();
  const { addToast } = useToast();
  
  const [activeMenu, setActiveMenu] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [searchOpen]);

  // Global CMD+K Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeLogout = async () => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      navigate('/');
      addToast("Signed Out", "You have successfully signed out of CareerOS.", "success", 4000);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* Core Apple Nav */
        .apple-nav-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 10000;
          font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          transition: background-color 0.3s ease, border-color 0.3s ease;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .apple-nav-wrapper.scrolled {
          background: rgba(255, 255, 255, 0.85);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .apple-nav-container {
          width: 100%;
          margin: 0 auto;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
        }

        /* Brand Logo */
        .apple-brand {
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #111827;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease;
          transform-origin: left center;
        }
        .apple-brand:hover {
          transform: scale(1.03);
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .apple-brand {
            --logo-size: 28px;
          }
        }

        /* Nav Links */
        .apple-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          height: 100%;
        }

        .apple-nav-link {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: rgba(0, 0, 0, 0.8);
          text-decoration: none;
          height: 100%;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .apple-nav-link:hover, .apple-nav-link.active {
          color: #000;
        }

        /* Right Actions */
        .apple-right-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .apple-action-btn {
          background: none;
          border: none;
          color: rgba(0,0,0,0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
          padding: 0;
        }
        
        .apple-action-btn:hover {
          color: #000;
        }

        /* Search Spotlight Modal */
        .apple-spotlight-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 20000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 12vh;
        }

        .apple-spotlight-modal {
          width: 100%;
          max-width: 640px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: saturate(200%) blur(30px);
          -webkit-backdrop-filter: saturate(200%) blur(30px);
          border-radius: 18px;
          box-shadow: 0 16px 64px rgba(0,0,0,0.24), 0 0 1px rgba(0,0,0,0.1);
          overflow: hidden;
          margin: 0 16px;
        }

        .apple-spotlight-header {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .apple-spotlight-input {
          flex: 1;
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.02em;
          border: none;
          background: transparent;
          outline: none;
          padding: 0 16px;
          color: #1d1d1f;
        }
        .apple-spotlight-input::placeholder {
          color: #86868b;
        }

        .apple-spotlight-body {
          padding: 16px 0;
        }

        .spotlight-section-title {
          font-size: 11px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 8px 24px;
        }

        .spotlight-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          text-decoration: none;
          color: #1d1d1f;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.1s ease;
        }
        .spotlight-item:hover {
          background: rgba(0, 113, 227, 0.1);
          color: #0071e3;
        }

        /* Career Snapshot Panel */
        .apple-profile-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 320px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: saturate(200%) blur(50px);
          -webkit-backdrop-filter: saturate(200%) blur(50px);
          border-radius: 20px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
          overflow: hidden;
          padding: 8px;
          z-index: 10000;
        }

        .snapshot-header {
          padding: 12px 10px 16px;
        }
        
        .snapshot-welcome {
          font-size: 11px;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .snapshot-name {
          font-size: 20px;
          font-weight: 700;
          color: #1d1d1f;
          letter-spacing: -0.02em;
          margin-bottom: 2px;
        }

        .snapshot-subtitle {
          font-size: 12px;
          color: #86868b;
          font-weight: 500;
        }

        .snapshot-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
          margin-bottom: 12px;
        }

        .snapshot-metric-card {
          background: rgba(0,0,0,0.03);
          border-radius: 12px;
          padding: 12px 8px;
          text-align: center;
        }

        .snapshot-metric-value {
          font-size: 22px;
          font-weight: 700;
          color: #1d1d1f;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }

        .snapshot-metric-label {
          font-size: 10px;
          color: #86868b;
          font-weight: 600;
          line-height: 1.2;
        }

        .profile-popover-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 500;
          color: #1d1d1f;
          text-decoration: none;
          border-radius: 10px;
          transition: background 0.2s ease;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          letter-spacing: -0.01em;
        }
        .profile-popover-item:hover {
          background: rgba(0,0,0,0.05);
        }

        /* Mega Menu Panel */
        .apple-mega-menu {
          position: absolute;
          top: 44px; /* Exactly below navbar */
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: saturate(180%) blur(30px);
          -webkit-backdrop-filter: saturate(180%) blur(30px);
          border-bottom: 1px solid rgba(0,0,0,0.08);
          overflow: hidden;
          z-index: 9999;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .mega-menu-content {
          max-width: 1024px;
          margin: 0 auto;
          padding: 40px 16px;
          display: flex;
          gap: 64px;
        }

        .mega-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .mega-col-title {
          font-size: 11px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mega-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #1d1d1f;
          transition: color 0.2s;
        }
        .mega-link:hover {
          color: #0071e3;
        }

        .mega-col.large .mega-link {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.015em;
        }
        
        .mega-col.small .mega-link {
          font-size: 13px;
          font-weight: 500;
        }

        /* Mobile Adjustments */
        .apple-mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(0,0,0,0.8);
          padding: 0;
        }

        @media (max-width: 768px) {
          .apple-nav-links, .apple-right-actions {
            display: none;
          }
          .apple-mobile-menu-btn {
            display: flex;
          }
        }

        /* Mobile Fullscreen Menu */
        .mobile-hub-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: saturate(200%) blur(50px);
          -webkit-backdrop-filter: saturate(200%) blur(50px);
          z-index: 100000;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .mobile-hub-header-bar {
          display: flex;
          justify-content: flex-end;
          padding: 20px 24px 10px;
        }

        .mobile-hub-content {
          padding: 0 24px 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .mobile-hub-profile {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-hub-headline {
          font-size: 36px;
          font-weight: 700;
          color: #1d1d1f;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        
        .mobile-hub-user-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.04);
          padding: 6px 16px 6px 6px;
          border-radius: 100px;
          align-self: flex-start;
        }

        .mobile-hub-user-pill .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #86868b;
        }

        .mobile-hub-user-pill span {
          font-size: 14px;
          font-weight: 600;
          color: #1d1d1f;
        }

        .mobile-hub-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .mobile-hub-metric-card {
          background: rgba(0,0,0,0.03);
          border-radius: 16px;
          padding: 16px 10px;
          text-align: center;
        }
        
        .mobile-hub-primary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .mobile-hub-primary-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03);
        }

        .mobile-hub-primary-card .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(0, 113, 227, 0.1);
          color: #0071e3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-hub-primary-card span {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .mobile-hub-secondary {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 24px;
          padding: 8px 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03);
        }

        .mobile-hub-list-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 0;
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          color: #1d1d1f;
          font-size: 16px;
          font-weight: 500;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        
        .mobile-hub-list-item:last-child {
          border-bottom: none;
        }
      `}</style>

      <div 
        className={`apple-nav-wrapper ${scrolled ? 'scrolled' : ''}`} 
        ref={navRef}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="apple-nav-container">
          {/* LOGO */}
          <Link to="/" className="apple-brand" aria-label="CareerOS Home" onClick={() => setActiveMenu(null)}>
            <Logo />
            <span>CareerOS</span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="apple-nav-links">
            {NAV_LINKS.map(link => (
              link.to ? (
                <Link 
                  to={link.to}
                  key={link.id}
                  className={`apple-nav-link ${activeMenu === link.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveMenu(link.id)}
                >
                  {link.label}
                </Link>
              ) : (
                <div 
                  key={link.id}
                  className={`apple-nav-link ${activeMenu === link.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveMenu(link.id)}
                >
                  {link.label}
                </div>
              )
            ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="apple-right-actions">
            <button className="apple-action-btn" onClick={() => setSearchOpen(true)}>
              <Search size={16} />
            </button>
            
            {user ? (
              <div style={{ position: 'relative' }}>
                <button 
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px 4px 4px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    color: '#1d1d1f',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'box-shadow 0.2s ease, background 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'; }}
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0071e3', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{user.displayName ? user.displayName.split(' ')[0] : 'Profile'}</span>
                  <ChevronDown size={14} color="#86868b" style={{ marginLeft: '-2px' }} />
                </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div 
                        className="apple-profile-popover"
                        initial={{ opacity: 0, scale: 0.96, originX: 1, originY: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ padding: '8px', width: '220px' }}
                      >
                        <div style={{ padding: '8px 12px', marginBottom: '4px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '2px' }}>
                            {user.displayName || "Engineer"}
                          </div>
                          <div style={{ fontSize: '12px', color: '#86868b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email || "No email"}
                          </div>
                        </div>
                        
                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <Link to="/profile-intelligence" className="profile-popover-item" onClick={() => setProfileMenuOpen(false)}>
                            <User size={14} color="#86868b" strokeWidth={2} /> Profile
                          </Link>
                          <Link to="/settings" className="profile-popover-item" onClick={() => setProfileMenuOpen(false)}>
                            <Settings size={14} color="#86868b" strokeWidth={2} /> Settings
                          </Link>
                          <Link to="/resume-studio" className="profile-popover-item" onClick={() => setProfileMenuOpen(false)}>
                            <FileText size={14} color="#86868b" strokeWidth={2} /> Resume Studio
                          </Link>
                        </div>

                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <button onClick={executeLogout} className="profile-popover-item" style={{ color: "#1d1d1f" }}>
                            <LogOut size={14} color="#86868b" strokeWidth={2} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="apple-action-btn" style={{ padding: '0 16px', borderRadius: '24px', background: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
                Sign In
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="apple-mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* MEGA MENUS */}
      <AnimatePresence>
        {activeMenu && MEGA_MENUS[activeMenu] && (
          <motion.div
            className="apple-mega-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="mega-menu-content">
              {MEGA_MENUS[activeMenu].map((col, i) => (
                <div key={i} className={`mega-col ${col.type}`}>
                  <div className="mega-col-title">{col.title}</div>
                  {col.links.map((link, j) => (
                    <Link key={j} to={link.to} className="mega-link" onClick={() => setActiveMenu(null)}>
                      {link.icon && <span style={{ opacity: 0.6 }}>{link.icon}</span>}
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPOTLIGHT SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="apple-spotlight-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div 
              className="apple-spotlight-modal"
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="apple-spotlight-header">
                <Search size={22} color="#86868b" style={{ marginRight: 12 }} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="apple-spotlight-input"
                  placeholder="Search CareerOS..."
                />
                <span style={{ fontSize: 11, color: '#86868b', border: '1px solid #d2d2d7', borderRadius: 4, padding: '2px 6px' }}>ESC</span>
              </div>
              
              <div className="apple-spotlight-body">
                <div className="spotlight-section-title">Engines</div>
                <Link to="/github-intelligence" className="spotlight-item" onClick={() => setSearchOpen(false)}>
                  <GitBranch size={16} /> GitHub Intelligence
                </Link>
                <Link to="/resume-intelligence" className="spotlight-item" onClick={() => setSearchOpen(false)}>
                  <FileText size={16} /> Resume Intelligence
                </Link>
                <Link to="/interview-intelligence" className="spotlight-item" onClick={() => setSearchOpen(false)}>
                  <Activity size={16} /> Interview Intelligence
                </Link>

                <div className="spotlight-section-title" style={{ marginTop: 12 }}>Tools</div>
                <Link to="/resume-studio" className="spotlight-item" onClick={() => setSearchOpen(false)}>
                  <FileText size={16} /> Resume Studio
                </Link>
                <Link to="/assessments" className="spotlight-item" onClick={() => setSearchOpen(false)}>
                  <LineChart size={16} /> Engineering Assessments
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE FULLSCREEN NAVIGATION HUB */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-hub-overlay"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
          >
            <div className="mobile-hub-header-bar">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'rgba(0,0,0,0.05)', border: 'none', padding: 8, borderRadius: '50%', color: '#1d1d1f' }}
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>
            
            <div className="mobile-hub-content">
              {/* TOP SECTION: Personal Snapshot */}
              <div className="mobile-hub-profile">
                {user && (
                  <div className="mobile-hub-user-pill">
                    <div className="avatar"><User size={16} /></div>
                    <span>{user.displayName || "Engineer"}</span>
                  </div>
                )}
                <div className="mobile-hub-headline">
                  Know where<br/>you stand.
                </div>
                
                <div className="mobile-hub-metrics">
                  <div className="mobile-hub-metric-card">
                    <div className="snapshot-metric-value" style={{fontSize: 24}}>78</div>
                    <div className="snapshot-metric-label">Readiness</div>
                  </div>
                  <div className="mobile-hub-metric-card">
                    <div className="snapshot-metric-value" style={{fontSize: 24}}>82</div>
                    <div className="snapshot-metric-label">Maturity</div>
                  </div>
                  <div className="mobile-hub-metric-card">
                    <div className="snapshot-metric-value" style={{fontSize: 24}}>88</div>
                    <div className="snapshot-metric-label">Trust</div>
                  </div>
                </div>
              </div>

              {/* PRIMARY DESTINATIONS: Cards */}
              <div className="mobile-hub-primary-grid">
                <Link to="/profile-intelligence" className="mobile-hub-primary-card" onClick={() => setMobileMenuOpen(false)}>
                  <div className="icon-wrapper"><BrainCircuit size={24} /></div>
                  <span>Intelligence</span>
                </Link>
                <Link to="/resume-studio" className="mobile-hub-primary-card" onClick={() => setMobileMenuOpen(false)}>
                  <div className="icon-wrapper"><FileText size={24} /></div>
                  <span>Resume Studio</span>
                </Link>
                <Link to="/github-intelligence" className="mobile-hub-primary-card" onClick={() => setMobileMenuOpen(false)}>
                  <div className="icon-wrapper"><GitBranch size={24} /></div>
                  <span>GitHub Tools</span>
                </Link>
                <Link to="/career-path" className="mobile-hub-primary-card" onClick={() => setMobileMenuOpen(false)}>
                  <div className="icon-wrapper"><Map size={24} /></div>
                  <span>Career Journey</span>
                </Link>
              </div>

              {/* SECONDARY & BOTTOM SECTION: Unified List */}
              <div className="mobile-hub-secondary">
                <Link to="/about" className="mobile-hub-list-item" onClick={() => setMobileMenuOpen(false)}>
                  <Target size={20} color="#86868b" strokeWidth={1.5} /> Vision
                </Link>
                <Link to="/contact" className="mobile-hub-list-item" onClick={() => setMobileMenuOpen(false)}>
                  <Activity size={20} color="#86868b" strokeWidth={1.5} /> Conversations
                </Link>
                <Link to="/settings" className="mobile-hub-list-item" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={20} color="#86868b" strokeWidth={1.5} /> Settings
                </Link>
                
                {user ? (
                  <button onClick={executeLogout} className="mobile-hub-list-item" style={{color: '#1d1d1f'}}>
                    <LogOut size={20} color="#86868b" strokeWidth={1.5} /> Sign Out
                  </button>
                ) : (
                  <Link to="/login" className="mobile-hub-list-item" style={{color: '#0071e3'}} onClick={() => setMobileMenuOpen(false)}>
                    <User size={20} color="#0071e3" strokeWidth={1.5} /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
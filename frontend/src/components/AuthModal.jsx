import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Pages/Login.css';

export default function AuthModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = () => {
    // Navigate to login with the current path so we can return here after login
    navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
  };

  const handleMaybeLater = () => {
    navigate('/');
  };

  return (
    <div className="auth-modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '440px',
          width: '90%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.4)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="auth-ambient-glow" style={{ position: 'absolute', top: '-50%', left: '-50%', right: '-50%', bottom: '-50%', background: 'radial-gradient(circle at center, rgba(0,113,227,0.05) 0%, transparent 60%)', zIndex: -1, pointerEvents: 'none' }} />
        
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: '#1d1d1f',
          marginBottom: '16px',
          letterSpacing: '-0.02em'
        }}>
          Unlock CareerOS Intelligence
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: '#86868b',
          lineHeight: '1.5',
          marginBottom: '32px'
        }}>
          Sign in to access personalized career intelligence, AI conversations, resume analysis, interview preparation, assessments, and professional growth tools.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={handleSignIn}
            style={{
              background: '#0071e3',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              width: '100%'
            }}
            onMouseOver={(e) => e.target.style.background = '#0077ED'}
            onMouseOut={(e) => e.target.style.background = '#0071e3'}
          >
            Sign In
          </button>
          
          <button 
            onClick={handleMaybeLater}
            style={{
              background: 'transparent',
              color: '#86868b',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseOver={(e) => { e.target.style.background = 'rgba(0,0,0,0.03)'; e.target.style.color = '#1d1d1f'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#86868b'; }}
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
}

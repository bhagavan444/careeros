import React, { useEffect, useState, useRef } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

/**
 * ==========================================================
 * PathNex Login – Next-Generation Authentication Experience
 * ----------------------------------------------------------
 * ✦ Split-screen professional layout
 * ✦ Magnetic cursor interactions
 * ✦ Floating label inputs
 * ✦ Advanced password strength meter
 * ✦ Smooth animations & micro-interactions
 * ✦ Glassmorphism design
 * ✦ Enterprise-grade UI/UX
 * ==========================================================
 */

/* ================= MAGNETIC CURSOR COMPONENT ================= */
const MagneticCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const moveCursor = (e) => {
      setIsVisible(true);
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      const delay = 0.15;
      cursorX += (mouseX - cursorX) * delay;
      cursorY += (mouseY - cursorY) * delay;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Magnetic effect on interactive elements
    const interactiveElements = document.querySelectorAll('button, input, a, .magnetic');

    const magneticEffect = (e) => {
      setIsHovering(true);
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 80;

      if (distance < maxDistance) {
        const strength = 0.2;
        const moveX = deltaX * strength;
        const moveY = deltaY * strength;
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    const resetMagnetic = (e) => {
      setIsHovering(false);
      e.currentTarget.style.transform = 'translate(0, 0)';
    };

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => setIsHovering(true));
      el.addEventListener('mouseleave', () => setIsHovering(false));
      el.addEventListener('mousemove', magneticEffect);
      el.addEventListener('mouseleave', resetMagnetic);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mousemove', magneticEffect);
        el.removeEventListener('mouseleave', resetMagnetic);
      });
    };
  }, []);

  const cursorStyle = {
    position: 'fixed',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid rgba(37, 99, 235, 0.5)',
    pointerEvents: 'none',
    zIndex: 10000,
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.3s, height 0.3s, border-color 0.3s',
    opacity: isVisible ? 1 : 0,
    width: isHovering ? '60px' : '40px',
    height: isHovering ? '60px' : '40px',
    borderColor: isHovering ? 'rgba(37, 99, 235, 0.8)' : 'rgba(37, 99, 235, 0.5)',
  };

  const dotStyle = {
    position: 'fixed',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#2563EB',
    pointerEvents: 'none',
    zIndex: 10001,
    transform: 'translate(-50%, -50%)',
    opacity: isVisible ? 1 : 0,
  };

  return (
    <>
      <div ref={cursorRef} style={cursorStyle} />
      <div ref={cursorDotRef} style={dotStyle} />
    </>
  );
};

/* ================= ANIMATED BACKGROUND COMPONENT ================= */
const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 60 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.4,
      }}
    />
  );
};

/* ================= FLOATING LABEL INPUT COMPONENT ================= */
const FloatingLabelInput = ({ 
  type, 
  value, 
  onChange, 
  placeholder, 
  showToggle, 
  onToggleVisibility,
  showPassword,
  error 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  const containerStyle = {
    position: 'relative',
    marginBottom: '24px',
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 16px 16px 16px',
    fontSize: '15px',
    fontWeight: '400',
    color: '#0f172a',
    background: 'rgba(248, 250, 252, 0.8)',
    border: `2px solid ${error ? '#ef4444' : isFocused ? '#2563EB' : '#e2e8f0'}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Inter', sans-serif",
    boxShadow: isFocused ? '0 0 0 4px rgba(37, 99, 235, 0.1)' : 'none',
  };

  const labelStyle = {
    position: 'absolute',
    left: '16px',
    top: isFocused || hasValue ? '-10px' : '18px',
    fontSize: isFocused || hasValue ? '12px' : '15px',
    fontWeight: '500',
    color: error ? '#ef4444' : isFocused ? '#2563EB' : '#64748b',
    background: '#ffffff',
    padding: '0 6px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    letterSpacing: '0.3px',
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    transition: 'color 0.2s',
  };

  const errorStyle = {
    fontSize: '13px',
    color: '#ef4444',
    marginTop: '6px',
    fontWeight: '500',
    display: error ? 'block' : 'none',
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>{placeholder}</label>
      <input
        type={showToggle && !showPassword ? 'password' : type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={inputStyle}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggleVisibility}
          style={toggleButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
      <div style={errorStyle}>{error}</div>
    </div>
  );
};

/* ================= MAIN LOGIN COMPONENT ================= */
export default function Login({ handleLogin }) {
  /* ================= STATE ================= */
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  const navigate = useNavigate();

  const features = [
    {
      title: "Resume Intelligence",
      description: "AI-powered resume analysis and optimization"
    },
    {
      title: "Career Readiness Index",
      description: "Comprehensive skill assessment and gap analysis"
    },
    {
      title: "Role Matching Engine",
      description: "Precision matching with industry opportunities"
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify and bridge critical skill gaps"
    }
  ];

  // Import Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  /* ================= AUTH WATCH ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/recommend");
    });
    return unsubscribe;
  }, [navigate]);

  /* ================= PASSWORD STRENGTH ================= */
  useEffect(() => {
    setPasswordScore(calculatePasswordScore(password));
  }, [password]);

  /* ================= FEATURE ROTATION ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ================= RATE LIMIT LOAD ================= */
  useEffect(() => {
    const attempts = Number(localStorage.getItem("login_attempts") || 0);
    setLoginAttempts(attempts);
  }, []);

  /* ================= HELPERS ================= */
  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const isValidEmail = (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

  function calculatePasswordScore(pw = "") {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[@#$%^&+=!]/.test(pw)) score++;
    return score;
  }

  const recordFailedAttempt = () => {
    const next = loginAttempts + 1;
    setLoginAttempts(next);
    localStorage.setItem("login_attempts", next);

    if (next >= 5) {
      setErrorMsg("Too many attempts. Please try again later.");
    } else {
      setErrorMsg(`Authentication failed. ${5 - next} attempts remaining.`);
    }
  };

  /* ================= AUTH HANDLERS ================= */
  const loginWithEmail = async () => {
    resetMessages();
    if (!isValidEmail(email)) return setErrorMsg("Please enter a valid email address");
    if (password.length < 6) return setErrorMsg("Password must be at least 6 characters");

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("login_attempts", 0);
      handleLogin();
      navigate("/recommend");
    } catch (err) {
      recordFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async () => {
    resetMessages();
    if (!termsAccepted) return setErrorMsg("Please accept the Privacy Policy to continue");
    if (!isValidEmail(email)) return setErrorMsg("Please enter a valid email address");
    if (passwordScore < 3) return setErrorMsg("Please use a stronger password");

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      setSuccessMsg("Account created successfully. Verification email sent.");
      handleLogin();
      navigate("/recommend");
    } catch (err) {
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    resetMessages();
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      handleLogin();
      navigate("/predict");
    } catch (err) {
      recordFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!isValidEmail(email)) return setErrorMsg("Please enter a valid email address");
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Password reset email sent successfully.");
    } catch {
      setErrorMsg("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("demo.pathnex@gmail.com");
    setPassword("Demo@1234");
    setMode("login");
    setSuccessMsg("Demo credentials loaded");
  };

  /* ================= STYLES ================= */
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  };

  const leftPanelStyle = {
    flex: '1.2',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 60px',
    overflow: 'hidden',
  };

  const rightPanelStyle = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    background: '#ffffff',
    position: 'relative',
  };

  const brandLogoStyle = {
    fontSize: '48px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '24px',
    fontFamily: "'Playfair Display', serif",
    fontStyle: 'italic',
    letterSpacing: '-1px',
    textAlign: 'center',
    zIndex: 2,
  };

  const headlineStyle = {
    fontSize: '42px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1.2',
    marginBottom: '20px',
    textAlign: 'center',
    letterSpacing: '-1px',
    zIndex: 2,
  };

  const subtextStyle = {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
    textAlign: 'center',
    maxWidth: '500px',
    marginBottom: '60px',
    zIndex: 2,
  };

  const featureCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '500px',
    width: '100%',
    zIndex: 2,
    animation: 'fadeInUp 0.6s ease-out',
  };

  const authCardStyle = {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '48px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    animation: 'scaleIn 0.5s ease-out',
  };

  const cardHeaderStyle = {
    textAlign: 'center',
    marginBottom: '40px',
  };

  const logoTextStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
    fontFamily: "'Playfair Display', serif",
    fontStyle: 'italic',
  };

  const cardSubtitleStyle = {
    fontSize: '15px',
    color: '#64748b',
    fontWeight: '400',
  };

  const modeToggleStyle = {
    display: 'flex',
    background: '#f1f5f9',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '32px',
    position: 'relative',
  };

  const modeButtonStyle = (active) => ({
    flex: 1,
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    color: active ? '#ffffff' : '#64748b',
    background: active ? '#2563EB' : 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1,
    letterSpacing: '0.3px',
  });

  const passwordStrengthContainerStyle = {
    marginBottom: '24px',
  };

  const strengthIndicatorStyle = {
    display: 'flex',
    gap: '6px',
    marginBottom: '8px',
  };

  const strengthSegmentStyle = (index) => ({
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    background: index < passwordScore 
      ? ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][passwordScore - 1]
      : '#e2e8f0',
    transition: 'all 0.3s ease-out',
  });

  const strengthLabelStyle = {
    fontSize: '13px',
    fontWeight: '500',
    color: passwordScore === 0 ? '#94a3b8' : 
           passwordScore <= 2 ? '#ef4444' :
           passwordScore === 3 ? '#eab308' : '#10b981',
    textAlign: 'center',
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

  const primaryButtonStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: loading ? 'none' : '0 4px 16px rgba(37, 99, 235, 0.3)',
    marginBottom: '16px',
    letterSpacing: '0.3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const googleButtonStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a',
    background: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  };

  const demoButtonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2563EB',
    background: 'rgba(37, 99, 235, 0.08)',
    border: '1px solid rgba(37, 99, 235, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '8px',
  };

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '32px 0',
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500',
  };

  const dividerLineStyle = {
    flex: 1,
    height: '1px',
    background: '#e2e8f0',
  };

  const messageStyle = (type) => ({
    padding: '14px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
    background: type === 'error' ? '#fef2f2' : '#f0fdf4',
    color: type === 'error' ? '#991b1b' : '#065f46',
    border: `1px solid ${type === 'error' ? '#fecaca' : '#86efac'}`,
    animation: 'slideInDown 0.3s ease-out',
  });

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#475569',
    cursor: 'pointer',
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#2563EB',
  };

  const linkStyle = {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-block',
    marginBottom: '20px',
    transition: 'color 0.2s',
  };

  const trustSectionStyle = {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const trustItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#64748b',
  };

  const iconStyle = {
    width: '16px',
    height: '16px',
    color: '#10b981',
  };

  /* ================= RENDER ================= */
  return (
    <div style={containerStyle}>
      <MagneticCursor />
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @media (max-width: 968px) {
          .login-container {
            flex-direction: column;
          }
          .left-panel {
            min-height: 40vh;
            padding: 40px 24px;
          }
          .right-panel {
            padding: 24px;
          }
        }
      `}</style>

      {/* LEFT PANEL - BRAND INTELLIGENCE */}
      <div style={leftPanelStyle} className="left-panel">
        <AnimatedBackground />
        
        <div style={brandLogoStyle}>PathNex</div>
        
        <h1 style={headlineStyle}>
          Build Your Career with Intelligence
        </h1>
        
        <p style={subtextStyle}>
          Structured AI-driven career insights aligned with industry standards
        </p>

        <div style={featureCardStyle}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Featured Capability
          </div>
          
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px',
            letterSpacing: '-0.5px',
          }}>
            {features[currentFeature].title}
          </h3>
          
          <p style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6',
            margin: 0,
          }}>
            {features[currentFeature].description}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - AUTH CARD */}
      <div style={rightPanelStyle} className="right-panel">
        <div style={authCardStyle}>
          {/* Card Header */}
          <div style={cardHeaderStyle}>
            <h2 style={logoTextStyle}>PathNex</h2>
            <p style={cardSubtitleStyle}>Access your career intelligence dashboard</p>
          </div>

          {/* Mode Toggle */}
          <div style={modeToggleStyle}>
            <button
              style={modeButtonStyle(mode === "login")}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              style={modeButtonStyle(mode === "signup")}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Messages */}
          {errorMsg && <div style={messageStyle('error')}>{errorMsg}</div>}
          {successMsg && <div style={messageStyle('success')}>{successMsg}</div>}

          {/* Email Input */}
          <FloatingLabelInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            error={errorMsg && !isValidEmail(email) && email.length > 0 ? "Invalid email format" : ""}
          />

          {/* Password Input */}
          <FloatingLabelInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            showToggle={true}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          />

          {/* Password Strength Meter */}
          {mode === "signup" && password.length > 0 && (
            <div style={passwordStrengthContainerStyle}>
              <div style={strengthIndicatorStyle}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} style={strengthSegmentStyle(index)} />
                ))}
              </div>
              <div style={strengthLabelStyle}>
                {strengthLabels[passwordScore]}
              </div>
              {passwordScore < 4 && (
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  marginTop: '6px',
                  textAlign: 'center',
                }}>
                  Add uppercase, number & special character for stronger security
                </div>
              )}
            </div>
          )}

          {/* Terms Checkbox (Signup) */}
          {mode === "signup" && (
            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={checkboxStyle}
              />
              <span>I accept the <span style={{color: '#2563EB', fontWeight: '600'}}>Privacy Policy</span></span>
            </label>
          )}

          {/* Forgot Password Link (Login) */}
          {mode === "login" && (
            <div style={{textAlign: 'center', marginBottom: '24px'}}>
              <a 
                style={linkStyle}
                onClick={resetPassword}
                onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.color = '#2563EB'}
              >
                Forgot password?
              </a>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            style={primaryButtonStyle}
            onClick={mode === "login" ? loginWithEmail : signupWithEmail}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3)';
            }}
          >
            {loading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation: 'spin 1s linear infinite'}}>
                  <circle cx="12" cy="12" r="10" opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                </svg>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Processing...
              </>
            ) : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Divider */}
          <div style={dividerStyle}>
            <div style={dividerLineStyle} />
            <span style={{padding: '0 16px'}}>OR</span>
            <div style={dividerLineStyle} />
          </div>

          {/* Google Login */}
          <button
            style={googleButtonStyle}
            onClick={loginWithGoogle}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563EB';
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Demo Account */}
          <button
            style={demoButtonStyle}
            onClick={fillDemoAccount}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Explore with Demo Account
          </button>

          {/* Trust Signals */}
          <div style={trustSectionStyle}>
            <div style={trustItemStyle}>
              <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Firebase Secure Authentication</span>
            </div>
            <div style={trustItemStyle}>
              <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Encrypted Data Transmission</span>
            </div>
            <div style={trustItemStyle}>
              <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Privacy-First Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#ffffff',
            padding: '24px 32px',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" style={{animation: 'spin 1s linear infinite'}}>
              <circle cx="12" cy="12" r="10" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
            </svg>
            <span style={{fontSize: '15px', fontWeight: '600', color: '#0f172a'}}>
              Authenticating...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
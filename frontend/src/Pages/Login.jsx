import React, { useEffect, useState } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Mail, AlertCircle, Github, Chrome, AlertTriangle, Info, X } from "lucide-react";
import { useToast } from "../context/ToastContext";
import "./Login.css";

export default function Login({ handleLogin }) {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [initStep, setInitStep] = useState(0);

  // Toasts State
  const { addToast } = useToast();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract redirect path from URL params
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect") || "/";

  const handleAuthError = (err) => {
    console.error("Auth Error:", err);
    let title = "Authentication Failed";
    let message = "An unexpected error occurred. Please try again.";
    let type = "error";
    let duration = 5000;

    switch (err.code) {
      case "auth/account-exists-with-different-credential":
        title = "Account Already Exists";
        message = "An account already exists with this email address.\n\nPlease sign in using the provider you originally used (Google, GitHub, Microsoft, or Email & Password). After signing in, you can connect additional providers from Account Settings.";
        type = "warning";
        duration = 8000;
        break;
      case "auth/popup-closed-by-user":
        title = "Authentication Cancelled";
        message = "The sign-in window was closed before authentication completed.";
        type = "info";
        break;
      case "auth/network-request-failed":
        title = "Connection Error";
        message = "Unable to connect. Please check your internet connection and try again.";
        type = "error";
        break;
      case "auth/too-many-requests":
        title = "Account Temporarily Locked";
        message = "Too many login attempts detected. Please wait a few minutes and try again.";
        type = "warning";
        break;
      case "auth/user-not-found":
        title = "Account Not Found";
        message = "No CareerOS account was found with this email address.";
        type = "error";
        break;
      case "auth/wrong-password":
        title = "Authentication Failed";
        message = "Incorrect password. Please try again.";
        type = "error";
        break;
      case "auth/email-already-in-use":
        title = "Email In Use";
        message = "An account with this email already exists. Please sign in instead.";
        type = "warning";
        break;
      default:
        message = err.message ? err.message.replace('Firebase: ', '') : message;
    }

    addToast(title, message, type, duration);
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !initializing) {
        navigate(redirectPath);
      }
    });
    return unsubscribe;
  }, [navigate, initializing, redirectPath]);

  const runInitialization = () => {
    setInitializing(true);
    const steps = [
      "Verifying Identity",
      "Loading Professional Memory",
      "Initializing Intelligence Engine",
      "Preparing Workspace"
    ];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setInitStep(currentStep);
      } else {
        clearInterval(interval);
        if (handleLogin) handleLogin();
        
        // Show Session Intelligence Banner before navigating
        addToast("Welcome to CareerOS", "Your professional intelligence workspace is ready.", "success", 4000);
        
        setTimeout(() => {
          navigate(redirectPath);
        }, 100);
      }
    }, 600); // ~2.4 seconds total
  };

  const loginWithEmail = async (e) => {
    e?.preventDefault();
    if (!auth) return addToast("System Error", "Firebase auth is not initialized.", "error");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      addToast("Welcome back", "You have successfully signed in to CareerOS.", "success", 3000);
      runInitialization();
    } catch (err) {
      handleAuthError(err);
      setLoading(false);
    }
  };

  const signupWithEmail = async (e) => {
    e?.preventDefault();
    if (!auth) return addToast("System Error", "Firebase auth is not initialized.", "error");
    if (password !== confirmPassword) return addToast("Signup Failed", "Passwords do not match.", "error");
    if (!termsAccepted) return addToast("Signup Failed", "Please accept the Privacy Policy to continue.", "error");
    
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      addToast("Account Created", "Your CareerOS account is ready. Verify your email to unlock all features.", "success", 4000);
      runInitialization();
    } catch (err) {
      handleAuthError(err);
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) return;
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      addToast("Welcome back", "You have successfully signed in to CareerOS.", "success", 3000);
      runInitialization();
    } catch (err) {
      handleAuthError(err);
      setLoading(false);
    }
  };

  const loginWithGithub = async () => {
    if (!auth) return;

    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        githubProvider
      );

      console.log("GitHub Success:", result);

      addToast(
        "Welcome back",
        "You have successfully signed in to CareerOS.",
        "success",
        3000
      );

      runInitialization();

    } catch (err) {
      handleAuthError(err);
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e?.preventDefault();
    if (!auth) return;
    if (!email) return addToast("Email Required", "Please enter your email address first.", "error");
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      addToast("Reset Email Sent", "Check your inbox for password reset instructions.", "mail", 4000);
    } catch {
      addToast("Reset Failed", "Failed to send reset email. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const initStepsText = [
    "Verifying Identity",
    "Loading Professional Memory",
    "Initializing Intelligence Engine",
    "Preparing Workspace"
  ];

  if (initializing) {
    return (
      <div className="auth-initializing-overlay">
        <div className="auth-init-orb" />
        <AnimatePresence mode="wait">
          <motion.div 
            key={initStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="auth-init-text"
          >
            {initStepsText[initStep]}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {/* Left Brand Column */}
      <div className="auth-left-column">
        <div className="auth-ambient-glow" />
        <div className="auth-orb" />
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="auth-brand-content"
        >
          <h1 className="auth-brand-title">CareerOS</h1>
          <h2 className="auth-brand-subtitle">Professional Intelligence Operating System</h2>
          <p className="auth-brand-statement">
            <span>Build skills.</span>
            <span>Master interviews.</span>
            <span>Optimize resumes.</span>
            <span>Accelerate careers.</span>
          </p>
        </motion.div>
      </div>

      {/* Right Auth Column */}
      <div className="auth-right-column">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="auth-card"
        >
          <div className="auth-mobile-wordmark">CareerOS</div>

          {/* Segmented Control */}
          <div className="segmented-control">
            <motion.div 
              className="segmented-indicator"
              animate={{ left: mode === "login" ? "4px" : "50%", right: mode === "login" ? "50%" : "4px" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign In</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create Account</button>
          </div>

          {/* Primary Providers */}
          <div className="auth-providers">
            <button type="button" className="auth-provider-btn" onClick={loginWithGoogle} disabled={loading}>
              <Chrome size={20} color="#EA4335" /> Continue with Google
            </button>
            <button type="button" className="auth-provider-btn" onClick={loginWithGithub} disabled={loading}>
              <Github size={20} /> Continue with GitHub
            </button>
          </div>

          <div className="auth-divider">or continue with email</div>

          {/* Email Auth Form */}
          <form className="auth-form" onSubmit={mode === "login" ? loginWithEmail : signupWithEmail}>
            <div className="auth-input-wrapper">
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Email address" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="auth-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <button 
                type="button" 
                className="auth-input-action" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="auth-input-wrapper">
                    <input 
                      type="password" 
                      className="auth-input" 
                      placeholder="Confirm Password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      required={mode === "signup"} 
                    />
                  </div>
                  <label className="auth-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      className="auth-checkbox"
                      checked={termsAccepted}
                      onChange={e => setTermsAccepted(e.target.checked)}
                    />
                    <span className="auth-checkbox-label">I accept the Terms & Privacy Policy</span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="auth-spinner" /> Authenticating...
                </>
              ) : mode === "login" ? "Continue" : "Create Account"}
            </button>
          </form>
          
          {mode === "login" && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button type="button" onClick={resetPassword} style={{ background: "none", border: "none", color: "#0071e3", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                Forgot password?
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
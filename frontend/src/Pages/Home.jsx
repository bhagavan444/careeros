import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  BrainCircuit, Activity, Lock, Target, GitBranch, Shield, 
  Map, FileText, Smartphone, Cloud, ArrowRight, Zap, CheckCircle 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const NumberCount = ({ to }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < to) {
        current += Math.ceil((to - current) / 8) || 1;
        setCount(current);
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [to]);
  return <>{count}</>;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 1: HERO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterHero = () => {
  const { currentUser: user } = useAuth();
  
  return (
    <section className="apple-chapter hero-chapter-flagship">
      <div className="hero-flagship-container">
        
        {/* LEFT COLUMN: Narrative */}
        <div className="hero-flagship-left">
          <motion.div className="hero-flagship-announcement"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Introducing CareerOS Intelligence
          </motion.div>
          
          <motion.h1 className="hero-flagship-headline"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Know where you stand.<br/>Own what's next.
          </motion.h1>
          
          <motion.p className="hero-flagship-subheadline"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            CareerOS analyzes your resume, projects, GitHub profile, technical skills, and market position to create a professional intelligence profile built on evidence, not assumptions.
          </motion.p>
          
          <motion.div className="hero-flagship-engines"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <span>Resume Intelligence</span>
            <span className="dot">•</span>
            <span>GitHub Intelligence</span>
            <span className="dot">•</span>
            <span>Interview Intelligence</span>
            <span className="dot">•</span>
            <span>Recruiter Intelligence</span>
            <span className="dot">•</span>
            <span>Profile Intelligence</span>
            <span className="dot">•</span>
            <span>Career Intelligence</span>
            <span className="dot">•</span>
            <span>Engineering Intelligence</span>
          </motion.div>

          <motion.div className="hero-flagship-ctas"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <Link to="/resume-intelligence" className="hero-btn-flagship primary">
              Generate Intelligence Profile
            </Link>
            <button className="hero-btn-flagship secondary">
              Explore Platform
            </button>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Living Intelligence System */}
        <div className="hero-flagship-right">
          <motion.div className="intelligence-system"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div className="is-node source-node">Your Career</div>
            
            <div className="is-connector vertical">
               <motion.div className="pulse-dot" animate={{ y: [0, 40] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
            </div>
            
            <motion.div className="is-engine-node"
              animate={{ boxShadow: ["0 8px 30px rgba(0, 113, 227, 0.05)", "0 8px 30px rgba(0, 113, 227, 0.2)", "0 8px 30px rgba(0, 113, 227, 0.05)"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              {user ? `Welcome back, ${user.displayName ? user.displayName.split(' ')[0] : 'Engineer'}` : "CareerOS Intelligence Engine"}
            </motion.div>
            
            <div className="is-connector vertical">
               <motion.div className="pulse-dot" animate={{ y: [0, 40] }} transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 0.5 }} />
            </div>
            
            <div className="is-metrics-layer">
              <motion.div className="is-metric-surface" whileHover={{ y: -5 }}>
                <div className="ism-label">Career Readiness</div>
                <div className="ism-value"><NumberCount to={78} /></div>
              </motion.div>
              <motion.div className="is-metric-surface" whileHover={{ y: -5 }}>
                <div className="ism-label">Engineering Maturity</div>
                <div className="ism-value"><NumberCount to={82} /></div>
              </motion.div>
              <motion.div className="is-metric-surface" whileHover={{ y: -5 }}>
                <div className="ism-label">Recruiter Trust</div>
                <div className="ism-value"><NumberCount to={88} /></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* TRUST LAYER */}
      <motion.div className="hero-trust-layer"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      >
        <h3 className="trust-layer-title">Built for ambitious professionals.</h3>
        <div className="trust-layer-stats">
          <div className="trust-stat">
            <div className="ts-num">25,000+</div>
            <div className="ts-label">Resumes Analyzed</div>
          </div>
          <div className="trust-stat">
            <div className="ts-num">10,000+</div>
            <div className="ts-label">GitHub Repositories Evaluated</div>
          </div>
          <div className="trust-stat">
            <div className="ts-num">50,000+</div>
            <div className="ts-label">Intelligence Reports Generated</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 2: CAREER INTELLIGENCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterIntelligence = () => {
  return (
    <section className="apple-chapter dark-chapter">
      <div className="chapter-container">
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
        >
          <h2 className="chapter-title">Career Intelligence.</h2>
          <p className="chapter-subtitle">See yourself as the market sees you.</p>
        </motion.div>

        <div className="metrics-grid">
          <motion.div className="metric-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }}>
            <div className="metric-value">94%</div>
            <div className="metric-label">Career Readiness</div>
          </motion.div>
          <motion.div className="metric-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}>
            <div className="metric-value">L4</div>
            <div className="metric-label">Engineering Maturity</div>
          </motion.div>
          <motion.div className="metric-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }}>
            <div className="metric-value">High</div>
            <div className="metric-label">Recruiter Trust</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 3: THE INTELLIGENCE ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterEngine = () => {
  return (
    <section className="apple-chapter light-chapter">
      <div className="chapter-container">
        <motion.h2 
          className="chapter-title dark-text"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          The Engine.
        </motion.h2>
        <motion.p className="chapter-subtitle dark-text" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          Data goes in. Clarity comes out.
        </motion.p>

        <div className="engine-flow">
          <motion.div className="flow-step" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="flow-icon"><FileText size={32} /></div>
            <h3>Your Data</h3>
            <p>Resumes, GitHub repos, interview transcripts.</p>
          </motion.div>
          
          <motion.div className="flow-arrow" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}>
            <ArrowRight size={24} color="#86868b" />
          </motion.div>

          <motion.div className="flow-step core-engine" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flow-icon glow"><BrainCircuit size={48} color="#fff" /></div>
            <h3 style={{color: '#fff'}}>CareerOS Intelligence</h3>
            <p style={{color: 'rgba(255,255,255,0.7)'}}>Millions of parameters analyzing complexity, scale, and trust.</p>
          </motion.div>

          <motion.div className="flow-arrow" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}>
            <ArrowRight size={24} color="#86868b" />
          </motion.div>

          <motion.div className="flow-step" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <div className="flow-icon"><Target size={32} /></div>
            <h3>Insights</h3>
            <p>Personalized roadmap, tailored interview prep, and ATS optimization.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 4: ENGINEERING MATURITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterMaturity = () => {
  return (
    <section className="apple-chapter grey-chapter">
      <div className="chapter-container">
        <motion.h2 className="chapter-title dark-text" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Engineering Maturity.
        </motion.h2>
        <motion.p className="chapter-subtitle dark-text" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          We don't count lines of code. We measure impact.
        </motion.p>

        <div className="glass-grid">
          <motion.div className="glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GitBranch size={28} className="card-icon" />
            <h3>Repository Analysis</h3>
            <p>Extracting architecture patterns, commit cadence, and PR complexity from public footprints.</p>
          </motion.div>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Activity size={28} className="card-icon" />
            <h3>Complexity Analysis</h3>
            <p>Measuring the scale of systems built, not just the frameworks used.</p>
          </motion.div>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <CheckCircle size={28} className="card-icon" />
            <h3>Tech Verification</h3>
            <p>Validating claimed skills against actual codebase footprints for absolute recruiter confidence.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 5: CAREER JOURNEY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterJourney = () => {
  return (
    <section className="apple-chapter dark-chapter">
      <div className="chapter-container">
        <motion.h2 className="chapter-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          The Journey.
        </motion.h2>
        
        <div className="timeline-container">
          <motion.div className="timeline-point" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="point-dot current"></div>
            <h4>Current Position</h4>
            <p>Mid-Level Backend Engineer</p>
          </motion.div>
          
          <div className="timeline-line"></div>
          
          <motion.div className="timeline-point roadmap" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <div className="point-dot target"></div>
            <h4>Growth Roadmap</h4>
            <p>Mastering distributed systems, mentoring juniors, leading epics.</p>
          </motion.div>
          
          <div className="timeline-line"></div>
          
          <motion.div className="timeline-point future" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
            <div className="point-dot future-dot"></div>
            <h4>Future Position</h4>
            <p>Senior Staff Engineer</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 6: RECRUITER PERSPECTIVE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterPerspective = () => {
  return (
    <section className="apple-chapter light-chapter">
      <div className="chapter-container text-center">
        <motion.h2 className="chapter-title dark-text" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          Through their eyes.
        </motion.h2>
        <motion.p className="chapter-subtitle dark-text" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          Experience a professional assessment of your profile.
        </motion.p>

        <motion.div className="perspective-metrics" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <div className="p-metric">
            <h1>A+</h1>
            <span>Hiring Readiness</span>
          </div>
          <div className="p-metric">
            <h1>98<small>%</small></h1>
            <span>Recruiter Trust</span>
          </div>
          <div className="p-metric">
            <h1>Top 5<small>%</small></h1>
            <span>Technical Confidence</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 7: CAREEROS COPILOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterCopilot = () => {
  return (
    <section className="apple-chapter black-chapter overflow-hidden">
      <div className="chapter-container">
        <motion.div className="copilot-glow" animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
        
        <motion.div className="copilot-content" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <BrainCircuit size={48} color="#fff" style={{ marginBottom: 24, opacity: 0.8 }} />
          <h2 className="chapter-title" style={{ fontSize: '72px' }}>Copilot.</h2>
          <p className="chapter-subtitle" style={{ maxWidth: 600 }}>
            Not just a chatbot. It's an intelligent assistant woven into the fabric of the platform, continuously analyzing your history to provide contextual guidance.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 8: PLATFORM ECOSYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterEcosystem = () => {
  return (
    <section className="apple-chapter light-chapter">
      <div className="chapter-container">
        <motion.h2 className="chapter-title dark-text" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          The Ecosystem.
        </motion.h2>
        <div className="bento-grid">
          <motion.div className="bento-box overview" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3>Overview</h3>
            <p>Your career dashboard.</p>
          </motion.div>
          <motion.div className="bento-box intelligence" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3>Intelligence</h3>
            <p>Engines that think.</p>
          </motion.div>
          <motion.div className="bento-box journey" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3>Journey</h3>
            <p>Mapping the future.</p>
          </motion.div>
          <motion.div className="bento-box tools" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h3>Tools</h3>
            <p>Resume Studio & Export.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 9: PRIVACY & TRUST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterPrivacy = () => {
  return (
    <section className="apple-chapter grey-chapter text-center">
      <div className="chapter-container">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <Shield size={64} color="#1d1d1f" style={{ margin: '0 auto 32px' }} />
          <h2 className="chapter-title dark-text" style={{ fontSize: '48px' }}>Privacy at the core.</h2>
        </motion.div>
        
        <div className="privacy-features">
          <motion.div className="p-feat" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Lock size={20} /> JWT Authentication
          </motion.div>
          <motion.div className="p-feat" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Cloud size={20} /> Encrypted Storage
          </motion.div>
          <motion.div className="p-feat" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Smartphone size={20} /> Device Sandboxing
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHAPTER 10: CTA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChapterCTA = () => {
  return (
    <section className="apple-chapter black-chapter cta-chapter text-center">
      <div className="chapter-container">
        <motion.h2 className="chapter-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Ready to own what's next?
        </motion.h2>
        
        <motion.div className="cta-grid" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Link to="/resume-intelligence" className="apple-btn-large primary">
            View Intelligence Report
          </Link>
          <Link to="/github-intelligence" className="apple-btn-large secondary">
            Analyze GitHub Profile
          </Link>
          <Link to="/resume-studio" className="apple-btn-large secondary">
            Create Resume
          </Link>
        </motion.div>
      </div>
      
      {/* Mini Footer */}
      <div className="apple-mini-footer">
        <p>© 2026 CareerOS. Developed as an AI Intelligence OS.</p>
      </div>
    </section>
  );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Home() {
  

  return (
    <div className="apple-home-wrapper">
      <style>{`
        /* Apple WWDC Architecture Styles */
        body {
          background: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .apple-home-wrapper {
          width: 100%;
          overflow-x: hidden;
        }

        .apple-chapter {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 24px;
          position: relative;
        }

        .chapter-container {
          max-width: 980px;
          width: 100%;
          z-index: 2;
          position: relative;
        }

        .dark-chapter { background: #000; color: #fff; }
        .black-chapter { background: #000; color: #fff; }
        .light-chapter { background: #fff; color: #1d1d1f; }
        .grey-chapter { background: #f5f5f7; color: #1d1d1f; }

        .dark-text { color: #1d1d1f !important; }

        /* Typography */
        .chapter-title {
          font-size: 80px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin-bottom: 24px;
        }

        .chapter-subtitle {
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #86868b;
          max-width: 700px;
        }

        /* Chapter 1: Flagship Hero */
        .hero-chapter-flagship {
          min-height: 80vh;
          height: auto;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding-top: 120px; /* Safe clearance from navbar */
          padding-bottom: 60px;
        }
        .hero-flagship-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 40px;
          padding: 0 72px;
          flex: 1;
          align-items: center;
        }
        
        /* LEFT COLUMN */
        .hero-flagship-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding-bottom: 20px;
        }
        .hero-flagship-announcement {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #1d1d1f;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0 20px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          margin-bottom: 32px;
          letter-spacing: 0.01em;
        }
        .hero-flagship-headline {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: clamp(64px, 8vw, 128px);
          font-weight: 700;
          letter-spacing: -0.06em;
          line-height: 0.88;
          color: #000000;
          margin-bottom: 32px;
        }
        .hero-flagship-subheadline {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 30px;
          font-weight: 400;
          line-height: 1.3;
          color: #6e6e73;
          max-width: 620px;
          margin-bottom: 40px;
        }
        .hero-flagship-engines {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #86868b;
          margin-bottom: 48px;
          max-width: 620px;
          line-height: 1.6;
        }
        .hero-flagship-engines .dot {
          color: #d2d2d7;
          margin: 0 4px;
        }
        
        .hero-flagship-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .hero-btn-flagship {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 58px;
          padding: 0 36px;
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 17px;
          font-weight: 600;
          border-radius: 999px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background 0.2s ease;
          border: none;
        }
        .hero-btn-flagship.primary { background: #000000; color: #ffffff; }
        .hero-btn-flagship.primary:hover { 
          transform: scale(1.02) translateY(-2px); 
          box-shadow: 0 12px 24px rgba(0,0,0,0.15); 
        }
        .hero-btn-flagship.secondary { background: transparent; color: #1d1d1f; border: 1px solid rgba(0,0,0,0.1); }
        .hero-btn-flagship.secondary:hover { background: #f5f5f7; transform: scale(1.02); }

        /* RIGHT COLUMN */
        .hero-flagship-right {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .intelligence-system {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          transform: translateY(-20px);
        }
        .is-node {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #86868b;
          letter-spacing: -0.01em;
        }
        .is-connector {
          width: 1px;
          height: 32px;
          background: rgba(0,0,0,0.06);
          margin: 12px 0;
          position: relative;
          overflow: hidden;
        }
        .pulse-dot {
          position: absolute;
          top: 0;
          left: -1px;
          width: 3px;
          height: 12px;
          background: #0071e3;
          border-radius: 4px;
        }
        .is-engine-node {
          width: 420px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-radius: 32px;
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 19px;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.02em;
          border: 1px solid rgba(0, 113, 227, 0.15);
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
          position: relative;
        }
        .is-engine-node::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 32px;
          box-shadow: 0 0 20px rgba(0, 113, 227, 0.1);
          z-index: -1;
          animation: enginePulse 4s ease-in-out infinite;
        }
        @keyframes enginePulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }

        .is-metrics-layer {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          width: 100%;
          max-width: 680px;
        }
        .is-metric-surface {
          width: 220px;
          height: 140px;
          background: #ffffff;
          padding: 24px;
          border-radius: 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          cursor: default;
        }
        .ism-label {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #86868b;
        }
        .ism-value {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #1d1d1f;
          letter-spacing: -0.02em;
        }

        /* TRUST LAYER */
        .hero-trust-layer {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 72px 80px;
          display: flex;
          flex-direction: column;
        }
        .trust-layer-title {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #1d1d1f;
          margin-bottom: 40px;
          letter-spacing: -0.03em;
        }
        .trust-layer-stats {
          display: flex;
          gap: 80px;
          flex-wrap: wrap;
        }
        .trust-stat {
          display: flex;
          flex-direction: column;
        }
        .ts-num {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 40px;
          font-weight: 700;
          color: #1d1d1f;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
        }
        .ts-label {
          font-family: "SF Pro Display", -apple-system, sans-serif;
          font-size: 17px;
          font-weight: 500;
          color: #86868b;
        }

        @media (max-width: 1024px) {
          .hero-chapter-flagship {
            height: auto;
            min-height: 100vh;
          }
          .hero-flagship-container {
            grid-template-columns: 1fr;
            padding: 0 32px;
            margin-top: 60px;
          }
          .hero-flagship-left {
            padding-bottom: 0;
          }
          .hero-flagship-headline {
            font-size: 64px;
          }
          .hero-flagship-subheadline {
            font-size: 22px;
          }
          .trust-layer-stats {
            gap: 32px;
          }
          .hero-trust-layer {
            padding: 40px 32px 80px;
          }
          .is-engine-node {
            width: 100%;
            max-width: 420px;
          }
        }
        @media (max-width: 768px) {
          .hero-flagship-headline {
            font-size: 48px;
          }
          .hero-flagship-subheadline {
            font-size: 18px;
          }
          .hero-flagship-container {
            padding: 0 24px;
          }
          .hero-trust-layer {
            padding: 40px 24px 80px;
          }
          .is-metric-surface {
            width: 100%;
          }
        }
        /* Chapter 2: Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 80px;
        }
        .metric-item {
          text-align: left;
        }
        .metric-value {
          font-size: 72px;
          font-weight: 600;
          letter-spacing: -0.04em;
          background: linear-gradient(90deg, #0071e3, #42a1f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }
        .metric-label {
          font-size: 20px;
          font-weight: 600;
          color: #f5f5f7;
        }

        /* Chapter 3: Engine */
        .engine-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 80px;
        }
        .flow-step {
          flex: 1;
          text-align: center;
          padding: 32px;
          border-radius: 24px;
        }
        .flow-step h3 { font-size: 24px; font-weight: 600; margin: 16px 0 8px; }
        .flow-step p { font-size: 16px; color: #86868b; }
        .flow-icon { margin: 0 auto; display: flex; justify-content: center; color: #1d1d1f;}
        .core-engine {
          background: #000;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          transform: scale(1.1);
        }
        .glow { filter: drop-shadow(0 0 20px rgba(0, 113, 227, 0.8)); }

        /* Chapter 4: Maturity */
        .glass-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 64px;
        }
        .glass-card {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .glass-card h3 { font-size: 24px; font-weight: 600; margin: 24px 0 12px; }
        .glass-card p { font-size: 16px; color: #86868b; line-height: 1.5; }

        /* Chapter 5: Journey */
        .timeline-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 100px;
          padding: 0 40px;
        }
        .timeline-point {
          flex: 1;
          text-align: center;
          position: relative;
        }
        .timeline-line {
          flex: 1;
          height: 2px;
          background: rgba(255,255,255,0.2);
          margin: 0 20px;
        }
        .point-dot {
          width: 20px; height: 20px;
          border-radius: 50%;
          margin: 0 auto 24px;
        }
        .current { background: #86868b; }
        .target { background: #0071e3; box-shadow: 0 0 20px #0071e3; }
        .future-dot { background: #fff; }
        .timeline-point h4 { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
        .timeline-point p { font-size: 14px; color: #86868b; }

        /* Chapter 6: Perspective */
        .perspective-metrics {
          display: flex;
          justify-content: center;
          gap: 80px;
          margin-top: 80px;
        }
        .p-metric h1 {
          font-size: 96px;
          font-weight: 700;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }
        .p-metric small { font-size: 48px; }
        .p-metric span {
          font-size: 20px;
          font-weight: 600;
          color: #86868b;
        }

        /* Chapter 7: Copilot */
        .copilot-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .copilot-glow {
          position: absolute;
          top: 50%; left: 50%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(142,68,173,0.4) 0%, rgba(0,0,0,0) 70%);
          transform: translate(-50%, -50%);
          z-index: 1;
          border-radius: 50%;
        }

        /* Chapter 8: Ecosystem */
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 64px;
        }
        .bento-box {
          background: #f5f5f7;
          border-radius: 32px;
          padding: 48px;
          min-height: 280px;
        }
        .bento-box h3 { font-size: 32px; font-weight: 600; margin-bottom: 12px; }
        .bento-box p { font-size: 20px; color: #86868b; }

        /* Chapter 9: Privacy */
        .privacy-features {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 64px;
        }
        .p-feat {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          color: #1d1d1f;
        }

        /* Chapter 10: CTA */
        .cta-grid {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 64px;
        }
        .apple-btn-large {
          padding: 20px 40px;
          border-radius: 40px;
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .apple-btn-large:hover { transform: scale(1.02); }
        .apple-btn-large.primary {
          background: #fff;
          color: #000;
        }
        .apple-btn-large.secondary {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .apple-mini-footer {
          position: absolute;
          bottom: 40px;
          width: 100%;
          text-align: center;
          color: #86868b;
          font-size: 12px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .chapter-title { font-size: 56px; }
          .hero-headline { font-size: 72px; }
          .metrics-grid, .glass-grid, .perspective-metrics { flex-direction: column; display: flex; gap: 40px; }
          .engine-flow { flex-direction: column; gap: 40px; }
          .flow-arrow { transform: rotate(90deg); }
          .timeline-container { flex-direction: column; gap: 40px; align-items: flex-start; }
          .timeline-line { width: 2px; height: 40px; margin: 10px 9px; }
          .cta-grid { flex-direction: column; }
        }
      `}</style>

      <ChapterHero />
      <ChapterIntelligence />
      <ChapterEngine />
      <ChapterMaturity />
      <ChapterJourney />
      <ChapterPerspective />
      <ChapterCopilot />
      <ChapterEcosystem />
      <ChapterPrivacy />
      <ChapterCTA />
    </div>
  );
}
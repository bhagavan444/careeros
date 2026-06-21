import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { EnterpriseFooter as AppleFooter } from "./HomeComponents";
import { ArrowUpRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// PRESERVED EMAILJS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
const EMAILJS_SERVICE_ID = "service_8pg8cek";
const EMAILJS_NOTIFICATION_TEMPLATE_ID = "template_8v4b864";
const EMAILJS_AUTOREPLY_TEMPLATE_ID = "template_bdwrdmc";
const EMAILJS_PUBLIC_KEY = "GOTwySQukEpQEuRa5";

const appleEase = [0.16, 1, 0.3, 1];

const styles = {
  h1: { fontSize: "clamp(4rem, 8vw, 8rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05 },
  h2: { fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 },
  p: { fontSize: "clamp(1.2rem, 2vw, 1.7rem)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.5, color: "#86868b" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 20px", fontSize: 17, color: "#f5f5f7", outline: "none", transition: "all 0.3s ease", boxSizing: "border-box" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }
};

export default function Connect() {
  // PRESERVED EMAILJS STATE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle');

  // PRESERVED EMAILJS LOGIC
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const templateParams = {
      name: formData.name,
      email: formData.email,
      company: formData.company || 'Not Provided',
      subject: formData.subject,
      message: formData.message,
      portfolio_link: window.location.origin,
      linkedin_link: "https://www.linkedin.com/in/gsssbhagavan/",
      github_link: "https://github.com/bhagavan444"
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_NOTIFICATION_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_AUTOREPLY_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", overflow: "hidden" }}>
      
      {/* Toast Notifications */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} style={{ position: "fixed", top: 120, left: "50%", zIndex: 9999, background: "#1d1d1f", color: "#f5f5f7", padding: "16px 24px", borderRadius: 100, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <CheckCircle2 color="#34c759" size={20} />
            <span style={{ fontSize: 15, fontWeight: 500 }}>Conversation initiated. We will respond shortly.</span>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} style={{ position: "fixed", top: 120, left: "50%", zIndex: 9999, background: "#1d1d1f", color: "#f5f5f7", padding: "16px 24px", borderRadius: 100, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <XCircle color="#ff3b30" size={20} />
            <span style={{ fontSize: 15, fontWeight: 500 }}>Something went wrong. Try again.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter 1: Conversation Hero */}
      <section style={{ padding: "120px 24px 120px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: appleEase }}>
          <h1 style={{ ...styles.h1, color: "#1d1d1f", marginBottom: 32 }}>
            Let's build<br/>what's next.
          </h1>
          <p style={{ ...styles.p, maxWidth: 700, margin: "0 auto" }}>
            Whether you're exploring CareerOS, discussing career intelligence, or interested in the future of professional growth, we'd love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Chapter 2: Why Reach Out */}
      <section style={{ padding: "0 24px 160px", background: "#f5f5f7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", transform: "translateY(-80px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {[
              { title: "Career Intelligence", desc: "Discuss how our models evaluate engineering maturity and provide objective insights into professional readiness." },
              { title: "Product & Platform", desc: "Explore deep integration with your existing workflow, customized AI career copilots, and architecture." },
              { title: "Partnerships & Opportunities", desc: "Collaborate on expanding the boundaries of how software engineers track, analyze, and accelerate their careers." }
            ].map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: i * 0.15, ease: appleEase }}
                style={{ background: "#ffffff", padding: "48px 40px", borderRadius: 32, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
              >
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f", marginBottom: 16 }}>{card.title}</h3>
                <p style={{ fontSize: 17, lineHeight: 1.5, color: "#86868b", fontWeight: 500 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 3: The Conversation Portal */}
      <section style={{ padding: "120px 24px 160px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="portal-grid">
            
            {/* Left: Narrative Context */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: appleEase }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0071e3", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>The Portal</div>
              <h2 style={{ ...styles.h2, color: "#1d1d1f", marginBottom: 32 }}>
                Begin the dialogue.
              </h2>
              <p style={{ ...styles.p, marginBottom: 40 }}>
                Submit your inquiry directly to our engineering and product teams. We review every conversation meticulously.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <CheckCircle2 color="#0071e3" size={24} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: 19, fontWeight: 600, color: "#1d1d1f", marginBottom: 4 }}>Direct Routing</h4>
                    <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.5, fontWeight: 500 }}>Your message bypasses standard queues and goes directly to the relevant architectural team.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <CheckCircle2 color="#0071e3" size={24} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: 19, fontWeight: 600, color: "#1d1d1f", marginBottom: 4 }}>Rapid Response</h4>
                    <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.5, fontWeight: 500 }}>Expect a comprehensive technical or strategic response within 24 to 48 hours.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Frosted Form */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, margin: "-100px" }} 
              transition={{ duration: 1.2, delay: 0.2, ease: appleEase }}
              style={{ background: "#1d1d1f", borderRadius: 40, padding: "56px 48px", boxShadow: "0 40px 80px rgba(0,0,0,0.15)", color: "#f5f5f7" }}
            >
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="form-row-grid">
                  <div>
                    <label style={styles.label}>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} placeholder="Steve Jobs" />
                  </div>
                  <div>
                    <label style={styles.label}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} placeholder="steve@apple.com" />
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="form-row-grid">
                  <div>
                    <label style={styles.label}>Company (Optional)</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} style={styles.input} placeholder="Apple Inc." />
                  </div>
                  <div>
                    <label style={styles.label}>Topic</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required style={{...styles.input, appearance: "none"}}>
                      <option value="" disabled style={{color: "rgba(255,255,255,0.3)"}}>Select topic...</option>
                      <option value="Integration">Integration</option>
                      <option value="Intelligence Architecture">Intelligence Architecture</option>
                      <option value="Career Advisory">Career Advisory</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required style={{...styles.input, minHeight: 140, resize: "vertical"}} placeholder="How can we help?" />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    style={{ 
                      background: status === 'loading' ? "rgba(255,255,255,0.1)" : "#0071e3", 
                      color: status === 'loading' ? "#86868b" : "#fff", 
                      border: "none", 
                      borderRadius: 100, 
                      padding: "16px 40px", 
                      fontSize: 17, 
                      fontWeight: 600, 
                      cursor: status === 'loading' ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "background 0.3s ease, color 0.3s ease"
                    }}
                  >
                    {status === 'loading' ? (
                      <><Loader2 size={18} className="lucide-spin" /> Transmitting...</>
                    ) : (
                      "Initiate Conversation"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Chapter 4: The Network */}
      <section style={{ padding: "160px 24px", background: "#f5f5f7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: appleEase }}>
            <h2 style={{ ...styles.h2, color: "#1d1d1f", marginBottom: 80, textAlign: "center" }}>
              The broader ecosystem.
            </h2>
          </motion.div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {[
              { label: "Professional Presence", title: "LinkedIn", link: "https://www.linkedin.com/in/gsssbhagavan/" },
              { label: "Engineering Portfolio", title: "GitHub", link: "https://github.com/bhagavan444" },
              { label: "Career Journey", title: "Resume", link: "/Siva_Bhagavan_Resume.pdf" }
            ].map((channel, i) => (
              <motion.a 
                key={i} 
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ duration: 0.8, delay: i * 0.15, ease: appleEase }}
                style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#ffffff", 
                  padding: "56px 48px", 
                  borderRadius: 32, 
                  textDecoration: "none",
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  minHeight: 280
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#a1a1a6", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {channel.label}
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>{channel.title}</div>
                    <ArrowUpRight size={32} color="#0071e3" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 5: The Philosophy */}
      <section style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", background: "#000000", color: "#f5f5f7" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: appleEase }}>
          <div style={{ fontSize: "clamp(3rem, 6vw, 6.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: 1200 }}>
            Great careers begin with<br/>
            <span style={{ color: "#a1a1a6" }}>great conversations.</span>
          </div>
        </motion.div>
      </section>

      <AppleFooter />
      
      {/* Required style for lucide-spin animation & responsive adjustments */}
      <style>{`
        .lucide-spin {
          animation: lucide-spin 2s linear infinite;
        }
        @keyframes lucide-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input:focus, textarea:focus, select:focus {
          border-color: #0071e3 !important;
          background: rgba(255,255,255,0.1) !important;
        }
        @media (max-width: 900px) {
          .portal-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .form-row-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

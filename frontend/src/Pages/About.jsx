import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { EnterpriseFooter as AppleFooter } from "./HomeComponents";

const appleEase = [0.16, 1, 0.3, 1];

const styles = {
  h1: { fontSize: "clamp(4rem, 8vw, 8rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05 },
  h2: { fontSize: "clamp(3rem, 5vw, 5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05 },
  p: { fontSize: "clamp(1.2rem, 2vw, 1.7rem)", fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.5, color: "#86868b" },
};

export default function About() {
  

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", overflow: "hidden" }}>
      
      {/* Chapter 1: The Vision */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "120px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: appleEase }}>
          <h1 style={{ ...styles.h1, color: "#1d1d1f", marginBottom: 24, maxWidth: 1000 }}>
            Careers deserve clarity.
          </h1>
          <p style={{ ...styles.p, maxWidth: 800, margin: "0 auto", color: "#86868b" }}>
            For decades, people have made career decisions with incomplete information. <br/><span style={{color: "#1d1d1f", fontWeight: 600}}>CareerOS changes that.</span>
          </p>
        </motion.div>
      </section>

      {/* Chapter 2: The Problem */}
      <section style={{ background: "#000000", padding: "200px 24px", color: "#f5f5f7", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 60 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: appleEase }}>
            <h2 style={{ ...styles.h2, color: "#f5f5f7", marginBottom: 40, maxWidth: 800 }}>
              Operating in the dark.
            </h2>
            <p style={{ ...styles.p, color: "#a1a1a6", maxWidth: 900, marginBottom: 60 }}>
              The reality is, most talented people don't know how they compare. They don't know where they truly stand in the market. They don't know which skills actually matter. And they don't know what is holding them back.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chapter 3: The Missing Intelligence Layer */}
      <section style={{ padding: "200px 24px", background: "#f5f5f7" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: appleEase }}>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, color: "#86868b", marginBottom: 40 }}>
              The world has operating systems for devices.<br/>
              The world has operating systems for businesses.<br/>
              <span style={{ color: "#1d1d1f" }}>But careers still lack an intelligence layer.</span>
            </h2>
            <p style={{ ...styles.p, color: "#0071e3", fontWeight: 600, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Until now.</p>
          </motion.div>
        </div>
      </section>

      {/* Chapter 4: The Career Intelligence Engine */}
      <section style={{ padding: "200px 24px", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", marginBottom: 120 }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: appleEase }} style={{ ...styles.h2, color: "#1d1d1f" }}>
            The Intelligence Engine.
          </motion.h2>
        </div>

        {/* Massive SVG Data Flow Centerpiece */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true, margin: "-200px" }} 
          transition={{ duration: 1.5, ease: appleEase }}
          style={{ width: "100%", maxWidth: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}
        >
          {/* Top Level: Inputs */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {["Skills", "Projects", "Experience", "GitHub", "Market Signals"].map((item, i) => (
              <div key={i} style={{ padding: "16px 32px", background: "#f5f5f7", borderRadius: 100, fontSize: 17, fontWeight: 600, color: "#1d1d1f" }}>
                {item}
              </div>
            ))}
          </div>

          {/* Flow Lines */}
          <svg width="200" height="120" viewBox="0 0 200 120" style={{ overflow: "visible" }}>
            <motion.path d="M 100 0 L 100 120" stroke="#0071e3" strokeWidth="3" strokeDasharray="6 6" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5, ease: "linear" }} />
          </svg>

          {/* The Engine Node */}
          <div style={{ padding: "60px 80px", background: "linear-gradient(135deg, #1d1d1f, #434347)", borderRadius: 40, color: "white", boxShadow: "0 30px 60px rgba(0,0,0,0.15)", textAlign: "center" }}>
            <h3 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>CareerOS</h3>
            <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a1a1a6" }}>Intelligence Engine</div>
          </div>

          {/* Flow Lines Out */}
          <svg width="800" height="120" viewBox="0 0 800 120" style={{ overflow: "visible" }}>
            <motion.path d="M 400 0 L 400 60 L 150 60 L 150 120" stroke="#0071e3" strokeWidth="3" strokeDasharray="6 6" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1, ease: "linear" }} />
            <motion.path d="M 400 0 L 400 120" stroke="#0071e3" strokeWidth="3" strokeDasharray="6 6" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1, ease: "linear" }} />
            <motion.path d="M 400 0 L 400 60 L 650 60 L 650 120" stroke="#0071e3" strokeWidth="3" strokeDasharray="6 6" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 1, ease: "linear" }} />
          </svg>

          {/* Bottom Level: Outputs */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 1000 }}>
            {["Career Readiness", "Engineering Maturity", "Recruiter Trust"].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1.5 + (i * 0.2), ease: appleEase }} style={{ flex: 1, minWidth: 250, padding: "40px 32px", background: "#f5f5f7", borderRadius: 32, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f" }}>{item}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Chapter 5: Growth Over Time */}
      <section style={{ padding: "240px 24px", background: "#1d1d1f", color: "#f5f5f7" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: appleEase }} style={{ ...styles.h2, color: "#f5f5f7", marginBottom: 32 }}>
            A living system.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease: appleEase }} style={{ ...styles.p, color: "#a1a1a6", marginBottom: 160 }}>
            CareerOS is not a static report. It evolves continuously with you.
          </motion.p>

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", maxWidth: 900, margin: "0 auto" }}>
            <div style={{ position: "absolute", top: 32, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.1)" }} />
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 2.5, ease: "easeInOut" }} style={{ position: "absolute", top: 32, left: 0, height: 2, background: "#0071e3" }} />
            
            {[
              { label: "Today", desc: "Baseline" },
              { label: "30 Days", desc: "Trajectory" },
              { label: "90 Days", desc: "Momentum" },
              { label: "1 Year", desc: "Transformation" }
            ].map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.6, ease: appleEase }} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#1d1d1f", border: "2px solid #0071e3", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 24 }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#0071e3" }} />
                </div>
                <div style={{ fontSize: 21, fontWeight: 700, color: "#f5f5f7", marginBottom: 8 }}>{node.label}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#a1a1a6", letterSpacing: "0.1em", textTransform: "uppercase" }}>{node.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter 6: The Future */}
      <section style={{ padding: "240px 24px", background: "#ffffff", textAlign: "center" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: appleEase }}>
            <h2 style={{ ...styles.h2, color: "#1d1d1f", marginBottom: 40 }}>
              A future where every professional understands their potential.
            </h2>
            <p style={{ ...styles.p, maxWidth: 800, margin: "0 auto" }}>
              We're building an ecosystem where guesswork is replaced by data, anxiety is replaced by clarity, and potential is actively engineered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chapter 7: Final Manifesto */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 24px", background: "#000000", color: "#f5f5f7" }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: appleEase }}>
          <div style={{ fontSize: "clamp(3rem, 6vw, 6.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 80, maxWidth: 1200 }}>
            Growth begins with understanding.<br/>
            <span style={{ color: "#a1a1a6" }}>Intelligence creates confidence.</span><br/>
            <span style={{ color: "#0071e3" }}>The future belongs to informed professionals.</span>
          </div>
        </motion.div>
      </section>

      <AppleFooter />
    </div>
  );
}
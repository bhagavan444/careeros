import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      scale: 2.5,
      mixBlendMode: "difference",
    },
  };

  return (
    <>
      {/* Custom Cursor */}
      <motion.div
        className="custom-cursor"
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          position: "fixed",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          backgroundColor: "#0066FF",
          pointerEvents: "none",
          zIndex: 10000,
          mixBlendMode: cursorVariant === "hover" ? "difference" : "normal",
        }}
      />

      <div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          backgroundColor: "#FAFAFA",
          color: "#0A0A0A",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          cursor: "none",
        }}
      >
        {/* Hero Section */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "100px 40px 120px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                backgroundColor: "#F0F0F0",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.05em",
                color: "#666",
                marginBottom: "32px",
                textTransform: "uppercase",
              }}
            >
              Enterprise Career Intelligence
            </div>

            <h1
              style={{
                fontSize: "72px",
                fontWeight: "400",
                lineHeight: "1.1",
                letterSpacing: "0.02em",
                marginBottom: "32px",
                maxWidth: "900px",
                fontFamily: "'Pacifico', cursive",
              }}
            >
              AI-powered career infrastructure for modern organizations
            </h1>

            <p
              style={{
                fontSize: "20px",
                lineHeight: "1.6",
                color: "#666",
                maxWidth: "700px",
                marginBottom: "48px",
              }}
            >
              PathNex AI transforms fragmented career planning into quantified readiness
              indicators through advanced natural language processing and skills intelligence.
            </p>

            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "View Documentation", primary: true },
                { label: "Contact Sales", primary: false },
              ].map((button) => (
                <motion.button
                  key={button.label}
                  style={{
                    padding: "14px 28px",
                    fontSize: "15px",
                    fontWeight: "600",
                    backgroundColor: button.primary ? "#0066FF" : "transparent",
                    color: button.primary ? "#FFFFFF" : "#0A0A0A",
                    border: button.primary ? "none" : "1px solid #E5E5E5",
                    borderRadius: "8px",
                    cursor: "none",
                    transition: "all 0.2s",
                  }}
                  whileHover={{
                    backgroundColor: button.primary ? "#0052CC" : "#F5F5F5",
                  }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  {button.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Trust Metrics */}
        <section
          style={{
            borderTop: "1px solid #E5E5E5",
            borderBottom: "1px solid #E5E5E5",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "80px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "60px",
            }}
          >
            {[
              { metric: "98.7%", label: "ATS Compatibility Rate" },
              { metric: "15ms", label: "Avg. Analysis Latency" },
              { metric: "200K+", label: "Skills Mapped Monthly" },
              { metric: "SOC 2", label: "Type II Certified" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: "700",
                    letterSpacing: "-0.02em",
                    marginBottom: "8px",
                    color: "#0A0A0A",
                  }}
                >
                  {item.metric}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Problem Statement */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "120px 40px",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.1em",
                color: "#0066FF",
                marginBottom: "24px",
                textTransform: "uppercase",
              }}
            >
              The Challenge
            </div>

            <h2
              style={{
                fontSize: "48px",
                fontWeight: "400",
                lineHeight: "1.2",
                letterSpacing: "0.02em",
                marginBottom: "40px",
                maxWidth: "800px",
                fontFamily: "'Pacifico', cursive",
              }}
            >
              Career planning infrastructure is fundamentally broken
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "40px",
                marginTop: "60px",
              }}
            >
              {[
                {
                  stat: "73%",
                  desc: "of organizations lack structured career development frameworks",
                },
                {
                  stat: "6.2hrs",
                  desc: "average time spent per resume review without automation",
                },
                {
                  stat: "$4.2B",
                  desc: "annual cost of skill misalignment in US tech sector alone",
                },
                {
                  stat: "41%",
                  desc: "of professionals report unclear career progression paths",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "32px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    borderRadius: "12px",
                  }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      letterSpacing: "-0.02em",
                      marginBottom: "12px",
                      color: "#0066FF",
                    }}
                  >
                    {item.stat}
                  </div>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.6",
                      color: "#666",
                    }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Solution Framework */}
        <section
          style={{
            backgroundColor: "#0A0A0A",
            color: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "120px 40px",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  color: "#0066FF",
                  marginBottom: "24px",
                  textTransform: "uppercase",
                }}
              >
                Our Approach
              </div>

              <h2
                style={{
                  fontSize: "48px",
                  fontWeight: "400",
                  lineHeight: "1.2",
                  letterSpacing: "0.02em",
                  marginBottom: "24px",
                  maxWidth: "800px",
                  fontFamily: "'Pacifico', cursive",
                }}
              >
                Enterprise-grade career intelligence infrastructure
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "#999",
                  maxWidth: "700px",
                  marginBottom: "80px",
                }}
              >
                Built on production-scale NLP pipelines and multi-domain skills taxonomy
                with real-time ATS alignment scoring.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "2px",
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #1A1A1A",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {[
                  {
                    title: "Resume Intelligence",
                    desc: "NLP-powered skill extraction with contextual weighting. Parses unstructured data into structured competency graphs.",
                    features: ["Multi-format parsing", "ATS keyword mapping", "Confidence scoring"],
                  },
                  {
                    title: "Skills Graph Engine",
                    desc: "Proprietary taxonomy covering 12,000+ technical and soft skills with relationship mapping.",
                    features: ["Domain-specific clusters", "Prerequisite chains", "Market demand signals"],
                  },
                  {
                    title: "Readiness Analytics",
                    desc: "Quantified career readiness indicators aligned with industry hiring standards and role requirements.",
                    features: ["Gap analysis", "Learning pathways", "Timeline projections"],
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    style={{
                      padding: "40px",
                      backgroundColor: "#0A0A0A",
                    }}
                    onMouseEnter={() => setCursorVariant("hover")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        marginBottom: "16px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "#999",
                        marginBottom: "24px",
                      }}
                    >
                      {item.desc}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {item.features.map((feature, j) => (
                        <div
                          key={j}
                          style={{
                            fontSize: "13px",
                            color: "#666",
                            paddingLeft: "16px",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "#0066FF",
                            }}
                          >
                            →
                          </span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Architecture */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "120px 40px",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.1em",
                color: "#0066FF",
                marginBottom: "24px",
                textTransform: "uppercase",
              }}
            >
              Technical Infrastructure
            </div>

            <h2
              style={{
                fontSize: "48px",
                fontWeight: "400",
                lineHeight: "1.2",
                letterSpacing: "0.02em",
                marginBottom: "60px",
                fontFamily: "'Pacifico', cursive",
              }}
            >
              Built for scale and reliability
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "40px",
              }}
            >
              {[
                {
                  layer: "Frontend",
                  stack: ["React 18", "Framer Motion", "WebSocket Client"],
                  description: "Type-safe component architecture with real-time state sync",
                },
                {
                  layer: "API Layer",
                  stack: ["Flask", "RESTful Design", "JSON Schema Validation"],
                  description: "Stateless microservices with OpenAPI documentation",
                },
                {
                  layer: "AI Pipeline",
                  stack: ["spaCy NLP", "Custom Transformers", "Vector Embeddings"],
                  description: "Multi-stage processing with skill entity recognition",
                },
                {
                  layer: "Data Infrastructure",
                  stack: ["PostgreSQL", "Redis Cache", "S3 Storage"],
                  description: "Normalized schema with hot-path optimization",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "32px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E5E5",
                    borderRadius: "12px",
                  }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "0.05em",
                      color: "#0066FF",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.layer}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: "13px",
                          padding: "4px 10px",
                          backgroundColor: "#F5F5F5",
                          color: "#666",
                          borderRadius: "4px",
                          fontWeight: "500",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "#666",
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Architecture Diagram */}
            <div
              style={{
                marginTop: "80px",
                padding: "60px",
                backgroundColor: "#FAFAFA",
                border: "1px solid #E5E5E5",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {["Client Layer", "API Gateway", "Processing Engine", "Data Layer"].map(
                  (layer, i) => (
                    <React.Fragment key={layer}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                          textAlign: "center",
                          padding: "24px 32px",
                          backgroundColor: "#FFFFFF",
                          border: "2px solid #E5E5E5",
                          borderRadius: "8px",
                          minWidth: "140px",
                        }}
                        onMouseEnter={() => setCursorVariant("hover")}
                        onMouseLeave={() => setCursorVariant("default")}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#0A0A0A",
                          }}
                        >
                          {layer}
                        </div>
                      </motion.div>
                      {i < 3 && (
                        <div
                          style={{
                            width: "60px",
                            height: "2px",
                            backgroundColor: "#E5E5E5",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              right: "-6px",
                              top: "-4px",
                              width: "0",
                              height: "0",
                              borderTop: "5px solid transparent",
                              borderBottom: "5px solid transparent",
                              borderLeft: "8px solid #E5E5E5",
                            }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Roadmap */}
        <section
          style={{
            backgroundColor: "#F5F5F5",
            borderTop: "1px solid #E5E5E5",
            borderBottom: "1px solid #E5E5E5",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "120px 40px",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  color: "#0066FF",
                  marginBottom: "24px",
                  textTransform: "uppercase",
                }}
              >
                Product Roadmap
              </div>

              <h2
                style={{
                  fontSize: "48px",
                  fontWeight: "400",
                  lineHeight: "1.2",
                  letterSpacing: "0.02em",
                  marginBottom: "80px",
                  fontFamily: "'Pacifico', cursive",
                }}
              >
                Continuous innovation pipeline
              </h2>

              <div style={{ display: "grid", gap: "1px", backgroundColor: "#E5E5E5" }}>
                {[
                  {
                    quarter: "Q2 2026",
                    status: "In Development",
                    items: [
                      "Multi-language resume parsing (Spanish, Mandarin, Hindi)",
                      "Real-time collaborative skill mapping",
                      "Enhanced security: E2EE for sensitive data",
                    ],
                  },
                  {
                    quarter: "Q3 2026",
                    status: "Planned",
                    items: [
                      "Role-specific interview simulation engine",
                      "Integration with major ATS platforms (Greenhouse, Lever)",
                      "Career trajectory forecasting models",
                    ],
                  },
                  {
                    quarter: "Q4 2026",
                    status: "Research",
                    items: [
                      "Personalized learning pathway generator",
                      "Team composition and skill diversity analytics",
                      "Industry benchmark comparison dashboard",
                    ],
                  },
                ].map((phase, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: "40px",
                      backgroundColor: "#FFFFFF",
                      display: "grid",
                      gridTemplateColumns: "200px 1fr",
                      gap: "40px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          letterSpacing: "-0.01em",
                          marginBottom: "8px",
                        }}
                      >
                        {phase.quarter}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#0066FF",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {phase.status}
                      </div>
                    </div>
                    <div>
                      {phase.items.map((item, j) => (
                        <div
                          key={j}
                          style={{
                            fontSize: "15px",
                            lineHeight: "1.6",
                            color: "#666",
                            marginBottom: j < phase.items.length - 1 ? "12px" : 0,
                            paddingLeft: "20px",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "#0A0A0A",
                              fontWeight: "600",
                            }}
                          >
                            •
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founder Section */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "120px 40px",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  color: "#0066FF",
                  marginBottom: "24px",
                  textTransform: "uppercase",
                }}
              >
                Founded By
              </div>

              <h2
                style={{
                  fontSize: "48px",
                  fontWeight: "400",
                  lineHeight: "1.2",
                  letterSpacing: "0.02em",
                  marginBottom: "24px",
                  fontFamily: "'Pacifico', cursive",
                }}
              >
                G S S S Bhagavan
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.7",
                  color: "#666",
                  marginBottom: "24px",
                }}
              >
                Built PathNex AI to solve the systemic inefficiency in career infrastructure
                through structured decision-support systems and quantifiable readiness metrics.
              </p>

              <div
                style={{
                  padding: "24px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "8px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "16px",
                  }}
                >
                  <strong style={{ color: "#0A0A0A" }}>Background:</strong> Full-stack
                  development, NLP systems, product design
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  <strong style={{ color: "#0A0A0A" }}>Focus:</strong> Enterprise AI
                  infrastructure, career intelligence platforms
                </div>
              </div>

              <blockquote
                style={{
                  fontSize: "15px",
                  fontStyle: "italic",
                  color: "#666",
                  borderLeft: "3px solid #0066FF",
                  paddingLeft: "20px",
                  margin: "32px 0",
                }}
              >
                "Career decisions shouldn't be guesswork. We're building the infrastructure
                to make career planning as data-driven as financial planning."
              </blockquote>
            </div>

            <div
              style={{
                padding: "60px",
                backgroundColor: "#0A0A0A",
                borderRadius: "12px",
                color: "#FFFFFF",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0066FF",
                  marginBottom: "24px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Technical Expertise
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  "React & Modern JavaScript Ecosystem",
                  "Flask & Python Backend Systems",
                  "NLP & Machine Learning Pipelines",
                  "Enterprise UX & Design Systems",
                  "ATS & Hiring System Architecture",
                ].map((skill, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "15px",
                      color: "#CCC",
                      paddingLeft: "20px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: "#0066FF",
                      }}
                    >
                      →
                    </span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            backgroundColor: "#0A0A0A",
            color: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "120px 40px",
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2
                style={{
                  fontSize: "56px",
                  fontWeight: "400",
                  lineHeight: "1.2",
                  letterSpacing: "0.02em",
                  marginBottom: "24px",
                  fontFamily: "'Pacifico', cursive",
                }}
              >
                Ready to transform your career infrastructure?
              </h2>

              <p
                style={{
                  fontSize: "18px",
                  color: "#999",
                  marginBottom: "48px",
                  maxWidth: "600px",
                  margin: "0 auto 48px",
                }}
              >
                Join organizations building data-driven career development programs with
                PathNex AI.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                }}
              >
                <motion.button
                  style={{
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "#0066FF",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "none",
                  }}
                  whileHover={{ backgroundColor: "#0052CC" }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  Schedule Demo
                </motion.button>

                <motion.button
                  style={{
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "transparent",
                    color: "#FFFFFF",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    cursor: "none",
                  }}
                  whileHover={{ backgroundColor: "#1A1A1A" }}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  View Documentation
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid #E5E5E5",
            backgroundColor: "#FAFAFA",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "60px 40px",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "60px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  marginBottom: "16px",
                  letterSpacing: "0.01em",
                  fontFamily: "'Pacifico', cursive",
                }}
              >
                PathNex AI
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  lineHeight: "1.6",
                  maxWidth: "280px",
                }}
              >
                Enterprise career intelligence infrastructure built for modern organizations.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Documentation", "API"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Compliance"],
              },
            ].map((section) => (
              <div key={section.title}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    marginBottom: "16px",
                    color: "#0A0A0A",
                    textTransform: "uppercase",
                  }}
                >
                  {section.title}
                </div>
                {section.links.map((link) => (
                  <div
                    key={link}
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "12px",
                      cursor: "none",
                    }}
                    onMouseEnter={(e) => {
                      setCursorVariant("hover");
                      e.target.style.color = "#0A0A0A";
                    }}
                    onMouseLeave={(e) => {
                      setCursorVariant("default");
                      e.target.style.color = "#666";
                    }}
                  >
                    {link}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid #E5E5E5",
              padding: "24px 40px",
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "13px", color: "#999" }}>
              © {new Date().getFullYear()} PathNex AI. All rights reserved.
            </div>
            <div style={{ fontSize: "13px", color: "#999" }}>
              SOC 2 Type II Certified • ISO 27001 Compliant
            </div>
          </div>
        </footer>

        {/* Global Styles */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

          * {
            cursor: none !important;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          @media (max-width: 768px) {
            * {
              cursor: auto !important;
            }
            .custom-cursor {
              display: none;
            }
          }

          button {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}</style>
      </div>
    </>
  );
}

export default About;
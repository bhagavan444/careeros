import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ================================
 * ENTERPRISE PRICING – Plans.jsx
 * ================================
 * Production-grade SaaS pricing
 * Stripe-level polish + Magnetic cursor + Cursive headings
 */

const BASE_PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    badge: "Starter",
    short: "Essential features to get started with AI career intelligence.",
    features: [
      "Unlimited basic conversations",
      "General AI responses",
      "No account required",
      "Secure & private",
      "Mobile & desktop access",
    ],
    disabledFeatures: [
      "Advanced AI models",
      "Chat history",
      "Extended usage limits",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 12,
    yearly: 120,
    badge: "Most Popular",
    short: "Advanced intelligence for serious career growth.",
    features: [
      "Latest AI models",
      "Resume & ATS analysis",
      "Saved chat history",
      "Document Q&A (PDF, DOC)",
      "Career roadmaps",
      "Priority support",
    ],
    disabledFeatures: ["Team collaboration", "Enterprise API"],
    cta: "Start 7-Day Trial",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 24,
    yearly: 240,
    badge: "Enterprise",
    short: "For institutions, teams, and advanced users.",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "API access",
      "Analytics dashboard",
      "Bulk resume processing",
      "Dedicated support",
    ],
    disabledFeatures: [],
    cta: "Contact Sales",
    featured: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Ananya R.",
    role: "Data Scientist",
    text:
      "PathNex gave me clarity on my resume gaps. I landed interviews within a week.",
  },
  {
    name: "Rohit K.",
    role: "Software Engineer",
    text:
      "The career roadmap and ATS score felt exactly like MNC hiring standards.",
  },
  {
    name: "Maya S.",
    role: "UI/UX Designer",
    text: "Clean UI, clear insights, and actually useful recommendations.",
  },
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly plans can be cancelled anytime. Yearly plans remain active until the billing cycle ends.",
  },
  {
    q: "Is resume data secure?",
    a: "Yes. Files are processed securely and not shared externally.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes. Eligible students can request discounts via support.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and enterprise invoicing.",
  },
];

export default function Plans() {
  const navigate = useNavigate();

  const [billing, setBilling] = useState("monthly");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [testIndex, setTestIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  
  const timer = useRef(null);

  // Testimonials carousel
  useEffect(() => {
    timer.current = setInterval(() => {
      setTestIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, []);

  // Magnetic cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const price = (plan) => {
    const base = billing === "monthly" ? plan.monthly : plan.yearly;
    if (promoApplied === "SAVE20") return Math.round(base * 0.8);
    if (promoApplied === "HALFOFF") return Math.round(base * 0.5);
    return base;
  };

  const savings = (plan) => {
    if (billing === "yearly") {
      return Math.round(plan.monthly * 12 - plan.yearly);
    }
    return 0;
  };

  const applyPromo = () => {
    const code = promo.toUpperCase().trim();
    if (["SAVE20", "HALFOFF", "TRIAL"].includes(code)) {
      setPromoApplied(code);
    } else {
      alert("Invalid promo code");
    }
  };

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    if (plan.id === "free") {
      navigate("/");
    } else {
      setShowModal(true);
    }
  };

  const handleCheckout = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert(`Subscription confirmed for ${selectedPlan.name} plan (mock)`);
    setShowModal(false);
    setEmail("");
  };

  return (
    <>
      {/* MAGNETIC CURSOR */}
      <div
        style={{
          ...styles.cursor,
          left: cursorPos.x,
          top: cursorPos.y,
          transform: `translate(-50%, -50%) scale(${
            cursorVariant === "hover" ? 1.5 : 1
          })`,
        }}
      />

      <main style={styles.main}>
        {/* HERO SECTION */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Transparent Pricing for{" "}
              <span style={styles.heroAccent}>Intelligent Growth</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Flexible plans for individuals, professionals, and institutions
            </p>

            {/* BILLING TOGGLE */}
            <div style={styles.billingToggle}>
              <button
                style={{
                  ...styles.toggleBtn,
                  ...(billing === "monthly" ? styles.toggleBtnActive : {}),
                }}
                onClick={() => setBilling("monthly")}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Monthly
              </button>
              <button
                style={{
                  ...styles.toggleBtn,
                  ...(billing === "yearly" ? styles.toggleBtnActive : {}),
                }}
                onClick={() => setBilling("yearly")}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Yearly
                <span style={styles.saveBadge}>Save 20%</span>
              </button>
            </div>

            {/* PROMO CODE */}
            <div style={styles.promoWrapper}>
              <input
                style={styles.promoInput}
                placeholder="Have a promo code?"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyPromo()}
              />
              <button
                style={styles.promoBtn}
                onClick={applyPromo}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                Apply
              </button>
            </div>

            {promoApplied && (
              <div style={styles.promoSuccess}>
                <svg
                  style={styles.promoIcon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Promo "{promoApplied}" applied successfully</span>
              </div>
            )}
          </div>
        </section>

        {/* PRICING CARDS */}
        <section style={styles.plansSection}>
          <div style={styles.plansGrid}>
            {BASE_PLANS.map((plan) => (
              <div
                key={plan.id}
                style={{
                  ...styles.planCard,
                  ...(plan.featured ? styles.planCardFeatured : {}),
                }}
                onMouseEnter={() => setCursorVariant("hover")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {plan.featured && (
                  <div style={styles.popularBadge}>Most Popular</div>
                )}

                <div style={styles.planHeader}>
                  <h3 style={styles.planName}>{plan.name}</h3>
                  <p style={styles.planShort}>{plan.short}</p>
                </div>

                <div style={styles.planPricing}>
                  <div style={styles.priceWrapper}>
                    <span style={styles.currency}>$</span>
                    <span style={styles.amount}>{price(plan)}</span>
                    <span style={styles.period}>
                      /{billing === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  {billing === "yearly" && savings(plan) > 0 && (
                    <p style={styles.savings}>Save ${savings(plan)}/year</p>
                  )}
                </div>

                <ul style={styles.featureList}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={styles.featureItem}>
                      <svg style={styles.checkIcon} viewBox="0 0 20 20">
                        <path
                          fill="currentColor"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.disabledFeatures.map((feature, i) => (
                    <li key={i} style={styles.featureItemDisabled}>
                      <svg style={styles.xIcon} viewBox="0 0 20 20">
                        <path
                          fill="currentColor"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  style={{
                    ...styles.ctaBtn,
                    ...(plan.featured ? styles.ctaBtnPrimary : styles.ctaBtnSecondary),
                  }}
                  onClick={() => handleSelect(plan)}
                  onMouseEnter={(e) => {
                    setCursorVariant("hover");
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = plan.featured
                      ? "0 12px 24px rgba(99, 102, 241, 0.3)"
                      : "0 8px 16px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    setCursorVariant("default");
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = plan.featured
                      ? "0 8px 16px rgba(99, 102, 241, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  {plan.cta}
                </button>

                {plan.id === "pro" && (
                  <p style={styles.trialNote}>7-day risk-free trial</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TRUST STRIP */}
        <section style={styles.trustStrip}>
          <div style={styles.trustGrid}>
            <div style={styles.trustItem}>
              <svg style={styles.trustIcon} viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Secure Processing</span>
            </div>
            <div style={styles.trustItem}>
              <svg style={styles.trustIcon} viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 11l3 3L22 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>ATS-Aligned</span>
            </div>
            <div style={styles.trustItem}>
              <svg style={styles.trustIcon} viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Enterprise Standards</span>
            </div>
            <div style={styles.trustItem}>
              <svg style={styles.trustIcon} viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>No Data Sharing</span>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={styles.testimonialsSection}>
          <h2 style={styles.testimonialsTitle}>What Our Users Say</h2>
          <div style={styles.testimonialCard}>
            <p style={styles.testimonialText}>
              "{TESTIMONIALS[testIndex].text}"
            </p>
            <div style={styles.testimonialAuthor}>
              <strong>{TESTIMONIALS[testIndex].name}</strong>
              <span style={styles.testimonialRole}>
                {TESTIMONIALS[testIndex].role}
              </span>
            </div>
            <div style={styles.testimonialDots}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.testimonialDot,
                    ...(i === testIndex ? styles.testimonialDotActive : {}),
                  }}
                  onClick={() => setTestIndex(i)}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={styles.faqSection}>
          <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {FAQ.map((item, i) => (
              <div key={i} style={styles.faqItem}>
                <button
                  style={styles.faqQuestion}
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <span>{item.q}</span>
                  <svg
                    style={{
                      ...styles.faqIcon,
                      transform:
                        faqOpen === i ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {faqOpen === i && <p style={styles.faqAnswer}>{item.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ENTERPRISE CTA */}
        <section style={styles.enterpriseCta}>
          <div style={styles.enterpriseContent}>
            <h2 style={styles.enterpriseTitle}>
              Need custom deployment or institutional pricing?
            </h2>
            <p style={styles.enterpriseText}>
              Contact our enterprise team for bulk licensing, SSO, and custom
              integrations.
            </p>
            <button
              style={styles.enterpriseBtn}
              onClick={() =>
                (window.location.href = "mailto:enterprise@pathnex.ai")
              }
              onMouseEnter={(e) => {
                setCursorVariant("hover");
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                setCursorVariant("default");
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(255, 255, 255, 0.15)";
              }}
            >
              Talk to Enterprise Team
            </button>
          </div>
        </section>
      </main>

      {/* CHECKOUT MODAL */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={styles.modalClose}
              onClick={() => setShowModal(false)}
              onMouseEnter={() => setCursorVariant("hover")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h3 style={styles.modalTitle}>
              Subscribe to {selectedPlan?.name}
            </h3>
            <p style={styles.modalSubtitle}>
              ${price(selectedPlan || BASE_PLANS[0])}/
              {billing === "monthly" ? "month" : "year"}
            </p>

            <div style={styles.modalForm}>
              <label style={styles.modalLabel}>Email Address</label>
              <input
                style={styles.modalInput}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheckout()}
              />

              <div style={styles.modalActions}>
                <button
                  style={styles.modalBtnPrimary}
                  onClick={handleCheckout}
                  onMouseEnter={(e) => {
                    setCursorVariant("hover");
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(99, 102, 241, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    setCursorVariant("default");
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(99, 102, 241, 0.2)";
                  }}
                >
                  Confirm Subscription
                </button>
                <button
                  style={styles.modalBtnSecondary}
                  onClick={() => setShowModal(false)}
                  onMouseEnter={() => setCursorVariant("hover")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  Cancel
                </button>
              </div>

              <p style={styles.modalDisclaimer}>
                No hidden fees • Cancel anytime • Secure payment
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES ================= */
const styles = {
  cursor: {
    position: "fixed",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "2px solid #6366f1",
    pointerEvents: "none",
    zIndex: 9999,
    transition: "transform 0.15s ease-out",
    mixBlendMode: "difference",
  },

  main: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  hero: {
    padding: "6rem 1.5rem 4rem",
    maxWidth: "1280px",
    margin: "0 auto",
    textAlign: "center",
  },

  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },

  heroTitle: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "1.5rem",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
  },

  heroAccent: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  heroSubtitle: {
    fontSize: "1.25rem",
    color: "#6b7280",
    marginBottom: "3rem",
    lineHeight: 1.6,
  },

  billingToggle: {
    display: "inline-flex",
    gap: "0.5rem",
    background: "#f3f4f6",
    padding: "0.375rem",
    borderRadius: "0.75rem",
    marginBottom: "2rem",
  },

  toggleBtn: {
    padding: "0.625rem 1.5rem",
    background: "transparent",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.9375rem",
    fontWeight: 500,
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  toggleBtnActive: {
    background: "white",
    color: "#111827",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },

  saveBadge: {
    marginLeft: "0.5rem",
    padding: "0.125rem 0.5rem",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: 600,
  },

  promoWrapper: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    maxWidth: "400px",
    margin: "0 auto",
  },

  promoInput: {
    flex: 1,
    padding: "0.75rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "0.9375rem",
    fontFamily: "'Inter', -apple-system, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  },

  promoBtn: {
    padding: "0.75rem 1.5rem",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.9375rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  promoSuccess: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: "0.5rem",
    fontSize: "0.9375rem",
    fontWeight: 500,
  },

  promoIcon: {
    width: "20px",
    height: "20px",
  },

  plansSection: {
    padding: "4rem 1.5rem",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  planCard: {
    background: "white",
    borderRadius: "1.25rem",
    padding: "2.5rem",
    border: "1px solid #e5e7eb",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  planCardFeatured: {
    border: "2px solid transparent",
    background:
      "linear-gradient(white, white) padding-box, linear-gradient(135deg, #6366f1, #8b5cf6) border-box",
    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
    transform: "scale(1.05)",
  },

  popularBadge: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    padding: "0.375rem 1rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
  },

  planHeader: {
    marginBottom: "2rem",
  },

  planName: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.75rem",
    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
  },

  planShort: {
    fontSize: "0.9375rem",
    color: "#6b7280",
    lineHeight: 1.6,
  },

  planPricing: {
    marginBottom: "2rem",
    paddingBottom: "2rem",
    borderBottom: "1px solid #e5e7eb",
  },

  priceWrapper: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.25rem",
  },

  currency: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#6b7280",
  },

  amount: {
    fontSize: "4rem",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1,
  },

  period: {
    fontSize: "1.125rem",
    color: "#6b7280",
    fontWeight: 500,
  },

  savings: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: "#10b981",
    fontWeight: 600,
  },

  featureList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 2rem 0",
    flex: 1,
  },

  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    padding: "0.75rem 0",
    fontSize: "0.9375rem",
    color: "#374151",
    lineHeight: 1.6,
  },

  featureItemDisabled: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    padding: "0.75rem 0",
    fontSize: "0.9375rem",
    color: "#9ca3af",
    lineHeight: 1.6,
  },

  checkIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
    color: "#10b981",
    marginTop: "2px",
  },

  xIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
    color: "#d1d5db",
    marginTop: "2px",
  },

  ctaBtn: {
    width: "100%",
    padding: "1rem 2rem",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  ctaBtnPrimary: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    boxShadow: "0 8px 16px rgba(99, 102, 241, 0.2)",
  },

  ctaBtnSecondary: {
    background: "white",
    color: "#111827",
    border: "2px solid #e5e7eb",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
  },

  trialNote: {
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.875rem",
    color: "#6b7280",
  },

  trustStrip: {
    padding: "3rem 1.5rem",
    background: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
  },

  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  trustItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    textAlign: "center",
    color: "#374151",
    fontSize: "0.9375rem",
    fontWeight: 500,
  },

  trustIcon: {
    width: "32px",
    height: "32px",
    color: "#6366f1",
  },

  testimonialsSection: {
    padding: "4rem 1.5rem",
    maxWidth: "800px",
    margin: "0 auto",
  },

  testimonialsTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#111827",
    textAlign: "center",
    marginBottom: "3rem",
    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
  },

  testimonialCard: {
    background: "white",
    borderRadius: "1.25rem",
    padding: "3rem",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
  },

  testimonialText: {
    fontSize: "1.25rem",
    color: "#374151",
    lineHeight: 1.8,
    marginBottom: "2rem",
    fontStyle: "italic",
  },

  testimonialAuthor: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: "1rem",
    color: "#111827",
    fontWeight: 600,
  },

  testimonialRole: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: 400,
  },

  testimonialDots: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "2rem",
  },

  testimonialDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#d1d5db",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    padding: 0,
  },

  testimonialDotActive: {
    background: "#6366f1",
    width: "24px",
    borderRadius: "4px",
  },

  faqSection: {
    padding: "4rem 1.5rem",
    maxWidth: "800px",
    margin: "0 auto",
  },

  faqTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#111827",
    textAlign: "center",
    marginBottom: "3rem",
    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
  },

  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  faqItem: {
    background: "white",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },

  faqQuestion: {
    width: "100%",
    padding: "1.5rem",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.0625rem",
    fontWeight: 600,
    color: "#111827",
    fontFamily: "'Inter', -apple-system, sans-serif",
    transition: "background-color 0.2s",
  },

  faqIcon: {
    width: "20px",
    height: "20px",
    color: "#6b7280",
    transition: "transform 0.2s",
  },

  faqAnswer: {
    padding: "0 1.5rem 1.5rem",
    fontSize: "0.9375rem",
    color: "#6b7280",
    lineHeight: 1.7,
    animation: "fadeIn 0.2s ease-out",
  },

  enterpriseCta: {
    padding: "5rem 1.5rem",
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
    textAlign: "center",
  },

  enterpriseContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },

  enterpriseTitle: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "white",
    marginBottom: "1.5rem",
    lineHeight: 1.2,
    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
  },

  enterpriseText: {
    fontSize: "1.125rem",
    color: "#cbd5e1",
    marginBottom: "2.5rem",
    lineHeight: 1.7,
  },

  enterpriseBtn: {
    padding: "1rem 2.5rem",
    background: "white",
    color: "#1e293b",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1.0625rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 16px rgba(255, 255, 255, 0.15)",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1.5rem",
  },

  modalContent: {
    background: "white",
    borderRadius: "1.25rem",
    padding: "3rem",
    maxWidth: "500px",
    width: "100%",
    position: "relative",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },

  modalClose: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    color: "#6b7280",
    transition: "color 0.2s",
  },

  modalTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.5rem",
    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
  },

  modalSubtitle: {
    fontSize: "1.25rem",
    color: "#6b7280",
    marginBottom: "2rem",
  },

  modalForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  modalLabel: {
    fontSize: "0.9375rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
  },

  modalInput: {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontFamily: "'Inter', -apple-system, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  },

  modalActions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  modalBtnPrimary: {
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  modalBtnSecondary: {
    padding: "1rem 2rem",
    background: "transparent",
    color: "#6b7280",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "color 0.2s",
    fontFamily: "'Inter', -apple-system, sans-serif",
  },

  modalDisclaimer: {
    fontSize: "0.875rem",
    color: "#9ca3af",
    textAlign: "center",
  },
};
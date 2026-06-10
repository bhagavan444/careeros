import React from "react";
import { motion } from "framer-motion";

// Subtle, Vercel-inspired fade and scale transition
// Optimized for 144Hz with hardware acceleration
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // Ultra-smooth Apple-like ease out
    },
  },
  out: {
    opacity: 0,
    scale: 0.99,
    y: -5,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className={className}
      style={{
        width: "100%",
        minHeight: "100dvh",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;

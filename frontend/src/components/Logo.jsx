import React from "react";

export default function Logo({ className = "", style = {} }) {
  return (
    <svg 
      className={className} 
      style={{
        ...style,
        width: "var(--logo-size, 32px)", 
        height: "var(--logo-size, 32px)", 
        transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease",
        display: "block"
      }}
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CareerOS Home"
      role="img"
    >
      {/* The "C" (Outer Intelligence Ring) */}
      <path 
        d="M 383.28 128.72 A 180 180 0 1 0 383.28 383.28" 
        stroke="#111827" 
        strokeWidth="72" 
        strokeLinecap="round" 
      />
      {/* The "O" (Inner Human Potential Core) */}
      <circle cx="256" cy="256" r="72" fill="#2563EB" />
    </svg>
  );
}

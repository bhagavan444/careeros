// ============================================================
// CENTRALIZED API CONFIGURATION — CAREEROS
// ============================================================
// Single source of truth for all backend API routing.
// Never hardcode localhost or production URLs in components.
// ============================================================

// Guard against empty-string override from .env.local (VITE_API_BASE_URL=)
// Vite loads .env.local with higher priority than .env, so an empty value
// from .env.local would override the valid URL in .env.
const envUrl = import.meta.env.VITE_API_BASE_URL;

const API_BASE = (envUrl && envUrl.trim())
  ? envUrl.trim().replace(/\/+$/, '')       // Use env value, strip trailing slashes
  : (import.meta.env.MODE === "development"
    ? "http://localhost:5000"                // Local FastAPI dev server
    : "https://careeros-backend1.onrender.com");  // Production Render backend

// Log active backend target on startup (visible in browser console)
console.log(`[CAREEROS] API_BASE resolved to: ${API_BASE} (mode: ${import.meta.env.MODE})`);

export default API_BASE;

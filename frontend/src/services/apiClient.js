import axios from 'axios';
import API_BASE from '../config/api';

// ─── Retry Configuration ──────────────────────────────────────────────────────
// Handles Render cold-start (free tier spins down after 15 min idle).
// First request after cold-start returns network error or 502/503.
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Axios Instance ───────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 120000,          // 2 minutes — needed for heavy resume analysis
  withCredentials: false,   // CRITICAL: No cookies/sessions. Avoids strict CORS enforcement.
  headers: {
    'Accept': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Log every outgoing request for debugging
    console.debug(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor with Automatic Retry ────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Don't retry if we already exhausted retries or request was cancelled
    if (!config || config._retryCount >= MAX_RETRIES || axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Retry on network errors (cold start) or 502/503 (Render waking up)
    const isRetryable =
      !error.response ||                        // Network error (CORS block or server down)
      error.response.status === 502 ||           // Bad gateway (Render booting)
      error.response.status === 503 ||           // Service unavailable
      error.code === 'ECONNABORTED';             // Timeout

    if (isRetryable) {
      config._retryCount = (config._retryCount || 0) + 1;
      console.warn(
        `[API_RETRY] Attempt ${config._retryCount}/${MAX_RETRIES} — retrying in ${RETRY_DELAY_MS}ms...`
      );
      await sleep(RETRY_DELAY_MS);
      return apiClient(config);
    }

    if (error.code === 'ECONNABORTED') {
      console.error('[API_TIMEOUT] Request exceeded 120s timeout.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

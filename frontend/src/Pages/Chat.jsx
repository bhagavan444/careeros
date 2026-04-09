import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api";
const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PLACEHOLDERS = [
  "Ask anything...",
  "Upload a file...",
  "Debug your code...",
  "Explain a concept...",
  "Analyze my document...",
  "Generate something...",
];

const THINKING_STEPS = [
  "Parsing your request...",
  "Accessing knowledge base...",
  "Reasoning through context...",
  "Composing response...",
];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #ffffff;
    --bg-surface: #f8fafc;
    --bg-card: #ffffff;
    --bg-elevated: #f1f5f9;
    --border: #e2e8f0;
    --border-focus: #93c5fd;
    --accent-blue: #2563eb;
    --accent-blue-light: #eff6ff;
    --accent-blue-hover: #1d4ed8;
    --accent-red: #ef4444;
    --accent-green: #22c55e;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
    --user-bubble: #2563eb;
    --user-text: #ffffff;
    --ai-bubble: #f8fafc;
    --ai-border: #e2e8f0;
    --sidebar-width: 260px;
    --header-height: 56px;
    --font-body: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
    --r-xs: 4px;
    --r-sm: 8px;
    --r-md: 10px;
    --r-lg: 14px;
    --r-xl: 18px;
    --r-2xl: 24px;
    --r-full: 9999px;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.1);
    --transition: 0.15s ease;
  }

  body {
    background: var(--bg);
    color: var(--text-primary);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: #bfdbfe; color: var(--text-primary); }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  textarea::-webkit-scrollbar { display: none; }
  textarea { scrollbar-width: none; }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes dot-bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }

  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .thinking-dot {
    animation: dot-bounce 1.2s ease-in-out infinite;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    background: var(--text-muted);
  }
  .thinking-dot:nth-child(2) { animation-delay: 0.15s; }
  .thinking-dot:nth-child(3) { animation-delay: 0.3s; }

  .shimmer-line {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--r-sm);
    height: 14px;
  }

  .md-content { font-size: 14px; line-height: 1.75; color: var(--text-primary); }
  .md-content h1 { font-size: 1.35em; font-weight: 700; margin: 16px 0 8px; }
  .md-content h2 { font-size: 1.15em; font-weight: 600; margin: 14px 0 7px; }
  .md-content h3 { font-size: 1.02em; font-weight: 600; margin: 12px 0 6px; color: var(--accent-blue); }
  .md-content ul, .md-content ol { padding-left: 18px; margin: 8px 0; }
  .md-content li { margin: 3px 0; line-height: 1.7; }
  .md-content strong { color: var(--text-primary); font-weight: 600; }
  .md-content em { color: var(--text-secondary); font-style: italic; }
  .md-content a { color: var(--accent-blue); text-decoration: underline; text-underline-offset: 2px; }
  .md-content code {
    font-family: var(--font-mono);
    background: #f1f5f9;
    border: 1px solid var(--border);
    padding: 1px 5px;
    border-radius: var(--r-xs);
    font-size: 0.84em;
    color: #0f172a;
  }
  .md-content blockquote {
    border-left: 3px solid var(--accent-blue);
    padding: 6px 14px;
    margin: 10px 0;
    background: var(--accent-blue-light);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    color: var(--text-secondary);
  }
  .md-content table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.88em; }
  .md-content th {
    background: var(--bg-elevated);
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    border: 1px solid var(--border);
    font-size: 0.85em;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .md-content td { padding: 7px 12px; border: 1px solid var(--border); }
  .md-content tr:nth-child(even) td { background: var(--bg-surface); }
  .md-content p { margin-bottom: 8px; }
  .md-content p:last-child { margin-bottom: 0; }

  /* Interactive states */
  .btn {
    transition: background var(--transition), color var(--transition), border-color var(--transition), box-shadow var(--transition), opacity var(--transition);
    cursor: pointer;
    border: none;
    font-family: var(--font-body);
  }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .sidebar-item { transition: background var(--transition), border-color var(--transition); }
  .sidebar-item:hover { background: var(--bg-elevated) !important; }

  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    border-radius: var(--r-md);
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    transition: background var(--transition), color var(--transition), border-color var(--transition);
  }
  .icon-btn:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }

  .chip {
    transition: background var(--transition), border-color var(--transition), color var(--transition);
    cursor: pointer;
    font-family: var(--font-body);
  }
  .chip:hover {
    background: var(--accent-blue-light) !important;
    border-color: #bfdbfe !important;
    color: var(--accent-blue) !important;
  }

  .meta-btn {
    display: flex; align-items: center; justify-content: center;
    gap: 4px;
    border-radius: var(--r-sm);
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 12px;
    padding: 4px 8px;
    transition: background var(--transition), color var(--transition), border-color var(--transition);
    font-family: var(--font-body);
  }
  .meta-btn:hover {
    background: var(--bg-elevated);
    border-color: var(--border);
    color: var(--text-secondary);
  }

  .send-btn:not(:disabled):hover {
    background: var(--accent-blue-hover) !important;
    box-shadow: var(--shadow-md);
    transform: scale(1.02);
  }
`;

// ─── MARKDOWN PARSER ─────────────────────────────────────────────────────────
function parseMarkdown(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*] (.*?)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.*?)$/gm, "<li>$1</li>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(<li>.*?<\/li>\n?)+/gs, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>");
}

function renderContent(raw = "", isStreaming = false) {
  if (!raw) return null;
  const codeRe = /```(\w*)\n?([\s\S]*?)```/g;
  const parts = [];
  let last = 0, m, i = 0;
  while ((m = codeRe.exec(raw)) !== null) {
    if (m.index > last) {
      parts.push(
        <div key={`t${i++}`} className="md-content"
          dangerouslySetInnerHTML={{ __html: `<p>${parseMarkdown(raw.slice(last, m.index))}</p>` }} />
      );
    }
    parts.push(<CodeBlock key={`c${i++}`} lang={m[1] || "text"} code={m[2].trim()} />);
    last = codeRe.lastIndex;
  }
  if (last < raw.length) {
    parts.push(
      <div key={`te${i++}`} className="md-content"
        dangerouslySetInnerHTML={{ __html: `<p>${parseMarkdown(raw.slice(last))}</p>` }} />
    );
  }
  return parts;
}

// ─── CODE BLOCK ──────────────────────────────────────────────────────────────
function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      margin: "10px 0",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      overflow: "hidden",
      background: "#f8fafc",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 12px",
        background: "#f1f5f9",
        borderBottom: "1px solid var(--border)",
      }}>
        <span style={{
          fontSize: "11px", fontFamily: "var(--font-mono)",
          color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em",
        }}>{lang}</span>
        <button
          className="btn"
          onClick={copy}
          style={{
            padding: "3px 10px", borderRadius: "6px",
            border: "1px solid var(--border)",
            background: copied ? "#dcfce7" : "#ffffff",
            color: copied ? "#16a34a" : "var(--text-secondary)",
            fontSize: "11px", fontFamily: "var(--font-mono)",
          }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={githubGist}
        customStyle={{
          background: "#f8fafc",
          padding: "14px 16px",
          margin: 0,
          fontSize: "12.5px",
          fontFamily: "var(--font-mono)",
        }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ─── TYPING DOTS ─────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="thinking-dot" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
function SkeletonLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
      <div className="shimmer-line" style={{ width: "80%" }} />
      <div className="shimmer-line" style={{ width: "60%" }} />
      <div className="shimmer-line" style={{ width: "70%" }} />
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toasts, dismiss }) {
  return (
    <div style={{ position: "fixed", top: "68px", right: "16px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "6px" }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "500",
              background: t.type === "error" ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${t.type === "error" ? "#fecaca" : "#bbf7d0"}`,
              color: t.type === "error" ? "#dc2626" : "#16a34a",
              boxShadow: "var(--shadow-md)", maxWidth: "280px",
            }}>
            <span>{t.type === "error" ? "✕" : "✓"}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "inherit", opacity: 0.5, fontSize: "12px", padding: 0,
              }}>✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── FILE CARD ────────────────────────────────────────────────────────────────
function FileCard({ file, onRemove, analyzing }) {
  const ext = file.name.split(".").pop().toUpperCase();
  const isImage = file.type.startsWith("image/");
  const extColors = {
    PDF: "#ef4444", DOC: "#2563eb", DOCX: "#2563eb",
    TXT: "#64748b", JS: "#f59e0b", PY: "#22c55e",
  };
  const color = extColors[ext] || "#64748b";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      style={{
        display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px",
        borderRadius: "var(--r-md)", background: "var(--bg-surface)",
        border: "1px solid var(--border)", position: "relative", overflow: "hidden",
      }}>
      {analyzing && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.04), transparent)",
          animation: "shimmer 1.5s infinite",
        }} />
      )}
      <div style={{
        width: "32px", height: "32px", borderRadius: "var(--r-sm)", flexShrink: 0,
        background: `${color}10`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontWeight: "700", fontFamily: "var(--font-mono)", color,
      }}>
        {isImage ? "IMG" : ext}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {file.name}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
          {analyzing
            ? <span style={{ color: "var(--accent-blue)" }}>Analyzing…</span>
            : `${(file.size / 1024).toFixed(1)} KB`}
        </div>
      </div>
      <button
        onClick={onRemove}
        style={{
          width: "18px", height: "18px", borderRadius: "50%", border: "none",
          background: "#fee2e2", color: "#ef4444", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", flexShrink: 0,
        }}>✕</button>
    </motion.div>
  );
}

// ─── PLACEHOLDER ANIMATOR ──────────────────────────────────────────────────
function useAnimatedPlaceholder() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = PLACEHOLDERS[idx];
    let timeout;
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return displayed;
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ isUser, isStreaming }) {
  return (
    <div style={{
      width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: isUser ? "var(--accent-blue)" : "var(--bg-elevated)",
      border: "1px solid " + (isUser ? "transparent" : "var(--border)"),
      fontSize: "12px", fontWeight: "700",
      color: isUser ? "#fff" : "var(--text-secondary)",
    }}>
      {isUser ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ) : (
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          style={isStreaming ? { animation: "spin 2s linear infinite" } : {}}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--accent-blue)" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" stroke="#93c5fd" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ─── MESSAGE REACTIONS ────────────────────────────────────────────────────────
function MessageReactions({ onReact, reactions }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[
        { emoji: "👍", key: "up" },
        { emoji: "👎", key: "down" },
      ].map(({ emoji, key }) => (
        <button
          key={key}
          className="meta-btn"
          onClick={() => onReact(key)}
          style={{
            background: reactions?.[key] ? "var(--accent-blue-light)" : undefined,
            borderColor: reactions?.[key] ? "#bfdbfe" : undefined,
            color: reactions?.[key] ? "var(--accent-blue)" : undefined,
          }}>
          {emoji}
        </button>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ChatUI() {
  const [sessions, setSessions] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [streamingId, setStreamingId] = useState(null);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [typingSpeed, setTypingSpeed] = useState("fast");
  const [expandedMsgs, setExpandedMsgs] = useState({});
  const [contextRemembered, setContextRemembered] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [reactions, setReactions] = useState({});
  const stopRef = useRef(false);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const placeholderText = useAnimatedPlaceholder();

  // Inject global CSS once
  useEffect(() => {
    if (document.getElementById("gcss-chat-white")) return;
    const el = document.createElement("style");
    el.id = "gcss-chat-white";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);

  useEffect(() => {
    fetchChats();
    const onResize = () => setSidebarOpen(window.innerWidth >= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Smart auto-scroll: only scroll if user hasn't scrolled up
  useEffect(() => {
    if (!userScrolled && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, userScrolled]);

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setUserScrolled(!atBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(160, ta.scrollHeight)}px`;
  }, [input]);

  useEffect(() => {
    if (messages.length > 2) setContextRemembered(true);
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Enter" && !e.shiftKey && document.activeElement === textareaRef.current) {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [input, selectedFiles]);

  // ── API ────────────────────────────────────────────────────────────────────
  const fetchChats = async () => {
    try {
      const r = await fetch(`${API_BASE}/chats`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      const list = (d.sessions || []).reverse().map((s) => ({
        ...s,
        lastMessage: s.messages?.[s.messages.length - 1]?.message || "",
      }));
      setSessions(list);
      if (list.length && !tabs.length) {
        const t = [{ id: list[0]._id, title: list[0].title || "Chat 1" }];
        setTabs(t);
        setActiveTab(t[0].id);
      }
    } catch {}
  };

  const selectChat = async (_id) => {
    try {
      setChatId(_id);
      setError(null);
      setUserScrolled(false);
      if (window.innerWidth < 768) setSidebarOpen(false);
      const r = await fetch(`${API_BASE}/chats/${_id}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setMessages(d.messages || []);
      if (!tabs.find((t) => t.id === _id)) {
        const s = sessions.find((s) => s._id === _id);
        setTabs((prev) => [...prev.slice(-4), { id: _id, title: s?.title || "Chat" }]);
      }
      setActiveTab(_id);
    } catch {
      setError("Failed to load chat.");
    }
  };

  const handleNewChat = async () => {
    try {
      setError(null);
      const r = await fetch(`${API_BASE}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "New chat", reply: "Started" }),
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setChatId(d.chat_id);
      setMessages([]);
      setTabs((prev) => [...prev.slice(-4), { id: d.chat_id, title: "New Chat" }]);
      setActiveTab(d.chat_id);
      await fetchChats();
      if (window.innerWidth < 768) setSidebarOpen(false);
    } catch {
      setError("Failed to create chat.");
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFiles.length) return;
    setLoading(true);
    setStreaming(true);
    setError(null);
    setUserScrolled(false);
    stopRef.current = false;

    const userMsg = {
      id: uid(),
      message: input,
      reply: "",
      files: selectedFiles.map((f) => f.name),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      role: "user",
      date: new Date().toDateString(),
    };
    setMessages((c) => [...c, userMsg]);
    const cap = input;
    setInput("");
    setSelectedFiles([]);

    const aid = uid();
    setStreamingId(aid);
    setThinkingStep(0);
    setMessages((c) => [
      ...c,
      {
        id: aid, message: null, reply: "", role: "assistant",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toDateString(), isThinking: true,
      },
    ]);

    // Progress thinking steps
    const thinkingInterval = setInterval(() => {
      setThinkingStep((s) => {
        if (s >= THINKING_STEPS.length - 1) { clearInterval(thinkingInterval); return s; }
        return s + 1;
      });
    }, 500);

    try {
      let res;
      if (selectedFiles.length) {
        const fd = new FormData();
        fd.append("message", cap);
        if (chatId) fd.append("chat_id", chatId);
        selectedFiles.forEach((f) => fd.append("files", f));
        res = await fetch(`${API_BASE}/chat`, { method: "POST", body: fd });
      } else {
        res = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: cap, chat_id: chatId }),
        });
      }
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).reply || "API error");
      const data = await res.json();
      const rt = data.reply || "⚠️ No response.";

      clearInterval(thinkingInterval);
      setMessages((c) => c.map((m) => (m.id === aid ? { ...m, isThinking: false } : m)));

      const delay = typingSpeed === "fast" ? 4 : typingSpeed === "slow" ? 20 : 10;
      let built = "";
      for (let i = 0; i < rt.length; i++) {
        if (stopRef.current) break;
        built += rt[i];
        setMessages((c) => c.map((m) => (m.id === aid ? { ...m, reply: built } : m)));
        await wait(delay + Math.random() * (delay / 2));
      }

      setChatId(data.chat_id || chatId);
      setStreamingId(null);
      await fetchChats();
      addToast("Response received");
    } catch (err) {
      clearInterval(thinkingInterval);
      setStreamingId(null);
      setMessages((c) =>
        c.map((m) =>
          m.id === aid
            ? { ...m, reply: "⚠️ " + (err.message || "Connection error."), isThinking: false }
            : m
        )
      );
      setError(err.message || "Failed to reach server.");
      addToast("Failed to send", "error");
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const stopGeneration = () => {
    stopRef.current = true;
    setStreaming(false);
    addToast("Generation stopped");
  };

  const delSession = async (_id) => {
    try {
      await fetch(`${API_BASE}/chats/${_id}`, { method: "DELETE" });
      if (chatId === _id) { setChatId(null); setMessages([]); }
      setTabs((prev) => prev.filter((t) => t.id !== _id));
      await fetchChats();
      addToast("Chat deleted");
    } catch {
      addToast("Failed", "error");
    }
  };

  const delAll = async () => {
    try {
      await fetch(`${API_BASE}/chats`, { method: "DELETE" });
      setChatId(null);
      setMessages([]);
      setTabs([]);
      await fetchChats();
      addToast("All chats cleared");
    } catch {
      addToast("Failed", "error");
    }
  };

  const exportChat = () => {
    const content = messages
      .map((m) => `${m.role === "user" ? "You" : "AI"}: ${m.message || m.reply}`)
      .join("\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    a.download = "chat.txt";
    a.click();
    addToast("Exported as TXT");
  };

  const copyMsg = (text) => { navigator.clipboard.writeText(text); addToast("Copied!"); };

  const addToast = (message, type = "success") => {
    const id = uid();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const toggleExpand = (id) => setExpandedMsgs((p) => ({ ...p, [id]: !p[id] }));

  const handleReact = (msgId, key) => {
    setReactions((prev) => ({
      ...prev,
      [msgId]: { ...prev[msgId], [key]: !prev[msgId]?.[key] },
    }));
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((p) => [...p, ...files]);
    addToast(`${files.length} file(s) attached`);
  };

  const filtered = sessions.filter(
    (s) => !searchQuery || (s.title || "Untitled").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LONG_THRESHOLD = 600;

  const SUGGESTIONS = [
    "Explain quantum entanglement",
    "Write a REST API in Python",
    "Analyze my PDF document",
    "Summarize a research paper",
    "Debug this code snippet",
    "Generate a study plan",
  ];

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        display: "flex", flexDirection: "column", height: "100vh", width: "100%",
        background: "var(--bg)", color: "var(--text-primary)", overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}>

      <Toast toasts={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      {/* Drag Overlay */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
              border: "2px dashed #93c5fd",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "10px", pointerEvents: "none",
            }}>
            <div style={{ fontSize: "40px" }}>📎</div>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "var(--accent-blue)" }}>
              Drop files to attach
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              PDF, DOCX, TXT, Images supported
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "var(--header-height)", padding: "0 16px", flexShrink: 0,
        background: "var(--bg)", borderBottom: "1px solid var(--border)",
        position: "relative", zIndex: 100,
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="icon-btn btn"
            onClick={() => setSidebarOpen((s) => !s)}
            style={{ width: "34px", height: "34px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "7px",
              background: "var(--accent-blue)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5" stroke="#93c5fd" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{
              fontSize: "15px", fontWeight: "700", letterSpacing: "-0.3px",
              color: "var(--text-primary)",
            }}>Neural</span>
          </div>

          {/* Tab Bar */}
          <div style={{ display: "flex", gap: "3px", marginLeft: "4px" }}>
            {tabs.slice(-5).map((tab) => (
              <button
                key={tab.id}
                className="btn"
                onClick={() => selectChat(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "4px 10px", borderRadius: "var(--r-sm)", fontSize: "12px",
                  fontFamily: "var(--font-body)", cursor: "pointer",
                  border: `1px solid ${activeTab === tab.id ? "#bfdbfe" : "var(--border)"}`,
                  background: activeTab === tab.id ? "var(--accent-blue-light)" : "transparent",
                  color: activeTab === tab.id ? "var(--accent-blue)" : "var(--text-secondary)",
                  maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tab.title.slice(0, 14)}
                </span>
                <span
                  onClick={(e) => { e.stopPropagation(); setTabs((prev) => prev.filter((t) => t.id !== tab.id)); }}
                  style={{ opacity: 0.5, fontSize: "10px", lineHeight: 1, flexShrink: 0 }}>✕</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <select
            value={typingSpeed}
            onChange={(e) => setTypingSpeed(e.target.value)}
            style={{
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)", color: "var(--text-secondary)",
              fontSize: "12px", padding: "5px 8px", cursor: "pointer",
              outline: "none", fontFamily: "var(--font-body)",
            }}>
            <option value="fast">Fast</option>
            <option value="medium">Medium</option>
            <option value="slow">Slow</option>
          </select>
          <button
            className="icon-btn btn"
            onClick={exportChat}
            style={{ height: "32px", padding: "0 12px", fontSize: "12px", gap: "5px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </header>

      {/* ── LAYOUT ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{
                display: "flex", flexDirection: "column", height: "100%",
                flexShrink: 0, background: "var(--bg-surface)",
                borderRight: "1px solid var(--border)", overflow: "hidden",
              }}>

              {/* New Chat */}
              <div style={{ padding: "12px 10px 8px" }}>
                <button
                  className="btn"
                  onClick={handleNewChat}
                  style={{
                    width: "100%", padding: "9px 14px",
                    borderRadius: "var(--r-md)",
                    background: "var(--accent-blue)",
                    color: "#fff", fontSize: "13px", fontWeight: "600",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    border: "none", cursor: "pointer",
                    transition: "background var(--transition), box-shadow var(--transition)",
                    boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-blue-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-blue)")}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New Chat
                </button>
              </div>

              {/* Search */}
              <div style={{ padding: "0 10px 8px" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 10px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search chats…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      color: "var(--text-primary)", fontSize: "12px", fontFamily: "var(--font-body)",
                    }} />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-muted)", fontSize: "12px", padding: 0,
                      }}>✕</button>
                  )}
                </div>
              </div>

              <div style={{ padding: "2px 14px 6px" }}>
                <span style={{
                  fontSize: "10px", fontWeight: "600", letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                }}>Recent</span>
              </div>

              {/* Chat list */}
              <div style={{ flex: 1, overflowY: "auto", padding: "2px 8px" }}>
                {filtered.length === 0 && (
                  <div style={{
                    padding: "32px 16px", textAlign: "center",
                    color: "var(--text-muted)", fontSize: "13px",
                  }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>💬</div>
                    No conversations yet
                  </div>
                )}
                {filtered.map((s) => (
                  <div
                    key={s._id}
                    className="sidebar-item"
                    onClick={() => selectChat(s._id)}
                    style={{
                      padding: "8px 10px", borderRadius: "var(--r-md)", cursor: "pointer",
                      marginBottom: "1px", display: "flex", alignItems: "flex-start", gap: "8px",
                      border: `1px solid ${s._id === chatId ? "#bfdbfe" : "transparent"}`,
                      background: s._id === chatId ? "var(--accent-blue-light)" : "transparent",
                      position: "relative",
                    }}>
                    <div style={{
                      width: "26px", height: "26px", borderRadius: "6px", flexShrink: 0,
                      background: s._id === chatId ? "#dbeafe" : "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px",
                    }}>💬</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "12px", fontWeight: "500",
                        color: s._id === chatId ? "var(--accent-blue)" : "var(--text-primary)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{s.title || "Untitled"}</div>
                      {s.lastMessage && (
                        <div style={{
                          fontSize: "11px", color: "var(--text-muted)", marginTop: "1px",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{s.lastMessage.slice(0, 36)}{s.lastMessage.length > 36 ? "…" : ""}</div>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); delSession(s._id); }}
                      style={{
                        opacity: 0, width: "16px", height: "16px", borderRadius: "4px",
                        border: "none", background: "#fee2e2", color: "#ef4444",
                        cursor: "pointer", fontSize: "9px", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "opacity var(--transition)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                    >✕</button>
                  </div>
                ))}
              </div>

              {/* Sidebar Footer */}
              <div style={{ padding: "10px", borderTop: "1px solid var(--border)" }}>
                <button
                  className="btn"
                  onClick={delAll}
                  style={{
                    width: "100%", padding: "8px", borderRadius: "var(--r-md)",
                    border: "1px solid #fecaca", background: "#fff5f5",
                    color: "#ef4444", cursor: "pointer", fontSize: "12px",
                    transition: "all var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff5f5")}>
                  Clear all history
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── MAIN ── */}
        <main style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", background: "var(--bg)" }}>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
                  background: "#fef2f2", borderBottom: "1px solid #fecaca",
                  color: "#dc2626", fontSize: "13px",
                }}>
                <span>⚠</span>
                <span style={{ flex: 1 }}>{error}</span>
                <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "14px" }}>✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CHAT BODY ── */}
          <div ref={chatBodyRef} style={{ flex: 1, overflowY: "auto", padding: "24px 0" }}>
            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 20px" }}>

              {messages.length === 0 ? (
                /* Empty State */
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", minHeight: "52vh", gap: "20px", textAlign: "center",
                }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    background: "var(--accent-blue)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M2 17l10 5 10-5" stroke="#bfdbfe" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M2 12l10 5 10-5" stroke="#dbeafe" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div>
                    <h2 style={{
                      fontSize: "22px", fontWeight: "700", margin: "0 0 6px",
                      color: "var(--text-primary)", letterSpacing: "-0.4px",
                    }}>How can I help you today?</h2>
                    <p style={{
                      fontSize: "14px", color: "var(--text-secondary)",
                      margin: 0, maxWidth: "320px", lineHeight: "1.65",
                    }}>
                      Powered by Gemini 1.5 — ask questions, upload files, debug code, or analyze documents.
                    </p>
                  </div>

                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: "7px",
                    justifyContent: "center", maxWidth: "480px",
                  }}>
                    {SUGGESTIONS.map((q, i) => (
                      <button
                        key={i}
                        className="chip btn"
                        onClick={() => setInput(q)}
                        style={{
                          padding: "7px 14px", borderRadius: "var(--r-full)",
                          border: "1px solid var(--border)", background: "var(--bg-surface)",
                          color: "var(--text-secondary)", fontSize: "13px",
                          animation: `fade-in 0.3s ease ${i * 0.05}s both`,
                        }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  const content = m.reply || m.message || "";
                  const isLong = content.length > LONG_THRESHOLD;
                  const isExpanded = expandedMsgs[m.id];
                  const isCurrentlyStreaming = streamingId === m.id;

                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "10px",
                        marginBottom: "18px",
                        flexDirection: isUser ? "row-reverse" : "row",
                      }}>

                      <Avatar isUser={isUser} isStreaming={isCurrentlyStreaming} />

                      <div style={{ maxWidth: "78%", minWidth: 0 }}>
                        {/* Name + badge */}
                        {!isUser && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            marginBottom: "5px", fontSize: "11px",
                            color: "var(--text-muted)", fontWeight: "500",
                          }}>
                            <span>Neural AI</span>
                            {contextRemembered && idx > 0 && (
                              <span style={{
                                padding: "1px 7px", borderRadius: "var(--r-full)",
                                background: "#eff6ff", border: "1px solid #bfdbfe",
                                color: "var(--accent-blue)", fontSize: "10px",
                              }}>↻ Context aware</span>
                            )}
                          </div>
                        )}

                        {/* Bubble */}
                        <div style={{
                          padding: isUser ? "10px 14px" : "12px 14px",
                          borderRadius: isUser
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                          background: isUser ? "var(--user-bubble)" : "var(--ai-bubble)",
                          border: isUser ? "none" : "1px solid var(--ai-border)",
                          fontSize: "14px", lineHeight: "1.7",
                          color: isUser ? "var(--user-text)" : "var(--text-primary)",
                          boxShadow: isUser ? "0 2px 8px rgba(37,99,235,0.18)" : "var(--shadow-sm)",
                          overflow: "hidden",
                          maxHeight: isLong && !isExpanded && !isUser ? "280px" : "none",
                          position: "relative",
                        }}>
                          {/* Gradient fade for collapsed long messages */}
                          {isLong && !isExpanded && !isUser && (
                            <div style={{
                              position: "absolute", bottom: 0, left: 0, right: 0, height: "56px",
                              background: "linear-gradient(transparent, var(--ai-bubble))",
                              pointerEvents: "none",
                            }} />
                          )}

                          {/* Thinking state */}
                          {m.isThinking ? (
                            <div>
                              <TypingDots />
                              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "3px" }}>
                                {THINKING_STEPS.slice(0, thinkingStep + 1).map((step, i) => (
                                  <div key={i} style={{
                                    fontSize: "11px", color: i === thinkingStep ? "var(--accent-blue)" : "var(--text-muted)",
                                    display: "flex", alignItems: "center", gap: "5px",
                                    fontFamily: "var(--font-mono)",
                                  }}>
                                    <span style={{ opacity: 0.6 }}>{i === thinkingStep ? "›" : "✓"}</span>
                                    {step}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div>
                              {isUser ? (
                                <div style={{ whiteSpace: "pre-wrap" }}>{m.message}</div>
                              ) : (
                                renderContent(m.reply || "", isCurrentlyStreaming)
                              )}
                              {isCurrentlyStreaming && (
                                <span style={{
                                  display: "inline-block", width: "2px", height: "14px",
                                  background: "var(--accent-blue)", marginLeft: "2px",
                                  verticalAlign: "text-bottom", borderRadius: "1px",
                                  animation: "dot-bounce 0.8s ease-in-out infinite",
                                }} />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expand/collapse */}
                        {isLong && !isUser && !isCurrentlyStreaming && (
                          <button
                            className="btn"
                            onClick={() => toggleExpand(m.id)}
                            style={{
                              width: "100%", padding: "5px", marginTop: "3px",
                              borderRadius: "var(--r-sm)", border: "1px solid var(--border)",
                              background: "var(--bg-surface)", color: "var(--text-muted)",
                              fontSize: "11px", cursor: "pointer",
                            }}>
                            {isExpanded ? "↑ Show less" : "↓ Show more"}
                          </button>
                        )}

                        {/* Meta actions */}
                        {!m.isThinking && content && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: "2px",
                            marginTop: "5px",
                            flexDirection: isUser ? "row-reverse" : "row",
                          }}>
                            <button
                              className="meta-btn"
                              onClick={() => copyMsg(isUser ? m.message : m.reply)}
                              title="Copy">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              Copy
                            </button>

                            {!isUser && !isCurrentlyStreaming && (
                              <>
                                <MessageReactions
                                  onReact={(key) => handleReact(m.id, key)}
                                  reactions={reactions[m.id]}
                                />
                                <div style={{ flex: 1 }} />
                                {["Explain more", "Simplify"].map((label) => (
                                  <button
                                    key={label}
                                    className="meta-btn"
                                    onClick={() => setInput(`${label}: ${(m.reply || "").slice(0, 40)}…`)}>
                                    {label}
                                  </button>
                                ))}
                              </>
                            )}
                            <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "4px" }}>
                              {m.time}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── INPUT AREA ── */}
          <div style={{
            padding: "10px 20px 14px", flexShrink: 0,
            background: "var(--bg)", borderTop: "1px solid var(--border)",
          }}>
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>

              {/* File chips */}
              <AnimatePresence>
                {selectedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "7px" }}>
                    {selectedFiles.map((f, i) => (
                      <FileCard
                        key={i} file={f} analyzing={loading}
                        onRemove={() => setSelectedFiles((p) => p.filter((_, j) => j !== i))} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input row */}
              <div style={{
                display: "flex", alignItems: "flex-end", gap: "6px",
                background: "var(--bg-card)",
                border: `1px solid ${inputFocused ? "var(--border-focus)" : "var(--border)"}`,
                borderRadius: "var(--r-2xl)",
                padding: "8px 8px 8px 14px",
                boxShadow: inputFocused ? "0 0 0 3px rgba(147,197,253,0.25)" : "var(--shadow-sm)",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}>
                {/* File attach */}
                <label style={{
                  width: "30px", height: "30px", borderRadius: "var(--r-sm)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--text-muted)",
                  transition: "color var(--transition)", fontSize: "15px",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-blue)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                  <input
                    ref={fileInputRef} type="file" multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setSelectedFiles((p) => [...p, ...files]);
                      addToast(`${files.length} file(s) attached`);
                    }}
                    style={{ display: "none" }} />
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </label>

                {/* Textarea */}
                <textarea
                  ref={textareaRef} rows={1} value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  disabled={loading}
                  placeholder={placeholderText}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "var(--text-primary)", fontSize: "14px", lineHeight: "1.6",
                    resize: "none", minHeight: "22px", maxHeight: "160px",
                    fontFamily: "var(--font-body)", padding: "4px 0",
                  }} />

                {/* Clear input */}
                {input && (
                  <button
                    onClick={() => setInput("")}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", fontSize: "13px", padding: "0 4px",
                      flexShrink: 0, lineHeight: 1, transition: "color var(--transition)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>✕</button>
                )}

                {/* Stop or Send */}
                {streaming ? (
                  <button
                    className="btn"
                    onClick={stopGeneration}
                    style={{
                      width: "34px", height: "34px", borderRadius: "var(--r-md)", flexShrink: 0,
                      border: "1px solid #fecaca", background: "#fff5f5",
                      color: "#ef4444", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "700",
                    }}>■</button>
                ) : (
                  <button
                    className="btn send-btn"
                    onClick={handleSend}
                    disabled={loading || (!input.trim() && !selectedFiles.length)}
                    style={{
                      width: "34px", height: "34px", borderRadius: "var(--r-md)", flexShrink: 0,
                      border: "none",
                      background: (loading || (!input.trim() && !selectedFiles.length))
                        ? "var(--bg-elevated)"
                        : "var(--accent-blue)",
                      color: (loading || (!input.trim() && !selectedFiles.length))
                        ? "var(--text-muted)"
                        : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22,2 15,22 11,13 2,9" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Footer hint */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "14px", marginTop: "7px",
              }}>
                {[
                  { icon: "⚡", text: "Gemini 1.5 Pro" },
                  { icon: "⇧↵", text: "Shift+Enter for newline" },
                  { icon: "↺", text: "Context-aware" },
                ].map((item) => (
                  <div
                    key={item.text}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px",
                      fontSize: "11px", color: "var(--text-muted)",
                    }}>
                    <span style={{ opacity: 0.7 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
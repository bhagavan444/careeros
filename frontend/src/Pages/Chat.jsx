import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/chatStore";
import { useAuth } from "../context/AuthContext";
import API_BASE_ROOT from "../config/api";
import CopilotSidebar from "../components/copilot/CopilotSidebar";
import IntelligenceDocument from "../components/copilot/IntelligenceDocument";
import Logo from "../components/Logo";
import { ArrowUp, Paperclip, Mic, Copy, RefreshCw, ThumbsUp, ThumbsDown, FileText, Code2, MessageSquare, Route, Download } from "lucide-react";

const API_BASE = `${API_BASE_ROOT}/api/v1`;

/* ── Suggestion Card Data ── */
const SUGGESTIONS = [
  {
    icon: <FileText size={18} />,
    title: "How can I improve my resume?",
    description: "ATS optimization, formatting, and content review",
  },
  {
    icon: <Code2 size={18} />,
    title: "What skills should I learn for backend development?",
    description: "Personalized learning path based on your profile",
  },
  {
    icon: <MessageSquare size={18} />,
    title: "Help me prepare for a Python interview",
    description: "Technical questions, system design, and behavioral prep",
  },
  {
    icon: <Route size={18} />,
    title: "Create a roadmap to become an AI engineer",
    description: "Step-by-step plan with timelines and resources",
  },
];

/* ── CareerGPT Avatar ── */
function AssistantAvatar() {
  return (
    <div className="cgpt-avatar">
      <span>CG</span>
    </div>
  );
}

/* ── Auto-Resizing Composer ────────────────────────────────────────── */
function Composer({ value, onChange, onSend, loading }) {
  const hasText = value.trim().length > 0;
  const textareaRef = useRef(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(Math.max(el.scrollHeight, 56), 180) + "px";
  };

  const handleChange = (e) => { onChange(e); resize(); };
  useEffect(() => { resize(); }, [value]);

  return (
    <div className="cgpt-composer-wrapper">
      <div className="cgpt-composer">
        <button className="cgpt-composer-icon" title="Attach file">
          <Paperclip size={18} />
        </button>
        <textarea
          ref={textareaRef}
          className="cgpt-composer-textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
          }}
          placeholder="Message CareerGPT..."
          rows={1}
        />
        <button className="cgpt-composer-icon" title="Voice input">
          <Mic size={18} />
        </button>
        {loading ? (
          <button
            onClick={() => {/* Implement stop abort controller here */}}
            className="cgpt-composer-send active stop-btn"
            title="Stop generating"
          >
            <div className="stop-icon" />
          </button>
        ) : (
          <button
            onClick={onSend}
            disabled={!hasText}
            className={`cgpt-composer-send ${hasText ? "active" : ""}`}
            title="Send message"
          >
            <img 
              src="/careeros-logo.svg" 
              alt="Send" 
              width="20" 
              height="20" 
              style={{ opacity: hasText ? 1 : 0.4, transition: 'opacity 0.2s' }} 
            />
          </button>
        )}
      </div>
      <p className="cgpt-composer-disclaimer">
        CareerGPT can make mistakes. Consider verifying important information.
      </p>
    </div>
  );
}

/* ── Message Action Bar ────────────────────────────────────────────── */
function MessageActions() {
  return (
    <div className="cgpt-message-actions">
      <button className="cgpt-action-btn" title="Copy"><Copy size={14} /></button>
      <button className="cgpt-action-btn" title="Good response"><ThumbsUp size={14} /></button>
      <button className="cgpt-action-btn" title="Bad response"><ThumbsDown size={14} /></button>
      <button className="cgpt-action-btn" title="Regenerate"><RefreshCw size={14} /></button>
      <button className="cgpt-action-btn" title="Export PDF"><Download size={14} /></button>
    </div>
  );
}

/* ── Premium Thinking Indicator ──────────────────────────────────────── */
function ThinkingIndicator() {
  return (
    <div className="cgpt-premium-thinking">
      <div className="cgpt-thinking-glow-bar">
        <div className="cgpt-glow-gradient" />
      </div>
      <span className="cgpt-thinking-text">Generating response...</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                    */
/* ═══════════════════════════════════════════════════════════════════ */
export default function CareerOSCopilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);
  const sendingRef = useRef(false);

  const { activeChatId, createChat, getAuthToken, fetchChats } = useChatStore();
  const { currentUser } = useAuth();

  /* ── Auth bootstrap ── */
  useEffect(() => {
    import("../firebase").then(({ auth }) => {
      const unsub = auth.onAuthStateChanged((u) => { if (u) fetchChats(); });
      return unsub;
    });
  }, [fetchChats]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── Load active conversation (skip during active send) ── */
  useEffect(() => {
    if (sendingRef.current) return;
    const load = async () => {
      if (!activeChatId) { setMessages([]); return; }
      setLoading(true);
      try {
        const token = await getAuthToken();
        const res = await fetch(`${API_BASE}/chat/chats/${activeChatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages.map((m, i) => ({ id: `msg-${i}`, role: m.role, message: m.message })));
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeChatId, getAuthToken]);

  /* ── Send message ── */
  const handleSend = async (textOverride) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    sendingRef.current = true;

    let chatId = activeChatId;
    if (!chatId) chatId = await createChat("New Conversation");
    if (!chatId) { sendingRef.current = false; return; }

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, role: "user", message: text }]);
    setInput("");
    setLoading(true);

    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/chat/stream/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("CareerGPT → Error:", res.status, errText);
        throw new Error(`Server returned ${res.status}`);
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botResponse = "";
      let sseBuffer = "";
      const botMsgId = `bot-${Date.now()}`;
      setMessages((prev) => [...prev, { id: botMsgId, role: "assistant", message: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });

        const lines = sseBuffer.split("\n");
        sseBuffer = "";

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (i === lines.length - 1 && !lines[i].endsWith("\n") && line !== "") {
            sseBuffer = lines[i];
            continue;
          }
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.type === "chunk" && parsed.text) {
              botResponse += parsed.text;
              setMessages((prev) =>
                prev.map((msg) => (msg.id === botMsgId ? { ...msg, message: botResponse } : msg))
              );
            }
          } catch (e) {
            botResponse += payload;
            setMessages((prev) =>
              prev.map((msg) => (msg.id === botMsgId ? { ...msg, message: botResponse } : msg))
            );
          }
        }
      }
    } catch (err) {
      console.error("CareerGPT → Send error:", err);
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", message: "I encountered an error processing your request. Please try again." },
      ]);
    } finally {
      sendingRef.current = false;
      setLoading(false);
      fetchChats();
    }
  };

  const hasMessages = messages.length > 0;

  /* ═══════════════════════════════════════════════════════════════════ */
  /*  RENDER                                                            */
  /* ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="cgpt-shell">
      {/* ── Sidebar ── */}
      <AnimatePresence>
        <motion.div
          className={`cgpt-sidebar ${!sidebarOpen ? "collapsed" : ""}`}
          initial={{ width: sidebarOpen ? 280 : 60 }}
          animate={{ width: sidebarOpen ? 280 : 60 }}
          transition={{ duration: 0.2 }}
        >
          <CopilotSidebar open={sidebarOpen} isMobile={false} onToggle={() => setSidebarOpen((s) => !s)} />
        </motion.div>
      </AnimatePresence>

      {/* ── Main Conversation Surface ── */}
      <div className="cgpt-main">
        <div className="cgpt-scroll-area">
          <AnimatePresence mode="wait">
            {!hasMessages ? (
              /* ───── EMPTY STATE ───── */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="cgpt-empty"
              >
                <motion.div
                  className="cgpt-empty-inner"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                  }}
                >
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="cgpt-empty-brand">
                    <div className="cgpt-empty-logo">CG</div>
                  </motion.div>

                  <motion.h1 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="cgpt-empty-headline" style={{ marginBottom: "8px" }}>
                    CareerGPT
                  </motion.h1>
                  <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} style={{ color: "#64748B", fontSize: "14px", marginBottom: "40px", fontWeight: "500" }}>
                    by CareerOS
                  </motion.p>

                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="cgpt-suggestions">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} className="cgpt-suggestion" onClick={() => handleSend(s.title)}>
                        <span className="cgpt-suggestion-icon">{s.icon}</span>
                        <div className="cgpt-suggestion-text">
                          <strong>{s.title}</strong>
                          <span>{s.description}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Composer
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onSend={() => handleSend()}
                    loading={loading}
                  />
                </motion.div>
              </motion.div>
            ) : (
              /* ───── CONVERSATION ───── */
              <motion.div
                key="conversation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="cgpt-messages-wrapper"
              >
                <div className="cgpt-messages">
                  {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    const isStreaming = loading && !isUser && index === messages.length - 1;
                    return (
                      <motion.div 
                        key={msg.id} 
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`cgpt-msg-row ${isUser ? "user" : "assistant"}`}
                      >
                        {/* Assistant Avatar */}
                        {!isUser && <AssistantAvatar />}

                        <div className="cgpt-msg-body">
                          <div className={`cgpt-msg-content ${isUser ? "cgpt-user-bubble" : "cgpt-assistant-doc"}`}>
                            {isUser ? msg.message : <IntelligenceDocument content={msg.message} isStreaming={isStreaming} />}
                          </div>
                          {!isUser && msg.message && <MessageActions />}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Thinking indicator */}
                  {loading && messages[messages.length - 1]?.role === "user" && (
                    <div className="cgpt-msg-row assistant">
                      <AssistantAvatar />
                      <div className="cgpt-msg-body">
                        <div className="cgpt-msg-content cgpt-assistant-doc">
                          <ThinkingIndicator />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} style={{ height: 160 }} />
                </div>

                <Composer
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onSend={() => handleSend()}
                  loading={loading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
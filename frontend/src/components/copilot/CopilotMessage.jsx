import React, { useState } from "react";
import { motion } from "framer-motion";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs";
import CopilotSourceBadge from "./CopilotSourceBadge";
import { useDrag } from "react-dnd";
import API_BASE_ROOT from "../../config/api";
import { auth } from "../../firebase";
import { Sparkles, Save, Download } from "lucide-react";

const API_BASE = `${API_BASE_ROOT}/api/v1`;

function parseMarkdown(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code style='background:#f1f5f9;padding:2px 6px;border-radius:4px;color:#6D5DFC;font-family:var(--mono);font-size:0.9em'>$1</code>")
    .replace(/^# (.*?)$/gm, "<h1 style='font-size:20px;font-weight:800;color:#0f172a;margin-top:24px;margin-bottom:16px;border-bottom:1px solid #e2e8f0;padding-bottom:8px'>$1</h1>")
    .replace(/^## (.*?)$/gm, "<h2 style='font-size:16px;font-weight:700;color:#334155;margin-top:20px;margin-bottom:12px;display:flex;align-items:center;gap:8px'><span style='display:inline-block;width:6px;height:16px;background:#6D5DFC;border-radius:4px'></span>$1</h2>")
    .replace(/^### (.*?)$/gm, "<h3 style='font-size:14px;font-weight:700;color:#475569;margin-top:16px;margin-bottom:8px'>$1</h3>")
    .replace(/^> (.*?)$/gm, "<blockquote style='border-left:3px solid #6D5DFC;padding-left:16px;color:#64748b;font-style:italic;background:#f8fafc;padding:12px;border-radius:0 8px 8px 0'>$1</blockquote>")
    .replace(/^[-*] (.*?)$/gm, "<li style='margin-bottom:8px;position:relative;padding-left:24px;list-style:none'><span style='position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:#00D4AA'></span>$1</li>")
    .replace(/^\d+\. (.*?)$/gm, "<li style='margin-bottom:8px'>$1</li>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#6D5DFC;text-decoration:none;font-weight:600">$1</a>')
    .replace(/(<li style='margin-bottom:8px;position:relative;padding-left:24px;list-style:none'>.*?<\/li>\n?)+/gs, "<ul style='padding:0;margin:12px 0'>$&</ul>")
    .replace(/(<li style='margin-bottom:8px'>.*?<\/li>\n?)+/gs, "<ol style='padding-left:24px;margin:12px 0;color:#334155'>$&</ol>")
    .replace(/\n\n/g, "</p><p style='margin:12px 0;line-height:1.6;color:#334155'>");
}

const CodeBlock = React.memo(function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ margin: "16px 0", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 16px", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
        <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", fontFamily: "var(--mono)" }}>{lang}</span>
        <button onClick={copy} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <SyntaxHighlighter language={lang} style={githubGist} customStyle={{ background: "transparent", padding: "16px", fontSize: "13px", color: "#0f172a", margin: 0 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
});

export default function CopilotMessage({ msg }) {
  const isUser = msg.role === "user";
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "INSIGHT",
    item: { 
      id: msg.id, 
      content: msg.message, 
      source: msg.meta?.source || "CareerOS",
      title: "Saved Copilot Insight" 
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [msg.message]);

  const handleSaveInsight = async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      await fetch(`${API_BASE}/memory/insights`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "Saved Copilot Insight",
          content: msg.message,
          source: msg.meta?.source || "CareerOS",
          tags: ["manual_save"]
        })
      });
      alert("Insight saved successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(msg, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careeros-insight-${Date.now()}.json`;
    a.click();
  };

  const renderContent = (raw = "") => {
    if (!raw) return null;
    
    // Parse JSON streams if applicable
    try {
      const data = JSON.parse(raw);
      if (data.type === "intelligence_response") {
        return <div style={{ fontStyle: "italic", color: "#64748b" }}>Structured intelligence processed.</div>;
      }
    } catch (e) {
      if (raw.trim().startsWith('{"type":') && !raw.trim().endsWith('}')) {
         return <div style={{ opacity: 0.7, fontStyle: "italic", color: "#64748b" }}>Compiling intelligence report...</div>;
      }
    }

    // Markdown fallback
    const codeRe = /```(\w*)\n?([\s\S]*?)```/g;
    const parts = [];
    let last = 0, m, i = 0;
    while ((m = codeRe.exec(raw)) !== null) {
      if (m.index > last) {
        parts.push(<div key={`t${i++}`} className="md-content" style={{ fontSize: "15px", color: "#1e293b", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: `<p style='margin:0'>${parseMarkdown(raw.slice(last, m.index))}</p>` }} />);
      }
      parts.push(<CodeBlock key={`c${i++}`} lang={m[1] || "text"} code={m[2].trim()} />);
      last = codeRe.lastIndex;
    }
    if (last < raw.length) {
      parts.push(<div key={`te${i++}`} className="md-content" style={{ fontSize: "15px", color: "#1e293b", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: `<p style='margin:0'>${parseMarkdown(raw.slice(last))}</p>` }} />);
    }
    return parts;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: "16px",
        marginBottom: "32px",
        width: "100%",
        padding: "0 40px",
        opacity: isDragging ? 0.5 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
        background: isUser ? "#f1f5f9" : "#ffffff",
        border: isUser ? "none" : "1px solid #e2e8f0",
        boxShadow: isUser ? "none" : "0 4px 12px rgba(15,23,42,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center", color: isUser ? "#475569" : "#6D5DFC", fontWeight: "700"
      }}>
        {isUser ? "U" : <Sparkles size={18} />}
      </div>

      <div 
        ref={isUser ? null : drag}
        style={{
          position: "relative",
          maxWidth: "75%",
          background: isUser ? "#f8fafc" : "#ffffff",
          border: isUser ? "1px solid #e2e8f0" : "1px solid #e2e8f0",
          padding: isUser ? "16px 20px" : "24px 32px",
          borderRadius: isUser ? "20px 20px 0 20px" : "24px",
          boxShadow: isUser ? "none" : (isDragging ? "0 10px 20px rgba(109,93,252,0.1)" : "0 8px 24px rgba(15,23,42,0.04)"),
          cursor: !isUser ? "grab" : "default",
          transition: "box-shadow 0.2s"
        }}
      >
        {/* Render Source Badge if AI message and metadata exists */}
        {!isUser && msg.meta && (
          <CopilotSourceBadge 
            source={msg.meta.source} 
            confidence={msg.meta.confidence} 
            latency={msg.meta.latency} 
          />
        )}
        
        {renderContent(msg.message)}

        {/* Action Bar */}
        {!isUser && isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", gap: "8px", marginTop: "20px", paddingTop: "12px", borderTop: "1px solid #f1f5f9"
            }}
          >
            <ActionButton icon={<Save size={14} />} label="Save Insight" onClick={handleSaveInsight} />
            <ActionButton icon={<Download size={14} />} label="Export" onClick={handleExport} />
            <div style={{ marginLeft: "auto", fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center" }}>Drag to workspace</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b",
        padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px",
        cursor: "pointer", transition: "all 0.2s"
      }}
      onMouseEnter={e => { e.currentTarget.style.color="#0f172a"; e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.borderColor="#cbd5e1"; }}
      onMouseLeave={e => { e.currentTarget.style.color="#64748b"; e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.borderColor="#e2e8f0"; }}
    >
      {icon} {label}
    </button>
  );
}

import React, { useState } from "react";
import { Download, RefreshCw, LayoutTemplate, Briefcase, Loader2, AlertTriangle, History, Camera, ChevronDown, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { createSnapshot } from "../../services/resumeService";

export default function ResumeStudioHeader({ healthData, onClear, template, setTemplate, data }) {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [saved, setSaved] = useState(true);

  const score = healthData?.score || 0;
  const scoreColor = score >= 80 ? "#34c759" : score >= 50 ? "#ff9500" : "#ff3b30";

  const handleExportPDF = async () => {
    if (!data) return;
    
    // Apple-like UX: close dropdown immediately
    setExportOpen(false);
    
    setIsExporting(true);
    setValidationError("");
    try {
      const paperElement = document.getElementById("resume-export-root");
      if (!paperElement) throw new Error("Resume preview not found.");
      const outerHtml = paperElement.outerHTML;
      const htmlPayload = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data.personalInfo?.name || "Resume"}</title><style>body,html{margin:0;padding:0;background:#fff}.rs-paper{background:#fff;color:#000;width:210mm;height:297mm;padding:15mm 20mm;font-family:'Inter',sans-serif;box-sizing:border-box}</style></head><body>${outerHtml}</body></html>`;
      const response = await apiClient.post('/api/v1/export/pdf', {
        html_content: htmlPayload,
        filename: `${data.personalInfo?.name || "Resume"}_${template}.pdf`.replace(/\s+/g, '_')
      }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${data.personalInfo?.name || "Resume"}_${template}.pdf`.replace(/\s+/g, '_'));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setValidationError("Export failed. Check your network.");
      setTimeout(() => setValidationError(""), 5000);
    } finally {
      setIsExporting(false);
      setExportOpen(false);
    }
  };

  const handleCreateSnapshot = async () => {
    const res = await createSnapshot(data, healthData, template);
    alert(res ? `Snapshot saved — Version ${res.version}` : "Snapshot failed.");
  };

  return (
    <header className="rs-header">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span className="rs-header-title">CareerOS</span>
        <div style={{ width: 1, height: 16, background: "rgba(0,0,0,0.1)" }} />
        <span style={{ fontSize: 14, color: "#86868b", fontWeight: 500 }}>Resume Studio</span>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#86868b", marginLeft: 8 }}>
            <CheckCircle size={12} />
            Saved
          </div>
        )}
      </div>

      {/* Right: global actions */}
      <div className="rs-header-actions">
        {validationError && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#ff3b30", background: "rgba(255,59,48,0.06)", border: "1px solid rgba(255,59,48,0.2)", padding: "5px 10px", borderRadius: 8 }}>
            <AlertTriangle size={13} />
            {validationError}
          </div>
        )}

        {/* Template Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", borderRight: "1px solid rgba(0,0,0,0.1)" }}>
          <LayoutTemplate size={14} color="#86868b" />
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            style={{ background: "transparent", border: "none", color: "#1d1d1f", fontSize: 13, fontFamily: "inherit", fontWeight: 500, cursor: "pointer", outline: "none", appearance: "none", paddingRight: 4 }}
          >
            <option value="professional">Professional</option>
            <option value="student">Student</option>
            <option value="engineering">Software Engineer</option>
            <option value="modern">Full Stack</option>
            <option value="ai-engineer">AI Engineer</option>
            <option value="data-scientist">Data Scientist</option>
            <option value="executive">Executive</option>
          </select>
          <ChevronDown size={12} color="#86868b" />
        </div>

        <button className="rs-btn rs-btn-outline" onClick={() => document.dispatchEvent(new CustomEvent('toggle-version-history'))}>
          <History size={14} />
          History
        </button>

        <button className="rs-btn rs-btn-outline" onClick={() => { alert("Link copied!"); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          Share
        </button>

        <button className="rs-btn rs-btn-primary" onClick={() => setExportOpen(true)}>
          {isExporting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={14} />}
          {isExporting ? "Exporting..." : "Export"}
        </button>

        {/* Export Modal Sheet */}
        {exportOpen && (
          <div className="rs-modal-overlay" onClick={() => setExportOpen(false)}>
            <div className="rs-export-sheet" onClick={(e) => e.stopPropagation()}>
              <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.01em" }}>Export Resume</h3>
                <button onClick={() => setExportOpen(false)} style={{ background: "rgba(0,0,0,0.05)", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1d1d1f" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div style={{ padding: "16px" }}>
                {[
                  { label: "Export as PDF", sub: "Best for applications", action: handleExportPDF, icon: <Download size={18} color="#0071e3" /> },
                  { label: "Export as DOCX", sub: "Editable Word Document", action: () => { alert("CareerOS Pro required."); setExportOpen(false); }, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bf5af2" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
                  { label: "Copy Public Link", sub: "Share your live profile", action: () => { alert("Link copied!"); setExportOpen(false); }, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", padding: "16px", background: "none", border: "none", borderRadius: 16, cursor: "pointer", textAlign: "left", transition: "background 0.2s ease" }} onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"} onMouseOut={e => e.currentTarget.style.background = "none"}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "rgba(0,0,0,0.03)" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f", marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: "#86868b" }}>{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

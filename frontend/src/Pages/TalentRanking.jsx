import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Users, BarChart3, Filter } from "lucide-react";
import { talentRankingService } from "../services/talentRankingService";
import TalentIntelligenceCommandCenter from "../components/TalentRanking/TalentIntelligenceCommandCenter";

export default function TalentRanking() {
  const [resumeFiles, setResumeFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf" || f.type.includes("wordprocessingml")
    );
    if (files.length > 500) {
      setErrorMessage("Maximum batch size is 500 resumes.");
      return;
    }
    setResumeFiles([...resumeFiles, ...files].slice(0, 500));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 500) {
      setErrorMessage("Maximum batch size is 500 resumes.");
      return;
    }
    setResumeFiles([...resumeFiles, ...files].slice(0, 500));
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...resumeFiles];
    newFiles.splice(index, 1);
    setResumeFiles(newFiles);
  };

  const handleBatchAnalyze = async () => {
    if (resumeFiles.length === 0 || !jobDescription.trim()) return;

    setStatus("processing");
    setErrorMessage("");

    const formData = new FormData();
    resumeFiles.forEach((file) => formData.append("resumes", file));
    formData.append("job_description", jobDescription);

    try {
      const data = await talentRankingService.batchAnalyze(formData);
      setIntelligenceData(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.detail || "Failed to process candidate batch. Please verify inputs."
      );
    }
  };

  if (status === "success" && intelligenceData) {
    return <TalentIntelligenceCommandCenter data={intelligenceData} reset={() => setStatus("idle")} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      padding: "120px 24px 60px",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Outfit', sans-serif"
    }}>
      <div style={{ maxWidth: 900, width: "100%", position: "relative", zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            padding: "6px 12px", 
            background: "rgba(124, 58, 237, 0.1)", 
            borderRadius: 100,
            color: "#7c3aed",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            marginBottom: 16
          }}>
            <Users size={14} /> FLAGSHIP ENTERPRISE MODULE
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#0f0f0f", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Talent Intelligence Platform
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#4b5563", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Upload up to 500 resumes alongside a Job Description. CareerOS will deterministically evaluate, rank, and segment every candidate.
          </p>
        </div>

        {/* Input Card */}
        <div style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.05)"
        }}>
          
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} /> 1. Paste Job Description
          </h3>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here (Requirements, Responsibilities, Nice-to-haves)..."
            style={{
              width: "100%",
              height: 180,
              padding: 16,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.5)",
              fontSize: "0.95rem",
              color: "#1f2937",
              resize: "vertical",
              marginBottom: 32,
              outline: "none",
              fontFamily: "inherit"
            }}
          />

          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={18} /> 2. Upload Candidate Batch (PDF/DOCX)
          </h3>
          
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            style={{
              border: "2px dashed rgba(124, 58, 237, 0.3)",
              borderRadius: 16,
              padding: "40px 24px",
              textAlign: "center",
              background: "rgba(124, 58, 237, 0.02)",
              cursor: "pointer",
              marginBottom: 24,
              transition: "all 0.2s"
            }}
          >
            <UploadCloud size={40} style={{ color: "#7c3aed", margin: "0 auto 16px" }} />
            <p style={{ fontWeight: 500, color: "#374151", marginBottom: 8 }}>
              Drag and drop up to 500 resumes here
            </p>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: 16 }}>
              Supports PDF and DOCX formats.
            </p>
            <input 
              type="file" 
              multiple 
              accept=".pdf,.docx" 
              onChange={handleFileSelect} 
              id="batch-upload" 
              style={{ display: "none" }} 
            />
            <label 
              htmlFor="batch-upload" 
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.1)",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#374151",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            >
              Browse Files
            </label>
          </div>

          {/* File Queue */}
          {resumeFiles.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#4b5563" }}>
                  {resumeFiles.length} Candidate(s) Queued
                </span>
                <button 
                  onClick={() => setResumeFiles([])}
                  style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.8rem", cursor: "pointer", fontWeight: 500 }}
                >
                  Clear All
                </button>
              </div>
              <div style={{ 
                maxHeight: 150, 
                overflowY: "auto", 
                border: "1px solid rgba(0,0,0,0.05)", 
                borderRadius: 8, 
                background: "rgba(255,255,255,0.5)" 
              }}>
                {resumeFiles.map((file, i) => (
                  <div key={i} style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "8px 12px",
                    borderBottom: i !== resumeFiles.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none"
                  }}>
                    <span style={{ fontSize: "0.8rem", color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {file.name}
                    </span>
                    <button 
                      onClick={() => handleRemoveFile(i)}
                      style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}
                    >
                      <AlertTriangle size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding: 16,
                  borderRadius: 12,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  marginBottom: 24,
                  textAlign: "center"
                }}
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <button
            onClick={handleBatchAnalyze}
            disabled={status === "processing" || resumeFiles.length === 0 || !jobDescription.trim()}
            style={{
              width: "100%",
              padding: 16,
              background: status === "processing" ? "#9ca3af" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: "1.05rem",
              fontWeight: 600,
              cursor: (status === "processing" || resumeFiles.length === 0 || !jobDescription.trim()) ? "not-allowed" : "pointer",
              boxShadow: status === "processing" ? "none" : "0 8px 16px rgba(16, 185, 129, 0.2)",
              transition: "all 0.2s"
            }}
          >
            {status === "processing" ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span className="spinner" style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                Processing {resumeFiles.length} Candidates...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <BarChart3 size={20} /> Run Intelligence Batch
              </span>
            )}
          </button>
          
          {status === "processing" && (
            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6b7280", marginTop: 16 }}>
              This may take several minutes depending on the batch size. Please do not close the window.
            </p>
          )}

        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { calculateIdentityScore } from "../services/identityScoreEngine";
import { updateCareerMemory } from "../services/careerMemoryService";
import { saveResumeToDB, loadLatestResume } from "../services/resumeService";
import { motion } from "framer-motion";
// Removed HomeComponents imports
import ResumeStudioHeader from "../components/ResumeStudio/ResumeStudioHeader";
import CreationMethods from "../components/ResumeStudio/CreationMethods";
import LeftPanelBuilder from "../components/ResumeStudio/LeftPanelBuilder";
import CenterPreview from "../components/ResumeStudio/CenterPreview";
import RightPanelIntelligence from "../components/ResumeStudio/RightPanelIntelligence";
import VersionHistoryPanel from "../components/ResumeStudio/VersionHistoryPanel";
import "../components/ResumeStudio/styles/resumeStudio.css";

const defaultResumeData = {
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
    image: "",
  },
  professionalSummary: {
    summary: "",
    objective: "",
    targetRole: "",
    yearsOfExperience: "",
    industryFocus: "",
  },
  education: [],
  internships: [],
  projects: [],
  technicalSkills: {
    languages: "",
    frontend: "",
    backend: "",
    databases: "",
    aiMl: "",
    tools: "",
    cloud: "",
    devOps: "",
    coreSubjects: "",
    softSkills: "",
  },
  achievements: [],
  certifications: []
};

export default function ResumeStudio() {
  const [hasStarted, setHasStarted] = useState(false);
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [template, setTemplate] = useState("professional"); // professional, engineering, modern
  const [healthData, setHealthData] = useState({ score: 0, healthLabel: "Pending", strengths: [], weakAreas: [], suggestions: [] });

  // Load from MongoDB or localStorage on mount
  useEffect(() => {
    const initializeStudio = async () => {
      // 1. Try DB first
      const dbResume = await loadLatestResume("anonymous");
      if (dbResume && dbResume.content) {
        setResumeData(dbResume.content);
        if (dbResume.template) setTemplate(dbResume.template);
        setHasStarted(true);
        return;
      }

      // 2. Fallback to local storage
      const saved = localStorage.getItem("resumeData");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setResumeData(parsed);
          setHasStarted(true);
        } catch (e) {
          console.error("Error parsing saved resume:", e);
        }
      }
    };
    initializeStudio();
  }, []);

  // Autosave to localStorage and recalculate health on data change
  useEffect(() => {
    if (hasStarted) {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
      
      const newHealth = calculateIdentityScore(resumeData);
      setHealthData(newHealth);

      const timeoutId = setTimeout(() => {
        updateCareerMemory(resumeData, newHealth);
        saveResumeToDB(resumeData, newHealth, template);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [resumeData, hasStarted]);

  const handleStartManual = () => {
    setHasStarted(true);
  };

  const handleGenerateSuccess = (draft) => {
    setResumeData(draft);
    setHasStarted(true);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all resume data?")) {
      setResumeData(defaultResumeData);
      localStorage.removeItem("resumeData");
      setHasStarted(false);
      setHealthData({ score: 0, healthLabel: "Pending", strengths: [], weakAreas: [], suggestions: [] });
    }
  };

  const handleRestoreVersion = (restoredData, restoredTemplate) => {
    setResumeData(restoredData);
    setTemplate(restoredTemplate);
  };

  return (
    <div className="resume-studio-container">
      {/* Background components removed to match Apple aesthetic */}

      <ResumeStudioHeader 
        healthData={healthData} 
        onClear={handleClearData}
        template={template}
        setTemplate={setTemplate}
        data={resumeData}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        {!hasStarted ? (
          <CreationMethods onStartManual={handleStartManual} onGenerateSuccess={handleGenerateSuccess} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Professional Intelligence Header (Hero Layer) */}
            <div className="rs-hero-layer">
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f" }}>
                Professional Intelligence Profile
              </h1>
              <div style={{ fontSize: 16, color: "#86868b", marginBottom: 4 }}>
                {resumeData.personalInfo?.title || "Professional"}
              </div>
              <div className="rs-hero-indicators">
                <div className="rs-indicator-pill">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34c759' }} />
                  Career Readiness: {healthData.score || 78}
                </div>
                <div className="rs-indicator-pill">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34c759' }} />
                  Engineering Maturity: 82
                </div>
                <div className="rs-indicator-pill">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0071e3' }} />
                  Recruiter Trust: 88
                </div>
                <div className="rs-indicator-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                  GitHub Verified
                </div>
              </div>
            </div>

            <div className="rs-workspace">
              <LeftPanelBuilder 
                data={resumeData} 
                onChange={setResumeData}
                healthData={healthData}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", height: "100%", overflowY: "auto" }}>
                <CenterPreview 
                  data={resumeData} 
                  template={template} 
                />
              </div>
              <div className="rs-panel rs-right-panel">
                <RightPanelIntelligence healthData={healthData} data={resumeData} onChange={setResumeData} />
              </div>
            </div>

            {/* Permanent Bottom Timeline */}
            <VersionHistoryPanel onRestore={handleRestoreVersion} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

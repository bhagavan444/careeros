import { useState } from 'react';
import { uploadResumeDocument } from '../services/predictService';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useTelemetry } from '../context/TelemetryContext';

import apiClient from '../services/apiClient';

export function useResumeAnalysis() {
  const [status, setStatus] = useState('idle'); // idle, uploading, parsing, analyzing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  
  const globalResume = useIntelligenceStore(state => state.resumeData);
  const setGlobalResume = useIntelligenceStore(state => state.setResumeData);
  const globalDomain = useIntelligenceStore(state => state.currentDomain);
  const setGlobalDomain = useIntelligenceStore(state => state.setDomain);
  const globalAnalysis = useIntelligenceStore(state => state.resumeAnalysis);
  const setGlobalAnalysis = useIntelligenceStore(state => state.setResumeAnalysis);

  const [resumeFile, setResumeFile] = useState(globalResume);
  const [domain, setDomain] = useState(globalDomain || "");
  const [interest, setInterest] = useState("");
  const [useAI, setUseAI] = useState(true);
  const [result, setResult] = useState(globalAnalysis);
  
  const [targetDisplayScore, setTargetDisplayScore] = useState(globalAnalysis ? globalAnalysis.ats_score : 0);
  const [targetDisplayCallback, setTargetDisplayCallback] = useState(globalAnalysis?.competitiveness?.interviewProbability || 0);

  const { addLog, setRealTimeMetrics } = useTelemetry();

  const handleFile = (f) => {
    setResumeFile(f);
    setResult(null);
    setStatus('idle');
    setErrorMsg('');
    if (f) {
      addLog(`File payload registered: "${f.name}" (${(f.size/1024).toFixed(1)} KB).`, "IO");
    }
  };

  const submit = async () => {
    if (!resumeFile) {
      setErrorMsg("Please select a resume file first.");
      return;
    }
    setErrorMsg("");
    
    try {
      setStatus('uploading');
      addLog(`Initializing document upload stream...`, "PIPELINE");
      
      const docId = await uploadResumeDocument(resumeFile);
      addLog(`Document uploaded successfully. ID: ${docId}. Starting Backend Engines...`, "PIPELINE");
      
      setStatus('analyzing');
      addLog(`Connecting to Intelligence Engine at ${apiClient.defaults.baseURL}/api/v1/resume/analyze...`, "PIPELINE");
      
      const response = await apiClient.post("/api/v1/resume/analyze", {
        doc_id: docId,
        target_role: domain || "General Tech Role"
      });
      
      const rawRes = response.data;
      console.log("FULL BACKEND RESPONSE:", rawRes);
      
      if (!rawRes) throw new Error("Backend did not return final payload.");
      
      const normalizedData = {
          // Keep all original fields so we don't break sub-components
          ...rawRes,
          
          // Normalized root properties for Predict.jsx top-level cards
          atsScore: rawRes.ats_score || 0,
          recruiterTrust: rawRes.recruiter_trust_score || rawRes.recruiter?.trust_score || rawRes.recruiter_metrics?.recruiter_trust_score || 0,
          projectComplexity: rawRes.project_complexity_score || rawRes.metrics?.project_complexity || rawRes.project_metrics?.project_complexity_index || 0,
          engineeringMaturity: rawRes.engineering_maturity_score || rawRes.maturity?.score || rawRes.maturity_metrics?.engineering_maturity_index || 0,
          projectTier: rawRes.project_tier || rawRes.project_metrics?.complexity_tier?.split('(')[0]?.trim() || "Unknown",
          engineeringLevel: rawRes.engineering_level || rawRes.maturity_metrics?.maturity_level?.split('/')[0]?.trim() || "Unknown",
          marketPercentile: rawRes.benchmark_metrics?.percentile || rawRes.competitiveness?.percentile || 0,
          marketComparison: rawRes.benchmark_metrics?.comparison || rawRes.competitiveness?.comparison || "Heuristic Benchmark",
          telemetry: rawRes.telemetry || {},
          strongMatches: rawRes.matched_skills || rawRes.strong_matches || [],
          missingSkills: rawRes.missing_skills || [],
          recruiterSummary: rawRes.improvement_suggestions || rawRes.recruiter_summary || []
      };
      
      const finalRes = normalizedData;
      
      // Update Real Intelligence Context
      setResult(finalRes);
      setGlobalAnalysis(finalRes);
      setGlobalResume(resumeFile);
      setGlobalDomain(domain);
      setTargetDisplayScore(finalRes.ats_score || 0);
      setTargetDisplayCallback(finalRes.competitiveness?.interviewProbability || 0);
      setStatus('success');
      addLog(`Analysis pipeline complete. ATS Score finalized at ${finalRes.ats_score}.`, "SUCCESS");

    } catch (err) {
      console.error("Pipeline Error:", err);
      
      let finalMessage = err.message || "Backend intelligence engine failed.";
      let errorType = "SERVER_CRASH";
      
      // Specifically target network disconnects
      if (err.message === "Network Error" || err.message === "Failed to fetch") {
          errorType = "BACKEND_OFFLINE_OR_TIMEOUT";
          finalMessage = "Network connection failed or timed out. If deployed on a serverless/free tier, the backend may still be warming up. Please try again.";
      } else if (err.message.includes("API_ROUTE_NOT_FOUND")) {
          errorType = "PROXY_FAILURE";
      }

      addLog(`Backend pipeline crashed: [${errorType}] ${finalMessage}`, "ERROR");
      setErrorMsg(`[${errorType}] ${finalMessage}`);
      setStatus('error');
    }
  };

  const reset = () => {
    setResult(null);
    setStatus('idle');
  };

  return {
    status,
    errorMsg,
    resumeFile,
    handleFile,
    domain,
    setDomain,
    interest,
    setInterest,
    useAI,
    setUseAI,
    result,
    targetDisplayScore,
    setTargetDisplayScore,
    targetDisplayCallback,
    setTargetDisplayCallback,
    submit,
    reset
  };
}

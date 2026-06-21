/**
 * resumeService.js
 * 
 * Manages the persistence of Resume Studio drafts and versions in MongoDB.
 */

import apiClient from "./apiClient";

export const saveResumeToDB = async (resumeData, healthData, template) => {
  if (!resumeData) return null;

  const payload = {
    user_id: "anonymous", // In a real app, use auth context
    resume_id: localStorage.getItem("current_resume_id") || null,
    content: resumeData,
    template: template,
    identity_score: healthData?.score || 0
  };

  try {
    const res = await apiClient.post('/api/v1/resume-studio/save', payload);
    const data = res.data;
    if (data.status === "success" && data.resume_id) {
      localStorage.setItem("current_resume_id", data.resume_id);
      return data;
    }
    return null;
  } catch (err) {
    console.error("Failed to autosave resume to MongoDB", err);
    return null;
  }
};

export const loadLatestResume = async (userId = "anonymous") => {
  try {
    const res = await apiClient.get(`/api/v1/resume-studio/list/${userId}`);
    if (res.data.status === "success" && res.data.data.length > 0) {
      // Get the most recently updated resume
      const latest = res.data.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
      
      localStorage.setItem("current_resume_id", latest._id);
      return {
        content: latest.content,
        template: latest.template || "professional",
        identity_score: latest.identity_score || 0
      };
    }
    return null;
  } catch (err) {
    console.error("Failed to load latest resume", err);
    return null;
  }
};

export const createSnapshot = async (resumeData, healthData, template) => {
  const resumeId = localStorage.getItem("current_resume_id");
  if (!resumeId) return null;

  const payload = {
    resume_id: resumeId,
    content: resumeData,
    template: template,
    identity_score: healthData?.score || 0
  };

  try {
    const res = await apiClient.post('/api/v1/resume-studio/snapshot', payload);
    return res.data;
  } catch (err) {
    console.error("Failed to create snapshot", err);
    return null;
  }
};

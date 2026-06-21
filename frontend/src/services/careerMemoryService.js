/**
 * careerMemoryService.js
 * 
 * Manages the persistence of extracted professional identity signals.
 * This ensures the rest of CareerOS (Interview Intelligence, Roadmaps)
 * has access to the user's latest identity context.
 */

import apiClient from "./apiClient";

export const updateCareerMemory = async (resumeData, healthData) => {
  if (!resumeData) return;

  const memoryPayload = {
    user_id: "anonymous", // In a real app, grab from auth context
    targetRole: resumeData.professionalSummary?.targetRole || "",
    identityScore: healthData?.score || 0,
    strengths: healthData?.strengths || [],
    skillGaps: healthData?.weakAreas || [],
    education: resumeData.education || [],
    internships: resumeData.internships || [],
    projects: resumeData.projects || [],
    skills: resumeData.technicalSkills || {},
    achievements: resumeData.achievements || [],
    certifications: resumeData.certifications || [],
  };

  try {
    // 1. Sync to MongoDB Memory Layer
    await apiClient.post('/api/v1/career-memory/sync', memoryPayload);
    
    // 2. Trigger Career DNA generation in the background based on this memory
    apiClient.post('/api/v1/career-dna/generate/anonymous', memoryPayload).catch(e => console.error("DNA Gen Error", e));
    
    console.log("CareerOS MongoDB Memory Synced");
  } catch (err) {
    console.error("Failed to sync Career Memory to MongoDB", err);
  }
};

export const getCareerMemory = async (userId = "anonymous") => {
  try {
    const res = await apiClient.get(`/api/v1/career-memory/${userId}`);
    return res.data.status === "success" ? res.data.data : null;
  } catch (err) {
    return null;
  }
};

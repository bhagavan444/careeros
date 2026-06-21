import apiClient from "./apiClient";

export const recruiterIntelligenceService = {
  /**
   * Analyzes a candidate against a job description.
   * @param {FormData} formData - Contains 'resume' (File), 'job_description' (string), and optional 'github', 'linkedin', 'portfolio'
   */
  analyzeDirect: async (formData) => {
    try {
      const response = await apiClient.post('/api/v1/recruiter-intelligence/analyze', formData, {
        timeout: 60000 // 60 seconds timeout as this chains multiple LLM/API calls
      });
      return response.data;
    } catch (error) {
      console.error("Recruiter Intelligence V2 Error:", error);
      throw error;
    }
  }
};

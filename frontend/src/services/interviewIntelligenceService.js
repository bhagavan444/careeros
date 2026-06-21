import apiClient from "./apiClient";

export const interviewIntelligenceService = {
  /**
   * Generates a complete Interview Intelligence Blueprint.
   * @param {FormData} formData - Contains 'resume' (File), 'job_description' (string), and optional links.
   */
  generateStrategy: async (formData) => {
    try {
      // Extended timeout as this chains Profile Intelligence -> Recruiter Intelligence -> Interview Intelligence
      const response = await apiClient.post('/api/v1/interview-intelligence/generate', formData, {
        timeout: 90000 
      });
      return response.data;
    } catch (error) {
      console.error("Interview Intelligence Error:", error);
      throw error;
    }
  },

  /**
   * Submits post-interview scores to generate final hiring decision.
   * @param {Object} payload - InterviewOutcomeRequest payload
   */
  submitOutcome: async (payload) => {
    try {
      const response = await apiClient.post('/api/v1/interview-intelligence/outcome', payload);
      return response.data;
    } catch (error) {
      console.error("Interview Outcome Error:", error);
      throw error;
    }
  }
};

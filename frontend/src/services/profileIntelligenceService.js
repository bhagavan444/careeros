import apiClient from './apiClient';

export const profileIntelligenceService = {
  /**
   * Analyzes a candidate based on provided input sources.
   * @param {Object} payload 
   * @param {string} payload.resume (optional) Base64 encoded or text
   * @param {string} payload.github (optional) GitHub username
   * @param {string} payload.linkedin (optional) LinkedIn URL
   * @param {string} payload.portfolio (optional) Portfolio URL
   * @returns {Promise<Object>} The deterministic profile intelligence schema
   */
  analyzeProfile: async (payload) => {
    try {
      const response = await apiClient.post('/api/v1/profile-intelligence/analyze', payload);
      return response.data;
    } catch (error) {
      console.error("Profile Intelligence Analysis Error:", error);
      throw error;
    }
  }
};

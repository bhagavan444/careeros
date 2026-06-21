import apiClient from "./apiClient";

export const talentRankingService = {
  /**
   * Analyzes a batch of candidate resumes against a job description.
   * @param {FormData} formData - Contains multiple 'resumes' (File[]) and 'job_description' (string)
   */
  batchAnalyze: async (formData) => {
    try {
      // 5 minutes timeout to handle processing up to 500 resumes 
      // (Batched with asyncio.Semaphore(5), so 100 loops of ~5 seconds each = 500s)
      const response = await apiClient.post('/api/v1/talent-ranking/batch-analyze', formData, {
        timeout: 600000 
      });
      return response.data;
    } catch (error) {
      console.error("Talent Intelligence Batch Error:", error);
      throw error;
    }
  }
};

import apiClient from './apiClient';

export const safeArr = (v) => (Array.isArray(v) ? v : []);

export const uploadResumeDocument = async (file) => {
  const fd = new FormData();
  fd.append("files", file);
  // Do NOT set Content-Type header manually for FormData.
  // Axios and the browser will automatically set the correct
  // multipart/form-data boundary. Manually setting it strips
  // the boundary parameter and causes FastAPI to reject the upload.
  const uploadRes = await apiClient.post(`/api/v1/documents/upload`, fd);
  return uploadRes.data.documents[0].doc_id;
};

// analyzeResume via SSE is now handled directly in useResumeAnalysis.js hook.

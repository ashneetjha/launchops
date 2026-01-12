import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Named helpers (for old files like Dashboard.jsx)
export const getWork = () => api.get("/work");
export const askAI = (data) => api.post("/ai/analyze", data);
export const extractMetrics = (data) => api.post("/ai/extract-metrics", data);
export const getAlerts = (data) => api.post("/ai/alerts", data);
export const uploadDoc = (data) => api.post("/documents", data);

// Default export (for new files like AI.jsx)
export default api;
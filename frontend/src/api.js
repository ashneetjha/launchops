import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

/* Attach JWT automatically */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* If token is invalid / expired → force logout */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/* Named helpers (for older files) */
export const getWork = () => api.get("/work");
export const askAI = (data) => api.post("/ai/analyze", data);
export const extractMetrics = (data) => api.post("/ai/extract-metrics", data);
export const getAlerts = (data) => api.post("/ai/alerts", data);
export const uploadDoc = (data) => api.post("/documents", data);

export default api;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 15000,
});

// Log de errores centralizado (útil en desarrollo)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[api]", err.config?.url, err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
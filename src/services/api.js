import axios from "axios";

// Normalize baseURL to avoid // double-slash errors in Spring Boot filters
const baseURL = import.meta.env.VITE_API_BASE_URL?.endsWith("/")
  ? import.meta.env.VITE_API_BASE_URL.slice(0, -1)
  : import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: baseURL || "",
  headers: { "Content-Type": "application/json" }
});

// Interceptor for JWT and Absolute URL enforcement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Prevent requests from hitting the SWA domain if baseURL is missing
  if (!config.baseURL && config.url && !config.url.startsWith('http')) {
    console.error("BLOCKING RELATIVE CALL: VITE_API_BASE_URL is not set.");
    return Promise.reject(new Error("Missing API Base URL"));
  }
  return config;
});

// Global 401/403 Handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.warn("Auth Error:", err.response.status, "URL:", err.config.url);
      console.warn("Clearing session and redirecting...");
      localStorage.clear();
      // Only redirect if not already on login page to avoid loops
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/admin")) {
        window.location.href = window.location.pathname.includes("/admindashboard") ? "/admin" : "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

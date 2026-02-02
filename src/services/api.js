import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT is Bearer header based
});

// Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Error Handling: Handle 401/403 and redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Authentication failure. Clearing session...");
      localStorage.clear();
      // Only redirect if not already on login page to avoid loops
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/admin")) {
        window.location.href = window.location.pathname.includes("/admindashboard") ? "/admin" : "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

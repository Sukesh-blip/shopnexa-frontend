import axios from "axios";

// Normalize the base URL to remove trailing slashes
const getBaseURL = () => {
  let url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    console.warn("VITE_API_BASE_URL is not defined. API calls may fail or hit the wrong domain.");
    return "";
  }
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const api = axios.create({
  baseURL: getBaseURL(),
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

    // Safety check: ensure absolute URL if baseURL is missing to avoid calling SWA domain
    if (!config.baseURL && !config.url.startsWith("http")) {
      console.error("Attempted relative API call without baseURL:", config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global Error Handling: Handle 401/403 and redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      console.warn(`Auth failure (${status}). Clearing session...`);
      localStorage.clear();

      // Prevent redirect loops
      const isAuthPage = window.location.pathname.includes("/login") ||
        window.location.pathname.includes("/admin");

      if (!isAuthPage) {
        const redirectPath = window.location.pathname.includes("/admindashboard") ? "/admin" : "/login";
        window.location.href = redirectPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

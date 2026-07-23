import axios from "axios";
import { toast } from "sonner";
import { TOKEN_KEY } from "../utils/constants";
import { removeToken } from "../utils/storage";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/v1`,
  withCredentials: false,
});

// Request interceptor to attach JWT Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor to handle global API errors & expired authentication
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
      // Clear token and handle expired session
      removeToken();

      // Only redirect if user is not already on login or register pages
      if (currentPath !== "/login" && currentPath !== "/register") {
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("Access forbidden: You do not have permission to perform this action.");
    }

    return Promise.reject(error);
  }
);

export default api;

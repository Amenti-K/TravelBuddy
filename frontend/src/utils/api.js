import axios from "axios";
import store from "../store/store"; // Import the store
import { logout } from "../store/slices/authSlice"; // Logout action
import { useNavigate } from "react-router-dom";

// Create Axios instance for JSON requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3300",
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Create separate instance for file uploads
export const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3300",
  timeout: import.meta.env.VITE_API_TIMEOUT || 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

// Add interceptors for both instances
const addInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (!config.url.includes("/signin") && !config.url.includes("/signup")) {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      // Add CORS headers to every request
      config.headers["Access-Control-Allow-Origin"] =
        import.meta.env.VITE_API_URL;
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          store.dispatch(logout());
        }
      }
      return Promise.reject(error);
    }
  );
};

addInterceptors(api);
addInterceptors(uploadApi);

export default api;

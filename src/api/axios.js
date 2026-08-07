import axios from "axios";

// Standard Vite environment variable with Render URL as default fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://library-backend-lv44.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e-commerce-system-production-b11c.up.railway.app", 
  // const BASE_URL = "http://localhost:8080",
  // baseURL:"http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// OPTIONAL: Attach JWT token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

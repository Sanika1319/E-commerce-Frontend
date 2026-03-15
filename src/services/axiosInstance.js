import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://pacific-unity-production.up.railway.app/", // your Spring Boot backend
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

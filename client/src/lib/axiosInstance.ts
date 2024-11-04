import axios from "axios";
import { toast } from "sonner";

const DEV_URL = "http://localhost:9000/api";
const PROD_URL = "https://phoenix-bphc.vercel.app/api";

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error as Error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
        } else if (error.response.status === 403) {
          toast.error("Action not allowed");
        }
      }
    }
    return Promise.reject(error as Error);
  }
);

export default axiosInstance;

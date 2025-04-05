import Axios, { isAxiosError } from "axios";
import Cookies from "js-cookie";

const axiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // ✅ Ensures cookies are sent with requests
});

// 🔹 Request Interceptor - Attach Token from Cookies
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("Authentication"); // ✅ Get token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Attach token
    }
    return config;
  },
  (error) => Promise.reject(error) // ✅ Handle request errors properly
);

export { axiosInstance, isAxiosError };

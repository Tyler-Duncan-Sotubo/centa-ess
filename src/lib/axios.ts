import Axios, { isAxiosError } from "axios";

const axiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // ✅ Ensures cookies are sent with requests
});

// 🔹 Request Interceptor - Attach Token from Cookies
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error) // ✅ Handle request errors properly
);

export { axiosInstance, isAxiosError };

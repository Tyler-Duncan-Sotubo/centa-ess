import { axiosInstance } from "@/lib/axios";

export const fetchCompanyUsers = async () => {
  try {
    const res = await axiosInstance.get("/api/auth/company-users");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const fetchUserProfile = async () => {
  try {
    const res = await axiosInstance.get("/api/auth/profile");
    return res.data.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

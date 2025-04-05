import { axiosInstance } from "@/lib/axios";

export const fetchSalaryBreakdown = async () => {
  try {
    const res = await axiosInstance.get("/api/salary-breakdown");
    return res.data.data ?? [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

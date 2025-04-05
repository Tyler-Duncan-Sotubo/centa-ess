import { axiosInstance } from "@/lib/axios";

export const fetchPayGroup = async () => {
  try {
    const res = await axiosInstance.get("/api/pay-groups");
    return res.data.data ?? [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

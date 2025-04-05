import { axiosInstance } from "@/lib/axios";

export const fetchLoans = async (employee_id: string | undefined) => {
  try {
    const res = await axiosInstance.get(`/api/loans/employee/${employee_id}`);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

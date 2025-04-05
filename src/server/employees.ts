import { axiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const fetchEmployees = async () => {
  try {
    const res = await axiosInstance.get("/api/employees");
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    getErrorMessage(error);
    return [];
  }
};

export const fetchEmployee = async (id: string | undefined) => {
  try {
    const res = await axiosInstance.get(`/api/employee/${id}`);
    return res.data?.data;
  } catch (error) {
    getErrorMessage(error);
    return [];
  }
};

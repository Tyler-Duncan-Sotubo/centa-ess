"use client";

import { axiosInstance } from "@/lib/axios";

export const fetchPayslipSummary = async (id: string | undefined) => {
  try {
    const res = await axiosInstance.get(`/api/employee-payslip-summary/${id}`);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const fetchPayslip = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/api/payslips/${id}`);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const DownloadCompanyPayslip = async (id: string) => {
  try {
    const res = await axiosInstance.get(
      `/api/payslip-download/${id}/internal`,
      {
        responseType: "blob", // Ensure correct handling of file downloads
      }
    );

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `payslips-${id}.csv`; // Adjust filename if needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

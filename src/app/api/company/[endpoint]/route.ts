import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { axiosInstance } from "@/lib/axios"; // Assuming you have axios setup

// Define your fetch functions for various endpoints
const fetchCompany = async (token: string) => {
  const res = await axiosInstance.get("/api/company", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchPaySchedule = async (token: string) => {
  const res = await axiosInstance.get("/api/pay-frequency", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchPayScheduleSummary = async (token: string) => {
  const res = await axiosInstance.get("/api/pay-frequency-summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchNextPayDate = async (token: string) => {
  const res = await axiosInstance.get("/api/next-pay-date", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchCompanyTaxDetails = async (token: string) => {
  const res = await axiosInstance.get("/api/company-tax-details", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchDepartments = async (token: string) => {
  const res = await axiosInstance.get("/api/departments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchGroups = async (token: string) => {
  const res = await axiosInstance.get("/api/pay-groups", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchBonus = async (token: string) => {
  const res = await axiosInstance.get("/api/company-bonuses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const fetchOnboarding = async (token: string) => {
  const res = await axiosInstance.get("/api/onboarding-tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Main handler function for GET requests
export async function GET(request: Request) {
  // Get the session object
  const session = await getServerAuthSession();

  // If session or token is not available, return Unauthorized
  if (!session?.backendTokens?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const endpoint = url.pathname.split("/").pop(); // Extract last part of URL

  try {
    // Set the Authorization header with Bearer token
    const token = session.backendTokens.accessToken;

    // Dynamically handle the endpoint
    let data;
    switch (endpoint) {
      case "company":
        data = await fetchCompany(token);
        break;
      case "pay-frequency":
        data = await fetchPaySchedule(token);
        break;
      case "pay-frequency-summary":
        data = await fetchPayScheduleSummary(token);
        break;
      case "next-pay-date":
        data = await fetchNextPayDate(token);
        break;
      case "company-tax-details":
        data = await fetchCompanyTaxDetails(token);
        break;
      case "departments":
        data = await fetchDepartments(token);
        break;
      case "pay-groups":
        data = await fetchGroups(token);
        break;
      case "company-bonuses":
        data = await fetchBonus(token);
        break;
      case "onboarding-tasks":
        data = await fetchOnboarding(token);
        break;
      default:
        throw new Error("Invalid endpoint");
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { axiosInstance } from "@/lib/axios"; // Assuming you have axios setup

const fetchSalaryBreakdown = async (token: string) => {
  const res = await axiosInstance.get("/api/salary-breakdown", {
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
      case "salary-breakdown":
        data = await fetchSalaryBreakdown(token);
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

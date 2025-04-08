import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { axiosInstance } from "@/lib/axios"; // Assuming you have axios setup

// Define the fetchPayslip function
const fetchPayslip = async (id: string, token: string) => {
  const res = await axiosInstance.get(`/api/loans/employee/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export async function GET(request: Request) {
  // Get the session object
  const session = await getServerAuthSession();

  // If session or token is not available, return Unauthorized
  if (!session?.backendTokens?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop(); // Extract the id from the URL

  // Ensure id is present
  if (!id) {
    return NextResponse.json(
      { error: "Payslip ID is required" },
      { status: 400 }
    );
  }

  const token = session.backendTokens.accessToken;

  try {
    // Fetch payslip with the given ID
    const data = await fetchPayslip(id, token);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payslip" },
      { status: 500 }
    );
  }
}

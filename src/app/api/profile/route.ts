// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { axiosInstance } from "@/lib/axios";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session?.backendTokens?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await axiosInstance.get("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${session.backendTokens.accessToken}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

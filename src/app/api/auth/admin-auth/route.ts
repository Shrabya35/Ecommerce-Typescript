import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helper/authHelper"; // Adjust the path to where verifyToken is
import { cookies } from "next/headers"; // Optional: if using from a shared context

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "No token" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user || user.role !== 1) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

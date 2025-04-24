import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { isAdmin } = await getUserFromRequest(req as NextRequest);
    if (!isAdmin) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

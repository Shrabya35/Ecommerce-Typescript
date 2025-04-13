import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const role = req.cookies.get("role")?.value;

    const isAdmin = role === "admin";

    if (isAdmin) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false }, { status: 200 });
  } catch (error) {
    console.error("Admin check failed:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

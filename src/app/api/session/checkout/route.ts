import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, type: "checkout" },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const response = NextResponse.json({ success: true });

    response.cookies.set("checkout_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Checkout token error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import { verifyToken } from "@/helper/authHelper";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(token.value);

    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error in user", error);
    return NextResponse.json(
      { error: "Error in fetching user", details: error.message },
      { status: 500 }
    );
  }
}

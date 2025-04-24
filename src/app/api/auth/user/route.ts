import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import { getUserFromRequest } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const { user: existingUser } = await getUserFromRequest(req as NextRequest);
    if (!existingUser) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }
    const user = await User.findById(existingUser._id).select("-password");

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

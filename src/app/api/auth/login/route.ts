import { NextResponse } from "next/server";
import User from "@/models/User";
import { comparePassword } from "@/helper/authHelper";
import connectDB from "@/config/connectDB";
import JWT from "jsonwebtoken";

interface LoginRequestBody {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, password, rememberMe }: LoginRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email not registered" },
        { status: 401 }
      );
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = JWT.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: rememberMe ? "30d" : "1d",
      }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error in Login", details: error.message },
      { status: 500 }
    );
  }
}

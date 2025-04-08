import { NextResponse } from "next/server";
import User from "@/models/User";
import { comparePassword } from "@/helper/authHelper";
import connectDB from "@/config/connectDB";
import JWT from "jsonwebtoken";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, password }: LoginRequestBody = await req.json();

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
      { _id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "100y",
      }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error in Login", details: error.message },
      { status: 500 }
    );
  }
}

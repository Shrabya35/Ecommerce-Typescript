import { NextResponse } from "next/server";
import User from "@/models/User";
import { hashPassword } from "@/helper/authHelper";
import connectDB from "@/config/connectDB";
import JWT from "jsonwebtoken";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const { name, email, password, phone }: RegisterRequestBody =
      await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { success: true, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: true, message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
    }).save();

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
        message: "Registration successful",
        user: userWithoutPassword,
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error in Registration", details: error.message },
      { status: 500 }
    );
  }
}

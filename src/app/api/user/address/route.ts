import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/config/connectDB";

interface Address {
  country: string;
  city: string;
  street: string;
  secondary?: string;
  postalCode: string;
}

export async function PATCH(req: Request) {
  await connectDB();
  try {
    const { user } = await getUserFromRequest(req as NextRequest);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const body: Address = await req.json();

    if (!body.country || !body.city || !body.street || !body.postalCode) {
      return NextResponse.json(
        { message: "Missing required address fields" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        tempAddress: {
          country: body.country,
          city: body.city,
          street: body.street,
          secondary: body.secondary,
          postalCode: body.postalCode,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Temporary address updated successfully",
        tempAddress: updatedUser.tempAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating temporary address:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

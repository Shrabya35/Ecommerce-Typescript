import { NextResponse, NextRequest } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/config/connectDB";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  const { user } = await getUserFromRequest(req as NextRequest);

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "User not found",
    });
  }

  const body = await req.json();

  const { order, price, mode } = body;

  if (!order || !price || !mode) {
    return NextResponse.json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const newOrder = new Order({
      order,
      user: user._id,
      price,
      mode,
    });

    await newOrder.save();

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
}

import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/config/connectDB";
import mongoose from "mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  await connectDB();

  try {
    if (!mongoose.models.Product) {
      require("@/models/Product");
    }

    const { user } = await getUserFromRequest(req as NextRequest);

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userToValidate = await User.findById(user._id);
    if (!userToValidate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const order = await Order.findById(id)
      .populate({
        path: "product.product",
        select: "-image",
      })
      .populate({
        path: "user",
        select: "-password -wishlist -shoppingBag -tempAddress",
      });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const orderUserId = order.user._id
      ? order.user._id.toString()
      : order.user.toString();
    if (orderUserId !== user._id.toString()) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error: any) {
    console.error("Error fetching order ", error);
    return NextResponse.json(
      { success: false, message: "Error in fetching order", error },
      { status: 500 }
    );
  }
}

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
    const { isAdmin } = await getUserFromRequest(req as NextRequest);

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

    if (!isAdmin) {
      const orderUserId = order.user._id
        ? order.user._id.toString()
        : order.user.toString();

      if (orderUserId !== user._id.toString()) {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 401 }
        );
      }
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const orderId = params.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const { status } = await req.json();
    if (!status || !["completed", "cancelled"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be 'completed' or 'cancelled'",
        },
        { status: 400 }
      );
    }

    // Authenticate and authorize user
    const { isAdmin, user } = await getUserFromRequest(req);
    if (!user || !mongoose.Types.ObjectId.isValid(user._id)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order status is processing
    if (order.status !== "processing") {
      return NextResponse.json(
        {
          success: false,
          message: "Order status can only be changed if it is 'processing'",
        },
        { status: 400 }
      );
    }

    // Update the status
    order.status = status;
    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: `Order status updated to '${status}'`,
        data: {
          order,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

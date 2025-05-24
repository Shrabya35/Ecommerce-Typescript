import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import Order from "@/models/Order";
import connectDB from "@/config/connectDB";
import { getUserFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

interface SearchParams {
  page: number;
  limit: number;
}

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const params: SearchParams = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "9"),
  };

  const { page, limit } = params;
  const skip = (page - 1) * limit;

  try {
    const { user: existingUser } = await getUserFromRequest(req as NextRequest);

    if (!existingUser) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userToValidate = await User.findById(existingUser._id);
    if (!userToValidate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(existingUser._id);

    const [orders, totalOrders, statusCounts] = await Promise.all([
      Order.find({ user: userId })
        .populate({
          path: "product.product",
          select: "-image",
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Order.countDocuments({ user: userId }),
      Order.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            count: 1,
          },
        },
      ]),
    ]);

    const statusSummary = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    statusCounts.forEach(
      ({ status, count }: { status: string; count: number }) => {
        const normalizedStatus = status.toLowerCase();
        if (normalizedStatus in statusSummary) {
          statusSummary[normalizedStatus as keyof typeof statusSummary] = count;
        }
      }
    );

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json(
      {
        success: true,
        orders,
        page,
        totalPages,
        totalOrders,
        limit,
        statusSummary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

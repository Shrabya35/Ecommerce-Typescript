import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { subMonths, startOfMonth, format } from "date-fns";
import User from "@/models/User";
import Order from "@/models/Order";
import Category from "@/models/Category";
import connectDB from "@/config/connectDB";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
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

    // Total Revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // completed vs cancelled and monthly revenue
    const sixMonthsAgo = subMonths(new Date(), 5);
    const startDate = startOfMonth(sixMonthsAgo);

    const statusAndRevenueRaw = await Order.aggregate([
      {
        $match: {
          status: { $in: ["completed", "cancelled"] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            status: "$status",
          },
          count: { $sum: 1 },
          revenue: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$price", 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const labels: string[] = Array.from({ length: 6 }, (_, i) =>
      format(subMonths(new Date(), 5 - i), "MMM yyyy")
    );

    const completedMap = new Map<string, number>();
    const cancelledMap = new Map<string, number>();
    const revenueMap = new Map<string, number>();

    statusAndRevenueRaw.forEach(({ _id, count, revenue }) => {
      const key = `${_id.month}-${_id.year}`;
      if (_id.status === "completed") {
        completedMap.set(key, count);
        revenueMap.set(key, revenue);
      } else if (_id.status === "cancelled") {
        cancelledMap.set(key, count);
      }
    });

    const completed = labels.map((label) => {
      const [monthName, year] = label.split(" ");
      const month = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
      return completedMap.get(`${month}-${year}`) || 0;
    });

    const cancelled = labels.map((label) => {
      const [monthName, year] = label.split(" ");
      const month = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
      return cancelledMap.get(`${month}-${year}`) || 0;
    });

    const monthlyRevenue = labels.map((label) => {
      const [monthName, year] = label.split(" ");
      const month = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
      return revenueMap.get(`${month}-${year}`) || 0;
    });

    // COD vs eSewa
    const modeCounts = await Order.aggregate([
      { $group: { _id: "$mode", count: { $sum: 1 } } },
    ]);

    const paymentModes = { cod: 0, esewa: 0 };
    modeCounts.forEach((item) => {
      if (item._id === 0) paymentModes.cod = item.count;
      else if (item._id === 1) paymentModes.esewa = item.count;
    });

    // Top selling categories
    const categoryCountsRaw = await Order.aggregate([
      {
        $match: {
          status: { $in: ["completed", "processing"] },
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "products",
          localField: "product.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $match: { productDetails: { $ne: [] } } },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $match: { categoryDetails: { $ne: [] } } },
      { $unwind: "$categoryDetails" },
      {
        $group: {
          _id: "$categoryDetails.name",
          count: { $sum: "$product.quantity" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const topCategories: { [key: string]: number } = { others: 0 };
    categoryCountsRaw.forEach((item, index) => {
      if (index < 4) {
        topCategories[item._id] = item.count;
      } else {
        topCategories.others += item.count;
      }
    });

    return NextResponse.json({
      success: true,
      revenue: {
        total: totalRevenue,
        monthly: { labels, values: monthlyRevenue },
      },
      paymentModes,
      orderStatus: { labels, completed, cancelled },
      topCategories,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

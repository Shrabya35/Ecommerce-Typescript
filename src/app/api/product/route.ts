import Product from "@/models/Product";
import Category from "@/models/Category";
import connectDB from "@/config/connectDB";
import { NextResponse } from "next/server";

interface SearchParams {
  page: number;
  limit: number;
  category?: string;
  type?: string;
}

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const params: SearchParams = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "9"),
    category: searchParams.get("category") || undefined,
    type: searchParams.get("type") || undefined,
  };

  const { page, limit, category, type } = params;
  const skip = (page - 1) * limit;

  let filter: { [key: string]: any } = {};

  if (category) {
    try {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        return NextResponse.json({
          success: false,
          message: "Category not found",
        });
      }
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: "Error fetching category",
        error: error.message,
      });
    }
  }

  if (type) {
    filter.type = type;
  }

  try {
    const products = await Product.find(filter)
      .populate("category")
      .select("-image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      success: false,
      message: "Error in fetching products",
      error: error.message || error,
    });
  }
}

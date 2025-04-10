import Category from "@/models/Category";
import connectDB from "@/config/connectDB";
import { NextResponse } from "next/server";

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
    const Categories = await Category.find().skip(skip).limit(limit);

    const total = await Category.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Categorys fetched successfully",
      Categories,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching Categorys:", error);
    return NextResponse.json({
      success: false,
      message: "Error in fetching Categorys",
      error: error.message || error,
    });
  }
}

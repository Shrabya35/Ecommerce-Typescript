import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";

interface SearchParams {
  page: number;
  limit: number;
  query: string;
}

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const params: SearchParams = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "9"),
    query: searchParams.get("query") || "",
  };

  const { page, limit, query } = params;
  const skip = (page - 1) * limit;

  // Build search regex
  const tokens = query.split(" ").filter(Boolean);
  const searchRegex = tokens.map((token) => new RegExp(`\\b${token}\\b`, "i"));

  const searchQuery = query
    ? {
        $or: [
          { $or: searchRegex.map((r) => ({ name: { $regex: r } })) },
          { $or: searchRegex.map((r) => ({ type: { $regex: r } })) },
        ],
      }
    : {};

  try {
    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .populate("category")
        .select("-image")
        .sort({ createdAt: -1 }),
      Product.countDocuments(searchQuery),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      message: "Paginated products fetched successfully",
      total,
      page,
      pages,
      results: products,
    });
  } catch (error: any) {
    console.error("Error fetching products", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

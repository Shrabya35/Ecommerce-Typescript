import Category from "@/models/Category";
import connectDB from "@/config/connectDB";
import slugify from "slugify";
import { NextResponse, NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

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
    const Categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

export async function POST(req: Request) {
  await connectDB();

  try {
    const { isAdmin } = await getUserFromRequest(req as NextRequest);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: true,
          message: "Category already registered",
        },
        { status: 200 }
      );
    }

    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();

    return NextResponse.json(
      {
        success: true,
        message: "Category registered successfully",
        category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in Category",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

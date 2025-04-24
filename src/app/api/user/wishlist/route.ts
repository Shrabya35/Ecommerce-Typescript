import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/config/connectDB";

interface wishlistParams {
  productId: string;
}
interface SearchParams {
  page: number;
  limit: number;
}

export async function POST(req: Request) {
  const db = await connectDB();

  try {
    const { user: existingUser } = await getUserFromRequest(req as NextRequest);

    if (!existingUser) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }
    const { productId }: wishlistParams = await req.json();

    if (!mongoose.models.Product) {
      console.log("Product model is not registered, registering now");
      require("@/models/Product");
    }

    const user = await User.findById(existingUser._id).populate("wishlist");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.wishlist) {
      user.wishlist = [];
    }

    const isAlreadyAdded = user.wishlist.some(
      (item: mongoose.Types.ObjectId) => item.toString() === productId
    );

    if (isAlreadyAdded) {
      return NextResponse.json(
        { message: "Product already in wishlist" },
        { status: 400 }
      );
    }
    user.wishlist.push(new mongoose.Types.ObjectId(productId));
    await user.save();

    return NextResponse.json(
      {
        message: "Product added to wishlist",
        wishlist: user.wishlist,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding product to wishlist:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await connectDB();

  try {
    const { user: existingUser } = await getUserFromRequest(req as NextRequest);
    if (!existingUser) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { productId }: wishlistParams = await req.json();

    if (!mongoose.models.Product) {
      require("@/models/Product");
    }

    const user = await User.findById(existingUser._id).populate("wishlist");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.wishlist = user.wishlist.filter(
      (item: any) => item._id.toString() !== productId
    );

    await user.save();

    return NextResponse.json(
      { message: "Product removed from wishlist", wishlist: user.wishlist },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing product from wishlist:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
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
        { status: 403 }
      );
    }

    if (!mongoose.models.Product) {
      require("@/models/Product");
    }

    const user = await User.findById(existingUser._id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const populatedUser = await User.findById(existingUser._id).populate({
      path: "wishlist",
      model: "Product",
    });

    if (!populatedUser) {
      return NextResponse.json(
        { message: "User not found after populate" },
        { status: 404 }
      );
    }

    const fullWishlist = populatedUser.wishlist || [];
    const totalWishlistCount = fullWishlist.length;

    const sortedWishlist = [...fullWishlist].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const paginatedWishlist = sortedWishlist.slice(skip, skip + limit);

    return NextResponse.json(
      {
        message: "Wishlist fetched successfully",
        wishlist: paginatedWishlist,
        total: totalWishlistCount,
        page,
        limit,
        totalPages: Math.ceil(totalWishlistCount / limit),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

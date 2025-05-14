import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/config/connectDB";

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

    const body = await req.json();
    const { productId } = body;

    if (
      !productId ||
      typeof productId !== "string" ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    if (!mongoose.models.Product) {
      require("@/models/Product");
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(existingUser._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.shoppingBag) {
      user.shoppingBag = [];
    } else {
      user.shoppingBag = user.shoppingBag.filter(
        (item) =>
          item.product &&
          mongoose.Types.ObjectId.isValid(item.product.toString())
      );
    }

    const isAlreadyAdded = user.shoppingBag.some(
      (item) => item.product && item.product.toString() === productId
    );

    if (isAlreadyAdded) {
      return NextResponse.json(
        { message: "Product already in Shopping Bag" },
        { status: 400 }
      );
    }

    user.shoppingBag.push({
      product: new mongoose.Types.ObjectId(productId),
      quantity: 1,
    });

    await user.save();

    const updatedUser = await User.findById(existingUser._id).populate({
      path: "shoppingBag.product",
      model: "Product",
    });

    return NextResponse.json(
      {
        message: "Product added to shopping bag",
        shoppingBag: updatedUser?.shoppingBag || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding product to shopping bag:", error);
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

    const body = await req.json();
    const { productId } = body;

    if (
      !productId ||
      typeof productId !== "string" ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(existingUser._id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const originalLength = user.shoppingBag.length;

    user.shoppingBag = user.shoppingBag.filter(
      (item: any) => item.product.toString() !== productId
    );

    if (user.shoppingBag.length === originalLength) {
      return NextResponse.json(
        {
          message: "Product not found in shopping bag",
          debug: {
            itemIdToRemove: productId,
            bagItemsBeforeFilter: user.shoppingBag.map((i: any) => ({
              id: i._id?.toString(),
              rawItem: JSON.stringify(i),
            })),
          },
        },
        { status: 404 }
      );
    }

    await user.save();

    const updatedUser = await User.findById(existingUser._id).populate({
      path: "shoppingBag.product",
      model: "Product",
    });

    return NextResponse.json(
      {
        message: "Product removed from shopping bag",
        shoppingBag: updatedUser?.shoppingBag || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error removing product from shopping bag:", error);
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
        { status: 200 }
      );
    }

    if (!mongoose.models.Product) {
      require("@/models/Product");
    }

    if (!mongoose.models.Category) {
      require("@/models/Category");
    }

    const populatedUser = await User.findById(existingUser._id).populate({
      path: "shoppingBag.product",
      model: "Product",
      select: "-image",
      populate: {
        path: "category",
        model: "Category",
        select: "name",
      },
    });

    if (!populatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const fullShoppingBag = populatedUser.shoppingBag || [];
    const totalShoppingBag = fullShoppingBag.length;

    const totals = await populatedUser.calculateCartTotals();

    const sortedShoppingBag = [...fullShoppingBag].sort((a, b) => {
      if (a.product && b.product) {
        return (
          new Date((b.product as any).createdAt).getTime() -
          new Date((a.product as any).createdAt).getTime()
        );
      }
      return 0;
    });

    const paginatedShoppingBag = sortedShoppingBag.slice(skip, skip + limit);

    return NextResponse.json(
      {
        message: "Shopping bag fetched successfully",
        shoppingBag: paginatedShoppingBag,
        subtotal: totals.subtotal,
        estimatedShipping: totals.estimatedShipping,
        totalPrice: totals.total,
        total: totalShoppingBag,
        page,
        limit,
        totalPages: Math.ceil(totalShoppingBag / limit),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching shopping bag:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const { productId, action } = await req.json();
    const { user: existingUser } = await getUserFromRequest(req);

    if (!existingUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const user = await User.findById(existingUser._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const itemIndex = user.shoppingBag.findIndex(
      (item: any) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: "Product not in shopping bag" },
        { status: 400 }
      );
    }

    const shoppingItem = user.shoppingBag[itemIndex];

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const currentQty = shoppingItem.quantity;

    if (action === 1) {
      if (currentQty >= product.quantity) {
        return NextResponse.json(
          { message: "Maximum available stock reached" },
          { status: 200 }
        );
      }
      shoppingItem.quantity += 1;
    } else if (action === 0) {
      if (currentQty <= 1) {
        return NextResponse.json(
          { message: "Minimum quantity is 1" },
          { status: 200 }
        );
      }
      shoppingItem.quantity -= 1;
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await user.save();

    return NextResponse.json({
      message: "Quantity updated",
      shoppingBag: user.shoppingBag,
    });
  } catch (error: any) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

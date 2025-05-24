import { NextResponse, NextRequest } from "next/server";
import mongoose, { ClientSession } from "mongoose";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import connectDB from "@/config/connectDB";
import { getUserFromRequest } from "@/lib/auth";

interface Address {
  country: string;
  city: string;
  street: string;
  secondary?: string;
  postalCode: string;
}

interface OrderParams {
  address: Address;
  mode: 0 | 1;
}

interface UserDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  shoppingBag: { product: mongoose.Types.ObjectId; quantity: number }[];
  tempAddress?: Address;
  calculateCartTotals: () => Promise<{ total: number }>;
}

interface ProductDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
}

interface OrderDoc extends mongoose.Document {
  product: { product: mongoose.Types.ObjectId; quantity: number }[];
  user: mongoose.Types.ObjectId;
  price: number;
  address: Address;
  mode: 0 | 1;
  transactionUuid?: string;
  esewaRefId?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { user: userId } = await getUserFromRequest(req);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId._id)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: OrderParams = await req.json();
    if (!body?.address || body.mode !== 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request parameters" },
        { status: 400 }
      );
    }

    if (
      !body.address.country ||
      !body.address.city ||
      !body.address.street ||
      !body.address.postalCode
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required address fields" },
        { status: 400 }
      );
    }

    const user = (await User.findById(userId._id)) as UserDoc | null;
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.shoppingBag || user.shoppingBag.length === 0) {
      return NextResponse.json(
        { success: false, message: "Shopping bag is empty" },
        { status: 400 }
      );
    }

    const validItems = user.shoppingBag.filter(
      (item) =>
        item &&
        item.product &&
        mongoose.Types.ObjectId.isValid(item.product) &&
        item.quantity > 0
    );

    if (validItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid products in shopping bag" },
        { status: 400 }
      );
    }

    const productPromises = validItems.map((item) =>
      Product.findById(item.product)
    );
    const products = (await Promise.all(
      productPromises
    )) as (ProductDoc | null)[];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const item = validItems[i];
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }
      if (
        typeof product.quantity !== "number" ||
        product.quantity < item.quantity
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for product: ${
              product.name || item.product
            }`,
          },
          { status: 400 }
        );
      }
    }

    const totals = await user.calculateCartTotals();
    if (typeof totals.total !== "number" || totals.total <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid cart total" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    try {
      const populatedOrder = await session.withTransaction(async () => {
        user.tempAddress = body.address;
        await user.save({ session });

        const order = new Order({
          product: validItems.map((item) => ({
            product: item.product,
            quantity: item.quantity,
          })),
          user: user._id,
          price: totals.total,
          address: body.address,
          mode: body.mode,
          transactionUuid: undefined,
          esewaRefId: undefined,
        }) as OrderDoc;

        const updateProductPromises = products.map((product, i) =>
          Product.findByIdAndUpdate(
            product?._id,
            { $inc: { quantity: -validItems[i].quantity } },
            { new: true, session }
          )
        );
        await Promise.all(updateProductPromises);

        user.shoppingBag = [];
        await user.save({ session });

        await order.save({ session });

        return await Order.findById(order._id)
          .populate("product.product")
          .session(session)
          .lean();
      });

      return NextResponse.json(
        {
          success: true,
          order: populatedOrder,
          message: "Order created successfully",
          tempAddress: user.tempAddress,
        },
        { status: 201 }
      );
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process order request",
      },
      { status: 500 }
    );
  }
}

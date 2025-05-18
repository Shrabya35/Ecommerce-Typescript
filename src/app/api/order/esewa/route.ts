import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Product from "@/models/Product";
import connectDB from "@/config/connectDB";
import { getUserFromRequest } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

interface OrderParams {
  address: {
    country: string;
    city: string;
    street: string;
    secondary?: string;
    postalCode: string;
  };
  mode: 1;
}

export function generateEsewaSignature(
  secretKey: string,
  message: string
): string {
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    if (
      !process.env.ESEWA_SCD ||
      !process.env.BASE_URL ||
      !process.env.ESEWA_MERCHANT_CODE ||
      !process.env.ESEWA_SECRET_KEY
    ) {
      throw new Error("Missing eSewa configuration");
    }

    const { user: userId } = await getUserFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: OrderParams = await req.json();

    if (!body.address || body.mode !== 1) {
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

    const user = await User.findById(userId._id);
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
      (item: any) =>
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

    const productPromises = validItems.map((item: any) =>
      Product.findById(item.product)
    );
    const products = await Promise.all(productPromises);

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

    user.tempAddress = body.address;
    try {
      await user.save();
      const updatedUser = await User.findById(userId._id);
      // if (updatedUser) {
      //   console.log("User after save:", {
      //     tempAddress: updatedUser.tempAddress,
      //   });
      // } else {
      //   console.error("Failed to retrieve updated user after save");
      // }
    } catch (saveError: any) {
      console.error("Error saving user.tempAddress:", saveError);
      return NextResponse.json(
        { success: false, message: "Failed to save address" },
        { status: 500 }
      );
    }

    const transactionUuid = uuidv4();

    const esewaConfig = {
      amount: totals.total,
      tax_amount: 0,
      total_amount: totals.total,
      transaction_uuid: transactionUuid,
      product_code: process.env.ESEWA_MERCHANT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.BASE_URL}/api/order/esewa/verify?success=true&userId=${userId._id}`,
      failure_url: `${process.env.BASE_URL}/api/order/esewa/verify?success=false&userId=${userId._id}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
    const signature = generateEsewaSignature(
      process.env.ESEWA_SECRET_KEY,
      signatureString
    );

    const redirect = `https://rc.esewa.com.np/epay/main?amt=${
      esewaConfig.amount
    }&tAmt=${esewaConfig.total_amount}&txAmt=${esewaConfig.tax_amount}&pdc=${
      esewaConfig.product_delivery_charge
    }&psc=${esewaConfig.product_service_charge}&pid=${
      esewaConfig.transaction_uuid
    }&scd=${process.env.ESEWA_SCD}&su=${encodeURIComponent(
      esewaConfig.success_url
    )}&fu=${encodeURIComponent(
      esewaConfig.failure_url
    )}&sig=${encodeURIComponent(signature)}`;

    return NextResponse.json({
      success: true,
      redirect,
      transactionUuid,
      orderDetails: {
        items: validItems,
        total: totals.total,
        address: body.address,
      },
    });
  } catch (error: any) {
    console.error("eSewa order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to process payment request",
      },
      { status: 500 }
    );
  }
}

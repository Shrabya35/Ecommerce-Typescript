import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";
import connectDB from "@/config/connectDB";
import axios from "axios";

export async function GET(req: NextRequest) {
  let session: mongoose.ClientSession | null = null;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const transactionUuid = searchParams.get("oid");
    const amount = searchParams.get("amt");
    const refId = searchParams.get("refId");
    const userId = searchParams.get("userId");
    const success = searchParams.get("success") === "true";

    if (!transactionUuid || !amount || !refId || !userId) {
      return NextResponse.redirect(
        new URL("/checkout/failure", process.env.BASE_URL || "")
      );
    }

    if (!process.env.ESEWA_MERCHANT_CODE || !process.env.BASE_URL) {
      return NextResponse.redirect(
        new URL("/checkout/failure", process.env.BASE_URL || "")
      );
    }

    session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!success) {
        await session.abortTransaction();
        return NextResponse.redirect(
          new URL("/checkout/failure", process.env.BASE_URL || "")
        );
      }

      const user = await User.findById(userId).session(session);
      if (!user) {
        await session.abortTransaction();
        return NextResponse.redirect(
          new URL("/checkout/failure", process.env.BASE_URL || "")
        );
      }

      if (
        !user.tempAddress ||
        !user.tempAddress.country ||
        !user.tempAddress.city ||
        !user.tempAddress.street ||
        !user.tempAddress.postalCode
      ) {
        await session.abortTransaction();
        return NextResponse.redirect(
          new URL("/checkout/failure", process.env.BASE_URL || "")
        );
      }

      let paymentVerified = false;

      if (process.env.NODE_ENV === "development" && refId) {
        console.log(
          "Development mode: Skipping eSewa API verification and using refId directly"
        );
        paymentVerified = true;
      } else {
        const cleanAmount = parseFloat(amount).toFixed(0);
        const verificationParams = {
          product_code: process.env.ESEWA_MERCHANT_CODE,
          total_amount: cleanAmount,
          transaction_uuid: transactionUuid,
        };

        try {
          const statusResponse = await axios.get(
            "https://rc.esewa.com.np/api/epay/transaction/status/",
            {
              params: verificationParams,
              headers: { "Content-Type": "application/json" },
            }
          );

          console.log("eSewa API response:", statusResponse.data);

          if (
            statusResponse.data &&
            statusResponse.data.status === "COMPLETE"
          ) {
            paymentVerified = true;
          } else {
            console.error("Payment not successful according to eSewa", {
              status: statusResponse.data?.status,
            });
          }
        } catch (apiError: any) {
          console.error("eSewa API error:", apiError.message);
          if (apiError.response) {
            console.error("API response:", apiError.response.data);
          }
        }
      }

      if (!paymentVerified) {
        await session.abortTransaction();
        return NextResponse.redirect(
          new URL("/checkout/failure", process.env.BASE_URL || "")
        );
      }

      if (!user.shoppingBag || user.shoppingBag.length === 0) {
        await session.abortTransaction();
        return NextResponse.redirect(
          new URL("/checkout/failure", process.env.BASE_URL || "")
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
        await session.abortTransaction();
        return NextResponse.redirect(
          new URL("/checkout/failure", process.env.BASE_URL || "")
        );
      }

      const productPromises = validItems.map((item: any) =>
        Product.findById(item.product).session(session)
      );
      const products = await Promise.all(productPromises);

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const item = validItems[i];
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        if (
          typeof product.quantity !== "number" ||
          product.quantity < item.quantity
        ) {
          throw new Error(
            `Insufficient stock for product: ${product.name || item.product}`
          );
        }
        product.quantity -= item.quantity;
        await product.save({ session });
      }

      const newOrder = new Order({
        user: userId,
        product: validItems,
        price: parseFloat(amount),
        address: user.tempAddress,
        mode: 1,
        status: "processing",
        transactionUuid,
        esewaRefId: refId,
      });

      await newOrder.save({ session });

      user.shoppingBag = [];
      user.tempAddress = undefined;
      await user.save({ session });

      await session.commitTransaction();

      const successUrl = new URL(
        `/checkout/success?method=esewa`,
        process.env.BASE_URL || ""
      );

      return NextResponse.redirect(successUrl);
    } catch (error: any) {
      console.error("Order processing error:", error.message);

      if (session && session.inTransaction()) {
        await session.abortTransaction();
      }

      return NextResponse.redirect(
        new URL("/checkout/failure", process.env.BASE_URL || "")
      );
    }
  } catch (error: any) {
    console.error("eSewa verification error:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }

    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    return NextResponse.redirect(
      new URL("/checkout/failure", process.env.BASE_URL || "")
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

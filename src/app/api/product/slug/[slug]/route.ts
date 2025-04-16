import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";

interface ProductParams {
  slug: string;
}

export async function GET(req: Request, { params }: { params: ProductParams }) {
  const { slug } = params;

  await connectDB();

  try {
    const product = await Product.findOne({ slug })
      .populate("category")
      .select("-image");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error fetching product ", error);
    return NextResponse.json(
      { success: false, message: "Error in fetching product", error },
      { status: 500 }
    );
  }
}

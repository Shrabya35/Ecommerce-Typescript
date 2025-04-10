import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Product from "@/models/Product";

interface ProductParams {
  pid: string;
}

export async function GET(req: Request, context: { params: ProductParams }) {
  const params = await context.params;
  const { pid } = params;

  await connectDB();

  try {
    const product = await Product.findById(pid).select("image");

    if (!product || !product.image?.data) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    const { image } = product;
    const buffer = image.data;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": image.contentType || "application/octet-stream",
      },
    });
  } catch (error: any) {
    console.error("Error fetching product photo:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching product's image",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

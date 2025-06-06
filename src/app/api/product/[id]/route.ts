import Product from "@/models/Product";
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/config/connectDB";
import slugify from "slugify";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { isAdmin } = await getUserFromRequest(req as NextRequest);

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const type = formData.get("type")?.toString();
    const description = formData.get("description")?.toString();
    const price = formData.get("price")?.toString();
    const discount = formData.get("discount")?.toString();
    const category = formData.get("category")?.toString();
    const quantity = formData.get("quantity")?.toString();
    const image = formData.get("image") as File | null;

    switch (true) {
      case !name:
        return NextResponse.json(
          { error: "Name is required" },
          { status: 400 }
        );
      case !type:
        return NextResponse.json(
          { error: "Type is required" },
          { status: 400 }
        );
      case !description:
        return NextResponse.json(
          { error: "Description is required" },
          { status: 400 }
        );
      case !price:
        return NextResponse.json(
          { error: "Price is required" },
          { status: 400 }
        );
      case !category:
        return NextResponse.json(
          { error: "Category is required" },
          { status: 400 }
        );
      case !quantity:
        return NextResponse.json(
          { error: "Quantity is required" },
          { status: 400 }
        );
      case image && image.size === 0:
        return NextResponse.json(
          { error: "Image is required" },
          { status: 400 }
        );
      case image && image.size > 1_000_000:
        return NextResponse.json(
          { error: "Image's size should be smaller than 1 MB" },
          { status: 400 }
        );
    }

    const numericPrice = parseFloat(price!);
    const numericDiscount = discount ? parseFloat(discount) : 0;

    let discountedPrice;
    if (numericDiscount > 0) {
      discountedPrice = Math.floor(
        numericPrice - (numericPrice * numericDiscount) / 100
      );
    }

    const updateFields: any = {
      name,
      slug: slugify(name!),
      type,
      description,
      price: numericPrice,
      discount: numericDiscount > 0 ? numericDiscount : undefined,
      discountedPrice,
      category,
      quantity,
    };

    const product = await Product.findByIdAndUpdate(params.id, updateFields, {
      new: true,
    }).populate("category");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (product.image) {
        product.image.data = buffer;
        product.image.contentType = image.type;
      } else {
        product.image = {
          data: buffer,
          contentType: image.type,
        };
      }
      await product.save();
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating product",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { isAdmin } = await getUserFromRequest(req as NextRequest);

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product Deleted Successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting Product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in Deleting Product",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

import Product from "@/models/Product";
import Category from "@/models/Category";
import connectDB from "@/config/connectDB";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface SearchParams {
  page: number;
  limit: number;
  category?: string;
  type?: string;
  onSale?: boolean;
  sort?: string;
  price?: string;
}

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const params: SearchParams = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "9"),
    category: searchParams.get("category") || undefined,
    type: searchParams.get("type") || undefined,
    onSale: searchParams.get("onSale") === "true",
    sort: searchParams.get("sort") || undefined,
    price: searchParams.get("price") || undefined,
  };

  const { page, limit, category, type, onSale, sort, price } = params;
  const skip = (page - 1) * limit;

  let filter: { [key: string]: any } = {};

  if (category) {
    try {
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        return NextResponse.json({
          success: false,
          message: "Category not found",
        });
      }
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: "Error fetching category",
        error: error.message,
      });
    }
  }

  if (type) {
    filter.type = type;
  }

  if (onSale) {
    filter.discount = { $gt: 0 };
  }

  let sortOption: { [key: string]: any } = { createdAt: -1 };

  if (sort === "latest") {
    sortOption = { createdAt: -1 };
  } else if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  if (price === "low") {
    sortOption = { ...sortOption, price: 1 };
  } else if (price === "high") {
    sortOption = { ...sortOption, price: -1 };
  }

  try {
    const products = await Product.find(filter)
      .populate("category")
      .select("-image")
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    const total = await Product.countDocuments(filter);

    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      success: false,
      message: "Error in fetching products",
      error: error.message || error,
    });
  }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const discount = formData.get("discount") as string | null;
    const category = formData.get("category") as string;
    const quantity = formData.get("quantity") as string;
    const shipping = formData.get("shipping") as string;
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
      case !image:
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

    const buffer = Buffer.from(await image.arrayBuffer());

    const numericPrice = parseFloat(price);
    const numericDiscount = discount ? parseFloat(discount) : 0;

    let discountedPrice;
    if (numericDiscount > 0) {
      discountedPrice = Math.floor(
        numericPrice - (numericPrice * numericDiscount) / 100
      );
    }

    const newProduct = new Product({
      name,
      slug: slugify(name),
      type,
      description,
      price: numericPrice,
      discount: numericDiscount > 0 ? numericDiscount : undefined,
      discountedPrice,
      category,
      quantity,
      shipping: shipping === "true" || shipping === "1",
      image: {
        data: buffer,
        contentType: image.type,
      },
    });

    await newProduct.save();
    await newProduct.populate("category");
    const productResponse = newProduct.toObject();
    delete productResponse.image;

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in creating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in creating product",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

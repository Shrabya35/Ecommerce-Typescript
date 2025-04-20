import Category from "@/models/Category";
import connectDB from "@/config/connectDB";
import slugify from "slugify";
import { NextResponse, NextRequest } from "next/server";
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

    const body = await req.json();
    const { name } = body;
    const { id } = await params;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in Update Category",
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

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category Deleted Successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in Deleting Category",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

import dbConnect from "@/lib/DBConnect";
import categoriesModel, { ICategory } from "@/models/categories.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const category: ICategory = await req.json();

  try {
    await dbConnect();
    const isExisted = await categoriesModel.findOne({
      name: category.name,
    });
    if (isExisted) {
      return NextResponse.json({
        success: false,
        message: "Category Already Exists",
      });
    }
    const newCategory = await new categoriesModel(category);
    await newCategory.save();
    return NextResponse.json({
      success: true,
      message: "new category created",
    });
  } catch (error) {
    console.error("Category creating error : ", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create category, server error",
    });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const forTable = searchParams.get("forTable") || null;
  const id = searchParams.get("id") || null;
  try {
    await dbConnect();
    if (forTable) {
      const categories = await categoriesModel.find({}, "_id imageUrl name");
      const formattedCategories = categories.map((category) => ({
        _id: category._id,
        image: category.imageUrl,
        title: category.name,
      }));

      return NextResponse.json({
        success: true,
        message: "fetched successfully",
        data: formattedCategories,
      });
    }
    if (id) {
      const category = await categoriesModel
        .findById(id)
        .select("-__v -createdAt -updatedAt");
      return NextResponse.json({
        success: true,
        message: "fetched successfully",
        data: category,
      });
    }
    const categories = await categoriesModel.find({});
    return NextResponse.json({
      success: true,
      message: "fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("categories loading error : ", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load categories, server error",
    });
  }
}

export async function DELETE(req: NextRequest) {
  console.log("hit delete api");
  const { id } = await req.json();
  if (!id)
    return NextResponse.json({
      success: false,
      message: "No id received!",
    });
  try {
    await dbConnect();
    await categoriesModel.findByIdAndDelete({ _id: id });
    return NextResponse.json({
      message: "Deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Failed to delete category : ", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete category, server error",
    });
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  try {
    await dbConnect();
    await categoriesModel.findByIdAndUpdate(
      { _id: data.id },
      {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      },
      {
        new: true,
      }
    );
    return NextResponse.json({
      message: "category updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Failed to update category : ", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category, server error",
    });
  }
}

import dbConnect from "@/lib/DBConnect";
import blogsModel from "@/models/blogs.model";
import categoriesModel from "@/models/categories.model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface blogData {
  title: string;
  caption: string;
  category: string;
  FeaturedImage: string;
  content: string;
  slug: string;
  status?: "published" | "scheduled";
  scheduledFor?: string | null;
  author: {
    name: string;
    avatarUrl: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  const data: blogData = await req.json();

  //zod validation TODO

  try {
    await dbConnect();

    const blogData = {
      ...data,
      status: data.status || "published",
      scheduledFor: data.status === "scheduled" && data.scheduledFor
        ? new Date(data.scheduledFor)
        : null,
    };

    const newBlog = new blogsModel(blogData);
    await newBlog.save();
    return NextResponse.json({
      success: true,
      message: "blog created successfully",
    });
  } catch (error) {
    console.error("Blog Creating Error ::", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create blog, server error",
    });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category") || null;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  const id = searchParams.get("id") || null;
  const slug = searchParams.get("slug") || null;

  try {
    await dbConnect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (category) {
      const isValidCategory = await categoriesModel.findOne({ name: category });
      if (!isValidCategory) {
        return NextResponse.json({
          success: false,
          message: `Cannot find blog for ${category} category`,
        });
      }
      const blogsByCategory = await blogsModel
        .find({
          ...query,
          category: isValidCategory._id,
          status: { $ne: "scheduled" },
        })
        .populate("category", "name")
        .select("-__v -content -author -seo");
      if (!blogsByCategory.length) {
        return NextResponse.json({
          success: false,
          message: `Cannot find blog for ${category} category`,
        });
      }
      return NextResponse.json({
        success: true,
        message: `Blogs for ${category} category fetched successfully!`,
        data: blogsByCategory,
      });
    }
    if (id) {
      const blog = await blogsModel
        .findById({ _id: id })
        .select("-author  -createdAt -updatedAt -__v");

      if (!blog)
        return NextResponse.json({
          message: "Cannot found blog details",
          success: false,
        });
      return NextResponse.json({
        message: "Blog details fetched!",
        success: true,
        data: blog,
      });
    }
    if (slug) {
      const blog = await blogsModel
        .findOne({
          ...query,
          slug,
          status: { $ne: "scheduled" },
        })
        .populate("category", "name")
        .select("-slug  -__v");

      if (!blog) {
        return NextResponse.json({
          message: "Cannot found blog",
          success: false,
        });
      }
      return NextResponse.json({
        message: "blog details found",
        success: true,
        blog: blog,
      });
    }

    const skip = (page - 1) * limit;

    const publicQuery = { ...query, status: { $ne: "scheduled" } };

    const blogs = await blogsModel
      .find(publicQuery)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .select("-content -author -seo  -__v")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await blogsModel.countDocuments(publicQuery);

    return NextResponse.json({
      success: true,
      message: "Blogs fetched successfully!",
      data: blogs,
      pagination: {
        total: totalBlogs,
        page,
        limit,
        totalPages: Math.ceil(totalBlogs / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs ::", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch blogs, server error",
    });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  const { id } = await req.json();
  if (!id)
    return NextResponse.json({
      success: false,
      message: "No id is received",
    });

  try {
    await dbConnect();
    await blogsModel.findByIdAndDelete({ _id: id });
    return NextResponse.json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog ::", error);
    return NextResponse.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete blog, server error",
    });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  const data = await req.json();

  try {
    await dbConnect();
    await blogsModel.findByIdAndUpdate(
      { _id: data.id },
      {
        title: data.title,
        caption: data.caption,
        seo: {
          metaTitle: data.seo.metaTitle,
          metaDescription: data.seo.metaDescription,
        },
        category: data.category,
        content: data.content,
        FeaturedImage: data.FeaturedImage,
        status: data.status || "published",
        scheduledFor: data.status === "scheduled" && data.scheduledFor
          ? new Date(data.scheduledFor)
          : null,
      },
      {
        new: true,
      },
    );
    return NextResponse.json({
      message: "blog updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("blog updating error", error);
    return NextResponse.json({
      message:
        error instanceof Error
          ? error.message
          : "failed to update -server error",
      success: false,
    });
  }
}

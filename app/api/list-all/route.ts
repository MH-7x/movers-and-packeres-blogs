import { NextResponse } from "next/server";
import dbConnect from "@/lib/DBConnect";
import Blog from "@/models/blogs.model";

export async function GET() {
  try {
    await dbConnect();

    const blogs = await Blog.aggregate([
      {
        $lookup: {
          from: "categories", // Collection name for categories
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true, // Ensures blogs without a category are included
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          caption: 1,
          slug: 1,
          image: "$FeaturedImage",
          category: { $ifNull: ["$categoryData.name", "Uncategorized"] },
          status: { $ifNull: ["$status", "published"] },
          scheduledFor: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1, // Sort by createdAt in descending order
        },
      },
    ]);

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

import { SectionCards } from "@/components/section-cards";
import React from "react";
import dbConnect from "@/lib/DBConnect";
import blogsModel from "@/models/blogs.model";
import categoriesModel from "@/models/categories.model";
import { DataTable } from "@/app/dashboard/list-blog/data-table";
import { columns } from "@/app/dashboard/list-blog/columns";

const page = async () => {
  await dbConnect();

  const totalBlogs = await blogsModel.countDocuments();
  const totalCategories = await categoriesModel.countDocuments();

  const recentBlogs = await blogsModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
    {
      $unwind: {
        path: "$categoryData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: { $toString: "$_id" },
        title: 1,
        caption: 1,
        slug: 1,
        image: "$FeaturedImage",
        category: { $ifNull: ["$categoryData.name", "Uncategorized"] },
        status: { $ifNull: ["$status", "published"] },
        scheduledFor: 1,
        createdAt: { $toString: "$createdAt" },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            totalBlogs={totalBlogs}
            totalCategories={totalCategories}
          />

          <div className="px-4 lg:px-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Recent Blogs</h2>
            <DataTable columns={columns} data={recentBlogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

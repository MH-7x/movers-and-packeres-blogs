"use server";

import { getServerSession } from "next-auth";
export interface category {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  __v: number;
}
export default async function createBlog(data: {
  title: string;
  caption: string;
  FeaturedImage: string;
  content: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  category: string;
  isUpdate?: boolean;
  id?: string;
}) {
  const serverSession = await getServerSession();

  const fullData = {
    ...data,
    author: {
      name: serverSession?.user?.name || "Admin",
      avatarUrl: serverSession?.user?.image || "/next.svg",
    },
  };

  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/api/blog`, {
      method: data.isUpdate ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data.isUpdate
        ? JSON.stringify({ ...fullData, id: data.id })
        : JSON.stringify(fullData),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${data.isUpdate ? "update" : "create"} blog -${
          response.statusText
        }`
      );
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    return {
      message: `Blog ${data.isUpdate ? "Updated" : "created"} Successfully`,
      success: true,
    };
  } catch (error) {
    console.error(
      `Blog ${data.isUpdate ? "Updating" : "creating"} error`,
      error
    );
    return {
      message:
        error instanceof Error
          ? error.message
          : `Failed to ${
              data.isUpdate ? "update" : "create"
            } blog, server error`,
      success: false,
    };
  }
}

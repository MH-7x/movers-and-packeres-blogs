import BlogForm from "@/components/BlogForm";
import { LucideMessageCircleWarning } from "lucide-react";
import React from "react";

export interface BlogResponse {
  seo: SEO;
  _id: string;
  title: string;
  caption: string;
  category: string;
  FeaturedImage: string;
  content: string;
  slug: string;
  status?: string;
  scheduledFor?: string | Date;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
}

const getData = async (
  id: string,
): Promise<{ data: BlogResponse } | { error: string }> => {
  if (!id) throw new Error("No id received ");
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/api/blog?id=${id}`);
    if (!response.ok)
      throw new Error("Failed To Load Blog Details - " + response.statusText);
    const results = await response.json();
    if (!results.success) throw new Error(results.message);
    return { data: results.data as BlogResponse };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong -server error",
    };
  }
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const results = await getData(id);

  return (
    <section className=" p-5">
      <h1 className="text-primary font-bold text-2xl">Edit Blog Details</h1>
      <p className="max-w-3xl text-muted-foreground mt-3 text-base/4.3">
        You are allowed to update and modify the blog's title, category, featured
        image, content, and other essential information. Ensure your blog stays
        relevant and accurate by making necessary changes easily.
      </p>
      {"data" in results ? (
        <BlogForm blog={results.data} />
      ) : (
        <div className="text-destructive mt-5 p-5 flex items-center justify-center gap-4 bg-destructive/10 max-w-xl mx-auto text-center rounded-xl">
          <LucideMessageCircleWarning /> {results.error}
        </div>
      )}
    </section>
  );
};

export default page;

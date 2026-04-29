"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import CustomFormField from "./CustomFormField";

const CustomEditor = dynamic(() => import("@/components/CustomEditor"), {
  ssr: false,
});

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";

const blogSchema = z.object({
  title: z
    .string()
    .min(30, { message: "Title must be at least 30 characters long" }),
  caption: z
    .string()
    .min(80, { message: "please write a descriptive caption!" }),
  seo: z.object({
    metaTitle: z
      .string()
      .min(30, { message: "Title must be at least 10 characters long" }),
    metaDescription: z
      .string()
      .min(80, { message: "please write a descriptive caption!" }),
  }),
  category: z.string({
    message: "Please select a category",
  }),
  slug: z.string().min(20, "provide detail slug!"),
});

import { Loader2, Plus, UploadCloud } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { toast } from "sonner";
import createBlog, { category } from "@/lib/CreateBlog";
import { useRouter } from "next/navigation";
import { BlogResponse } from "@/app/dashboard/edit/[id]/page";
const BlogForm = ({ blog }: { blog?: BlogResponse }) => {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(
    blog?.FeaturedImage || null,
  );

  console.log("Blog : ", blog);

  const [Resource, setResource] = useState<
    CloudinaryUploadWidgetInfo | undefined
  >(undefined);

  const [blogContent, setBlogContent] = useState<string>(blog?.content || "");
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState<category[] | []>([]);

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || "",
      caption: blog?.caption || "",
      seo: {
        metaTitle: blog?.seo.metaTitle || "",
        metaDescription: blog?.seo.metaDescription || "",
      },
      category: blog?.category || "",
      slug: blog?.slug || "",
    },
  });
  async function onSubmit(values: z.infer<typeof blogSchema>) {
    if (!image) {
      return toast.error("Please upload an image");
    }

    if (!blogContent) {
      return toast.error("Please write blog content");
    }

    try {
      setLoading(true);
      const { message, success } = await createBlog({
        ...values,
        FeaturedImage: image,
        content: blogContent,
        isUpdate: Boolean(blog),
        id: blog?._id,
      });

      if (success) {
        toast.success(message);
        router.push("/dashboard");
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the blog.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch("/api/categoy");
      if (!response.ok)
        throw new Error("Failed to load categories " + response.statusText);
      const results = await response.json();
      if (!results.success) {
        toast.error(results.message, {
          description: "refresh the page",
          style: {
            color: "yellow",
          },
        });
      }
      setCategories(results.data as category[]);
    } catch (error) {
      toast.error("Failed to load categories ", {
        description:
          error instanceof Error ? error.message : "failed to load categories",
        style: {
          color: "red",
        },
      });
    } finally {
      setCategoriesLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
    if (Resource) {
      setImage(Resource.secure_url);
    }
  }, [Resource]);

  return (
    <>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-16">
        <Form {...form}>
          <form
            className="bg-secondary/50 rounded-2xl min-h-96 md:p-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CustomFormField
              description="this will be your blog title"
              name="title"
              form={form}
              label="Title"
              type="text"
            />
            <CustomFormField
              description="short descriptive blog caption"
              name="caption"
              form={form}
              label="Blog Caption"
              type="textarea"
            />
            <CustomFormField
              description="55 t0 60 characters meta title for SEO"
              name="seo.metaTitle"
              form={form}
              label="Meta Title"
              type="text"
            />
            <CustomFormField
              description="150 characters meta description for SEO"
              name="seo.metaDescription"
              form={form}
              label="Meta Description"
              type="textarea"
            />
            <CustomFormField
              description="optimized slug for blog staring from '/' "
              name="slug"
              form={form}
              label="Slug"
              type="input"
            />
            <CustomFormField
              description="select blog category"
              name="category"
              form={form}
              label="Blog Category"
              type="select"
              loading={categoriesLoading}
              categories={categories && categories.length > 0 ? categories : []}
              defaultSelected={blog?.category}
            />
            <Button
              disabled={loading}
              type="submit"
              className="mt-5 w-full"
              size={"lg"}
            >
              {loading ? (
                <>
                  Submitting <Loader2 className="animate-spin" />
                </>
              ) : (
                <>
                  Submit Now <Plus />
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="bg-secondary/50 rounded-2xl min-h-96 md:p-5">
          <h3 className="text-lg font-semibold text-center my-5">
            Upload Featured Image
          </h3>
          <CldUploadWidget
            signatureEndpoint="/api/upload"
            onSuccess={(results: CloudinaryUploadWidgetResults) => {
              setResource(
                results?.info as CloudinaryUploadWidgetInfo | undefined,
              );
            }}
            onQueuesEnd={(result, { widget }) => {
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <label
                  onClick={() => {
                    setResource(undefined);
                    open();
                  }}
                  className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
                >
                  <UploadCloud className="w-12 h-12" />
                  Upload file
                  <p className="text-xs font-medium text-gray-400 mt-2">
                    PNG, JPG SVG, WEBP, and GIF are Allowed.
                  </p>
                </label>
              );
            }}
          </CldUploadWidget>
          {image && (
            <Image
              width={100}
              height={100}
              alt="image"
              className="mt-3"
              src={image}
            />
          )}
        </div>
      </div>
      <CustomEditor
        initialContent={blog?.content}
        setContent={setBlogContent}
      />
    </>
  );
};

export default BlogForm;

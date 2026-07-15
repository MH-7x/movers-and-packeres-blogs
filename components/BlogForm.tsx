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

const blogSchema = z
  .object({
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
    status: z.enum(["published", "scheduled"]),
    scheduledFor: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "scheduled") {
        return !!data.scheduledFor;
      }
      return true;
    },
    {
      message: "Please select a date and time for the scheduled post",
      path: ["scheduledFor"],
    },
  );

import { CalendarClock, Loader2, Plus, UploadCloud } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { toast } from "sonner";
import createBlog, { category } from "@/lib/CreateBlog";
import { useRouter } from "next/navigation";
import { BlogResponse } from "@/app/dashboard/edit/[id]/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
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

  const formatDateForInput = (date: string | Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

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
      status: (blog?.status as "published" | "scheduled") || "published",
      scheduledFor: formatDateForInput(blog?.scheduledFor) || "",
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
        status: values.status,
        scheduledFor: values.status === "scheduled" && values.scheduledFor
          ? new Date(values.scheduledFor).toISOString()
          : undefined,
        isUpdate: Boolean(blog),
        id: blog?._id,
      });

      if (success) {
        toast.success(message);
        router.push("/dashboard");
      } else {
        toast.error(message);
        console.error(message);
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
      const response = await fetch("/api/category");
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

            <div className="mt-5 space-y-3 rounded-lg border p-4 bg-background">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Publish Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(val: "published" | "scheduled") => {
                    form.setValue("status", val);
                    if (val === "published") {
                      form.setValue("scheduledFor", "");
                      form.clearErrors("scheduledFor");
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select publish status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publish Now</SelectItem>
                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.watch("status") === "scheduled" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    Schedule Date & Time
                  </Label>
                  <Input
                    type="datetime-local"
                    className="bg-white"
                    min={new Date().toISOString().slice(0, 16)}
                    value={form.watch("scheduledFor") || ""}
                    onChange={(e) => {
                      form.setValue("scheduledFor", e.target.value);
                      form.clearErrors("scheduledFor");
                    }}
                  />
                  {form.formState.errors.scheduledFor && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.scheduledFor.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="mt-4 w-full"
              size={"lg"}
            >
              {loading ? (
                <>
                  Submitting <Loader2 className="animate-spin" />
                </>
              ) : form.watch("status") === "scheduled" ? (
                <>
                  Schedule Post <CalendarClock className="ml-1 h-4 w-4" />
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

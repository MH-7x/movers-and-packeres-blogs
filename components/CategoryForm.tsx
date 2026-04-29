"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Plus, UploadCloud } from "lucide-react";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import CreateCategory from "@/lib/CreateCategory";
import { useRouter } from "next/navigation";
import { CategoryResponse } from "@/app/dashboard/edit-category/[id]/page";

const categorySchema = z.object({
  name: z.string().min(10, {
    message: "category name must be at least 10 characters ",
  }),
  description: z.string().min(20, {
    message: "category name must be at least 20 characters ",
  }),
});

const CategoryForm = ({ category }: { category?: CategoryResponse }) => {
  const [image, setImage] = useState<string | null>(category?.imageUrl || "");
  const [Resource, setResource] = useState<
    CloudinaryUploadWidgetInfo | undefined
  >(undefined);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  useEffect(() => {
    if (Resource) {
      setImage(Resource.secure_url);
    }
  }, [Resource]);

  async function onSubmit(values: z.infer<typeof categorySchema>) {
    if (!image || image === "") {
      toast.error("please upload one image");
    } else {
      try {
        setLoading(true);
        const { message, success } = await CreateCategory({
          ...values,
          imageUrl: image,
          id: category?._id,
        });
        if (!success) {
          throw new Error(message);
        }
        toast.success(message);
        router.push("/dashboard");
      } catch (error) {
        toast.error("Operation Failed!", {
          style: {
            color: "red",
          },
          description:
            error instanceof Error ? error.message : "something went wrong!",
        });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-16">
      <Form {...form}>
        <form
          className="bg-secondary/50 rounded-2xl min-h-96 md:p-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    {...field}
                    placeholder="category name"
                  ></Input>
                </FormControl>
                <FormDescription>this will be category name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel>Category Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-white"
                    {...field}
                    placeholder="category description"
                  ></Textarea>
                </FormControl>
                <FormDescription>
                  short description about category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
        <CldUploadWidget
          signatureEndpoint="/api/upload"
          onSuccess={(results: CloudinaryUploadWidgetResults) => {
            setResource(
              results?.info as CloudinaryUploadWidgetInfo | undefined
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
  );
};

export default CategoryForm;

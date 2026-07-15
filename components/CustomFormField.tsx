import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { category } from "@/lib/CreateBlog";

interface CustomFormFieldProps {
  form: UseFormReturn<
    {
      title: string;
      caption: string;
      seo: {
        metaTitle: string;
        metaDescription: string;
      };
      slug: string;
      category: string;
      status?: string;
      scheduledFor?: string;
    },
    undefined
  >;
  label: string;
  description: string;
  name:
    | "title"
    | "caption"
    | "seo.metaTitle"
    | "seo.metaDescription"
    | "slug"
    | "category";
  type?: string;
  categories?: category[] | [];
  loading?: boolean;
  defaultSelected?: string;
  options?: { value: string; label: string }[];
}

const CustomFormField = ({
  form,
  label,
  description,
  name,
  type = "text",
  loading,
  categories,
  defaultSelected,
}: CustomFormFieldProps) => {
  return (
    <FormField
      control={
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.control as unknown as UseFormReturn<FieldValues, any>["control"]
      }
      name={name}
      render={({ field }) => (
        <FormItem className="my-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "select" ? (
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                defaultValue={defaultSelected || field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blog category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((category, i) => (
                      <SelectItem key={i} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : type === "textarea" ? (
              <Textarea className="bg-white" {...field} />
            ) : (
              <Input type="text" className="bg-white" {...field} />
            )}
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;

"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export type Blog = {
  _id: string;
  image: string;
  title: string;
  category: string;
};
import { ArrowUpDown } from "lucide-react";
import Actions from "@/components/Actions";
export const columns: ColumnDef<Blog>[] = [
  {
    accessorKey: "image",
    header: "Featured Image",
    cell: ({ row }) => (
      <div className="w-20 h-16 bg-secondary relative overflow-hidden rounded-lg">
        <Image
          src={row.original.image}
          alt="Blog Thumbnail"
          fill
          className="absolute object-cover rounded-md"
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Blog Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const blog = row.original;

      return <Actions blog={blog} />;
    },
  },
];

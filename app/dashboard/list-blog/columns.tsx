"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type Blog = {
  _id: string;
  image: string;
  title: string;
  category: string;
  status?: string;
  scheduledFor?: string;
};
import { ArrowUpDown, CalendarClock, CircleCheck } from "lucide-react";
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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status || "published";
      const scheduledFor = row.original.scheduledFor;

      if (status === "scheduled" && scheduledFor) {
        const date = new Date(scheduledFor);
        const formatted = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            <CalendarClock className="h-3 w-3" />
            {formatted}
          </Badge>
        );
      }

      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">
          <CircleCheck className="h-3 w-3" />
          Published
        </Badge>
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

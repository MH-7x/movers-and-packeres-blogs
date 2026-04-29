"use client";
import { Blog } from "@/app/dashboard/list-blog/columns";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Delete, EditIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const Actions = ({ blog }: { blog: Blog }) => {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok)
        throw new Error("Failed to delete - " + response.statusText);
      const results = await response.json();
      if (!results.success) throw new Error(results.message);
      toast.success(results.message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "something went wrong",
        {
          dismissible: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/edit/${blog._id}`)}
          className="cursor-pointer"
        >
          <EditIcon /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={Loading}
          onClick={() => handleDelete(blog._id)}
          className="cursor-pointer bg-destructive/10 text-destructive"
        >
          <Delete />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;

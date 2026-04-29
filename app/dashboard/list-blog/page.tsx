import { LucideMessageCircleWarning } from "lucide-react";
import { Blog, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<{ data: Blog[] } | { error: string }> {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/api/list-all`, {
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error("Failed to get blogs - " + response.statusText);
    const results = await response.json();
    if (!results.success) throw new Error(results.message);

    return { data: results.data as Blog[] };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export default async function BlogListPage() {
  const result = await getData();

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-primary font-bold text-2xl">Blogs List</h1>
      <p className="max-w-3xl text-muted-foreground mt-3 text-base/4.3">
        A simple dashboard displaying a list of blogs in a structured table
        format, including featured images, titles, and categories.
      </p>
      {"data" in result ? (
        <DataTable columns={columns} data={result.data} />
      ) : (
        <div className="text-destructive mt-5 p-5 flex items-center justify-center gap-4 bg-destructive/10 max-w-xl mx-auto text-center rounded-xl">
          <LucideMessageCircleWarning /> {result.error}
        </div>
      )}
    </div>
  );
}

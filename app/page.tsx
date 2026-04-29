import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex items-center justify-center gap-5 flex-col h-screen">
      <h1 className="font-bold md:text-4xl text-2xl text-center">
        Login To Access Blogs CMS
      </h1>
      <p className=" text-muted-foreground text-center max-w-3xl mx-0">
        Sign in to manage and access the Blog Content Management System (CMS)
        for creating, editing, and organizing your blog posts.
      </p>
      <Link href="/login">
        <Button size={"lg"}>
          <LogIn /> LOGIN
        </Button>
      </Link>
    </section>
  );
}

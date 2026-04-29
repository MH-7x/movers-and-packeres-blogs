import BlogForm from "@/components/BlogForm";

const CreateNewBlogPage = () => {
  return (
    <section className=" p-5">
      <h1 className="text-primary font-bold text-2xl">Create New Blog</h1>
      <p className="max-w-3xl text-muted-foreground mt-3 text-base/4.3">
        Welcome to the blog creation page! Here, you can craft and publish a new
        blog post by providing essential details such as the title, category,
        featured image, content, and SEO metadata.
      </p>
      <BlogForm />
    </section>
  );
};

export default CreateNewBlogPage;

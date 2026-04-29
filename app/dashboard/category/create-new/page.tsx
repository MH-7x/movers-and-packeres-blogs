import CategoryForm from "@/components/CategoryForm";

const CreateNewBlogPage = () => {
  return (
    <section className=" p-5">
      <h1 className="text-primary font-bold text-2xl">Create New Category</h1>
      <p className="max-w-3xl text-muted-foreground mt-3 text-base/4.3">
        Welcome to the category creation page! Here, you can craft and publish a
        new blog categories to organize you blog post by providing essential
        details such as the category name, category description and image.
      </p>
      <CategoryForm />
    </section>
  );
};

export default CreateNewBlogPage;

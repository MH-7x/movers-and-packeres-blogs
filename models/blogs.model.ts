import { model, models, Schema, Document, ObjectId, Types } from "mongoose";

export interface IBlog extends Document {
  title: string;
  caption: string;
  category: ObjectId;
  FeaturedImage: string;
  content: string;
  slug : string;
  author: {
    name: string;
    avatarUrl: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Please provide a blog title"],
      lowercase: true,
      trim: true,
    },
    caption: {
      type: String,
      required: [true, "Please provide a blog caption"],
      trim: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide a blog category"],
    },
    FeaturedImage: {
      type: String,
      required: [true, "Please provide a featured image url"],
    },
    content: {
      type: String,
      required: [true, "Please provide a blog content"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      avatarUrl: {
        type: String,
        required: true,
      },
    },
    seo: {
      metaTitle: {
        type: String,
        required: [true, "Please provide a meta title"],
      },
      metaDescription: {
        type: String,
        required: [true, "Please provide a meta description"],
      },
    },
  },
  { timestamps: true }
);

// Delete the existing model to ensure the schema updates in Next.js HMR
if (models.Blog) {
  delete models.Blog;
}

export default model<IBlog>("Blog", blogSchema);

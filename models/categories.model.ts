import { model, models, Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  imageUrl: string;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a category description"],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, "Please provide an image url"],
  },
});

export default models.Category || model<ICategory>("Category", categorySchema);

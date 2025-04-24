// models/Product.ts
import mongoose, { Document, Schema, Model } from "mongoose";

interface IProduct extends Document {
  name: string;
  slug: string;
  type: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number | null;
  category: mongoose.Types.ObjectId;
  quantity: number;
  image?: {
    data: Buffer;
    contentType: string;
  };
  applyDiscount: () => void;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

productSchema.methods.applyDiscount = function () {
  if (this.discount > 0) {
    this.discountedPrice = this.price - this.price * (this.discount / 100);
  }
};

// Use this pattern to prevent errors during hot reloading
const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product as Model<IProduct>;

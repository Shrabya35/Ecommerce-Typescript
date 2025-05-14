import mongoose, { Document, Schema, Model } from "mongoose";

// Define IUser interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: number;
  wishlist: mongoose.Types.ObjectId[];
  shoppingBag: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  calculateCartTotals: () => Promise<{
    subtotal: number;
    estimatedShipping: number;
    total: number;
  }>;
}

// Define the schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    shoppingBag: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.calculateCartTotals = async function () {
  const user = this as IUser;

  await user.populate("shoppingBag.product");

  let subtotal = 0;

  for (const item of user.shoppingBag) {
    const product = item.product as any;

    if (!product) continue;

    const price =
      product.discount > 0 && product.discountedPrice
        ? product.discountedPrice
        : product.price || 0;

    subtotal += price * item.quantity;
  }

  const estimatedShipping = subtotal > 999 ? 0 : 180;
  const total = subtotal + estimatedShipping;

  return {
    subtotal: Math.round(subtotal),
    estimatedShipping,
    total: Math.round(total),
  };
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser extends Document {
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
}

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

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

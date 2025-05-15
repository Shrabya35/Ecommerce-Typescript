import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOrder extends Document {
  order: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  user: mongoose.Types.ObjectId;
  price: number;
  address: {
    country: string;
    city: string;
    street: string;
    secondary?: string;
    postalCode: string;
  };
  mode: 0 | 1; // 0 = COD, 1 = eSewa
  status: "pending" | "processing" | "completed" | "cancelled";
  esewaRefId?: string | null;
  transactionUuid?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    order: [
      {
        _id: false,
        product: {
          type: Schema.Types.ObjectId,
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      secondary: {
        type: String,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    mode: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
      required: true,
    },
    esewaRefId: {
      type: String,
      default: null,
    },
    transactionUuid: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;

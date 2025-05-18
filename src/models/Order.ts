import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  product: {
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
  mode: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  esewaRefId?: string;
  transactionUuid?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    product: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
      required: true,
      enum: [0, 1],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    esewaRefId: {
      type: String,
    },
    transactionUuid: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

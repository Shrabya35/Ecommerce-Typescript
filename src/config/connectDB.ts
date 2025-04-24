import mongoose, { Connection } from "mongoose";

import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";

const DATABASE_URL = process.env.MONGO_URL as string;

if (!DATABASE_URL) {
  throw new Error(
    "Please define the MONGO_URL environment variable inside .env.local"
  );
}

declare global {
  var mongoose:
    | {
        conn: Connection | null;
        promise: Promise<Connection> | null;
      }
    | undefined;
}

global.mongoose ||= { conn: null, promise: null };

const cached = global.mongoose;

async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DATABASE_URL, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

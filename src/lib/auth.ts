import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  role?: number;
}

export async function getUserFromRequest(
  req: NextRequest
): Promise<JwtPayload | null> {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("No token found in cookies");
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

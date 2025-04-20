import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  role?: number;
}

export async function getUserFromRequest(req: NextRequest): Promise<{
  user: JwtPayload | null;
  isAdmin: boolean;
}> {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("No token found in cookies");
      return { user: null, isAdmin: false };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const isAdmin = decoded.role === 1;

    return { user: decoded, isAdmin };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return { user: null, isAdmin: false };
  }
}

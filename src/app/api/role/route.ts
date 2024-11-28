import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value; 
  if (!token) {
    return NextResponse.json(
      { message: "No token found" },
      { status: 401 }
    );
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret is not defined in environment variables.");
    }

    // Decode the token to get the role
    const decoded = jwt.verify(token, secret) as { role: string };
    const role = decoded.role;
    

    return NextResponse.json({ role });
  } catch (error) {
    console.error("Failed to decode token", error);
    return NextResponse.json({ message: "Failed to decode token" }, { status: 500 });
  }
}

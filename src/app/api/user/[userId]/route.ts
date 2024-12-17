import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";

// Secret key for JWT verification
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// DELETE an employee
export async function DELETE(
    req: NextRequest,
    { params }: { params: { userId: number } }
  ) {
    const { userId } = params;
  
    try {
      await connect(); // Connect to MongoDB
  
      // Extract and verify token
      const token = req.headers.get("Authorization")?.split(" ")[1];
      if (!token) {
        return NextResponse.json(
          { message: "Authorization token is required" },
          { status: 401 }
        );
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, SECRET_KEY);
      } catch (error) {
        return NextResponse.json(
          { message: "Invalid or expired token",error },
          { status: 401 }
        );
      }
  
      const { role} = decoded as { role: string;};
  
      // Only allow admin to delete an employee
      if (role !== "admin") {
        return NextResponse.json(
          { message: "Only admins can delete employees" },
          { status: 403 }
        );
      }
  
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { message: "Error deleting user", error },
        { status: 500 }
      );
    }
  }
  
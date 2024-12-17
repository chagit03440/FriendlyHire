import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";

// Secret key for JWT verification
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// GET all users (admin-only) or specific user data based on role
export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connect();

    // Get the token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token", error },
        { status: 401 }
      );
    }

    const { role, id } = decoded as { role: string; id: string };

    // Role-based access control
    if (role === "admin") {
      // Admin can get all users
      const users = await User.find(); // Fetch all users
      return NextResponse.json(users, { status: 200 });
    } else if (role === "employee" || role === "candidate") {
      // Non-admins can only fetch their own data
      const user = await User.findById(id); // Fetch user by ID from token
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(user, { status: 200 });
    } else {
      // Unauthorized role
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error },
      { status: 500 }
    );
  }
}

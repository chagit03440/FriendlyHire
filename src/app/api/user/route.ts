import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
      return NextResponse.json(users, {
        status: 200,
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
      });
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
export async function POST(req: NextRequest) {
  try {
    const { name, role, email, password, profile } = await req.json();
    
    // Ensure all required fields are provided
    if (!name || !email || !password || !role || !profile) {
      return NextResponse.json(
        { message: "Name, role, email, and password are required" },
        { status: 400 }
      );
    }
    
    // Validate role input
    if (!["employee", "candidate"].includes(role.toLowerCase())) {
      return NextResponse.json(
        { message: "Role must be either 'employee' or 'candidate'" },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    await connect();
    
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      role: role.toLowerCase(), // Save the role in lowercase for consistency
      email,
      password: hashedPassword,
      profile,
    });

    await newUser.save();

    
    // Return success response
    return NextResponse.json(
      {
        message: "Create User successful",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during create user:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}


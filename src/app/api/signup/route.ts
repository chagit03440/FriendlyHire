import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User"; 

export async function POST(req: NextRequest) {
  console.log("userrr",req.body);
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

    // Generate a token for the new user
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      }, // Payload
      process.env.JWT_SECRET!, // Secret key
      { expiresIn: "1h" } // Token expiry
    );

    // Set the token as a cookie
    const headers = new Headers();
    // Modify your login route to set the cookie without HttpOnly
    headers.append(
      "Set-Cookie",
      `token=${token}; path=/; secure; SameSite=Strict`
    );

    // Return success response
    return NextResponse.json(
      {
        message: "Sign-up successful",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profile: newUser.profile,
        },
      },
      { headers, status: 201 }
    );
  } catch (error) {
    console.error("Error during sign-up:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

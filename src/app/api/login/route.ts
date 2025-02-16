import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create a JWT token
    const token = jwt.sign(
      {id: user.id, role: user.role, email:user.email }, // Include necessary payload data
      process.env.JWT_SECRET!, // Your JWT secret key
      { expiresIn: "1h" } // Token expiration time
    );

    const headers = new Headers();
    // Modify your login route to set the cookie without HttpOnly
    headers.append(
      "Set-Cookie",
      `token=${token}; path=/; secure; SameSite=Strict`
    );

    return NextResponse.json(
      { message: "Login successful", token, role: user.role },
      { headers }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

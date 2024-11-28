import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("bbbbbbbbbbbb", email, password)
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    await connect();
    console.log("bbbbbbbbbbbb")

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
      {id: user.id, role: user.role }, // Include necessary payload data
      process.env.JWT_SECRET!, // Your JWT secret key
      { expiresIn: "1m" } // Token expiration time
    );

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `token=${token}; path=/; secure; HttpOnly; SameSite=Strict`
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

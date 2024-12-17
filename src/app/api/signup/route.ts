import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";
import EmailVerification from "@/app/lib/models/EmailVerification";

export async function POST(req: NextRequest) {
  try {
    const { name, role, email, password, profile, verificationCode } =
      await req.json();

    // Ensure all required fields are provided
    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !profile ||
      !verificationCode
    ) {
      return NextResponse.json(
        { message: "All fields including verification code are required" },
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

    // Verify the email verification code
    const verificationRecord = await EmailVerification.findOne({ email });
    if (!verificationRecord) {
      return NextResponse.json(
        { message: "Verification code expired or not found" },
        { status: 400 }
      );
    }

    // Check if the verification code matches
    if (verificationRecord.verificationCode !== verificationCode) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
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
    console.log("userrrrrrr", newUser)
    await newUser.save();

    // Remove the verification code from the database
    await EmailVerification.deleteOne({ email });

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

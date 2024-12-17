import bcrypt from "bcryptjs";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";
import PasswordReset from "@/app/lib/models/PasswordReset";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 }
      );
    }

    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connect();

    const record = await PasswordReset.findOne({ email });

    if (!record) {
      return NextResponse.json(
        { message: "Reset code not found" },
        { status: 404 }
      );
    }

    const { resetCode } = record;

    if (resetCode !== code) {
      return NextResponse.json(
        { message: "Invalid reset code" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    // Remove the reset code from the database after successful password reset
    await PasswordReset.deleteOne({ email });

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

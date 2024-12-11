import bcrypt from "bcryptjs";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";
import PasswordReset from "@/app/lib/models/PasswordReset";
import { NextResponse } from "next/server";

/*
 This route is responsible for updating the user's password once the reset code is verified.

Input:
The user provides their email (email), the reset code (code), and a new password (newPassword) in the request body.
Process:
Looks up the reset code and expiration time for the given email in the database (mockDB).
Verifies that:
The email exists in the database.
The code matches the one stored in the database.
The code has not expired.
Hashes the new password using bcrypt for secure storage.
Updates the password in the database (for now, it just logs the password update; in production, it should update the real user database).
Removes the reset code from the database to ensure it cannot be reused.
Output:
Returns a success message if the password is updated successfully.
Returns an error message if the reset code is invalid, expired, or the request is incomplete.
*/

export async function POST(req: Request) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method Not Allowed" },
        { status: 405 }
      );
    }

    const { email, code, newPassword } = await req.json();

    console.log(`email: ${email}, reset code from the user: ${code}`);

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

    const { resetCode, resetCodeExpires } = record;

    console.log(`reset code from the db: ${resetCode}`);
    if (Date.now() > resetCodeExpires) {
      return NextResponse.json(
        { message: "Reset code has expired" },
        { status: 400 }
      );
    }

    if (resetCode !== code) {
      return NextResponse.json(
        { message: "Invalid reset code" },
        { status: 400 }
      );
    }

    // Save the hashed password to the database

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

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

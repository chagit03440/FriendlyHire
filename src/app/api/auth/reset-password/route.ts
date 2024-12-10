import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connect from "@/app/lib/db/mongodb";
import User from "@/app/lib/models/User";
import PasswordReset from "@/app/lib/models/PasswordReset";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const record = await PasswordReset.findOne({ email });

    if (!record) {
      return res.status(404).json({ message: "Reset code not found" });
    }

    const { resetCode, resetCodeExpires } = record;

    if (Date.now() > resetCodeExpires) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    if (resetCode !== code) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // Save the hashed password to the database

    // Connect to MongoDB
    await connect();

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    await PasswordReset.deleteOne({ email });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/app/utils/email";
import PasswordReset from "@/app/lib/models/PasswordReset";

/*
 This route is responsible for sending a password reset code to the user's email.

Input:
The user provides their email address (email) in the request body.
Process:
Generates a 6-digit random code (e.g., 123456).
Sets an expiration time for the code (15 minutes from the time it is generated).
Stores the code and its expiration time in a mock database (mockDB).
Sends the reset code to the user's email using a mail service like nodemailer.
Output:
Returns a success message if the email is sent successfully.
Returns an error message if the email cannot be sent or if an invalid request is made.
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  try {
    // Save the reset code and expiration time in the database
    await PasswordReset.create({ email, resetCode, resetCodeExpires });

    // Send email
    await sendEmail(
      email,
      "Password Reset Code",
      `<p>Your password reset code is: <strong>${resetCode}</strong></p>`
    );
    return res.status(200).json({ message: "Reset code sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
}

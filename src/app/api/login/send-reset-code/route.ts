import PasswordReset from "@/app/lib/models/PasswordReset";
import { NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

  try {
    // Connect to MongoDB
    await connect();

    // Save the reset code and expiration time in the database
    await PasswordReset.findOneAndUpdate(
      { email }, // Query to find an existing document with the same email
      {
        resetCode,
        createdAt: new Date(), // Add current timestamp for expiration
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Dynamically build the base URL from the request
    const baseUrl = `${
      req.headers.get("x-forwarded-proto") || "http"
    }://${req.headers.get("host")}`;
    const sendEmailUrl = `${baseUrl}/api/sendEmail`;

    // Send email using the dynamic sendEmail URL
    const emailResponse = await fetch(sendEmailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Password Reset Code",
        htmlContent: `<p>Your password reset code is: <strong>${resetCode}</strong></p><p>This code will expire in 15 minutes.</p>`,
      }),
    });

    if (emailResponse.ok) {
      return NextResponse.json(
        { message: "Reset code sent successfully" },
        { status: 200 }
      );
    } else {
      const errorData = await emailResponse.json();
      console.error("Email sending failed:", errorData);
      return NextResponse.json(
        { message: "Failed to send email", details: errorData },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}

import EmailVerification from "@/app/lib/models/EmailVerification";
import User from "@/app/lib/models/User";
import { NextResponse } from "next/server";
import connect from "@/app/lib/db/mongodb";

export async function POST(req: Request) {
  console.log(`in send-verification-code`);
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

  // Check if a user with this email already exists
  await connect();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 400 }
    );
  }
console.log(`111111111111`);
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString(); // 6-digit code

  try {
    // Save the verification code in the database
    await EmailVerification.findOneAndUpdate(
      { email }, // Query to find an existing document with the same email
      {
        verificationCode,
        createdAt: new Date(), // Add current timestamp for expiration
      },
      {
        upsert: true,
        new: true,
      }
    );
console.log(`2222222222222222`);
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
        subject: "Email Verification Code",
        htmlContent: `<p>Your email verification code is: <strong>${verificationCode}</strong></p><p>This code will expire in 15 minutes.</p>`,
      }),
    });
console.log(`333333333333333`);
    if (emailResponse.ok) {
      return NextResponse.json(
        { message: "Verification code sent successfully" },
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

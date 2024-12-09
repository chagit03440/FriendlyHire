import { NextRequest, NextResponse } from "next/server";
import * as SibApiV3Sdk from "@sendinblue/client";

export async function POST(req: NextRequest) {
  // Parse the request body
  const body = await req.json();
  const { to, subject, htmlContent } = body;

  // Validate required fields
  if (!to || !subject || !htmlContent) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    const emailData = {
      sender: {
        name: "Friendly Hire",
        email: "viderracheli@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    };


    const response = await apiInstance.sendTransacEmail(emailData);


    return NextResponse.json(
      {
        message: "Email sent successfully",
        response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Email sending error:`, error);

    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error,
      },
      { status: 500 }
    );
  }
}

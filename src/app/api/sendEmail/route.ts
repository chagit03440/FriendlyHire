import { NextRequest, NextResponse } from "next/server";
import * as SibApiV3Sdk from "@sendinblue/client";
// import fetch from "node-fetch";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function POST(req: NextRequest) {
  // Parse the request body
  const body = await req.json();
  const { to, subject, htmlContent, attachmentUrl } = body;

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

    // Initialize email data
    interface EmailData {
      sender: {
        name: string;
        email: string;
      };
      to: {
        email: string;
      }[];
      subject: string;
      htmlContent: string;
      attachment?: {
        name: string;
        content: string;
      }[];
    }

    const emailData: EmailData = {
      sender: {
        name: "Friendly Hire",
        email: "viderracheli@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    // Add attachment if provided
    if (attachmentUrl) {
      try {
        const response = await fetch(attachmentUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const fileBuffer = await response.arrayBuffer();
        const fileBase64 = Buffer.from(fileBuffer).toString("base64");
        const fileName = attachmentUrl.split("/").pop() || "attachment";

        emailData.attachment = [
          {
            name: fileName,
            content: fileBase64,
          },
        ];
      } catch (error) {
        console.error("Error fetching or encoding attachment:", error);
        return NextResponse.json(
          { error: "Failed to process attachment" },
          { status: 400 }
        );
      }
    }

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

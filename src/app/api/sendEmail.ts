import type { NextApiRequest, NextApiResponse } from "next";
import SibApiV3Sdk from "@sendinblue/client";

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, htmlContent, sender } = req.body;

  if (!to || !subject || !htmlContent) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // Send the email via Brevo
    const emailData = {
      sender: sender || {
        name: "Default Sender",
        email: "noreply@yourdomain.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    const response = await apiInstance.sendTransacEmail(emailData);
    res
      .status(200)
      .json({ message: "Email sent successfully!", data: response });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error });
  }
};

export default sendEmail;

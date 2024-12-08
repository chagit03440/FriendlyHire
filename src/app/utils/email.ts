// utils/email.ts
export const sendEmail = async (emailData: {
  to: string;
  subject: string;
  content: string;
  sender?: { name: string; email: string };
}) => {
  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        htmlContent: emailData.content,
        sender: emailData.sender,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Email sent successfully:", result);
      return result;
    } else {
      console.error("Failed to send email:", result.error);
      throw new Error(result.error || "Failed to send email");
    }
  } catch (error) {
    console.error("An error occurred while sending the email:", error);
    throw error;
  }
};

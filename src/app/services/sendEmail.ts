export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  attachmentUrl?: string
) {
  console.log(`in the servise, the file url is: ${attachmentUrl}`);
  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        htmlContent,
        attachmentUrl, // Pass the URL of the file
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to send email");
    }

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

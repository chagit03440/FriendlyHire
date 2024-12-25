export const getEmployeeEmailTemplate = ({ jobCreatorName, userName, jobTitle }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Application</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #1a202c;">
      <div style="max-width: 600px; margin: 0 auto; padding: 32px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">FriendlyHire</h2>
          <p style="color: #a0aec0; font-size: 14px; margin: 5px 0;">פתרון הגיוס החברתי שלכם</p>
        </div>

        <!-- Email Content -->
        <div style="margin-bottom: 30px; color: #e2e8f0;">
          <p>Dear ${jobCreatorName},</p>
          
          <p>We are pleased to inform you that <strong style="color: #ffffff;">${userName}</strong> has applied for the <strong style="color: #ffffff;">${jobTitle}</strong> position you posted.</p>
          
          <p>The candidate has submitted their application and is eager to move forward in the process. Attached, you'll find their resume for your review. Please feel free to forward it to your HR team as needed.</p>
          
          <p>Once you've shared the resume, kindly let ${userName} know through your personal account on our site.</p>
          
          <p>If you have any questions or need further details, don't hesitate to reach out. We're happy to assist!</p>
          
          <div style="margin-top: 25px;">
            <p>Best regards,</p>
            <p style="color: #ffffff; font-weight: 600;">The FriendlyHire Team</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #4a5568; padding-top: 20px; margin-top: 30px; text-align: center;">
          <!-- Social Links -->
          <div style="margin-bottom: 20px;">
            <a href="https://facebook.com/friendlyhire" style="color: #ffffff; text-decoration: none; margin: 0 10px;" target="_blank">
              <svg style="width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com/friendlyhire" style="color: #ffffff; text-decoration: none; margin: 0 10px;" target="_blank">
              <svg style="width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://linkedin.com/company/friendlyhire" style="color: #ffffff; text-decoration: none; margin: 0 10px;" target="_blank">
              <svg style="width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>

          <!-- Contact Info -->
          <div style="color: #a0aec0; font-size: 14px; margin-bottom: 15px;">
            <p style="margin: 5px 0;">צור קשר: 054-1234567</p>
            <p style="margin: 5px 0;">info@friendlyhire.com</p>
          </div>

          <!-- Copyright -->
          <p style="color: #718096; font-size: 12px; margin: 0;">
            © 2024 FriendlyHire. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
    
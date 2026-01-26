import transporter from "../utils/emailTransport";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({
  to,
  subject,
  text,
}: SendEmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
    });
    // Optionally log success
  } catch (error) {
    console.error("Error sending email:", error);
    // Optionally rethrow or handle gracefully
  }
}

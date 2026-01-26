import { Request, Response } from "express";
import { authSignupService } from "../services/authSignupService";
import { generateEmailVerificationToken } from "../services/emailVerificationToken";
import { sendEmail } from "../services/emailService";

/**
 * POST /auth/signup
 *
 * Body:
 * {
 *   "email": string,
 *   "password": string
 * }
 *
 * Response:
 * { "status": "ok" }
 */
export async function authSignupController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password } = req.body;

    const { userId } = await authSignupService({ email, password });

    const token = generateEmailVerificationToken({ userId, email });
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
    if (!frontendUrl) {
      throw new Error("FRONTEND_URL must be set in environment");
    }

    const verificationLink = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: "Verify your email address",
        text: `Welcome to Cyber Lens!\n\nPlease verify your email address by clicking the link below:\n${verificationLink}\n\nIf you did not sign up, you can ignore this email.`,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue to respond with success, but log the error
    }

    // Log for development/debugging
    console.info(
      `[email-verification] Magic link for ${email}: ${verificationLink}`,
    );

    res.status(201).json({ status: "ok" });
  } catch (error) {
    // Keep error mapping minimal & safe
    const message = error instanceof Error ? error.message : "Signup failed";

    // Simple, explicit handling (no leaks)
    if (message === "Email already registered") {
      res.status(409).json({ error: message });
      return;
    }

    if (
      message === "Invalid email format" ||
      message === "Email and password are required" ||
      message === "Password must be at least 8 characters long"
    ) {
      res.status(400).json({ error: message });
      return;
    }

    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

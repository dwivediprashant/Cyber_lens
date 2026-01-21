import { Request, Response } from "express";
import { authLoginService } from "../services/authLoginService";
import { signAccessToken } from "../utils/jwt";
import { migrateAnonymousOwnerToUser } from "../utils/ownershipMigration";
export async function authLoginController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password } = req.body;

    const { userId } = await authLoginService({ email, password });

    const owner = req.owner;

    if (owner?.type === "anonymous" && owner.id) {
      void (async () => {
        try {
          await migrateAnonymousOwnerToUser(owner.id, userId);
        } catch (error) {
          console.error("Ownership migration failed:", error);
        }
      })();
    }

    req.owner = { type: "user", id: userId };
    const accessToken = signAccessToken({ userId });

    res.status(200).json({ accessToken });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";

    if (message === "Email and password are required") {
      res.status(400).json({ error: message });
      return;
    }

    if (message === "Invalid credentials") {
      res.status(401).json({ error: message });
      return;
    }

    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

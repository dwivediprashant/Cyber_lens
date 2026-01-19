import pool from "../db";
import { verifyPassword } from "../utils/password";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  userId: string;
}

export async function authLoginService(
  input: LoginInput,
): Promise<LoginResult> {
  const { email, password } = input;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT id, password_hash, email_verified
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email],
    );

    if (!result.rowCount || result.rowCount === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0] as {
      id: string;
      password_hash: string;
      email_verified: boolean;
    };

    if (!user.email_verified) {
      throw new Error("Invalid credentials");
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return { userId: user.id };
  } finally {
    client.release();
  }
}

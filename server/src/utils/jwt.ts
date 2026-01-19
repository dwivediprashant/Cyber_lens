import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = "30m";
const JWT_ALGORITHM = "HS256";

interface AccessTokenPayload {
  userId: string;
}

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in environment");
  }

  return JWT_SECRET;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const secret = getJwtSecret();

  return jwt.sign(payload, secret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    subject: payload.userId,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret, {
    algorithms: [JWT_ALGORITHM],
  });

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as JwtPayload & Partial<AccessTokenPayload>;

  if (!payload.userId) {
    throw new Error("Invalid token payload");
  }

  return { userId: payload.userId };
}

import jwt from "jsonwebtoken";

// This is the shape of data we embed inside every token.
// Keep it small — anyone can decode a JWT's payload (it's signed, not encrypted).
export interface JwtPayload {
  userId: string;
  organizationId: string;
  role: "ADMIN" | "STAFF";
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  // Throws if the token is invalid or expired — callers should catch this.
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "luna2026";

export async function signToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function validatePassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

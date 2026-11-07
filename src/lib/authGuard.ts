import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "cinijaatre-super-secret-admin-key-2026";
const CRON_SECRET = process.env.CRON_SECRET || "";

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [email, timestamp, signature] = decoded.split(":");
    if (!email || !timestamp || !signature) return false;

    // Reject tokens older than 24 hours
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime) || Date.now() - tokenTime > 24 * 60 * 60 * 1000) {
      return false;
    }

    const payload = `${email}:${timestamp}`;
    const expectedSig = createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length) return false;

    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Checks whether an incoming request has valid admin credentials:
 * 1. Via httpOnly cookie (filmygarage_admin_token or cinijaatre_admin_token)
 * 2. Via Authorization header: Bearer <token>
 * 3. Via x-admin-secret header matching ADMIN_SECRET_KEY
 */
export function verifyAdminRequest(request: NextRequest): { authorized: boolean; reason?: string } {
  // 1. Check cookies
  const cookieToken =
    request.cookies.get("filmygarage_admin_token")?.value ||
    request.cookies.get("cinijaatre_admin_token")?.value;

  if (cookieToken && verifyAdminToken(cookieToken)) {
    return { authorized: true };
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (verifyAdminToken(token)) {
      return { authorized: true };
    }
    // Also allow bearer matching ADMIN_SECRET_KEY directly for automated system calls
    if (ADMIN_SECRET && token === ADMIN_SECRET) {
      return { authorized: true };
    }
  }

  // 3. Check x-admin-secret header
  const secretHeader = request.headers.get("x-admin-secret");
  if (secretHeader && ADMIN_SECRET && secretHeader === ADMIN_SECRET) {
    return { authorized: true };
  }

  return { authorized: false, reason: "Authentication required for this operation" };
}

/**
 * Checks whether an incoming request is an authorized cron/sync execution:
 * 1. Checks Authorization Bearer header against CRON_SECRET or ADMIN_SECRET
 * 2. In production, strictly requires a match
 */
export function verifyCronRequest(request: NextRequest): { authorized: boolean; reason?: string } {
  const authHeader = request.headers.get("authorization");
  const providedBearer = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7).trim()
    : null;

  // If CRON_SECRET is configured, enforce strict verification
  if (CRON_SECRET) {
    if (providedBearer === CRON_SECRET || (ADMIN_SECRET && providedBearer === ADMIN_SECRET)) {
      return { authorized: true };
    }
    return { authorized: false, reason: "Invalid or missing cron authorization secret" };
  }

  // If ADMIN_SECRET is set, check against it
  if (ADMIN_SECRET && providedBearer === ADMIN_SECRET) {
    return { authorized: true };
  }

  // In non-production without configured secret, allow local triggers
  if (process.env.NODE_ENV !== "production") {
    return { authorized: true };
  }

  return {
    authorized: false,
    reason: "CRON_SECRET must be configured in production environment for cron endpoints",
  };
}

/**
 * Strips dangerous HTML tags and script injections to protect against Stored XSS
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Validates that an image URL is secure and safe to render
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  // Local paths
  if (url.startsWith("/")) return true;
  // Valid http / https protocols
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}


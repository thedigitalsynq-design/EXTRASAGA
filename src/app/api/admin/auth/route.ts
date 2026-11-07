import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "cinijaatre-super-secret-admin-key-2026";
const EXPECTED_EMAIL = (process.env.ADMIN_EMAIL || "admin@cinijaatre.com").toLowerCase().trim();
const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function generateToken(email: string): string {
  const timestamp = Date.now().toString();
  const payload = `${email}:${timestamp}`;
  const signature = createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

function verifyToken(token: string): boolean {
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

// GET: Check authentication status
export async function GET(req: NextRequest) {
  const token =
    req.cookies.get("filmygarage_admin_token")?.value ||
    req.cookies.get("cinijaatre_admin_token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, email: EXPECTED_EMAIL });
}

// POST: Sign in with brute-force protection
export async function POST(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for") || "unknown";
  const rateLimitKey = `admin-login-${clientIp}`;

  // Maximum 5 failed attempts per 15-minute window
  const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "ಬಹಳಷ್ಟು ವಿಫಲ ಪ್ರಯತ್ನಗಳು. ದಯವಿಟ್ಟು 15 ನಿಮಿಷಗಳ ನಂತರ ಪ್ರಯತ್ನಿಸಿ (Too many login attempts. Please wait 15 minutes).",
      },
      { status: 429, headers: { "Retry-After": "900" } }
    );
  }

  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const password = body.password || "";

    const isEmailValid =
      email === EXPECTED_EMAIL ||
      email === "admin@cinijaatre.com" ||
      email === "admin@sinikannada.com" ||
      email === "admin@extrasaga.press";
    const isPasswordValid = password === EXPECTED_PASSWORD;

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json(
        { error: "ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ (Invalid credentials)" },
        { status: 401 }
      );
    }

    // Reset rate limit on successful credentials
    resetRateLimit(rateLimitKey);

    const token = generateToken(email);
    const response = NextResponse.json({ success: true, email });

    response.cookies.set({
      name: "filmygarage_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: "ಲಾಗಿನ್ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ" }, { status: 500 });
  }
}

// DELETE: Sign out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "filmygarage_admin_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: "cinijaatre_admin_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}


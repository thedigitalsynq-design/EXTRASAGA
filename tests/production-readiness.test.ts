import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { getSiteUrl } from "@/lib/siteUrl";
import nextConfig from "../next.config.mjs";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Production Readiness: Site URL Resolution", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("defaults to http://localhost:3000 when no env is set", () => {
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("uses NEXT_PUBLIC_SITE_URL when provided and removes trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://cinijaatre.com/";
    expect(getSiteUrl()).toBe("https://cinijaatre.com");
  });

  it("formats VERCEL_URL with https:// protocol prefix", () => {
    process.env.VERCEL_URL = "cinijaatre-staging.vercel.app/";
    expect(getSiteUrl()).toBe("https://cinijaatre-staging.vercel.app");
  });
});

describe("Production Readiness: HTTP Security Headers", () => {
  it("defines comprehensive security headers in next.config.mjs", async () => {
    const config = nextConfig as unknown as { headers?: () => Promise<Array<{ source: string; headers: Array<{ key: string; value: string }> }>> };
    if (typeof config.headers === "function") {
      const headerRules = await config.headers();
      expect(headerRules.length).toBeGreaterThan(0);

      const rootHeaders = headerRules.find((r) => r.source === "/(.*)");
      expect(rootHeaders).toBeDefined();

      if (rootHeaders) {
        const headerMap = new Map(
          rootHeaders.headers.map((h) => [h.key, h.value])
        );

        expect(headerMap.get("X-Frame-Options")).toBe("SAMEORIGIN");
        expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
        expect(headerMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
        expect(headerMap.get("Strict-Transport-Security")).toContain("max-age=63072000");
        expect(headerMap.get("Content-Security-Policy")).toContain("default-src 'self'");
      }
    } else {
      throw new Error("nextConfig.headers is not a function");
    }
  });
});

describe("Production Readiness: Database Schema Integrity", () => {
  it("contains complete Theatre, Showtime, Seat Lock, and Booking definitions in supabase_schema.sql", () => {
    const schemaPath = resolve(__dirname, "../supabase_schema.sql");
    const sql = readFileSync(schemaPath, "utf-8");

    // Theatres & Showtimes
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.theatres");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.screens");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.showtimes");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.seats");

    // Concurrency Lock & Double-booking prevention
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.seat_locks");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.bookings");
    expect(sql).toContain("CREATE OR REPLACE FUNCTION public.acquire_seat_locks");

    // Storage bucket branding
    expect(sql).toContain("cinijaatre-media");
  });
});

describe("Production Security: Safeguards & Access Controls", () => {
  it("enforces sliding-window rate limiting", async () => {
    const { checkRateLimit, resetRateLimit } = await import("@/lib/rateLimit");
    const testKey = "test-security-ip-1";
    resetRateLimit(testKey);

    // Allow 3 requests
    expect(checkRateLimit(testKey, 3, 1000).allowed).toBe(true);
    expect(checkRateLimit(testKey, 3, 1000).allowed).toBe(true);
    expect(checkRateLimit(testKey, 3, 1000).allowed).toBe(true);

    // 4th request must be blocked
    const fourth = checkRateLimit(testKey, 3, 1000);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it("sanitizes dangerous XSS payloads from user input", async () => {
    const { sanitizeInput, isValidImageUrl } = await import("@/lib/authGuard");

    const dirtyScript = "Breaking News <script>alert('xss')</script> Confirmed";
    expect(sanitizeInput(dirtyScript)).toBe("Breaking News  Confirmed");

    const dirtyIframe = "Movie Update <iframe src='http://evil.com'></iframe>";
    expect(sanitizeInput(dirtyIframe)).toBe("Movie Update");

    const dirtyAttr = "<img src='x' onerror='alert(1)'>";
    expect(sanitizeInput(dirtyAttr)).not.toContain("onerror");

    // Image URL validation
    expect(isValidImageUrl("https://images.unsplash.com/photo-1")).toBe(true);
    expect(isValidImageUrl("/images/ramayana-part-1.jpg")).toBe(true);
    expect(isValidImageUrl("javascript:alert(1)")).toBe(false);
    expect(isValidImageUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("verifies and rejects tampered admin tokens", async () => {
    const { verifyAdminToken } = await import("@/lib/authGuard");

    expect(verifyAdminToken("")).toBe(false);
    expect(verifyAdminToken("invalid-token-string")).toBe(false);
    expect(verifyAdminToken("admin:9999999999999:tampered-signature")).toBe(false);
  });
});

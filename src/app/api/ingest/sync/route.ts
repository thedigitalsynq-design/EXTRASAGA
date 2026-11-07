import { NextRequest, NextResponse } from "next/server";
import { RealtimeIngestionService } from "@/lib/ingest/realtimeIngestionService";
import { LanguageCode } from "@/types";
import { verifyAdminRequest, verifyCronRequest } from "@/lib/authGuard";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Authorization: Allow authenticated Admin OR verified Cron
  const adminAuth = verifyAdminRequest(request);
  const cronAuth = verifyCronRequest(request);

  if (!adminAuth.authorized && !cronAuth.authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges or valid Cron secret required" },
      { status: 401 }
    );
  }

  // 2. Rate Limiting Safeguard: Max 5 syncs per minute to prevent overloading sources
  const clientIp = request.headers.get("x-forwarded-for") || "internal";
  const rateLimit = checkRateLimit(`ingest-sync-${clientIp}`, 5, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Sync rate limit exceeded. Please wait a minute before syncing again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    let lang: LanguageCode | undefined = undefined;
    try {
      const body = await request.json();
      if (body?.lang) lang = body.lang as LanguageCode;
    } catch {
      // body empty is fine
    }

    const report = await RealtimeIngestionService.syncAll(lang);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Sync error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

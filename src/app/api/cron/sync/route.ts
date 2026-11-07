import { NextRequest, NextResponse } from "next/server";
import { RealtimeIngestionService } from "@/lib/ingest/realtimeIngestionService";
import { verifyCronRequest } from "@/lib/authGuard";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds execution window for cron

/**
 * Automated 15-Minute Sync Endpoint
 * Configured in vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/sync", "schedule": "every 15 min" }]
 * }
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  // Enforce Cron Safeguard
  const auth = verifyCronRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.reason || "Unauthorized cron execution" },
      { status: 401 }
    );
  }

  try {
    const report = await RealtimeIngestionService.syncAll();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cadence: "15-minute cron trigger",
      report,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Cron execution error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

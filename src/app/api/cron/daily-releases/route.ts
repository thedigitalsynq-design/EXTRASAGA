import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/dataService";
import { verifyCronRequest } from "@/lib/authGuard";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Automated Daily Cinema Rollover Endpoint
 * Scheduled via vercel.json:
 * { "crons": [{ "path": "/api/cron/daily-releases", "schedule": "0 0 * * *" }] }
 * Runs at 00:00 (Midnight IST)
 */
export async function GET(request: NextRequest) {
  return handleRollover(request);
}

export async function POST(request: NextRequest) {
  return handleRollover(request);
}

async function handleRollover(request: NextRequest) {
  // Enforce Cron Safeguard
  const auth = verifyCronRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.reason || "Unauthorized cron execution" },
      { status: 401 }
    );
  }

  try {
    const log = await DataService.runDailyCinemaRollover(
      "Daily automated rollover executed via cron trigger"
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cadence: "Daily Midnight IST Rollover",
      log,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Daily rollover execution error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { BoxOfficeEngineService } from "@/lib/boxOfficeEngine/boxOfficeService";
import { verifyCronRequest } from "@/lib/authGuard";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Automated Box Office Ingestion & Reconciliation Cron Endpoint
 * Scheduled via vercel.json:
 * Runs continuously every 4 hours or hourly during peak theatrical windows.
 */
export async function GET(request: NextRequest) {
  return handleSync(request);
}

export async function POST(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  const auth = verifyCronRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.reason || "Unauthorized cron execution" },
      { status: 401 }
    );
  }

  try {
    const result = await BoxOfficeEngineService.runConsolidationPipeline();
    const health = BoxOfficeEngineService.getEngineHealth();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      cadence: "Automated Multi-Source Aggregation & Reconciliation",
      recordsProcessed: result.count,
      syncedAt: result.syncedAt,
      health,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Box office reconciliation error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


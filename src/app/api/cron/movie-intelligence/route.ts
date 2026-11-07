import { NextRequest, NextResponse } from "next/server";
import { MovieIntelligenceService } from "@/lib/movieIntelligence/movieIntelligenceService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Authorize cron caller (Vercel Cron or admin header)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized cron trigger" },
      { status: 401 }
    );
  }

  try {
    const stats = await MovieIntelligenceService.syncNow();
    return NextResponse.json({
      success: true,
      job: "movie-intelligence-daily-sync",
      executedAt: new Date().toISOString(),
      stats,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Daily movie intelligence sync failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


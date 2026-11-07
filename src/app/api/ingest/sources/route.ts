import { NextRequest, NextResponse } from "next/server";
import { RealtimeIngestionService } from "@/lib/ingest/realtimeIngestionService";
import { verifyAdminRequest } from "@/lib/authGuard";

export const dynamic = "force-dynamic";

export async function GET() {
  const sources = RealtimeIngestionService.getSources();
  return NextResponse.json({
    success: true,
    count: sources.length,
    sources,
  });
}

export async function POST(request: NextRequest) {
  // Enforce Admin Access Control
  const auth = verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.reason || "Unauthorized: Admin privileges required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, sourceId, enabled } = body;

    if (action === "toggle" && sourceId) {
      const ok = RealtimeIngestionService.toggleSource(sourceId, Boolean(enabled));
      return NextResponse.json({
        success: ok,
        message: `Source ${sourceId} ${enabled ? "enabled" : "disabled"}`,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process source update" },
      { status: 500 }
    );
  }
}

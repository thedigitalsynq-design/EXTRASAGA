import { NextRequest, NextResponse } from "next/server";
import { BoxOfficeEngineService } from "@/lib/boxOfficeEngine/boxOfficeService";
import { AdvanceBookingService } from "@/lib/boxOfficeEngine/advanceBookingService";
import { LanguageCode } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") as LanguageCode | null;
    const slug = searchParams.get("slug");
    const refresh = searchParams.get("refresh") === "true";

    if (slug) {
      const movie = await BoxOfficeEngineService.getMovieBySlug(slug);
      if (!movie) {
        return NextResponse.json(
          { success: false, error: "Movie not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: movie,
      });
    }

    const [records, cityTelemetry] = await Promise.all([
      BoxOfficeEngineService.getConsolidatedRecords(lang || undefined, refresh),
      BoxOfficeEngineService.getCityTelemetry(),
    ]);

    const health = BoxOfficeEngineService.getEngineHealth();
    const advancePulse = AdvanceBookingService.getNationalChainsPulse();
    const advanceTracked = AdvanceBookingService.getTrackedMovies();
    const stateCircuits = AdvanceBookingService.getStateCircuits();
    const aggregateMetrics = AdvanceBookingService.getAggregateMetrics();

    return NextResponse.json(
      {
        success: true,
        count: records.length,
        timestamp: new Date().toISOString(),
        records,
        cityTelemetry,
        advancePulse,
        advanceTracked,
        stateCircuits,
        aggregateMetrics,
        health: {
          activeProvidersCount: health.activeProvidersCount,
          lastSuccessfulSync: health.lastSuccessfulSync,
          status: health.reconciliationJobStatus,
          averageConfidenceScore: health.averageConfidenceScore,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Box Office API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch consolidated box office data" },
      { status: 500 }
    );
  }
}


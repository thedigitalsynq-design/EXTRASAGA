import { NextRequest, NextResponse } from "next/server";
import { MovieIntelligenceService } from "@/lib/movieIntelligence/movieIntelligenceService";
import { FilmIndustry, LanguageCode } from "@/types";
import { verifyAdminRequest } from "@/lib/authGuard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const industry = (searchParams.get("industry") as FilmIndustry) || undefined;
    const lang = (searchParams.get("lang") as LanguageCode) || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const slug = searchParams.get("slug");

    if (slug) {
      const singleMovie = await MovieIntelligenceService.getVerifiedMovieBySlug(slug);
      if (!singleMovie) {
        return NextResponse.json(
          { success: false, error: "Movie not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, movie: singleMovie });
    }

    let movies;
    if (status === "upcoming") {
      movies = await MovieIntelligenceService.getVerifiedUpcoming({ industry, language: lang, limit });
    } else if (status === "in_theatres") {
      movies = await MovieIntelligenceService.getVerifiedNowShowing({ industry, language: lang, limit });
    } else {
      movies = await MovieIntelligenceService.getAllVerifiedMovies({ industry, language: lang });
      if (limit) {
        movies = movies.slice(0, limit);
      }
    }

    const stats = await MovieIntelligenceService.getStats();

    return NextResponse.json(
      {
        success: true,
        stats,
        count: movies.length,
        movies,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load movie intelligence";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.reason || "Unauthorized: Admin authorization required" },
      { status: 401 }
    );
  }

  try {
    const stats = await MovieIntelligenceService.syncNow();
    return NextResponse.json({
      success: true,
      message: "Movie discovery & multi-source release verification synced successfully",
      stats,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to sync movie intelligence";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


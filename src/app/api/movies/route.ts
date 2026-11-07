import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/dataService";
import { Movie, MovieReleaseStatus, LanguageCode } from "@/types";
import { UpcomingTimeFilter } from "@/lib/cinemaDateUtils";
import { verifyAdminRequest, sanitizeInput } from "@/lib/authGuard";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") as MovieReleaseStatus) || undefined;
  const lang = (searchParams.get("lang") as LanguageCode) || undefined;
  const timeFilter = (searchParams.get("timeFilter") as UpcomingTimeFilter) || undefined;
  const search = searchParams.get("search") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  try {
    const movies = await DataService.getMovies({
      status,
      language: lang,
      timeFilter,
      search,
      limit,
    });

    return NextResponse.json(
      {
        success: true,
        count: movies.length,
        movies,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve movies";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
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
    const body = (await request.json()) as Partial<Movie>;
    if (!body.title || !body.theatricalReleaseDate) {
      return NextResponse.json(
        { success: false, error: "Movie title and theatrical release date are required" },
        { status: 400 }
      );
    }

    const cleanMovie: Partial<Movie> = {
      ...body,
      title: sanitizeInput(body.title),
      titleEn: body.titleEn ? sanitizeInput(body.titleEn) : "",
      synopsis: body.synopsis ? sanitizeInput(body.synopsis) : "",
      introduction: body.introduction ? sanitizeInput(body.introduction) : "",
      director: body.director ? sanitizeInput(body.director) : "",
    };

    const saved = await DataService.saveMovie(cleanMovie);
    return NextResponse.json({
      success: true,
      movie: saved,
      message: "Movie release saved and dedicated article synced successfully",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to save movie";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Enforce Admin Access Control
  const auth = verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.reason || "Unauthorized: Admin privileges required" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Movie ID is required" },
        { status: 400 }
      );
    }

    await DataService.deleteMovie(id);
    return NextResponse.json({
      success: true,
      message: "Movie entry deleted successfully",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete movie";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


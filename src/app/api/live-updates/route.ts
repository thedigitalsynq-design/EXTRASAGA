import { NextRequest, NextResponse } from "next/server";
import { LIVE_CINEMA_UPDATES, LiveCinemaUpdate } from "@/data/liveUpdatesData";
import { FilmIndustry, LanguageCode } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatRelativeTime(dateString: string, lang: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - date.getTime());
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);

    if (lang === "kn") {
      if (diffMin < 2) return "ಈಗಷ್ಟೇ";
      if (diffMin < 60) return `${diffMin} ನಿಮಿಷದ ಹಿಂದೆ`;
      return `${diffHours} ಗಂಟೆ ಹಿಂದೆ`;
    }
    if (lang === "te") {
      if (diffMin < 2) return "ఇప్పుడే";
      if (diffMin < 60) return `${diffMin} నిమిషాల క్రితం`;
      return `${diffHours} గంటల క్రితం`;
    }
    if (lang === "ta") {
      if (diffMin < 2) return "சற்று முன்";
      if (diffMin < 60) return `${diffMin} நிமிடங்களுக்கு முன்`;
      return `${diffHours} மணி நேரத்திற்கு முன்`;
    }
    if (lang === "ml") {
      if (diffMin < 2) return "ഇപ്പോൾ തന്നെ";
      if (diffMin < 60) return `${diffMin} മിനിറ്റ് മുൻപ്`;
      return `${diffHours} മണിക്കൂർ മുൻപ്`;
    }
    if (lang === "hi") {
      if (diffMin < 2) return "अभी-अभी";
      if (diffMin < 60) return `${diffMin} मिनट पहले`;
      return `${diffHours} घंटे पहले`;
    }
    // English default
    if (diffMin < 2) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    return `${diffHours}h ago`;
  } catch {
    return "Recently";
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") as LanguageCode | null;
  const industry = searchParams.get("industry") as FilmIndustry | null;
  const category = searchParams.get("category");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(Number(limitParam), 50) : 20;

  let updates = [...LIVE_CINEMA_UPDATES];

  if (lang) {
    const langFiltered = updates.filter(
      (item) => item.language === lang || (!item.language && lang === "kn")
    );
    if (langFiltered.length > 0) {
      updates = langFiltered;
    }
  }

  if (industry) {
    const indFiltered = updates.filter((item) => item.industry === industry);
    if (indFiltered.length > 0) {
      updates = indFiltered;
    }
  }

  if (category && category !== "all") {
    updates = updates.filter((item) => item.category === category);
  }

  // Format human-readable relative time
  const enriched = updates.slice(0, limit).map((item) => ({
    ...item,
    timeAgoText: formatRelativeTime(item.timestamp, lang || item.language || "en"),
  }));

  return NextResponse.json(
    {
      success: true,
      count: enriched.length,
      serverTime: new Date().toISOString(),
      activeLanguage: lang || "all",
      updates: enriched,
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}


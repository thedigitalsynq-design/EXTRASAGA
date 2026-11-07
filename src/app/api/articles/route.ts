import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/dataService";
import { CategorySlug, LanguageCode, Article } from "@/types";
import { verifyAdminRequest, sanitizeInput, isValidImageUrl } from "@/lib/authGuard";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") as LanguageCode | null;
  const cat = searchParams.get("cat") as CategorySlug | null;
  const breakingOnly = searchParams.get("breaking") === "true";
  const includePending = searchParams.get("includePending") === "true";
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 50;

  // Rate limiting for public GET: max 60 requests/minute per client IP
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimit = checkRateLimit(`articles-get-${clientIp}`, 60, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    let articles = await DataService.getArticles(
      cat || undefined,
      lang || undefined,
      includePending
    );

    if (breakingOnly) {
      articles = articles.filter((a) => a.isBreaking);
    }

    return NextResponse.json(
      {
        success: true,
        count: Math.min(articles.length, limit),
        total: articles.length,
        articles: articles.slice(0, limit),
      },
      {
        headers: {
          "Cache-Control": includePending
            ? "no-cache, no-store"
            : "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch articles";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
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
    const body = (await request.json()) as Partial<Article>;
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Title is required for article publishing" },
        { status: 400 }
      );
    }

    // Input Sanitization to prevent XSS
    const sanitizedTitle = sanitizeInput(body.title);
    const sanitizedSummary = body.summary ? sanitizeInput(body.summary) : "";
    const sanitizedContent = body.content ? sanitizeInput(body.content) : "";
    const sanitizedCaption = body.imageCaption ? sanitizeInput(body.imageCaption) : "";

    // Image URL safety check
    let safeImage = body.featuredImage || "/images/placeholder.jpg";
    if (safeImage && !isValidImageUrl(safeImage)) {
      safeImage = "/images/placeholder.jpg";
    }

    const cleanArticle: Partial<Article> = {
      ...body,
      title: sanitizedTitle,
      summary: sanitizedSummary,
      content: sanitizedContent,
      imageCaption: sanitizedCaption,
      featuredImage: safeImage,
      status: body.status || "published",
    };

    const saved = await DataService.saveArticle(cleanArticle);
    return NextResponse.json({
      success: true,
      article: saved,
      message: "Article published successfully with security sanitization",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to save article";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const { action, id } = body;

    if (action === "approve" && id) {
      const approved = await DataService.approveArticle(id);
      if (!approved) {
        return NextResponse.json(
          { success: false, error: "Article not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        article: approved,
        message: "Article approved and published live",
      });
    }

    if (action === "approve_all") {
      const count = await DataService.approveAllPendingArticles();
      return NextResponse.json({
        success: true,
        count,
        message: `${count} pending articles approved and published live`,
      });
    }

    if (action === "reject" && id) {
      await DataService.deleteArticle(id);
      return NextResponse.json({
        success: true,
        message: "Article rejected and deleted",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to process request";
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
        { success: false, error: "Article ID is required for deletion" },
        { status: 400 }
      );
    }

    const ok = await DataService.deleteArticle(id);
    return NextResponse.json({
      success: ok,
      message: ok ? "Article deleted successfully" : "Article not found",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete article";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

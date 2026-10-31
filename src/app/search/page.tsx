import React from "react";
import Link from "next/link";
import { Search as SearchIcon, Filter, AlertCircle } from "lucide-react";
import { DataService } from "@/lib/dataService";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";

interface SearchPageProps {
  searchParams: {
    q?: string;
    cat?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || "").trim().toLowerCase();
  const selectedCat = searchParams.cat || "";

  const [allArticles, trendingArticles] = await Promise.all([
    DataService.getArticles(),
    DataService.getTrendingArticles(5),
  ]);

  // Filter articles by query (checking Kannada title, English title, tags, summary, content)
  const results = allArticles.filter((article) => {
    const matchesCat = selectedCat ? article.category === selectedCat : true;
    if (!matchesCat) return false;
    if (!query) return true;

    const inTitle = article.title.toLowerCase().includes(query);
    const inTitleEn = article.titleEn?.toLowerCase().includes(query);
    const inSummary = article.summary.toLowerCase().includes(query);
    const inContent = article.content.toLowerCase().includes(query);
    const inTags = article.tags.some((t) => t.toLowerCase().includes(query));

    return inTitle || inTitleEn || inSummary || inContent || inTags;
  });

  return (
    <div className="w-full">
      <div className="bg-brand-dark border-b border-brand-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-kannada">
            ಸುದ್ದಿ ಹುಡುಕಾಟ (Search Cinema Articles)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-brand-muted font-kannada">
            ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಲೇಖನಗಳು, ವಿಮರ್ಶೆಗಳು ಹಾಗೂ ಸಂದರ್ಶನಗಳನ್ನು ಹುಡುಕಿ
          </p>

          {/* Search Form */}
          <form method="GET" action="/search" className="mt-5 max-w-2xl flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q || ""}
                placeholder="ಉದಾ: ಕಾಂತಾರ, ಯಶ್, ಕೆಜಿಎಫ್, ಮ್ಯಾಕ್ಸ್, OTT..."
                className="w-full bg-brand-card border border-brand-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-red font-kannada shadow-inner"
              />
              <SearchIcon className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-sm font-kannada transition-colors shadow-lg"
            >
              ಹುಡುಕಿ
            </button>
          </form>

          {/* Quick trending tags */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-brand-muted">
            <span className="text-gray-300 font-semibold font-kannada">ಟ್ರೆಂಡಿಂಗ್ ಸರ್ಚ್:</span>
            {["ಕಾಂತಾರ", "ಯಶ್", "ಟಾಕ್ಸಿಕ್", "ಸುದೀಪ್", "ರುಕ್ಮಿಣಿ ವಸಂತ್", "ಬಘೀರ", "ಕೆಜಿಎಫ್"].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 rounded bg-brand-card hover:bg-brand-red text-gray-300 hover:text-white text-xs font-kannada border border-brand-border/60 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-brand-border">
              <span className="text-sm font-bold text-gray-200 font-kannada">
                {query ? (
                  <>
                    &ldquo;<span className="text-brand-red">{query}</span>&rdquo; ಫಲಿತಾಂಶಗಳು: ({results.length})
                  </>
                ) : (
                  <>ಎಲ್ಲಾ ಲಭ್ಯವಿರುವ ಸುದ್ದಿಗಳು ({results.length})</>
                )}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-brand-dark p-12 rounded-2xl border border-brand-border text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-brand-yellow mx-auto" />
                <h3 className="text-base font-bold text-white font-kannada">
                  ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ!
                </h3>
                <p className="text-xs text-brand-muted font-kannada">
                  ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಮೂಲಕ ಹುಡುಕಲು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಮುಖಪುಟದ ತಾಜಾ ಸುದ್ದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-3 px-5 py-2.5 rounded-lg bg-brand-red text-white text-xs font-bold font-kannada"
                >
                  ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            )}
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
          </aside>
        </div>
      </div>
    </div>
  );
}


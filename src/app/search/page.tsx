import React from "react";
import Link from "next/link";
import { Search as SearchIcon, Filter, AlertCircle } from "lucide-react";
import { DataService } from "@/lib/dataService";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";
import { LanguageCode } from "@/types";

interface SearchPageProps {
  searchParams: {
    q?: string;
    cat?: string;
    lang?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || "").trim().toLowerCase();
  const selectedCat = searchParams.cat || "";
  const activeLang = (searchParams.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const [allArticles, trendingArticles] = await Promise.all([
    DataService.getArticles(undefined, activeLang),
    DataService.getTrendingArticles(5, activeLang),
  ]);

  // Filter articles by query (checking native title, English title, tags, summary, content)
  const results = allArticles.filter((article) => {
    const matchesCat = selectedCat ? article.category === selectedCat : true;
    if (!matchesCat) return false;
    if (!query) return true;

    const inTitle = article.title.toLowerCase().includes(query);
    const inTitleEn = article.titleEn?.toLowerCase().includes(query);
    const inSummary = article.summary.toLowerCase().includes(query);
    const inContent = (article.content ?? "").toLowerCase().includes(query);
    const inTags = article.tags.some((t) => t.toLowerCase().includes(query));

    return inTitle || inTitleEn || inSummary || inContent || inTags;
  });

  const emptyResultText: Record<string, { title: string; desc: string; btn: string }> = {
    kn: {
      title: "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ!",
      desc: "ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಮೂಲಕ ಹುಡುಕಲು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಮುಖಪುಟದ ತಾಜಾ ಸುದ್ದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
      btn: "ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ",
    },
    te: {
      title: "ఎలాంటి ఫలితాలు కనుగొనబడలేదు!",
      desc: "దయచేసి వేరే కీవర్డ్ తో వెతకండి లేదా హోమ్ పేజీ తాజా వార్తలను చూడండి.",
      btn: "హోమ్ పేజీకి వెళ్లండి",
    },
    ta: {
      title: "முடிவுகள் எதுவும் கிடைக்கவில்லை!",
      desc: "தயவுசெய்து மாற்று சொற்கள் மூலம் தேடவும் அல்லது முகப்புப் பக்க செய்திகளைப் பார்க்கவும்.",
      btn: "முகப்புக்குச் செல்லவும்",
    },
    ml: {
      title: "ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല!",
      desc: "ദയവായി മറ്റൊരു കീവേഡ് ഉപയോഗിച്ച് തിരയുക അല്ലെങ്കിൽ ഹോം പേജിലെ പുതിയ വാർത്തകൾ കാണുക.",
      btn: "ഹോം പേജിലേക്ക് പോകുക",
    },
    hi: {
      title: "कोई परिणाम नहीं मिला!",
      desc: "कृपया अन्य कीवर्ड के साथ खोजें या होम पेज पर ताज़ा ख़बरें देखें।",
      btn: "होम पेज पर जाएं",
    },
    en: {
      title: "No results found!",
      desc: "Please try searching with different keywords or explore latest cinema news on the home page.",
      btn: "Back to Home",
    },
  };

  const emptyText = emptyResultText[activeLang] || emptyResultText.kn;

  return (
    <div className="w-full">
      {/* The Search Deck — Hero Band */}
      <div className="projector-beam relative bg-hall border-b border-glow-line py-8 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="inline-block mb-3 uppercase font-display-latin text-[10px] tracking-[0.25em] text-ultra-soft border border-ultra/25 bg-ultra/10 rounded-full px-3 py-0.5">
            The Search Deck
          </span>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display-latin font-black uppercase tracking-[0.2em] ${config.badgeColor} border border-glow-line`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {config.industryName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display-latin text-popcorn tracking-tight">
            {getTranslation(activeLang, "nav_search")} ({config.industryName} Articles)
          </h1>

          {/* Search Form */}
          <form method="GET" action="/search" className="mt-5 max-w-2xl flex gap-2">
            <input type="hidden" name="lang" value={activeLang} />
            <div className="relative flex-1">
              <input
                type="text"
                name="q"
                defaultValue={searchParams.q || ""}
                placeholder={getTranslation(activeLang, "nav_search_placeholder")}
                className="w-full bg-revealed border border-glow-line rounded-xl pl-10 pr-4 py-3 text-sm text-popcorn placeholder-popcorn-muted focus:outline-none focus:border-signal shadow-2xs font-medium"
              />
              <SearchIcon className="w-4 h-4 text-popcorn-muted absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-signal-deep hover:bg-signal text-popcorn font-bold text-sm transition-colors shadow-sm"
            >
              {getTranslation(activeLang, "btn_search")}
            </button>
          </form>

          {/* Quick trending tags */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-popcorn-dim">
            <span className="text-popcorn font-semibold">{getTranslation(activeLang, "nav_hot_topics")}</span>
            {config.hotTopics.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}&lang=${activeLang}`}
                className="px-2.5 py-1 rounded-full bg-revealed hover:bg-signal-deep text-popcorn-dim hover:text-popcorn text-xs border border-glow-line transition-colors font-medium shadow-2xs"
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
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-glow-line">
              <span className="text-sm font-bold text-popcorn">
                {query ? (
                  <>
                    &ldquo;<span className="text-ultra-soft">{query}</span>&rdquo; ({results.length})
                  </>
                ) : (
                  <>{getTranslation(activeLang, "btn_all_news")} ({results.length})</>
                )}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-revealed p-12 rounded-3xl border border-glow-line text-center space-y-3 shadow-xs">
                <AlertCircle className="w-10 h-10 text-marquee-soft mx-auto" />
                <h3 className="text-base font-bold text-popcorn">
                  {emptyText.title}
                </h3>
                <p className="text-xs text-popcorn-dim">
                  {emptyText.desc}
                </p>
                <Link
                  href={`/?lang=${activeLang}`}
                  className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-signal-deep text-popcorn text-xs font-bold hover:bg-signal transition-colors shadow-sm"
                >
                  {emptyText.btn}
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


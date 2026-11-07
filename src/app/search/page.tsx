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
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/90 py-8 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              {config.industryName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-crimson focus:bg-white shadow-2xs font-medium"
              />
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-crimson hover:bg-[#8e1d27] text-white font-bold text-sm transition-colors shadow-sm"
            >
              {getTranslation(activeLang, "btn_search")}
            </button>
          </form>

          {/* Quick trending tags */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-gray-500">
            <span className="text-gray-900 font-semibold">{getTranslation(activeLang, "nav_hot_topics")}</span>
            {config.hotTopics.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}&lang=${activeLang}`}
                className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-brand-crimson text-gray-700 hover:text-white text-xs border border-gray-200 transition-colors font-medium shadow-2xs"
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
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">
                {query ? (
                  <>
                    &ldquo;<span className="text-brand-crimson">{query}</span>&rdquo; ({results.length})
                  </>
                ) : (
                  <>{getTranslation(activeLang, "btn_all_news")} ({results.length})</>
                )}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200/90 text-center space-y-3 shadow-xs">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-gray-950">
                  {emptyText.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {emptyText.desc}
                </p>
                <Link
                  href={`/?lang=${activeLang}`}
                  className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-brand-crimson text-white text-xs font-bold hover:bg-[#8e1d27] transition-colors shadow-sm"
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


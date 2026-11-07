import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Star,
  CheckCircle2,
  XCircle,
  Play,
  Crown,
  Shield,
  Heart,
  Globe,
  Sparkles,
} from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatKannadaDate } from "@/lib/utils";
import { getSiteUrl } from "@/lib/siteUrl";
import SocialShare from "@/components/SocialShare";
import CommentSection from "@/components/CommentSection";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { getLanguageConfig, SUPPORTED_LANGUAGES } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";
import { LanguageCode } from "@/types";
import { RAMAYANA_REVIEWS_BY_LANGUAGE } from "@/data/ramayanaReviewData";
import DualAxisReviewScore from "@/components/DualAxisReviewScore";
import DualLuminousDiscs from "@/components/DualLuminousDiscs";

interface ReviewPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    lang?: string;
  };
}

export async function generateMetadata({ params, searchParams }: ReviewPageProps): Promise<Metadata> {
  const review = await DataService.getReviewBySlug(params.slug, searchParams?.lang);
  if (!review) return { title: "ವಿಮರ್ಶೆ ಕಂಡುಬಂದಿಲ್ಲ" };

  const siteUrl = getSiteUrl();

  return {
    title: `${review.movieTitle} | FILMY GARAGE`,
    description: review.summary,
    openGraph: {
      title: `${review.movieTitle} Review`,
      description: review.summary,
      url: `${siteUrl}/reviews/${review.slug}`,
      images: [{ url: review.posterImage }],
    },
  };
}

export default async function MovieReviewPage({ params, searchParams }: ReviewPageProps) {
  const review = await DataService.getReviewBySlug(params.slug, searchParams?.lang);

  if (!review) {
    notFound();
  }

  const activeLang = (review.language || searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);
  const isRamayana = review.slug.startsWith("ramayana-part-1") || params.slug.startsWith("ramayana");
  const ramayanaData = isRamayana ? RAMAYANA_REVIEWS_BY_LANGUAGE[activeLang] || RAMAYANA_REVIEWS_BY_LANGUAGE.kn : null;

  const trendingArticles = await DataService.getTrendingArticles(5, activeLang);
  const siteUrl = getSiteUrl();

  const reviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${review.movieTitle} Review`,
    reviewBody: review.summary,
    datePublished: review.publishedAt,
    author: {
      "@type": "Person",
      name: review.author || `FILMY GARAGE ${config.industryName} Desk`,
    },
    publisher: {
      "@type": "Organization",
      name: "FILMY GARAGE",
      url: siteUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: review.maxRating || 5,
      worstRating: 1,
    },
    itemReviewed: {
      "@type": "Movie",
      name: review.movieTitle,
      director: {
        "@type": "Person",
        name: review.director,
      },
      image: review.posterImage,
      dateCreated: review.releaseDate,
    },
  };

  const reviewBadges: Record<string, string> = {
    kn: "ವಿಶೇಷ ಸಿನಿಮಾ ವಿಮರ್ಶೆ",
    te: "ప్రత్యేక సినిమా రివ్యూ",
    ta: "பிரத்தியேக திரைப்பட விமர்சனம்",
    ml: "പ്രത്യേക സിനിമാ റിവ്യൂ",
    hi: "एक्सक्लूसिव मूवी रिव्यू",
    en: "Exclusive Movie Review",
  };

  const storyLabel: Record<string, string> = {
    kn: "ಕಥೆ ಮತ್ತು ಚಿತ್ರಕಥೆ (Story & Screenplay)",
    te: "కథ మరియు స్క్రీన్‌ప్లే (Story & Screenplay)",
    ta: "கதை மற்றும் திரைக்கதை (Story & Screenplay)",
    ml: "കഥയും തിരക്കഥയും (Story & Screenplay)",
    hi: "कहानी और पटकथा (Story & Screenplay)",
    en: "Story & Screenplay",
  };

  const perfLabel: Record<string, string> = {
    kn: "ಕಲಾವಿದರ ಅಭಿನಯ (Performances)",
    te: "నటీనటుల నటన (Performances)",
    ta: "நடிகர்களின் நடிப்பு (Performances)",
    ml: "താരങ്ങളുടെ പ്രകടനം (Performances)",
    hi: "कलाकारों का अभिनय (Performances)",
    en: "Performances",
  };

  const dirLabel: Record<string, string> = {
    kn: "ನಿರ್ದೇಶನ ಮತ್ತು ತಾಂತ್ರಿಕತೆ (Direction & Technicalities)",
    te: "దర్శకత్వం మరియు సాంకేతిక వర్గం (Direction & Technicalities)",
    ta: "இயக்கம் மற்றும் தொழில்நுட்பம் (Direction & Technicalities)",
    ml: "സംവിധാനവും സാങ്കേതിക മികവും (Direction & Technicalities)",
    hi: "निर्देशन और तकनीकी पहलू (Direction & Technicalities)",
    en: "Direction & Technical Aspects",
  };

  const musicLabel: Record<string, string> = {
    kn: "ಸಂಗೀತ ಮತ್ತು ಹಿನ್ನೆಲೆ ಧ್ವನಿ (Music & BGM)",
    te: "సంగీతం మరియు నేపథ్య సంగీతం (Music & BGM)",
    ta: "இசை மற்றும் பின்னணி இசை (Music & BGM)",
    ml: "സംഗീതവും പശ്ചാത്തല സംഗീതവും (Music & BGM)",
    hi: "संगीत और बैकग्राउंड स्कोर (Music & BGM)",
    en: "Music & Background Score",
  };

  const prosLabel: Record<string, string> = {
    kn: "ಮೆಚ್ಚುಗೆಯ ಅಂಶಗಳು (Pros)",
    te: "ప్లస్ పాయింట్లు (Pros)",
    ta: "படத்தின் பலங்கள் (Pros)",
    ml: "പോസിറ്റീവ് വശങ്ങൾ (Pros)",
    hi: "सकारात्मक पहलू (Pros)",
    en: "Strengths (Pros)",
  };

  const consLabel: Record<string, string> = {
    kn: "ಹಿನ್ನಡೆಯ ಅಂಶಗಳು (Cons)",
    te: "మైనస్ పాయింట్లు (Cons)",
    ta: "படத்தின் பலவீனங்கள் (Cons)",
    ml: "നെഗറ്റീവ് വശങ്ങൾ (Cons)",
    hi: "कमज़ोर कड़ियाँ (Cons)",
    en: "Weaknesses (Cons)",
  };

  const verdictLabel: Record<string, string> = {
    kn: "ಅಂತಿಮ ತೀರ್ಪು (FINAL VERDICT)",
    te: "తుది తీర్పు (FINAL VERDICT)",
    ta: "இறுதி தீர்ப்பு (FINAL VERDICT)",
    ml: "അന്തിമ വിധി (FINAL VERDICT)",
    hi: "अंतिम फैसला (FINAL VERDICT)",
    en: "FINAL VERDICT",
  };

  return (
    <div className="w-full">
      {/* Schema.org Review & Movie structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/90 py-3 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-500">
          <Link href={`/?lang=${activeLang}`} className="hover:text-gray-950 font-medium transition-colors">
            {getTranslation(activeLang, "nav_home")}
          </Link>
          <span>/</span>
          <Link
            href={`/category/reviews?lang=${activeLang}`}
            className="hover:text-brand-crimson text-gray-700 font-medium transition-colors"
          >
            {getTranslation(activeLang, "nav_reviews")}
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-xs sm:max-w-md">{review.movieTitle}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Review Column (Col 8) */}
          <main className="lg:col-span-8 space-y-8">
            <article className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-sm">
              {/* Language Toolbar if Ramayana */}
              {isRamayana && (
                <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold">
                    <Crown className="w-4 h-4 text-amber-700" />
                    <span>ರಾಮಾಯಣ ಭಾಗ 1 – ಎಲ್ಲಾ 6 ಭಾಷೆಗಳಲ್ಲಿ ವಿಮರ್ಶೆ ಓದಿ:</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SUPPORTED_LANGUAGES.map((l) => {
                      const isCurrent = activeLang === l.code;
                      const langSlugMap: Record<string, string> = {
                        kn: "ramayana-part-1-kannada-review",
                        te: "ramayana-part-1-telugu-review",
                        ta: "ramayana-part-1-tamil-review",
                        hi: "ramayana-part-1-hindi-review",
                        ml: "ramayana-part-1-malayalam-review",
                        en: "ramayana-part-1-english-review",
                      };
                      return (
                        <Link
                          key={l.code}
                          href={`/reviews/${langSlugMap[l.code]}?lang=${l.code}`}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            isCurrent
                              ? "bg-amber-600 text-white shadow-xs font-black"
                              : "bg-white text-gray-700 hover:text-gray-950 border border-gray-200"
                          }`}
                        >
                          <span>{l.flagEmoji}</span>
                          <span>{l.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {isRamayana ? (
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 text-xs font-black uppercase rounded-full border border-amber-300 bg-amber-100 text-amber-900 shadow-2xs select-none">
                      <Crown className="w-3.5 h-3.5 text-amber-700" />
                      <span>MAGNUM OPUS SPECIAL REVIEW</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shadow-2xs">
                      {reviewBadges[activeLang] || reviewBadges.kn}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                    {config.industryName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 font-sans">
                  <span>📅 {formatKannadaDate(review.releaseDate)}</span>
                  <span>•</span>
                  <span>⏱️ {review.runtime}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-800 font-bold">
                    {review.censorRating}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 leading-tight tracking-tight">
                {review.movieTitle} {isRamayana ? "– NOT JUST A MOVIE, IT'S OUR PRIDE!" : activeLang === "en" ? "Movie Review" : "ರಿವ್ಯೂ"}
              </h1>
              <p className="text-sm text-amber-800 font-sans font-bold mt-1">
                {isRamayana ? "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA" : `${review.movieTitleEn} Detailed Review & Analysis`}
              </p>

              {/* Hero Movie Card: Poster + Star Rating + Quick Specs */}
              <div className={`my-6 p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center md:items-start ${
                isRamayana ? "bg-amber-50/80 border border-amber-200 shadow-sm" : "bg-gray-50/90 border border-gray-200 shadow-2xs"
              }`}>
                <div className="relative w-48 h-64 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <Image
                    src={review.posterImage}
                    alt={review.movieTitle}
                    fill
                    priority
                    className="object-cover"
                    sizes="200px"
                  />
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  {/* Rating Showcase */}
                  {isRamayana ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-xl border border-amber-300 shadow-2xs">
                        <Crown className="w-5 h-5 text-amber-700" />
                        <span className="text-base sm:text-lg font-black text-amber-900 font-sans">
                          NO RATINGS • ONLY RESPECT!
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium">
                        {ramayanaData?.reviewScoreNote || "ರಾಮಾಯಣಕ್ಕೆ ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ನೀಡುವ ಅಗತ್ಯವೇ ಇಲ್ಲ. ಇದು ನಮ್ಮ ಹೆಮ್ಮೆ. ನಮ್ಮ ಪರಂಪರೆ."}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-amber-300 shadow-sm">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
                        <span className="text-2xl font-black text-gray-950 font-sans">
                          {review.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 font-sans">/ 5.0</span>
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-red-50 text-brand-crimson font-bold text-xs border border-red-200">
                        {review.verdict}
                      </div>
                    </div>
                  )}

                  {/* Cast & Crew Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                    <div>
                      <span className="text-gray-500">{activeLang === "en" ? "Director:" : "ನಿರ್ದೇಶನ:"}</span>{" "}
                      <strong className="text-gray-950">{review.director}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">{activeLang === "en" ? "Music:" : "ಸಂಗೀತ:"}</span>{" "}
                      <strong className="text-gray-950">{review.musicDirector}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">{activeLang === "en" ? "Cinematography:" : "ಛಾಯಾಗ್ರಹಣ:"}</span>{" "}
                      <strong className="text-gray-950">{review.cinematography || "Tech Crew"}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">{activeLang === "en" ? "Producers:" : "ನಿರ್ಮಾಣ:"}</span>{" "}
                      <strong className="text-gray-950">{review.producers.join(", ")}</strong>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-start pt-1">
                    {review.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-full bg-white text-xs text-gray-700 border border-gray-200 shadow-2xs font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Share */}
              <SocialShare title={`${review.movieTitle} Review`} />

              {/* Summary */}
              <div className="my-6 p-4 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 border border-amber-200 shadow-2xs">
                <h3 className="text-base font-bold text-amber-900 mb-1">
                  {activeLang === "en" ? "Synopsis" : "ಕಥಾಸಾರಾಂಶ"}
                </h3>
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
                  {review.summary}
                </p>
              </div>

              {/* In-depth Breakdowns */}
              {isRamayana && ramayanaData ? (
                <div className="space-y-6">
                  {/* Star Cast Spotlight */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-xs">
                    <h3 className="text-base font-black text-amber-950 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-700" />
                      <span>ಪ್ರಮುಖ ಪಾತ್ರಧಾರಿಗಳ ಅದ್ಭುತ ಚಿತ್ರಣ (Star Cast & Characters)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ramayanaData.characterHighlights.map((char, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-2xs">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-sm font-black text-amber-900 font-sans">{char.actor}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
                              {char.character}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">{char.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reverence Full Review Text */}
                  <div className="prose max-w-none text-sm sm:text-base text-gray-800 leading-relaxed space-y-4 whitespace-pre-line p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs font-normal">
                    {ramayanaData.fullReviewText.trim()}
                  </div>

                  {/* Reverence Declaration Banner */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 border border-amber-300 text-center shadow-xs">
                    <div className="text-xs uppercase tracking-widest text-amber-900 font-bold mb-2">
                      🚩 OUR FAITH • OUR CULTURE • OUR PRIDE
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-950">
                      {ramayanaData.closingLine}
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-amber-900/90 font-medium max-w-xl mx-auto">
                      {ramayanaData.reviewScoreNote}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
                  <div>
                    <h3 className="text-xl font-bold text-gray-950 mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-brand-crimson rounded"></span>
                      {storyLabel[activeLang] || storyLabel.kn}
                    </h3>
                    <p>{review.storyAnalysis}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-950 mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-amber-500 rounded"></span>
                      {perfLabel[activeLang] || perfLabel.kn}
                    </h3>
                    <p>{review.performanceAnalysis}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-950 mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-emerald-600 rounded"></span>
                      {dirLabel[activeLang] || dirLabel.kn}
                    </h3>
                    <p>{review.directionAnalysis}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-950 mb-2 flex items-center gap-2">
                      <span className="w-2 h-5 bg-sky-600 rounded"></span>
                      {musicLabel[activeLang] || musicLabel.kn}
                    </h3>
                    <p>{review.musicAnalysis}</p>
                  </div>
                </div>
              )}

              {/* Dual-Axis Critical Review Matrix & Interactive Spoiler Shield */}
              <DualAxisReviewScore review={review} />

              {/* Overlapping Dual Luminous Discs (Direct Design Reference Implementation) */}
              <DualLuminousDiscs
                sectionIndex="01"
                totalSections="06"
                categoryLabel={`${review.movieTitle} Evaluation`}
                heading={`${review.movieTitle} — Narrative Conflict Met With Technical Mastery`}
                problemTitle={review.cons[0] ? `Critical Friction: ${review.cons[0]}` : "Artistic Challenge"}
                problemDesc={review.storyAnalysis?.slice(0, 160) || "Navigating complex narrative pacing across multi-character arcs while maintaining viewer emotional investment."}
                solutionTitle={review.pros[0] ? `Triumph: ${review.pros[0]}` : "Craft Breakthrough"}
                solutionDesc={review.directionAnalysis?.slice(0, 160) || "Directional command and technical precision coalesce to deliver an unforgettable theatrical payoff."}
              />

              {/* Pros and Cons Matrix */}
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pros */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
                  <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {prosLabel[activeLang] || prosLabel.kn}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {review.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 shadow-2xs">
                  <h4 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-3">
                    <XCircle className="w-4 h-4 text-brand-crimson" />
                    {consLabel[activeLang] || consLabel.kn}
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {review.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-crimson font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Final Verdict Card */}
              <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-200 text-center shadow-xs">
                <span className="text-xs uppercase tracking-wider text-amber-800 font-bold block mb-1">
                  {verdictLabel[activeLang] || verdictLabel.kn}
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-gray-950">
                  &ldquo;{review.verdict}&rdquo;
                </p>
                {review.boxOfficeSummary && (
                  <p className="mt-2 text-xs text-gray-600 font-medium">
                    💰 {review.boxOfficeSummary}
                  </p>
                )}
              </div>

              {/* Embedded Trailer if available */}
              {review.trailerYoutubeId && (
                <div className="my-8">
                  <h3 className="text-lg font-bold text-gray-950 mb-3 flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-crimson" />
                    {getTranslation(activeLang, "btn_watch_trailer")}
                  </h3>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${review.trailerYoutubeId}`}
                      title={`${review.movieTitle} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-none"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* In-Article Ad */}
              <AdBanner placement="in_article" />

              {/* Comments Section */}
              <CommentSection articleId={review.id} />
            </article>
          </main>

          {/* Sidebar (Col 4) */}
          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <AdBanner placement="sidebar_rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}

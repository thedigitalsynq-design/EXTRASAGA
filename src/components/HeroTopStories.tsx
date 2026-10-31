import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Clock, Flame } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaDate, formatKannadaNumber } from "@/lib/utils";

interface HeroTopStoriesProps {
  articles: Article[];
}

export default function HeroTopStories({ articles }: HeroTopStoriesProps) {
  if (!articles || articles.length === 0) return null;

  const leadStory = articles[0];
  const secondaryStories = articles.slice(1, 3);

  return (
    <section className="w-full my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Lead Story (Col 8) */}
        {leadStory && (
          <div className="lg:col-span-8 group relative rounded-2xl overflow-hidden bg-brand-dark border border-brand-border/80 shadow-2xl">
            <Link href={`/news/${leadStory.slug}`} className="block relative aspect-[16/10] sm:aspect-[16/9] w-full">
              <Image
                src={leadStory.featuredImage}
                alt={leadStory.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent"></div>

              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold font-kannada tracking-wide shadow-lg">
                  {leadStory.categoryName}
                </span>
                {leadStory.isTopStory && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-xs font-bold font-kannada flex items-center gap-1 shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    ಟಾಪ್ ಸ್ಟೋರಿ
                  </span>
                )}
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-kannada leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                  {leadStory.title}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-gray-300 font-kannada line-clamp-2 max-w-3xl hidden sm:block">
                  {leadStory.summary}
                </p>

                {/* Metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400 font-sans">
                  <span className="font-kannada text-gray-300 font-medium">
                    ✍️ {leadStory.author.name}
                  </span>
                  <span>•</span>
                  <span>📅 {formatKannadaDate(leadStory.publishedAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-muted" />
                    {leadStory.readTimeMinutes} ನಿಮಿಷ ಓದು
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-gray-300 font-semibold">
                    <Eye className="w-3.5 h-3.5 text-brand-red" />
                    {formatKannadaNumber(leadStory.views)} ವೀಕ್ಷಣೆಗಳು
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Secondary Stories (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {secondaryStories.map((item) => (
            <div
              key={item.id}
              className="group relative flex-1 rounded-2xl overflow-hidden bg-brand-dark border border-brand-border/80 shadow-lg min-h-[200px]"
            >
              <Link href={`/news/${item.slug}`} className="block relative h-full w-full">
                <div className="relative aspect-[16/9] lg:h-full w-full">
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent"></div>

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-dark/90 text-white text-[11px] font-semibold font-kannada border border-brand-border">
                      {item.categoryName}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-sm sm:text-base font-bold text-white font-kannada leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
                      <span>{formatKannadaDate(item.publishedAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-brand-red" />
                        {formatKannadaNumber(item.views)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

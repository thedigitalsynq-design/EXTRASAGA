import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tv, ExternalLink, Calendar, ChevronRight } from "lucide-react";
import { OttRelease } from "@/types";

interface OttSectionProps {
  releases: OttRelease[];
}

export default function OttSection({ releases }: OttSectionProps) {
  return (
    <section className="my-10 bg-gradient-to-br from-brand-dark via-brand-black to-brand-dark rounded-2xl border border-brand-border/80 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
              OTT ರಿಲೀಸ್ ಅಪ್ಡೇಟ್ (OTT Releases)
            </h2>
            <p className="text-xs text-brand-muted font-kannada">
              ನೆಟ್‌ಫ್ಲಿಕ್ಸ್, ಪ್ರೈಮ್ ವಿಡಿಯೋ, ಜೀ5 ನಲ್ಲಿ ಕನ್ನಡ ಸಿನಿಮಾಗಳು
            </p>
          </div>
        </div>

        <Link
          href="/ott"
          className="text-xs sm:text-sm font-semibold text-sky-400 hover:text-white flex items-center gap-1 font-kannada transition-colors"
        >
          <span>ಎಲ್ಲಾ OTT ಚಿತ್ರಗಳು</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {releases.map((item) => (
          <div
            key={item.id}
            className="group bg-brand-card rounded-xl overflow-hidden border border-brand-border hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={item.posterImage}
                  alt={item.movieTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>

                {/* Platform Badge */}
                <span
                  className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans shadow-md ${item.platformBadgeColor}`}
                >
                  {item.platform}
                </span>

                <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-gray-300 font-kannada">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  <span>{item.releaseDate}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 font-kannada transition-colors line-clamp-1">
                  {item.movieTitle}
                </h3>
                <p className="mt-1 text-xs text-gray-400 font-kannada line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {item.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-0.5 rounded bg-brand-dark text-gray-300 text-[10px] font-kannada border border-brand-border/60"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <a
                href={item.watchUrl || "https://www.netflix.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 font-kannada transition-colors border border-sky-500/30"
              >
                <span>ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


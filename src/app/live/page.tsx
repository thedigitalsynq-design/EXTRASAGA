import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Radio, RefreshCw, Zap, ShieldCheck } from "lucide-react";
import LiveUpdatesFeed from "@/components/LiveUpdatesFeed";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdBanner from "@/components/AdBanner";
import { DataService } from "@/lib/dataService";
import { getLanguageConfig } from "@/lib/languages";
import { getTranslation } from "@/lib/translations";
import { LanguageCode } from "@/types";

interface LivePageProps {
  searchParams?: {
    lang?: string;
  };
}

export async function generateMetadata({ searchParams }: LivePageProps): Promise<Metadata> {
  const lang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(lang);

  return {
    title: `FILMY GARAGE Live Wire | Real-Time ${config.industryName} Updates`,
    description: `Real-time minute-by-minute cinema breaking news, live box office tracking, and shooting updates for ${config.industryName}.`,
  };
}

export default async function LiveWirePage({ searchParams }: LivePageProps) {
  const activeLang = (searchParams?.lang || "kn") as LanguageCode;
  const config = getLanguageConfig(activeLang);

  const trendingArticles = await DataService.getTrendingArticles(5, activeLang);

  const pageHeaders: Record<string, { title: string; desc: string }> = {
    kn: {
      title: "ರಿಯಲ್-ಟೈಮ್ ಲೈವ್ ಸಿನಿಮಾ ವೈರ್ (Live Cinema Wire)",
      desc: "ಪ್ರತಿ ನಿಮಿಷದ ಅಧಿಕೃತ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ, ಚಿತ್ರೀಕರಣದ ಅಪ್ಡೇಟ್ಸ್, ಟ್ರೇಲರ್ ಡ್ರಾಪ್ಸ್ ಹಾಗೂ ಬ್ರೇಕಿಂಗ್ ಸಿನಿಮಾ ಸಮಾಚಾರ.",
    },
    te: {
      title: "రియల్-టైమ్ లైవ్ సినిమా వైర్ (Live Cinema Wire)",
      desc: "టాలీవుడ్ తాజా అధికారిక బాక్సాఫీస్ రిపోర్ట్స్, షూటింగ్ విశేషాలు మరియు బ్రేకింగ్ వార్తలు క్షణక్షణం.",
    },
    ta: {
      title: "ரியல்-டைம் லைவ் சினிமா வயர் (Live Cinema Wire)",
      desc: "கோலிவுட் அதிகாரப்பூர்வ பாக்ஸ் ஆபீஸ் வசூல் விவரங்கள், படப்பிடிப்பு தகவல்கள் மற்றும் பிரேக்கிங் அப்டேட்ஸ்.",
    },
    ml: {
      title: "തത്സമയ ലൈവ് സിനിമാ വയർ (Live Cinema Wire)",
      desc: "മോളിവുഡ് പുതിയ കളക്ഷൻ റിപ്പോർട്ടുകൾ, ഷൂട്ടിംഗ് വിവരങ്ങൾ, ട്രെയിലർ ലോഞ്ചുകൾ തത്സമയം.",
    },
    hi: {
      title: "रियल-टाइम लाइव सिनेमा वायर (Live Cinema Wire)",
      desc: "बॉलीवुड की मिनट-दर-मिनट ताज़ा बॉक्स ऑफिस रिपोर्ट, शूटिंग अपडेट्स और ब्रेकिंग न्यूज़.",
    },
    en: {
      title: "Real-Time Cinema Live Wire",
      desc: "Minute-by-minute verified box office records, shooting buzz, trailer launches, and trade intelligence.",
    },
  };

  const header = pageHeaders[activeLang] || pageHeaders.en;

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/90 py-8 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link href={`/?lang=${activeLang}`} className="hover:text-gray-950 font-medium">
              {getTranslation(activeLang, "nav_home")}
            </Link>
            <span>/</span>
            <span className="text-brand-crimson font-bold">LIVE WIRE</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-crimson"></span>
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-black uppercase tracking-wider ${config.badgeColor} border`}
            >
              {config.industryName} Real-Time Feed
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight">
            {header.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
            {header.desc}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8">
            <LiveUpdatesFeed />
          </main>

          <aside className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <AdBanner placement="sidebar_rectangle" />
          </aside>
        </div>
      </div>
    </div>
  );
}


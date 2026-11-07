"use client";

import React, { useState } from "react";
import { MessageSquareQuote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  initials: string;
  accent: string;
}

const TESTIMONIALS_DATA: Record<string, Testimonial[]> = {
  kn: [
    {
      id: "t1",
      quote:
        "ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್ ನನ್ನ ಸಿನಿಮಾ ಅನುಭವವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಬದಲಾಯಿಸಿದೆ! ಡ್ಯುಯಲ್-ಆಕ್ಸಿಸ್ ತಾಂತ್ರಿಕ ಹಾಗೂ ಭಾವನಾತ್ಮಕ ವಿಮರ್ಶೆ ಅತ್ಯಂತ ನಿಖರವಾಗಿದೆ, ಮತ್ತು ಬಾಕ್ಸ್ ಆಫೀಸ್ ಅಂಕಿಅಂಶಗಳು ನಂಬಲರ್ಹ.",
      author: "ಪ್ರವೀಣ್ ಕುಮಾರ್",
      role: "ಸ್ವತಂತ್ರ ನಿರ್ದೇಶಕ & ಚಿತ್ರಕಥೆಗಾರ",
      location: "ಬೆಂಗಳೂರು, ಸ್ಯಾಂಡಲ್ವುಡ್",
      initials: "PK",
      accent: "from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-300",
    },
    {
      id: "t2",
      quote:
        "ಕೊನೆಗೂ ಸಿನಿಮಾವನ್ನು ಕಲೆಯಾಗಿ ಗೌರವಿಸುವ ಡಿಜಿಟಲ್ ಮಾಧ್ಯಮ ದೊರೆತಿದೆ. ದೀರ್ಘಾವಧಿಯ ವಿಶ್ಲೇಷಣೆಗಳು ಮತ್ತು ಸ್ಪಾಯ್ಲರ್-ಮುಕ್ತ ಆಡಿಟ್‌ಗಳು ಸಮಯ ಉಳಿಸುತ್ತವೆ ಹಾಗೂ ಉತ್ಕೃಷ್ಟ ಒಳನೋಟ ನೀಡುತ್ತವೆ.",
      author: "ಅನನ್ಯಾ ಅಯ್ಯರ್",
      role: "ಫಿಲ್ಮ್ ಫೆಸ್ಟಿವಲ್ ಕ್ಯೂರೇಟರ್",
      location: "ಚೆನ್ನೈ / ಬೆಂಗಳೂರು",
      initials: "AI",
      accent: "from-rose-500/20 to-rose-700/10 border-rose-500/30 text-rose-300",
    },
    {
      id: "t3",
      quote:
        "ಪ್ರಾದೇಶಿಕ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಟೆರಿಟರಿ ವರದಿಗಾರಿಕೆ ಅದ್ಭುತವಾಗಿದೆ. ಪ್ರತಿ ಮುಂಬರುವ ಸಿನಿಮಾದ ಕೌಂಟ್‌ಡೌನ್ ಹಾಗೂ ಟ್ರೇಡ್ ಅಪ್ಡೇಟ್ ಪ್ರಕಟಣೆಗೆ ಮುನ್ನ ಕೂಲಂಕಷವಾಗಿ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿರುತ್ತದೆ.",
      author: "ವಿಕ್ರಮಾದಿತ್ಯ ರಾವ್",
      role: "ಸಿನಿಮಾ ಟ್ರೇಡ್ ವಿಶ್ಲೇಷಕ",
      location: "ಹೈದರಾಬಾದ್",
      initials: "VR",
      accent: "from-cyan-500/20 to-cyan-700/10 border-cyan-500/30 text-cyan-300",
    },
    {
      id: "t4",
      quote:
        "ವಿಶ್ವದರ್ಜೆಯ ವಿನ್ಯಾಸ ಮತ್ತು ಕಣ್ಣಿಗೆ ತಂಪು ನೀಡುವ ಟೈಪೋಗ್ರಫಿ. ಯಾವುದೇ ಕಿರಿಕಿರಿ ಉಂಟುಮಾಡುವ ಜಾಹೀರಾತುಗಳಿಲ್ಲ, ಕ್ಲಿಕ್‌ಬೇಟ್ ಮುಕ್ತ ಶೀರ್ಷಿಕೆಗಳು. ನಿಜವಾದ ಸಿನಿಪ್ರೇಮಿಗಳಿಗೆ ಹೇಳಿಮಾಡಿಸಿದ ಪೋರ್ಟಲ್.",
      author: "ಸಿದ್ಧಾರ್ಥ್ ಮಲ್ಹೋತ್ರಾ",
      role: "ಸಾಂಸ್ಕೃತಿಕ ಪತ್ರಕರ್ತ",
      location: "ಮುಂಬೈ",
      initials: "SM",
      accent: "from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-300",
    },
  ],
  en: [
    {
      id: "t1",
      quote:
        "FILMY GARAGE completely transformed how I track Indian cinema! The dual-axis technical vs story score is spot-on, and the real-time box office analytics are the most accurate in the industry.",
      author: "Praveen Kumar",
      role: "Independent Filmmaker & Screenwriter",
      location: "Bengaluru, Sandalwood",
      initials: "PK",
      accent: "from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-300",
    },
    {
      id: "t2",
      quote:
        "Finally, a digital publication that truly respects film as an art form. The long-form retrospectives save me hours and always deliver nuanced, intelligent cinema perspectives.",
      author: "Ananya Iyer",
      role: "Film Festival Programmer & Critic",
      location: "Chennai / Bengaluru",
      initials: "AI",
      accent: "from-rose-500/20 to-rose-700/10 border-rose-500/30 text-rose-300",
    },
    {
      id: "t3",
      quote:
        "The depth of box-office territory reporting and multi-industry release countdowns is incredible. Every release metric has become a staple in my morning routine.",
      author: "Vikramaditya Rao",
      role: "Cinema Trade Analyst",
      location: "Hyderabad, Tollywood",
      initials: "VR",
      accent: "from-cyan-500/20 to-cyan-700/10 border-cyan-500/30 text-cyan-300",
    },
    {
      id: "t4",
      quote:
        "FILMY GARAGE understands world-class visual design. Zero sensational clickbait, clean typography in regional scripts, and blazing fast performance. Simply gold standard.",
      author: "Siddharth Malhotra",
      role: "Cultural Journalist & Cinephile",
      location: "Mumbai, Bollywood",
      initials: "SM",
      accent: "from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-300",
    },
  ],
};

export default function EditorialTestimonials() {
  const { language } = useLanguage();
  const [pageIndex, setPageIndex] = useState(0);

  const testimonials = TESTIMONIALS_DATA[language] || TESTIMONIALS_DATA.en;

  const headerMap: Record<string, { pill: string; title: string; subtitle: string }> = {
    kn: {
      pill: "ವಿಮರ್ಶಕರ ಮೆಚ್ಚುಗೆ",
      title: "ಚಿತ್ರಕರ್ತರು ಮತ್ತು ಪ್ರೇಕ್ಷಕರು ಏನನ್ನುತ್ತಾರೆ",
      subtitle: "ಸಿನಿ ಜಾತ್ರೆ ಅನ್ನು ತಮ್ಮ ನಿತ್ಯದ ಸಿನಿಮಾ ಮಾಹಿತಿಯ ಮೂಲವನ್ನಾಗಿ ಮಾಡಿಕೊಂಡಿರುವ ಚಲನಚಿತ್ರ ನಿರ್ಮಾಪಕರು, ವಿಮರ್ಶಕರು ಮತ್ತು ಸಿನಿಪ್ರೇಮಿಗಳ ಅಭಿಪ್ರಾಯ.",
    },
    te: {
      pill: "ప్రశంసలు & నమ్మకం",
      title: "సినిమా విశ్లేషకులు మరియు ప్రేక్షకుల మాట",
      subtitle: "సిని జాతర అందించే నిష్పాక్షిక సినిమా జర్నలిజంపై సినీ ప్రముఖులు మరియు సినీ ప్రేమికుల అనుభవాలు.",
    },
    ta: {
      pill: "விமர்சகர்களின் பாராட்டு",
      title: "திரைப்பட ஆர்வலர்கள் மற்றும் வல்லுநர்களின் கருத்து",
      subtitle: "சினி ஜாத்திரையை தங்களின் தினசரி சினிமா நுண்ணறிவுத் தளமாகத் தேர்ந்தெடுத்த கலைஞர்களின் குரல்.",
    },
    ml: {
      pill: "പ്രേക്ഷക പ്രശംസ",
      title: "സിനിമാപ്രവർത്തകരും പ്രേക്ഷകരും പറയുന്നത്",
      subtitle: "സിനി ജാത്രയുടെ ആധികാരിക സിനിമാ വിശകലനങ്ങളെക്കുറിച്ചുള്ള പ്രതികരണങ്ങൾ.",
    },
    hi: {
      pill: "समीक्षकों की राय",
      title: "फिल्मकार और सिनेमा प्रेमी क्या कहते हैं",
      subtitle: "सिने जात्रा को अपनी दैनिक सिनेमाई दिनचर्या का हिस्सा बनाने वाले निर्देशकों और दर्शकों के विचार.",
    },
    en: {
      pill: "COMMUNITY & VOICES",
      title: "What cinema leaders & audiences say",
      subtitle: "Hear from filmmakers, national critics, and passionate cinephiles who make EXTRASAGA their daily morning cinema intelligence ritual.",
    },
  };

  const headerText = headerMap[language] || headerMap.en;

  return (
    <section aria-label="Editorial Testimonials" className="w-full py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gray-100 border border-gray-200 text-gray-700 shadow-2xs select-none">
          <MessageSquareQuote className="w-3.5 h-3.5 text-rose-600" />
          <span>{headerText.pill}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 tracking-tight font-sans">
          {headerText.title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
          {headerText.subtitle}
        </p>
      </div>

      {/* 4 Clean Vertical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="rounded-[28px] glass-bento bg-white/70 backdrop-blur-2xl border border-white/90 p-6 flex flex-col justify-between hover:border-white transition-cinema gpu-layer shadow-[0_12px_36px_-8px_rgba(15,23,42,0.05)] group relative"
          >
            {/* Top Quote */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Bottom Author Info */}
            <div className="pt-6 border-t border-gray-200/60 mt-6 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full glass-panel bg-white/90 border border-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 select-none shadow-xs text-gray-950`}
              >
                {item.initials}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-950 truncate font-sans">
                    {item.author}
                  </h4>
                  <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                </div>
                <p className="text-[11px] text-gray-600 truncate mt-0.5">
                  {item.role}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {item.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Micro-Controls */}
      <div className="flex items-center gap-2 mt-6 justify-start">
        <button
          type="button"
          onClick={() => setPageIndex((p) => (p === 0 ? 1 : 0))}
          className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-spring text-xs shadow-2xs"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setPageIndex((p) => (p === 0 ? 1 : 0))}
          className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-spring text-xs shadow-2xs"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}


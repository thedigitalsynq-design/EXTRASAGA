"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, Film, Users, CheckCircle2, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import CinephileDiscoveryModal from "@/components/CinephileDiscoveryModal";

export default function EditorialBentoShowcase() {
  const { language, config, localizeUrl } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content: Record<string, any> = {
    kn: {
      pill: "ಸಿನಿಮಾ ಇನೋವೇಶನ್",
      title: "ಸಿನಿಮಾ ಪ್ರೇಮಿಗಳು ಸಿನಿ ಜಾತ್ರೆ ಏಕೆ ಆಯ್ಕೆ ಮಾಡುತ್ತಾರೆ",
      subtitle: "ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶೆಗಳು, ಡ್ಯುಯಲ್-ಆಕ್ಸಿಸ್ ತಾಂತ್ರಿಕ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ನೈಜ ಸಮಯದ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಇಂಟೆಲಿಜೆನ್ಸ್.",
      card1Title: "ಅತ್ಯುನ್ನತ ಸಿನಿಮಾ ವಿಮರ್ಶಕರಿಂದ ರಚಿತವಾದ ನಿಷ್ಪಕ್ಷಪಾತ ವಿಶ್ಲೇಷಣೆ.",
      card1Cta: "ವಿಶೇಷ ಲೇಖನಗಳು",
      card2Title: "6 ಭಾರತೀಯ ಚಿತ್ರರಂಗದ 120+ ಚಿತ್ರಕರ್ತರು ಮತ್ತು ವಿಮರ್ಶಕರಿಂದ ದೃಢೀಕೃತ.",
      card3Metric: "100%",
      card3Subtitle: "ಸ್ಪಾಯ್ಲರ್-ಮುಕ್ತ ವಿಶ್ವಾಸಾರ್ಹತೆ & ಕಥಾಹಂದರದ ತಾಂತ್ರಿಕ ಆಡಿಟ್.",
      card4Title: "ಸಿನಿಮಾ ಚರ್ಚೆಯನ್ನು ಉನ್ನತೀಕರಿಸಿ, ನಿಮ್ಮ ಸಿನಿಮಾ ಅನುಭವವನ್ನು ಇನ್ನಷ್ಟು ಶ್ರೀಮಂತಗೊಳಿಸಿ.",
    },
    te: {
      pill: "సినిమా ఇన్నోవేషన్",
      title: "సినిమా ప్రేమికులు ఫిల్మీ గ్యారేజ్ ఎందుకు ఎంచుకుంటారు",
      subtitle: "నిష్పాక్షిక రివ్యూలు, డ్యూయల్-యాక్సిస్ సాంకేతిక విశ్లేషణ మరియు రియల్-టైమ్ బాక్సాఫీస్ ఇంటెలిజెన్స్.",
      card1Title: "అగ్రశ్రేణి ఫిల్మ్ క్రిటిక్స్ అందించే లోతైన నిష్పాక్షిక విశ్లేషణ.",
      card1Cta: "ప్రత్యేక కథనాలు",
      card2Title: "6 చిత్రపరిశ్రమల 120+ దర్శకులు, నటులు మరియు ట్రేడ్ నిపుణుల నమ్మకం.",
      card3Metric: "100%",
      card3Subtitle: "స్పాయిలర్-రహిత సమగ్రత & ఆర్టిస్టిక్ స్టోరీటెల్లింగ్ ఆడిట్.",
      card4Title: "సినిమా వీక్షణను ఉన్నత స్థాయికి తీసుకువెళ్ళి, పరిపూర్ణ అనుభూతిని అందిస్తుంది.",
    },
    ta: {
      pill: "சினிமா புத்தாக்கம்",
      title: "சினிமா ஆர்வலர்கள் ஏன் பில்மி கேரேஜை தேர்ந்தெடுக்கிறார்கள்",
      subtitle: "நடுநிலையான விமர்சனங்கள், இரட்டை-அச்சு தொழில்நுட்ப மதிப்பீடு மற்றும் நேரலை பாக்ஸ் ஆபீஸ் தகவல்.",
      card1Title: "தலைசிறந்த சினிமா விமர்சகர்களால் வடிவமைக்கப்பட்ட நடுநிலையான ஆழமான ஆய்வுகள்.",
      card1Cta: "பிரத்யேக கட்டுரைகள்",
      card2Title: "6 திரைப்படத் துறைகளைச் சேர்ந்த 120+ இயக்குநர்கள் மற்றும் ஆய்வாளர்களால் நம்பப்படுகிறது.",
      card3Metric: "100%",
      card3Subtitle: "ஸ்பாய்லர் இல்லாத நம்பகத்தன்மை & கதை சொல்லல் தர மதிப்பீடு.",
      card4Title: "திரைப்பட விவாதங்களை அடுத்த தளத்திற்கு உயர்த்தி, முழுமையான சினிமா அனுபவத்தை உருவாக்குகிறது.",
    },
    ml: {
      pill: "സിനിമ ഇന്നൊവേഷൻ",
      title: "സിനിമാപ്രേമികൾ ഫിലിമി ഗാരേജ് തിരഞ്ഞെടുക്കുന്നത് എന്തുകൊണ്ട്",
      subtitle: "നിഷ്പക്ഷ നിരൂപണങ്ങൾ, ഡ്യുവൽ-ആക്സിസ് സാങ്കേതിക വിശകലനം, തത്സമയ ബോക്സ് ഓഫീസ് വിവരങ്ങൾ.",
      card1Title: "പ്രമുഖ ചലച്ചിത്ര നിരൂപകർ ഒരുക്കുന്ന ആധികాരികവും സമഗ്രവുമായ വിലയിരുത്തലുകൾ.",
      card1Cta: "പ്രത്യേക ലേഖനങ്ങൾ",
      card2Title: "6 ചലച്ചിത്ര മേഖലകളിലെ 120+ സംവിധായകരും നിരൂപകരും വിശ്വസിക്കുന്നു.",
      card3Metric: "100%",
      card3Subtitle: "സ്പോയിലർ രഹിത വിശ്വാസ്യത & സാങ്കേതിക മികവിന്റെ ഓഡിറ്റ്.",
      card4Title: "സിനിമാ ചർച്ചകളെ കൂടുതൽ സമ്പന്നമാക്കി നിങ്ങളുടെ സിനിമാ അനുഭവത്തെ അടുത്ത തലത്തിലേക്ക് മാറ്റുന്നു.",
    },
    hi: {
      pill: "सिनेमा इनोवेशन",
      title: "सिनेमा प्रेमी फ़िल्मी गैराज को क्यों चुनते हैं",
      subtitle: "सटीक फिल्म पत्रकारिता, डुअल-एक्सिस तकनीकी समीक्षा और निष्पक्ष रियल-टाइम बॉक्स ऑफिस इंटेलिजेंस.",
      card1Title: "वरिष्ठ समीक्षकों द्वारा तैयार निष्पक्ष, गंभीर और गहन सिनेमा विश्लेषण.",
      card1Cta: "विशेष आलेख पढ़ें",
      card2Title: "6 फिल्म इंडस्ट्रीज के 120+ फिल्मकारों और क्रिटिक्स द्वारा प्रमाणित.",
      card3Metric: "100%",
      card3Subtitle: "स्पॉइलर-मुक्त प्रामाणिकता और दोहरी स्टोरीटेलिंग तकनीकी ऑडिट.",
      card4Title: "सिनेमाई संवाद को नई ऊंचाई देता है और दर्शकों को फिल्म देखने का एक नया नजरिया प्रदान करता है.",
    },
    en: {
      pill: "INNOVATION & CRAFT",
      title: "Why cinephiles choose EXTRASAGA",
      subtitle: "Exceptional film journalism, dual-axis reviews, and real-time box office intelligence that set the benchmark for modern entertainment media.",
      card1Title: "Handcrafted by veteran film journalists to deliver timeless depth and unmatched credibility.",
      card1Cta: "Explore Editorial",
      card2Title: "Trusted by 120+ filmmakers, national critics & trade analysts across 6 industries.",
      card3Metric: "100%",
      card3Subtitle: "Spoiler-free integrity & dual-axis storytelling audits.",
      card4Title: "Elevates film discourse and transforms everyday cinema viewing into a deeper cinematic journey.",
    },
  };

  const t = content[language] || content.en;

  return (
    <section aria-label="Editorial Innovation" className="w-full py-8">
      {/* Header with pill tag */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase glass-pill text-signal-soft border-signal/30 select-none">
          <Sparkles className="w-3.5 h-3.5 text-marquee-soft" />
          <span>{t.pill}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-popcorn tracking-tight font-display-latin">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base text-popcorn-dim leading-relaxed font-normal">
          {t.subtitle}
        </p>
      </div>

      {/* Bento Grid Layout (After-dark glass bento) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Card 1: Left Tall Showcase Card (5 cols on md/lg) */}
        <div className="md:col-span-5 rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-glow-line-strong shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] transition-cinema gpu-layer">
          {/* Ambient Corner Glow */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-signal/5 blur-3xl pointer-events-none group-hover:bg-signal/10 transition-cinema" />

          {/* Top Visual: Vintage Film Reel / Golden Camera Vector */}
          <div className="relative z-10 pt-2 pb-8 flex items-center justify-center">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl glass-panel bg-screen/80 border border-glow-line-strong flex items-center justify-center shadow-sm group-hover:scale-[1.03] transition-spring">
              <Film className="w-16 h-16 sm:w-20 sm:h-20 text-marquee-soft drop-shadow-[0_0_16px_rgba(255,176,32,0.3)]" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-glow-line" />
            </div>
          </div>

          {/* Bottom Content & CTA */}
          <div className="relative z-10 space-y-5 pt-4 border-t border-glow-line">
            <h3 className="text-lg sm:text-xl font-bold text-popcorn leading-snug">
              {t.card1Title}
            </h3>

            <Link
              href={localizeUrl("/category/latest")}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-signal-deep text-popcorn hover:bg-signal text-xs sm:text-sm font-bold tracking-tight shadow-[0_0_24px_rgba(255,46,80,0.25)] active:scale-95 transition-spring select-none"
            >
              <span>{t.card1Cta}</span>
              <ArrowRight className="w-3.5 h-3.5 text-popcorn group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Section: 3 Bento Cards (7 cols on md/lg) */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 2: Top Left - Handshake / Insider Trust */}
          <div className="rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 flex flex-col justify-between relative overflow-hidden group hover:border-glow-line-strong shadow-[0_12px_36px_-8px_rgba(0,0,0,0.45)] transition-cinema gpu-layer">
            {/* Visual Icon */}
            <div className="w-12 h-12 rounded-2xl bg-ultra-faint border border-ultra/30 flex items-center justify-center text-ultra-soft mb-6 group-hover:scale-105 transition-spring">
              <Users className="w-6 h-6" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-popcorn leading-snug">
                {t.card2Title}
              </h4>
              <p className="text-xs text-popcorn-dim flex items-center gap-1.5 pt-2">
                <CheckCircle2 className="w-3.5 h-3.5 change-positive shrink-0" />
                <span>Verified editorial byline standards</span>
              </p>
            </div>
          </div>

          {/* Card 3: Top Right - 100% Metric Card */}
          <div className="rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 flex flex-col justify-between relative overflow-hidden group hover:border-glow-line-strong shadow-[0_12px_36px_-8px_rgba(0,0,0,0.45)] transition-cinema gpu-layer">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-popcorn tracking-tight font-display-latin block">
                  {t.card3Metric}
                </span>
                <span className="text-xs font-bold text-marquee-soft tracking-widest uppercase font-display-latin mt-1 block">
                  Cinephile Guarantee
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-marquee-faint border border-marquee/30 flex items-center justify-center text-marquee-soft shrink-0 group-hover:rotate-12 transition-spring">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs text-popcorn-dim leading-relaxed pt-4 border-t border-glow-line mt-4">
              {t.card3Subtitle}
            </p>
          </div>

          {/* Card 4: Bottom Wide Card spanning both columns */}
          <div className="sm:col-span-2 rounded-[28px] glass-bento bg-revealed/70 backdrop-blur-2xl border border-glow-line p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-glow-line-strong shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] transition-cinema gpu-layer">
            {/* Left Content */}
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest font-display-latin text-signal-soft bg-signal-faint px-2.5 py-0.5 rounded-full border border-signal/25">
                <ShieldCheck className="w-3 h-3 text-signal-soft" />
                <span>Zero Clickbait Policy</span>
              </div>
              <h4 className="text-base sm:text-xl font-bold text-popcorn leading-snug">
                {t.card4Title}
              </h4>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ultra-deep hover:bg-ultra text-void font-bold text-xs tracking-tight shadow-[0_0_24px_rgba(155,109,255,0.3)] transition-spring"
                >
                  <Sparkles className="w-3.5 h-3.5 text-void" />
                  <span>Interactive Cinema Vibe Match</span>
                </button>
              </div>
            </div>

            {/* Right Abstract Visual Graphic */}
            <div className="w-full sm:w-48 h-28 sm:h-32 rounded-2xl glass-panel bg-screen/80 border border-glow-line-strong flex items-center justify-center shrink-0 relative overflow-hidden group-hover:scale-[1.02] transition-spring">
              <div className="flex flex-col items-center gap-1 z-10">
                <Film className="w-8 h-8 text-ultra-soft" />
                <span className="text-[11px] font-display-latin uppercase tracking-widest text-popcorn-dim font-bold">
                  {config.industryName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Questionnaire Modal (Matching Reference) */}
      <CinephileDiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

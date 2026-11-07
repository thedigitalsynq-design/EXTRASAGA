import { LanguageCode, FilmIndustry } from "@/types";

export interface LanguageConfig {
  code: LanguageCode;
  name: string; // Native language name e.g. "ಕನ್ನಡ", "తెలుగు", "தமிழ்"
  englishName: string; // "Kannada", "Telugu", "Tamil", "Malayalam", "Hindi", "English"
  brandNameNative: string; // Localized native script of FILMY GARAGE
  industry: FilmIndustry;
  industryName: string; // "Sandalwood", "Tollywood", "Kollywood", "Mollywood", "Bollywood", "Hollywood"
  industryNameNative: string; // e.g. "ಸ್ಯಾಂಡಲ್ವುಡ್", "టాలీవుడ్", "கோலிவுட்"
  flagEmoji: string;
  badgeColor: string;
  tagline: string;
  headerTagline: string;
  newsSectionTitle: string;
  reviewsSectionTitle: string;
  trailersSectionTitle: string;
  boxOfficeTitle: string;
  ottTitle: string;
  hotTopics: string[];
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: "kn",
    name: "ಕನ್ನಡ",
    englishName: "Kannada",
    brandNameNative: "ಸಿನಿ ಜಾತ್ರೆ",
    industry: "sandalwood",
    industryName: "Sandalwood",
    industryNameNative: "ಸ್ಯಾಂಡಲ್ವುಡ್ (Sandalwood)",
    flagEmoji: "🟡",
    badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
    tagline: "ನಿಖರ ಸಿನಿಮಾ ವಿಶ್ಲೇಷಣೆ, ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶೆಗಳು & ನೇರ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಇಂಟೆಲಿಜೆನ್ಸ್",
    headerTagline: "ಸ್ಯಾಂಡಲ್ವುಡ್ · ನೈಜ ಬಾಕ್ಸ್ ಆಫೀಸ್ · 60-ದಿನಗಳ ಬಿಡುಗಡೆ ಕ್ಯಾಲೆಂಡರ್ · OTT ಹಬ್",
    newsSectionTitle: "ಸ್ಯಾಂಡಲ್ವುಡ್ ವಿಶೇಷ ಸಮಾಚಾರ (Sandalwood Intelligence)",
    reviewsSectionTitle: "ಸ್ಯಾಂಡಲ್ವುಡ್ ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳು & ವಿಶ್ಲೇಷಣೆ",
    trailersSectionTitle: "ಕನ್ನಡ ಸಿನಿಮಾಗಳ ಹೊಸ ಟ್ರೇಲರ್ & ಟೀಸರ್‌ಗಳು",
    boxOfficeTitle: "ಸ್ಯಾಂಡಲ್ವುಡ್ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಟೆಲಿಮೆಟ್ರಿ",
    ottTitle: "ಕನ್ನಡ OTT ರಿಲೀಸ್ ಹಬ್ (ದೃಢೀಕೃತ)",
    hotTopics: ["ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1", "ಟಾಕ್ಸಿಕ್ ಯಶ್", "ಮ್ಯಾಕ್ಸ್ ಸುದೀಪ್", "ರುಕ್ಮಿಣಿ ವಸಂತ್", "ಬಘೀರ", "ಉತ್ತರಕಾಂಡ", "ಭೈರತಿ ರಣಗಲ್"],
  },
  {
    code: "te",
    name: "తెలుగు",
    englishName: "Telugu",
    brandNameNative: "సిని జాతర",
    industry: "tollywood",
    industryName: "Tollywood",
    industryNameNative: "టాలీవుడ్ (Tollywood)",
    flagEmoji: "🔴",
    badgeColor: "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
    tagline: "విశ్వసనీయ సినిమా విశ్లేషణ, నిష్పాక్షిక రివ్యూలు & రియల్-టైమ్ బాక్సాఫీస్",
    headerTagline: "టాలీవుడ్ · మూవీ రివ్యూలు · బాక్సాఫీస్ · తాజా అప్డేట్స్",
    newsSectionTitle: "టాలీవుడ్ తాజా సినిమా వార్తలు (Tollywood Updates)",
    reviewsSectionTitle: "తెలుగు మూవీ రివ్యూలు & రేటింగ్స్",
    trailersSectionTitle: "టాలీవుడ్ కొత్త ట్రైలర్స్ & టీజర్లు",
    boxOfficeTitle: "టాలీవుడ్ ఆల్ టైమ్ బాక్సాఫీస్ రికార్డులు",
    ottTitle: "తెలుగు OTT రిలీజ్ క్యాలెండర్",
    hotTopics: ["పుష్ప 2 ది రూల్", "దేవర ఎన్టీఆర్", "కల్కి 2898 AD", "గేమ్ ఛేంజర్", "SSMB 29 మహేష్ బాబు", "ఓజీ పవన్ కళ్యాణ్"],
  },
  {
    code: "ta",
    name: "தமிழ்",
    englishName: "Tamil",
    brandNameNative: "சினி ஜாத்திரை",
    industry: "kollywood",
    industryName: "Kollywood",
    industryNameNative: "கோலிவுட் (Kollywood)",
    flagEmoji: "🔵",
    badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]",
    tagline: "சமீபத்திய கோலிவுட் திரைப்படச் செய்திகள், விமர்சனங்கள் & பாக்ஸ் ஆபீஸ்",
    headerTagline: "கோலிவுட் · சினிமா விமர்சனம் · பாக்ஸ் ஆபீஸ் · புதிய செய்திகள்",
    newsSectionTitle: "கோலிவுட் பிரத்தியேக சினிமா செய்திகள் (Kollywood Updates)",
    reviewsSectionTitle: "தமிழ் திரைப்பட விமர்சனங்கள் & மதிப்பீடுகள்",
    trailersSectionTitle: "கோலிவுட் புதிய டிரெய்லர்கள் & டீசர்கள்",
    boxOfficeTitle: "கோலிவுட் வரலாற்று பாக்ஸ் ஆபிஸ் சாதனைகள்",
    ottTitle: "தமிழ் OTT வெளியீடு காலண்டர்",
    hotTopics: ["கூலி ரஜினிகாந்த்", "கோட் விஜய்", "கங்குவா சூர்யா", "வேட்டையன்", "விடாமுயற்சி அஜித்", "தளபதி 69"],
  },
  {
    code: "ml",
    name: "മലയാളം",
    englishName: "Malayalam",
    brandNameNative: "സിനി ജാത്ര",
    industry: "mollywood",
    industryName: "Mollywood",
    industryNameNative: "മോളിവുഡ് (Mollywood)",
    flagEmoji: "🟢",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
    tagline: "ഏറ്റവും പുതിയ മോളിവുഡ് വാർത്തകൾ, സിനിമ നിരൂപണങ്ങൾ & ബോക്സ് ഓഫീസ്",
    headerTagline: "മോളിവുഡ് · സിനിമാ നിരൂപണം · ബോക്സ് ഓഫീസ് · പുതിയ വാർത്തകൾ",
    newsSectionTitle: "മോളിവുഡ് പുതിയ സിനിമാ വാർത്തകൾ (Mollywood Updates)",
    reviewsSectionTitle: "മലയാള സിനിമ റിവ്യൂകൾ & റേറ്റിംഗുകൾ",
    trailersSectionTitle: "മോളിവുഡ് ട്രെയിലറുകളും ടീസറുകളും",
    boxOfficeTitle: "മോളിവുഡ് എക്കാലത്തെയും കളക്ഷൻ റെക്കോർഡുകൾ",
    ottTitle: "മലയാളം OTT റിലീസ് വിവരങ്ങൾ",
    hotTopics: ["എമ്പുരാൻ മോഹൻലാൽ", "ടർബോ മമ്മൂട്ടി", "ആടുജീവിതം", "മഞ്ഞുമ്മൽ ബോയ്സ്", "ആവേശം ഫഹദ് ഫാസിൽ", "ബറോസ്"],
  },
  {
    code: "hi",
    name: "हिन्दी",
    englishName: "Hindi",
    brandNameNative: "सिने जात्रा",
    industry: "bollywood",
    industryName: "Bollywood",
    industryNameNative: "बॉलीवुड (Bollywood)",
    flagEmoji: "🟣",
    badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]",
    tagline: "ताज़ा बॉलीवुड खबरें, निष्पक्ष समीक्षाएं और बॉक्स ऑफिस रिपोर्ट",
    headerTagline: "बॉलीवुड · मूवी रिव्यू · बॉक्स ऑफिस · ताज़ा अपडेट्स",
    newsSectionTitle: "बॉलीवुड की गरमा-गरम खबरें और अपडेट्स (Bollywood Updates)",
    reviewsSectionTitle: "बॉलीवुड मूवी रिव्यू और स्टार रेटिंग्स",
    trailersSectionTitle: "बॉलीवुड के नए ट्रेलर और टीज़र",
    boxOfficeTitle: "बॉलीवुड ऑल-टाइम बॉक्स ऑफिस रिकॉर्ड्स",
    ottTitle: "हिंदी OTT रिलीज़ कैलेंडर",
    hotTopics: ["सिंघम अगेन", "वॉर 2 ऋतिक-एनटीआर", "रामायण रणबीर कपूर", "स्त्री 2", "किंग शाहरुख खान", "भूल भुलैया 3"],
  },
  {
    code: "en",
    name: "English",
    englishName: "English",
    brandNameNative: "CiniJaatre",
    industry: "hollywood",
    industryName: "Hollywood",
    industryNameNative: "Hollywood & Global Cinema",
    flagEmoji: "⚪",
    badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.25)]",
    tagline: "Independent Film Journalism, Data-Driven Box Office & Unbiased Reviews",
    headerTagline: "Sandalwood · Pan-India · Verified Box Office · 60-Day Horizon",
    newsSectionTitle: "Indian & Global Cinema Telemetry",
    reviewsSectionTitle: "Film Reviews & Critical Verdicts",
    trailersSectionTitle: "Official Cinema Trailers & Teasers",
    boxOfficeTitle: "Consolidated Box Office Leaderboard",
    ottTitle: "Verified Streaming & OTT Dispatch",
    hotTopics: ["Kantara: Chapter 1", "Pushpa 2: The Rule", "Ramayana", "Bagheera", "Max", "Toxic"],
  },
];

export function isLanguageCode(value: string | null | undefined): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
}

export const DEFAULT_LANGUAGE: LanguageCode = "kn";

export function getLanguageConfig(code?: string): LanguageConfig {
  if (!code) return SUPPORTED_LANGUAGES[0];
  const found = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
  return found || SUPPORTED_LANGUAGES[0];
}

export function getIndustryByLanguage(code: LanguageCode): FilmIndustry {
  const config = getLanguageConfig(code);
  return config.industry;
}

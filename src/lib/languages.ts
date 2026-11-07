import { LanguageCode, FilmIndustry } from "@/types";

export interface LanguageConfig {
  code: LanguageCode;
  name: string; // Native language name e.g. "ಕನ್ನಡ", "తెలుగు", "தமிழ்"
  englishName: string; // "Kannada", "Telugu", "Tamil", "Malayalam", "Hindi", "English"
  brandNameNative: string; // Localized native script of EXTRASAGA
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
    brandNameNative: "ಎಕ್ಸ್ಟ್ರಾಸಾಗ",
    industry: "sandalwood",
    industryName: "Sandalwood",
    industryNameNative: "ಸ್ಯಾಂಡಲ್ವುಡ್ (Sandalwood)",
    flagEmoji: "🟡",
    badgeColor: "bg-marquee-faint text-marquee-soft border-marquee/40 shadow-[0_0_12px_rgba(255,176,32,0.25)]",
    tagline: "ರಿಸೀಟ್-ಬ್ಯಾಕ್ ಬಾಕ್ಸ್ ಆಫೀಸ್, ಫೇಕ್-ಫ್ರೀ ಸಿನಿ ಟೀ & ಕಠೋರ ನಿಷ್ಪಕ್ಷಪಾತ ವೆರ್ಡಿಕ್ಟ್‌ಗಳು",
    headerTagline: "ಸ್ಯಾಂಡಲ್ವುಡ್ · ರಿಸೀಟ್ ಬಾಕ್ಸ್ ಆಫೀಸ್ · 90-ದಿನದ ರಿಲೀಸ್ ರಾಡಾರ್ · ವೆರ್ಡಿಕ್ಟ್ ಡೆಸ್ಕ್",
    newsSectionTitle: "ಸ್ಯಾಂಡಲ್ವುಡ್ ಲೈವ್ ವೈರ್ (The Sandalwood Feed)",
    reviewsSectionTitle: "ವೆರ್ಡಿಕ್ಟ್ ಡೆಸ್ಕ್ — ಸ್ಯಾಂಡಲ್ವುಡ್ ವಿಮರ್ಶೆಗಳು & ವಿಶ್ಲೇಷಣೆ",
    trailersSectionTitle: "ಫರ್ಸ್ಟ್ ಲುಕ್ — ಕನ್ನಡ ಟ್ರೇಲರ್ & ಟೀಸರ್ ಡ್ರಾಪ್‌ಗಳು",
    boxOfficeTitle: "ರಿಸೀಟ್ಸ್ ಡೆಸ್ಕ್ — ಸ್ಯಾಂಡಲ್ವುಡ್ ಟೆಲಿಮೆಟ್ರಿ",
    ottTitle: "ನೌ ಸ್ಟ್ರೀಮಿಂಗ್ — ಕನ್ನಡ OTT ರಾಡಾರ್ (ದೃಢೀಕೃತ)",
    hotTopics: ["ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1", "ಟಾಕ್ಸಿಕ್ ಯಶ", "ಮ್ಯಾಕ್ಸ್ ಸುದೀಪ", "ರಾಮಾಯಣ ಯಶ", "ಬಘೀರ", "ಉತ್ತರಕಾಂಡ", "ಎಕ್ಕ ಯುವ ರಾಜ್"],
  },
  {
    code: "te",
    name: "తెలుగు",
    englishName: "Telugu",
    brandNameNative: "ఎక్స్ట్రాసాగా",
    industry: "tollywood",
    industryName: "Tollywood",
    industryNameNative: "టాలీవుడ్ (Tollywood)",
    flagEmoji: "🔴",
    badgeColor: "bg-signal-faint text-signal-soft border-signal/40 shadow-[0_0_12px_rgba(255,46,80,0.25)]",
    tagline: "రిసీట్లతో నిర్ధారించిన బాక్సాఫీస్, ఫేక్-ఫ్రీ సిని టీ & పక్షపాతరహిత వెర్డిక్ట్‌లు",
    headerTagline: "టాలీవుడ్ · రిసీట్ బాక్సాఫీస్ · వెర్డిక్ట్ డెస్క్ · తాజా అప్డేట్స్",
    newsSectionTitle: "టాలీవుడ్ లైవ్ వైర్ (The Tollywood Feed)",
    reviewsSectionTitle: "వెర్డిక్ట్ డెస్క్ — తెలుగు మూవీ రివ్యూలు",
    trailersSectionTitle: "ఫర్స్ట్ లుక్ — టాలీవుడ్ కొత్త ట్రైలర్స్ & టీజర్లు",
    boxOfficeTitle: "రిసీట్స్ డెస్క్ — టాలీవుడ్ బాక్సాఫీస్ రికార్డులు",
    ottTitle: "ఉప్పుడు స్ట్రీమింగ్ — తెలుగు OTT రిలీజ్ క్యాలెండర్",
    hotTopics: ["పుష్ప 2 ది రూల్", "దేవర ఎన్టీఆర్", "కల్కి 2898 AD", "రామాయణ రన్బీర్", "SSMB 29 మహేష్ బాబు", "ఓజీ పవన్ కళ్యాణ్"],
  },
  {
    code: "ta",
    name: "தமிழ்",
    englishName: "Tamil",
    brandNameNative: "எக்ஸ்ட்ராசாக",
    industry: "kollywood",
    industryName: "Kollywood",
    industryNameNative: "கோலிவுட் (Kollywood)",
    flagEmoji: "🔵",
    badgeColor: "bg-ultra-faint text-ultra-soft border-ultra/40 shadow-[0_0_12px_rgba(155,109,255,0.25)]",
    tagline: "ரசீது-ரேக்காக்ஸ் ஆபீஸ், பேக்-ஃப்ரீ சினி டீ & சார்பற்ற தீர்ப்புகள்",
    headerTagline: "கோலிவுட் · ரசீது ஆபீஸ் · வெர்டிக்ட் டெஸ்க் · புதிய செய்திகள்",
    newsSectionTitle: "கோலிவுட் லைவ் வயர் (The Kollywood Feed)",
    reviewsSectionTitle: "வெர்டிக்ட் டெஸ்க் — தமிழ் திரைப்பட விமர்சனங்கள்",
    trailersSectionTitle: "ஃபர்ஸ்ட் லுக் — கோலிவுட் புதிய டிரெய்லர்கள் & டீசர்கள்",
    boxOfficeTitle: "ரிசீட்ஸ் டெஸ்க் — கோலிவுட் பாக்ஸ் ஆபிஸ் சாதனைகள்",
    ottTitle: "ஃபுதிய ஸ்ட்ரீமிங் — தமிழ் OTT வெளியீடு காலண்டர்",
    hotTopics: ["கூலி ரஜினிகாந்த்", "கோட் விஜய்", "தம்பி விஜய் 69", "வேட்டையன்", "விடாமுயற்சி அஜித்", "தளபதி 69"],
  },
  {
    code: "ml",
    name: "മലയാളം",
    englishName: "Malayalam",
    brandNameNative: "എക്സ്ട്രാസാഗ",
    industry: "mollywood",
    industryName: "Mollywood",
    industryNameNative: "മോളിവുഡ് (Mollywood)",
    flagEmoji: "🟢",
    badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
    tagline: "റിസീറ്റ്-ബാക്ക്ഡ് ബോക്സ് ഓഫീസ്, ഫേക്ക്-ഫ്രീ സിനി ടീ & പക്ഷപാതരഹിതമായ വിമർശനങ്ങൾ",
    headerTagline: "മോളിവുഡ് · റിസീറ്റ് ബോക്സ് ഓഫീസ് · വെർഡിക്റ്റ് ഡെസ്ക് · പുതിയ വാർത്തകൾ",
    newsSectionTitle: "മോളിവുഡ് ലൈവ് വയർ (The Mollywood Feed)",
    reviewsSectionTitle: "വെർഡിക്റ്റ് ഡെസ്ക് — മലയാള സിനിമ റിവ്യൂകൾ",
    trailersSectionTitle: "ഫസ്റ്റ് ലുക്ക് — മോളിവുഡ് ട്രെയിലറുകളും ടീസറുകളും",
    boxOfficeTitle: "റിസീറ്റ്സ് ഡെസ്ക് — മോളിവുഡ് കളക്ഷൻ റെക്കോർഡുകൾ",
    ottTitle: "ഇപ്പോൾ സ്ട്രീമിംഗ് — മലയാളം OTT റിലീസ് റഡാർ",
    hotTopics: ["എമ്പുരാൻ മോഹൻലാൽ", "ടർബോ മമ്മൂട്ടി", "ആടുജീവിതം", "മഞ്ഞുമ്മൽ ബോയ്സ്", "ആവേശം ഫഹദ് ഫാസിൽ", "ബറോസ്"],
  },
  {
    code: "hi",
    name: "हिन्दी",
    englishName: "Hindi",
    brandNameNative: "एक्स्ट्रासागा",
    industry: "bollywood",
    industryName: "Bollywood",
    industryNameNative: "बॉलीवुड (Bollywood)",
    flagEmoji: "🟣",
    badgeColor: "bg-violet-500/15 text-violet-300 border-violet-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]",
    tagline: "रिसीट-बैक्ड बॉक्स ऑफिस, फेक-फ्री सिनी टी & निष्पक्ष वर्डिक्ट्स",
    headerTagline: "बॉलीवुड · रिसीट बॉक्स ऑफिस · वर्डिक्ट डेस्क · ताज़ा अपडेट्स",
    newsSectionTitle: "बॉलीवुड लाइव वायर (The Bollywood Feed)",
    reviewsSectionTitle: "वर्डिक्ट डेस्क — बॉलीवुड मूवी रिव्यू",
    trailersSectionTitle: "फर्स्ट लुक — बॉलीवुड के नए ट्रेलर और टीज़र",
    boxOfficeTitle: "रिसीट्स डेस्क — बॉलीवुड बॉक्स ऑफिस रिकॉर्ड्स",
    ottTitle: "अभी स्ट्रीमिंग — हिंदी OTT राडार",
    hotTopics: ["रामायण रणबीर कपूर", "वॉर 2 ऋतिक-एनटीआर", "सिंघम अगेन", "स्त्री 2", "किंग शाहरुख खान", "भूल भुलैया 3"],
  },
  {
    code: "en",
    name: "English",
    englishName: "English",
    brandNameNative: "Extrasaga",
    industry: "hollywood",
    industryName: "Hollywood",
    industryNameNative: "Hollywood & Global Cinema",
    flagEmoji: "⚪",
    badgeColor: "bg-revealed text-popcorn-dim border-glow-line-strong",
    tagline: "Receipts-Backed Box Office, Zero-Fake Tea & Strictly Unbiased Verdicts",
    headerTagline: "Pan-India · Receipts Desk · 90-Day Release Radar · The Verdict Desk",
    newsSectionTitle: "The Feed — Indian & Global Cinema, Real-Time",
    reviewsSectionTitle: "The Verdict Desk — Film Reviews, Zero Star Games",
    trailersSectionTitle: "First Look — Official Trailers & Teaser Drops",
    boxOfficeTitle: "The Receipts — Consolidated Box Office Leaderboard",
    ottTitle: "Now Streaming — Verified OTT Radar",
    hotTopics: ["Kantara: Chapter 1", "Pushpa 2: The Rule", "Ramayana (Ranbir × Yash)", "Toxic (Yash)", "War 2", "Coolie"],
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

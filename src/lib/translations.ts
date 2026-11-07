import { LanguageCode } from "@/types";

export interface Translations {
  // Navigation
  nav_home: string;
  nav_latest: string;
  nav_reviews: string;
  nav_television: string;
  nav_celebrity: string;
  nav_movies: string;
  nav_interviews: string;
  nav_gossips: string;
  nav_photos: string;
  nav_videos: string;
  nav_events: string;
  nav_trending_today: string;
  nav_industry: string;
  nav_bollywood: string;
  nav_hollywood: string;
  nav_actors: string;
  nav_actresses: string;
  nav_gossip: string;
  nav_gallery: string;
  nav_ott: string;
  nav_boxoffice: string;
  nav_upcoming: string;
  nav_trending: string;
  nav_admin: string;
  nav_search: string;
  nav_search_placeholder: string;
  nav_hot_topics: string;
  nav_select_industry: string;
  nav_categories: string;

  // Actions & Buttons
  btn_all_news: string;
  btn_more_news: string;
  btn_read_more: string;
  btn_view_all: string;
  btn_full_report: string;
  btn_watch_trailer: string;
  btn_read_review: string;
  btn_all_reviews: string;
  btn_all_videos: string;
  btn_all_ott: string;
  btn_search: string;
  btn_share: string;
  btn_filter: string;

  // Section Headers
  sec_breaking: string;
  sec_latest_news: string;
  sec_top_stories: string;
  sec_trending: string;
  sec_reviews: string;
  sec_trailers: string;
  sec_boxoffice: string;
  sec_ott: string;
  sec_gallery: string;

  // Box Office Table Columns
  bo_rank: string;
  bo_movie: string;
  bo_day1: string;
  bo_weekend: string;
  bo_worldwide: string;
  bo_verdict: string;

  // Meta & Footer
  footer_about: string;
  footer_telegram_whatsapp: string;
  footer_telegram: string;
  footer_whatsapp: string;
  footer_quick_links: string;
  footer_cinema_industries: string;
  footer_privacy: string;
  footer_terms: string;
  footer_contact: string;
  footer_rights: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  kn: {
    nav_home: "ಮುಖಪುಟ",
    nav_latest: "ಸುದ್ದಿ",
    nav_reviews: "ವಿಮರ್ಶೆ",
    nav_television: "ಕಿರುತೆರೆ",
    nav_celebrity: "ಸೆಲೆಬ್ರಿಟಿ",
    nav_movies: "ಸಿನಿಮಾಗಳು",
    nav_interviews: "ಸಂದರ್ಶನ",
    nav_gossips: "ಗಾಸಿಪ್ಸ್",
    nav_photos: "ಫೋಟೋಸ್",
    nav_videos: "ವಿಡಿಯೋಸ್",
    nav_events: "ಇವೆಂಟ್ಸ್",
    nav_trending_today: "ಟ್ರೆಂಡಿಂಗ್ ಟುಡೇ",
    nav_industry: "ಸ್ಯಾಂಡಲ್ವುಡ್",
    nav_bollywood: "ಬಾಲಿವುಡ್",
    nav_hollywood: "ಹಾಲಿವುಡ್",
    nav_actors: "ನಟರು",
    nav_actresses: "ನಟಿಯರು",
    nav_gossip: "ಗಾಸಿಪ್",
    nav_gallery: "ಫೋಟೋ ಗ್ಯಾಲರಿ",
    nav_ott: "OTT ಅಪ್ಡೇಟ್",
    nav_boxoffice: "ಬಾಕ್ಸ್ ಆಫೀಸ್",
    nav_upcoming: "ಮುಂಬರುವ ಚಿತ್ರಗಳು",
    nav_trending: "ಟ್ರೆಂಡಿಂಗ್",
    nav_admin: "ಅಡ್ಮಿನ್",
    nav_search: "ಹುಡುಕಿ",
    nav_search_placeholder: "ಸಿನಿಮಾ, ನಟರು, ವಿಮರ್ಶೆ ಹುಡುಕಿ (ಉದಾ: ಕಾಂತಾರ, ಯಶ್, ಸುದೀಪ್)...",
    nav_hot_topics: "ಹಾಟ್ ಟಾಪಿಕ್ಸ್:",
    nav_select_industry: "ಚಿತ್ರರಂಗ ಆಯ್ಕೆ",
    nav_categories: "ವಿಭಾಗಗಳು (Categories)",

    btn_all_news: "ಎಲ್ಲಾ ಸುದ್ದಿ",
    btn_more_news: "ಮತ್ತಷ್ಟು ಸುದ್ದಿಗಳು ವೀಕ್ಷಿಸಿ",
    btn_read_more: "ಮುಂದೆ ಓದಿ",
    btn_view_all: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
    btn_full_report: "ಸಂಪೂರ್ಣ ವರದಿ",
    btn_watch_trailer: "ಟ್ರೇಲರ್ ವೀಕ್ಷಿಸಿ",
    btn_read_review: "ವಿಮರ್ಶೆ ಓದಿ",
    btn_all_reviews: "ಎಲ್ಲಾ ವಿಮರ್ಶೆಗಳು",
    btn_all_videos: "ಎಲ್ಲಾ ವಿಡಿಯೋಗಳು",
    btn_all_ott: "ಎಲ್ಲಾ OTT ಚಿತ್ರಗಳು",
    btn_search: "ಹುಡುಕಿ",
    btn_share: "ಹಂಚಿಕೊಳ್ಳಿ",
    btn_filter: "ಫಿಲ್ಟರ್",

    sec_breaking: "ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್",
    sec_latest_news: "ಇತ್ತೀಚಿನ ತಾಜಾ ಸುದ್ದಿ",
    sec_top_stories: "ಟಾಪ್ ಸ್ಟೋರಿ",
    sec_trending: "ಟ್ರೆಂಡಿಂಗ್ ಸುದ್ದಿ",
    sec_reviews: "ಸಿನಿಮಾ ವಿಮರ್ಶೆ & ರೇಟಿಂಗ್ಸ್",
    sec_trailers: "ಹೊಸ ಟ್ರೇಲರ್ & ಟೀಸರ್‌ಗಳು",
    sec_boxoffice: "ಬಾಕ್ಸ್ ಆಫೀಸ್ ದಾಖಲೆಗಳು",
    sec_ott: "OTT ರಿಲೀಸ್ ಹಬ್",
    sec_gallery: "ಸೆಲೆಬ್ರಿಟಿ ಫೋಟೋ ಗ್ಯಾಲರಿ",

    bo_rank: "ರ್ಯಾಂಕ್",
    bo_movie: "ಸಿನಿಮಾ ಹೆಸರು",
    bo_day1: "ಮೊದಲ ದಿನ (Day 1)",
    bo_weekend: "ವೀಕೆಂಡ್ ಗಳಿಕೆ",
    bo_worldwide: "ಒಟ್ಟು ವಿಶ್ವ ಗಳಿಕೆ",
    bo_verdict: "ವರ್ಡಿಕ್ಟ್",

    footer_about:
      "FILMY GARAGE (ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್) - ಸಿನಿಮಾ ಪ್ರೇಮಿಗಳ ನೆಚ್ಚಿನ ಬಹುಭಾಷಾ ಡಿಜಿಟಲ್ ಮನರಂಜನಾ ತಾಣ. ಸ್ಯಾಂಡಲ್ವುಡ್, ಟಾಲಿವುಡ್, ಕಾಲಿವುಡ್, ಮಾಲಿವುಡ್, ಬಾಲಿವುಡ್ ಮತ್ತು ಹಾಲಿವುಡ್ ಚಿತ್ರರಂಗದ ಕ್ಷಣಕ್ಷಣದ ಬ್ರೇಕಿಂಗ್ ಸುದ್ದಿ, ನೈಜ ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ ಮತ್ತು ಸೆಲೆಬ್ರಿಟಿ ಸಂದರ್ಶನಗಳ ಸಮಗ್ರ ಪೋರ್ಟಲ್.",
    footer_telegram_whatsapp: "ಟೆಲಿಗ್ರಾಂ & ವಾಟ್ಸಾಪ್ ಚಾನೆಲ್ ಸೇರಿ:",
    footer_telegram: "ಟೆಲಿಗ್ರಾಂ",
    footer_whatsapp: "ವಾಟ್ಸಾಪ್ ಚಾನೆಲ್",
    footer_quick_links: "ತ್ವರಿತ ಕೊಂಡಿಗಳು (Quick Links)",
    footer_cinema_industries: "ಚಿತ್ರರಂಗಗಳು (Industries)",
    footer_privacy: "ಗೌಪ್ಯತೆ ನೀತಿ (Privacy Policy)",
    footer_terms: "ಬಳಕೆಯ ನಿಯಮಗಳು (Terms of Use)",
    footer_contact: "ಸಂಪರ್ಕಿಸಿ (Contact Us)",
    footer_rights: "ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
  },
  te: {
    nav_home: "హోమ్",
    nav_latest: "వార్తలు",
    nav_reviews: "రివ్యూలు",
    nav_television: "టెలివిజన్",
    nav_celebrity: "సెలెబ్రిటీ",
    nav_movies: "సినిమాలు",
    nav_interviews: "ఇంటర్వ్యూలు",
    nav_gossips: "గాసిప్స్",
    nav_photos: "ఫోటోలు",
    nav_videos: "వీడియోలు",
    nav_events: "ఈవెంట్స్",
    nav_trending_today: "ట్రెండింగ్ టుడే",
    nav_industry: "టాలీవుడ్",
    nav_bollywood: "బాలీవుడ్",
    nav_hollywood: "హాలీవుడ్",
    nav_actors: "హీరోలు",
    nav_actresses: "హీరోయిన్లు",
    nav_gossip: "గాసిప్స్",
    nav_gallery: "ఫోటో గ్యాలరీ",
    nav_ott: "OTT రిలీజ్లు",
    nav_boxoffice: "బాక్సాఫీస్",
    nav_upcoming: "రాబోయే చిత్రాలు",
    nav_trending: "ట్రెండింగ్",
    nav_admin: "అడ్మిన్",
    nav_search: "వెతకండి",
    nav_search_placeholder: "సినిమాలు, హీరోలు, రివ్యూలు వెతకండి (ఉదా: పుష్ప, దేవర, కల్కి)...",
    nav_hot_topics: "హాట్ టాపిక్స్:",
    nav_select_industry: "చిత్రపరిశ్రమ ఎంపిక",
    nav_categories: "విభాగాలు (Categories)",

    btn_all_news: "అన్ని వార్తలు",
    btn_more_news: "మరిన్ని వార్తలు చదవండి",
    btn_read_more: "మరింత చదవండి",
    btn_view_all: "మొత్తం చూడండి",
    btn_full_report: "పూర్తి నివేదిక",
    btn_watch_trailer: "ట్రైలర్ చూడండి",
    btn_read_review: "రివ్యూ చదవండి",
    btn_all_reviews: "అన్ని రివ్యూలు",
    btn_all_videos: "అన్ని వీడియోలు",
    btn_all_ott: "అన్ని OTT సినిమాలు",
    btn_search: "వెతకండి",
    btn_share: "షేర్ చేయండి",
    btn_filter: "ఫిల్టర్",

    sec_breaking: "బ్రేకింగ్ న్యూస్",
    sec_latest_news: "తాజా టాలీవుడ్ వార్తలు",
    sec_top_stories: "టాప్ స్టోరీ",
    sec_trending: "ట్రెండింగ్ న్యూస్",
    sec_reviews: "తెలుగు మూవీ రివ్యూలు & రేటింగ్స్",
    sec_trailers: "కొత్త ట్రైలర్లు & టీజర్లు",
    sec_boxoffice: "టాలీవుడ్ బాక్సాఫీస్ రికార్డులు",
    sec_ott: "తెలుగు OTT రిలీజ్ క్యాలెండర్",
    sec_gallery: "సెలబ్రిటీ ఫోటో గ్యాలరీ",

    bo_rank: "ర్యాంక్",
    bo_movie: "సినిమా పేరు",
    bo_day1: "మొదటి రోజు (Day 1)",
    bo_weekend: "వీకెండ్ వసూళ్లు",
    bo_worldwide: "వరల్డ్‌వైడ్ గ్రాస్",
    bo_verdict: "తీర్పు (Verdict)",

    footer_about:
      "FILMY GARAGE - తాజా టాలీవుడ్, కాలీవుడ్, మాలీవుడ్, బాలీవుడ్ మరియు హాలీవుడ్ చిత్ర పరిశ్రమల వార్తలు, రివ్యూలు, బాక్సాఫీస్ కలెక్షన్లు మరియు సెలబ్రిటీ అప్డేట్స్ కోసం మీ నంబర్ వన్ ఎంటర్‌టైన్‌మెంట్ పోర్టల్.",
    footer_telegram_whatsapp: "టెలిగ్రామ్ & వాట్సాప్ ఛానెల్స్:",
    footer_telegram: "టెలిగ్రామ్",
    footer_whatsapp: "వాట్సాప్ ఛానల్",
    footer_quick_links: "శీఘ్ర లింకులు",
    footer_cinema_industries: "చిత్ర పరిశ్రమలు",
    footer_privacy: "గోప్యతా విధానం (Privacy Policy)",
    footer_terms: "నిబంధనలు & షరతులు",
    footer_contact: "మమ్మల్ని సంప్రదించండి",
    footer_rights: "సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.",
  },
  ta: {
    nav_home: "முகப்பு",
    nav_latest: "செய்திகள்",
    nav_reviews: "விமர்சனம்",
    nav_television: "தொலைக்காட்சி",
    nav_celebrity: "பிரபலங்கள்",
    nav_movies: "திரைப்படங்கள்",
    nav_interviews: "பேட்டிகள்",
    nav_gossips: "கிசுகிசு",
    nav_photos: "புகைப்படங்கள்",
    nav_videos: "வீடியோக்கள்",
    nav_events: "நிகழ்வுகள்",
    nav_trending_today: "இன்றைய டிரெண்டிங்",
    nav_industry: "கோலிவுட்",
    nav_bollywood: "பாலிவுட்",
    nav_hollywood: "ஹாலிவுட்",
    nav_actors: "நடிகர்கள்",
    nav_actresses: "நடிகைகள்",
    nav_gossip: "கிசுகிசு",
    nav_gallery: "புகைப்படங்கள்",
    nav_ott: "OTT வெளியீடுகள்",
    nav_boxoffice: "பாக்ஸ் ஆபீஸ்",
    nav_upcoming: "விரைவில் வெளியாகும் படங்கள்",
    nav_trending: "ட்ரெண்டிங்",
    nav_admin: "நிர்வாகி (Admin)",
    nav_search: "தேடுக",
    nav_search_placeholder: "திரைப்படம், நடிகர்கள், விமர்சனங்களை தேடுங்கள் (உதா: கூலி, கோட், கங்குவா)...",
    nav_hot_topics: "ஹாட் தலைப்புகள்:",
    nav_select_industry: "திரைத்துறை தேர்வு",
    nav_categories: "பிரிவுகள் (Categories)",

    btn_all_news: "அனைத்து செய்திகள்",
    btn_more_news: "மேலும் செய்திகளைப் படிக்க",
    btn_read_more: "மேலும் படிக்க",
    btn_view_all: "அனைத்தும் காண்க",
    btn_full_report: "முழு அறிக்கை",
    btn_watch_trailer: "டிரெய்லர் காண்க",
    btn_read_review: "விமர்சனம் படிக்க",
    btn_all_reviews: "அனைத்து விமர்சனங்கள்",
    btn_all_videos: "அனைத்து வீடியோக்கள்",
    btn_all_ott: "அனைத்து OTT படங்கள்",
    btn_search: "தேடுக",
    btn_share: "பகிர்க",
    btn_filter: "வடிகட்டு",

    sec_breaking: "பிரேக்கிங் நியூஸ்",
    sec_latest_news: "கோலிவுட் சமீபத்திய செய்திகள்",
    sec_top_stories: "முக்கியச் செய்தி",
    sec_trending: "ட்ரெண்டிங் செய்திகள்",
    sec_reviews: "தமிழ் திரைப்பட விமர்சனங்கள் & மதிப்பீடுகள்",
    sec_trailers: "கோலிவுட் புதிய டிரெய்லர்கள் & டீசர்கள்",
    sec_boxoffice: "கோலிவுட் வரலாற்று பாக்ஸ் ஆபீஸ் சாதனைகள்",
    sec_ott: "தமிழ் OTT வெளியீடு காலண்டர்",
    sec_gallery: "பிரபலங்களின் பிரத்யேக புகைப்படங்கள்",

    bo_rank: "வரிசை",
    bo_movie: "திரைப்படம்",
    bo_day1: "முதல் நாள் (Day 1)",
    bo_weekend: "வார இறுதி வசூல்",
    bo_worldwide: "உலகளாவிய வசூல்",
    bo_verdict: "தீர்ப்பு (Verdict)",

    footer_about:
      "FILMY GARAGE - கோலிவுட், பாலிவுட், ஹாலிவுட், தெலுங்கு, மலையாள திரைப்படங்களின் உடனுக்குடன் பிரேக்கிங் சினிமா செய்திகள், விமர்சனங்கள், பாக்ஸ் ஆபீஸ் மற்றும் பிரத்யேக பேட்டிகள் வழங்கும் முன்னணி தளம்.",
    footer_telegram_whatsapp: "டெலிகிராம் & வாட்ஸ்அப் குழுக்கள்:",
    footer_telegram: "டெலிகிராம்",
    footer_whatsapp: "வாட்ஸ்அப் சேனல்",
    footer_quick_links: "விரைவு இணைப்புகள்",
    footer_cinema_industries: "திரைத்துறைகள்",
    footer_privacy: "தனியுரிமைக் கொள்கை",
    footer_terms: "விதிமுறைகள் & நிபந்தனைகள்",
    footer_contact: "தொடர்பு கொள்க",
    footer_rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  },
  ml: {
    nav_home: "ഹോം",
    nav_latest: "വാർത്തകൾ",
    nav_reviews: "റിവ്യൂസ്",
    nav_television: "ടെലിവിഷൻ",
    nav_celebrity: "സെലിബ്രിറ്റി",
    nav_movies: "സിനിമകൾ",
    nav_interviews: "അഭിമുഖങ്ങൾ",
    nav_gossips: "ഗോസിപ്പുകൾ",
    nav_photos: "ഫോട്ടോകൾ",
    nav_videos: "വീഡിയോകൾ",
    nav_events: "ഇവന്റുകൾ",
    nav_trending_today: "ട്രെൻഡിംഗ് ടുഡേ",
    nav_industry: "മോളിവുഡ്",
    nav_bollywood: "ബോളിവുഡ്",
    nav_hollywood: "ഹോളിവുഡ്",
    nav_actors: "നടന്മാർ",
    nav_actresses: "നടിമാർ",
    nav_gossip: "ഗോസിപ്പ്",
    nav_gallery: "ഫോട്ടോ ഗാലറി",
    nav_ott: "OTT റിലീസുകൾ",
    nav_boxoffice: "ബോക്സ് ഓഫീസ്",
    nav_upcoming: "പ്രതീക്ഷിക്കുന്ന സിനിമകൾ",
    nav_trending: "ട്രെൻഡിംഗ്",
    nav_admin: "അഡ്മിൻ",
    nav_search: "തിരയുക",
    nav_search_placeholder: "സിനിമകൾ, താരങ്ങൾ, റിവ്യൂകൾ തിരയൂ (ഉദാ: എമ്പുരാൻ, ടർബോ, ആടുജീവിതം)...",
    nav_hot_topics: "ഹോട്ട് ടോപ്പിക്കുകൾ:",
    nav_select_industry: "ചലച്ചിത്രമേഖല തിരഞ്ഞെടുക്കുക",
    nav_categories: "വിഭാഗങ്ങൾ (Categories)",

    btn_all_news: "എല്ലാ വാർത്തകളും",
    btn_more_news: "കൂടുതൽ വാർത്തകൾ കാണുക",
    btn_read_more: "കൂടുതൽ വായിക്കുക",
    btn_view_all: "എല്ലാം കാണുക",
    btn_full_report: "പൂർണ്ണ റിപ്പോർട്ട്",
    btn_watch_trailer: "ട്രെയിലർ കാണുക",
    btn_read_review: "റിവ്യൂ വായിക്കുക",
    btn_all_reviews: "എല്ലാ റിവ്യൂകളും",
    btn_all_videos: "എല്ലാ വീഡിയോകളും",
    btn_all_ott: "എല്ലാ OTT ചിത്രങ്ങളും",
    btn_search: "തിരയുക",
    btn_share: "പങ്കുവെക്കുക",
    btn_filter: "ഫിൽട്ടർ",

    sec_breaking: "ബ്രേക്കിംഗ് ന്യൂസ്",
    sec_latest_news: "മോളിവുഡ് പുതിയ വാർത്തകൾ",
    sec_top_stories: "ടോപ്പ് സ്റ്റോറി",
    sec_trending: "ട്രെൻഡിംഗ് വാർത്തകൾ",
    sec_reviews: "മലയാള സിനിമ റിവ്യൂകൾ & റേറ്റിംഗുകൾ",
    sec_trailers: "മോളിവുഡ് ട്രെയിലറുകളും ടീസറുകളും",
    sec_boxoffice: "മോളിവുഡ് കളക്ഷൻ റെക്കോർഡുകൾ",
    sec_ott: "മലയാളം OTT റിലീസ് വിവരങ്ങൾ",
    sec_gallery: "സെലിബ്രിറ്റി ഫോട്ടോ ഗാലറി",

    bo_rank: "റാങ്ക്",
    bo_movie: "സിനിമയുടെ പേര്",
    bo_day1: "ആദ്യ ദിനം (Day 1)",
    bo_weekend: "വാരാന്ത്യ കളക്ഷൻ",
    bo_worldwide: "ആഗോള കളക്ഷൻ",
    bo_verdict: "വിധി (Verdict)",

    footer_about:
      "FILMY GARAGE - മലയാളം, തമിഴ്, തെലുങ്ക്, ഹിന്ദി, ഹോളിവുഡ് സിനിമകളുടെ ഏറ്റവും പുതിയ വാർത്തകൾ, ബോക്സ് ഓഫീസ് റിപ്പോർട്ടുകൾ, റിവ്യൂകൾ എന്നിവക്കായി മലയാളത്തിലെ മുൻനിര സിനിമാ പോർട്ടൽ.",
    footer_telegram_whatsapp: "ടെലിഗ്രാം & വാട്ട്‌സ്ആപ്പ് ചാനലുകൾ:",
    footer_telegram: "ടെലിഗ്രാം",
    footer_whatsapp: "വാട്ട്‌സ്ആപ്പ് ചാനൽ",
    footer_quick_links: "ദ്രുത ലിങ്കുകൾ",
    footer_cinema_industries: "ചലച്ചിത്ര മേഖലകൾ",
    footer_privacy: "സ്വകാര്യതാ നയം",
    footer_terms: "ഉപയോഗ നിബന്ധനകൾ",
    footer_contact: "ഞങ്ങളെ ബന്ധപ്പെടുക",
    footer_rights: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
  },
  hi: {
    nav_home: "होम",
    nav_latest: "समाचार",
    nav_reviews: "रिव्यू",
    nav_television: "टेलीविज़न",
    nav_celebrity: "सेलिब्रिटी",
    nav_movies: "फिल्में",
    nav_interviews: "इंटरव्यू",
    nav_gossips: "गॉसिप",
    nav_photos: "फोटोज",
    nav_videos: "वीडियोज़",
    nav_events: "इवेंट्स",
    nav_trending_today: "ट्रेंडिंग टुडे",
    nav_industry: "बॉलीवुड",
    nav_bollywood: "बॉलीवुड",
    nav_hollywood: "हॉलीवुड",
    nav_actors: "अभिनेता",
    nav_actresses: "अभिनेत्रियां",
    nav_gossip: "गॉसिप",
    nav_gallery: "फोटो गैलरी",
    nav_ott: "OTT रिलीज़",
    nav_boxoffice: "बॉक्स ऑफिस",
    nav_upcoming: "आने वाली फिल्में",
    nav_trending: "ट्रेंडिंग",
    nav_admin: "एडमिन",
    nav_search: "खोजें",
    nav_search_placeholder: "फिल्में, सितारे, समीक्षाएं खोजें (उदा: सिंघम अगेन, वॉर 2, जवान)...",
    nav_hot_topics: "हॉट टॉपिक्स:",
    nav_select_industry: "फिल्म इंडस्ट्री चुनें",
    nav_categories: "श्रेणियाँ (Categories)",

    btn_all_news: "सभी खबरें",
    btn_more_news: "और खबरें पढ़ें",
    btn_read_more: "आगे पढ़ें",
    btn_view_all: "सभी देखें",
    btn_full_report: "पूरी रिपोर्ट",
    btn_watch_trailer: "ट्रेलर देखें",
    btn_read_review: "समीक्षा पढ़ें",
    btn_all_reviews: "सभी समीक्षाएं",
    btn_all_videos: "सभी वीडियो",
    btn_all_ott: "सभी OTT फिल्में",
    btn_search: "खोजें",
    btn_share: "शेयर करें",
    btn_filter: "फ़िल्टर",

    sec_breaking: "ब्रेकिंग न्यूज़",
    sec_latest_news: "बॉलीवुड ताज़ा खबरें",
    sec_top_stories: "टॉप स्टोरी",
    sec_trending: "ट्रेंडिंग खबरें",
    sec_reviews: "बॉलीवुड मूवी रिव्यू और स्टार रेटिंग्स",
    sec_trailers: "बॉलीवुड के नए ट्रेलर और टीज़र",
    sec_boxoffice: "बॉलीवुड ऑल-टाइम बॉक्स ऑफिस रिकॉर्ड्स",
    sec_ott: "हिंदी OTT रिलीज़ कैलेंडर",
    sec_gallery: "सेलिब्रिटी फोटो गैलरी",

    bo_rank: "रैंक",
    bo_movie: "फिल्म का नाम",
    bo_day1: "पहला दिन (Day 1)",
    bo_weekend: "वीकेंड कलेक्शन",
    bo_worldwide: "कुल वर्ल्डवाइड कमाई",
    bo_verdict: "वर्डिक्ट (Verdict)",

    footer_about:
      "FILMY GARAGE - बॉलीवुड, साउथ सिनेमा और हॉलीवुड की हर पल की ब्रेकिंग न्यूज़, निष्पक्ष फिल्म समीक्षा, बॉक्स ऑफिस कलेक्शन और सितारों के खास इंटरव्यू का सबसे लोकप्रिय डिजिटल मंच।",
    footer_telegram_whatsapp: "टेलीग्राम और व्हाट्सएप चैनल्स:",
    footer_telegram: "टेलीग्राम",
    footer_whatsapp: "व्हाट्सएप चैनल",
    footer_quick_links: "त्वरित लिंक्स",
    footer_cinema_industries: "फिल्म उद्योग",
    footer_privacy: "गोपनीयता नीति (Privacy Policy)",
    footer_terms: "उपयोग की शर्तें",
    footer_contact: "संपर्क करें",
    footer_rights: "सर्वाधिकार सुरक्षित।",
  },
  en: {
    nav_home: "Home",
    nav_latest: "News",
    nav_reviews: "Reviews",
    nav_television: "Television",
    nav_celebrity: "Celebrity",
    nav_movies: "Movies",
    nav_interviews: "Interviews",
    nav_gossips: "Gossips",
    nav_photos: "Photos",
    nav_videos: "Videos",
    nav_events: "Events",
    nav_trending_today: "Trending Today",
    nav_industry: "Hollywood",
    nav_bollywood: "Bollywood",
    nav_hollywood: "Hollywood",
    nav_actors: "Actors",
    nav_actresses: "Actresses",
    nav_gossip: "Gossips",
    nav_gallery: "Photos",
    nav_ott: "Streaming & OTT",
    nav_boxoffice: "Box Office",
    nav_upcoming: "Upcoming Movies",
    nav_trending: "Trending",
    nav_admin: "Admin",
    nav_search: "Search",
    nav_search_placeholder: "Search movies, celebrities, reviews (e.g. Deadpool, Gladiator, Nolan)...",
    nav_hot_topics: "Hot Topics:",
    nav_select_industry: "Select Film Industry",
    nav_categories: "Categories",

    btn_all_news: "All Stories",
    btn_more_news: "View More Stories",
    btn_read_more: "Read More",
    btn_view_all: "View All",
    btn_full_report: "Full Report",
    btn_watch_trailer: "Watch Trailer",
    btn_read_review: "Read Review",
    btn_all_reviews: "All Reviews",
    btn_all_videos: "All Videos & Trailers",
    btn_all_ott: "All Streaming Titles",
    btn_search: "Search",
    btn_share: "Share",
    btn_filter: "Filter",

    sec_breaking: "BREAKING NEWS",
    sec_latest_news: "Latest Cinema Headlines",
    sec_top_stories: "Top Story",
    sec_trending: "Trending Stories",
    sec_reviews: "Film Reviews & Critical Verdicts",
    sec_trailers: "Official Trailers & Teasers",
    sec_boxoffice: "Worldwide All-Time Box Office Leaderboard",
    sec_ott: "Global OTT & Theatrical Streaming Dates",
    sec_gallery: "Celebrity Photo Gallery",

    bo_rank: "Rank",
    bo_movie: "Movie Title",
    bo_day1: "Opening Day",
    bo_weekend: "Opening Weekend",
    bo_worldwide: "Worldwide Gross",
    bo_verdict: "Verdict",

    footer_about:
      "FILMY GARAGE - Your premier destination for Hollywood, South Indian, and Bollywood cinema updates, in-depth film reviews, real-time box office tracking, and exclusive celebrity interviews.",
    footer_telegram_whatsapp: "Join our Community Channels:",
    footer_telegram: "Telegram",
    footer_whatsapp: "WhatsApp Channel",
    footer_quick_links: "Quick Navigation",
    footer_cinema_industries: "Film Industries",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Use",
    footer_contact: "Contact Us",
    footer_rights: "All rights reserved.",
  },
  bn: {} as Translations,
  pa: {} as Translations,
  other: {} as Translations,
};

TRANSLATIONS.bn = TRANSLATIONS.en;
TRANSLATIONS.pa = TRANSLATIONS.en;
TRANSLATIONS.other = TRANSLATIONS.en;

export function getTranslation(lang: LanguageCode, key: keyof Translations): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.kn;
  return dict[key] || TRANSLATIONS.kn[key] || "";
}

export function getLocalizedCategoryName(slug: string, lang: LanguageCode): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.kn;
  switch (slug) {
    case "mukhaputa":
    case "home":
      return dict.nav_home;
    case "latest":
    case "news":
      return dict.nav_latest;
    case "reviews":
      return dict.nav_reviews;
    case "television":
    case "tv":
      return dict.nav_television;
    case "celebrity":
      return dict.nav_celebrity;
    case "movies":
      return dict.nav_movies;
    case "interviews":
      return dict.nav_interviews;
    case "gossip":
    case "gossips":
      return dict.nav_gossips;
    case "gallery":
    case "photos":
      return dict.nav_photos;
    case "videos":
      return dict.nav_videos;
    case "events":
      return dict.nav_events;
    case "trending":
      return dict.nav_trending_today;
    case "sandalwood":
      return lang === "kn" ? "ಸ್ಯಾಂಡಲ್ವುಡ್" : "Sandalwood";
    case "bollywood":
      return dict.nav_bollywood;
    case "hollywood":
      return dict.nav_hollywood;
    case "actors":
      return dict.nav_actors;
    case "actresses":
      return dict.nav_actresses;
    case "ott":
      return dict.nav_ott;
    case "box-office":
      return dict.nav_boxoffice;
    case "upcoming":
      return dict.nav_upcoming;
    default:
      return slug;
  }
}


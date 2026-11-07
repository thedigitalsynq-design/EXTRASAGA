import { MovieReview, LanguageCode, FilmIndustry } from "@/types";

export interface RamayanaLanguageReview {
  language: LanguageCode;
  industry: FilmIndustry;
  languageName: string;
  flagEmoji: string;
  movieTitle: string;
  movieTitleEn: string;
  headline: string;
  subheadline: string;
  slug: string;
  summary: string;
  fullReviewText: string;
  verdict: string;
  closingLine: string;
  characterHighlights: {
    character: string;
    actor: string;
    description: string;
  }[];
  reviewScoreNote: string;
}

export const RAMAYANA_POSTER_IMAGE = "/images/ramayana-part-1.jpg";

export const RAMAYANA_REVIEWS_BY_LANGUAGE: Record<LanguageCode, RamayanaLanguageReview> = {
  kn: {
    language: "kn",
    industry: "sandalwood",
    languageName: "ಕನ್ನಡ (Sandalwood)",
    flagEmoji: "🟡",
    movieTitle: "ರಾಮಾಯಣ ಭಾಗ 1",
    movieTitleEn: "Ramayana: Part 1",
    headline: "ರಾಮಾಯಣ ಭಾಗ 1 – ಭಾರತೀಯ ಚಿತ್ರರಂಗದ ಹೆಮ್ಮೆಯ ಮಹಾಕಾವ್ಯ!",
    subheadline: "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA",
    slug: "ramayana-part-1-kannada-review",
    summary:
      "ಕೆಲವು ಸಿನಿಮಾಗಳು ಕೇವಲ ಮನರಂಜನೆಗಾಗಿ ನಿರ್ಮಾಣವಾಗುವುದಿಲ್ಲ. ಅವು ನಮ್ಮ ಸಂಸ್ಕೃತಿ, ಪರಂಪರೆ ಮತ್ತು ಭಾವನೆಗಳನ್ನು ಜಗತ್ತಿಗೆ ಪರಿಚಯಿಸುತ್ತವೆ. ಅಂತಹ ಒಂದು ಅದ್ಭುತ ಪ್ರಯತ್ನವೇ ರಾಮಾಯಣ ಭಾಗ 1. ರಾಕಿಂಗ್ ಸ್ಟಾರ್ ಯಶ್, ರಣಬೀರ್ ಕಪೂರ್ ಮತ್ತು ಸಾಯಿ ಪಲ್ಲವಿ ಅಭಿನಯದ ಮಹೋನ್ನತ ಚಿತ್ರ.",
    fullReviewText: `
### ಭಾರತೀಯ ಚಿತ್ರರಂಗದ ಹೆಮ್ಮೆಯ ಮಹಾಕಾವ್ಯ!

ಕೆಲವು ಸಿನಿಮಾಗಳು ಕೇವಲ ಮನರಂಜನೆಗಾಗಿ ನಿರ್ಮಾಣವಾಗುವುದಿಲ್ಲ. ಅವು ನಮ್ಮ ಸಂಸ್ಕೃತಿ, ಪರಂಪರೆ ಮತ್ತು ಭಾವನೆಗಳನ್ನು ಜಗತ್ತಿಗೆ ಪರಿಚಯಿಸುತ್ತವೆ. ಅಂತಹ ಒಂದು ಅದ್ಭುತ ಪ್ರಯತ್ನವೇ ರಾಮಾಯಣ ಭಾಗ 1.

ಇದು ಸಾಮಾನ್ಯ ಸಿನಿಮಾ ಅಲ್ಲ. ಭಾರತೀಯ ಚಿತ್ರರಂಗದ ಸಾಮರ್ಥ್ಯವನ್ನು ಜಾಗತಿಕ ಮಟ್ಟದಲ್ಲಿ ತೋರಿಸುವ ಒಂದು ಮ್ಯಾಗ್ನಂ ಓಪಸ್.

**ರಾಕಿಂಗ್ ಸ್ಟಾರ್ ಯಶ್ ಅವರ ರಾವಣನ ಪಾತ್ರ** ಚಿತ್ರದ ಪ್ರಮುಖ ಆಕರ್ಷಣೆಗಳಲ್ಲಿ ಒಂದು. ಅವರ ಗಂಭೀರ ವ್ಯಕ್ತಿತ್ವ, ಅದ್ಭುತ ಸ್ಕ್ರೀನ್ ಪ್ರೆಸೆನ್ಸ್ ಮತ್ತು ರಾವಣನ ರಾಜಮರ್ಯಾದೆಗೆ ತಕ್ಕಂತಹ ರೂಪ ಪ್ರೇಕ್ಷಕರಲ್ಲಿ ವಿಶೇಷ ಕುತೂಹಲ ಮೂಡಿಸುತ್ತದೆ.

**ರಣಬೀರ್ ಕಪೂರ್ ಶ್ರೀರಾಮನಾಗಿ** ಕಾಣಿಸಿಕೊಳ್ಳುವುದು ಮತ್ತೊಂದು ವಿಶೇಷ. ಶ್ರೀರಾಮನ ಶಾಂತ ಸ್ವಭಾವ, ಘನತೆ ಮತ್ತು ಧರ್ಮದ ಮೇಲಿನ ನಿಷ್ಠೆಯನ್ನು ಪ್ರತಿಬಿಂಬಿಸುವ ಅವರ ಪಾತ್ರದ ಚಿತ್ರಣ ಮನಸ್ಸಿಗೆ ಹತ್ತಿರವಾಗುತ್ತದೆ.

**ಸಾಯಿ ಪಲ್ಲವಿ ಸೀತೆಯಾಗಿ** ಕಾಣಿಸಿಕೊಳ್ಳುವುದು ಚಿತ್ರದ ಮತ್ತೊಂದು ಸುಂದರ ಅಂಶ. ಸೀತಾಮಾತೆಯ ಸರಳತೆ, ಘನತೆ, ಸಹನೆ ಮತ್ತು ದೈವಿಕ ಸೌಂದರ್ಯಕ್ಕೆ ಅವರ ವ್ಯಕ್ತಿತ್ವ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಯನ್ನು ನೀಡುತ್ತದೆ. ಲಕ್ಷ್ಮಣನಾಗಿ ರವೀ ದುಬೆ ಅವರ ಪಾತ್ರವೂ ಕಥೆಗೆ ಮತ್ತಷ್ಟು ಮಹತ್ವ ನೀಡುತ್ತದೆ.

ಚಿತ್ರದ ದೃಶ್ಯ ವೈಭವ, ಭವ್ಯ ಸೆಟ್ಗಳು, ಅದ್ಭುತ VFX, ಯುದ್ಧದ ದೃಶ್ಯಗಳು ಮತ್ತು ಕಲ್ಪನಾತೀತ ಲೋಕದ ನಿರ್ಮಾಣ ಭಾರತೀಯ ಸಿನಿಮಾದ ತಾಂತ್ರಿಕ ಸಾಮರ್ಥ್ಯವನ್ನು ತೋರಿಸುತ್ತವೆ.

ಆದರೆ ರಾಮಾಯಣ ನಮಗೆ ಕೇವಲ ಒಂದು ಕಥೆಯಲ್ಲ. ಅದು ನಮ್ಮ ನಂಬಿಕೆ, ನಮ್ಮ ಸಂಸ್ಕೃತಿ, ನಮ್ಮ ಪರಂಪರೆ ಮತ್ತು ನಮ್ಮ ಭಾವನೆ.

**ನನ್ನ ಪಾಲಿಗೆ ರಾಮಾಯಣಕ್ಕೆ ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ನೀಡುವ ಅಗತ್ಯವೇ ಇಲ್ಲ. ಇದು ನಮ್ಮ ಹೆಮ್ಮೆ. ನಮ್ಮ ಪರಂಪರೆ. ನಮ್ಮ ಭಾರತೀಯ ಚಿತ್ರರಂಗದ ಜಾಗತಿಕ ಕನಸು.**

**ಜೈ ಶ್ರೀರಾಮ್! ಜೈ ಹಿಂದ್!**
    `,
    verdict: "ನಮ್ಮ ಹೆಮ್ಮೆ • ನಮ್ಮ ಪರಂಪರೆ • NO RATINGS, ONLY RESPECT!",
    closingLine: "RAMAYANA – OUR CULTURE. OUR HERITAGE. OUR PRIDE. NO RATINGS, ONLY RESPECT!",
    characterHighlights: [
      {
        character: "ದಶಕಂಠ ರಾವಣ",
        actor: "ರಾಕಿಂಗ್ ಸ್ಟಾರ್ ಯಶ್",
        description: "ಗಂಭೀರ ವ್ಯಕ್ತಿತ್ವ, ಅದ್ಭುತ ಸ್ಕ್ರೀನ್ ಪ್ರೆಸೆನ್ಸ್ ಮತ್ತು ರಾವಣನ ರಾಜಮರ್ಯಾದೆ",
      },
      {
        character: "ಮರ್ಯಾದಾ ಪುರುಷೋತ್ತಮ ಶ್ರೀರಾಮ",
        actor: "ರಣಬೀರ್ ಕಪೂರ್",
        description: "ಶಾಂತ ಸ್ವಭಾವ, ಘನತೆ ಮತ್ತು ಧರ್ಮದ ಮೇಲಿನ ಅಚಲ ನಿಷ್ಠೆ",
      },
      {
        character: "ಸೀತಾಮಾತೆ",
        actor: "ಸಾಯಿ ಪಲ್ಲವಿ",
        description: "ಸರಳತೆ, ಘನತೆ, ಸಹನೆ ಮತ್ತು ದೈವಿಕ ಸೌಂದರ್ಯ",
      },
      {
        character: "ಲಕ್ಷ್ಮಣ",
        actor: "ರವೀ ದುಬೆ",
        description: "ತ್ಯಾಗ, ಭಕ್ತಿ ಮತ್ತು ಯುದ್ಧ ಕೌಶಲ್ಯದ ಧೀರ ರೂಪ",
      },
    ],
    reviewScoreNote: "ನನ್ನ ಪಾಲಿಗೆ ರಾಮಾಯಣಕ್ಕೆ ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ನೀಡುವ ಅಗತ್ಯವೇ ಇಲ್ಲ. ಇದು ನಮ್ಮ ಹೆಮ್ಮೆ. ನಮ್ಮ ಪರಂಪರೆ.",
  },
  ta: {
    language: "ta",
    industry: "kollywood",
    languageName: "தமிழ் (Kollywood)",
    flagEmoji: "🔵",
    movieTitle: "ராமாயணம் பாகம் 1",
    movieTitleEn: "Ramayana: Part 1",
    headline: "ராமாயணம் பாகம் 1 – இந்திய சினிமாவின் பெருமைமிகு பிரம்மாண்ட காவியம்!",
    subheadline: "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA",
    slug: "ramayana-part-1-tamil-review",
    summary:
      "சில திரைப்படங்கள் வெறும் பொழுதுபோக்கிற்காக உருவாக்கப்படுவதில்லை. அவை நமது கலாச்சாரம், பாரம்பரியம் மற்றும் உணர்வுகளை உலகிற்கு எடுத்துச் செல்கின்றன. அப்படிப்பட்ட ஒரு பிரம்மாண்டமான முயற்சிதான் ராமாயணம் பாகம் 1. ராக்கிங் ஸ்டார் யஷ், ரன்பீர் கபூர், சாய் பல்லவி இணைந்த மாபெரும் படைப்பு.",
    fullReviewText: `
### இந்திய சினிமாவின் பெருமைமிகு பிரம்மாண்ட காவியம்!

சில திரைப்படங்கள் வெறும் பொழுதுபோக்கிற்காக உருவாக்கப்படுவதில்லை. அவை நமது கலாச்சாரம், பாரம்பரியம் மற்றும் உணர்வுகளை உலகிற்கு எடுத்துச் செல்கின்றன. அப்படிப்பட்ட ஒரு பிரம்மாண்டமான முயற்சிதான் ராமாயணம் பாகம் 1.

இது ஒரு சாதாரண திரைப்படம் அல்ல. இந்திய சினிமாவின் திறமையையும் தொழில்நுட்ப வளர்ச்சியையும் உலக அரங்கில் எடுத்துக்காட்டும் ஒரு மகத்தான Magnum Opus.

**ராவணனாக ராக்கிங் ஸ்டார் யஷ்** இந்தப் படத்தின் மிகப்பெரிய எதிர்பார்ப்புகளில் ஒருவர். அவரது கம்பீரமான தோற்றம், திரையில் வெளிப்படும் ஆளுமை மற்றும் ராவணனுக்கே உரிய அரச கம்பீரம் ஆகியவை கதாபாத்திரத்தின் மீதான எதிர்பார்ப்பை அதிகரிக்கின்றன.

**ராமராக ரன்பீர் கபூர்** அமைதியும் கம்பீரமும் நிறைந்த கதாபாத்திரத்தில் கவனம் ஈர்க்கிறார். ஸ்ரீராமரின் தர்மம், நேர்மை மற்றும் உயர்ந்த பண்புகளை வெளிப்படுத்தும் அவரது கதாபாத்திரம் படத்தின் முக்கியமான அம்சமாக இருக்கிறது.

**சீதையாக சாய் பல்லவி** மிகவும் பொருத்தமான தேர்வாகத் தெரிகிறார். சீதையின் எளிமை, பொறுமை, கண்ணியம் மற்றும் தெய்வீக அழகை அவரது இயல்பான ஆளுமை நினைவூட்டுகிறது. லட்சுமணனாக ரவி துபேவும் கதையின் முக்கியத்துவத்தை மேலும் வலுப்படுத்துகிறார்.

படத்தின் பிரம்மாண்டமான காட்சியமைப்பு, பிரமிக்க வைக்கும் VFX, அரண்மனைகள், போர்க்களங்கள் மற்றும் ஒவ்வொரு காட்சியிலும் வெளிப்படும் கலைநயம் இந்திய சினிமாவின் தொழில்நுட்ப வளர்ச்சியை பெருமையுடன் காட்டுகின்றன.

ராமாயணம் என்பது நமது நம்பிக்கை, நமது பாரம்பரியம், நமது கலாச்சாரம் மற்றும் தலைமுறைகள் கடந்து வாழும் உணர்வு.

**இந்தப் படத்திற்கு ஐந்து நட்சத்திரமா, பத்து நட்சத்திரமா என்று மதிப்பெண் கொடுக்க விரும்பவில்லை. ராமாயணம் மதிப்பெண்களால் அளவிடக்கூடிய ஒரு படைப்பு அல்ல. அது நமது பெருமை. நமது அடையாளம்.**

**ஜெய் ஸ்ரீ ராம்! ஜெய் ஹிந்த்!**
    `,
    verdict: "நமது பெருமை • நமது அடையாளம் • NO RATINGS, ONLY RESPECT!",
    closingLine: "RAMAYANA – OUR CULTURE. OUR HERITAGE. OUR PRIDE. NO RATINGS, ONLY RESPECT!",
    characterHighlights: [
      {
        character: "ராவணன்",
        actor: "ராக்கிங் ஸ்டார் யஷ்",
        description: "கம்பீரமான தோற்றம், திரையில் வெளிப்படும் ஆளுமை மற்றும் அரச கம்பீரம்",
      },
      {
        character: "ஸ்ரீராமர்",
        actor: "ரன்பீர் கபூர்",
        description: "தர்மம், அமைதி, நேர்மை மற்றும் உயர்ந்த பண்புகளின் வடிவம்",
      },
      {
        character: "சீதா தேவி",
        actor: "சாய் பல்லவி",
        description: "எளிமை, பொறுமை, கண்ணியம் மற்றும் தெய்வீக அழகு",
      },
      {
        character: "லட்சுமணன்",
        actor: "ரவி துபே",
        description: "பாசம், விசுவாசம் மற்றும் அசைக்க முடியாத பக்தி",
      },
    ],
    reviewScoreNote: "இந்தப் படத்திற்கு ஐந்து நட்சத்திரமா, பத்து நட்சத்திரமா என்று மதிப்பெண் கொடுக்க விரும்பவில்லை. அது நமது அடையாளம்.",
  },
  te: {
    language: "te",
    industry: "tollywood",
    languageName: "తెలుగు (Tollywood)",
    flagEmoji: "🔴",
    movieTitle: "రామాయణం పార్ట్ 1",
    movieTitleEn: "Ramayana: Part 1",
    headline: "రామాయణం పార్ట్ 1 – భారతీయ సినిమా గర్వించదగిన మహాకావ్యం!",
    subheadline: "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA",
    slug: "ramayana-part-1-telugu-review",
    summary:
      "కొన్ని సినిమాలు కేవలం వినోదం కోసం రూపొందించబడవు. అవి మన సంస్కృతి, సంప్రదాయం, చరిత్ర మరియు భావోద్వేగాలను ప్రపంచానికి పరిచయం చేస్తాయి. అలాంటి గొప్ప ప్రయత్నమే రామాయణం పార్ట్ 1. రాకింగ్ స్టార్ యష్, రణబీర్ కపూర్, సాయి పల్లవి ప్రధాన పాత్రలలో అద్భుత దృశ్యకావ్యం.",
    fullReviewText: `
### భారతీయ సినిమా గర్వించదగిన మహాకావ్యం!

కొన్ని సినిమాలు కేవలం వినోదం కోసం రూపొందించబడవు. అవి మన సంస్కృతి, సంప్రదాయం, చరిత్ర మరియు భావోద్వేగాలను ప్రపంచానికి పరిచయం చేస్తాయి. అలాంటి గొప్ప ప్రయత్నమే రామాయణం పార్ట్ 1.

ఇది సాధారణ సినిమా కాదు. భారతీయ సినిమా స్థాయిని ప్రపంచ వేదికపై చాటిచెప్పే ఒక అద్భుతమైన Magnum Opus.

**రావణుడిగా రాకింగ్ స్టార్ యష్** ఈ చిత్రంలో ప్రధాన ఆకర్షణలలో ఒకరు. ఆయన గంభీరమైన రూపం, అద్భుతమైన స్క్రీన్ ప్రెజెన్స్, రావణుడి రాజసం మరియు పాత్రకు అవసరమైన బలమైన వ్యక్తిత్వం ప్రేక్షకుల్లో భారీ అంచనాలను కలిగిస్తున్నాయి.

**శ్రీరాముడిగా రణబీర్ కపూర్** పాత్రలో ప్రశాంతత, గౌరవం మరియు ధర్మానికి ప్రతీకగా కనిపిస్తున్నారు.

**సీతాదేవిగా సాయి పల్లవి** మరో ప్రత్యేక ఆకర్షణ. ఆమె సహజమైన వ్యక్తిత్వం, సీతమ్మవారి సహనం, పవిత్రత మరియు గౌరవాన్ని గుర్తు చేస్తుంది. లక్ష్మణుడిగా రవీ దూబే కూడా కథలో ముఖ్యమైన పాత్రను పోషిస్తున్నారు.

ఈ సినిమా విజువల్ గ్రాండియర్ గురించి ప్రత్యేకంగా చెప్పుకోవాలి. అద్భుతమైన విజువల్ ఎఫెక్ట్స్, భారీ సెట్స్, రాజభవనాలు, యుద్ధ సన్నివేశాలు మరియు ప్రతి ఫ్రేమ్లో కనిపించే కళాత్మకత భారతీయ సినిమా సాంకేతిక ప్రతిభను ప్రపంచానికి చాటుతున్నాయి.

రామాయణం అనేది కేవలం ఒక పురాణగాథ కాదు. అది మన విశ్వాసం, మన సంస్కృతి, మన సంప్రదాయం మరియు మన భావోద్వేగం.

**ఈ సినిమాకు ఐదు స్టార్లా, పది స్టార్లా అని రేటింగ్ ఇవ్వాలనుకోవడం లేదు. రామాయణం రేటింగ్లకు అతీతం. ఇది మన గర్వం. మన వారసత్వం.**

**జై శ్రీరామ్! జై హింద్!**
    `,
    verdict: "మన గర్వం • మన వారసత్వం • NO RATINGS, ONLY RESPECT!",
    closingLine: "RAMAYANA – OUR CULTURE. OUR HERITAGE. OUR PRIDE. NO RATINGS, ONLY RESPECT!",
    characterHighlights: [
      {
        character: "రావణుడు",
        actor: "రాకింగ్ స్టార్ యష్",
        description: "గంభీరమైన రూపం, అద్భుతమైన స్క్రీన్ ప్రెజెన్స్, రావణుడి రాజసం",
      },
      {
        character: "శ్రీరాముడు",
        actor: "రణబీర్ కపూర్",
        description: "ప్రశాంతత, గౌరవం మరియు ధర్మానికి అసలైన ప్రతీక",
      },
      {
        character: "సీతాదేవి",
        actor: "సాయి పల్లవి",
        description: "సహజమైన వ్యక్తిత్వం, సహనం, పవిత్రత మరియు గౌరవం",
      },
      {
        character: "లక్ష్మణుడు",
        actor: "రవీ దూబే",
        description: "విధేయత, త్యాగం మరియు ధైర్యసాహసాల ప్రతిరూపం",
      },
    ],
    reviewScoreNote: "ఈ సినిమాకు ఐదు స్టార్లా, పది స్టార్లా అని రేటింగ్ ఇవ్వాలనుకోవడం లేదు. రామాయణం రేటింగ్లకు అతీతం.",
  },
  hi: {
    language: "hi",
    industry: "bollywood",
    languageName: "हिन्दी (Bollywood)",
    flagEmoji: "🟣",
    movieTitle: "रामायण पार्ट 1",
    movieTitleEn: "Ramayana: Part 1",
    headline: "रामायण पार्ट 1 – भारतीय सिनेमा का गौरव, हमारी संस्कृति का महाकाव्य!",
    subheadline: "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA",
    slug: "ramayana-part-1-hindi-review",
    summary:
      "कुछ फिल्में सिर्फ मनोरंजन के लिए नहीं बनतीं, बल्कि वे हमारी संस्कृति, विरासत, इतिहास और भावनाओं को पूरी दुनिया तक पहुंचाने का माध्यम बनती हैं। रामायण पार्ट 1 ऐसी ही एक भव्य और महत्वाकांक्षी सिनेमाई प्रस्तुति है। रॉकिंग स्टार यश, रणबीर कपूर और साई पल्लवी का अविस्मरणीय अभिनय।",
    fullReviewText: `
### भारतीय सिनेमा का गौरव, हमारी संस्कृति का महाकाव्य!

कुछ फिल्में सिर्फ मनोरंजन के लिए नहीं बनतीं, बल्कि वे हमारी संस्कृति, विरासत, इतिहास और भावनाओं को पूरी दुनिया तक पहुंचाने का माध्यम बनती हैं। रामायण पार्ट 1 ऐसी ही एक भव्य और महत्वाकांक्षी सिनेमाई प्रस्तुति है।

यह सिर्फ एक फिल्म नहीं, बल्कि भारतीय सिनेमा का एक मैग्नम ओपस है। दुनिया के सामने भारत की महान पौराणिक विरासत को इतने बड़े स्तर पर प्रस्तुत करने का प्रयास वास्तव में गर्व की बात है।

**रावण के रूप में रॉकिंग स्टार यश** इस फिल्म के सबसे बड़े आकर्षणों में से एक हैं। उनका दमदार व्यक्तित्व, प्रभावशाली स्क्रीन प्रेजेंस और रावण के शाही अंदाज में दिखाई देने वाली भव्यता इस किरदार को बेहद खास बनाती है।

**भगवान श्रीराम के रूप में रणबीर कपूर** एक अलग ही आकर्षण लेकर आते हैं। श्रीराम की शांति, मर्यादा, करुणा और धर्म के प्रति अटूट निष्ठा इस किरदार की सबसे बड़ी विशेषताएं हैं।

**माता सीता के रूप में साई पल्लवी** बेहद सुंदर और प्रभावशाली चयन हैं। उनकी सहजता, सादगी और व्यक्तित्व में सीता माता की गरिमा, धैर्य और पवित्रता की झलक महसूस होती है। लक्ष्मण के रूप में रवि दुबे भी इस महाकाव्य के महत्वपूर्ण किरदारों में शामिल हैं।

फिल्म का विजुअल ट्रीटमेंट, विशाल सेट्स, शानदार VFX, भव्य महल, युद्ध के दृश्य और अद्भुत सिनेमैटिक फ्रेम भारतीय फिल्म निर्माण की नई संभावनाओं को दर्शाते हैं।

लेकिन रामायण हमारे लिए सिर्फ एक कहानी नहीं है। यह हमारी आस्था है, हमारी संस्कृति है, हमारी पहचान है और पीढ़ियों से हमारे दिलों में बसी हुई विरासत है।

**मैं इस फिल्म को किसी स्टार रेटिंग में बांधना नहीं चाहूंगा। रामायण को पांच या दस अंकों में नहीं मापा जा सकता। यह हमारी भावनाओं और हमारे गौरव से जुड़ी हुई है।**

**जय श्री राम! जय हिंद!**
    `,
    verdict: "हमारी आस्था • हमारा गौरव • NO RATINGS, ONLY RESPECT!",
    closingLine: "RAMAYANA – OUR CULTURE. OUR HERITAGE. OUR PRIDE. NO RATINGS, ONLY RESPECT!",
    characterHighlights: [
      {
        character: "लंकानरेश रावण",
        actor: "रॉकिंग स्टार यश",
        description: "दमदार व्यक्तित्व, प्रभावशाली स्क्रीन प्रेजेंस और रावण का शाही अंदाज",
      },
      {
        character: "मर्यादा पुरुषोत्तम श्रीराम",
        actor: "रणबीर कपूर",
        description: "शांति, मर्यादा, करुणा और धर्म के प्रति अटूट निष्ठा",
      },
      {
        character: "माता सीता",
        actor: "साई पल्लवी",
        description: "सहजता, सादगी, गरिमा, धैर्य और असीम पवित्रता",
      },
      {
        character: "लक्ष्मण",
        actor: "रवि दुबे",
        description: "समर्पण, निष्ठा और भ्रातृ प्रेम का अद्वितीय प्रतीक",
      },
    ],
    reviewScoreNote: "मैं इस फिल्म को किसी स्टार रेटिंग में बांधना नहीं चाहूंगा। यह हमारी भावनाओं और हमारे गौरव से जुड़ी हुई है।",
  },
  ml: {
    language: "ml",
    industry: "mollywood",
    languageName: "മലയാളം (Mollywood)",
    flagEmoji: "🟢",
    movieTitle: "രാമായണം പാർട്ട് 1",
    movieTitleEn: "Ramayana: Part 1",
    headline: "രാമായണം പാർട്ട് 1 – ഇന്ത്യൻ സിനിമയുടെ അഭിമാനം, നമ്മുടെ മഹത്തായ ഇതിഹാസം!",
    subheadline: "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA",
    slug: "ramayana-part-1-malayalam-review",
    summary:
      "ചില സിനിമകൾ വെറും വിനോദത്തിനായി മാത്രം നിർമ്മിക്കപ്പെടുന്നവയല്ല. നമ്മുടെ സംസ്കാരവും പാരമ്പര്യവും ചരിത്രവും വികാരങ്ങളും ലോകത്തിന് മുന്നിൽ അവതരിപ്പിക്കുന്ന വലിയ ശ്രമങ്ങളായിരിക്കും അവ. അത്തരമൊരു മഹത്തായ സിനിമാറ്റിക് ശ്രമമാണ് രാമായണം പാർട്ട് 1. റോക്കിംഗ് സ്റ്റാർ യഷ്, രൺബീർ കപൂർ, സായി പല്ലവി ഒന്നിക്കുന്ന ദൃശ്യവിസ്മയം.",
    fullReviewText: `
### ഇന്ത്യൻ സിനിമയുടെ അഭിമാനം, നമ്മുടെ മഹത്തായ ഇതിഹാസം!

ചില സിനിമകൾ വെറും വിനോദത്തിനായി മാത്രം നിർമ്മിക്കപ്പെടുന്നവയല്ല. നമ്മുടെ സംസ്കാരവും പാരമ്പര്യവും ചരിത്രവും വികാരങ്ങളും ലോകത്തിന് മുന്നിൽ അവതരിപ്പിക്കുന്ന വലിയ ശ്രമങ്ങളായിരിക്കും അവ. അത്തരമൊരു മഹത്തായ സിനിമാറ്റിക് ശ്രമമാണ് രാമായണം പാർട്ട് 1.

ഇത് ഒരു സാധാരണ സിനിമയല്ല. ഇന്ത്യൻ സിനിമയുടെ കഴിവും സാങ്കേതിക മികവും ലോകത്തിന് മുന്നിൽ അവതരിപ്പിക്കുന്ന ഒരു മാഗ്നം ഓപസ് തന്നെയാണ്.

**രാവണനായി റോകിംഗ് സ്റ്റാർ യഷ്** എത്തുന്നു എന്നത് ചിത്രത്തിന്റെ ഏറ്റവും വലിയ ആകർഷണങ്ങളിലൊന്നാണ്. അദ്ദേഹത്തിന്റെ ഗംഭീരമായ വ്യക്തിത്വം, ശക്തമായ സ്ക്രീൻ പ്രസൻസ്, രാവണന്റെ രാജകീയ ഭാവത്തിന് അനുയോജ്യമായ രൂപം എന്നിവ ഈ കഥാപാത്രത്തെ ഏറെ ശ്രദ്ധേയമാക്കുന്നു.

**ശ്രീരാമനായി രൺബീർ കപൂർ** എത്തുമ്പോൾ കഥാപാത്രത്തിന്റെ ശാന്തതയും ഗാംഭീര്യവും ധർമ്മത്തോടുള്ള അചഞ്ചലമായ പ്രതിബദ്ധതയും അവതരിപ്പിക്കാനുള്ള വലിയ ഉത്തരവാദിത്തമാണ് അദ്ദേഹത്തിനുള്ളത്.

**സീതാദേവിയായി സായി പല്ലവി** എത്തുന്നത് മറ്റൊരു മനോഹരമായ തിരഞ്ഞെടുപ്പാണ്. അവരുടെ സ്വാഭാവികമായ വ്യക്തിത്വവും ലാളിത്യവും സീതാദേവിയുടെ സഹനവും പരിശുദ്ധിയും അന്തസ്സും ഓർമ്മിപ്പിക്കുന്നു. ലക്ഷ്മണനായി രവി ദുബെയും പ്രധാന കഥാപാത്രമായി എത്തുന്നു.

ചിത്രത്തിന്റെ ദൃശ്യവിസ്മയത്തെക്കുറിച്ച് പ്രത്യേകം പറയണം. അതിമനോഹരമായ വിഷ്വൽ ഇഫക്റ്റുകൾ, ഭീമാകാരമായ സെറ്റുകൾ, രാജകൊട്ടാരങ്ങൾ, യുദ്ധരംഗങ്ങൾ, ഓരോ ഫ്രെയിമിലുമുള്ള ദൃശ്യഭംഗി എന്നിവ ഇന്ത്യൻ സിനിമയുടെ സാങ്കേതിക മികവിന്റെ വലിയ ഉദാഹരണമാണ്.

രാമായണം വെറുമൊരു സിനിമയല്ല. അത് നമ്മുടെ വിശ്വാസമാണ്, നമ്മുടെ സംസ്കാരമാണ്, നമ്മുടെ പാരമ്പര്യമാണ്, തലമുറകളായി നമ്മുടെ ഹൃദയങ്ങളിൽ ജീവിക്കുന്ന ഒരു മഹത്തായ വികാരമാണ്.

**ഈ സിനിമയ്ക്ക് അഞ്ച് സ്റ്റാറോ പത്ത് സ്റ്റാറോ നൽകാൻ ഞാൻ ആഗ്രഹിക്കുന്നില്ല. കാരണം രാമായണത്തെ ഒരു റേറ്റിംഗിൽ ഒതുക്കാൻ കഴിയില്ല. ഇത് നമ്മുടെ അഭിമാനമാണ്, നമ്മുടെ പൈതൃകമാണ്.**

**ജയ് ശ്രീറാം! ജയ് ഹിന്ദ്!**
    `,
    verdict: "നമ്മുടെ അഭിമാനം • നമ്മുടെ പൈതൃകം • NO RATINGS, ONLY RESPECT!",
    closingLine: "RAMAYANA – OUR CULTURE. OUR HERITAGE. OUR PRIDE. NO RATINGS, ONLY RESPECT!",
    characterHighlights: [
      {
        character: "രാവണൻ",
        actor: "റോക്കിംഗ് സ്റ്റാർ യഷ്",
        description: "ഗംഭീരമായ വ്യക്തിത്വം, ശക്തമായ സ്ക്രീൻ പ്രസൻസ്, രാജകീയ ഭാവം",
      },
      {
        character: "ശ്രീരാമൻ",
        actor: "രൺബീർ കപൂർ",
        description: "ശാന്തത, ഗാംഭീര്യം, ധർമ്മത്തോടുള്ള അചഞ്ചലമായ പ്രതിബദ്ധത",
      },
      {
        character: "സീതാദേവി",
        actor: "സായി പല്ലവി",
        description: "സ്വാഭാവികമായ വ്യക്തിത്വം, ലാളിത്യം, സഹനം, പരിശുദ്ധി",
      },
      {
        character: "ലക്ഷ്മണൻ",
        actor: "രവി ദുബെ",
        description: "സമർപ്പണം, ധീരത, നിസ്വാർത്ഥമായ സ്നേഹം",
      },
    ],
    reviewScoreNote: "ഈ സിനിമയ്ക്ക് അഞ്ച് സ്റ്റാറോ പത്ത് സ്റ്റാറോ നൽകാൻ ഞാൻ ആഗ്രഹിക്കുന്നില്ല. കാരണം രാമായണത്തെ ഒരു റേറ്റിംഗിൽ ഒതുക്കാൻ കഴിയില്ല.",
  },
  en: {
    language: "en",
    industry: "hollywood",
    languageName: "English (Global)",
    flagEmoji: "⚪",
    movieTitle: "RAMAYANA: PART 1",
    movieTitleEn: "Ramayana: Part 1",
    headline: "RAMAYANA: PART 1 – NOT JUST A MOVIE, IT'S OUR PRIDE!",
    subheadline: "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA",
    slug: "ramayana-part-1-english-review",
    summary:
      "Some films are made for entertainment, while a few are made to create history. Some stories go beyond cinema and become a part of our identity, culture and emotions. Ramayana Part 1 belongs to that special category. Rocking Star Yash, Ranbir Kapoor and Sai Pallavi headline India's grandest cinematic milestone.",
    fullReviewText: `
### NOT JUST A MOVIE, IT'S OUR PRIDE!

Some films are made for entertainment, while a few are made to create history. Some stories go beyond cinema and become a part of our identity, culture and emotions. Ramayana Part 1 belongs to that special category.

This is not just another big-budget film. It is a true cinematic Magnum Opus, an ambitious attempt to bring one of India's greatest epics to the global stage. Seeing our rich mythology being presented on such a massive cinematic canvas is something every Indian can feel proud of.

**YASH AS RAVANA – A CHARACTER THAT COMMANDS ATTENTION!**

Rocking Star Yash as Ravana is undoubtedly one of the biggest attractions. His powerful personality, commanding screen presence and royal appearance make this character particularly exciting. Ravana is not an ordinary antagonist; he is a complex and powerful character with immense knowledge, ambition and pride. Yash stepping into such an iconic role makes the cinematic experience even more intriguing.

**RANBIR KAPOOR AS LORD RAMA**

Ranbir Kapoor as Lord Rama brings another important dimension to this epic. The character of Rama represents righteousness, compassion, dignity and the ultimate commitment to dharma. Portraying such an iconic personality comes with enormous responsibility.

**SAI PALLAVI AS MATA SITA**

Sai Pallavi as Sita is another beautiful casting choice. Her natural screen presence, simplicity and graceful personality complement the dignity, patience and strength associated with Mata Sita. Ravie Dubey as Lakshmana further adds to the ensemble.

**VISUAL SPECTACLE – A WORLD BEYOND IMAGINATION!**

One cannot talk about Ramayana without mentioning its grand visual presentation. The breathtaking landscapes, magnificent palaces, detailed production design, spectacular VFX and larger-than-life battle sequences create the feeling of stepping into an entirely different world.

The scale and ambition of the project reflect how far Indian cinema has come. This is an attempt to take Indian storytelling to audiences across the world.

But beyond the stars, technology, performances and grand visuals, there is something much bigger.

Ramayana is not just a story for Indians. It is our heritage, our faith, our culture and an emotion that has travelled through generations. It teaches us about truth, sacrifice, loyalty, courage and dharma.

**NO STAR RATINGS. NO NUMBERS. NO COMPARISONS.**

I don't want to rate Ramayana out of 5 or 10 stars. How can we measure something that is so deeply connected to our roots and identity?

This is not just cinema to be rated. This is our pride, our legacy and a celebration of Indian storytelling.

**RAMAYANA IS MORE THAN A MOVIE. IT IS AN EMOTION. IT IS OUR PRIDE.**

**JAI SHRI RAM! JAI HIND!**
    `,
    verdict: "OUR CULTURE • OUR HERITAGE • OUR PRIDE • NO RATINGS, ONLY RESPECT!",
    closingLine: "RAMAYANA – OUR CULTURE. OUR HERITAGE. OUR PRIDE. NO RATINGS, ONLY RESPECT!",
    characterHighlights: [
      {
        character: "Ravana",
        actor: "Rocking Star Yash",
        description: "Powerful personality, commanding screen presence, immense knowledge and royal aura",
      },
      {
        character: "Lord Rama",
        actor: "Ranbir Kapoor",
        description: "Righteousness, compassion, dignity, and unwavering commitment to dharma",
      },
      {
        character: "Mata Sita",
        actor: "Sai Pallavi",
        description: "Simplicity, grace, patience, purity, and profound inner strength",
      },
      {
        character: "Lakshmana",
        actor: "Ravie Dubey",
        description: "Loyalty, fierce devotion, and brotherhood in the face of epic trials",
      },
    ],
    reviewScoreNote: "No star ratings. No numbers. No comparisons. Ramayana is our pride, our legacy, and a celebration of Indian storytelling.",
  },
  bn: {} as RamayanaLanguageReview,
  pa: {} as RamayanaLanguageReview,
  other: {} as RamayanaLanguageReview,
};

RAMAYANA_REVIEWS_BY_LANGUAGE.bn = RAMAYANA_REVIEWS_BY_LANGUAGE.en;
RAMAYANA_REVIEWS_BY_LANGUAGE.pa = RAMAYANA_REVIEWS_BY_LANGUAGE.en;
RAMAYANA_REVIEWS_BY_LANGUAGE.other = RAMAYANA_REVIEWS_BY_LANGUAGE.en;

/**
 * Converts Ramayana language review into a canonical MovieReview object.
 */
export function getRamayanaMovieReview(lang: LanguageCode): MovieReview {
  const data = RAMAYANA_REVIEWS_BY_LANGUAGE[lang] || RAMAYANA_REVIEWS_BY_LANGUAGE.kn;

  return {
    id: `rev-ramayana-${data.language}`,
    movieTitle: data.movieTitle,
    movieTitleEn: data.movieTitleEn,
    slug: data.slug,
    language: data.language,
    industry: data.industry,
    rating: 5.0, // Used internally, UI displays "NO RATINGS • ONLY RESPECT"
    maxRating: 5.0,
    releaseDate: "2026-11-01",
    director: "ನಿತೇಶ್ ತಿವಾರಿ (Nitesh Tiwari)",
    producers: ["ನಮಿತ್ ಮಲ್ಹೋತ್ರಾ (DNEG)", "ಯಶ್ (ಮಾನ್‌ಸ್ಟರ್ ಮೈಂಡ್ ಕ್ರಿಯೇಷನ್ಸ್)"],
    musicDirector: "ಎ.ಆರ್. ರೆಹಮಾನ್ & ಹ್ಯಾನ್ಸ್ ಜಿಮ್ಮರ್ (A.R. Rahman & Hans Zimmer)",
    cinematography: "ವಿವೇಕ್ ಆನಂದ್",
    cast: [
      { name: "ರಾಕಿಂಗ್ ಸ್ಟಾರ್ ಯಶ್ (Yash)", role: "ರಾವಣ (Ravana)" },
      { name: "ರಣಬೀರ್ ಕಪೂರ್ (Ranbir Kapoor)", role: "ಶ್ರೀರಾಮ (Lord Rama)" },
      { name: "ಸಾಯಿ ಪಲ್ಲವಿ (Sai Pallavi)", role: "ಸೀತಾಮಾತೆ (Mata Sita)" },
      { name: "ರವೀ ದುಬೆ (Ravie Dubey)", role: "ಲಕ್ಷ್ಮಣ (Lakshmana)" },
      { name: "ಸನ್ನಿ ಡಿಯೋಲ್ (Sunny Deol)", role: "ಹನುಮಂತ (Lord Hanuman)" },
    ],
    posterImage: RAMAYANA_POSTER_IMAGE,
    bannerImage: RAMAYANA_POSTER_IMAGE,
    trailerYoutubeId: "",
    genres: ["ಮಹಾಕಾವ್ಯ (Epic Mythological)", "ದೃಶ್ಯ ವೈಭವ (Magnum Opus)", "ಆಕ್ಷನ್ ಡ್ರಾಮಾ"],
    censorRating: "U",
    runtime: "3 ಗಂಟೆ 10 ನಿಮಿಷ (Part 1)",
    verdict: data.verdict,
    summary: data.summary,
    storyAnalysis: data.subheadline,
    performanceAnalysis: data.fullReviewText,
    directionAnalysis: "ನಿತೇಶ್ ತಿವಾರಿ ಅವರ ಕಲ್ಪನೆ ಹಾಗೂ ಹಾಲಿವುಡ್ ದರ್ಜೆಯ ಮೇಕಿಂಗ್.",
    musicAnalysis: "ಎ.ಆರ್. ರೆಹಮಾನ್ ಮತ್ತು ಆಸ್ಕರ್ ವಿಜೇತ ಹ್ಯಾನ್ಸ್ ಜಿಮ್ಮರ್ ಅವರ ಜಂಟಿ ಸಂಗೀತ ಸಂಯೋಜನೆ.",
    pros: [
      "ರಾಕಿಂಗ್ ಸ್ಟಾರ್ ಯಶ್ ಅವರ ಗಂಭೀರ ಹಾಗೂ ರಾಜಸದ ರಾವಣನ ಅವತಾರ",
      "ರಣಬೀರ್ ಕಪೂರ್ ಮತ್ತು ಸಾಯಿ ಪಲ್ಲವಿ ಅವರ ದೈವಿಕ ಪಾತ್ರ ಪೋಷಣೆ",
      "ವಿಶ್ವ ದರ್ಜೆಯ VFX, ಭವ್ಯ ಅಯೋಧ್ಯೆ ಹಾಗೂ ಲಂಕಾ ನಗರದ ಸೆಟ್‌ಗಳು",
      "ನಮ್ಮ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಪರಂಪರೆಯನ್ನು ಜಾಗತಿಕ ಮಟ್ಟಕ್ಕೆ ಕೊಂಡೊಯ್ಯುವ ಮ್ಯಾಗ್ನಂ ಓಪಸ್",
    ],
    cons: ["ಈ ಮಹಾಕಾವ್ಯಕ್ಕೆ ಯಾವುದೇ ಕೊರತೆಗಳಿಲ್ಲ - ರೇಟಿಂಗ್‌ಗಳಿಗೆ ಮೀರಿದ ಭಾರತೀಯ ಹೆಮ್ಮೆ!"],
    boxOfficeSummary: "ಜಾಗತಿಕ ಮಟ್ಟದಲ್ಲಿ ಸಾರ್ವಕಾಲಿಕ ಇತಿಹಾಸ ಬರೆಯಲಿರುವ ಭಾರತೀಯ ಸಿನಿಮಾ.",
    publishedAt: "2026-11-01T00:00:00Z",
    author: "FILMY GARAGE ವಿಶೇಷ ಸಂಪಾದಕೀಯ ಮಂಡಳಿ",
  };
}

export const ALL_RAMAYANA_REVIEWS: MovieReview[] = (
  ["kn", "te", "ta", "hi", "ml", "en"] as LanguageCode[]
).map(getRamayanaMovieReview);


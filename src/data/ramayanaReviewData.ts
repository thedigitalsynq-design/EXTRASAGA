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

/**
 * English-only edition: the per-language Ramayana review variants were
 * edition presentations of ONE canonical review. Every legacy language key
 * now resolves to the single English record below.
 */
export const RAMAYANA_ENGLISH_REVIEW: RamayanaLanguageReview = {
  language: "en",
  industry: "hollywood",
  languageName: "English (Global)",
  flagEmoji: "⚪",
  movieTitle: "RAMAYANA: PART 1",
  movieTitleEn: "Ramayana: Part 1",
  headline: "RAMAYANA: PART 1 – MORE THAN A MOVIE, IT IS OUR PRIDE!",
  subheadline: "A MAGNUM OPUS CELEBRATION OF INDIAN CINEMA",
  slug: "ramayana-part-1-english-review",
  summary:
    "Some films are made for entertainment, while a few are made to create history. Some stories go beyond cinema and become a part of our identity, culture and emotions. Ramayana Part 1 belongs to that special category. Rocking Star Yash, Ranbir Kapoor and Sai Pallavi headline India's grandest cinematic milestone.",
  fullReviewText: `
### MORE THAN A MOVIE, IT IS OUR PRIDE!

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
};

const LEGACY_LANGUAGE_KEYS: LanguageCode[] = ["kn", "te", "ta", "ml", "hi", "en", "bn", "pa", "other"];

export const RAMAYANA_REVIEWS_BY_LANGUAGE: Record<LanguageCode, RamayanaLanguageReview> =
  Object.fromEntries(LEGACY_LANGUAGE_KEYS.map((key) => [key, RAMAYANA_ENGLISH_REVIEW])) as Record<
    LanguageCode,
    RamayanaLanguageReview
  >;

/**
 * Converts the canonical Ramayana English review into a MovieReview object.
 * The historical `lang` argument is accepted for compatibility and resolved
 * to the single English record.
 */
export function getRamayanaMovieReview(_lang?: LanguageCode): MovieReview {
  void _lang;
  const data = RAMAYANA_ENGLISH_REVIEW;

  return {
    id: "rev-ramayana-en",
    movieTitle: data.movieTitle,
    movieTitleEn: data.movieTitleEn,
    slug: data.slug,
    language: data.language,
    industry: data.industry,
    rating: 5.0, // Used internally, UI displays "NO RATINGS • ONLY RESPECT"
    maxRating: 5.0,
    releaseDate: "2026-11-01",
    director: "Nitesh Tiwari",
    producers: ["Namit Malhotra (DNEG)", "Yash (Monster Mind Creations)"],
    musicDirector: "A.R. Rahman & Hans Zimmer",
    cinematography: "Vivek Anand",
    cast: [
      { name: "Rocking Star Yash", role: "Ravana" },
      { name: "Ranbir Kapoor", role: "Lord Rama" },
      { name: "Sai Pallavi", role: "Mata Sita" },
      { name: "Ravie Dubey", role: "Lakshmana" },
      { name: "Sunny Deol", role: "Lord Hanuman" },
    ],
    posterImage: RAMAYANA_POSTER_IMAGE,
    bannerImage: RAMAYANA_POSTER_IMAGE,
    trailerYoutubeId: "",
    genres: ["Epic Mythological", "Magnum Opus", "Action Drama"],
    censorRating: "U",
    runtime: "3h 10m (Part 1)",
    verdict: data.verdict,
    summary: data.summary,
    storyAnalysis: data.subheadline,
    performanceAnalysis: data.fullReviewText,
    directionAnalysis: "Nitesh Tiwari's vision with Hollywood-grade craft and scale.",
    musicAnalysis: "A joint score from A.R. Rahman and Oscar winner Hans Zimmer.",
    pros: [
      "Rocking Star Yash stately, commanding Ravana avatar",
      "Divine performances from Ranbir Kapoor and Sai Pallavi",
      "World-class VFX with the grand Ayodhya and Lanka city sets",
      "A Magnum Opus carrying our culture and heritage to the global stage",
    ],
    cons: ["This epic has no shortcomings — an Indian pride beyond ratings!"],
    boxOfficeSummary: "Indian cinema poised to write all-time global history.",
    publishedAt: "2026-11-01T00:00:00Z",
    author: "EXTRA-SAAGA Special Editorial Board",
  };
}

export const ALL_RAMAYANA_REVIEWS: MovieReview[] = [getRamayanaMovieReview("en")];

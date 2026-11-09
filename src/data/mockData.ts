import {
  Article,
  MovieReview,
  BoxOfficeEntry,
  OttRelease,
  VideoItem,
  GalleryItem,
  AdSpot,
  Comment,
} from "@/types";
import {
  MULTILINGUAL_ARTICLES,
  MULTILINGUAL_REVIEWS,
  MULTILINGUAL_BOX_OFFICE,
  MULTILINGUAL_VIDEOS,
  MULTILINGUAL_OTT,
  MULTILINGUAL_GALLERIES,
} from "./multilingualSeeds";
import { ALL_RAMAYANA_REVIEWS } from "./ramayanaReviewData";

export { CATEGORIES } from "@/lib/categories";

const KANNADA_ARTICLES_RAW: Article[] = [
  {
    id: "art-1",
    title: "Kantara Chapter 1: Rishab Shetty's Fierce Transformation Lights Up Kundapura Sets",
    titleEn: "Kantara Chapter 1: Rishab Shetty's Fierce Transformation Lights Up Kundapura Sets",
    slug: "kantara-chapter-1-shooting-kundapura-rishab-shetty-look",
    summary: "Along the misty shores of coastal Karnataka, director-actor Rishab Shetty summons ancient Kadamba folklore for Kantara Chapter 1 — a cinematic voyage carved in devotion, grit, and breathtaking scale.",
    content: `
Along the emerald coastline of Kundapura, the cameras are rolling for Hombale Films' highly anticipated magnum opus, **'Kantara Chapter 1'**.

### An Ancient Kingdom Rises in the Forest
Director and actor Rishab Shetty takes audiences back to the fourth-century Kadamba era. Deep within the dense coastal woodlands, art directors have constructed an ancient stone fortress and traditional village settlement where intense battle sequences are filmed under the guidance of world-renowned action directors.

### Devotion, Sweat, and a Fierce Awakening
To embody this ancestral warrior, Rishab Shetty underwent grueling physical training in Kalaripayattu and horse riding. Behind-the-scenes dispatches reveal an actor transformed — his piercing eyes and wild, weathered beard radiating a raw, elemental power that promises to hold audiences spellbound.

> "Kantara is a sacred mirror held up to our living folklore. Chapter 1 is being forged with tenfold the devotion and sweat of the original." — Producer Vijay Kiragandur.

With soaring orchestration by Ajaneesh Loknath and luminous camera work by Aravind Kashyap, Kantara Chapter 1 will release worldwide in seven languages.
    `,
    category: "sandalwood",
    categoryName: "Sandalwood",
    tags: ["Kantara Chapter 1", "Rishab Shetty", "Hombale Films", "Coastal Karnataka", "Sandalwood"],
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "An exclusive glimpse from the atmospheric sets of Kantara Chapter 1",
    author: {
      id: "auth-1",
      name: "Praveen Kumar",
      role: "Senior Film Correspondent",
    },
    publishedAt: "2026-10-31T08:30:00Z",
    readTimeMinutes: 4,
    views: 48200,
    isBreaking: true,
    isTopStory: true,
    isTrending: true,
    isFeatured: true,
    status: "published",
    relatedArticleIds: ["art-2", "art-3"],
  },
  {
    id: "art-2",
    title: "Hollywood Action Masters Join Yash's 'Toxic' for Hard-Hitting Stunt Choreography",
    titleEn: "Hollywood Action Masters Join Yash's 'Toxic' for Hard-Hitting Stunt Choreography",
    slug: "yash-toxic-movie-hollywood-stunt-master-geetu-mohandas",
    summary: "Rocking Star Yash joins forces with the acclaimed stunt choreographers behind John Wick on the sprawling sets of Toxic — an ambitious retro crime saga directed by Geetu Mohandas.",
    content: `
Following the historic worldwide triumph of KGF Chapter 2, Rocking Star Yash returns with his boldest creative gamble yet: **'Toxic: A Fairy Tale for Grown-ups'**. Directed by celebrated visionary Geetu Mohandas, the project has captured the imagination of cinephiles across the globe.

### A Living Port City Reborn on Set
Production designers have painstakingly recreated a moody 1980s coastal haven on the outskirts of Bengaluru, complete with vintage warehouses and neon-lit docks. Set against the shadows of an international cartel, the film presents Yash in a sharp, magnetic avatar unlike anything Indian cinema has witnessed.

### Hollywood-Grade Action Meets Raw Emotion
Veteran action directors from Hollywood's John Wick and Mad Max franchises have arrived on set to design visceral, grounded combat sequences. Alongside Yash, powerhouse performers Kiara Advani and Nayanthara bring gravitas to central narrative roles.

> "Toxic will redefine the visual grammar of Indian action cinema. Yash brings an architect's precision and an artist's heart to every single frame." — Geetu Mohandas.
    `,
    category: "sandalwood",
    categoryName: "Sandalwood",
    tags: ["Yash", "Toxic", "Geetu Mohandas", "Rocking Star"],
    featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Behind the lens during a high-stakes sequence in Toxic",
    author: {
      id: "auth-2",
      name: "EXTRA-SAAGA Bureau",
      role: "Special Correspondent",
    },
    publishedAt: "2026-10-31T07:15:00Z",
    readTimeMinutes: 3,
    views: 62400,
    isBreaking: false,
    isTopStory: true,
    isTrending: true,
    isFeatured: true,
    status: "published",
    relatedArticleIds: ["art-1", "art-4"],
  },
  {
    id: "art-3",
    title: "Kiccha Sudeep's Action Spectacle 'Max' Confirms Worldwide Theatrical Release Date",
    titleEn: "Kiccha Sudeep's Action Spectacle 'Max' Confirms Worldwide Theatrical Release Date",
    slug: "kiccha-sudeep-max-movie-release-date-teaser-update",
    summary: "Abhinaya Chakravarthy Kiccha Sudeep returns in a commanding cop avatar as the makers of Max lock their worldwide release schedule across five Indian languages.",
    content: `
The wait is officially over for Kiccha Sudeep's legions of fans. Director Vijay Karthikeyan and producer Kalaippuli S. Thanu have confirmed the worldwide theatrical arrival of the pulse-pounding cop thriller, **'Max'**.

### Sudeep as a Uncompromising Force of Justice
In Max, Sudeep portrays an unwavering police officer who takes down an entrenched criminal syndicate with razor-sharp intellect and sheer physical might. Producer Thanu shared that Ajaneesh Loknath's thunderous musical score will be the beating heart of the theatrical experience.

The film will release simultaneously across Kannada, Telugu, Tamil, Malayalam, and Hindi screens, accompanied by a breathtaking theatrical trailer launch in the coming days.
    `,
    category: "latest",
    categoryName: "Latest News",
    tags: ["Kiccha Sudeep", "Max", "Kalaippuli Thanu", "Sandalwood"],
    featuredImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Kiccha Sudeep commands the screen in Max",
    author: {
      id: "auth-1",
      name: "Praveen Kumar",
      role: "Senior Film Correspondent",
    },
    publishedAt: "2026-10-31T06:00:00Z",
    readTimeMinutes: 3,
    views: 31200,
    isBreaking: true,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },
  {
    id: "art-4",
    title: "Rukmini Vasanth Signs Next Major Multilingual Project Following 'Sapta Sagaradaache Ello'",
    titleEn: "Rukmini Vasanth Signs Next Major Multilingual Project Following 'Sapta Sagaradaache Ello'",
    slug: "rukmini-vasanth-new-pan-india-movie-sapta-sagaradaache-ello",
    summary: "After captivating hearts nationwide with her poignant performance in Sapta Sagaradaache Ello, Rukmini Vasanth steps into an ambitious new chapter of Indian cinema.",
    content: `
Few actors have touched audiences as deeply in recent years as **Rukmini Vasanth**. Her tender, luminous performance in the two-part romantic tragedy 'Sapta Sagaradaache Ello' echoed far beyond state boundaries, earning universal acclaim from critics and moviegoers alike.

### Demand Soars Across Tamil, Telugu, and Kannada Cinema
Following notable collaborations alongside Sivakarthikeyan and Vijay Sethupathi in Tamil cinema, Rukmini has now greenlit another major multilingual production. Her instinctive grace and dedication to honest, character-driven storytelling make her one of the most exciting young talents in modern Indian cinema.
    `,
    category: "actresses",
    categoryName: "Actresses",
    tags: ["Rukmini Vasanth", "Sapta Sagaradaache Ello", "Sandalwood Actresses"],
    featuredImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Actress Rukmini Vasanth in an expressive portrait",
    author: {
      id: "auth-3",
      name: "Sneha Gouda",
      role: "Entertainment Reporter",
    },
    publishedAt: "2026-10-30T16:20:00Z",
    readTimeMinutes: 2,
    views: 29400,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },
  {
    id: "art-5",
    title: "Shivarajkumar and Daali Dhananjay Reunite for Fiery Gangland Saga 'Uttarakaanda'",
    titleEn: "Shivarajkumar and Daali Dhananjay Reunite for Fiery Gangland Saga 'Uttarakaanda'",
    slug: "uttarakaanda-shivarajkumar-daali-dhananjay-rohit-padaki",
    summary: "Against the rustic poetry and dry winds of North Karnataka, director Rohit Padaki unites Century Star Shivarajkumar and Daali Dhananjay for an explosive on-screen clash in Uttarakaanda.",
    content: `
KRG Studios' much-awaited rural crime drama **'Uttarakaanda'** is shaping up to be an earthy masterwork. Director Rohit Padaki weaves the rich linguistic rhythm and fearless spirit of North Karnataka into an authentic underworld saga.

Century Star Shivarajkumar and Daali Dhananjay previously created cinematic history with their unforgettable clash in Tagaru. Their reunion in Uttarakaanda promises to reignite that electric screen chemistry on a grander, more atmospheric canvas.
    `,
    category: "sandalwood",
    categoryName: "Sandalwood",
    tags: ["Uttarakaanda", "Shivarajkumar", "Daali Dhananjay", "KRG"],
    featuredImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "The striking official poster reveal of Uttarakaanda",
    author: {
      id: "auth-1",
      name: "Praveen Kumar",
      role: "Senior Film Correspondent",
    },
    publishedAt: "2026-10-30T14:10:00Z",
    readTimeMinutes: 3,
    views: 38900,
    isBreaking: false,
    isTopStory: false,
    isTrending: false,
    isFeatured: true,
    status: "published",
  },
  {
    id: "art-6",
    title: "Bagheera's Box Office Roar: Sriimurali's Vigilante Thriller Crosses ₹40 Crore Worldwide",
    titleEn: "Bagheera's Box Office Roar: Sriimurali's Vigilante Thriller Crosses ₹40 Crore Worldwide",
    slug: "bagheera-box-office-collection-first-week-sriimurali",
    summary: "Written by Prashanth Neel and directed by Dr. Suri, Bagheera sets the box office ablaze with packed halls and thunderous applause across Karnataka and overseas markets.",
    content: `
Sriimurali's fierce turn as a nocturnal guardian of justice in **'Bagheera'** continues to draw capacity crowds into theaters across the country.

Produced under the Hombale Films banner with a gripping story penned by Prashanth Neel, the film has crossed the ₹40-crore mark at the global box office in its opening week alone — marking the most celebrated box office milestone of Sriimurali's journey.
    `,
    category: "box-office",
    categoryName: "Box Office",
    tags: ["Bagheera", "Box Office", "Sriimurali", "Hombale"],
    featuredImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Audiences celebrate Bagheera's thunderous opening run",
    author: {
      id: "auth-2",
      name: "EXTRA-SAAGA Bureau",
      role: "Special Correspondent",
    },
    publishedAt: "2026-10-30T11:45:00Z",
    readTimeMinutes: 2,
    views: 54100,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },
  {
    id: "art-7",
    title: "Weekend Streaming Radar: Five Landmark Kannada Films Arrive on Major OTT Platforms",
    titleEn: "Weekend Streaming Radar: Five Landmark Kannada Films Arrive on Major OTT Platforms",
    slug: "top-5-kannada-movies-releasing-on-ott-this-week",
    summary: "From high-octane vigilante thrills to warm romantic comedies, the season's most compelling theatrical hits make their digital bow on Netflix, Prime Video, and ZEE5.",
    content: `
For movie lovers settling in for a weekend of cinema from the comfort of home, this week offers an exceptional lineup of fresh digital premieres.

### 1. Bagheera — Netflix
Following its triumphant theatrical run, the vigilante thriller 'Bagheera' streams this Friday in Kannada, Telugu, Tamil, and Hindi.

### 2. Krishnam Pranaya Sakhi — Prime Video
Golden Star Ganesh's gentle, laugh-out-loud family entertainer brings its melodic charm to Prime Video.

### 3. Bheema — ZEE5
Duniya Vijay's raw, unvarnished portrait of urban underworld realities lands on ZEE5 with uncompromised intensity.
    `,
    category: "ott",
    categoryName: "OTT Update",
    tags: ["OTT", "Netflix", "Prime Video", "ZEE5"],
    featuredImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "A bumper weekend of home entertainment for streaming cinephiles",
    author: {
      id: "auth-3",
      name: "Sneha Gouda",
      role: "Entertainment Reporter",
    },
    publishedAt: "2026-10-29T18:00:00Z",
    readTimeMinutes: 3,
    views: 41200,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },
  {
    id: "art-8",
    title: "Upendra's 'UI' Unveils First Making Footage: A Daring Leap into Surreal Cinema",
    titleEn: "Upendra's 'UI' Unveils First Making Footage: A Daring Leap into Surreal Cinema",
    slug: "upendra-ui-movie-making-video-release",
    summary: "Real Star Upendra pulls back the velvet curtain on UI, revealing an intricate dystopian landscape designed to challenge our assumptions and redefine modern storytelling.",
    content: `
Whenever Real Star Upendra steps behind the director's lens, conventional narrative formulas vanish into thin air. The newly revealed making footage from **'UI'** offers a tantalizing look into a dystopian fantasy world built on mind-bending practical sets and thought-provoking philosophical themes.
    `,
    category: "sandalwood",
    categoryName: "Sandalwood",
    tags: ["Upendra", "UI", "Real Star", "Sandalwood"],
    featuredImage: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Fascinating set architecture captured during the making of UI",
    author: {
      id: "auth-1",
      name: "Praveen Kumar",
      role: "Senior Film Correspondent",
    },
    publishedAt: "2026-10-29T12:00:00Z",
    readTimeMinutes: 3,
    views: 35100,
    isBreaking: false,
    isTopStory: false,
    isTrending: false,
    isFeatured: false,
    status: "published",
  },
  // --- INTERVIEWS ---
  {
    id: "art-interview-1",
    title: "Exclusive: 'Breathing Life into Kadamba Lore & the Fire of Kantara Chapter 1' — Rishab Shetty Speaks His Heart",
    titleEn: "Rishab Shetty on Kantara Chapter 1: Ancient History, Fierce Training, and Coastal Roots",
    slug: "exclusive-interview-rishab-shetty-kantara-chapter-1-challenges",
    summary: "In an intimate conversation, Rishab Shetty reveals the sacred devotion, intense combat training, and deep historical research powering the grand world of Kantara Chapter 1.",
    content: `
Following the cultural phenomenon of Kantara, Rishab Shetty has returned to the soil, shaping a story that journeys deep into the roots of our ancient heritage.

### The Sacred Echoes of Kadamba Lore
"We are resurrecting the fourth-century Kadamba era — a time when honour, faith, and the pulse of nature were one," shares Rishab. "To honour that memory, our team spent months unearthing forgotten temple inscriptions, learning oral ballads, and weaving authentic coastal lore into every frame."

### The Crucible of Preparation
Bringing a warrior's spirit to screen demanded total transformation. Rishab trained relentlessly in Kalaripayattu, traditional swordplay, and ancient horsemanship under veteran masters across Kerala and coastal Karnataka. "Every blister, every hour in the saddle was an offering to the craft. When the lens opens, the audience must feel the raw heartbeat of that forgotten dawn."
    `,
    category: "interviews",
    categoryName: "Interviews",
    tags: ["Interview", "Rishab Shetty", "Kantara 1", "Sandalwood"],
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Rishab Shetty breaks into an easy smile during the interview",
    author: { id: "auth-1", name: "Praveen Kumar", role: "Senior Film Correspondent" },
    publishedAt: "2026-10-31T09:00:00Z",
    readTimeMinutes: 5,
    views: 42100,
    isBreaking: false,
    isTopStory: true,
    isTrending: true,
    isFeatured: true,
    status: "published",
  },
  {
    id: "art-interview-2",
    title: "'Toxic is a Storm of Emotion, Not Just Gunpowder' — Director Geetu Mohandas Decodes Yash's Epic Vision",
    titleEn: "Geetu Mohandas on Toxic: Yash's Filmmaking Instincts, World-Class Stunts, and Moral Ambiguity",
    slug: "interview-geetu-mohandas-yash-toxic-movie-vision",
    summary: "Acclaimed filmmaker Geetu Mohandas pulls back the curtain on Toxic, exploring her creative partnership with Rocking Star Yash and the fearless moral depths of their upcoming global spectacle.",
    content: `
Acclaimed for her poignant visual poetry in Moothon, director Geetu Mohandas is now at the helm of Toxic: A Fairy Tale for Grown-ups — one of the most eagerly awaited cinematic events in Indian cinema.

### A Symphony of Creative Minds
"Yash is far more than a magnetic performer; he is a cinematic architect who sees stories in complete symphonies," explains Geetu. "From the emotional temperature of a shadow to the moral weight behind a single line of dialogue, our conversations are fearless, passionate, and relentless."

### Reimagining Action on a Canvas of Flesh and Blood
Backed by renowned international stunt choreographers, Toxic blends balletic action with raw vulnerability. "We aren't staging violence for cheap adrenaline. Every punch and spark carries emotional consequence. It is an exploration of darkness, redemption, and the unbreakable human spirit."
    `,
    category: "interviews",
    categoryName: "Interviews",
    tags: ["Interview", "Geetu Mohandas", "Yash", "Toxic"],
    featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Director Geetu Mohandas on the sets of Toxic",
    author: { id: "auth-2", name: "EXTRA-SAAGA Bureau", role: "Special Correspondent" },
    publishedAt: "2026-10-30T10:00:00Z",
    readTimeMinutes: 4,
    views: 38200,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },

  // --- GOSSIP ---
  {
    id: "art-gossip-1",
    title: "Whispers in the Wind: A High-Profile Bollywood Star Rumoured for Yash's 'Toxic'",
    titleEn: "Studio Whispers: A Major Bollywood Icon in Talks for a Pivotal Cameo in Toxic",
    slug: "gandhinagar-gossip-bollywood-star-cameo-in-yash-toxic",
    summary: "The corridors of Indian cinema are buzzing with excitement after a celebrated Bollywood star was reportedly spotted on the high-security Bengaluru sets of Toxic.",
    content: `
The most tantalising secret humming through industry corridors right now centres on the secretive Bengaluru sets of Toxic.

According to well-placed trade insiders, a celebrated Bollywood leading lady recently filmed a covert sequence against an atmospheric international backdrop. While the production team maintains absolute silence behind heavy studio curtains, cinephiles are already piecing together the breadcrumbs.
    `,
    category: "gossip",
    categoryName: "Gossip",
    tags: ["Gossip", "Toxic", "Yash", "Gandhinagar"],
    featuredImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "The mysterious rumours sweeping Gandhinagar over Toxic",
    author: { id: "auth-3", name: "Sneha Gouda", role: "Entertainment Reporter" },
    publishedAt: "2026-10-31T05:30:00Z",
    readTimeMinutes: 2,
    views: 45600,
    isBreaking: true,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },
  {
    id: "art-gossip-2",
    title: "Two Titans on One Canvas: A Historic Multi-Starrer Quietly Brewing in the South",
    titleEn: "Twin Sparks on Screen: Top Leading Icons Circling an Ambitious Multi-Starrer",
    slug: "sandalwood-rumour-big-budget-multistarrer-superstars",
    summary: "A top production house is quietly preparing a cinematic juggernaut that could bring two of the region's most beloved screen icons together for an unforgettable spectacle.",
    content: `
The golden age of grand multi-starrers is returning with renewed vigour across Indian cinema. Inspired by monumental collaborative epics, major studio houses are drafting screenplays designed to share the spotlight between two powerhouse leading men.

"When two distinct energies collide on the silver screen, magic happens," notes a senior producer. Pre-production discussions are underway under strict non-disclosure, promising a historic cinematic union.
    `,
    category: "gossip",
    categoryName: "Gossip",
    tags: ["Gossip", "Multi-starrer", "Sandalwood"],
    featuredImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-3", name: "Sneha Gouda", role: "Entertainment Reporter" },
    publishedAt: "2026-10-29T15:00:00Z",
    readTimeMinutes: 2,
    views: 28900,
    isBreaking: false,
    isTopStory: false,
    isTrending: false,
    isFeatured: false,
    status: "published",
  },

  // --- TELEVISION ---
  {
    id: "art-tv-1",
    title: "Tears, Triumphs, and Golden Ratings: The Grand Finale That Captivated Millions",
    titleEn: "Television History: Record-Breaking Viewership Sweeps the Nation for Grand Finale",
    slug: "kannada-television-record-trp-reality-show-grand-finale",
    summary: "A whirlwind of raw emotion, breathtaking talent, and nail-biting suspense powered the weekend's grand finale into a cultural celebration watched across millions of homes.",
    content: `
From humble town beginnings to the blinding lights of the central stage, the emotional journey of hopeful dreamers culminated in an unforgettable evening of prime-time television.

The grand finale didn't just break viewership records; it became a communal campfire where families gathered, cheered, and wept together. The winner's victory speech reminded everyone why ordinary human courage will always be television's most enduring spectacle.
    `,
    category: "television",
    categoryName: "Television",
    tags: ["Television", "Reality Show", "TRP", "Kannada Serial"],
    featuredImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-3", name: "Sneha Gouda", role: "Entertainment Reporter" },
    publishedAt: "2026-10-30T17:00:00Z",
    readTimeMinutes: 3,
    views: 24300,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },
  {
    id: "art-tv-2",
    title: "The Master of the Arena Returns: Kiccha Sudeep Ignites Excitement for Bigg Boss",
    titleEn: "Bigg Boss New Season Unveiled: Kiccha Sudeep Sparks Massive Digital Anticipation",
    slug: "bigg-boss-kannada-new-season-kiccha-sudeep-promo",
    summary: "With his commanding presence and warm empathy, Kiccha Sudeep returns to host the definitive reality spectacle, promising fresh twists and emotional fireworks.",
    content: `
The countdown has officially begun for the country's most watched reality arena. In a sleek, electrifying new teaser, Kiccha Sudeep stands at the crossroads of human nature, drama, and resilience.

Featuring an architectural redesign of the glass house and a cast of eclectic personalities from literature, cinema, and social spheres, this season promises to test character under the unblinking eye of twenty-four-hour cameras.
    `,
    category: "television",
    categoryName: "Television",
    tags: ["Television", "Bigg Boss Kannada", "Kiccha Sudeep"],
    featuredImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-3", name: "Sneha Gouda", role: "Entertainment Reporter" },
    publishedAt: "2026-10-31T04:00:00Z",
    readTimeMinutes: 3,
    views: 51200,
    isBreaking: true,
    isTopStory: false,
    isTrending: true,
    isFeatured: true,
    status: "published",
  },

  // --- CELEBRITY ---
  {
    id: "art-celeb-1",
    title: "Warmth, Heritage, and Golden Diyas: Yash and Radhika Pandit's Heartwarming Diwali",
    titleEn: "A Festival of Lights Rooted in Tradition: Yash & Radhika Pandit Celebrate at Home",
    slug: "radhika-pandit-yash-diwali-celebration-family-photos",
    summary: "Surrounded by earthen lamps and laughter, Rocking Star Yash and Radhika Pandit celebrated the festival of lights with their children, reminding fans that family remains life's sweetest anchor.",
    content: `
Far away from the glitz of red carpets and flashbulbs, cinema's golden couple chose the gentle glow of earthen lamps and quiet courtyard prayers for Diwali.

Dressed in handwoven traditional silk, Yash and Radhika shared candid snapshots with their children, Ayra and Yatharv. The warmth in their smiles captured the timeless essence of the festival — reminding fans across the country that the brightest light always shines from within the home.
    `,
    category: "celebrity",
    categoryName: "Celebrity",
    tags: ["Celebrity", "Yash", "Radhika Pandit", "Family"],
    featuredImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-3", name: "Sneha Gouda", role: "Entertainment Reporter" },
    publishedAt: "2026-10-31T06:30:00Z",
    readTimeMinutes: 2,
    views: 68900,
    isBreaking: false,
    isTopStory: true,
    isTrending: true,
    isFeatured: true,
    status: "published",
  },
  {
    id: "art-celeb-2",
    title: "A Crown for the Homeland: Rishab Shetty Dedicates His National Award to the People",
    titleEn: "National Award in Hand, Feet on Sacred Soil: Rishab Shetty's Humble Homecoming",
    slug: "national-award-celebration-rishab-shetty-family",
    summary: "Holding the country's highest cinematic honour for Kantara, Rishab Shetty returned to his ancestral village to place the trophy at the feet of his elders and the sacred spirits of the coast.",
    content: `
True to his roots, Best Actor National Award winner Rishab Shetty chose to celebrate not in banquet halls, but amidst the swaying areca palms of his native village, Keradi.

"This honour does not belong to me; it belongs to our soil, our ancestral performers, and every devotee who keeps the flame of our culture alive," said Shetty with folded hands. The celebration was a moving reminder that true greatness stays anchored to the earth that nurtured it.
    `,
    category: "celebrity",
    categoryName: "Celebrity",
    tags: ["Celebrity", "Rishab Shetty", "National Award"],
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-1", name: "Praveen Kumar", role: "Senior Film Correspondent" },
    publishedAt: "2026-10-28T14:00:00Z",
    readTimeMinutes: 3,
    views: 43100,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },

  // --- EVENTS ---
  {
    id: "art-event-1",
    title: "A Symphony of Stars: South Indian Cinema Dazzles on the Global Stage at SIIMA",
    titleEn: "Glitz, Glamour, and Brotherhood: Inside the Star-Studded SIIMA Celebrations",
    slug: "siima-awards-kannada-cinema-stars-red-carpet-highlights",
    summary: "Under the glittering skyline, India's brightest cinematic voices gathered to celebrate storytelling, cross-industry camaraderie, and monumental artistic triumphs.",
    content: `
The red carpet shimmered with bespoke silk, couture gowns, and boundless artistic joy as the SIIMA Awards brought together filmmakers, actors, and technicians from four thriving language industries.

Beyond the golden statuettes and celebratory confetti, the evening was a testament to the borderless power of cinema — where language boundaries dissolved into shared standing ovations and heartfelt mutual admiration.
    `,
    category: "events",
    categoryName: "Events",
    tags: ["Events", "SIIMA Awards", "Red Carpet", "Sandalwood"],
    featuredImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-2", name: "EXTRA-SAAGA Bureau", role: "Special Correspondent" },
    publishedAt: "2026-10-30T19:00:00Z",
    readTimeMinutes: 3,
    views: 33400,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },
  {
    id: "art-event-2",
    title: "The Consecration of a Saga: Sacred Rituals Mark the Launch of Kantara Chapter 1",
    titleEn: "Kantara Chapter 1 Takes Flight: Film Fraternity Gathers for Kundapura Muhurat",
    slug: "kantara-chapter-1-grand-muhurat-event-kundapura",
    summary: "Amidst sacred coastal incantations and temple drums, Hombale Films launched the prequel saga of Kantara, embarking on an ambitious journey into ancient folklore.",
    content: `
As the morning mist drifted over the sacred temple town of Kundapura, the cinematic world paused to witness the auspicious launch of Kantara Chapter 1.

Accompanied by traditional coastal percussion and blessings from regional cultural elders, director-actor Rishab Shetty and producer Vijay Kiragandur embarked on a journey that aims to bridge ancient mythical storytelling with world-class technical wizardry.
    `,
    category: "events",
    categoryName: "Events",
    tags: ["Events", "Muhurat", "Kantara 1", "Hombale"],
    featuredImage: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-1", name: "Praveen Kumar", role: "Senior Film Correspondent" },
    publishedAt: "2026-10-27T11:00:00Z",
    readTimeMinutes: 3,
    views: 29800,
    isBreaking: false,
    isTopStory: false,
    isTrending: false,
    isFeatured: false,
    status: "published",
  },

  // --- ACTORS ---
  {
    id: "art-actor-1",
    title: "Three Decades of Fire and Grace: The Enduring Legacy of Kiccha Sudeep",
    titleEn: "Thirty Years of Stardom: How Kiccha Sudeep Redefined the Modern Screen Hero",
    slug: "kiccha-sudeep-30-years-in-cinema-inspiring-journey",
    summary: "From earnest beginnings to pan-Indian reverence, Kiccha Sudeep's thirty-year odyssey stands as a masterclass in versatility, vocal power, and unwavering commitment to the silver screen.",
    content: `
Few actors carry a room with just the resonance of their voice. Over three decades, Kiccha Sudeep has carved his own constellation in the cinematic universe — moving effortlessly from sensitive, wounded souls to towering larger-than-life heroes.

Whether breathing intense psychological complexity into classic dramas or commanding massive multiplex crowds in high-octane blockbusters, Sudeep remains a restless student of cinema. His thirty-year milestone is not a sunset, but the prologue to his boldest creative chapter yet.
    `,
    category: "actors",
    categoryName: "Actors",
    tags: ["Actors", "Kiccha Sudeep", "Sandalwood Actors"],
    featuredImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-1", name: "Praveen Kumar", role: "Senior Film Correspondent" },
    publishedAt: "2026-10-31T03:00:00Z",
    readTimeMinutes: 4,
    views: 57800,
    isBreaking: false,
    isTopStory: true,
    isTrending: true,
    isFeatured: true,
    status: "published",
  },
  {
    id: "art-actor-2",
    title: "The Alchemist of Raw Cinema: Daali Dhananjay's Mission to Nurture Fresh Voices",
    titleEn: "From Electrifying Antagonist to Visionary Producer: The Evolution of Daali Dhananjay",
    slug: "daali-dhananjay-new-journey-supporting-indie-cinema",
    summary: "Balancing intense on-screen brilliance with visionary producing chops, Daali Dhananjay is using his creative capital to open doors for tomorrow's boldest storytellers.",
    content: `
Affectionately christened Natarakshasa (the Actor-Demon) for his visceral, unforgettable performances, Dhananjay has never walked the easy path.

Having captured audiences with sheer grit and chameleon-like adaptability, he has now stepped behind the camera as a creative champion. Through his production banner, Dhananjay is backing gritty independent films, proving that commercial stardom is sweetest when it serves as a launching pad for authentic, unvarnished human stories.
    `,
    category: "actors",
    categoryName: "Actors",
    tags: ["Actors", "Daali Dhananjay", "Daali Pictures"],
    featuredImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-1", name: "Praveen Kumar", role: "Senior Film Correspondent" },
    publishedAt: "2026-10-28T09:30:00Z",
    readTimeMinutes: 3,
    views: 31400,
    isBreaking: false,
    isTopStory: false,
    isTrending: false,
    isFeatured: false,
    status: "published",
  },

  // --- BOLLYWOOD ---
  {
    id: "art-bolly-1",
    title: "A Mythological Canvas on a Global Scale: The Vision Behind Nitesh Tiwari's Ramayana",
    titleEn: "Ramayana Part 1: Oscar-Winning VFX Teams Unite for Indian Cinema's Grandest Epic",
    slug: "ramayana-ranbir-kapoor-yash-vfx-hollywood-scale-budget",
    summary: "With Ranbir Kapoor embodying Lord Rama and Rocking Star Yash portraying Ravana, the ambitious epic marshals global visual effects veterans to bring timeless mythology alive.",
    content: `
Indian cinema is preparing to take its most reverent and visually audacious leap forward with Nitesh Tiwari's Ramayana: Part 1.

Bringing together the country's finest performers alongside Academy Award-winning visual effects studios, the production treats the sacred epic not merely as a blockbuster, but as a living cultural heritage rendered with breathtaking technical precision. Every landscape, celestial palace, and battle sequence is being crafted with devotion, ensuring the epic resonates across world audiences for generations to come.
    `,
    category: "bollywood",
    categoryName: "Bollywood",
    tags: ["Bollywood", "Ramayana", "Ranbir Kapoor", "Yash"],
    featuredImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-2", name: "EXTRA-SAAGA Bureau", role: "Special Correspondent" },
    publishedAt: "2026-10-31T08:00:00Z",
    readTimeMinutes: 4,
    views: 64100,
    isBreaking: false,
    isTopStory: true,
    isTrending: true,
    isFeatured: true,
    status: "published",
  },
  {
    id: "art-bolly-2",
    title: "Roaring Theatres and Houseful Boards: Singham Again Dominates the Festive Box Office",
    titleEn: "Festive Thunder: Singham Again Surpasses ₹100 Crore in an Electrifying Opening Weekend",
    slug: "singham-again-rohit-shetty-ajay-devgn-box-office-diwali",
    summary: "Ajay Devgn leads an all-star ensemble in Rohit Shetty's latest spectacle, turning cinema halls nationwide into celebration arenas with packed single-screens and multiplexes.",
    content: `
The festival of lights met high-octane cinematic adrenaline as Singham Again roared into theatres across the nation.

Combining the mass charisma of Ajay Devgn with a parade of beloved franchise heroes, the film has set cash registers ringing from opening morning. With explosive action beats and patriotic fervour tailored for communal cinema enjoyment, the film proved once again that high-energy theatrical experiences remain undefeated.
    `,
    category: "bollywood",
    categoryName: "Bollywood",
    tags: ["Bollywood", "Singham Again", "Rohit Shetty"],
    featuredImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-2", name: "EXTRA-SAAGA Bureau", role: "Special Correspondent" },
    publishedAt: "2026-10-29T14:30:00Z",
    readTimeMinutes: 3,
    views: 39500,
    isBreaking: false,
    isTopStory: false,
    isTrending: true,
    isFeatured: false,
    status: "published",
  },

  // --- HOLLYWOOD ---
  {
    id: "art-holly-1",
    title: "Into the Heart of Fire and Ash: James Cameron Expands the Wonders of Pandora",
    titleEn: "Avatar: Fire and Ash — Unveiling Pandora's Volcanic Clan and Darker Emotional Depths",
    slug: "avatar-3-fire-and-ash-james-cameron-volcano-world-details",
    summary: "James Cameron prepares to take audiences beyond the tranquil oceans into the fiery volcanic territories of Pandora, introducing the complex Ash People in Avatar 3.",
    content: `
Master visionary James Cameron is ready to flip the emotional and ecological axis of Pandora in Avatar: Fire and Ash.

Departing from the lush bioluminescent forests and soothing coral reefs of earlier chapters, the third instalment plunges into the scorched territories of the Ash Clan — a community sculpted by lava, hardship, and moral ambiguity. Cameron promises an immersive sensory voyage that tests family loyalties against the raw fury of planetary elements.
    `,
    category: "hollywood",
    categoryName: "Hollywood",
    tags: ["Hollywood", "Avatar 3", "James Cameron"],
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-2", name: "EXTRA-SAAGA Bureau", role: "Special Correspondent" },
    publishedAt: "2026-10-31T07:45:00Z",
    readTimeMinutes: 4,
    views: 48900,
    isBreaking: false,
    isTopStory: true,
    isTrending: true,
    isFeatured: true,
    status: "published",
  },
  {
    id: "art-holly-2",
    title: "A New Riddle in 70mm: Christopher Nolan Secretly Prepares His Next IMAX Spectacle",
    titleEn: "Master of Time: Christopher Nolan Prepares His Next Mystery Epic for Universal Pictures",
    slug: "christopher-nolan-next-imax-project-hollywood-secrecy",
    summary: "Following the monumental triumph of Oppenheimer, director Christopher Nolan is readying an all-new theatrical experience under strict, impenetrable secrecy.",
    content: `
Whenever Christopher Nolan steps behind an IMAX camera, cinema lovers know that reality itself is about to be reimagined.

Fresh off multiple Academy Awards for Oppenheimer, the maestro has booked global release dates for his next ambitious project with Universal Pictures. True to Nolan's legendary craftsmanship, details remain locked in an impenetrable vault, but one thing is certain: cinema halls worldwide will once again become cathedrals of sight and sound.
    `,
    category: "hollywood",
    categoryName: "Hollywood",
    tags: ["Hollywood", "Christopher Nolan", "IMAX"],
    featuredImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    author: { id: "auth-2", name: "EXTRA-SAAGA Bureau", role: "Special Correspondent" },
    publishedAt: "2026-10-28T16:00:00Z",
    readTimeMinutes: 3,
    views: 36700,
    isBreaking: false,
    isTopStory: false,
    isTrending: false,
    isFeatured: false,
    status: "published",
  },
];

export const ARTICLES_SEED: Article[] = [
  ...KANNADA_ARTICLES_RAW.map((a) => ({
    language: "en" as const,
    industry: "sandalwood" as const,
    ...a,
  })),
  ...MULTILINGUAL_ARTICLES,
];

const KANNADA_REVIEWS_RAW: MovieReview[] = [
  {
    id: "rev-1",
    movieTitle: "Kantara",
    movieTitleEn: "Kantara",
    slug: "kantara-movie-review",
    rating: 4.8,
    maxRating: 5.0,
    releaseDate: "2022-09-30",
    director: "Rishab Shetty",
    producers: ["Vijay Kiragandur (Hombale Films)"],
    musicDirector: "B. Ajaneeesh Loknath",
    cinematography: "Aravind S. Kashyap",
    cast: [
      { name: "Rishab Shetty", role: "Shiva / Kantara" },
      { name: "Saptami Gowda", role: "Leela" },
      { name: "Kishore", role: "Muralidhar (Forest Officer)" },
      { name: "Achyuth Kumar", role: "Devendra Suttooru" },
    ],
    posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    trailerYoutubeId: "8MR9Ohbv3KM",
    genres: ["Action", "Drama", "Mythical Thriller", "Coastal Culture"],
    censorRating: "U/A",
    runtime: "2 hours 28 minutes",
    verdict: "A peerless jewel of Karnataka's divine folk culture - All Time Blockbuster!",
    summary: "A breathtaking film that renders the clash between coastal daiva worship and the fight for land onto the big screen with spine-chilling power.",
    storyAnalysis: "The story travels across three timelines - 1847, 1970 and the 1990s. A king, seeking peace of mind, pleads with the forest spirit and grants land; his descendants then strive to reclaim it. The tug-of-war between nature's balance and human greed has been told with remarkable intimacy.",
    performanceAnalysis: "Rishab Shetty's performance is the crowning act of his career. Watching him channel Guliga and Panjurli into his body in the climax will pull tears from your eyes. Kishore's honest forest officer and Achyuth Kumar's deceptive turn are both superb.",
    directionAnalysis: "Rishab Shetty's direction shines through every single frame. He has captured the coastal dialect, Kambala, Bhoota Kola and the delicate rhythms of forest life with immense reverence.",
    musicAnalysis: "Ajaneeesh Loknath's background score and 'Varaha Roopam' are the soul of the film. The music plays the leading part in leaving theatre audiences spellbound.",
    pros: [
      "Rishab Shetty's phenomenal climax performance",
      "'Varaha Roopam' and the goosebump-inducing background score",
      "The sacredness of daiva worship and stunning cinematography",
      "Earthy, authentic coastal dialogues dripping with the smell of the soil",
    ],
    cons: [
      "A few comedy stretches in the first half may feel a touch long",
    ],
    boxOfficeSummary: "Made on a modest ₹16 crore budget, it amassed over ₹450 crore worldwide and rewrote the record books.",
    publishedAt: "2022-10-01T10:00:00Z",
    author: "Cinema Reviews Desk",
  },
  {
    id: "rev-2",
    movieTitle: "K.G.F: Chapter 2",
    movieTitleEn: "K.G.F: Chapter 2",
    slug: "kgf-chapter-2-movie-review",
    rating: 4.7,
    maxRating: 5.0,
    releaseDate: "2022-04-14",
    director: "Prashanth Neel",
    producers: ["Vijay Kiragandur (Hombale Films)"],
    musicDirector: "Ravi Basrur",
    cinematography: "Bhuvan Gowda",
    cast: [
      { name: "Yash (Rocking Star)", role: "Rocky Bhai" },
      { name: "Sanjay Dutt", role: "Adheera" },
      { name: "Raveena Tandon", role: "Ramika Sen (Prime Minister)" },
      { name: "Srinidhi Shetty", role: "Reena Desai" },
    ],
    posterImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
    trailerYoutubeId: "JKa05nyUmuQ",
    genres: ["Action", "Mass Entertainer", "Crime Drama"],
    censorRating: "U/A",
    runtime: "2 hours 48 minutes",
    verdict: "The monster that wrote Indian cinema history - Global Blockbuster!",
    summary: "A big-scale mass film built around Rocky Bhai's ambition to expand an empire, Adheera's challenge, and PM Ramika Sen's hard-nosed decisions.",
    storyAnalysis: "The soaring journey of a boy who swore to his mother that he would rule the whole world. Rocky plants his own regime in Narachi and fights Adheera and the government at the same time - a genuinely pulse-pounding saga.",
    performanceAnalysis: "Rocking Star Yash's screen presence rumbles through the entire theatre. His walk, his cigar-swag and his dialogue delivery are a festival for fans. Sanjay Dutt's Adheera is the cruellest, most imposing presence on screen.",
    directionAnalysis: "Prashanth Neel's imagination, cuts and high-speed shots deliver a Hollywood-grade making experience. Every elevation shot lands like a whistle-crack in the theatre.",
    musicAnalysis: "Ravi Basrur's thundershaking background score is the film's muscle. 'Toofan' and 'Sultan' send shivers down the spine.",
    pros: [
      "Yash's unprecedented mass avatar and swagger",
      "Prashanth Neel's visual grandeur and direction",
      "The weight Raveena Tandon and Sanjay Dutt bring to their roles",
      "Climax sequences beyond all imagination",
    ],
    cons: [
      "The punishing sound and rapid cuts may give some viewers a headache",
    ],
    boxOfficeSummary: "Collected over ₹1,250 crore worldwide and carried Kannada pride to the world.",
    publishedAt: "2022-04-15T09:00:00Z",
    author: "Cinema Reviews Desk",
  },
  {
    id: "rev-3",
    movieTitle: "777 Charlie",
    movieTitleEn: "777 Charlie",
    slug: "777-charlie-movie-review",
    rating: 4.6,
    maxRating: 5.0,
    releaseDate: "2022-06-10",
    director: "Kiranraj K",
    producers: ["G.S. Gupta", "Rakshit Shetty (Paramvah Studios)"],
    musicDirector: "Nobin Paul",
    cinematography: "Aravind S. Kashyap",
    cast: [
      { name: "Rakshit Shetty", role: "Dharma" },
      { name: "Charlie (Labrador)", role: "Charlie" },
      { name: "Sangeetha Sringeri", role: "Devika" },
      { name: "Raj B. Shetty", role: "Dr. Ashwin Kumar" },
    ],
    posterImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1600&auto=format&fit=crop",
    trailerYoutubeId: "w3FkF5p1q7k",
    genres: ["Emotional Drama", "Travel", "Comedy"],
    censorRating: "U",
    runtime: "2 hours 44 minutes",
    verdict: "A heart-melting, adorable tale of love - a film everyone must watch!",
    summary: "The story of the unbreakable bond between Dharma, a lonely young man, and Charlie, the pup who walks into his life without warning - a love-and-travel journey.",
    storyAnalysis: "Dharma drifts through life with no purpose, drowning himself in cigarettes and liquor - until Charlie arrives and his whole world changes. The snowbound journey he undertakes all the way to Kashmir to fulfil Charlie's last wish lands straight in the heart.",
    performanceAnalysis: "Rakshit Shetty plays his most delicate emotions with complete ease. But the film's real hero is the canine 'Charlie'. Charlie's eyes and expressions will leave an unbroken stream of tears running down your face.",
    directionAnalysis: "Kiranraj shows extraordinary control in his very first film. Shooting with animals is one of the toughest jobs in filmmaking, and he handles it poetically.",
    musicAnalysis: "Nobin Paul's soulful songs breathe life into the film.",
    pros: [
      "The pure, honest love between Dharma and Charlie",
      "Breathtaking cinematography across Kashmir and the Himalayas",
      "Raj B. Shetty's hilarious, scene-stealing role",
      "A film for animal lovers and families alike",
    ],
    cons: [
      "The emotional stretches of the second half feel a touch slow",
    ],
    boxOfficeSummary: "Earned over ₹105 crore worldwide, succeeding both critically and commercially.",
    publishedAt: "2022-06-11T11:00:00Z",
    author: "Cinema Reviews Desk",
  },
];

export const REVIEWS_SEED: MovieReview[] = [
  ...ALL_RAMAYANA_REVIEWS,
  ...KANNADA_REVIEWS_RAW.map((r) => ({
    language: "en" as const,
    industry: "sandalwood" as const,
    ...r,
  })),
  ...MULTILINGUAL_REVIEWS,
];

const KANNADA_BOX_OFFICE_RAW: BoxOfficeEntry[] = [
  {
    id: "bo-1",
    movieTitle: "K.G.F: Chapter 2",
    movieTitleEn: "K.G.F: Chapter 2",
    slug: "kgf-chapter-2",
    posterImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2022,
    day1Collection: "₹134.5 Cr",
    weekendCollection: "₹402 Cr",
    worldwideCollection: "₹1,250 Cr+",
    budget: "₹100 Cr",
    verdict: "All-Time Blockbuster",
    verdictBadgeColor: "bg-red-600 text-white",
    rank: 1,
    territoryBreakdown: [
      { territory: "Karnataka", collection: "₹180 Cr" },
      { territory: "Hindi Belt", collection: "₹510 Cr" },
      { territory: "Telugu States", collection: "₹150 Cr" },
      { territory: "Tamil Nadu", collection: "₹115 Cr" },
      { territory: "Kerala", collection: "₹68 Cr" },
      { territory: "Overseas", collection: "₹227 Cr" },
    ],
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "bo-2",
    movieTitle: "Kantara",
    movieTitleEn: "Kantara",
    slug: "kantara",
    posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2022,
    day1Collection: "₹4.5 Cr",
    weekendCollection: "₹23 Cr",
    worldwideCollection: "₹450 Cr+",
    budget: "₹16 Cr",
    verdict: "All-Time Blockbuster",
    verdictBadgeColor: "bg-red-600 text-white",
    rank: 2,
    territoryBreakdown: [
      { territory: "Karnataka", collection: "₹175 Cr" },
      { territory: "Hindi Belt", collection: "₹96 Cr" },
      { territory: "Telugu States", collection: "₹65 Cr" },
      { territory: "Tamil Nadu & Kerala", collection: "₹38 Cr" },
      { territory: "Overseas", collection: "₹76 Cr" },
    ],
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "bo-3",
    movieTitle: "K.G.F: Chapter 1",
    movieTitleEn: "K.G.F: Chapter 1",
    slug: "kgf-chapter-1",
    posterImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2018,
    day1Collection: "₹25 Cr",
    weekendCollection: "₹62 Cr",
    worldwideCollection: "₹250 Cr+",
    budget: "₹80 Cr",
    verdict: "Blockbuster",
    verdictBadgeColor: "bg-emerald-600 text-white",
    rank: 3,
    territoryBreakdown: [
      { territory: "Karnataka", collection: "₹135 Cr" },
      { territory: "Hindi Belt", collection: "₹52 Cr" },
      { territory: "Telugu / Tamil", collection: "₹43 Cr" },
      { territory: "Overseas", collection: "₹20 Cr" },
    ],
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "bo-4",
    movieTitle: "Kaatera",
    movieTitleEn: "Kaatera",
    slug: "kaatera",
    posterImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2023,
    day1Collection: "₹16 Cr",
    weekendCollection: "₹48 Cr",
    worldwideCollection: "₹104 Cr+",
    budget: "₹45 Cr",
    verdict: "Super Hit",
    verdictBadgeColor: "bg-amber-600 text-white",
    rank: 4,
    territoryBreakdown: [
      { territory: "Karnataka (single-market release)", collection: "₹98 Cr" },
      { territory: "Overseas & rest of India", collection: "₹6 Cr" },
    ],
    updatedAt: "2026-10-30T10:00:00Z",
  },
  {
    id: "bo-5",
    movieTitle: "777 Charlie",
    movieTitleEn: "777 Charlie",
    slug: "777-charlie",
    posterImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2022,
    day1Collection: "₹6.5 Cr",
    weekendCollection: "₹24 Cr",
    worldwideCollection: "₹105 Cr+",
    budget: "₹20 Cr",
    verdict: "Super Hit",
    verdictBadgeColor: "bg-amber-600 text-white",
    rank: 5,
    territoryBreakdown: [
      { territory: "Karnataka", collection: "₹58 Cr" },
      { territory: "Telugu, Tamil, Hindi", collection: "₹34 Cr" },
      { territory: "Overseas", collection: "₹13 Cr" },
    ],
    updatedAt: "2026-10-30T10:00:00Z",
  },
];

export const BOX_OFFICE_SEED: BoxOfficeEntry[] = [
  ...KANNADA_BOX_OFFICE_RAW.map((b) => ({
    language: "kn" as const,
    industry: "sandalwood" as const,
    ...b,
  })),
  ...MULTILINGUAL_BOX_OFFICE,
];

const KANNADA_OTT_RAW: OttRelease[] = [
  {
    id: "ott-bagheera-netflix",
    movieTitle: "Bagheera",
    movieTitleEn: "Bagheera",
    platform: "Netflix",
    platformBadgeColor: "bg-red-600 text-white",
    releaseDate: "2024-11-21",
    languages: ["Kannada", "Telugu", "Tamil", "Malayalam", "Hindi"],
    genre: "Action Vigilante Thriller",
    posterImage: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop",
    watchUrl: "https://www.netflix.com",
    description: "Hombale Films' gripping superhero-style action saga. Sriimurali in a powerful masked avatar.",
    cast: ["Sriimurali", "Rukmini Vasanth", "Prakash Raj", "Suchendra Prasad"],
    runtime: "158 minutes (2h 38m)",
    productionHouse: "Hombale Films",
    verificationScore: 98,
    verificationSources: ["Netflix India Official", "Hombale Films Press Note", "IMDb Pro"],
  },
  {
    id: "ott-bheema-prime",
    movieTitle: "Bheema",
    movieTitleEn: "Bheema",
    platform: "Prime Video",
    platformBadgeColor: "bg-sky-600 text-white",
    releaseDate: "2024-09-06",
    languages: ["Kannada"],
    genre: "Rugged Action & Social Drama",
    posterImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    watchUrl: "https://www.primevideo.com",
    description: "Duniya Vijay's blazing showdown between Bengaluru's youth and the drug trade.",
    cast: ["Duniya Vijay", "Ashwini", "Achyuth Kumar", "Cockroach Sudhi"],
    runtime: "142 minutes (2h 22m)",
    productionHouse: "Jagadeesh Films",
    verificationScore: 96,
    verificationSources: ["Amazon Prime Video India", "Filmibeat Kannada", "Wikipedia"],
  },
  {
    id: "ott-kps-sunnxt",
    movieTitle: "Krishnam Pranaya Sakhi",
    movieTitleEn: "Krishnam Pranaya Sakhi",
    platform: "Sun NXT",
    platformBadgeColor: "bg-amber-600 text-white",
    releaseDate: "2024-11-29",
    languages: ["Kannada"],
    genre: "Romantic Family Drama",
    posterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
    watchUrl: "https://www.sunnxt.net",
    description: "A chartbusting, song-laden romantic hit starring Golden Star Ganesh and Malavika Nair.",
    cast: ["Ganesh", "Malavika Nair", "Sharanya Shetty", "Sadhu Kokila"],
    runtime: "152 minutes (2h 32m)",
    productionHouse: "Trishul Entertainment",
    verificationScore: 95,
    verificationSources: ["Sun NXT Official", "Udaya TV Broadcast Wire", "Kannada Prabha"],
  },
  {
    id: "ott-ibbani-prime",
    movieTitle: "Ibbani Tabbida Ileyali",
    movieTitleEn: "Ibbani Tabbida Ileyali",
    platform: "Prime Video",
    platformBadgeColor: "bg-sky-600 text-white",
    releaseDate: "2024-11-01",
    languages: ["Kannada", "Telugu", "Tamil", "Malayalam"],
    genre: "Poetic Romance",
    posterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    watchUrl: "https://www.primevideo.com",
    description: "Chandrajith Belliappa's heart-stirring poetic love story, produced by Paramvah Studios.",
    cast: ["Vihan", "Ankita Amar", "Mayuri Nataraj"],
    runtime: "148 minutes (2h 28m)",
    productionHouse: "Paramvah Studios (Rakshit Shetty)",
    verificationScore: 97,
    verificationSources: ["Prime Video Catalog", "Paramvah Studios Official", "The Hindu Cinema"],
  },
  {
    id: "ott-blink-aha",
    movieTitle: "Blink",
    movieTitleEn: "Blink",
    platform: "Aha",
    platformBadgeColor: "bg-orange-600 text-white",
    releaseDate: "2024-05-14",
    languages: ["Kannada", "Telugu"],
    genre: "Time-Travel Sci-Fi Thriller",
    posterImage: "https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=600&auto=format&fit=crop",
    watchUrl: "https://www.aha.video",
    description: "A cult sci-fi film in which Bengaluru theatre artist Apoorva travels through time to crack the mystery of his father's cryptic disappearance.",
    cast: ["Dheekshith Shetty", "Chaithra J Achar", "Gopalkrishna Deshpande"],
    runtime: "132 minutes (2h 12m)",
    productionHouse: "Janani Pictures",
    verificationScore: 99,
    verificationSources: ["Aha Video Streaming", "IMDb Confirmed", "Deccan Herald Review"],
  },
  {
    id: "ott-kaatera-zee5",
    movieTitle: "Kaatera",
    movieTitleEn: "Kaatera",
    platform: "ZEE5",
    platformBadgeColor: "bg-purple-600 text-white",
    releaseDate: "2024-02-09",
    languages: ["Kannada"],
    genre: "Farmer-Rights Period Action",
    posterImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop",
    watchUrl: "https://www.zee5.com",
    description: "Challenging Star Darshan's blockbuster, set against the 1970s law declaring the cultivator the true owner of the land.",
    cast: ["Darshan", "Aaradhana Ram", "Jagapathi Babu", "Kumar Govind"],
    runtime: "183 minutes (3h 03m)",
    productionHouse: "Rockline Entertainments",
    verificationScore: 99,
    verificationSources: ["ZEE5 Global Stream", "Rockline Productions", "Zee Kannada Wire"],
  },
  {
    id: "ott-toby-sonyliv",
    movieTitle: "Toby",
    movieTitleEn: "Toby",
    platform: "SonyLIV",
    platformBadgeColor: "bg-indigo-600 text-white",
    releaseDate: "2023-12-22",
    languages: ["Kannada", "Telugu", "Tamil", "Malayalam", "Hindi"],
    genre: "Intense Action-Emotional Drama",
    posterImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    watchUrl: "https://www.sonyliv.com",
    description: "Raj B. Shetty's tour de force of raw emotion, directed by Basil Alchalakkal and set in the Uttara Kannada district.",
    cast: ["Raj B. Shetty", "Chaithra J Achar", "Samyukta Hornad", "Gopalkrishna Deshpande"],
    runtime: "154 minutes (2h 34m)",
    productionHouse: "Lighter Buddha Films",
    verificationScore: 98,
    verificationSources: ["SonyLIV Exclusive", "Lighter Buddha Wire", "The News Minute"],
  },
];

export const OTT_RELEASES_SEED: OttRelease[] = [
  ...KANNADA_OTT_RAW.map((o) => ({
    language: "kn" as const,
    industry: "sandalwood" as const,
    ...o,
  })),
  ...MULTILINGUAL_OTT,
];

const KANNADA_VIDEOS_RAW: VideoItem[] = [
  {
    id: "vid-1",
    title: "Kantara Chapter 1 - Official First Glimpse | Rishab Shetty | Hombale Films",
    category: "Teaser",
    youtubeId: "8MR9Ohbv3KM",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    duration: "1:45",
    views: "25M views",
    publishedAt: "2026-10-25T10:00:00Z",
    featured: true,
  },
  {
    id: "vid-2",
    title: "Toxic - Title Announcement Video | Rocking Star Yash | Geetu Mohandas",
    category: "Teaser",
    youtubeId: "JKa05nyUmuQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
    duration: "1:30",
    views: "42M views",
    publishedAt: "2026-10-20T12:00:00Z",
    featured: true,
  },
  {
    id: "vid-3",
    title: "Bagheera - Official Trailer | Sriimurali, Prashanth Neel",
    category: "Trailer",
    youtubeId: "w3FkF5p1q7k",
    thumbnailUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    duration: "2:52",
    views: "18M views",
    publishedAt: "2026-10-18T08:00:00Z",
    featured: false,
  },
  {
    id: "vid-4",
    title: "Dwaapa Dhaatu... Super Hit Video Song | Krishnam Pranaya Sakhi | Ganesh",
    category: "Songs",
    youtubeId: "JKa05nyUmuQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
    duration: "3:40",
    views: "55M views",
    publishedAt: "2026-10-10T14:00:00Z",
    featured: false,
  },
  {
    id: "vid-5",
    title: "Kiccha Sudeep Exclusive Interview: 'Max' and 28 Years of Cinema!",
    category: "Interview",
    youtubeId: "8MR9Ohbv3KM",
    thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
    duration: "24:15",
    views: "3.2M views",
    publishedAt: "2026-10-28T16:00:00Z",
    featured: false,
  },
];

export const VIDEOS_SEED: VideoItem[] = [
  ...KANNADA_VIDEOS_RAW.map((v) => ({
    language: "en" as const,
    industry: "sandalwood" as const,
    ...v,
  })),
  ...MULTILINGUAL_VIDEOS,
];

export const GALLERIES_SEED: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Rocking Star Yash and Radhika Pandit's gorgeous Diwali celebration photos",
    slug: "yash-radhika-pandit-diwali-photos",
    coverImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop",
    celebrityName: "Yash & Radhika Pandit",
    category: "Actors",
    photoCount: 8,
    photos: [
      { url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop", caption: "The star couple celebrating Diwali with the whole family" },
      { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop", caption: "The Rocking Star in full traditional regalia" },
      { url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop", caption: "Radhika Pandit glowing in an elegant silk saree" },
    ],
    publishedAt: "2026-10-30T15:00:00Z",
    language: "en",
    industry: "sandalwood",
  },
  {
    id: "gal-2",
    title: "Actress Rukmini Vasanth's glamorous photoshoot - fans can't keep calm!",
    slug: "rukmini-vasanth-latest-photoshoot",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    celebrityName: "Rukmini Vasanth",
    category: "Actresses",
    photoCount: 12,
    photos: [
      { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop", caption: "Sapta Sagaradaache's Priya in a classy look" },
      { url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop", caption: "Natural beauty Rukmini's gentle smile" },
    ],
    publishedAt: "2026-10-29T11:00:00Z",
    language: "en",
    industry: "sandalwood",
  },
  {
    id: "gal-3",
    title: "SIIMA Awards: Sandalwood stars shining at the grand celebration",
    slug: "siima-awards-kannada-celebrities-gallery",
    coverImage: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=800&auto=format&fit=crop",
    celebrityName: "Sandalwood Stars",
    category: "Cinema Event",
    photoCount: 16,
    photos: [
      { url: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1200&auto=format&fit=crop", caption: "Sandalwood celebrities on the red carpet" },
    ],
    publishedAt: "2026-10-27T14:00:00Z",
    language: "en",
    industry: "sandalwood",
  },
  ...MULTILINGUAL_GALLERIES,
];

export const COMMENTS_SEED: Comment[] = [
  {
    id: "com-1",
    articleId: "art-1",
    authorName: "Manjunath Gowda, Mandya",
    content: "All of Karnataka is waiting for Kantara Chapter 1. Rishab Shetty has introduced the culture of our soil to the world!",
    createdAt: "2026-10-31T09:00:00Z",
    likes: 42,
    isApproved: true,
  },
  {
    id: "com-2",
    articleId: "art-1",
    authorName: "Ramesh Kumar, Bengaluru",
    content: "'Varaha Roopam' still gives me goosebumps. Chapter 1 is going to smash every record in its path.",
    createdAt: "2026-10-31T09:15:00Z",
    likes: 19,
    isApproved: true,
  },
  {
    id: "com-3",
    articleId: "art-2",
    authorName: "Kiran Raj, Mysuru",
    content: "I can't wait to see Yash's Toxic look. After KGF, another global hit is guaranteed!",
    createdAt: "2026-10-31T08:00:00Z",
    likes: 31,
    isApproved: true,
  },
];

export const ADS_SEED: AdSpot[] = [
  {
    id: "ad-1",
    placement: "header_leaderboard",
    title: "Diwali Cinema Mega Offer - Ticket Booking",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    targetUrl: "#",
    isActive: true,
    altText: "Book movie tickets now and grab 50% off",
  },
  {
    id: "ad-2",
    placement: "sidebar_rectangle",
    title: "Download the EXTRA-SAAGA App",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop",
    targetUrl: "#",
    isActive: true,
    altText: "The EXTRA-SAAGA mobile app - get live notifications",
  },
  {
    id: "ad-3",
    placement: "in_article",
    title: "Hombale Films' New Project Auditions",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
    targetUrl: "#",
    isActive: true,
    altText: "Casting call for new actors and actresses",
  },
  {
    id: "ad-4",
    placement: "footer_banner",
    title: "Kannada OTT Special Subscription",
    imageUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=1200&auto=format&fit=crop",
    targetUrl: "#",
    isActive: true,
    altText: "Feast on Kannada films all year long",
  },
];

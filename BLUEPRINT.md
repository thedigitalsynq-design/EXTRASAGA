# BLUEPRINT.md — System Architecture & Technical Blueprint

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  - Next.js 14 App Router (React 18 + TypeScript)                                 |
|  - Pure Tailwind CSS (Zero external UI libraries like shadcn/ui)                 |
|  - Native Script Typography:                                                      |
|      * Tamil: Catamaran (400-900)                                                |
|      * Kannada: Hubballi                                                          |
|      * Telugu: Ramabhadra                                                         |
|      * Malayalam: Chilanka                                                        |
|      * Hindi: Khand                                                               |
|      * English: DM Sans                                                           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              EDGE SECURITY LAYER                                  |
|  - middleware.ts: Strict-Transport-Security, X-Frame-Options: SAMEORIGIN,         |
|    X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy, CSP      |
|  - rateLimit.ts: In-Memory Sliding Window Rate Limiter (Brute-force & DoS defense) |
|  - authGuard.ts: verifyAdminToken (HMAC-SHA256, 24h TTL, timingSafeEqual)         |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             APPLICATION ROUTE LAYER                               |
|  - / (Homepage: 4-Zone Editorial Layout)                                          |
|  - /news/[slug] (Article Detail + Schema.org NewsArticle markup)                  |
|  - /reviews/[slug] (Editorial Review + Ramayana Magnum Opus View)                 |
|  - /movies & /movies/[slug] (Dedicated Movie Hub + Dynamic Statuses)              |
|  - /category/[slug] (20 Editorial Categories + 12 Nav Items)                      |
|  - /box-office & /ott (Dedicated Vertical Hubs)                                   |
|  - /live (Real-Time Live Wire Updates)                                            |
|  - /archive (Permanent SEO Article Archive)                                       |
|  - /admin (Admin Portal: Articles, Movies, RSS Sources, Sync)                     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                               DATA & SERVICE LAYER                                |
|  - DataService (Dual Backend: Supabase Client & In-Memory Fallback Seed Engine)   |
|  - Cinema Engine (cinemaDateUtils.ts: Dynamic server-time math in Asia/Kolkata)   |
|  - Ingestion Engine (RSS Fetcher, Feed Parser, De-duplicator, Auto-Categorizer)   |
|  - Language Engine (LanguageContext, translations.ts, multilingualSeeds.ts)       |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              PERSISTENCE & STORAGE                                |
|  - Supabase PostgreSQL: articles, movies, box_office, ott_releases, live_updates, |
|    rss_sources, editorial_reviews, audit_logs                                    |
|  - Local File System / Memory Store: Fallback operational resilience              |
+-----------------------------------------------------------------------------------+
```

---

## 2. Homepage 4-Zone Architectural Layout
The homepage (`src/app/page.tsx`) uses a structured, magazine-grade hierarchy:

### Zone 1: Frontpage Hero Showcase
- **Lead Hero Article** (Col 8) with high-impact cinematic aspect ratio and gradient vignette.
- **Stacked Secondary Stories** (Col 4) featuring real-time reading times, view counts, and category badges.

### Zone 2: Cinema Release Center
- **In Theatres** tab: Movies released between today and 30 days ago.
- **Upcoming Releases** tab: Movies releasing today, tomorrow, or in 7, 30, 60, and 90 days.
- Filter chips for Kannada, Telugu, Tamil, Malayalam, Hindi, and English cinema.

### Zone 3: Core 2-Column Editorial Magazine
- **8-Column Editorial Stream**:
  1. *Ramayana Part 1 Magnum Opus Spotlight*: Reverent showcase badge, synopsis, and multilingual editorial review.
  2. *Latest Cinema News Feed*: Infinite-scroll/load-more cards with view metrics, dates, and author attribution.
  3. *OTT & Streaming Radar*: Platform tags (Netflix, Prime Video, ZEE5, Hotstar, JioCinema).
- **4-Column Sticky Intelligence Rail**:
  1. *Real-Time Live Cinema Wire*: Auto-refreshing 30s countdown updates with category filtering.
  2. *Top 5 Trending Stories*: Numbered 01–05 most-read velocity rankers.
  3. *Compact Box Office Leaderboard*: Localized gross, opening weekend, and worldwide metrics.
  4. *Targeted Sponsor Rectangle Ad*: (300x250 standard format).

### Zone 4: Visual Media Pavilion
- **Trailers & Official Videos Lounge**: 16:9 responsive embeds with YouTube modal player.
- **Celebrity Red Carpet & Photo Gallery**: High-resolution lightbox photo collections.

---

## 3. Directory Layout

```
cinijaatre/
├── public/                 # Static assets & logos
├── src/
│   ├── app/                # Next.js 14 App Router routes & API endpoints
│   │   ├── admin/          # Admin Portal & authentication
│   │   ├── api/            # REST API endpoints (articles, movies, ingest, cron, live)
│   │   ├── archive/        # Permanent archive viewer
│   │   ├── box-office/     # Box office leaderboard
│   │   ├── category/       # Dynamic category pages
│   │   ├── live/           # Live news wire
│   │   ├── movies/         # Cinema release center & movie detail pages
│   │   ├── news/           # News article reader
│   │   ├── ott/            # Streaming calendar
│   │   ├── reviews/        # Review viewer
│   │   ├── search/         # Full-text multi-script search
│   │   ├── globals.css     # Design tokens & font declarations
│   │   ├── layout.tsx      # Root layout, Google Fonts, and Providers
│   │   └── page.tsx        # Structured 4-Zone homepage
│   ├── components/         # Reusable React components (zero-shadcn)
│   ├── context/            # LanguageContext & global states
│   ├── data/               # Seed datasets, mock sources, Ramayana review
│   ├── lib/                # Core utilities, rate limiting, security, RSS ingest
│   └── types/              # TypeScript interfaces and domain models
├── supabase/               # Schema definitions and migrations
├── tests/                  # 16 Vitest test suites (127+ unit & integration tests)
├── vercel.json             # Vercel deployment configuration & cron definitions
└── tailwind.config.ts      # Custom Tailwind theme tokens
```


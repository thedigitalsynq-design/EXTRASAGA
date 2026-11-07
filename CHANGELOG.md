# CHANGELOG.md — Release History & Version Records

All notable changes to the **FILMY GARAGE** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.0] - 2026-11-04

### Added
- **Dedicated Reviews Page Route (`/reviews`)**:
  - Implemented standalone reviews destination ([`src/app/reviews/page.tsx`](file:///c:/Users/email/OneDrive/Desktop/ALLINSYNQ/cinijaatre/src/app/reviews/page.tsx)) with dual-axis ratings, verified reviews count badge, and sidebar integration.
- **Seeded Category Content Across All 12 Nav Items**:
  - Added dedicated, authentic editorial articles in Kannada, Telugu, Tamil, Malayalam, Hindi, and English for previously unseeded categories (`interviews`, `gossip`, `television`, `celebrity`, `events`, `actors`, `bollywood`, `hollywood`).
- **Data Segregation Test Suite (`tests/data-segregation.test.ts`)**:
  - 10 comprehensive tests validating zero cross-category contamination, strict language isolation, and proper empty-state handling.
- **Design Reference Implementations (Bento, Wizard, Story Stacks, Narrative Roadmap)**:
  - `EditorialBentoShowcase.tsx`: Asymmetric 4-card bento grid inspired by high-end editorial standards, featuring 100% spoiler-free audit metrics, zero clickbait pledge, and verified critique credentials.
  - `CinephileDiscoveryModal.tsx`: Multi-step interactive questionnaire modal featuring segmented progress indicator, radio selection options, back/next controls, and dynamic movie vibe matching.
  - `EditorialStoryDeck.tsx`: Overlapping fanned story cards with organic rotation angles, publication timestamps, and interactive deck depth.
  - `CinemaJourneyTimeline.tsx`: Continuous cinematic journey timeline connecting script conception, live sets, teaser drop, censor clearance, Day-1 reviews, and archival OTT streaming with handwritten editorial notes.
  - `EditorialTestimonials.tsx`: 4-card community acclaim showcase highlighting verified filmmakers, critics, and trade analysts with pagination controls.
- **Regional Typography Matrix Update**:
  - Tamil font upgraded to `Baloo Thambi 2`.
  - Telugu font upgraded to `Baloo Tammudu 2`.

### Changed
- **Fixed Strict Data Segregation Between Pages & Categories**:
  - Eliminated the leaky `if (matches.length > 0) result = matches` fallback in `DataService.getArticles` that caused unpopulated categories to dump all site articles.
  - Refactored [`src/app/category/[slug]/page.tsx`](file:///c:/Users/email/OneDrive/Desktop/ALLINSYNQ/cinijaatre/src/app/category/[slug]/page.tsx) so specialized pages (`reviews`, `box-office`, `ott`, `videos`, `gallery`) render their dedicated showcases and do not append unrelated general news articles below them.
  - Enforced strict language segregation so filtering for one language never leaks articles from another.
- **Removed Outdated 'No.1' Tagline Claims Across All 6 Languages**:
  - Replaced promotional portal claims with independent journalism and intelligence taglines in Kannada, Telugu, Tamil, Malayalam, Hindi, and English.
- **Latency & Transition Polish**:
  - Replaced sluggish 500ms–700ms animations with snappy 180ms–250ms Apple/Linear deceleration curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Eliminated GPU-heavy `blur-2xl` and `blur-3xl` scroll re-rasterization bottlenecks.
  - Added `@media (prefers-reduced-motion: reduce)` accessibility compliance.

---

## [1.3.0] - 2026-11-03

### Added
- **Deep Crimson Navigation Bar (`#A92732`)**: Standardized 12-item navigation bar (`Trending Today`, `Home`, `News`, `Reviews`, `Television`, `Celebrity`, `Movies`, `Interviews`, `Gossips`, `Photos`, `Videos`, `Events`).
- **Active Tab Visual Indicator**: Dark crimson block (`#7D1B24`) with an amber/orange bottom indicator border.
- **Production Security Suite**:
  - Edge security middleware enforcing HSTS, CSP, X-Frame-Options (`SAMEORIGIN`), X-Content-Type-Options (`nosniff`), Referrer-Policy, and Permissions-Policy.
  - In-memory sliding-window rate limiting on login (5/15min), writes (30/min), and reads (120/min).
  - Admin token authentication with HMAC-SHA256, 24-hour expiration, and `crypto.timingSafeEqual`.
  - Input sanitization (`sanitizeInput`) against XSS and strict image domain validation.
  - Protected cron routes with `CRON_SECRET` validation.
- **Catamaran Tamil Font**: Integrated Google Font `Catamaran` (weights 400 through 900) for high-contrast Tamil script legibility.
- **Structured 4-Zone Editorial Layout**: Re-organized homepage into Frontpage Hero Showcase, Cinema Release Center, Core 2-Column Editorial Magazine, and Visual Media Pavilion.

### Changed
- Removed redundant header and sub-header taglines across all languages for a cleaner, modern look.
- Set `optimizeFonts: false` in `next.config.mjs` to eliminate build-time font fetching hangs and webpack snapshot errors.

---

## [1.2.0] - 2026-11-01

### Added
- **Multilingual Ramayana Part 1 Spotlight Review**: Dedicated frontpage feature across Kannada, Telugu, Tamil, Malayalam, Hindi, and English with zero commercial star rating badge.
- **Real-Time Live Wire Updates**: Auto-refreshing 30-second live news updates ticker with category filters and countdown indicators.
- **Dedicated Cinema Releases Module (`/movies`)**: Dynamic server-time math in `Asia/Kolkata` timezone with filtering for in-theatres (last 30 days) and upcoming (today, tomorrow, 7, 30, 60, 90 days).
- **Permanent Article Archive (`/archive`)**: Automated archiving preserving canonical URLs, SEO titles, and publication history.

---

## [1.1.0] - 2026-10-31

### Added
- **Automated RSS Ingestion Pipeline**: Support for external publisher RSS/Atom feeds with de-duplication and auto-categorization.
- **Admin Approval Queue**: Optional toggle allowing administrators to approve imported news before public listing.
- **Publisher Attribution**: Visible source tags and canonical linkouts to original accredited publishers.
- **Comprehensive Vitest Suite**: 16 test files covering normalization, categorization, adapters, security guards, and release math.

---

## [1.0.0] - 2026-10-30

### Initial Release
- Initial Next.js 14 App Router project setup with Tailwind CSS.
- Sandalwood entertainment portal baseline with articles, reviews, box office leaderboards, and OTT releases.
- Supabase PostgreSQL schema with Row-Level Security policies.


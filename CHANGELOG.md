# CHANGELOG.md — Release History & Version Records

All notable changes to the **EXTRASAGA** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-11-07 — The House Full Press Edition

**Full edition change:** from After-Dark / Emission v3.0 to **HOUSE FULL PRESS (Fandom-Webzine Brutalism, v4.0)** — `docs/DESIGN-SYSTEM.md`.

### The Reimagining
- The entire visual language is rebuilt as a printed fanzine: newsprint paper canvas (`#F4EFE2`), warm ink type (`#17140F`), loud poster inks (press red `#E03A2F`, electric violet `#4F2BEF`, bulb gold `#F0B429`), hard offset shadows, sticker chips, ticket-stub CTAs, stamp badges, halftone media plates and marquee strips. Glow, glass, gradients and rounded bloat are retired.
- **Press ribbon + poster masthead**: header rebuilt — ink utility ribbon (native-script date, red LIVE plate, gold admin sticker), giant Archivo Black `EXTRASAGA` wordmark with rotated press block, ink-tab genre navigation with active red brick, fan-poster mobile drawer.
- **Breaking ticker** printed as a rotated red `BREAKING` plate on an ink strip; **hero** rebuilt as poster-cut cards with halftone print overlays and caption plates; **NOW SHOWING** release board rebuilt as a ticket-stub tab console with ink-poster movie cards (confirmed/tentative stamps retained); **footer** reprinted as the ink colophon page.
- Legacy design eras fully deprecated: Jade Horizon raw hexes (`#288760` family) remapped to the press palette across all components and routes; `bg-white` wrappers migrated to `bg-sheet`.
- Canonical design doc rewritten to v4 with a migration ledger and token map (`docs/DESIGN-SYSTEM.md`); PRD §3.1, PROJECT.md and CHANGELOG rebranded to EXTRASAGA / House Full Press.

### Preserved Without Dilution (the agenda)
- All six industries & six native script stacks, `data-lang` switching untouched.
- Asia/Kolkata release engine: Released Today / Tomorrow / In Theatres (30-day window) / Next 7-30-60-90 / permanent Archive.
- Ramayana Part 1 reverence rule drives unchanged: no star rating, marquee-gold badge only.
- House Full Press Edition keeps every original traffic rule intact: trusted RSS ingestion, publisher attribution, approval workflow, twelve-slot navigation, CSP/HSTS, HMAC-SHA256 admin tokens, sliding-window rate limits, `CRON_SECRET` gates, zero `shadcn`.
- 181/181 Vitest tests green; design-reference suite updated to assert the v4 press era.


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


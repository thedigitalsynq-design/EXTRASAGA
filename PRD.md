# PRD.md — Product Requirements Document

## 1. Product Overview
**EXTRASAGA** is a unified cinema entertainment news and release intelligence platform that brings together all Indian film industries—Bollywood, Tollywood, Sandalwood, Kollywood, Mollywood, and regional cinema—under one comprehensive English-language destination.

Previously fragmented across separate regional toggles and language versions, the platform now unifies all coverage under a single website experience with consistent navigation, English-only content, and flexible inline industry filters.

**Copy Voice Charter (v3.0.0)**: Information-first headlines capped at ~12 words; receipts-backed box office reporting; zero-fake tea and zero clickbait lies; numbers and verdicts always dead-serious. Visual design authority remains the House Full Press v4 system (`docs/DESIGN-SYSTEM.md`) — this edition changes words, not pixels.

---

## 2. Key Problem Statements & Solutions
1. **Fragmented Regional Coverage**:
   - *Problem*: Film enthusiasts often jump across multiple regional portals to track Kannada, Telugu, Tamil, and Malayalam cinema news.
   - *Solution*: One English reporting desk covering all industries — films keep their language identity (`kn`, `te`, `ta`, `ml`, `hi`, `en` as film facts), while every story, label and review reads naturally in English.
2. **Outdated Release Schedules**:
   - *Problem*: Static blogs forget to update release statuses once a movie has hit theatres.
   - *Solution*: Automated date math in `Asia/Kolkata` timezone that recalculates daily, moving titles from upcoming to active theatrical runs for 30 days, then to permanent archives.
3. **Low Quality & Fake News**:
   - *Problem*: Unverified clickbait damages reader credibility.
   - *Solution*: RSS feed validation against accredited publishers, publisher attribution, original canonical URLs, and an optional editorial approval workflow. The After-Dark editorial voice enforces this in copy: no hype inflation, no invented tea, verdicts that hold up under receipts.

---

## 3. Detailed Feature Specifications

### 3.1. House Full Press Navigation Bar
- **Brand Accent Colors**: Poster Red `#E03A2F` (primary), Print Violet `#4F2BEF`, Bulb Gold `#F0B429`, on newsprint paper `#F4EFE2` with ink `#17140F` rules (v4.0 "House Full Press" edition, see `docs/DESIGN-SYSTEM.md`).
- **Exact 12 Item Menu** (naming authority stays with `MAIN_NAV_ITEMS`; slots never move):
  1. `[Trending Today]` (Sticker Button)
  2. `Home`
  3. `News`
  4. `Reviews`
  5. `Television`
  6. `Celebrity`
  7. `Movies`
  8. `Interviews`
  9. `Gossips` (Active tab: filled ink block, hard offset shadow, press-red underline plate)
  10. `Photos`
  11. `Videos`
  12. `Events`
- **English-Only Unified Platform**: Single navigation structure and design system across the entire site. Regional language toggles and industry switches are removed in favor of a cohesive, English-first trade journalism platform covering all Indian film industries with inline browsing filters.

### 3.2. Automatic Date-Based Cinema Engine
- **Server Time Source**: `Intl.DateTimeFormat` configured with timezone `Asia/Kolkata`.
- **Dynamic Release Buckets**:
  - *Released Today*: `release_date == today`
  - *Releasing Tomorrow*: `release_date == today + 1`
  - *In Theatres*: `today - 30 days <= release_date <= today`
  - *Next 7 Days*: `today < release_date <= today + 7`
  - *Next 30 Days*: `today < release_date <= today + 30`
  - *Next 60 Days*: `today < release_date <= today + 60`
  - *Next 90 Days*: `today < release_date <= today + 90`
- **Archive Migration**: Articles and movie profiles older than 30 days remain permanently preserved with their original canonical URLs and SEO tags.

### 3.3. Ramayana Part 1 Magnum Opus Feature
- Dedicated presentation for Nitesh Tiwari's *Ramayana Part 1* (starring Yash as Ravana, Ranbir Kapoor as Lord Rama, Sai Pallavi as Sita).
- **Reverence Rule**: Zero commercial star rating (`4.8/5` or `5/5` replaced with a gold/amber reverent badge).
- Editorial review articles for every industry desk, published in English (film-language identity preserved as data, e.g. a Tamil film is tagged `ta`).
- **After-Dark Reverence Addendum (v3.0.0)**: the review prose stays reverent, poetic and serious — no meme discourse, no hype-speak, and the closing line `NO RATINGS, ONLY RESPECT!` is sacrosanct.

### 3.4. Editorial Admin Portal & Content Workflows
- **Authentication**: Salted SHA-256 hashed password with HMAC-SHA256 session tokens.
- **Brute Force Protection**: Max 5 failed attempts per 15-minute sliding window.
- **Capabilities**:
  - Add, edit, delete, and publish articles and movie release profiles.
  - Mark release dates as Confirmed or Tentative.
  - Approve or reject RSS imported news articles.
  - Toggle RSS ingestion feed sources and trigger manual syncs.

---

## 4. Acceptance Criteria
- [x] Zero dependency on `shadcn/ui`; clean, modular Tailwind CSS.
- [x] The English edition renders site-wide with the DM Sans / Space Grotesk / Archivo Black type system (per-language scripts retired with the edition axis).
- [x] Tamil utilizes Google Font `Catamaran` (weights 400 through 900).
- [x] All mutating API endpoints require valid Bearer or Cookie admin tokens.
- [x] All scheduled sync routes validate `CRON_SECRET`.
- [x] 100% of the Vitest test suite passes with 0 failures.


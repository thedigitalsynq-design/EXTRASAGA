# PRD.md — Product Requirements Document

## 1. Product Overview
**FILMY GARAGE** is an all-in-one cinema entertainment news and release intelligence platform that bridges coverage across Sandalwood, Tollywood, Kollywood, Mollywood, Bollywood, and Hollywood.

---

## 2. Key Problem Statements & Solutions
1. **Fragmented Regional Coverage**:
   - *Problem*: Film enthusiasts often jump across multiple regional portals to track Kannada, Telugu, Tamil, and Malayalam cinema news.
   - *Solution*: A unified portal with native multi-industry language switching (`kn`, `te`, `ta`, `ml`, `hi`, `en`) featuring curated fonts and native dictionaries.
2. **Outdated Release Schedules**:
   - *Problem*: Static blogs forget to update release statuses once a movie has hit theatres.
   - *Solution*: Automated date math in `Asia/Kolkata` timezone that recalculates daily, moving titles from upcoming to active theatrical runs for 30 days, then to permanent archives.
3. **Low Quality & Fake News**:
   - *Problem*: Unverified clickbait damages reader credibility.
   - *Solution*: RSS feed validation against accredited publishers, publisher attribution, original canonical URLs, and an optional editorial approval workflow.

---

## 3. Detailed Feature Specifications

### 3.1. Deep Crimson Navigation Bar
- **Brand Accent Color**: Hex `#A92732` (Deep Crimson Red).
- **Exact 12 Item Menu**:
  1. `[Trending Today]` (Pill Button)
  2. `Home`
  3. `News`
  4. `Reviews`
  5. `Television`
  6. `Celebrity`
  7. `Movies`
  8. `Interviews`
  9. `Gossips` (Active tab highlighted with `#7D1B24` background and amber-400 bottom border)
  10. `Photos`
  11. `Videos`
  12. `Events`
- **Dynamic Localization**: Menu labels auto-translate into the selected regional script.

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
- Full native language review articles across Kannada, Telugu, Tamil, Malayalam, Hindi, and English.

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
- [x] All 6 languages render in their official native scripts without Unicode font breakage.
- [x] Tamil utilizes Google Font `Catamaran` (weights 400 through 900).
- [x] All mutating API endpoints require valid Bearer or Cookie admin tokens.
- [x] All scheduled sync routes validate `CRON_SECRET`.
- [x] 100% of the Vitest test suite passes with 0 failures.


# PROJECT.md — EXTRASAGA

## 1. Executive Summary
**EXTRASAGA** is the unified front page of Indian cinema fandom — a single, comprehensive English-language entertainment platform that brings together all Indian film industries under one destination:
- **Bollywood** (Hindi)
- **Tollywood** (Telugu)
- **Sandalwood** (Kannada)
- **Kollywood** (Tamil)
- **Mollywood** (Malayalam)
- **Regional & Global Cinema** (Punjabi, Bengali, Hollywood)

All regional industry toggle switches have been retired in favor of one unified website experience. Movies, celebrity profiles, news, reviews, interviews, and box office telemetry from every industry are presented together in English, with dedicated inline filters to browse by industry wherever required.

---

## 2. Core Vision & Objectives
1. **Multi-Industry Authenticity**: Deliver culturally respectful, English-language journalism across all major South and North Indian film hubs — film titles, personal names and film-language tags stay faithful to the source while every story reads naturally in English.
2. **Automated Cinema Engine**: Eliminate manual release tracking via a dynamic, timezone-aware (`Asia/Kolkata`) server engine calculating movies in theatres (last 30 days), releasing today/tomorrow, and upcoming in 7/30/60/90 days.
3. **Editorial Integrity & Attribution**: Ingest real entertainment news from accredited RSS and publisher feeds, enforcing publisher attribution, source links, zero fake news, and optional editorial approval workflows.
4. **Reverence for Milestone Cinema**: Feature landmark cultural epics—such as the *Ramayana Part 1* magnum opus review—with reverent badge presentation, comprehensive artistic breakdowns, and zero commercial star-rating reductions. After-Dark prose for this coverage is reverent and poetic, never meme-flavored.
5. **Production-Grade Security**: Enforce defense-in-depth protection including Edge security headers, strict Content Security Policy (CSP), sliding-window rate limiting, HMAC-SHA256 authenticated admin endpoints, and constant-time string comparison.

---

## 3. Target Audience & Personas
- **Cinephiles & Moviegoers**: Seeking verified release dates, showtimes, trailer releases, and unbiased critical reviews.
- **Industry Professionals**: Producers, distributors, and critics following box office metrics, overseas collections, and trade verdicts.
- **Multi-lingual Indian Diaspora & Global Cinephiles**: Audiences worldwide who follow regional cinema — Sandalwood to Mollywood — and prefer one English reporting desk that covers every industry without machine-translated artifacts.
- **Editorial Staff**: Journalists and content administrators managing scoops, interviews, photo galleries, and breaking live wire coverage.

---

## 4. Key Differentiators
| Feature | Traditional Entertainment Sites | EXTRASAGA |
| :--- | :--- | :--- |
| **Styling & UI** | Cluttered banners, intrusive ads, slow load times | House Full Press fanzine layout — newsprint paper canvas, hard ink rules, poster inks, zero-dependency Tailwind CSS |
| **Multilingual Support** | Basic Google Translate widgets | One English reporting desk covering all six industries; films keep language identity as a data fact (`Movie.language`) |
| **Release Tracking** | Static manual tables prone to obsolescence | Fully dynamic date math based on server time (`Asia/Kolkata`), automatic promotion to In Theatres |
| **Security Posture** | Vulnerable login forms, open cron routes | Edge Middleware, Strict CSP, HMAC-SHA256 tokens, timingSafeEqual, sliding window rate limits |
| **Editorial Control** | Unregulated imports or purely manual entry | Dual pipeline: Instant manual authoring + RSS Ingestion with auto/pending approval queue |
| **Copy Voice** | Clickbait headlines, recycled agency blurbs, hype-spun numbers | After-Dark film-brain journalism (v3.0.0): information-first headlines (~12 words), receipts-backed box office, zero-fake tea, dead-serious verdicts |


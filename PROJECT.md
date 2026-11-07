# PROJECT.md — EXTRASAGA (ಎಕ್ಸ್ಟ್ರಾಸಾಗ)

## 1. Executive Summary
**EXTRASAGA** is the front page of Indian cinema fandom — a high-performance entertainment media press that reports in real time across six major film industries:
- **Sandalwood** (Kannada)
- **Tollywood** (Telugu)
- **Kollywood** (Tamil)
- **Mollywood** (Malayalam)
- **Bollywood** (Hindi)
- **Hollywood** (English)

The platform unifies live breaking news feeds, automatic date-driven theatrical releases, editorial movie reviews, box office receipts, OTT release radars, video trailers, and celebrity photo galleries in an authentic native script experience for each language — printed daily in the House Full Press fanzine design language (v4.0, see `docs/DESIGN-SYSTEM.md`).

---

## 2. Core Vision & Objectives
1. **Multi-Industry Authenticity**: Deliver culturally respectful, native script journalism for all major South and North Indian film hubs without machine-translated artifacts.
2. **Automated Cinema Engine**: Eliminate manual release tracking via a dynamic, timezone-aware (`Asia/Kolkata`) server engine calculating movies in theatres (last 30 days), releasing today/tomorrow, and upcoming in 7/30/60/90 days.
3. **Editorial Integrity & Attribution**: Ingest real entertainment news from accredited RSS and publisher feeds, enforcing publisher attribution, source links, zero fake news, and optional editorial approval workflows.
4. **Reverence for Milestone Cinema**: Feature landmark cultural epics—such as the *Ramayana Part 1* magnum opus review—with reverent badge presentation, comprehensive artistic breakdowns, and zero commercial star-rating reductions.
5. **Production-Grade Security**: Enforce defense-in-depth protection including Edge security headers, strict Content Security Policy (CSP), sliding-window rate limiting, HMAC-SHA256 authenticated admin endpoints, and constant-time string comparison.

---

## 3. Target Audience & Personas
- **Cinephiles & Moviegoers**: Seeking verified release dates, showtimes, trailer releases, and unbiased critical reviews.
- **Industry Professionals**: Producers, distributors, and critics following box office metrics, overseas collections, and trade verdicts.
- **Multi-lingual Indian Diaspora**: Global audiences who consume regional cinema in Kannada, Telugu, Tamil, Malayalam, Hindi, or English.
- **Editorial Staff**: Journalists and content administrators managing scoops, interviews, photo galleries, and breaking live wire coverage.

---

## 4. Key Differentiators
| Feature | Traditional Entertainment Sites | EXTRASAGA |
| :--- | :--- | :--- |
| **Styling & UI** | Cluttered banners, intrusive ads, slow load times | House Full Press fanzine layout — newsprint paper canvas, hard ink rules, poster inks, zero-dependency Tailwind CSS |
| **Multilingual Support** | Basic Google Translate widgets | Native script typography (Catamaran, Hubballi, Ramabhadra, Khand, Chilanka), custom dictionaries, localized URLs |
| **Release Tracking** | Static manual tables prone to obsolescence | Fully dynamic date math based on server time (`Asia/Kolkata`), automatic promotion to In Theatres |
| **Security Posture** | Vulnerable login forms, open cron routes | Edge Middleware, Strict CSP, HMAC-SHA256 tokens, timingSafeEqual, sliding window rate limits |
| **Editorial Control** | Unregulated imports or purely manual entry | Dual pipeline: Instant manual authoring + RSS Ingestion with auto/pending approval queue |


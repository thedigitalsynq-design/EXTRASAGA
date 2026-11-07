# SRS.md — Software Requirements Specification

## 1. Introduction
This Software Requirements Specification defines the functional, non-functional, security, and interface requirements for the **EXTRASAGA** multi-industry cinema and entertainment platform.

---

## 2. Functional Requirements

### FR-01: Multilingual Script & Language Switching
- The system shall support six language codes: `kn`, `te`, `ta`, `ml`, `hi`, `en`.
- Active language must be persisted via URL parameter (`?lang=`), client cookie (`cinijaatre_lang`), and `localStorage`.
- The root document element must update `lang` and `data-lang` attributes upon switching.

### FR-02: Edge Security Middleware & Headers
- The edge middleware (`src/middleware.ts`) shall enforce the following HTTP response headers on every request:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
  - `Content-Security-Policy`: Disallowing unauthorized scripts, inline objects, and restricting connect/font sources.

### FR-03: Rate Limiting & Abuse Prevention
- The API layer shall enforce in-memory sliding-window rate limits (`src/lib/rateLimit.ts`):
  - Admin login route: 5 requests per 15 minutes per IP.
  - Public mutation routes (POST/PATCH/DELETE): 30 requests per minute per IP.
  - Public read routes (GET): 120 requests per minute per IP.
- Excess requests must receive an `HTTP 429 Too Many Requests` response with a `Retry-After` header.

### FR-04: Admin Authentication & Request Guarding
- Admin authentication requests must verify passwords against `ADMIN_PASSWORD_HASH`.
- The system must generate HMAC-SHA256 tokens carrying user claims and a 24-hour expiration timestamp.
- Protected endpoints must validate incoming tokens via `crypto.timingSafeEqual` to avoid timing side-channel attacks.

### FR-05: RSS Ingestion Engine & Approval Workflow
- The ingestion service (`src/lib/ingest/fetcher.ts`) must support standard RSS 2.0 and Atom XML feeds.
- Ingested articles must be sanitized against malicious HTML/script tags via `sanitizeInput`.
- Ingested items must include publisher name, original canonical link, and publication timestamp.
- When `APPROVAL_WORKFLOW_ENABLED=true`, imported items must be saved with status `pending_approval` until reviewed by an admin.

### FR-06: Automatic Date Math Engine
- Calculation of release categories shall be performed using server time in `Asia/Kolkata`:
  - `formatKolkataDate(date)` converts ISO strings to `YYYY-MM-DD`.
  - `isMovieInTheatres(releaseDate, today)` evaluates `0 <= (today - releaseDate) <= 30 days`.
  - `isMovieUpcoming(releaseDate, today)` evaluates `releaseDate > today`.

---

## 3. Non-Functional Requirements

### NFR-01: Performance & Web Vitals
- First Contentful Paint (FCP) < 1.2s on desktop and < 1.8s on 4G mobile.
- Cumulative Layout Shift (CLS) < 0.05.
- Next.js font optimization must not block production compilation (`optimizeFonts: false` in `next.config.mjs` with browser stylesheet links).

### NFR-02: Reliability & Availability
- The site must operate seamlessly in offline/fallback mode using seed data when Supabase connectivity is unavailable.
- Ingestion errors from external RSS endpoints must fail gracefully without bringing down the API or UI.

### NFR-03: SEO & Discoverability
- Dynamic XML sitemap at `/sitemap.xml` listing all languages, articles, movies, and categories.
- Optimized `robots.txt` specifying search engine crawlers and disallowing private `/admin` routes.
- Schema.org structured data (`NewsArticle`, `Movie`, `BreadcrumbList`) rendered in JSON-LD format.

---

## 4. API Specification Summary

| Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/auth` | Public (Rate-limited) | Admin authentication & session token issuing |
| `GET` | `/api/articles` | Public (Rate-limited) | List published articles by language and category |
| `POST` | `/api/articles` | Admin Token Required | Publish a new article (sanitized) |
| `PATCH` | `/api/articles` | Admin Token Required | Update or approve an article |
| `DELETE` | `/api/articles` | Admin Token Required | Delete an article |
| `GET` | `/api/movies` | Public (Rate-limited) | Query movies by release filter and language |
| `POST` | `/api/movies` | Admin Token Required | Create or edit a movie profile |
| `POST` | `/api/ingest/sync` | Admin Token or Cron Secret | Execute manual RSS feed synchronization |
| `GET` | `/api/cron/sync` | Cron Secret (`Authorization: Bearer <CRON_SECRET>`) | Automated 15-minute RSS ingestion cron |
| `GET` | `/api/cron/daily-releases` | Cron Secret | Automated daily release status calculation |


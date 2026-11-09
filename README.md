# EXTRASAGA — One Indian Cinema Industry. One Unified Platform.

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-181%20Passed-green?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **"Different languages. Different cultures. Different filmmaking traditions. One industry. One identity. One platform. EXTRASAGA — Bringing Indian Cinema Together."**

**EXTRASAGA** is a unified, professional, English-language platform representing the entire Indian cinema industry — relaunched for the **After-Dark / Emission Edition (v3.0.0)** with a Gen Z-native, certified film-brain voice: receipts-backed box office, zero-fake tea, strictly unbiased verdicts, and headlines that inform before they impress. From Bollywood to Sandalwood, Tollywood to Kollywood, Mollywood to Bengali, Marathi, Punjabi, and every other regional film industry, EXTRASAGA brings the entire ecosystem together under one identity.

---

## 🏛️ Core Principles

1. **One Brand. One Identity**: Consistent, authoritative representation of Indian cinema as a unified global powerhouse — one desk, one standard, every industry.
2. **Complete Indian Cinema Coverage**: Bollywood, Sandalwood, Tollywood, Kollywood, Mollywood, Bengali, Punjabi, and regional film industries.
3. **English as the Standard Language**: Consistent, accessible, and authoritative film-brain journalism in the After-Dark voice.
4. **One Integrated Cinema Ecosystem**: Connecting actors, directors, producers, technicians, distributors, and exhibitors.
5. **Unified Website Design**: High-prestige Forbes/Bloomberg-grade data density and editorial elegance.
6. **Equal Industry Representation**: Equal recognition, visibility, and opportunities across all filmmaking regions.
7. **Seriousness of Record (After-Dark, v3.0.0)**: Numbers and verdicts stay dead-serious — no clickbait lies, no fake tea, headlines capped at ~12 words and information-first.

---

## 🚀 Key Features

### 1. 🔤 Single-English Edition with Industry Coverage
- **English-only publication**: every page, label, headline, review and seed renders in English; the per-language `?lang=` edition axis has been retired (`languages.ts` collapses every legacy code to the English edition).
- **Latin Type System**: `DM Sans` for body, `Space Grotesk` for display, `Archivo Black` for poster headlines, plus `Catamaran`, `Plus Jakarta Sans` and `Khand` accents.
- Films keep their language identity as a fact — a Kannada movie is still tagged `kn` — it just isn't a UI setting anymore.

### 2. 🖨️ House Full Press System (Fandom-Webzine Brutalism, v4.0)
- The site prints as a fanzine: newsprint paper canvas (`#F4EFE2`), ink-black type (`#17140F`), and loud flat poster inks — press red `#E03A2F`, electric violet `#4F2BEF`, bulb gold `#F0B429` — with hard offset shadows, sticker chips, ticket-stub CTAs, stamp badges, halftone media plates and marquee ticker strips (`docs/DESIGN-SYSTEM.md`).
- **Press ribbon masthead** — poster-red **EXTRASAGA** wordmark, ink utility strip, Archivo Black display type.
- Exact 12-item navigation (ink tab strip, active = filled press-red brick):
  `[Trending Today]` · `Home` · `News` · `Reviews` · `Television` · `Celebrity` · `Movies` · `Interviews` · `Gossips` · `Photos` · `Videos` · `Events`.

### 3. 📅 Automated Cinema Release Engine
- **Server Time Awareness**: Synchronized to `Asia/Kolkata` (UTC+5:30).
- **Dynamic Date Math**:
  - *Released Today* & *Releasing Tomorrow*.
  - *In Theatres*: Actively running theatrical releases (last 30 days).
  - *Upcoming Releases*: Filter by Next 7, 30, 60, and 90 days.
  - *Permanent Archive*: Preserves canonical URLs, SEO titles, and publication history after the 30-day window.

### 4. 📰 Structured 4-Zone Editorial Homepage
- **Zone 1: Frontpage Hero Showcase**: Dominant lead story as a poster-cut card with halftone print overlay + 2 stacked poster stubs.
- **Zone 2: NOW SHOWING Release Board**: Ticket-stub tabbed theatrical and upcoming schedules with dashed paper filter chips.
- **Zone 3: Core 2-Column Editorial Magazine** (After-Dark desks):
  - *8-Col Main Stream*: Landmark *Ramayana Part 1* spotlight review + Latest headlines (*Sirens — Breaking*) + *Now Streaming / OTT Radar*.
  - *4-Col Intelligence Rail*: Real-time 30-second live wire + Top 5 trending rankers + *The Receipts Desk* box office summary + Ad unit.
- **Zone 4: Visual Media Pavilion**: 16:9 responsive trailer lounge (*First Look*) with modal player + Celebrity photo gallery.

### 5. 🛡️ Production Security & Hardening
- **Edge Middleware**: Enforces HSTS, X-Frame-Options (`SAMEORIGIN`), X-Content-Type-Options (`nosniff`), Referrer-Policy, Permissions-Policy, and strict Content Security Policy (CSP).
- **Sliding-Window Rate Limiting**: In-memory rate limiting against brute force and scraping abuse on admin login (5/15min) and API mutations (30/min).
- **HMAC-SHA256 Token Auth**: Secure session management using constant-time string comparison (`crypto.timingSafeEqual`) to prevent timing attacks.
- **Sanitized Inputs & Safe URLs**: Protection against XSS injection on all write operations.
- **Cron Protection**: `CRON_SECRET` validation on all background automated sync tasks.

---

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/extra-saaga.git
cd extra-saaga

# Install dependencies (pure Tailwind CSS, zero shadcn)
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env.local
```
Key variables:
- `ADMIN_EMAIL`: Administrator login email (default: `admin@extrasaga.press`).
- `ADMIN_PASSWORD_HASH`: SHA-256 hash of admin password.
- `AUTH_SECRET`: Secret key used for signing HMAC tokens.
- `CRON_SECRET`: Bearer token required for automated cron endpoints.
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase credentials (optional; fallback mock store operates automatically).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🧪 Testing

The project includes 16 comprehensive Vitest test suites (127+ unit and integration tests) covering adapters, normalizers, date math, rate limiters, auth guards, and English-only seed rendering:

```bash
# Run Vitest test runner
npm run test

# Run TypeScript compiler check
npx tsc --noEmit
```

---

## 📚 Project Documentation

Detailed project architecture and planning documentation:

| Document | Description |
| :--- | :--- |
| [PROJECT.md](./PROJECT.md) | Vision, target audience, personas, and industry scope |
| [BLUEPRINT.md](./BLUEPRINT.md) | System architecture diagram, 4-zone layout, and directory tree |
| [PRD.md](./PRD.md) | Product Requirements Document and acceptance criteria |
| [SRS.md](./SRS.md) | Software Requirements Specification and API endpoints |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution standards, zero-shadcn rule, and pull request guide |
| [CHANGELOG.md](./CHANGELOG.md) | Version release history and detailed feature logs |
| [LICENSE](./LICENSE) | MIT Open Source License |
| [TODO.md](./TODO.md) | Active tasks, short-term, and long-term milestones |
| [NOTES.md](./NOTES.md) | Operational notes, Windows OneDrive gotchas, and timezone math |
| [DECISIONS.md](./DECISIONS.md) | Architectural Decision Records (ADRs) |
| [ROADMAP.md](./ROADMAP.md) | 4-Phase strategic evolution from Q4 2026 to Q3 2027 |

---

## 📄 License
This project is licensed under the [MIT License](./LICENSE) — see the LICENSE file for details.

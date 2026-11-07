# FILMY GARAGE (ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್) — Multi-Industry Cinema & Entertainment Portal

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-127%20Passed-green?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**FILMY GARAGE** is an all-in-one cinema entertainment news and theatrical release intelligence platform covering six premier film industries:
- 🟡 **Sandalwood** (Kannada)
- 🔴 **Tollywood** (Telugu)
- 🔵 **Kollywood** (Tamil)
- 🟢 **Mollywood** (Malayalam)
- 🟣 **Bollywood** (Hindi)
- ⚪ **Hollywood** (English)

---

## 🚀 Key Features

### 1. 🔤 Authentic Multilingual Typography & Localization
- **6-Language Switcher**: Persistent language and industry switching across URL (`?lang=`), cookies, and localStorage.
- **Dedicated Script Typography**:
  - **Tamil**: `Catamaran` (Weights 400 through 900) for high legibility.
  - **Kannada**: `Hubballi` & TiRo typography.
  - **Telugu**: `Ramabhadra`.
  - **Malayalam**: `Chilanka`.
  - **Hindi**: `Khand`.
  - **English**: `DM Sans`.
- Zero machine-translation clutter — authentic native vocabulary and full multi-language dictionaries.

### 2. 🧭 Deep Crimson Navigation Bar (`#A92732`)
- Exact 12-item navigation:
  `[Trending Today]` · `Home` · `News` · `Reviews` · `Television` · `Celebrity` · `Movies` · `Interviews` · `Gossips` (Active indicator `#7D1B24` with amber bottom border) · `Photos` · `Videos` · `Events`.

### 3. 📅 Automated Cinema Release Engine
- **Server Time Awareness**: Synchronized to `Asia/Kolkata` (UTC+5:30).
- **Dynamic Date Math**:
  - *Released Today* & *Releasing Tomorrow*.
  - *In Theatres*: Actively running theatrical releases (last 30 days).
  - *Upcoming Releases*: Filter by Next 7, 30, 60, and 90 days.
  - *Permanent Archive*: Preserves canonical URLs, SEO titles, and publication history after the 30-day window.

### 4. 📰 Structured 4-Zone Editorial Homepage
- **Zone 1: Frontpage Hero Showcase**: Dominant lead story with high-impact vignette + 2 stacked secondary stories.
- **Zone 2: Cinema Release Center**: Tabbed theatrical and upcoming schedules with industry filter chips.
- **Zone 3: Core 2-Column Editorial Magazine**:
  - *8-Col Main Stream*: Landmark *Ramayana Part 1* spotlight review + Latest headlines + OTT radar.
  - *4-Col Intelligence Rail*: Real-time 30-second live wire + Top 5 trending rankers + Box office summary + Ad unit.
- **Zone 4: Visual Media Pavilion**: 16:9 responsive trailer lounge with modal player + Celebrity photo gallery.

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
git clone https://github.com/your-username/cinijaatre.git
cd cinijaatre

# Install dependencies (pure Tailwind CSS, zero shadcn)
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env.local
```
Key variables:
- `ADMIN_EMAIL`: Administrator login email (default: `admin@filmygarage.com`).
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

The project includes 16 comprehensive Vitest test suites (127+ unit and integration tests) covering adapters, normalizers, date math, rate limiters, auth guards, and multilingual seed rendering:

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

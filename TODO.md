# TODO.md — Active & Planned Tasks

## 1. Immediate Tasks (Current Sprint)
- [x] Configure Crimson Red (`#A92732`) Navigation Bar with the exact 12 menu items.
- [x] Upgrade regional fonts: Tamil (`Baloo Thambi 2`) and Telugu (`Baloo Tammudu 2`).
- [x] Remove outdated "No.1" tagline banners across all 6 language views.
- [x] Reduce transition latency to 180ms–250ms with Apple/Linear easing and eliminate GPU blur re-rasterization.
- [x] Implement Editorial Innovation Bento Showcase (`EditorialBentoShowcase.tsx`) with 100% spoiler-free audit metric.
- [x] Implement Interactive Cinephile Discovery Modal (`CinephileDiscoveryModal.tsx`) with multi-step progress bar and vibe matcher.
- [x] Implement Fanned Editorial Story Deck (`EditorialStoryDeck.tsx`) with overlapping tactile cards for deep-dive retrospectives.
- [x] Implement Cinema Journey Timeline (`CinemaJourneyTimeline.tsx`) with continuous narrative roadmap and handwritten notes.
- [x] Implement Editorial Testimonials Deck (`EditorialTestimonials.tsx`) with verified filmmaker and critic voices.
- [x] Implement Edge middleware security headers and strict CSP.
- [x] Implement rate-limiting store for brute-force protection.
- [x] Verify production build and all 17 test suites (131 tests) pass with 0 errors.
- [x] **After-Dark / Emission Edition copy voice pass (v3.0.0)**: rewrite `translations.ts` en strings + all data-seed headlines in the certified film-brain voice; sync kn/te/ta/ml/hi touch-ups; rebrand docs; zero visual or engine changes.

---

## 2. Short-Term Tasks (Next Sprint)
- [ ] Publish and enforce the **After-Dark copy styleguide** (headline ≤12 words, information-first, no fake tea) as a lint/PR checklist so future seed data keeps the voice-native standard.
- [ ] Connect production Supabase project via `.env.production` credentials.
- [ ] Implement Redis-backed rate limiting (Upstash Redis) for multi-instance distributed server deployments.
- [ ] Integrate external TMDB (The Movie Database) API for automatic poster and trailer ingestion.
- [ ] Add dark/light mode toggle with default high-contrast cinematic dark theme.
- [ ] Configure automated Vercel Cron jobs for `/api/cron/sync` (every 15 min) and `/api/cron/daily-releases` (daily at 00:01 IST).

---

## 3. Medium-Term Enhancements
- [ ] Progressive Web App (PWA) manifest and offline service worker for instant mobile loading.
- [ ] Web Push Notification integration (OneSignal / WebPush) for breaking cinema alerts.
- [ ] User comment moderation dashboard with spam keyword detection.
- [ ] Advanced Box Office territory breakdown (Nizam, Ceeded, Karnataka, Tamil Nadu, Kerala, North India, Overseas).
- [ ] Automated thumbnail generator for social sharing cards via `@vercel/og`.

---

## 4. Long-Term Architectural Goals
- [ ] Native iOS and Android mobile app wrappers using React Native / Capacitor.
- [ ] AI-assisted automated multi-lingual translation assistant for original editorial columns.
- [ ] Cinema ticket booking affiliate widget integration (BookMyShow / Paytm Insider).


# ROADMAP.md — Future Development & Strategic Evolution

This document outlines the strategic roadmap for **EXTRASAGA**, divided into planned phases of engineering, content intelligence, and audience engagement. The current release point is **v3.0.0 — After-Dark / Emission Edition** (copy-voice relaunch, zero visual changes), setting up Phase 2 content intelligence work on top of a voice-native seed layer.

```
+-----------------------------------------------------------------------------------------+
|                                    ROADMAP TIMELINE                                     |
|                                                                                         |
|  [Phase 1: Q4 2026]        [Phase 2: Q1 2027]        [Phase 3: Q2 2027]   [Phase 4: Q3] |
|  Foundation & Security  --> Live Wire & Radars    --> Mobile & PWA     --> AI & Global  |
|  * 4-Zone Editorial        * Box Office Engine       * Offline Service   * Multi-lingual|
|  * Multi-lingual Fonts     * OTT Countdown Radar     * Web Push Alerts     Summarizer   |
|  * Edge & Rate Limits      * TMDB Auto-Sync          * App Wrappers      * Ticketing Hub|
+-----------------------------------------------------------------------------------------+
```

---

## Phase 1: Foundation, Security & Multi-Industry Core (Completed - Q4 2026)
- [x] Standardized 12-item Deep Crimson Navigation Bar (`#A92732`).
- [x] 6-Industry Multilingual Architecture (Sandalwood, Tollywood, Kollywood, Mollywood, Bollywood, Hollywood).
- [x] Catamaran font integration for Tamil language views.
- [x] Automatic date-driven cinema release engine in `Asia/Kolkata`.
- [x] Production security safeguards: Edge middleware headers, strict CSP, sliding-window rate limits, and timing-safe HMAC admin authentication.
- [x] Landmark *Ramayana Part 1* spotlight review across all 6 languages.
- [x] Comprehensive test suite (127 Vitest unit and integration tests).
- [x] **After-Dark / Emission Edition copy voice rollout (v3.0.0)**: certified film-brain rewrite of UI strings and seed headlines across all six languages; docs rebranded; pending Phase 2: codify the styleguide as automated PR checks.

---

## Phase 2: Live Wire, Box Office Intelligence & External Sync (Q1 2027)
- [ ] **External Metadata Ingestion**: Integrate TMDB API and Wikipedia entertainment scrapers for automatic movie metadata, cast profiles, and high-res posters.
- [ ] **Detailed Box Office Analytics**:
  - Territory-wise collections (Nizam, Andhra, Karnataka, Tamil Nadu, Kerala, North India, Overseas).
  - Inflation-adjusted all-time records and distributor share calculations.
- [ ] **Automated OTT Release Alarms**:
  - "Notify Me" feature for upcoming digital streaming premieres.
  - Integration with calendar links (.ics / Google Calendar).
- [ ] **Distributed Rate Limiting**: Migrate from in-memory limiter to Upstash Redis for multi-region Vercel Edge nodes.

---

## Phase 3: Mobile Experience, PWA & Reader Engagement (Q2 2027)
- [ ] **Progressive Web App (PWA)**:
  - Service worker caching for offline article reading.
  - Native install prompt for Android and iOS.
- [ ] **Web Push Notifications**: Instant breaking news alerts for major casting announcements, teaser drops, and box office milestones.
- [ ] **Community & Comments**:
  - Verified cinephile badges and user review submissions.
  - Sentiment analysis and automated spam filtering.
- [ ] **Dark / Light Contrast Modes**: Seamless toggle between Cinema Dark (`#0F0F11`) and High-Contrast Editorial Light.

---

## Phase 4: AI Content Intelligence & Industry Ticketing (Q3 2027)
- [ ] **AI-Assisted Editorial Co-Pilot**:
  - Automatic translation assistance from primary trade scoops into the English edition.
  - Automatic key takeaways and bullet-point summaries for long-form analysis.
- [ ] **Box Office Predictive Modeling**: Historical algorithm forecasting opening weekend collections based on trailer views and advance booking trends.
- [ ] **Ticketing Integrations**: Direct affiliate deep-links to BookMyShow and Paytm Insider for active theatrical releases.


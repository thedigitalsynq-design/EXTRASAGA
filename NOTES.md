# NOTES.md — Operational Knowledge & Developer Notes

## 1. Environment & Runtime Nuances
- **Windows OneDrive File Locking**:
  - When working inside a directory synced by Microsoft OneDrive, temporary build folders (such as `.next/static/chunks/app/*`) may occasionally trigger transient `EPERM: operation not permitted, mkdir` errors during compilation.
  - *Fix*: If this occurs, clean the directory (`Remove-Item -Recurse -Force .next`) before rebuilding.
- **Font Optimization in Offline/Restricted Sandbox**:
  - Next.js default font optimizer attempts to fetch Google Fonts stylesheets at build time over the network.
  - Setting `optimizeFonts: false` in `next.config.mjs` prevents timeouts and webpack snapshot errors, allowing fonts to load asynchronously via standard client `<link rel="stylesheet">` tags in `src/app/layout.tsx`.

---

## 2. Timezone & Cinema Release Mathematics
- **Standard Timezone**: All Indian cinema theatrical releases adhere to `Asia/Kolkata` (UTC+5:30).
- **Date Math Implementation**:
  - Use `src/lib/cinemaDateUtils.ts`.
  - Always calculate timestamps relative to `getKolkataCurrentDate()` rather than the user's local device clock or naive UTC strings.
  - This guarantees that a movie releasing on Friday in India transitions to "In Theatres" at midnight IST regardless of where the reader is located globally.

---

## 3. Security & Access Control Reference
- **Admin Password Storage**:
  - `ADMIN_PASSWORD_HASH` in `.env` stores the SHA-256 hash of the administrative master password.
  - When setting a new password, generate the SHA-256 hex string:
    ```bash
    node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
    ```
- **Cron Authentication**:
  - All automated background cron triggers must provide the header:
    `Authorization: Bearer <CRON_SECRET>`
  - The secret is matched using constant-time comparison (`crypto.timingSafeEqual`) to eliminate timing attacks.

---

## 4. Typography Mapping Matrix
| Language | Code | Primary Font Family | Fallback |
| :--- | :--- | :--- | :--- |
| **English** | `en` | `DM Sans` (Weights 400-700) | system sans-serif |
| Display / Poster | — | `Space Grotesk` / `Archivo Black` | sans-serif |

---

## 5. After-Dark Copy Voice Styleguide (v3.0.0 — Emission Edition)
- **Voice**: Certified film-brain. Write like the trade insider at the back of the projection room, not like a hype account.
- **Headlines**: Information-first, ~12 words max. Numbers and verdicts stay dead-serious; never inflate, never hide.
- **Standing section names** (`translations.ts`, English edition): *Sirens — Breaking*, *The Receipts Desk*, *Now Streaming / OTT Radar*, *First Look*, *Trending Today*.
- **Banned register**: corporate fam-speak ("excited to announce"), emoji-spam, meme-speak, clickbait lies, "slay"-adjacent filler.
- **Sacrosanct copy**: Ramayana Part 1 coverage runs reverent, poetic and serious with `NO RATINGS, ONLY RESPECT!` as the closing line; no meme treatment, no ratings.

### Version-name reconciliation
- `docs/DESIGN-SYSTEM.md` uses "After-Dark" for a superseded *visual* concept (pre-House Full Press v4.0). CHANGELOG `v3.0.0` reuses "AFTER-DARK / EMISSION EDITION" strictly as the editorial **copy-voice** release name. No visual changes shipped with it; if confusion resurfaces in PR review, link to CHANGELOG §3.0.0 "Naming Reconciliation Note".
- Test-asserted literals are contract: before rewriting voice strings, re-check `tests/ramayana-review.test.ts`, `tests/multilingual.test.ts`, and `tests/editorial-design-references.test.ts` for asserted text (e.g. `Trending Today`, `NO RATINGS, ONLY RESPECT!`).


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
| **Tamil** | `ta` | `Baloo Thambi 2` (Weights 400-800) | sans-serif |
| **Kannada** | `kn` | `Hubballi` | sans-serif |
| **Telugu** | `te` | `Baloo Tammudu 2` (Weights 400-800) | sans-serif |
| **Malayalam** | `ml` | `Chilanka` | cursive, sans-serif |
| **Hindi** | `hi` | `Khand` (Weights 300-700) | sans-serif |
| **English** | `en` | `DM Sans` (Weights 400-700) | sans-serif |


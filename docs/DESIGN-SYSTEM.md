# EXTRASAGA — "HOUSE FULL PRESS" Design System v4.0

> **Ink is loaded. The press is running. House full, every day.** EXTRASAGA stopped
> pretending to be a website and became what every Indian-cinema fan already runs:
> a fanzine. The page is a newsprint sheet; every surface is *printed* — flat poster
> inks, hard ink rules, offset block shadows, sticker badges, ticket-stub cards and
> marquee ticker strips. No glow. No glass. No gradients pretending to be light.

**Edition name:** `HOUSE FULL PRESS EDITION` (Fandom-Webzine Brutalism)
**Replaces:** After-Dark / Emission v3.0, Jade Horizon v2.x, Deep Crimson v1.x

---

## 1. Concept — Fandom-Webzine Brutalism

The Gen Z film-internet is a press: charts, receipts, memes printed at speed, not a
nightclub. So the page behaves like a zine dropped fresh off the risograph:

- **The page is a newsprint sheet.** Canvas is warm paper (`#F4EFE2`), never sterile
  white, never black. Cards are slightly brighter `sheet` panels pressed on top.
- **Color is ink, not light.** Zero halo, zero `box-shadow` bloom. Emphasis is *hard*:
  a 2px ink rule, a brutal offset shadow (`4px 4px 0 0 #17140F`), a rotated sticker.
  Hover states *lift* the paper — the shadow grows, the card nudges out of its grid.
- **Loud poster inks on quiet paper.** Poster red (`#E03A2F`), electric print violet
  (`#4F2BEF`) and bulb gold (`#F0B429`) are flat fills with ink outlines — the way
  Indian film poster walls have shouted for seventy years.
- **Print grain everywhere.** Halftone dot plates on media, registration grids on
  banded sections, dashed ticket perforations on CTAs and dividers.
- **Zero fake Gen Z.** The voice stays "certified film-brain": receipts, lore, canon
  events, first-day-first-show energy — confident, funny, deeply online, bilingual
  slang used *correctly*. Never pick-me corporate "fam." Box-office numbers and review
  verdicts still read like receipts: facts ship at face value with zero irony.
- **Motion is mechanical, not atmospheric.** `stamp-in`, `wiggle`, `print-roll`,
  `ticker` marquee — anything a printing press or a theatre entrance could do. No
  floating blobs, no blur washes, no light leaks.

---

## 2. Non-Negotiables (the original agenda — carried through every edition, never removed)

1. **Six industries, one English desk** — Sandalwood, Tollywood, Kollywood,
   Mollywood, Bollywood and Hollywood. The per-language edition axis
   (`data-lang` switching, regional font stacks) is retired; films keep their
   language identity as a fact (`kn`, `te`, …) while every page reads English.
2. **Automated `Asia/Kolkata` release engine** — Released Today / Tomorrow / In
   Theatres (30-day run) / Next 7-30-60-90 / permanent Archive.
3. **Ramayana Part 1 clearance rule** — zero commercial star rating; reverent
   marquee-gold badge only.
4. **Editorial integrity** — trusted-source RSS ingestion, publisher attribution,
   admin approval workflow.
5. **12-item navigation agenda** — Trending Today · Home · News · Reviews ·
   Television · Celebrity · Movies · Interviews · Gossips · Photos · Videos · Events
   (labels localised; the *slots* never move).
6. **Security hardening** — CSP/HSTS headers, HMAC-SHA256 admin tokens,
   sliding-window rate limits, `CRON_SECRET` gates, zero `shadcn`, pure Tailwind.

---

## 3. Palette — "Press Ink Tokens"

| Token | Hex | Role |
| :--- | :--- | :--- |
| `paper` | `#F4EFE2` | Page canvas. The newsprint sheet. |
| `sheet` | `#FBF7EC` | Cards, panels, rails. |
| `band` | `#ECE3D0` | Alternate newspaper bands, chips, toolbar strips. |
| `ink` | `#17140F` | Type, borders, the least-bad black. |
| `ink-dim` | `#5C5344` | Secondary type. |
| `ink-mute` | `#8D8471` | Metadata, timestamps, captions. |
| `line` | `#D9CEB4` | Hairline rules (1px quiet). |
| `line-strong` | `#17140F` | Emphasis rules — always 2px. |
| **`press`** | `#E03A2F` | Poster red. LIVE, breaking, gossip, trending, CTA fills. Printed shadow accent: `6px 6px 0 0` |
| `press-deep` | `#B3271E` | Press red pressed/active, text-grade red on paper. |
| **`violet`** | `#4F2BEF` | Electric print violet. Reviews, editorial features, discovery, hub chips. |
| `violet-deep` | `#3B1DBE` | Violet pressed/active, text-grade violet on paper. |
| **`marquee`** | `#F0B429` | Bulb gold. Ramayana reverence badge, box-office #1, countdowns, hot-topic stickers. |
| `marquee-soft` | `#C4881A` | Text-grade gold on paper. |

**Rules**
- Every accent fill carries a **2px ink border** and, for interactive/stamped
  elements, a hard offset shadow. No accent floats naked.
- Max **one red fill region per viewport band**; violet and gold take the rest.
- Keep at least **60% paper** per viewport. The zine needs margins to breathe.
- Legacy token names (`void`, `hall`, `revealed`, `screen`, `glow-line`, `popcorn`,
  `signal`, `ultra`, `jade`, `surface`, `crimson`, `brand`, `cinemaGold`) stay
  resolvable but are remapped to press values, so un-migrated internals degrade to
  print equivalents — never back to dark mode or old jade.

---

## 4. Typography

| Layer | Face | Notes |
| :--- | :--- | :--- |
| Poster display | **Archivo Black** (400) | Masthead, section titles, stamps, buttons. Never below 24px. |
| Grotesk UI | **Space Grotesk** (400–700) | Sticker chips, tickers, numerals, tabular data. |
| Body | **DM Sans** (400–700) | Article body, captions. |
| Accent | **Catamaran / Plus Jakarta Sans / Khand** (400–800) | Secondary accents inherited from the v1–v3 stacks; loaded for compat. |

Headlines always render in the **Latin press type system**. Poster-caps headlines
mix one solid ink word + one accent-ink word (e.g. **NOW SHOW** + red **ING**).

---

## 5. Components

| Component | Spec |
| :--- | :--- |
| **Poster Card** | `bg-sheet border-2 border-ink shadow-press`, hover → shadow grows to `6px` in an accent ink + `translate(-1,-1)`. 200ms. No rounded corners. |
| **Sticker chip** | `.sticker` — `bg-[accent] text-ink/paper`, 2px ink border, `3px 3px 0` shadow, `rotate(-3deg)`, uppercase grotesk, `tracking-widest`. Use for category tags & meta. |
| **Stamp badge** | `.stamp-headline` — Archivo Black caps; status versions get red `stamp`, gold `verified stamp`, violet `curation stamp`. |
| **Ticket-stub CTA** | Full-width `bg-ink text-paper border-2 border-ink shadow-sticker`, uppercase, hover → `bg-press`. Perforated dividers around it (`.ticket-cut-x`). |
| **Ticket-stub tabs** | Attached pair of stub buttons sharing one border; active = `bg-press text-paper shadow-press`, tilted `-1deg`. |
| **Marquee strip** | `.marquee-strip` — ink band with paper type; the breaking ticker is the canonical example with a rotated red `BREAKING` plate. |
| **Front-page strip** | Ink band inside the header (`bg-ink text-paper`) with Latin-script date, red LIVE plate and gold admin sticker. |
| **Print texture** | `.halftone` / `.halftone-faint` dot plates on hero stills and band sections; `.jade-grid-bg`-named registration grid survives as the press grid. |
| **Live dot** | Red square-dot with `press-ping` ring; `LIVE ·` prefix in gold on ink strips. |
| **Film media** | Poster/grab images never float free: ink border on top, halftone dots at 40–60% over the still, ink scrim gradient for caption plates. |
| **Late-show mode** | `body.theater-dim-active` flips the whole sheet to a night press run (`#17140F` canvas, paper type) — the Director's Cut HUD stays. |

**Banned going forward:** `backdrop-blur` glass, gradient blooms, `border-radius` on
primary cards, white `#FFFFFF` canvas, jade `#288760` fills, neon text-shadow glows,
soft 40px blur shadows on editorial surfaces.

---

## 6. Voice — "Certified Film-Brain, Off the Press"

- Section titles: `FRONT PAGE` (hero) · `NOW SHOWING` (releases) · `THE FEED`
  (news) · `THE VERDICT DESK` (reviews) · `THE RECEIPTS` (box office) · `THE TEA`
  (gossip) · `THE DEEP PRINT` (archive) · `FIRST LOOK` (trailers) · `PHOTO DUMP`
  (galleries) · `CULT CALENDAR` (events).
- Sticker microcopy carries the attitude: "DAILY PRESS RUN", "HOUSE FULL",
  "FULL DOSSIER", "OFF THE PRESS", "RECEIPTS ATTACHED", "NO SPOILERS, ONLY RESPECT".
- Decks stay in the film-internet register — canon events, receipts, lore — always in
  service of real information, never filler.
- **Credibility clause:** numbers, review verdicts, and Ramayana reverence copy stay
  dead-serious. Gen Z tone is for *packaging*; facts ship at face-value precision.
- All decks are authored in English (press register); film-language identity stays a data fact, never a font switch.

---

## 7. Migration Ledger (v3 → v4)

| Token / pattern | v4 replacement |
| :--- | :--- |
| `void`, `hall`, `revealed`, `screen` | `paper`, `band`, `sheet` via legacy remap; raw hexes to be swept per page |
| `popcorn` / `popcorn-dim` / `popcorn-muted` | `ink` / `ink-dim` / `ink-mute` (remapped) |
| `signal`, `ultra` accents | `press`, `violet` (aliases retained) |
| Glow `box-shadow` halos (`0 0 24px …`) | Hard offset `N px N px 0 0 ink` shadows |
| `rounded-2xl/24px/28px` on cards | Square corners; only chips keep `rounded-full` |
| `backdrop-blur` dark glass | Opaque `sheet` panels with ink borders |
| Gradient beam `::before` washes | Halftone plates / registration grids |
| `text-shadow` glow classes | Pressed-ink text colors (`press-deep`, `violet-deep`, `marquee-soft`) |
| Jade era hexes (`#288760` family) | Violet family + `#1B7F3C` reserved for positive deltas |

## 8. Acceptance (design)

- [x] Every public route prints on paper canvas (`bg-paper` via layout shell).
- [x] Max 1 red fill band per viewport region; violet & gold share the rest.
- [x] The English edition renders in the DM Sans / Space Grotesk / Archivo Black press type system (per-language script stacks retired with the edition axis).
- [x] Ramayana spotlight uses a marquee-gold reverence badge; no star rating near it.
- [x] Header prints as a press ribbon + poster masthead; 12 agenda slots intact.
- [x] Legacy v1–v3 tokens resolve to press values; suite green against the v4 era.
- [x] Remaining hub pages (news, reviews, box-office, ott, live, archive, cinestars)
      migrated to House Full Press v4.0 brutalism with unified all-industry desks.

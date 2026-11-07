# DECISIONS.md — Architecture Decision Records (ADRs)

This document records the architectural and technical decisions made for the **EXTRASAGA** platform, including the context and rationale for each choice.

---

## ADR-001: Pure Tailwind CSS over Component Frameworks (shadcn/ui)
- **Status**: Accepted
- **Context**: Rapid development tools often advocate for headless UI wrapper libraries such as `shadcn/ui` (Radix UI wrappers).
- **Decision**: Avoid all `shadcn/ui` and `@radix-ui/*` dependencies, opting for pure Tailwind CSS and accessible semantic HTML.
- **Rationale**:
  - Eliminates excessive bundle bloat and deep dependency trees.
  - Ensures seamless styling across the high-contrast Latin editorial type system.
  - Guarantees zero version conflicts with Next.js 14 App Router and Edge runtime builds.

---

## ADR-002: Dynamic Server-Time Cinema Engine vs. Static Manual Updates
- **Status**: Accepted
- **Context**: Most entertainment sites manually categorize movies as "Upcoming" or "Released", which causes stale data.
- **Decision**: Implement dynamic date math executed at request/revalidation time relative to `Asia/Kolkata`.
- **Rationale**:
  - Automatically transitions movies from upcoming windows (Today, Tomorrow, 7/30/60/90 Days) to "In Theatres" without human intervention.
  - Retains permanent SEO URLs for archived titles once their 30-day active theatrical run completes.

---

## ADR-003: In-Memory Sliding Window Rate Limiting for Edge & Server Routes
- **Status**: Accepted
- **Context**: Public API routes and admin login endpoints require protection against credential stuffing, brute force, and scraping abuse.
- **Decision**: Built an in-memory sliding window rate limiter in `src/lib/rateLimit.ts` that enforces request quotas per IP.
- **Rationale**:
  - Provides instant zero-infrastructure protection on single-server or container environments without external Redis overhead.
  - Easily extensible to Upstash Redis for distributed multi-region serverless clusters.

---

## ADR-004: Dual Data Pipeline (Database First with Resilient Seed Fallback)
- **Status**: Accepted
- **Context**: When cloud databases (Supabase) face connectivity drops, maintenance, or cold starts, user-facing news sites must remain accessible.
- **Decision**: Designed `DataService` to attempt Supabase operations first, falling back seamlessly to seeded in-memory data structures.
- **Rationale**:
  - Ensures high site reliability (99.9% uptime).
  - Allows full local development and testing without requiring live Supabase credentials.

---

## ADR-005: Catamaran Google Font for Tamil Typography
- **Status**: Accepted
- **Context**: Tamil script requires high legibility at both display weights (hero headlines, banners) and body sizes (article paragraphs).
- **Decision**: Selected Google Font `Catamaran` (weights 400 to 900) as the primary Tamil font.
- **Rationale**:
  - Catamaran offers consistent stroke contrast and clear glyph distinction for complex Tamil ligatures.
  - Native pairing with Latin numerals and characters prevents font-rendering mismatches.

---

## ADR-006: Reverent Badge for Ramayana Part 1 vs. Commercial Star Rating
- **Status**: Accepted
- **Context**: The upcoming epic *Ramayana Part 1* holds immense cultural significance across all Indian film industries.
- **Decision**: Replaced standard commercial numerical/star ratings (`4.8 ★ / 5`) with a gold/amber reverent badge and in-depth cultural analysis.
- **Rationale**:
  - Aligns with audience sentiment regarding sacred and landmark cinematic adaptations.
  - Distinctive editorial voice that sets EXTRASAGA apart from commoditized review aggregators.

---

## ADR-007: After-Dark / Emission Copy Voice over Corporate Hype Register
- **Status**: Accepted (v3.0.0)
- **Context**: Entertainment portals trend toward either rigid corporate PR tone or hype-account clickbait; both erode reader trust in receipts and verdicts.
- **Decision**: Adopt the **After-Dark / Emission Edition** copy voice (v3.0.0) as the editorial standard — Gen Z-native, certified film-brain journalism with information-first headlines (~12 words), receipts-backed box office, zero-fake tea, and dead-serious numbers. Apply it to `translations.ts`, data seeds, and docs; make zero visual or engineering changes alongside it.
- **Rationale**:
  - Speaks the audience's language while out-hyping no one: verifiable trade facts are the platform's flex.
  - Preserves all existing agenda machinery — six industries and scripts, Asia/Kolkata engine, verified-source ingestion, admin workflows, security stack — without a single rule change.
  - Isolates voice changes into strings-only diffs, keeping the House Full Press v4 design system and the Vitest contract suite untouched.


# Sini Kannada — Live Newsroom Design

**Date:** 2026-10-31
**Status:** Approved for planning
**Scope:** Phase 1

---

## 1. Overview

Sini Kannada currently renders a complete Kannada cinema portal from static seed data in
[`src/data/mockData.ts`](../../../src/data/mockData.ts). There is no live ingestion, no API layer,
no Supabase connection (`.env` is absent), and no real-time behavior. Every article, view count,
and "breaking" label is fabricated.

This design turns the portal into a **live newsroom** driven by scraped Kannada cinema news:

1. A scheduled ingestion pipeline scrapes three validated Kannada sources.
2. Articles are normalized, categorized, deduplicated, and stored in Supabase.
3. Supabase Realtime pushes new articles to the browser.
4. The homepage is rebuilt around a dense, information-first "live desk" layout.
5. Fabricated metrics disappear; every story carries a source and an honest timestamp.

### Goals

- Show real, current Sandalwood news within five minutes of publication.
- Make freshness, provenance, and coverage visible on every card.
- Never mix demo content into public pages once live data exists.
- Keep scraping respectful: robots.txt, rate limits, bot identification, attribution, and link-out.
- Ship a layout that scans faster and holds more stories per screen without feeling cramped.

### Non-goals (Phase 1)

- Republishing full article bodies.
- Translating content (sources already publish in Kannada).
- Scraping Box Office and OTT numbers (curated data remains for now).
- Push notifications, social scraping, or YouTube comment ingestion.
- Replacing the demo admin login with production auth.
- Infinite scroll or personalized feeds.

---

## 2. Decisions

| Decision | Choice | Reason |
|---|---|---|
| Content source | HTML scraping of named Kannada sites | User choice; gives freshest headlines |
| Source set | Filmibeat Kannada, Vijaya Karnataka, News18 Kannada | Verified SSR + parseable `og:*`; all robots-permitted |
| Persistence | Supabase Free plan Postgres | Existing schema; 500 MB is ample for headline/excerpt rows |
| Scheduling | Supabase `pg_cron` + `pg_net` every 5 min | Free tier; no Vercel Pro cron required |
| Hosting | Vercel Hobby (free) | Existing Next.js app; no paid runtime dependency |
| Cost policy | Free tiers and OSS only | No paid APIs, proxies, translation, or media storage by default |
| Realtime transport | Supabase Realtime `postgres_changes` | Zero extra infrastructure |
| On-site content depth | Headline + excerpt + canonical link | User choice; lowest legal risk |
| Layout direction | Live newsroom (dense editorial grid) | User choice; matches stated taste |
| Translation | None | Sources publish in Kannada |

### Source validation performed

| Source | Listing | Article metadata | Robots | Result |
|---|---|---|---|---|
| Filmibeat Kannada | `https://kannada.filmibeat.com/` | `og:title`, `og:image`, `og:description`, `article:published_time`, 7 body paragraphs | `User-agent: * / Allow: /` (paths we use are allowed) | Parseable |
| Vijaya Karnataka | `https://vijaykarnataka.com/entertainment` | `og:*`, JSON-LD `datePublished` (page-dependent) | `User-agent: * / Allow: /` | Parseable |
| News18 Kannada | `https://kannada.news18.com/entertainment/` | `og:*`, `article:published_time`, JSON-LD `datePublished` | `User-agent: * / Allow: /` | Parseable |

Rejected for Phase 1:

- **Oneindia Kannada** — `robots.txt` sets `User-agent: * / Disallow: /`; it must not be scraped.
- **Chitraloka** — homepage is a JS application; no server-rendered Kannada content.
- **Udayavani** — listing links are client-rendered.
- **Cineulagam** — Tamil site (`<html lang="ta">`), not Kannada.
- **Filmibeat without browser UA** — returns 403; the scraper sends a real browser UA plus bot identification.

### Free-tier budget

- **Supabase Free:** 500 MB database, 1 GB storage, 5 GB egress, 200 concurrent Realtime
  connections, and 2M Realtime messages/month. Headline/excerpt rows are roughly 1 KB, so the
  database holds well over 100k stories.
- **Images:** source CDN URLs are stored by default (`INGEST_STORE_IMAGES=false`). Scraped images
  render with `unoptimized`, so neither the 1 GB Supabase bucket nor Vercel Hobby's monthly image
  transformation quota is consumed.
- **Scheduling:** Supabase `pg_cron` + `pg_net` are included on the Free plan and run every five
  minutes. Vercel Hobby cron is daily only, so it is a fallback, not the primary scheduler.
- **`ingest_runs`:** pruned to 14 days by a nightly `pg_cron` job.
- **No paid services:** no news API, translation API, proxy, or paid storage. All libraries are
  MIT/Apache OSS.
- **Commercial-use caveat:** Vercel Hobby restricts commercial use. If the portal runs ads, use a
  free commercial-friendly host such as Cloudflare Pages/Workers Free or Netlify Free, subject to
  their current terms. The app code stays host-agnostic.

---

## 3. Architecture

```
Supabase pg_cron (*/5) ──► pg_net HTTP POST
      │
      ▼
/api/ingest  ──►  Ingestion orchestrator
      │                     │
      │                     ├─► Source adapters (listing → article URLs)
      │                     ├─► Polite fetcher (robots, rate limit, retry)
      │                     ├─► Parsers (cheerio → raw fields)
      │                     ├─► Normalizer (text, dates, category, slug)
      │                     ├─► Dedupe/merge (URL + title similarity)
      │                     └─► Repository (Supabase upsert + optional image upload)
      │
      ▼
Supabase Postgres ──► Realtime INSERT ──► LiveFeedProvider ──► router.refresh()
      │
      └──► Server components /api/articles ──► Home, Category, Article, Search
```

### New and changed files

```
src/lib/categories.ts       # CATEGORIES extracted from mockData (single source)
src/lib/feed.ts             # feed metadata (latest, today count, active sources)
src/lib/articles/mapper.ts  # Supabase row -> public Article (honest metrics)
src/lib/ingest/
  types.ts                 # RawArticle, IngestResult, SourceAdapter, repository
  fetcher.ts               # UA, timeout, retry, per-host throttle, SSRF guard
  robots.ts                # robots.txt fetch + cache + canFetch()
  auth.ts                  # timing-safe ingest secret check
  validate.ts              # RawArticle acceptance rules
  normalize.ts             # text cleanup, excerpt, date, slug
  categorize.ts            # Kannada/English keyword rules
  dedupe.ts                # title token similarity + merge plan
  store.ts                 # Supabase repository (service role) + run logging
  run.ts                   # orchestrator (per-source isolation)
  sources/
    index.ts               # adapter registry
    helpers.ts             # meta/JSON-LD/link helpers
    filmibeat.ts
    vijayakarnataka.ts
    news18.ts

src/app/api/ingest/route.ts        # POST, secret-protected
src/app/api/articles/route.ts      # GET live feed + search
src/app/api/feed/version/route.ts  # GET lightweight change token

src/components/
  LiveDeskBar.tsx          # live status strip + refresh toggle
  LiveFeedProvider.tsx     # Supabase realtime subscription + polling fallback
  NewStoriesPill.tsx       # floating "N new stories" control
  LiveBriefs.tsx           # dense hero-side list
  SourceBadge.tsx
  FreshnessBadge.tsx

src/lib/time.ts            # Kannada relative time + exact timestamp
src/lib/dataService.ts     # read Supabase first; demo fallback only when unconfigured
src/app/page.tsx           # Live Newsroom layout
src/app/news/[slug]/page.tsx
src/app/category/[slug]/page.tsx
src/app/search/page.tsx
src/app/admin/page.tsx     # read-only ingest health panel
src/components/Header.tsx
src/components/BreakingTicker.tsx
src/components/ArticleCard.tsx
src/components/Footer.tsx
src/app/layout.tsx

supabase/migrations/202610310001_live_feed.sql
vercel.json
vitest.config.ts
.env.example
next.config.mjs
package.json
```

### Dependencies

| Package | Type | Purpose |
|---|---|---|
| `cheerio` | runtime | HTML parsing |
| `robots-parser` | runtime | robots.txt rules |
| `vitest` | dev | Unit/integration tests; add `"test": "vitest run"` to scripts |

No UI library additions. Existing `lucide-react`, Tailwind, and Supabase client are reused.

---

## 4. Ingestion pipeline

### 4.1 Source adapter contract

```ts
export interface SourceAdapter {
  id: string;                    // "filmibeat"
  name: string;                  // "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ"
  homepage: string;              // canonical site URL
  listingUrls: string[];
  allowedHosts: string[];        // SSRF and link validation allowlist
  defaultCategory: CategorySlug;
  extractLinks(html: string, baseUrl: string): string[];
  parseArticle(html: string, url: string): RawArticle | null;
}
```

`RawArticle` carries only source-derived fields:

```ts
export interface RawArticle {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;             // canonical URL
  title: string;
  excerpt: string;               // from og:description or first paragraph
  imageUrl: string | null;
  publishedAt: string | null;    // ISO when the source provides it
  bodyPreview?: string;          // first Kannada paragraph, discarded after excerpt
}
```

### 4.2 Fetch policy

- User-Agent: `SiniKannadaBot/1.0 (+https://sinikannada.com/bot)` plus a browser-compatible token
  because Filmibeat rejects unknown agents. Example:
  `Mozilla/5.0 (compatible; SiniKannadaBot/1.0; +https://sinikannada.com/bot)`.
- `Accept-Language: kn-IN,kn;q=0.9,en;q=0.5`.
- Timeout: 5 seconds per request via `AbortSignal.timeout(5_000)`.
- Retry: one retry on 429/5xx after 1 second, only when the run has spent less than 5 seconds.
  Honor `Retry-After` up to 10 seconds.
- Throttle: at least 1,000 ms between requests to the same host (configurable).
- Max 3 new articles per source per run (configurable via `INGEST_MAX_PER_SOURCE`). This keeps a
  run under the free Vercel Hobby function limit while still allowing 36 new stories/hour/source.
- Robots: fetch and cache `robots.txt` per host for the process lifetime; skip disallowed paths.
  If robots fails to load, proceed only for listing URLs previously verified.
- SSRF guard: article links must match the adapter's `allowedHosts`, use `https:`, and have no
  credentials or non-standard ports.

### 4.3 Listing extraction

For each source, select anchors from the server-rendered listing:

| Source | Selector |
|---|---|
| Filmibeat | `a[href*="/news/"][href$=".html"]` on `https://kannada.filmibeat.com/` |
| Vijaya Karnataka | `a[href*="/entertainment/"][href*=".cms"], a[href*="/entertainment/"]` |
| News18 Kannada | `a[href*="/news/entertainment/"][href$=".html"]` on `https://kannada.news18.com/entertainment/` |

Rules:

- Resolve relative URLs against the listing URL.
- Strip query strings and fragments except a short allowlist (`?lang=kn`).
- Deduplicate by URL, preserve DOM order.
- Reject URLs that are section roots, tags, author pages, or video-only pages when detectable.
- Query Supabase for existing `source_url` values before fetching details; only unseen URLs continue.
- Fetch at most `INGEST_MAX_PER_SOURCE` details per source, newest-first by DOM order.

### 4.4 Article parsing

Extract with cheerio:

1. `og:title` → title. Strip trailing ` | Site Name`, ` - Site Name`, and English duplication after `|`.
2. `og:description` → excerpt. If the description mixes English and Kannada, prefer the longest
   contiguous Kannada sentence. If missing, use the first body paragraph with a Kannada-character
   ratio ≥ 0.5.
3. `og:image` → image URL. Must be `https:`.
4. `article:published_time`; fallback JSON-LD `datePublished`; fallback the page's
   `<time datetime>`; otherwise `null`.
5. `link[rel="canonical"]` → canonical URL. If absent, use the fetched URL.
6. Body preview: first two `p` elements inside the article container with Kannada ratio ≥ 0.5,
   used only to derive an excerpt when `og:description` is missing. It is not stored.

Validation (reject article if any fail):

- Title between 10 and 200 characters after cleanup.
- Excerpt at least 40 characters after cleanup.
- Image URL is absolute HTTPS.
- Canonical URL passes the adapter host allowlist.
- Published time, when present, parses to a valid ISO date not more than 30 days in the future.

### 4.5 Normalization

- Decode HTML entities (`&amp;`, `&zwnj;`, `&#x200c;`) to text.
- Collapse whitespace; remove control characters; trim.
- Excerpt: cut at the nearest sentence boundary at or before 240 characters; append `…` only when cut.
- Slug: take the last URL path segment, drop the extension, ASCII-lowercase, replace non-alphanumerics
  with `-`, collapse dashes. If the result is empty or shorter than 3 characters, use `news-<hash8>`.
  Ensure uniqueness by appending `-<hash6>` when a collision exists.
- Category: see 4.6.
- Tags: up to four matched keyword labels from the category rules.
- If the source provides no `publishedAt`, set `published_at = fetched_at` and
  `published_at_estimated = true`. The UI then shows `ಈಗ ತಿಳಿದುಬಂದಿದೆ` instead of a publication time.
- `readTimeMinutes`: not displayed for scraped articles; stored as 0.
- `views`: stored as 0; never fabricated.

### 4.6 Category mapping

Rules are ordered; first match wins. Source section, when explicit, takes precedence.

| Category | Kannada keywords | English keywords |
|---|---|---|
| `box-office` | ಬಾಕ್ಸ್ ಆಫೀಸ್, ಗಳಿಕೆ, ಕಲೆಕ್ಷನ್, ಕೋಟಿ | box office, collection, crore |
| `ott` | ಒಟಿಟಿ, ನೆಟ್‌ಫ್ಲಿಕ್ಸ್, ಪ್ರೈಮ್, ಜೀ5, ಸ್ಟ್ರೀಮಿಂಗ್ | ott, netflix, prime video, zee5, streaming |
| `reviews` | ವಿಮರ್ಶೆ, ರಿವ್ಯೂ, ರೇಟಿಂಗ್ | review, rating |
| `interviews` | ಸಂದರ್ಶನ, ಮಾತುಕತೆ | interview |
| `gossip` | ಗಾಸಿಪ್, ಗುಲ್ಲು, ವೈರಲ್ | gossip, viral |
| `upcoming` | ಮುಂಬರುವ, ಶೂಟಿಂಗ್, ಟೀಸರ್, ಟ್ರೇಲರ್ | upcoming, shooting, teaser, trailer |
| `actors` | ನಟ, ಹೀರೋ | actor, hero |
| `actresses` | ನಟಿ, ಹೀರೋಯಿನ್ | actress, heroine |
| `bollywood` | ಬಾಲಿವುಡ್, ಹಿಂದಿ | bollywood, hindi |
| `hollywood` | ಹಾಲಿವುಡ್ | hollywood |
| `sandalwood` | ಸ್ಯಾಂಡಲ್ವುಡ್, ಕನ್ನಡ ಸಿನಿಮಾ, ಕಿಚ್ಚ, ಯಶ್, ರಿಷಬ್, ದರ್ಶನ್ | sandalwood, kannada cinema |

Fallback: adapter `defaultCategory` — `sandalwood` for Filmibeat and News18 Kannada,
`latest` for Vijaya Karnataka.

### 4.7 Dedupe and coverage merge

- Normalize a title: lowercase, remove punctuation and English stopwords, split on whitespace into
  a token set. Kannada tokens are kept as-is.
- Similarity = Jaccard index of token sets.
- Candidate window: scraped articles published within the last 48 hours (max 300 rows).
- Match threshold: 0.62. On match, merge into the existing primary row:
  - The existing row keeps its title, excerpt, image, and slug.
  - Set `published_at` to the earliest non-estimated timestamp. If only estimated times exist,
    keep the earliest and leave `published_at_estimated = true`.
  - Append the new source to `alt_sources` (max 5, deduped by URL).
  - Increment `coverage_count`.
  - Update `fetched_at`.
- Exact `source_url` match is an idempotent update, not a merge.
- This makes `coverage_count` a real signal, used by the trending rail.

### 4.8 Images (free tier)

1. Default (`INGEST_STORE_IMAGES=false`): store the original `og:image` URL. No upload and no
   Supabase Storage usage.
2. Scraped images render with `next/image` `unoptimized`, so the browser fetches the source CDN
   directly. This avoids Supabase egress and Vercel's monthly image-transformation quota.
3. `next.config.mjs` adds `images.filmibeat.com`, `static.langimg.com`, and `images.news18.com`
   to `remotePatterns`.
4. Optional (`INGEST_STORE_IMAGES=true`): if a source blocks hotlinking, upload the image to the
   free 1 GB `sini-media` bucket after validating `content-type: image/*`, size ≤ 4 MB, and host
   allowlist. Keep this off unless a source actually requires it.

### 4.9 Orchestration and failure handling

- `runIngest()` runs each adapter with `Promise.allSettled`.
- Per-source result: `{ sourceId, discovered, fetched, inserted, merged, skipped, errors, durationMs, status }`.
- Every run writes one `ingest_runs` row per source plus a summary row (`source_id = "all"`).
- One failed source never blocks the others.
- Re-running is safe: URL upserts and title merges are idempotent.
- Nothing is written when `SUPABASE_SERVICE_ROLE_KEY` is missing; the route returns a clear 503
  with a setup message instead of silently falling back to demo data.
- The route targets <7 seconds (three sources in parallel, 3 articles each) to fit the free
  Vercel Hobby function limit. Image downloads are skipped in the default configuration.

---

## 5. Data model

### 5.1 Migration

File: `supabase/migrations/202610310001_live_feed.sql`

```sql
-- 0. Seed the category table first: articles.category_slug references it.
insert into public.categories (name, english_name, slug, description) values
  ('ಮುಖಪುಟ', 'Home', 'mukhaputa', 'ಸಿನಿ ಕನ್ನಡ ಮುಖಪುಟ'),
  ('ಇತ್ತೀಚಿನ ಸುದ್ದಿ', 'Latest News', 'latest', 'ಕ್ಷಣಕ್ಷಣದ ಸುದ್ದಿ'),
  ('ಸಿನಿಮಾ ವಿಮರ್ಶೆ', 'Movie Reviews', 'reviews', 'ನೈಜ ಸಿನಿಮಾ ವಿಮರ್ಶೆಗಳು'),
  ('ಸ್ಯಾಂಡಲ್ವುಡ್', 'Sandalwood', 'sandalwood', 'ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಸಮಾಚಾರ'),
  ('ಬಾಲಿವುಡ್', 'Bollywood', 'bollywood', 'ಹಿಂದಿ ಸಿನಿಮಾ ಸುದ್ದಿ'),
  ('ಹಾಲಿವುಡ್', 'Hollywood', 'hollywood', 'ಅಂತರರಾಷ್ಟ್ರೀಯ ಸಿನಿಮಾ ಸುದ್ದಿ'),
  ('ನಟರು', 'Actors', 'actors', 'ನಟರ ಸುದ್ದಿ'),
  ('ನಟಿಯರು', 'Actresses', 'actresses', 'ನಟಿಯರ ಸುದ್ದಿ'),
  ('ಸಂದರ್ಶನ', 'Interviews', 'interviews', 'ಸಂದರ್ಶನಗಳು'),
  ('ಗಾಸಿಪ್', 'Gossip', 'gossip', 'ಸಿನಿಮಾ ಗಾಸಿಪ್'),
  ('ಫೋಟೋ ಗ್ಯಾಲರಿ', 'Photo Gallery', 'gallery', 'ಫೋಟೋ ಗ್ಯಾಲರಿ'),
  ('ವಿಡಿಯೋಗಳು', 'Videos', 'videos', 'ಟ್ರೇಲರ್ ಮತ್ತು ವಿಡಿಯೋ'),
  ('OTT ಅಪ್ಡೇಟ್', 'OTT Updates', 'ott', 'OTT ಬಿಡುಗಡೆಗಳು'),
  ('ಬಾಕ್ಸ್ ಆಫೀಸ್', 'Box Office', 'box-office', 'ಬಾಕ್ಸ್ ಆಫೀಸ್ ವರದಿ'),
  ('ಮುಂಬರುವ ಸಿನಿಮಾಗಳು', 'Upcoming Movies', 'upcoming', 'ಮುಂಬರುವ ಸಿನಿಮಾಗಳು')
on conflict (slug) do nothing;

alter table public.articles
  alter column content drop not null,
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists source_id text,
  add column if not exists excerpt text,
  add column if not exists is_scraped boolean not null default false,
  add column if not exists fetched_at timestamptz,
  add column if not exists published_at_estimated boolean not null default false,
  add column if not exists coverage_count integer not null default 1,
  add column if not exists alt_sources jsonb not null default '[]'::jsonb;

create unique index if not exists uq_articles_source_url
  on public.articles(source_url) where source_url is not null;

create index if not exists idx_articles_scraped_feed
  on public.articles(status, published_at desc) where is_scraped = true;

create table if not exists public.ingest_runs (
  id uuid primary key default gen_random_uuid(),
  source_id text not null,
  status text not null check (status in ('success', 'partial', 'failed')),
  discovered integer not null default 0,
  fetched integer not null default 0,
  inserted integer not null default 0,
  merged integer not null default 0,
  skipped integer not null default 0,
  errors integer not null default 0,
  duration_ms integer not null default 0,
  message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.ingest_runs enable row level security;

drop policy if exists "Ingest runs are publicly readable" on public.ingest_runs;
create policy "Ingest runs are publicly readable"
  on public.ingest_runs for select using (true);

alter table public.articles replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'articles'
  ) then
    alter publication supabase_realtime add table public.articles;
  end if;
end $$;
```

Existing RLS policy `Public articles are viewable by everyone` already limits anonymous reads to
`status = 'published'`. Service-role ingestion bypasses RLS. No new article write policy is added.

### 5.2 Type changes

In [`src/types/index.ts`](../../../src/types/index.ts):

- `content` becomes optional (`content?: string`).
- Add `excerpt?: string`.
- Add `source?: { name: string; url: string; id: string; publishedAtEstimated: boolean }`.
- Add `coverageCount?: number`.
- Add `altSources?: { name: string; url: string }[]`.
- Add `isScraped?: boolean`.
- Add `fetchedAt?: string`.
- Add `publishedAtEstimated?: boolean`.

`views` remains but is no longer rendered when `0`. `isBreaking` for scraped articles is computed
at read time (see 8.2), not trusted from the source.

---

## 6. API

### 6.1 `GET|POST /api/ingest`

- Runtime: Node.js. `export const dynamic = "force-dynamic"`.
- `GET` is used by Supabase `pg_net` and Vercel Cron; `POST` is used for manual runs.
- Auth: require `Authorization: Bearer <CRON_SECRET>` or `x-ingest-secret: <CRON_SECRET>`.
  Compare with `crypto.timingSafeEqual`. If `CRON_SECRET` is unset, return 503 with a setup message.
- Response: `{ ok, durationMs, sources: IngestResult[], inserted, merged, errors }`.
- Status: 200 on success, 207 when at least one source failed, 401 auth, 503 missing config.
- No caching. Never expose stack traces or secrets.
- `maxDuration = 10` (Vercel Hobby limit). The run budgets under 7 seconds: three sources in
  parallel, three articles each, no image downloads.

### 6.2 `GET /api/articles`

Query parameters:

- `category` — a `CategorySlug`.
- `q` — search across `title`, `excerpt`, `tags` (case-insensitive, 2+ characters).
- `limit` — default 20, max 50.
- `cursor` — ISO `published_at` of the last item.

Returns published articles sorted by `published_at desc`, mapped to the public `Article` type.
Only published rows are returned. If Supabase is unconfigured, returns demo seed data with
`meta.demo = true`.

### 6.3 `GET /api/feed/version`

Returns `{ latestPublishedAt: string | null, count: number, demo: boolean }`, cached for 15 seconds.
Used by the realtime fallback poller.

### 6.4 Scheduling (free tier)

Primary scheduler: Supabase Free `pg_cron` + `pg_net`, every five minutes. No Vercel Pro plan.

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Store the secret once in Supabase Vault:
-- select vault.create_secret('<long-random-value>', 'ingest_secret');

select cron.schedule(
  'sini-ingest',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://<your-site>/api/ingest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-ingest-secret',
      (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Keep the free database small:
select cron.schedule(
  'sini-ingest-cleanup',
  '0 3 * * *',
  $$ delete from public.ingest_runs where started_at < now() - interval '14 days'; $$
);
```

- Set the same value as the Vercel `CRON_SECRET` so manual `pg_net` calls authenticate.
- `pg_net` is asynchronous; `pg_cron` does not wait for the HTTP response. Failures are recorded by
  the route in `ingest_runs`.
- **Fallbacks, all free:**
  - Vercel Hobby native cron, daily only:
    `{"crons":[{"path":"/api/ingest","schedule":"0 0 * * *"}]}`.
  - GitHub Actions scheduled workflow. Free for public repos; private repos get 2,000 free
    minutes/month, so a 30-minute cadence fits.
- Manual trigger:

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## 7. Realtime

### 7.1 Server

- Home, category, and article pages render initial data as server components.
- Article queries use a 60-second cache (`revalidate: 60`), so a missed websocket event still
  converges within a minute.
- The layout mounts `LiveFeedProvider` with `initialLastUpdated` (latest `published_at` or
  `fetched_at`) and active source count.

### 7.2 Client

`LiveFeedProvider`:

- Creates a Supabase browser channel on mount when `isSupabaseConfigured()`.
- Subscribes to `postgres_changes`:
  - `INSERT` and `UPDATE` on `public.articles` with filter `status=eq.published`.
- On event:
  - Increment the pending-story count.
  - Store the newest event payload for the pill.
  - If auto-refresh is on, debounce 2 seconds then call `router.refresh()`.
  - If auto-refresh is off, show `NewStoriesPill`; clicking it calls `router.refresh()` and resets.
- Connection states: `connecting`, `live`, `reconnecting`, `offline`. Shown in `LiveDeskBar`.
- Cleanup: remove the channel on unmount.
- Fallback: if the channel errors or is unconfigured, poll `/api/feed/version` every 45 seconds.
  When `latestPublishedAt` changes, call `router.refresh()`.

### 7.3 LiveDeskBar

Server-fed values plus client ticking:

- Pulsing red dot + `ಲೈವ್` or `ಮರುಸಂಪರ್ಕ`.
- `ಕೊನೆಯ ನವೀಕರಣ: 2 ನಿಮಿಷ ಹಿಂದೆ` — updates every 30 seconds.
- `ಇಂದು 24 ಸುದ್ದಿ` — count of published scraped articles since midnight Asia/Kolkata (IST).
- `3 ಮೂಲಗಳು` — active sources with at least one published article in the last 24 hours.
- Right side: manual refresh button and an auto-refresh toggle (default on, persisted in
  `localStorage` key `sini_auto_refresh`).

---

## 8. Accuracy and trust rules

1. **No fabricated metrics.** Scraped articles never show invented views, likes, read times, or
   author names. The source name occupies the author slot.
2. **Honest timestamps.** If the source provides `published_at`, show it with an exact timestamp on
   hover/`title`. If not, store `fetched_at` and label the UI `ಈಗ ತಿಳಿದುಬಂದಿದೆ`; never present the
   fetch time as the publication time.
3. **Breaking is earned.** A scraped article is labeled `ಬ್ರೇಕಿಂಗ್` only when it is under 60 minutes
   old **and** `coverage_count >= 2`, or when an editor sets `is_breaking` manually. Otherwise it is
   `ಹೊಸದು` or `ತಾಜಾ`.
4. **Trending is coverage.** The trending rail orders by `coverage_count desc, published_at desc`
   over the last 48 hours. Coverage comes from real cross-source dedupe merges.
5. **Demo mode is visible.** When Supabase is unconfigured or unreachable, public pages may render
   seed data, but must show a persistent `ಡೆಮೊ ಡೇಟಾ` badge near the live desk. Once Supabase is
   configured and returns at least one published scraped article, seed data is not merged into
   public lists.
6. **Attribution everywhere.** Every scraped card and article page names the source and links to the
   canonical URL. The footer lists all active sources and the last successful ingest time.
7. **Corrections surface.** If a merge is wrong, editors can unmerge in the admin panel (Phase 2
   follow-up; Phase 1 exposes the stored `alt_sources` read-only).

---

## 9. Layout — Live Newsroom

### 9.1 Global

- Container: `max-w-7xl`, 16px mobile / 24px desktop gutters.
- Spacing rhythm: 8px base; section gap 40px mobile / 56px desktop.
- Typography: existing Hubballi + Noto Sans Kannada; headlines use `font-extrabold`, metadata uses
  `text-[11px]`–`text-xs`; body copy 14–16px.
- Colors: existing brand tokens; add no new palette. Red is reserved for live/breaking; amber for
  top story; emerald for fresh.
- Cards: `rounded-xl`, 1px `brand-border`, hover lifts border to `brand-red/60` and translates
  `-2px`; no heavy shadows.
- All images use `next/image` with explicit `sizes`. Scraped images use `unoptimized` with their
  source CDN URL; editorial images use normal optimization.
- Use the source host's image URL with `referrerPolicy="no-referrer"` where the host allows it; fall
  back to a branded gradient placeholder if an image fails to load.

### 9.2 Header

- Remove the fake 728×90 ad placeholder from the branding bar; it competes with the live desk.
- Utility bar: date, live badge, OTT, box office, admin link.
- Branding bar: logo + search trigger; search expands inline.
- Sticky category nav remains, with the active category highlighted.
- Add a small live dot to the utility bar that mirrors `LiveDeskBar` state.

### 9.3 Homepage order

1. `LiveDeskBar`
2. `BreakingTicker` (real breaking/fresh headlines, source chip, relative time)
3. Hero: 8-col lead + 4-col `LiveBriefs` (four compact rows: 72×72 thumbnail, 2-line headline,
   source + time)
4. Latest grid (8 cols) + sidebar (4 cols)
   - Grid: six `ArticleCard` items, 2×3 on desktop, 1 column mobile.
   - Sidebar: trending top 5 by coverage, OTT mini-list, one sidebar ad.
5. Sandalwood Special: four-card rail; horizontal scroll on mobile.
6. Reviews: three poster cards with star rating and verdict.
7. Box Office: table with `updated_at` and source note.
8. OTT: platform chips + three upcoming cards with countdown.
9. Photo gallery: existing lightbox, tightened grid.
10. Footer banner ad (if configured), then footer with sources.

### 9.4 Article card

- 16:9 image (or 4:3 for reviews), category chip, 2-line headline, 2-line excerpt.
- Metadata row: `SourceBadge` + `FreshnessBadge`.
- No view count when `views === 0`; no read-time claim for scraped articles.
- Hover: image scale 1.03, headline color `brand-red`.
- Keyboard: whole card is one link; focus ring visible.

### 9.5 Article page

For `isScraped` articles:

- Breadcrumb: category → source.
- Hero image with caption (if any).
- Category + fresh badge.
- Title, excerpt.
- Source card: source name, published time (or estimated label), canonical link button
  `ಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ →` with `rel="noopener noreferrer"` and `target="_blank"`.
- `ಇದನ್ನು ವರದಿ ಮಾಡಿದವರು` row if `altSources` has entries.
- Related stories (same category, latest three).
- Share row (existing component).
- Comments remain, but label seeded comments as demo when in demo mode.

For editorial articles (manual/admin), keep the existing full-content layout and author block.

### 9.6 Category and search pages

- Category header: Kannada name, live count, last updated, sort chip (`ಹೊಸದು` default).
- List uses `ArticleCard variant="horizontal"` on desktop.
- Search: 300 ms debounce, queries `/api/articles?q=`, shows result count and "no results" state;
  no client-side fake filtering over the entire seed set.

### 9.7 Responsive

- `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
- Hero stacks lead then briefs.
- Sidebar moves below the latest grid.
- Rails become horizontal scroll with snap points.
- Touch targets ≥ 44px.
- Sticky nav remains; no sticky bottom bar in Phase 1.

### 9.8 Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`.
- Each section has a visible or screen-reader heading.
- Live regions: the ticker and new-stories pill use `aria-live="polite"`; the live dot has an
  accessible label.
- Auto-refresh refresh must not steal focus or scroll position (`router.refresh()` preserves scroll).
- Color contrast meets WCAG AA on the dark palette.
- Pause control on the ticker and on auto-refresh.

---

## 10. Security and compliance

- `SUPABASE_SERVICE_ROLE_KEY` is server-only; never prefixed `NEXT_PUBLIC_`.
- Ingest route requires a timing-safe secret comparison.
- Scraped text is stored as plain text, escaped by React, and never passed to
  `dangerouslySetInnerHTML`.
- No scraped HTML is stored or rendered.
- All outbound article URLs must match adapter host allowlists; private IPs and non-HTTPS URLs are
  rejected, preventing SSRF.
- When `INGEST_STORE_IMAGES=true`, image downloads validate `content-type`, size, and host before
  upload. The default is `false`, so no media is stored.
- Rate limiting, robots.txt, bot UA, and canonical attribution are mandatory.
- **Content policy:** store and display a headline, a ≤240-character excerpt, an image, a timestamp,
  and a link. Do not store or render full scraped bodies. This is still third-party content;
  counsel should review before commercial launch.
- Retention: scraped articles older than 90 days may be pruned by a weekly task (Phase 2). Phase 1
  keeps them.
- Secrets in `.env.example` are placeholders only.

---

## 11. Configuration

Add to `.env.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Ingestion
CRON_SECRET=
INGEST_USER_AGENT=SiniKannadaBot/1.0 (+https://sinikannada.com/bot)
INGEST_MAX_PER_SOURCE=3
INGEST_REQUEST_DELAY_MS=1000
INGEST_STORE_IMAGES=false

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Validation rules:

- `SUPABASE_SERVICE_ROLE_KEY` missing → `/api/ingest` returns 503 with setup instructions.
- `CRON_SECRET` missing → `/api/ingest` returns 503.
- The same secret must exist in Supabase Vault for the `pg_cron` job.
- `NEXT_PUBLIC_SUPABASE_*` missing → public pages use demo mode with a visible badge.
- `INGEST_STORE_IMAGES` defaults to `false`; enabling it uses the free 1 GB Supabase bucket.

---

## 12. Observability

- `ingest_runs` records every adapter run and an `all` summary row.
- `/api/ingest` response includes counts and duration.
- Admin page shows the last 10 runs: source, status, fetched/inserted/merged/errors, duration,
  started time. Read-only in Phase 1.
- Footer shows the latest successful `all` run time and active sources.
- Errors are logged server-side with source id and URL, never with secrets or full HTML dumps.
- `ingest_runs` is pruned nightly to the last 14 days by `pg_cron` to stay inside the free DB.

---

## 13. Testing and verification

### Automated

- `vitest` with saved HTML fixtures for each adapter (listing + one article). Fixtures are trimmed
  to the relevant markup, max 200 KB each.
- Unit tests:
  - Each adapter extracts the expected title, excerpt, image, date, canonical URL.
  - Normalizer strips site suffixes, decodes entities, trims at sentence boundary.
  - Category rules map Kannada and English cases correctly, including fallback.
  - Slug generation handles Kannada-only URLs and collisions.
  - Dedupe similarity merges near-identical titles and rejects unrelated ones.
  - `canFetch()` respects robots disallow rules.
- Route tests:
  - `/api/ingest` rejects missing/invalid secrets.
  - `/api/ingest` returns 503 when Supabase service key is missing.
  - `/api/articles` clamps `limit` and handles `q`.
- Store tests with an in-memory repository: insert, idempotent URL upsert, merge increments
  `coverage_count`, primary title is preserved.

### Manual

1. Apply the migration in the Supabase SQL editor.
2. Enable `pg_cron` and `pg_net`, create the Vault secret, and schedule `sini-ingest` and
   `sini-ingest-cleanup`.
3. Set env vars and run `npm run dev`.
4. Trigger ingest with `curl`; confirm rows in `articles` and `ingest_runs`.
5. Open `/` and `/news/<slug>`; confirm source, timestamp, excerpt, external link.
6. Open two browser tabs; trigger ingest; confirm the new-stories pill and refresh behavior.
7. Test at 390px, 768px, and 1440px.
8. Run `npm run build`; it must pass with no type errors.

### Definition of done

- Three sources ingest real Kannada articles end-to-end.
- Duplicate stories merge and increment coverage.
- Homepage, category, article, and search pages render live Supabase data.
- Realtime pill works with auto-refresh on and off.
- Demo badge appears only when unconfigured.
- No fabricated metrics appear for scraped articles.
- Build and tests pass.
- Source attribution and link-out are visible on every scraped story.
- The entire stack runs on free tiers: Supabase Free, Vercel Hobby (or another free host), OSS
  libraries, and source CDN images. No paid API keys or services are required.
- Scheduling works through `pg_cron` + `pg_net`; the site still updates if Vercel Cron never runs.

---

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Source markup changes | Fixture tests, adapter isolation, ingest health panel |
| Free-tier quota pressure (DB, storage, images) | 3 articles/source, no image uploads, unoptimized images, 14-day `ingest_runs` pruning |
| Supabase free project pause | `pg_cron` keeps activity alive; resume manually if paused |
| Hotlink protection on images | Optional `INGEST_STORE_IMAGES` upload; branded placeholder fallback |
| Vercel Hobby commercial-use restriction | Use Cloudflare Pages/Workers Free or Netlify Free for an ad-supported launch |
| Scraping a disallowed source | robots.txt checked before every fetch; Oneindia removed from the source list |
| Copyright/republishing | Headline + excerpt + link only; attribution; legal review |
| Duplicate false positives | 0.62 similarity threshold + 48h window + canonical URL exact match |
| Realtime quota/connection issues | ISR 60s + 45s polling fallback |
| Scraping blocked (403/429) | Browser-compatible UA, throttling, retry, per-source failure isolation |
| Fake data leaks to production | Demo mode only when Supabase unconfigured; visible badge |
| Service role key exposure | Server-only env; never imported into client components |
| Scraper drift causing silent staleness | `ingest_runs` status + footer last-sync time + admin panel |

---

## 15. Phase 2 backlog (explicitly out of scope)

- Box Office and OTT scrapers with numeric validation.
- Admin "Run ingest" button and merge correction tools.
- Real view tracking and a read-count-based trending blend.
- Additional sources (Chitraloka, Udayavani, Kannada Prabha) with headless rendering if needed.
- 90-day retention pruning.
- Production admin authentication.
- Image optimization pipeline (thumbnails, WebP).

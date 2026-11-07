# Live Data Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scrape three free Kannada news sources into Supabase on a five-minute free-tier schedule, with honest timestamps, deduplication, coverage merging, and a read layer the existing pages can consume.

**Architecture:** A self-contained ingestion library (`src/lib/ingest`) fetches robots-permitted listing pages, parses `og:*` metadata with cheerio, normalizes and categorizes stories, merges cross-source duplicates by title similarity, and writes headline/excerpt rows to Supabase through a service-role repository. Supabase `pg_cron` + `pg_net` call `GET /api/ingest` every five minutes. The existing `DataService` reads live rows first and falls back to seed data only when Supabase is unconfigured or empty, enabling a visible demo badge.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript strict, Supabase Free (Postgres, RLS, Realtime), `cheerio`, `robots-parser`, Vitest, Node 20+.

**Spec:** [docs/superpowers/specs/2026-10-31-live-newsroom-design.md](../specs/2026-10-31-live-newsroom-design.md)

## Global Constraints

- **Free tier only.** Supabase Free, Vercel Hobby (or another free host), OSS libraries, and source CDN images. No paid APIs, proxies, translation, image storage, or hosting plans.
- **Robots-permitted sources only.** Filmibeat Kannada, Vijaya Karnataka, News18 Kannada. Never scrape Oneindia Kannada (`Disallow: /`).
- **Content depth.** Store and display only a headline, a ≤240-character excerpt, an image URL, a timestamp, and a canonical link. Never store or render full scraped bodies.
- **No fabricated metrics.** Scraped rows store `views = 0` and `read_time_minutes = 0`; the UI never renders either when zero.
- **Honest timestamps.** When the source has no publication time, store `published_at = fetched_at` and `published_at_estimated = true`.
- **Server-only secrets.** `SUPABASE_SERVICE_ROLE_KEY` and `CRON_SECRET` must never be prefixed `NEXT_PUBLIC_`.
- **SSRF guard.** Every outbound article URL must be HTTPS, use an allowed host, and carry no credentials or non-standard port.
- **Function budget.** `/api/ingest` must target under 7 seconds and export `maxDuration = 10` for Vercel Hobby.
- **No image downloads by default.** `INGEST_STORE_IMAGES=false`; store source CDN URLs.
- **Commands** run from the repository root with Git Bash on Windows.

---

### Task 1: Tooling, shared types, and the category source of truth

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/categories.ts`
- Modify: `src/data/mockData.ts:1-23`
- Modify: `src/types/index.ts:27-55`
- Test: `tests/categories.test.ts`

**Interfaces:**
- Produces: `CATEGORIES: Category[]`, `categoryName(slug: string): string`, `categoryHref(slug: string): string`
- Produces: `Article.content?: string`, `Article.excerpt?: string`, `Article.source?: { id; name; url; publishedAtEstimated }`, `Article.coverageCount?: number`, `Article.altSources?: { name; url }[]`, `Article.isScraped?: boolean`, `Article.fetchedAt?: string`, `Article.publishedAtEstimated?: boolean`

- [ ] **Step 1: Write the failing test**

Create `tests/categories.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CATEGORIES, categoryHref, categoryName } from "@/lib/categories";

describe("categories", () => {
  it("contains all fifteen category slugs exactly once", () => {
    expect(CATEGORIES).toHaveLength(15);
    expect(new Set(CATEGORIES.map((category) => category.slug)).size).toBe(15);
  });

  it("returns the Kannada name for a known slug and falls back safely", () => {
    expect(categoryName("sandalwood")).toBe("ಸ್ಯಾಂಡಲ್ವುಡ್");
    expect(categoryName("does-not-exist")).toBe("ಸುದ್ದಿ");
  });

  it("builds the home link for mukhaputa and category links for everything else", () => {
    expect(categoryHref("mukhaputa")).toBe("/");
    expect(categoryHref("ott")).toBe("/category/ott");
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run tests/categories.test.ts`
Expected: FAIL because `src/lib/categories.ts` does not exist.

- [ ] **Step 3: Add dependencies and scripts**

Run:

```bash
npm install cheerio@^1.2.0 robots-parser@^3.0.1
npm install -D vitest@^5.0.5
```

Then edit `package.json` scripts to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "typecheck": "tsc --noEmit"
}
```

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    restoreMocks: true,
  },
});
```

- [ ] **Step 4: Create the category module**

Create `src/lib/categories.ts`:

```ts
import type { Category, CategorySlug } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "1", name: "ಮುಖಪುಟ", englishName: "Home", slug: "mukhaputa", description: "ಸಿನಿ ಕನ್ನಡ ಮುಖಪುಟ - ಇತ್ತೀಚಿನ ತಾಜಾ ಸುದ್ದಿ ಮತ್ತು ಮನರಂಜನೆ" },
  { id: "2", name: "ಇತ್ತೀಚಿನ ಸುದ್ದಿ", englishName: "Latest News", slug: "latest", description: "ಸ್ಯಾಂಡಲ್ವುಡ್ ಮತ್ತು ಭಾರತೀಯ ಚಿತ್ರರಂಗದ ಕ್ಷಣಕ್ಷಣದ ಸುದ್ದಿ" },
  { id: "3", name: "ಸಿನಿಮಾ ವಿಮರ್ಶೆ", englishName: "Movie Reviews", slug: "reviews", description: "ಕನ್ನಡ ಸಿನಿಮಾಗಳ ನೈಜ ಹಾಗೂ ನಿಷ್ಪಕ್ಷಪಾತ ವಿಮರ್ಶೆಗಳು" },
  { id: "4", name: "ಸ್ಯಾಂಡಲ್ವುಡ್", englishName: "Sandalwood", slug: "sandalwood", description: "ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಸಂಪೂರ್ಣ ಸಮಾಚಾರ ಮತ್ತು ವಿಶೇಷ ವರದಿಗಳು" },
  { id: "5", name: "ಬಾಲಿವುಡ್", englishName: "Bollywood", slug: "bollywood", description: "ಹಿಂದಿ ಸಿನಿ ಜಗತ್ತಿನ ತಾಜಾ ಗಾಸಿಪ್ ಮತ್ತು ಅಪ್ಡೇಟ್ಸ್" },
  { id: "6", name: "ಹಾಲಿವುಡ್", englishName: "Hollywood", slug: "hollywood", description: "ವಿಶ್ವ ಸಿನಿಮಾಗಳ ಸಮಾಚಾರ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ಚಿತ್ರಗಳು" },
  { id: "7", name: "ನಟರು", englishName: "Actors", slug: "actors", description: "ಕನ್ನಡದ ಸ್ಟಾರ್ ನಟರ ವೈಯಕ್ತಿಕ ಮತ್ತು ವೃತ್ತಿ ಬದುಕಿನ ಸುದ್ದಿ" },
  { id: "8", name: "ನಟಿಯರು", englishName: "Actresses", slug: "actresses", description: "ಖ್ಯಾತ ನಟಿಯರ ಹೊಸ ಪ್ರಾಜೆಕ್ಟ್, ಫ್ಯಾಷನ್ ಮತ್ತು ಸಂದರ್ಶನಗಳು" },
  { id: "9", name: "ಸಂದರ್ಶನ", englishName: "Interviews", slug: "interviews", description: "ತಾರೆಯರೊಂದಿಗೆ ನೇರ ಮಾತುಕತೆ ಮತ್ತು ವಿಶೇಷ ಸಂದರ್ಶನಗಳು" },
  { id: "10", name: "ಗಾಸಿಪ್", englishName: "Gossip", slug: "gossip", description: "ಗಾಂಧಿನಗರದ ಒಳಗುಟ್ಟು ಮತ್ತು ಸಿನಿಮಾ ಜಗತ್ತಿನ ಬಿಸಿಬಿಸಿ ಚರ್ಚೆಗಳು" },
  { id: "11", name: "ಫೋಟೋ ಗ್ಯಾಲರಿ", englishName: "Photo Gallery", slug: "gallery", description: "ತಾರೆಯರ ಆಕರ್ಷಕ ಫೋಟೋಗಳು ಮತ್ತು ಸಿನಿಮಾ ಇವೆಂಟ್ಸ್" },
  { id: "12", name: "ವಿಡಿಯೋಗಳು", englishName: "Videos", slug: "videos", description: "ಹೊಸ ಟ್ರೇಲರ್‌ಗಳು, ಟೀಸರ್‌ಗಳು ಮತ್ತು ಹಾಡುಗಳ ವಿಡಿಯೋಗಳು" },
  { id: "13", name: "OTT ಅಪ್ಡೇಟ್", englishName: "OTT Updates", slug: "ott", description: "ನೆಟ್‌ಫ್ಲಿಕ್ಸ್, ಅಮೆಜಾನ್ ಪ್ರೈಮ್, ಜೀ5 ನಲ್ಲಿ ಕನ್ನಡ ಸಿನಿಮಾಗಳು" },
  { id: "14", name: "ಬಾಕ್ಸ್ ಆಫೀಸ್", englishName: "Box Office", slug: "box-office", description: "ಕನ್ನಡ ಸಿನಿಮಾಗಳ ಗಳಿಕೆ ಮತ್ತು ಬಾಕ್ಸ್ ಆಫೀಸ್ ವರದಿಗಳು" },
  { id: "15", name: "ಮುಂಬರುವ ಸಿನಿಮಾಗಳು", englishName: "Upcoming Movies", slug: "upcoming", description: "ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ತೆರೆಕಾಣಲಿರುವ ನಿರೀಕ್ಷಿತ ಚಿತ್ರಗಳು" },
];

const BY_SLUG = new Map(CATEGORIES.map((category) => [category.slug, category]));

export function categoryName(slug: string): string {
  return BY_SLUG.get(slug as CategorySlug)?.name ?? "ಸುದ್ದಿ";
}

export function categoryHref(slug: string): string {
  return slug === "mukhaputa" ? "/" : `/category/${slug}`;
}
```

- [ ] **Step 5: Make mockData re-export the shared list**

In `src/data/mockData.ts`, remove the `Category` import and the entire `CATEGORIES` literal (lines 12-23 in the current file), then add at the top of the exports:

```ts
export { CATEGORIES } from "@/lib/categories";
```

The rest of the file stays unchanged. Existing imports of `CATEGORIES` from `@/data/mockData` keep working.

- [ ] **Step 6: Extend the Article type**

In `src/types/index.ts`, replace the `Article` interface with:

```ts
export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  summary: string;
  content?: string;
  excerpt?: string;
  category: CategorySlug;
  categoryName: string;
  tags: string[];
  featuredImage: string;
  imageCaption?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  views: number;
  isBreaking?: boolean;
  isTopStory?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  status: "published" | "draft" | "scheduled";
  relatedArticleIds?: string[];
  source?: {
    id: string;
    name: string;
    url: string;
    publishedAtEstimated: boolean;
  };
  coverageCount?: number;
  altSources?: { name: string; url: string }[];
  isScraped?: boolean;
  fetchedAt?: string;
  publishedAtEstimated?: boolean;
}
```

- [ ] **Step 7: Run the test and typecheck**

Run: `npx vitest run tests/categories.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS. If `mockData.ts` still references `Category`, remove that import.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/categories.ts src/data/mockData.ts src/types/index.ts tests/categories.test.ts
git commit -m "chore: add vitest, shared categories, and live article fields"
```

---

### Task 2: Supabase migration, category seed, merge RPC, and realtime publication

**Files:**
- Create: `supabase/migrations/202610310001_live_feed.sql`
- Test: `tests/migration.test.ts`

**Interfaces:**
- Produces: `articles` columns `source_name`, `source_url`, `source_id`, `excerpt`, `is_scraped`, `fetched_at`, `published_at_estimated`, `coverage_count`, `alt_sources`
- Produces: `public.ingest_runs` table
- Produces: `public.merge_article_source(uuid, text, text, timestamptz, boolean, timestamptz)`

- [ ] **Step 1: Write the failing contract test**

Create `tests/migration.test.ts`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  path.join(process.cwd(), "supabase/migrations/202610310001_live_feed.sql"),
  "utf8",
);

describe("live feed migration", () => {
  it("seeds all fifteen categories before altering articles", () => {
    const seedIndex = sql.indexOf("insert into public.categories");
    const alterIndex = sql.indexOf("alter table public.articles");
    expect(seedIndex).toBeGreaterThanOrEqual(0);
    expect(alterIndex).toBeGreaterThan(seedIndex);
    for (const slug of ["mukhaputa", "sandalwood", "reviews", "ott", "box-office", "upcoming"]) {
      expect(sql).toContain(`'${slug}'`);
    }
  });

  it("adds the scraped article columns", () => {
    for (const column of [
      "source_name",
      "source_url",
      "source_id",
      "excerpt",
      "is_scraped",
      "fetched_at",
      "published_at_estimated",
      "coverage_count",
      "alt_sources",
    ]) {
      expect(sql).toContain(column);
    }
    expect(sql).toContain("alter column content drop not null");
  });

  it("creates ingest runs and the merge function", () => {
    expect(sql).toContain("create table if not exists public.ingest_runs");
    expect(sql).toContain("create or replace function public.merge_article_source");
    expect(sql).toContain("coverage_count = coverage_count +");
    expect(sql).toContain("supabase_realtime");
    expect(sql).toContain("replica identity full");
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run tests/migration.test.ts`
Expected: FAIL because the migration file does not exist.

- [ ] **Step 3: Write the migration**

Run the base schema first in the Supabase SQL editor (`supabase_schema.sql`), because this migration references `public.categories` and `public.articles`.

Create `supabase/migrations/202610310001_live_feed.sql`:

```sql
-- ==========================================================
-- Sini Kannada live feed migration
-- Free-tier compatible: no extensions beyond Supabase defaults.
-- ==========================================================

-- 0. Seed categories first; articles.category_slug references this table.
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

-- 1. Scraped article support. Editorial rows keep their full content.
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

-- 2. Ingest health log.
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

create index if not exists idx_ingest_runs_started
  on public.ingest_runs(started_at desc);

alter table public.ingest_runs enable row level security;

drop policy if exists "Ingest runs are publicly readable" on public.ingest_runs;
create policy "Ingest runs are publicly readable"
  on public.ingest_runs for select using (true);

-- 3. Realtime. Replica identity full lets UPDATE payloads carry the row.
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

-- 4. Cross-source merge. Idempotent per source URL.
create or replace function public.merge_article_source(
  p_primary_id uuid,
  p_source_url text,
  p_source_name text,
  p_published_at timestamptz,
  p_published_at_estimated boolean,
  p_fetched_at timestamptz
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alt jsonb;
  v_is_new boolean;
  v_published_at timestamptz;
  v_estimated boolean;
begin
  select coalesce(alt_sources, '[]'::jsonb), published_at, published_at_estimated
    into v_alt, v_published_at, v_estimated
  from public.articles
  where id = p_primary_id;

  if not found then
    return;
  end if;

  v_is_new := not exists (
    select 1 from jsonb_array_elements(v_alt) as item
    where item->>'url' = p_source_url
  );

  if v_is_new then
    v_alt := v_alt || jsonb_build_array(
      jsonb_build_object('name', p_source_name, 'url', p_source_url)
    );
    if jsonb_array_length(v_alt) > 5 then
      select coalesce(jsonb_agg(item order by ord), '[]'::jsonb)
        into v_alt
      from jsonb_array_elements(v_alt) with ordinality as t(item, ord)
      where ord <= 5;
    end if;
  end if;

  if p_published_at is not null then
    if v_published_at is null
       or (v_estimated and not coalesce(p_published_at_estimated, true))
       or (v_estimated = coalesce(p_published_at_estimated, true)
           and p_published_at < v_published_at)
    then
      v_published_at := p_published_at;
      v_estimated := coalesce(p_published_at_estimated, true);
    end if;
  end if;

  update public.articles
  set alt_sources = v_alt,
      coverage_count = coverage_count + (case when v_is_new then 1 else 0 end),
      published_at = v_published_at,
      published_at_estimated = v_estimated,
      fetched_at = greatest(coalesce(fetched_at, p_fetched_at, now()), coalesce(p_fetched_at, now())),
      updated_at = now()
  where id = p_primary_id;
end;
$$;

revoke all on function public.merge_article_source(uuid, text, text, timestamptz, boolean, timestamptz) from public;
revoke all on function public.merge_article_source(uuid, text, text, timestamptz, boolean, timestamptz) from anon, authenticated;
grant execute on function public.merge_article_source(uuid, text, text, timestamptz, boolean, timestamptz) to service_role;
```

- [ ] **Step 4: Run the migration test**

Run: `npx vitest run tests/migration.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/202610310001_live_feed.sql tests/migration.test.ts
git commit -m "feat: add live feed migration, category seed, and merge RPC"
```

---

### Task 3: Polite fetcher, robots checker, and timing-safe auth

**Files:**
- Create: `src/lib/ingest/fetcher.ts`
- Create: `src/lib/ingest/robots.ts`
- Create: `src/lib/ingest/auth.ts`
- Test: `tests/fetcher.test.ts`
- Test: `tests/robots.test.ts`
- Test: `tests/auth.test.ts`

**Interfaces:**
- Produces: `assertAllowedUrl(rawUrl: string, allowedHosts: string[]): URL`
- Produces: `createPoliteFetcher(options: PoliteFetcherOptions): { fetchText(url: string): Promise<string> }`
- Produces: `canFetch(url: string, robotsTxt: string | null, userAgent: string): boolean`
- Produces: `createRobotsChecker(fetcher, userAgent): { isAllowed(url: string, userAgent: string): Promise<boolean> }`
- Produces: `isAuthorized(authorization: string | null, secretHeader: string | null, ingestSecret: string | null): boolean`
- Produces: `INGEST_BOT_TOKEN = "SiniKannadaBot"`

- [ ] **Step 1: Write the failing fetcher tests**

Create `tests/fetcher.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { assertAllowedUrl, createPoliteFetcher } from "@/lib/ingest/fetcher";

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "text/html" } });
}

describe("assertAllowedUrl", () => {
  it("accepts an allowed HTTPS host", () => {
    expect(assertAllowedUrl("https://kannada.filmibeat.com/news/a.html", ["filmibeat.com"])).toBeInstanceOf(URL);
  });

  it("rejects http, credentials, non-standard ports, and unknown hosts", () => {
    expect(() => assertAllowedUrl("http://kannada.filmibeat.com/a", ["filmibeat.com"])).toThrow(/https/i);
    expect(() => assertAllowedUrl("https://user:pass@kannada.filmibeat.com/a", ["filmibeat.com"])).toThrow(/credentials/i);
    expect(() => assertAllowedUrl("https://kannada.filmibeat.com:8443/a", ["filmibeat.com"])).toThrow(/port/i);
    expect(() => assertAllowedUrl("https://evil.example/a", ["filmibeat.com"])).toThrow(/not allowed/i);
    expect(() => assertAllowedUrl("https://127.0.0.1/a", ["127.0.0.1"])).toThrow(/private/i);
  });
});

describe("createPoliteFetcher", () => {
  it("returns text and sends the bot user agent", async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>)["User-Agent"]).toContain("SiniKannadaBot");
      return htmlResponse("ok");
    });
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
    });
    await expect(fetcher.fetchText("https://example.com/a")).resolves.toBe("ok");
  });

  it("retries one transient failure", async () => {
    let calls = 0;
    const fetchImpl = vi.fn(async () => {
      calls += 1;
      return calls === 1 ? htmlResponse("busy", 503) : htmlResponse("ok");
    });
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
      sleep: async () => undefined,
      now: () => 0,
    });
    await expect(fetcher.fetchText("https://example.com/a")).resolves.toBe("ok");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("waits between requests to the same host", async () => {
    const sleeps: number[] = [];
    let clock = 0;
    const fetchImpl = vi.fn(async () => htmlResponse("ok"));
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 1000,
      sleep: async (ms) => {
        sleeps.push(ms);
        clock += ms;
      },
      now: () => clock,
    });
    await fetcher.fetchText("https://example.com/a");
    await fetcher.fetchText("https://example.com/b");
    expect(sleeps).toContain(1000);
  });

  it("does not follow a redirect to a disallowed host", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(null, { status: 302, headers: { location: "https://evil.example/x" } }),
    );
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
    });
    await expect(fetcher.fetchText("https://example.com/a")).rejects.toThrow(/not allowed/i);
  });
});
```

- [ ] **Step 2: Write the failing robots and auth tests**

Create `tests/robots.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { canFetch, createRobotsChecker } from "@/lib/ingest/robots";

const ROBOTS = [
  "User-agent: *",
  "Disallow: /private/",
  "Allow: /news/",
].join("\n");

describe("robots", () => {
  it("allows permitted paths and blocks disallowed paths", () => {
    expect(canFetch("https://example.com/news/a", ROBOTS, "SiniKannadaBot")).toBe(true);
    expect(canFetch("https://example.com/private/a", ROBOTS, "SiniKannadaBot")).toBe(false);
  });

  it("proceeds when robots.txt is unavailable", () => {
    expect(canFetch("https://example.com/news/a", null, "SiniKannadaBot")).toBe(true);
  });

  it("caches robots.txt per origin", async () => {
    let calls = 0;
    const checker = createRobotsChecker(
      {
        fetchText: async () => {
          calls += 1;
          return ROBOTS;
        },
      },
      "SiniKannadaBot",
    );
    await checker.isAllowed("https://example.com/news/a", "SiniKannadaBot");
    await checker.isAllowed("https://example.com/news/b", "SiniKannadaBot");
    expect(calls).toBe(1);
  });
});
```

Create `tests/auth.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { isAuthorized } from "@/lib/ingest/auth";

describe("isAuthorized", () => {
  it("accepts a bearer token and the header form", () => {
    expect(isAuthorized("Bearer secret-value", null, "secret-value")).toBe(true);
    expect(isAuthorized(null, "secret-value", "secret-value")).toBe(true);
  });

  it("rejects missing, wrong, and differently sized secrets", () => {
    expect(isAuthorized(null, null, "secret-value")).toBe(false);
    expect(isAuthorized("Bearer wrong", null, "secret-value")).toBe(false);
    expect(isAuthorized("Bearer short", null, "secret-value")).toBe(false);
    expect(isAuthorized("Bearer secret-value", null, null)).toBe(false);
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npx vitest run tests/fetcher.test.ts tests/robots.test.ts tests/auth.test.ts`
Expected: FAIL because the modules do not exist.

- [ ] **Step 4: Implement the fetcher**

Create `src/lib/ingest/fetcher.ts`:

```ts
export interface PoliteFetcher {
  fetchText(url: string): Promise<string>;
}

export interface PoliteFetcherOptions {
  userAgent: string;
  allowedHosts: string[];
  fetchImpl?: typeof fetch;
  minDelayMs?: number;
  timeoutMs?: number;
  retryBudgetMs?: number;
  maxBytes?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
}

interface Attempt {
  ok: boolean;
  status: number;
  text: string;
  retryAfter: string | null;
}

function isPrivateHost(host: string): boolean {
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const a = Number(match[1]);
  const b = Number(match[2]);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

export function assertAllowedUrl(rawUrl: string, allowedHosts: string[]): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`Only https URLs are allowed: ${rawUrl}`);
  }
  if (url.username || url.password) {
    throw new Error(`Credentials are not allowed in URLs: ${rawUrl}`);
  }
  if (url.port && url.port !== "443") {
    throw new Error(`Non-standard ports are not allowed: ${rawUrl}`);
  }
  const host = url.hostname.toLowerCase();
  if (isPrivateHost(host)) {
    throw new Error(`Private hosts are not allowed: ${host}`);
  }
  const allowed = allowedHosts.some((entry) => {
    const base = entry.toLowerCase();
    return host === base || host.endsWith(`.${base}`);
  });
  if (!allowed) {
    throw new Error(`Host not allowed: ${host}`);
  }
  return url;
}

function parseRetryAfter(value: string | null): number {
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 10_000);
  const date = Date.parse(value);
  if (Number.isFinite(date)) return Math.min(Math.max(date - Date.now(), 0), 10_000);
  return 0;
}

export function createPoliteFetcher(options: PoliteFetcherOptions): PoliteFetcher {
  const fetchImpl = options.fetchImpl ?? fetch;
  const minDelayMs = options.minDelayMs ?? 1000;
  const timeoutMs = options.timeoutMs ?? 5000;
  const retryBudgetMs = options.retryBudgetMs ?? 5000;
  const maxBytes = options.maxBytes ?? 2_000_000;
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? Date.now;
  const lastByHost = new Map<string, number>();
  const startedAt = now();

  async function throttle(host: string): Promise<void> {
    const last = lastByHost.get(host);
    if (last !== undefined) {
      const wait = last + minDelayMs - now();
      if (wait > 0) await sleep(wait);
    }
    lastByHost.set(host, now());
  }

  async function request(rawUrl: string): Promise<Attempt> {
    let current = assertAllowedUrl(rawUrl, options.allowedHosts);
    for (let redirects = 0; redirects <= 3; redirects += 1) {
      await throttle(current.hostname);
      const response = await fetchImpl(current.toString(), {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "User-Agent": options.userAgent,
          "Accept-Language": "kn-IN,kn;q=0.9,en;q=0.5",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) throw new Error(`Redirect without location: ${current.toString()}`);
        current = assertAllowedUrl(new URL(location, current).toString(), options.allowedHosts);
        continue;
      }

      const text = await response.text();
      if (text.length > maxBytes) {
        throw new Error(`Response too large (${text.length} bytes): ${current.toString()}`);
      }
      return {
        ok: response.ok,
        status: response.status,
        text,
        retryAfter: response.headers.get("retry-after"),
      };
    }
    throw new Error(`Too many redirects: ${rawUrl}`);
  }

  return {
    async fetchText(rawUrl: string): Promise<string> {
      let retried = false;
      while (true) {
        const attempt = await request(rawUrl);
        if (attempt.ok) return attempt.text;
        const transient = attempt.status === 429 || attempt.status >= 500;
        if (!transient || retried || now() - startedAt >= retryBudgetMs) {
          throw new Error(`Fetch failed with status ${attempt.status}: ${rawUrl}`);
        }
        const delay = Math.max(1000, parseRetryAfter(attempt.retryAfter));
        await sleep(delay);
        retried = true;
      }
    },
  };
}
```

- [ ] **Step 5: Implement robots and auth**

Create `src/lib/ingest/robots.ts`:

```ts
import robotsParser from "robots-parser";

export const INGEST_BOT_TOKEN = "SiniKannadaBot";

export function canFetch(url: string, robotsTxt: string | null, userAgent: string): boolean {
  if (!robotsTxt) return true;
  const parsed = robotsParser(url, robotsTxt);
  return parsed.isAllowed(url, userAgent) !== false;
}

export interface RobotsChecker {
  isAllowed(url: string, userAgent: string): Promise<boolean>;
}

export function createRobotsChecker(
  fetcher: { fetchText(url: string): Promise<string> },
  userAgent: string,
): RobotsChecker {
  const cache = new Map<string, Promise<string | null>>();
  return {
    async isAllowed(url: string, agent: string): Promise<boolean> {
      const origin = new URL(url).origin;
      if (!cache.has(origin)) {
        cache.set(
          origin,
          fetcher.fetchText(`${origin}/robots.txt`).catch(() => null),
        );
      }
      const robotsTxt = await cache.get(origin);
      return canFetch(url, robotsTxt, agent || userAgent);
    },
  };
}
```

Create `src/lib/ingest/auth.ts`:

```ts
import { timingSafeEqual } from "node:crypto";

export function isAuthorized(
  authorization: string | null,
  secretHeader: string | null,
  ingestSecret: string | null,
): boolean {
  if (!ingestSecret) return false;
  const provided =
    secretHeader ??
    (authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : null);
  if (!provided) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(ingestSecret);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}
```

- [ ] **Step 6: Run the tests**

Run: `npx vitest run tests/fetcher.test.ts tests/robots.test.ts tests/auth.test.ts`
Expected: PASS. If TypeScript rejects the `robots-parser` default import, add `src/types/robots-parser.d.ts` with `declare module "robots-parser";` only if the package ships no types; verify with `npm run typecheck` first.

- [ ] **Step 7: Commit**

```bash
git add src/lib/ingest/fetcher.ts src/lib/ingest/robots.ts src/lib/ingest/auth.ts tests/fetcher.test.ts tests/robots.test.ts tests/auth.test.ts
git commit -m "feat: add polite fetcher, robots rules, and ingest auth"
```

---

### Task 4: Text normalization, validation, and category rules

**Files:**
- Create: `src/lib/ingest/normalize.ts`
- Create: `src/lib/ingest/validate.ts`
- Create: `src/lib/ingest/categorize.ts`
- Test: `tests/normalize.test.ts`
- Test: `tests/categorize.test.ts`

**Interfaces:**
- Produces: `cleanText`, `stripSiteSuffix`, `trimExcerpt`, `kannadaRatio`, `pickKannadaSentence`, `toIsoOrNull`
- Produces: `slugFromUrl`, `withCollisionSuffix`, `normalizeArticle(raw, options): NormalizedArticle`
- Produces: `validateRawArticle(raw, allowedHosts): { ok: true; article: RawArticle } | { ok: false; reason: string }`
- Produces: `inferCategory(input, fallback): CategorySlug`, `extractTags(text): string[]`

- [ ] **Step 1: Write the failing normalization tests**

Create `tests/normalize.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { RawArticle } from "@/lib/ingest/types";
import {
  cleanText,
  kannadaRatio,
  normalizeArticle,
  slugFromUrl,
  stripSiteSuffix,
  trimExcerpt,
} from "@/lib/ingest/normalize";
import { validateRawArticle } from "@/lib/ingest/validate";

describe("normalize", () => {
  it("decodes entities and collapses whitespace", () => {
    expect(cleanText("  ಕಾಂತಾರ &amp; ಯಶ್\n\n ಸುದ್ದಿ  ")).toBe("ಕಾಂತಾರ & ಯಶ್ ಸುದ್ದಿ");
  });

  it("strips a known site suffix but keeps a Kannada subtitle", () => {
    expect(stripSiteSuffix("ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ರಿಲೀಸ್ | ಫಿಲ್ಮಿಬೀಟ್", ["ಫಿಲ್ಮಿಬೀಟ್"])).toBe(
      "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ರಿಲೀಸ್",
    );
    expect(stripSiteSuffix("ಕಾಂತಾರ - ಭಾಗ 1", ["ಫಿಲ್ಮಿಬೀಟ್"])).toBe("ಕಾಂತಾರ - ಭಾಗ 1");
  });

  it("cuts an excerpt at a sentence boundary and appends an ellipsis", () => {
    const text = `${"ಕನ್ನಡ ಸಿನಿಮಾ ಸುದ್ದಿ. ".repeat(20)}`;
    const excerpt = trimExcerpt(text, 120);
    expect(excerpt.length).toBeLessThanOrEqual(121);
    expect(excerpt.endsWith("…")).toBe(true);
  });

  it("measures the Kannada character ratio", () => {
    expect(kannadaRatio("ಕನ್ನಡ ಸಿನಿಮಾ")).toBeGreaterThan(0.9);
    expect(kannadaRatio("Kannada cinema")).toBe(0);
  });

  it("builds an ASCII slug and falls back to a hash for Kannada-only URLs", () => {
    expect(slugFromUrl("https://example.com/news/kantara-chapter-1.html")).toBe("kantara-chapter-1");
    expect(slugFromUrl("https://example.com/news/ಕಾಂತಾರ")).toMatch(/^news-[0-9a-f]{8}$/);
  });
});

const raw: RawArticle = {
  sourceId: "filmibeat",
  sourceName: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ",
  sourceUrl: "https://kannada.filmibeat.com/news/kantara-123.html",
  title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
  excerpt: "ಕನ್ನಡ ಸಿನಿಮಾ: ಕುಂದಾಪುರದಲ್ಲಿ ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಭಾರೀ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ.",
  imageUrl: "https://images.filmibeat.com/kantara.jpg",
  publishedAt: "2026-10-31T08:30:00Z",
};

describe("normalizeArticle", () => {
  it("marks a real source timestamp as exact", () => {
    const article = normalizeArticle(raw, {
      category: "sandalwood",
      fetchedAt: "2026-10-31T09:00:00Z",
      takenSlugs: new Set(),
    });
    expect(article.publishedAtEstimated).toBe(false);
    expect(article.publishedAt).toBe(raw.publishedAt);
    expect(article.slug).toBe("kantara-123");
    expect(article.tags.length).toBeGreaterThan(0);
  });

  it("uses the fetch time and labels it estimated when the source has no date", () => {
    const article = normalizeArticle(
      { ...raw, publishedAt: null },
      { category: "sandalwood", fetchedAt: "2026-10-31T09:00:00Z", takenSlugs: new Set() },
    );
    expect(article.publishedAtEstimated).toBe(true);
    expect(article.publishedAt).toBe("2026-10-31T09:00:00Z");
  });
});

describe("validateRawArticle", () => {
  it("accepts a complete article", () => {
    expect(validateRawArticle(raw, ["filmibeat.com"]).ok).toBe(true);
  });

  it("rejects short titles, short excerpts, missing images, and foreign hosts", () => {
    expect(validateRawArticle({ ...raw, title: "ಸುದ್ದಿ" }, ["filmibeat.com"]).ok).toBe(false);
    expect(validateRawArticle({ ...raw, excerpt: "ಸಣ್ಣ" }, ["filmibeat.com"]).ok).toBe(false);
    expect(validateRawArticle({ ...raw, imageUrl: null }, ["filmibeat.com"]).ok).toBe(false);
    expect(validateRawArticle({ ...raw, sourceUrl: "https://evil.example/a" }, ["filmibeat.com"]).ok).toBe(false);
  });
});
```

- [ ] **Step 2: Write the failing category tests**

Create `tests/categorize.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { extractTags, inferCategory } from "@/lib/ingest/categorize";

describe("inferCategory", () => {
  const cases: Array<[string, string]> = [
    ["ಚಿತ್ರದ ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ 100 ಕೋಟಿ", "box-office"],
    ["ಹೊಸ ಸಿನಿಮಾ ನೆಟ್‌ಫ್ಲಿಕ್ಸ್‌ನಲ್ಲಿ ಸ್ಟ್ರೀಮಿಂಗ್", "ott"],
    ["ಸಿನಿಮಾ ವಿಮರ್ಶೆ: ಉತ್ತಮ ಕಥೆ", "reviews"],
    ["ನಟಿ ರುಕ್ಮಿಣಿ ವಸಂತ್ ಹೊಸ ಲುಕ್", "actresses"],
    ["ನಟ ಯಶ್ ಹೊಸ ಸಿನಿಮಾ", "actors"],
    ["ಟೀಸರ್ ಬಿಡುಗಡೆಯಾದ ದಿನಾಂಕ", "upcoming"],
    ["Kannada cinema box office collection", "box-office"],
  ];

  it.each(cases)("maps %s to %s", (title, expected) => {
    expect(inferCategory({ title, excerpt: "" }, "latest")).toBe(expected);
  });

  it("falls back when nothing matches", () => {
    expect(inferCategory({ title: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ ವರದಿ", excerpt: "" }, "sandalwood")).toBe(
      "sandalwood",
    );
  });
});

describe("extractTags", () => {
  it("returns at most four matched keywords without duplicates", () => {
    const tags = extractTags("ಟ್ರೇಲರ್ ಮತ್ತು ಟೀಸರ್ ಹಾಗೂ ವಿಮರ್ಶೆ ಮತ್ತು ರೇಟಿಂಗ್");
    expect(tags.length).toBeLessThanOrEqual(4);
    expect(new Set(tags).size).toBe(tags.length);
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npx vitest run tests/normalize.test.ts tests/categorize.test.ts`
Expected: FAIL because the modules do not exist.

- [ ] **Step 4: Create the ingestion types**

Create `src/lib/ingest/types.ts`:

```ts
import type { CategorySlug } from "@/types";

export interface RawArticle {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  publishedAt: string | null;
  bodyPreview?: string;
}

export interface NormalizedArticle {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  publishedAtEstimated: boolean;
  fetchedAt: string;
  category: CategorySlug;
  tags: string[];
  slug: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  homepage: string;
  listingUrls: string[];
  allowedHosts: string[];
  defaultCategory: CategorySlug;
  extractLinks(html: string, baseUrl: string): string[];
  parseArticle(html: string, url: string): RawArticle | null;
}

export interface CandidateArticle {
  id: string;
  title: string;
  sourceUrl: string;
  publishedAt: string;
  publishedAtEstimated: boolean;
  coverageCount: number;
}

export interface IngestResult {
  sourceId: string;
  status: "success" | "partial" | "failed";
  discovered: number;
  fetched: number;
  inserted: number;
  merged: number;
  skipped: number;
  errors: number;
  durationMs: number;
  message?: string;
}

export interface ArticleRepository {
  findExistingSourceUrls(urls: string[]): Promise<Set<string>>;
  findExistingSlugs(slugs: string[]): Promise<Set<string>>;
  findRecentCandidates(sinceIso: string, limit: number): Promise<CandidateArticle[]>;
  insertArticle(article: NormalizedArticle): Promise<{ id: string }>;
  updateBySourceUrl(article: NormalizedArticle): Promise<void>;
  mergeSource(primaryId: string, article: NormalizedArticle): Promise<void>;
  logRun(result: IngestResult, startedAt: Date, finishedAt: Date): Promise<void>;
}
```

- [ ] **Step 5: Implement normalization**

Create `src/lib/ingest/normalize.ts`:

```ts
import { load } from "cheerio";
import type { CategorySlug } from "@/types";
import type { NormalizedArticle, RawArticle } from "./types";
import { extractTags } from "./categorize";

export function decodeEntities(input: string): string {
  return load(`<span>${input}</span>`).text();
}

export function cleanText(input: string): string {
  return decodeEntities(input)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripSiteSuffix(title: string, siteNames: string[]): string {
  const parts = title.split(/\s+[|–—-]\s+/);
  if (parts.length < 2) return title;
  const last = parts[parts.length - 1].trim();
  const matchesSite = siteNames.some((name) =>
    last.toLowerCase().includes(name.toLowerCase()),
  );
  const looksEnglish = /^[\x20-\x7E]+$/.test(last);
  if (matchesSite || looksEnglish) {
    return parts.slice(0, -1).join(" - ").trim();
  }
  return title;
}

export function kannadaRatio(text: string): number {
  const visible = text.replace(/\s/g, "");
  if (!visible) return 0;
  let kannada = 0;
  for (const char of visible) {
    if (char >= "\u0C80" && char <= "\u0CFF") kannada += 1;
  }
  return kannada / visible.length;
}

export function pickKannadaSentence(text: string): string | null {
  const sentences = text
    .split(/(?<=[.!?।])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  let best: string | null = null;
  let bestLength = 0;
  for (const sentence of sentences) {
    if (kannadaRatio(sentence) >= 0.5 && sentence.length > bestLength) {
      best = sentence;
      bestLength = sentence.length;
    }
  }
  return best;
}

export function trimExcerpt(text: string, max = 240): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const boundary = Math.max(
    slice.lastIndexOf("."),
    slice.lastIndexOf("!"),
    slice.lastIndexOf("?"),
    slice.lastIndexOf("।"),
  );
  const cut = boundary >= 40 ? slice.slice(0, boundary + 1) : slice.replace(/\s+\S*$/, "");
  return `${cut.trim()}…`;
}

export function toIsoOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

export function hash8(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 8);
}

export function slugFromUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  const last = url.pathname.split("/").filter(Boolean).pop() ?? "";
  const base = decodeURIComponent(last)
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length < 3) return `news-${hash8(rawUrl)}`;
  return base;
}

export function withCollisionSuffix(slug: string, sourceUrl: string): string {
  return `${slug}-${hash8(sourceUrl).slice(0, 6)}`;
}

export interface NormalizeOptions {
  category: CategorySlug;
  fetchedAt: string;
  takenSlugs: Set<string>;
}

export function normalizeArticle(raw: RawArticle, options: NormalizeOptions): NormalizedArticle {
  const title = cleanText(raw.title);
  const excerpt = trimExcerpt(cleanText(raw.excerpt));
  const baseSlug = slugFromUrl(raw.sourceUrl);
  const slug = options.takenSlugs.has(baseSlug)
    ? withCollisionSuffix(baseSlug, raw.sourceUrl)
    : baseSlug;
  options.takenSlugs.add(slug);

  return {
    sourceId: raw.sourceId,
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    title,
    excerpt,
    imageUrl: raw.imageUrl as string,
    publishedAt: raw.publishedAt ?? options.fetchedAt,
    publishedAtEstimated: raw.publishedAt === null,
    fetchedAt: options.fetchedAt,
    category: options.category,
    tags: extractTags(`${title} ${excerpt}`),
    slug,
  };
}
```

- [ ] **Step 6: Implement validation**

Create `src/lib/ingest/validate.ts`:

```ts
import type { RawArticle } from "./types";
import { assertAllowedUrl } from "./fetcher";
import { cleanText, toIsoOrNull } from "./normalize";

export type ValidationResult =
  | { ok: true; article: RawArticle }
  | { ok: false; reason: string };

const MAX_FUTURE_MS = 30 * 24 * 60 * 60 * 1000;

export function validateRawArticle(raw: RawArticle, allowedHosts: string[]): ValidationResult {
  const title = cleanText(raw.title);
  if (title.length < 10) return { ok: false, reason: "title-too-short" };
  if (title.length > 200) return { ok: false, reason: "title-too-long" };

  const excerpt = cleanText(raw.excerpt);
  if (excerpt.length < 40) return { ok: false, reason: "excerpt-too-short" };

  if (!raw.imageUrl) return { ok: false, reason: "missing-image" };
  try {
    const image = new URL(raw.imageUrl);
    if (image.protocol !== "https:") return { ok: false, reason: "image-not-https" };
  } catch {
    return { ok: false, reason: "invalid-image" };
  }

  try {
    assertAllowedUrl(raw.sourceUrl, allowedHosts);
  } catch {
    return { ok: false, reason: "source-url-not-allowed" };
  }

  if (raw.publishedAt) {
    const iso = toIsoOrNull(raw.publishedAt);
    if (!iso) return { ok: false, reason: "invalid-published-at" };
    if (Date.parse(iso) > Date.now() + MAX_FUTURE_MS) {
      return { ok: false, reason: "published-at-too-far-future" };
    }
  }

  return { ok: true, article: { ...raw, title, excerpt } };
}
```

- [ ] **Step 7: Implement category rules**

Create `src/lib/ingest/categorize.ts`:

```ts
import type { CategorySlug } from "@/types";

export interface CategoryRule {
  category: CategorySlug;
  keywords: string[];
}

export const CATEGORY_RULES: CategoryRule[] = [
  { category: "box-office", keywords: ["ಬಾಕ್ಸ್ ಆಫೀಸ್", "ಗಳಿಕೆ", "ಕಲೆಕ್ಷನ್", "ಕೋಟಿ", "box office", "collection", "crore"] },
  { category: "ott", keywords: ["ಒಟಿಟಿ", "ನೆಟ್‌ಫ್ಲಿಕ್ಸ್", "ಪ್ರೈಮ್", "ಜೀ5", "ಸ್ಟ್ರೀಮಿಂಗ್", "ott", "netflix", "prime video", "zee5", "streaming"] },
  { category: "reviews", keywords: ["ವಿಮರ್ಶೆ", "ರಿವ್ಯೂ", "ರೇಟಿಂಗ್", "review", "rating"] },
  { category: "interviews", keywords: ["ಸಂದರ್ಶನ", "ಮಾತುಕತೆ", "interview"] },
  { category: "gossip", keywords: ["ಗಾಸಿಪ್", "ಗುಲ್ಲು", "ವೈರಲ್", "gossip", "viral"] },
  { category: "upcoming", keywords: ["ಮುಂಬರುವ", "ಶೂಟಿಂಗ್", "ಟೀಸರ್", "ಟ್ರೇಲರ್", "upcoming", "shooting", "teaser", "trailer"] },
  { category: "actresses", keywords: ["ನಟಿ", "ಹೀರೋಯಿನ್", "actress", "heroine"] },
  { category: "actors", keywords: ["ನಟ", "ಹೀರೋ", "actor", "hero"] },
  { category: "bollywood", keywords: ["ಬಾಲಿವುಡ್", "ಹಿಂದಿ", "bollywood", "hindi"] },
  { category: "hollywood", keywords: ["ಹಾಲಿವುಡ್", "hollywood"] },
  { category: "sandalwood", keywords: ["ಸ್ಯಾಂಡಲ್ವುಡ್", "ಕನ್ನಡ ಸಿನಿಮಾ", "ಕಿಚ್ಚ", "ಯಶ್", "ರಿಷಬ್", "ದರ್ಶನ್", "sandalwood", "kannada cinema"] },
];

export interface CategoryInput {
  title: string;
  excerpt?: string;
  sourceSection?: string | null;
}

export function inferCategory(input: CategoryInput, fallback: CategorySlug): CategorySlug {
  const text = `${input.title} ${input.excerpt ?? ""} ${input.sourceSection ?? ""}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      return rule.category;
    }
  }
  return fallback;
}

export function extractTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (!lower.includes(keyword.toLowerCase())) continue;
      if (!tags.includes(keyword)) tags.push(keyword);
      if (tags.length === 4) return tags;
    }
  }
  return tags;
}
```

Note: the test title `"ನಟ ಯಶ್ ಹೊಸ ಸಿನಿಮಾ"` first matches `actors` only if `actresses` does not match. It does not contain `ನಟಿ`, so `actors` matches. The test title `"ನಟಿ ರುಕ್ಮಿಣಿ ವಸಂತ್ ಹೊಸ ಲುಕ್"` contains `ನಟಿ` and is matched by `actresses` first. Good.

- [ ] **Step 8: Run the tests**

Run: `npx vitest run tests/normalize.test.ts tests/categorize.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/ingest/types.ts src/lib/ingest/normalize.ts src/lib/ingest/validate.ts src/lib/ingest/categorize.ts tests/normalize.test.ts tests/categorize.test.ts
git commit -m "feat: normalize, validate, and categorize scraped articles"
```

---

### Task 5: Title-similarity deduplication

**Files:**
- Create: `src/lib/ingest/dedupe.ts`
- Test: `tests/dedupe.test.ts`

**Interfaces:**
- Produces: `titleTokens(title): Set<string>`
- Produces: `jaccardSimilarity(a: Set<string>, b: Set<string>): number`
- Produces: `findMergeCandidate(title, candidates, threshold = 0.62): T | null`

- [ ] **Step 1: Write the failing test**

Create `tests/dedupe.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { findMergeCandidate, jaccardSimilarity, titleTokens } from "@/lib/ingest/dedupe";

const candidates = [
  {
    id: "a",
    title: "ಯಶ್ ಟಾಕ್ಸಿಕ್ ಚಿತ್ರದ ಶೂಟಿಂಗ್ ಆರಂಭ",
    sourceUrl: "https://a.example/1",
    publishedAt: "2026-10-31T08:00:00Z",
    publishedAtEstimated: false,
    coverageCount: 1,
  },
  {
    id: "b",
    title: "ರುಕ್ಮಿಣಿ ವಸಂತ್ ಹೊಸ ಫೋಟೋಶೂಟ್ ವೈರಲ್",
    sourceUrl: "https://b.example/2",
    publishedAt: "2026-10-31T07:00:00Z",
    publishedAtEstimated: false,
    coverageCount: 1,
  },
];

describe("dedupe", () => {
  it("ignores English stopwords", () => {
    expect(titleTokens("The Kannada cinema and the box office")).toEqual(
      new Set(["kannada", "cinema", "box", "office"]),
    );
  });

  it("scores identical token sets as 1 and disjoint sets as 0", () => {
    expect(jaccardSimilarity(new Set(["a", "b"]), new Set(["a", "b"]))).toBe(1);
    expect(jaccardSimilarity(new Set(["a"]), new Set(["b"]))).toBe(0);
  });

  it("merges a near-identical headline", () => {
    const match = findMergeCandidate("ಯಶ್ ಟಾಕ್ಸಿಕ್ ಚಿತ್ರ ಶೂಟಿಂಗ್ ಆರಂಭ", candidates);
    expect(match?.id).toBe("a");
  });

  it("rejects an unrelated headline", () => {
    expect(findMergeCandidate("ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ರಿಲೀಸ್ ಡೇಟ್", candidates)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run tests/dedupe.test.ts`
Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement dedupe**

Create `src/lib/ingest/dedupe.ts`:

```ts
const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in",
  "is", "it", "its", "of", "on", "or", "that", "the", "this", "to", "was",
  "were", "will", "with",
]);

export function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((token) => token.length > 0 && !STOPWORDS.has(token)),
  );
}

export function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function findMergeCandidate<T extends { id: string; title: string }>(
  title: string,
  candidates: T[],
  threshold = 0.62,
): T | null {
  const tokens = titleTokens(title);
  let best: T | null = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const score = jaccardSimilarity(tokens, titleTokens(candidate.title));
    if (score >= threshold && score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}
```

- [ ] **Step 4: Run the test**

Run: `npx vitest run tests/dedupe.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ingest/dedupe.ts tests/dedupe.test.ts
git commit -m "feat: add title-similarity dedupe for cross-source stories"
```

---

### Task 6: Source adapters and saved HTML fixtures

**Files:**
- Create: `src/lib/ingest/sources/helpers.ts`
- Create: `src/lib/ingest/sources/filmibeat.ts`
- Create: `src/lib/ingest/sources/vijayakarnataka.ts`
- Create: `src/lib/ingest/sources/news18.ts`
- Create: `src/lib/ingest/sources/index.ts`
- Create: `tests/fixtures/filmibeat-listing.html`
- Create: `tests/fixtures/filmibeat-article.html`
- Create: `tests/fixtures/vijayakarnataka-listing.html`
- Create: `tests/fixtures/vijayakarnataka-article.html`
- Create: `tests/fixtures/news18-listing.html`
- Create: `tests/fixtures/news18-article.html`
- Test: `tests/adapters.test.ts`

**Interfaces:**
- Produces: `SOURCE_ADAPTERS: SourceAdapter[]`
- Consumes: `SourceAdapter`, `RawArticle` from `./types`

- [ ] **Step 1: Write the fixtures**

Create `tests/fixtures/filmibeat-listing.html`:

```html
<!doctype html>
<html lang="kn">
  <body>
    <main>
      <a href="/news/kantara-chapter-1-shooting-123.html">ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ</a>
      <a href="https://kannada.filmibeat.com/news/yash-toxic-456.html?utm_source=home">ಯಶ್ ಟಾಕ್ಸಿಕ್</a>
      <a href="/news/kantara-chapter-1-shooting-123.html#comments">ಡುಪ್ಲಿಕೇಟ್</a>
      <a href="/news/">ಸುದ್ದಿ ಮುಖಪುಟ</a>
      <a href="https://example.com/news/evil-789.html">ಬಾಹ್ಯ ಲಿಂಕ್</a>
    </main>
  </body>
</html>
```

Create `tests/fixtures/filmibeat-article.html`:

```html
<!doctype html>
<html lang="kn">
  <head>
    <meta property="og:title" content="ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ | ಫಿಲ್ಮಿಬೀಟ್" />
    <meta property="og:description" content="ಕುಂದಾಪುರದಲ್ಲಿ ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಭಾರೀ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ." />
    <meta property="og:image" content="https://images.filmibeat.com/kantara.jpg" />
    <meta property="article:published_time" content="2026-10-31T08:30:00Z" />
    <link rel="canonical" href="https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html" />
  </head>
  <body>
    <article>
      <h1>ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ</h1>
      <p>ಕುಂದಾಪುರದಲ್ಲಿ ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಭಾರೀ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ.</p>
    </article>
  </body>
</html>
```

Create `tests/fixtures/vijayakarnataka-listing.html`:

```html
<!doctype html>
<html lang="kn">
  <body>
    <main>
      <a href="/entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms">ಕಾಂತಾರ ಶೂಟಿಂಗ್</a>
      <a href="/entertainment/kannada-cinema/yash-toxic/articleshow/456.cms?ref=home">ಯಶ್ ಟಾಕ್ಸಿಕ್</a>
      <a href="/entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms">ಡುಪ್ಲಿಕೇಟ್</a>
      <a href="/entertainment">ಮನರಂಜನೆ ಮುಖಪುಟ</a>
      <a href="/entertainment/kannada-cinema/tag/yash">ಟ್ಯಾಗ್</a>
    </main>
  </body>
</html>
```

Create `tests/fixtures/vijayakarnataka-article.html`:

```html
<!doctype html>
<html lang="kn">
  <head>
    <meta property="og:title" content="ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಶೂಟಿಂಗ್ ವಿವರ | ವಿಜಯ ಕರ್ನಾಟಕ" />
    <meta property="og:description" content="ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರದ ಶೂಟಿಂಗ್ ಕುಂದಾಪುರದಲ್ಲಿ ನಡೆಯುತ್ತಿದ್ದು ಚಿತ್ರತಂಡದ ವಿಶೇಷ ಫೋಟೋಗಳು ವೈರಲ್ ಆಗಿವೆ." />
    <meta property="og:image" content="https://static.langimg.com/kantara.jpg" />
    <link rel="canonical" href="https://vijayakarnataka.com/entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms" />
    <script type="application/ld+json">
      {"@type":"NewsArticle","datePublished":"2026-10-31T07:45:00Z"}
    </script>
  </head>
  <body>
    <article>
      <h1>ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಶೂಟಿಂಗ್ ವಿವರ</h1>
      <p>ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರದ ಶೂಟಿಂಗ್ ಕುಂದಾಪುರದಲ್ಲಿ ನಡೆಯುತ್ತಿದ್ದು ಚಿತ್ರತಂಡದ ವಿಶೇಷ ಫೋಟೋಗಳು ವೈರಲ್ ಆಗಿವೆ.</p>
    </article>
  </body>
</html>
```

Create `tests/fixtures/news18-listing.html`:

```html
<!doctype html>
<html lang="kn">
  <body>
    <main>
      <a href="/news/entertainment/kantara-chapter-1-shooting-123.html">ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1</a>
      <a href="/news/entertainment/yash-toxic-update-456.html?lang=kn">ಯಶ್ ಟಾಕ್ಸಿಕ್</a>
      <a href="/news/entertainment/kantara-chapter-1-shooting-123.html#top">ಡುಪ್ಲಿಕೇಟ್</a>
      <a href="/news/entertainment/">ಮನರಂಜನೆ ಮುಖಪುಟ</a>
    </main>
  </body>
</html>
```

Create `tests/fixtures/news18-article.html`:

```html
<!doctype html>
<html lang="kn">
  <head>
    <meta property="og:title" content="ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಹೊಸ ಅಪ್ಡೇಟ್ | ನ್ಯೂಸ್18 ಕನ್ನಡ" />
    <meta property="og:description" content="ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಹೊಸ ಅಪ್ಡೇಟ್ ಬಿಡುಗಡೆಯಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳು ಉತ್ಸಾಹದಲ್ಲಿದ್ದಾರೆ." />
    <meta property="og:image" content="https://images.news18.com/kantara.jpg" />
    <meta property="article:published_time" content="2026-10-31T09:15:00Z" />
    <link rel="canonical" href="https://kannada.news18.com/news/entertainment/kantara-chapter-1-shooting-123.html" />
  </head>
  <body>
    <article>
      <h1>ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಹೊಸ ಅಪ್ಡೇಟ್</h1>
      <p>ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಹೊಸ ಅಪ್ಡೇಟ್ ಬಿಡುಗಡೆಯಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳು ಉತ್ಸಾಹದಲ್ಲಿದ್ದಾರೆ.</p>
    </article>
  </body>
</html>
```

- [ ] **Step 2: Write the failing adapter tests**

Create `tests/adapters.test.ts`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { filmibeatAdapter } from "@/lib/ingest/sources/filmibeat";
import { news18Adapter } from "@/lib/ingest/sources/news18";
import { vijayakarnatakaAdapter } from "@/lib/ingest/sources/vijayakarnataka";
import { SOURCE_ADAPTERS } from "@/lib/ingest/sources";

function fixture(name: string): string {
  return readFileSync(path.join(process.cwd(), "tests/fixtures", name), "utf8");
}

const cases = [
  {
    adapter: filmibeatAdapter,
    listing: "filmibeat-listing.html",
    article: "filmibeat-article.html",
    articleUrl: "https://kannada.filmibeat.com/news/kantara-chapter-1-shooting-123.html",
    title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
    image: "https://images.filmibeat.com/kantara.jpg",
  },
  {
    adapter: vijayakarnatakaAdapter,
    listing: "vijayakarnataka-listing.html",
    article: "vijayakarnataka-article.html",
    articleUrl:
      "https://vijayakarnataka.com/entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms",
    title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಶೂಟಿಂಗ್ ವಿವರ",
    image: "https://static.langimg.com/kantara.jpg",
  },
  {
    adapter: news18Adapter,
    listing: "news18-listing.html",
    article: "news18-article.html",
    articleUrl: "https://kannada.news18.com/news/entertainment/kantara-chapter-1-shooting-123.html",
    title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಹೊಸ ಅಪ್ಡೇಟ್",
    image: "https://images.news18.com/kantara.jpg",
  },
];

describe("source adapters", () => {
  it("registers exactly the three approved sources", () => {
    expect(SOURCE_ADAPTERS.map((adapter) => adapter.id)).toEqual([
      "filmibeat",
      "vijayakarnataka",
      "news18",
    ]);
  });

  it.each(cases)("extracts unique in-host links for $adapter.id", ({ adapter, listing }) => {
    const links = adapter.extractLinks(fixture(listing), adapter.listingUrls[0]);
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(new Set(links).size).toBe(links.length);
    expect(links.every((link) => link.startsWith("https://"))).toBe(true);
    expect(links.some((link) => link.includes("example.com"))).toBe(false);
    expect(links.some((link) => link.includes("/tag/"))).toBe(false);
    expect(links.some((link) => link.includes("?utm_source"))).toBe(false);
  });

  it.each(cases)("parses article metadata for $adapter.id", ({ adapter, article, articleUrl, title, image }) => {
    const raw = adapter.parseArticle(fixture(article), articleUrl);
    expect(raw).not.toBeNull();
    expect(raw?.title).toBe(title);
    expect(raw?.imageUrl).toBe(image);
    expect(raw?.excerpt.length).toBeGreaterThanOrEqual(40);
    expect(raw?.sourceUrl.startsWith("https://")).toBe(true);
    expect(raw?.publishedAt).toMatch(/^2026-10-31T/);
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npx vitest run tests/adapters.test.ts`
Expected: FAIL because the adapter modules do not exist.

- [ ] **Step 4: Implement the shared helpers**

Create `src/lib/ingest/sources/helpers.ts`:

```ts
import { load, type CheerioAPI } from "cheerio";
import { cleanText, kannadaRatio, pickKannadaSentence } from "../normalize";

export function metaContent($: CheerioAPI, property: string): string | null {
  const value =
    $(`meta[property="${property}"]`).attr("content") ??
    $(`meta[name="${property}"]`).attr("content");
  return value ? value.trim() : null;
}

export function canonicalUrl($: CheerioAPI, fallback: string): string {
  const href = $('link[rel="canonical"]').attr("href");
  if (!href) return fallback;
  try {
    return new URL(href, fallback).toString();
  } catch {
    return fallback;
  }
}

function pickDate(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = pickDate(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (typeof object.datePublished === "string") return object.datePublished;
    if (Array.isArray(object["@graph"])) return pickDate(object["@graph"]);
  }
  return null;
}

export function jsonLdDate(html: string): string | null {
  const $ = load(html);
  let found: string | null = null;
  $('script[type="application/ld+json"]').each((_, element) => {
    if (found) return;
    try {
      found = pickDate(JSON.parse($(element).text()));
    } catch {
      // Malformed JSON-LD is common; fall through to the next script block.
    }
  });
  return found;
}

export function timeElementDate($: CheerioAPI): string | null {
  const value = $("time[datetime]").first().attr("datetime");
  return value ? value.trim() : null;
}

export function bodyText($: CheerioAPI, selector: string): string {
  return $(selector)
    .map((_, element) => cleanText($(element).text()))
    .get()
    .join(" ");
}

export function bestExcerpt(description: string | null, body: string): string {
  const cleanedDescription = cleanText(description ?? "");
  if (cleanedDescription && kannadaRatio(cleanedDescription) >= 0.5) {
    return cleanedDescription;
  }
  const cleanedBody = cleanText(body);
  return pickKannadaSentence(cleanedBody) ?? cleanedBody;
}

export function absoluteHttpsUrl(value: string | null, baseUrl: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value, baseUrl);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function withinHosts(rawUrl: string, allowedHosts: string[]): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return allowedHosts.some((entry) => {
      const base = entry.toLowerCase();
      return host === base || host.endsWith(`.${base}`);
    });
  } catch {
    return false;
  }
}

export function normalizeHref(href: string, baseUrl: string): string | null {
  try {
    const url = new URL(href, baseUrl);
    url.hash = "";
    const lang = url.searchParams.get("lang");
    url.search = "";
    if (lang === "kn") url.searchParams.set("lang", "kn");
    return url.toString();
  } catch {
    return null;
  }
}

export function collectLinks(
  $: CheerioAPI,
  selector: string,
  baseUrl: string,
  allowedHosts: string[],
  accept: (url: URL) => boolean,
): string[] {
  const seen = new Set<string>();
  const links: string[] = [];
  $(selector).each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;
    const normalized = normalizeHref(href, baseUrl);
    if (!normalized || !withinHosts(normalized, allowedHosts)) return;
    const url = new URL(normalized);
    if (!accept(url)) return;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      links.push(normalized);
    }
  });
  return links;
}
```

- [ ] **Step 5: Implement the Filmibeat adapter**

Create `src/lib/ingest/sources/filmibeat.ts`:

```ts
import { load } from "cheerio";
import type { RawArticle, SourceAdapter } from "../types";
import { cleanText, stripSiteSuffix } from "../normalize";
import {
  absoluteHttpsUrl,
  bestExcerpt,
  bodyText,
  canonicalUrl,
  collectLinks,
  jsonLdDate,
  metaContent,
  timeElementDate,
} from "./helpers";

const HOSTS = ["kannada.filmibeat.com"];
const LISTING = "https://kannada.filmibeat.com/";
const NAME = "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ";

export const filmibeatAdapter: SourceAdapter = {
  id: "filmibeat",
  name: NAME,
  homepage: "https://kannada.filmibeat.com",
  listingUrls: [LISTING],
  allowedHosts: HOSTS,
  defaultCategory: "sandalwood",
  extractLinks(html: string, baseUrl: string): string[] {
    const $ = load(html);
    return collectLinks(
      $,
      'a[href*="/news/"][href$=".html"]',
      baseUrl,
      HOSTS,
      (url) => url.pathname.includes("/news/") && !/\/news\/?$/.test(url.pathname),
    );
  },
  parseArticle(html: string, url: string): RawArticle | null {
    const $ = load(html);
    const title = stripSiteSuffix(
      cleanText(metaContent($, "og:title") ?? $("h1").first().text()),
      ["ಫಿಲ್ಮಿಬೀಟ್", "Filmibeat"],
    );
    if (!title) return null;
    return {
      sourceId: "filmibeat",
      sourceName: NAME,
      sourceUrl: canonicalUrl($, url),
      title,
      excerpt: bestExcerpt(
        metaContent($, "og:description"),
        bodyText($, "article p, .article-content p, .content p"),
      ),
      imageUrl: absoluteHttpsUrl(metaContent($, "og:image"), url),
      publishedAt:
        metaContent($, "article:published_time") ?? jsonLdDate(html) ?? timeElementDate($),
    };
  },
};
```

- [ ] **Step 6: Implement the Vijaya Karnataka adapter**

Create `src/lib/ingest/sources/vijayakarnataka.ts`:

```ts
import { load } from "cheerio";
import type { RawArticle, SourceAdapter } from "../types";
import { cleanText, stripSiteSuffix } from "../normalize";
import {
  absoluteHttpsUrl,
  bestExcerpt,
  bodyText,
  canonicalUrl,
  collectLinks,
  jsonLdDate,
  metaContent,
  timeElementDate,
} from "./helpers";

const HOSTS = ["vijayakarnataka.com"];
const LISTING = "https://vijaykarnataka.com/entertainment";
const NAME = "ವಿಜಯ ಕರ್ನಾಟಕ";

export const vijayakarnatakaAdapter: SourceAdapter = {
  id: "vijayakarnataka",
  name: NAME,
  homepage: "https://vijaykarnataka.com",
  listingUrls: [LISTING],
  allowedHosts: HOSTS,
  defaultCategory: "latest",
  extractLinks(html: string, baseUrl: string): string[] {
    const $ = load(html);
    return collectLinks($, 'a[href*="/entertainment/"]', baseUrl, HOSTS, (url) => {
      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length < 3) return false;
      return !/\/(tag|tags|author|authors|topics)\//.test(url.pathname);
    });
  },
  parseArticle(html: string, url: string): RawArticle | null {
    const $ = load(html);
    const title = stripSiteSuffix(
      cleanText(metaContent($, "og:title") ?? $("h1").first().text()),
      ["ವಿಜಯ ಕರ್ನಾಟಕ", "Vijaya Karnataka"],
    );
    if (!title) return null;
    return {
      sourceId: "vijayakarnataka",
      sourceName: NAME,
      sourceUrl: canonicalUrl($, url),
      title,
      excerpt: bestExcerpt(
        metaContent($, "og:description"),
        bodyText($, "article p, .article-content p, .content p"),
      ),
      imageUrl: absoluteHttpsUrl(metaContent($, "og:image"), url),
      publishedAt: jsonLdDate(html) ?? metaContent($, "article:published_time") ?? timeElementDate($),
    };
  },
};
```

- [ ] **Step 7: Implement the News18 adapter**

Create `src/lib/ingest/sources/news18.ts`:

```ts
import { load } from "cheerio";
import type { RawArticle, SourceAdapter } from "../types";
import { cleanText, stripSiteSuffix } from "../normalize";
import {
  absoluteHttpsUrl,
  bestExcerpt,
  bodyText,
  canonicalUrl,
  collectLinks,
  jsonLdDate,
  metaContent,
  timeElementDate,
} from "./helpers";

const HOSTS = ["kannada.news18.com"];
const LISTING = "https://kannada.news18.com/entertainment/";
const NAME = "ನ್ಯೂಸ್18 ಕನ್ನಡ";

export const news18Adapter: SourceAdapter = {
  id: "news18",
  name: NAME,
  homepage: "https://kannada.news18.com",
  listingUrls: [LISTING],
  allowedHosts: HOSTS,
  defaultCategory: "sandalwood",
  extractLinks(html: string, baseUrl: string): string[] {
    const $ = load(html);
    return collectLinks(
      $,
      'a[href*="/news/entertainment/"][href$=".html"]',
      baseUrl,
      HOSTS,
      (url) => url.pathname !== "/news/entertainment/",
    );
  },
  parseArticle(html: string, url: string): RawArticle | null {
    const $ = load(html);
    const title = stripSiteSuffix(
      cleanText(metaContent($, "og:title") ?? $("h1").first().text()),
      ["ನ್ಯೂಸ್18 ಕನ್ನಡ", "News18 Kannada", "News18"],
    );
    if (!title) return null;
    return {
      sourceId: "news18",
      sourceName: NAME,
      sourceUrl: canonicalUrl($, url),
      title,
      excerpt: bestExcerpt(
        metaContent($, "og:description"),
        bodyText($, "article p, .article-content p, .content p"),
      ),
      imageUrl: absoluteHttpsUrl(metaContent($, "og:image"), url),
      publishedAt:
        metaContent($, "article:published_time") ?? jsonLdDate(html) ?? timeElementDate($),
    };
  },
};
```

- [ ] **Step 8: Create the registry**

Create `src/lib/ingest/sources/index.ts`:

```ts
import type { SourceAdapter } from "../types";
import { filmibeatAdapter } from "./filmibeat";
import { news18Adapter } from "./news18";
import { vijayakarnatakaAdapter } from "./vijayakarnataka";

export const SOURCE_ADAPTERS: SourceAdapter[] = [
  filmibeatAdapter,
  vijayakarnatakaAdapter,
  news18Adapter,
];
```

- [ ] **Step 9: Run the adapter tests**

Run: `npx vitest run tests/adapters.test.ts`
Expected: PASS. If the Vijaya fixture link is filtered, confirm its path has at least three segments (`entertainment/kannada-cinema/kantara-shooting/articleshow/123.cms` has five).

- [ ] **Step 10: Commit**

```bash
git add src/lib/ingest/sources tests/fixtures tests/adapters.test.ts
git commit -m "feat: add three robots-permitted Kannada source adapters"
```

---

### Task 7: Supabase repository and row mapping

**Files:**
- Create: `src/lib/ingest/store.ts`
- Test: `tests/store.test.ts`

**Interfaces:**
- Produces: `toArticleRow(article: NormalizedArticle): Record<string, unknown>`
- Produces: `createSupabaseRepository(config: { url: string; serviceRoleKey: string }): ArticleRepository`

- [ ] **Step 1: Write the failing test**

Create `tests/store.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { NormalizedArticle } from "@/lib/ingest/types";
import { toArticleRow } from "@/lib/ingest/store";

const article: NormalizedArticle = {
  sourceId: "filmibeat",
  sourceName: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ",
  sourceUrl: "https://kannada.filmibeat.com/news/kantara-123.html",
  title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
  excerpt: "ಕುಂದಾಪುರದಲ್ಲಿ ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ.",
  imageUrl: "https://images.filmibeat.com/kantara.jpg",
  publishedAt: "2026-10-31T08:30:00Z",
  publishedAtEstimated: false,
  fetchedAt: "2026-10-31T09:00:00Z",
  category: "sandalwood",
  tags: ["ಸ್ಯಾಂಡಲ್ವುಡ್"],
  slug: "kantara-123",
};

describe("toArticleRow", () => {
  it("maps scraped fields without inventing metrics", () => {
    const row = toArticleRow(article);
    expect(row.content).toBeNull();
    expect(row.views).toBe(0);
    expect(row.read_time_minutes).toBe(0);
    expect(row.is_scraped).toBe(true);
    expect(row.summary).toBe(article.excerpt);
    expect(row.author_name).toBe(article.sourceName);
    expect(row.source_url).toBe(article.sourceUrl);
    expect(row.published_at_estimated).toBe(false);
    expect(row.coverage_count).toBe(1);
    expect(row.alt_sources).toEqual([]);
    expect(row.status).toBe("published");
  });

  it("carries the estimated-timestamp flag", () => {
    const row = toArticleRow({ ...article, publishedAtEstimated: true });
    expect(row.published_at_estimated).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run tests/store.test.ts`
Expected: FAIL because `src/lib/ingest/store.ts` does not exist.

- [ ] **Step 3: Implement the repository**

Create `src/lib/ingest/store.ts`:

```ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  ArticleRepository,
  CandidateArticle,
  IngestResult,
  NormalizedArticle,
} from "./types";

export function toArticleRow(article: NormalizedArticle): Record<string, unknown> {
  return {
    title: article.title,
    slug: article.slug,
    summary: article.excerpt,
    content: null,
    excerpt: article.excerpt,
    category_slug: article.category,
    tags: article.tags,
    featured_image: article.imageUrl,
    author_name: article.sourceName,
    published_at: article.publishedAt,
    updated_at: article.fetchedAt,
    read_time_minutes: 0,
    views: 0,
    is_breaking: false,
    is_top_story: false,
    is_trending: false,
    is_featured: false,
    status: "published",
    is_scraped: true,
    source_id: article.sourceId,
    source_name: article.sourceName,
    source_url: article.sourceUrl,
    fetched_at: article.fetchedAt,
    published_at_estimated: article.publishedAtEstimated,
    coverage_count: 1,
    alt_sources: [],
  };
}

interface CandidateRow {
  id: string;
  title: string;
  source_url: string | null;
  published_at: string | null;
  published_at_estimated: boolean | null;
  coverage_count: number | null;
}

export function createSupabaseRepository(config: {
  url: string;
  serviceRoleKey: string;
}): ArticleRepository {
  const db: SupabaseClient = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return {
    async findExistingSourceUrls(urls: string[]): Promise<Set<string>> {
      if (urls.length === 0) return new Set();
      const { data, error } = await db.from("articles").select("source_url").in("source_url", urls);
      if (error) throw new Error(`source lookup failed: ${error.message}`);
      return new Set(
        (data ?? [])
          .map((row) => row.source_url)
          .filter((value): value is string => typeof value === "string"),
      );
    },

    async findExistingSlugs(slugs: string[]): Promise<Set<string>> {
      if (slugs.length === 0) return new Set();
      const { data, error } = await db.from("articles").select("slug").in("slug", slugs);
      if (error) throw new Error(`slug lookup failed: ${error.message}`);
      return new Set(
        (data ?? [])
          .map((row) => row.slug)
          .filter((value): value is string => typeof value === "string"),
      );
    },

    async findRecentCandidates(sinceIso: string, limit: number): Promise<CandidateArticle[]> {
      const { data, error } = await db
        .from("articles")
        .select("id, title, source_url, published_at, published_at_estimated, coverage_count")
        .eq("is_scraped", true)
        .eq("status", "published")
        .gte("published_at", sinceIso)
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(`candidate lookup failed: ${error.message}`);
      const rows = (data ?? []) as CandidateRow[];
      return rows
        .filter((row) => row.source_url && row.published_at)
        .map((row) => ({
          id: row.id,
          title: row.title,
          sourceUrl: row.source_url as string,
          publishedAt: row.published_at as string,
          publishedAtEstimated: Boolean(row.published_at_estimated),
          coverageCount: row.coverage_count ?? 1,
        }));
    },

    async insertArticle(article: NormalizedArticle): Promise<{ id: string }> {
      const { data, error } = await db
        .from("articles")
        .insert(toArticleRow(article))
        .select("id")
        .single();
      if (error) throw new Error(`insert failed: ${error.message}`);
      return { id: data.id as string };
    },

    async updateBySourceUrl(article: NormalizedArticle): Promise<void> {
      const { error } = await db
        .from("articles")
        .update(toArticleRow(article))
        .eq("source_url", article.sourceUrl);
      if (error) throw new Error(`update failed: ${error.message}`);
    },

    async mergeSource(primaryId: string, article: NormalizedArticle): Promise<void> {
      const { error } = await db.rpc("merge_article_source", {
        p_primary_id: primaryId,
        p_source_url: article.sourceUrl,
        p_source_name: article.sourceName,
        p_published_at: article.publishedAt,
        p_published_at_estimated: article.publishedAtEstimated,
        p_fetched_at: article.fetchedAt,
      });
      if (error) throw new Error(`merge failed: ${error.message}`);
    },

    async logRun(result: IngestResult, startedAt: Date, finishedAt: Date): Promise<void> {
      const { error } = await db.from("ingest_runs").insert({
        source_id: result.sourceId,
        status: result.status,
        discovered: result.discovered,
        fetched: result.fetched,
        inserted: result.inserted,
        merged: result.merged,
        skipped: result.skipped,
        errors: result.errors,
        duration_ms: result.durationMs,
        message: result.message ?? null,
        started_at: startedAt.toISOString(),
        finished_at: finishedAt.toISOString(),
      });
      if (error) throw new Error(`run log failed: ${error.message}`);
    },
  };
}
```

- [ ] **Step 4: Run the test and typecheck**

Run: `npx vitest run tests/store.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS. If Supabase's generated row types complain about `data.id`, cast via `as { id: string }`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ingest/store.ts tests/store.test.ts
git commit -m "feat: add Supabase ingestion repository"
```

---

### Task 8: Ingestion orchestrator

**Files:**
- Create: `src/lib/ingest/run.ts`
- Create: `tests/support/memoryRepository.ts`
- Test: `tests/run.test.ts`

**Interfaces:**
- Consumes: `SourceAdapter`, `ArticleRepository`, `IngestResult`, `NormalizedArticle`, `CandidateArticle`
- Produces: `runIngest(options: RunIngestOptions): Promise<IngestResult[]>`
- Produces: `RunIngestOptions { repository; adapters; fetcherFor; robotsFor?; maxPerSource?; now?; candidateWindowHours? }`

- [ ] **Step 1: Write the in-memory repository**

Create `tests/support/memoryRepository.ts`:

```ts
import type {
  ArticleRepository,
  CandidateArticle,
  IngestResult,
  NormalizedArticle,
} from "@/lib/ingest/types";

export interface MemoryRepository extends ArticleRepository {
  articles: NormalizedArticle[];
  runs: Array<IngestResult & { startedAt: Date; finishedAt: Date }>;
  inserts: NormalizedArticle[];
  merges: Array<{ primaryId: string; article: NormalizedArticle }>;
}

export function createMemoryRepository(seed: NormalizedArticle[] = []): MemoryRepository {
  const articles = [...seed];
  const runs: MemoryRepository["runs"] = [];
  const inserts: NormalizedArticle[] = [];
  const merges: MemoryRepository["merges"] = [];

  return {
    articles,
    runs,
    inserts,
    merges,
    async findExistingSourceUrls(urls: string[]): Promise<Set<string>> {
      const wanted = new Set(urls);
      return new Set(
        articles.filter((article) => wanted.has(article.sourceUrl)).map((article) => article.sourceUrl),
      );
    },
    async findExistingSlugs(slugs: string[]): Promise<Set<string>> {
      const wanted = new Set(slugs);
      return new Set(articles.filter((article) => wanted.has(article.slug)).map((article) => article.slug));
    },
    async findRecentCandidates(): Promise<CandidateArticle[]> {
      return articles.map((article, index) => ({
        id: `existing-${index}`,
        title: article.title,
        sourceUrl: article.sourceUrl,
        publishedAt: article.publishedAt,
        publishedAtEstimated: article.publishedAtEstimated,
        coverageCount: 1,
      }));
    },
    async insertArticle(article: NormalizedArticle): Promise<{ id: string }> {
      inserts.push(article);
      articles.push(article);
      return { id: `inserted-${inserts.length}` };
    },
    async updateBySourceUrl(): Promise<void> {
      return;
    },
    async mergeSource(primaryId: string, article: NormalizedArticle): Promise<void> {
      merges.push({ primaryId, article });
    },
    async logRun(result: IngestResult, startedAt: Date, finishedAt: Date): Promise<void> {
      runs.push({ ...result, startedAt, finishedAt });
    },
  };
}
```

- [ ] **Step 2: Write the failing orchestrator tests**

Create `tests/run.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { runIngest } from "@/lib/ingest/run";
import type { PoliteFetcher } from "@/lib/ingest/fetcher";
import type { RobotsChecker } from "@/lib/ingest/robots";
import type { RawArticle, SourceAdapter } from "@/lib/ingest/types";
import { createMemoryRepository } from "./support/memoryRepository";

const listing = `<a href="/news/kantara-1.html">ಕಾಂತಾರ</a><a href="/news/yash-2.html">ಯಶ್</a><a href="/news/old-3.html">ಹಳೆಯದು</a>`;

function rawFor(url: string, title: string): RawArticle {
  return {
    sourceId: "test",
    sourceName: "ಟೆಸ್ಟ್ ಮೂಲ",
    sourceUrl: `https://example.com${url}`,
    title,
    excerpt: `${title} ಬಗ್ಗೆ ವಿವರವಾದ ಕನ್ನಡ ಸುದ್ದಿ ಮತ್ತು ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.`,
    imageUrl: "https://example.com/image.jpg",
    publishedAt: "2026-10-31T08:00:00Z",
  };
}

const adapter: SourceAdapter = {
  id: "test",
  name: "ಟೆಸ್ಟ್ ಮೂಲ",
  homepage: "https://example.com",
  listingUrls: ["https://example.com/listing"],
  allowedHosts: ["example.com"],
  defaultCategory: "sandalwood",
  extractLinks: () => [
    "https://example.com/news/kantara-1.html",
    "https://example.com/news/yash-2.html",
    "https://example.com/news/old-3.html",
  ],
  parseArticle: (_html, url) => {
    if (url.endsWith("kantara-1.html")) return rawFor("/news/kantara-1.html", "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ");
    if (url.endsWith("yash-2.html")) return rawFor("/news/yash-2.html", "ಯಶ್ ಟಾಕ್ಸಿಕ್ ಚಿತ್ರದ ಶೂಟಿಂಗ್ ಆರಂಭ");
    return rawFor("/news/old-3.html", "ಹಳೆಯ ಸುದ್ದಿ ವರದಿ");
  },
};

function fetcher(): PoliteFetcher {
  return {
    async fetchText(url: string) {
      if (url.endsWith("/robots.txt")) return "User-agent: *\nAllow: /";
      if (url.endsWith("/listing")) return listing;
      return "<html></html>";
    },
  };
}

function robots(): RobotsChecker {
  return { async isAllowed() { return true; } };
}

describe("runIngest", () => {
  it("skips URLs already stored by exact source_url", async () => {
    const repository = createMemoryRepository([
      {
        sourceId: "test",
        sourceName: "ಟೆಸ್ಟ್ ಮೂಲ",
        sourceUrl: "https://example.com/news/old-3.html",
        title: "ಹಳೆಯ ಸುದ್ದಿ ವರದಿ",
        excerpt: "ಹಳೆಯ ಸುದ್ದಿ ವರದಿ ಬಗ್ಗೆ ವಿವರವಾದ ಕನ್ನಡ ಸುದ್ದಿ ಮತ್ತು ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.",
        imageUrl: "https://example.com/image.jpg",
        publishedAt: "2026-10-30T08:00:00Z",
        publishedAtEstimated: false,
        fetchedAt: "2026-10-30T09:00:00Z",
        category: "sandalwood",
        tags: ["ಸ್ಯಾಂಡಲ್ವುಡ್"],
        slug: "old-3",
      },
    ]);

    const results = await runIngest({
      repository,
      adapters: [adapter],
      fetcherFor: fetcher,
      robotsFor: robots,
      maxPerSource: 5,
      now: () => new Date("2026-10-31T09:00:00Z"),
    });

    expect(results[0]).toMatchObject({ sourceId: "test", discovered: 3, skipped: 1 });
    expect(repository.inserts).toHaveLength(2);
    expect(repository.inserts.map((article) => article.slug)).toEqual(["kantara-1", "yash-2"]);
    expect(results[0].status).toBe("success");
  });

  it("skips an already-stored canonical URL even when the listing link differs", async () => {
    const repository = createMemoryRepository([
      {
        sourceId: "test",
        sourceName: "ಟೆಸ್ಟ್ ಮೂಲ",
        sourceUrl: "https://example.com/news/kantara-1.html",
        title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
        excerpt: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಬಗ್ಗೆ ವಿವರವಾದ ಕನ್ನಡ ಸುದ್ದಿ ಇಲ್ಲಿದೆ.",
        imageUrl: "https://example.com/image.jpg",
        publishedAt: "2026-10-31T08:00:00Z",
        publishedAtEstimated: false,
        fetchedAt: "2026-10-31T08:05:00Z",
        category: "sandalwood",
        tags: ["ಸ್ಯಾಂಡಲ್ವುಡ್"],
        slug: "kantara-1",
      },
    ]);

    const trackingAdapter: SourceAdapter = {
      ...adapter,
      extractLinks: () => ["https://example.com/news/kantara-1.html?utm_source=homepage"],
      parseArticle: () => rawFor("/news/kantara-1.html", "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ"),
    };

    const results = await runIngest({
      repository,
      adapters: [trackingAdapter],
      fetcherFor: fetcher,
      robotsFor: robots,
      maxPerSource: 3,
      now: () => new Date("2026-10-31T09:00:00Z"),
    });

    expect(results[0]).toMatchObject({ skipped: 1, inserted: 0, merged: 0, errors: 0 });
    expect(repository.inserts).toHaveLength(0);
    expect(repository.merges).toHaveLength(0);
  });

  it("merges a near-identical story instead of inserting it", async () => {
    const repository = createMemoryRepository([
      {
        sourceId: "other",
        sourceName: "ಇನ್ನೊಂದು ಮೂಲ",
        sourceUrl: "https://other.example/news/kantara-1.html",
        title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
        excerpt: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣದ ಬಗ್ಗೆ ಇನ್ನೊಂದು ಮೂಲದ ವರದಿ ಇಲ್ಲಿದೆ.",
        imageUrl: "https://other.example/image.jpg",
        publishedAt: "2026-10-31T07:30:00Z",
        publishedAtEstimated: false,
        fetchedAt: "2026-10-31T08:00:00Z",
        category: "sandalwood",
        tags: ["ಸ್ಯಾಂಡಲ್ವುಡ್"],
        slug: "kantara-other",
      },
    ]);

    const results = await runIngest({
      repository,
      adapters: [adapter],
      fetcherFor: fetcher,
      robotsFor: robots,
      maxPerSource: 1,
      now: () => new Date("2026-10-31T09:00:00Z"),
    });

    expect(repository.merges).toHaveLength(1);
    expect(repository.merges[0].primaryId).toBe("existing-0");
    expect(repository.inserts).toHaveLength(0);
    expect(results[0]).toMatchObject({ merged: 1, inserted: 0 });
  });

  it("respects maxPerSource and logs a summary run", async () => {
    const repository = createMemoryRepository();
    const results = await runIngest({
      repository,
      adapters: [adapter],
      fetcherFor: fetcher,
      robotsFor: robots,
      maxPerSource: 1,
      now: () => new Date("2026-10-31T09:00:00Z"),
    });

    expect(repository.inserts).toHaveLength(1);
    expect(results[0].fetched).toBe(1);
    expect(repository.runs.some((run) => run.sourceId === "test")).toBe(true);
    expect(repository.runs.some((run) => run.sourceId === "all")).toBe(true);
  });

  it("isolates a failing source so other sources finish", async () => {
    const repository = createMemoryRepository();
    const failing: SourceAdapter = {
      ...adapter,
      id: "broken",
      listingUrls: ["https://broken.example/listing"],
      allowedHosts: ["broken.example"],
    };
    const failingFetcher = (source: SourceAdapter): PoliteFetcher => ({
      async fetchText(url: string) {
        if (source.id === "broken") throw new Error("boom");
        return fetcher().fetchText(url);
      },
    });

    const results = await runIngest({
      repository,
      adapters: [failing, adapter],
      fetcherFor: failingFetcher,
      robotsFor: robots,
      maxPerSource: 1,
      now: () => new Date("2026-10-31T09:00:00Z"),
    });

    expect(results.find((result) => result.sourceId === "broken")?.status).toBe("failed");
    expect(results.find((result) => result.sourceId === "test")?.status).toBe("success");
    expect(repository.inserts).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npx vitest run tests/run.test.ts`
Expected: FAIL because `src/lib/ingest/run.ts` does not exist.

- [ ] **Step 4: Implement the orchestrator**

Create `src/lib/ingest/run.ts`:

```ts
import type { PoliteFetcher } from "./fetcher";
import type { RobotsChecker } from "./robots";
import { INGEST_BOT_TOKEN } from "./robots";
import type {
  ArticleRepository,
  CandidateArticle,
  IngestResult,
  SourceAdapter,
} from "./types";
import { inferCategory } from "./categorize";
import { findMergeCandidate } from "./dedupe";
import { normalizeArticle, slugFromUrl } from "./normalize";
import { validateRawArticle } from "./validate";

export interface RunIngestOptions {
  repository: ArticleRepository;
  adapters: SourceAdapter[];
  fetcherFor: (adapter: SourceAdapter) => PoliteFetcher;
  robotsFor?: (adapter: SourceAdapter) => RobotsChecker;
  maxPerSource?: number;
  now?: () => Date;
  candidateWindowHours?: number;
}

const ALLOW_ALL: RobotsChecker = {
  async isAllowed() {
    return true;
  },
};

function emptyResult(sourceId: string): IngestResult {
  return {
    sourceId,
    status: "success",
    discovered: 0,
    fetched: 0,
    inserted: 0,
    merged: 0,
    skipped: 0,
    errors: 0,
    durationMs: 0,
  };
}

export async function runIngest(options: RunIngestOptions): Promise<IngestResult[]> {
  const maxPerSource = options.maxPerSource ?? 3;
  const now = options.now ?? (() => new Date());
  const windowHours = options.candidateWindowHours ?? 48;

  const runs = await Promise.allSettled(
    options.adapters.map(async (adapter) => {
      const startedAt = now();
      const result = emptyResult(adapter.id);
      try {
        const fetcher = options.fetcherFor(adapter);
        const robots = options.robotsFor?.(adapter) ?? ALLOW_ALL;
        const listingUrl = adapter.listingUrls[0];
        if (!listingUrl) throw new Error("adapter has no listing URL");

        if (!(await robots.isAllowed(listingUrl, INGEST_BOT_TOKEN))) {
          result.skipped += 1;
          result.message = "listing disallowed by robots.txt";
          return { result, startedAt };
        }

        const listingHtml = await fetcher.fetchText(listingUrl);
        const discovered = adapter.extractLinks(listingHtml, listingUrl);
        result.discovered = discovered.length;

        const existing = await options.repository.findExistingSourceUrls(discovered);
        const unseen = discovered.filter((url) => !existing.has(url)).slice(0, maxPerSource);
        result.skipped += discovered.length - unseen.length;

        if (unseen.length === 0) {
          return { result, startedAt };
        }

        const since = new Date(now().getTime() - windowHours * 60 * 60 * 1000).toISOString();
        const candidates: CandidateArticle[] = await options.repository.findRecentCandidates(since, 300);
        const takenSlugs = await options.repository.findExistingSlugs(unseen.map(slugFromUrl));

        for (const url of unseen) {
          if (!(await robots.isAllowed(url, INGEST_BOT_TOKEN))) {
            result.skipped += 1;
            continue;
          }
          try {
            const html = await fetcher.fetchText(url);
            result.fetched += 1;
            const raw = adapter.parseArticle(html, url);
            if (!raw) {
              result.skipped += 1;
              continue;
            }
            const checked = validateRawArticle(raw, adapter.allowedHosts);
            if (!checked.ok) {
              result.skipped += 1;
              continue;
            }

            const normalized = normalizeArticle(checked.article, {
              category: inferCategory(
                { title: checked.article.title, excerpt: checked.article.excerpt },
                adapter.defaultCategory,
              ),
              fetchedAt: now().toISOString(),
              takenSlugs,
            });

            // Listing links and canonical URLs often differ by tracking params,
            // so re-check the canonical URL before merging or inserting.
            const storedCanonical = await options.repository.findExistingSourceUrls([
              normalized.sourceUrl,
            ]);
            if (storedCanonical.has(normalized.sourceUrl)) {
              result.skipped += 1;
              continue;
            }

            const mergeCandidate = findMergeCandidate(normalized.title, candidates);
            if (mergeCandidate) {
              await options.repository.mergeSource(mergeCandidate.id, normalized);
              result.merged += 1;
              continue;
            }

            const inserted = await options.repository.insertArticle(normalized);
            result.inserted += 1;
            candidates.push({
              id: inserted.id,
              title: normalized.title,
              sourceUrl: normalized.sourceUrl,
              publishedAt: normalized.publishedAt,
              publishedAtEstimated: normalized.publishedAtEstimated,
              coverageCount: 1,
            });
          } catch {
            result.errors += 1;
          }
        }

        result.status =
          result.errors === 0
            ? "success"
            : result.inserted + result.merged > 0
              ? "partial"
              : "failed";
        return { result, startedAt };
      } catch (error) {
        result.status = "failed";
        result.errors += 1;
        result.message = error instanceof Error ? error.message : "unknown error";
        return { result, startedAt };
      }
    }),
  );

  const results: IngestResult[] = [];
  for (const settled of runs) {
    if (settled.status === "fulfilled") {
      const { result, startedAt } = settled.value;
      result.durationMs = now().getTime() - startedAt.getTime();
      results.push(result);
      try {
        await options.repository.logRun(result, startedAt, now());
      } catch {
        // Logging failures must not hide a successful ingestion.
      }
    }
  }

  const failedCount = results.filter((result) => result.status === "failed").length;
  const summary: IngestResult = {
    sourceId: "all",
    status:
      results.length > 0 && failedCount === results.length
        ? "failed"
        : failedCount > 0 || results.some((result) => result.status === "partial")
          ? "partial"
          : "success",
    discovered: results.reduce((sum, result) => sum + result.discovered, 0),
    fetched: results.reduce((sum, result) => sum + result.fetched, 0),
    inserted: results.reduce((sum, result) => sum + result.inserted, 0),
    merged: results.reduce((sum, result) => sum + result.merged, 0),
    skipped: results.reduce((sum, result) => sum + result.skipped, 0),
    errors: results.reduce((sum, result) => sum + result.errors, 0),
    durationMs: Math.max(0, ...results.map((result) => result.durationMs)),
  };
  try {
    const finishedAt = now();
    await options.repository.logRun(summary, new Date(finishedAt.getTime() - summary.durationMs), finishedAt);
  } catch {
    // Same as above: the health log is best-effort.
  }

  return results;
}
```

- [ ] **Step 5: Run the orchestrator tests**

Run: `npx vitest run tests/run.test.ts`
Expected: PASS. The merge test relies on a title Jaccard score at or above 0.62; if it fails, keep the test title exactly as written in both the seed and the adapter.

- [ ] **Step 6: Commit**

```bash
git add src/lib/ingest/run.ts tests/support/memoryRepository.ts tests/run.test.ts
git commit -m "feat: add per-source ingestion orchestrator"
```

---

### Task 9: Read layer — row mapper, feed metadata, and live-first DataService

**Files:**
- Create: `src/lib/articles/mapper.ts`
- Create: `src/lib/time.ts` (the pure date helpers are expanded in the UI plan; create the file now with the helpers the read layer needs)
- Create: `src/lib/feed.ts`
- Modify: `src/lib/dataService.ts`
- Test: `tests/mapper.test.ts`
- Test: `tests/feed.test.ts`

**Interfaces:**
- Produces: `ArticleRow`, `mapRowToArticle(row: ArticleRow, now?: Date): Article`
- Produces: `FeedMeta`, `demoFeedMeta(articles: Article[], now?: Date): FeedMeta`, `isSameIstDay(iso: string, now?: Date): boolean`
- Produces: `DataService.getFeedMeta(): Promise<FeedMeta>`, `DataService.getIngestRuns(limit?: number): Promise<IngestRunRow[]>`
- Produces: `DataService.getArticleBySlug` no longer mutates `views`

- [ ] **Step 1: Write the failing mapper test**

Create `tests/mapper.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { mapRowToArticle, type ArticleRow } from "@/lib/articles/mapper";

const scrapedRow: ArticleRow = {
  id: "11111111-1111-1111-1111-111111111111",
  title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
  title_en: null,
  slug: "kantara-123",
  summary: "ಕುಂದಾಪುರದಲ್ಲಿ ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ.",
  content: null,
  category_slug: "sandalwood",
  tags: ["ಸ್ಯಾಂಡಲ್ವುಡ್"],
  featured_image: "https://images.filmibeat.com/kantara.jpg",
  image_caption: null,
  author_name: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ",
  author_id: null,
  published_at: "2026-10-31T08:30:00Z",
  updated_at: "2026-10-31T09:00:00Z",
  read_time_minutes: 0,
  views: 0,
  is_breaking: false,
  is_top_story: false,
  is_trending: false,
  is_featured: false,
  status: "published",
  source_name: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ",
  source_url: "https://kannada.filmibeat.com/news/kantara-123.html",
  source_id: "filmibeat",
  excerpt: "ಕುಂದಾಪುರದಲ್ಲಿ ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದ್ದು ಅಭಿಮಾನಿಗಳಲ್ಲಿ ಕುತೂಹಲ ಮೂಡಿಸಿದೆ.",
  is_scraped: true,
  fetched_at: "2026-10-31T09:00:00Z",
  published_at_estimated: false,
  coverage_count: 1,
  alt_sources: [],
};

describe("mapRowToArticle", () => {
  it("maps a scraped row without fabricated metrics", () => {
    const article = mapRowToArticle(scrapedRow, new Date("2026-10-31T09:10:00Z"));
    expect(article.views).toBe(0);
    expect(article.readTimeMinutes).toBe(0);
    expect(article.content).toBeUndefined();
    expect(article.isScraped).toBe(true);
    expect(article.source).toEqual({
      id: "filmibeat",
      name: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ",
      url: "https://kannada.filmibeat.com/news/kantara-123.html",
      publishedAtEstimated: false,
    });
    expect(article.isBreaking).toBe(false);
  });

  it("earns the breaking label only within 60 minutes and with real coverage", () => {
    const covered = mapRowToArticle(
      { ...scrapedRow, coverage_count: 2 },
      new Date("2026-10-31T09:10:00Z"),
    );
    expect(covered.isBreaking).toBe(true);

    const stale = mapRowToArticle(
      { ...scrapedRow, coverage_count: 2 },
      new Date("2026-10-31T12:00:00Z"),
    );
    expect(stale.isBreaking).toBe(false);
  });

  it("keeps editorial content and author data", () => {
    const article = mapRowToArticle({
      ...scrapedRow,
      is_scraped: false,
      content: "ಪೂರ್ಣ ಲೇಖನ",
      views: 1200,
      read_time_minutes: 4,
      source_name: null,
      source_url: null,
      source_id: null,
      excerpt: null,
      published_at_estimated: false,
    });
    expect(article.content).toBe("ಪೂರ್ಣ ಲೇಖನ");
    expect(article.views).toBe(1200);
    expect(article.readTimeMinutes).toBe(4);
    expect(article.source).toBeUndefined();
  });
});
```

- [ ] **Step 2: Write the failing feed test**

Create `tests/feed.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { demoFeedMeta, isSameIstDay } from "@/lib/feed";
import type { Article } from "@/types";

const article: Article = {
  id: "1",
  title: "ಸುದ್ದಿ",
  slug: "news",
  summary: "ಸುದ್ದಿ",
  category: "sandalwood",
  categoryName: "ಸ್ಯಾಂಡಲ್ವುಡ್",
  tags: [],
  featuredImage: "https://example.com/a.jpg",
  author: { id: "a", name: "ಮೂಲ" },
  publishedAt: "2026-10-31T02:00:00Z",
  readTimeMinutes: 0,
  views: 0,
  status: "published",
};

describe("feed helpers", () => {
  it("uses the IST day boundary", () => {
    const now = new Date("2026-10-31T20:00:00Z");
    expect(isSameIstDay("2026-10-31T02:00:00Z", now)).toBe(true);
    expect(isSameIstDay("2026-10-30T20:00:00Z", now)).toBe(false);
  });

  it("marks demo metadata and counts today's seed stories", () => {
    const meta = demoFeedMeta([article], new Date("2026-10-31T20:00:00Z"));
    expect(meta.demo).toBe(true);
    expect(meta.todayCount).toBe(1);
    expect(meta.latestPublishedAt).toBe(article.publishedAt);
    expect(meta.activeSources).toBe(0);
    expect(meta.sources).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

Run: `npx vitest run tests/mapper.test.ts tests/feed.test.ts`
Expected: FAIL because the modules do not exist.

- [ ] **Step 4: Create time helpers**

Create `src/lib/time.ts`:

```ts
import { formatKannadaDate } from "./utils";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function minutesSince(dateString: string, now = new Date()): number {
  const time = Date.parse(dateString);
  if (!Number.isFinite(time)) return Number.POSITIVE_INFINITY;
  return (now.getTime() - time) / 60_000;
}

export function formatKannadaRelative(dateString: string, now = new Date()): string {
  const minutes = minutesSince(dateString, now);
  if (!Number.isFinite(minutes)) return dateString;
  if (minutes < 1) return "ಈಗಷ್ಟೇ";
  if (minutes < 60) return `${Math.floor(minutes)} ನಿಮಿಷಗಳ ಹಿಂದೆ`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ಗಂಟೆಗಳ ಹಿಂದೆ`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ನಿನ್ನೆ";
  if (days < 7) return `${days} ದಿನಗಳ ಹಿಂದೆ`;
  return formatKannadaDate(dateString);
}

export function formatKannadaExact(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("kn-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function startOfIstDay(now = new Date()): Date {
  const shifted = new Date(now.getTime() + IST_OFFSET_MS);
  const start = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
  );
  return new Date(start - IST_OFFSET_MS);
}

export function isSameIstDay(dateString: string, now = new Date()): boolean {
  const time = Date.parse(dateString);
  if (!Number.isFinite(time)) return false;
  const start = startOfIstDay(now).getTime();
  const end = start + 24 * 60 * 60 * 1000;
  return time >= start && time < end;
}
```

- [ ] **Step 5: Create the row mapper**

Create `src/lib/articles/mapper.ts`:

```ts
import type { Article, CategorySlug } from "@/types";
import { categoryName } from "@/lib/categories";
import { minutesSince } from "@/lib/time";

export interface ArticleRow {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  summary: string;
  content: string | null;
  category_slug: string;
  tags: string[] | null;
  featured_image: string;
  image_caption: string | null;
  author_name: string;
  author_id: string | null;
  published_at: string;
  updated_at: string | null;
  read_time_minutes: number | null;
  views: number | null;
  is_breaking: boolean | null;
  is_top_story: boolean | null;
  is_trending: boolean | null;
  is_featured: boolean | null;
  status: "published" | "draft" | "scheduled";
  source_name: string | null;
  source_url: string | null;
  source_id: string | null;
  excerpt: string | null;
  is_scraped: boolean | null;
  fetched_at: string | null;
  published_at_estimated: boolean | null;
  coverage_count: number | null;
  alt_sources: unknown;
}

function readAltSources(value: unknown): { name: string; url: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    if (typeof record.name !== "string" || typeof record.url !== "string") return [];
    return [{ name: record.name, url: record.url }];
  });
}

export function mapRowToArticle(row: ArticleRow, now = new Date()): Article {
  const scraped = Boolean(row.is_scraped);
  const coverage = row.coverage_count ?? 1;
  const estimated = Boolean(row.published_at_estimated);
  const breaking =
    Boolean(row.is_breaking) ||
    (!estimated && coverage >= 2 && minutesSince(row.published_at, now) < 60);

  const source =
    scraped && row.source_name && row.source_url && row.source_id
      ? {
          id: row.source_id,
          name: row.source_name,
          url: row.source_url,
          publishedAtEstimated: estimated,
        }
      : undefined;

  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en ?? undefined,
    slug: row.slug,
    summary: row.excerpt ?? row.summary,
    excerpt: row.excerpt ?? undefined,
    content: row.content ?? undefined,
    category: row.category_slug as CategorySlug,
    categoryName: categoryName(row.category_slug),
    tags: row.tags ?? [],
    featuredImage: row.featured_image,
    imageCaption: row.image_caption ?? undefined,
    author: {
      id: row.source_id ?? row.author_id ?? "sini-desk",
      name: scraped ? (row.source_name ?? "ಸಿನಿ ಕನ್ನಡ") : row.author_name,
      role: scraped ? "ಮೂಲ ವರದಿ" : undefined,
    },
    publishedAt: row.published_at,
    updatedAt: row.updated_at ?? undefined,
    readTimeMinutes: row.read_time_minutes ?? 0,
    views: row.views ?? 0,
    isBreaking: breaking,
    isTopStory: Boolean(row.is_top_story),
    isTrending: Boolean(row.is_trending),
    isFeatured: Boolean(row.is_featured),
    status: row.status,
    source,
    coverageCount: coverage,
    altSources: readAltSources(row.alt_sources),
    isScraped: scraped,
    fetchedAt: row.fetched_at ?? undefined,
    publishedAtEstimated: estimated,
  };
}
```

- [ ] **Step 6: Create feed metadata helpers**

Create `src/lib/feed.ts`:

```ts
import type { Article } from "@/types";
import { isSameIstDay } from "@/lib/time";

export interface FeedSource {
  id: string;
  name: string;
  lastPublishedAt: string;
}

export interface FeedMeta {
  latestPublishedAt: string | null;
  todayCount: number;
  activeSources: number;
  lastIngestAt: string | null;
  demo: boolean;
  sources: FeedSource[];
}

export interface IngestRunRow {
  id: string;
  source_id: string;
  status: "success" | "partial" | "failed";
  discovered: number;
  fetched: number;
  inserted: number;
  merged: number;
  skipped: number;
  errors: number;
  duration_ms: number;
  message: string | null;
  started_at: string;
  finished_at: string | null;
}

export function demoFeedMeta(articles: Article[], now = new Date()): FeedMeta {
  const sorted = [...articles].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  return {
    latestPublishedAt: sorted[0]?.publishedAt ?? null,
    todayCount: articles.filter((article) => isSameIstDay(article.publishedAt, now)).length,
    activeSources: 0,
    lastIngestAt: null,
    demo: true,
    sources: [],
  };
}
```

- [ ] **Step 7: Update DataService to read live data first**

In `src/lib/dataService.ts`, remove `CATEGORIES` from the existing `@/data/mockData` import (it currently sits on line 21), then add imports:

```ts
import { CATEGORIES } from "@/lib/categories";
import { mapRowToArticle, type ArticleRow } from "@/lib/articles/mapper";
import { demoFeedMeta, type FeedMeta, type IngestRunRow } from "@/lib/feed";
```

Then replace `getArticles`, `getArticleBySlug`, `getBreakingNews`, `getTopStories`, and `getTrendingArticles` with:

```ts
async getArticles(category?: CategorySlug): Promise<Article[]> {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.articles);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryArticles = parsed;
        }
      } catch (error) {
        console.error("Error reading stored articles:", error);
      }
    }
  }

  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (category && category !== "mukhaputa") {
        query = query.eq("category_slug", category);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      const rows = (data ?? []) as ArticleRow[];
      if (rows.length > 0) return rows.map((row) => mapRowToArticle(row));

      // An empty filtered result means "no news in this category yet", not
      // "the feed is offline" — only fall back to demo when the table is empty.
      const { count } = await supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published");
      if (count && count > 0) return [];
    } catch (error) {
      console.warn("Supabase fetch failed, fallback to demo data:", error);
    }
  }

  if (category && category !== "mukhaputa") {
    return memoryArticles.filter((article) => article.category === category);
  }
  return memoryArticles;
},

async getArticleBySlug(slug: string): Promise<Article | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!error && data) {
        return mapRowToArticle(data as ArticleRow);
      }
    } catch (error) {
      console.warn("Supabase article fetch failed, fallback to demo data:", error);
    }
  }
  return memoryArticles.find((article) => article.slug === slug) ?? null;
},

async getBreakingNews(): Promise<Article[]> {
  const all = await this.getArticles();
  return all.filter((article) => article.isBreaking);
},

async getTopStories(): Promise<Article[]> {
  const all = await this.getArticles();
  return all.filter((article) => article.isTopStory);
},

async getTrendingArticles(limit: number = 5): Promise<Article[]> {
  if (isSupabaseConfigured()) {
    try {
      const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .eq("is_scraped", true)
        .gte("published_at", since)
        .order("coverage_count", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(limit);
      if (!error && data && data.length > 0) {
        return (data as ArticleRow[]).map((row) => mapRowToArticle(row));
      }
    } catch (error) {
      console.warn("Supabase trending fetch failed, fallback to demo data:", error);
    }
  }

  const all = await this.getArticles();
  return [...all]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, limit);
},
```

Add these methods before the reviews section:

```ts
async getFeedMeta(): Promise<FeedMeta> {
  if (!isSupabaseConfigured()) {
    return demoFeedMeta(memoryArticles);
  }

  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const [latestResult, countResult, sourcesResult, runResult] = await Promise.all([
      supabase
        .from("articles")
        .select("published_at")
        .eq("status", "published")
        .eq("is_scraped", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("is_scraped", true),
      supabase
        .from("articles")
        .select("source_id, source_name, published_at")
        .eq("status", "published")
        .eq("is_scraped", true)
        .gte("published_at", since24h),
      supabase
        .from("ingest_runs")
        .select("finished_at")
        .eq("source_id", "all")
        .eq("status", "success")
        .order("finished_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (countResult.count === null || countResult.count === 0) {
      return demoFeedMeta(memoryArticles);
    }

    const sourceMap = new Map<string, { id: string; name: string; lastPublishedAt: string }>();
    for (const row of sourcesResult.data ?? []) {
      const id = row.source_id as string;
      const name = (row.source_name as string) ?? id;
      const publishedAt = row.published_at as string;
      const current = sourceMap.get(id);
      if (!current || Date.parse(publishedAt) > Date.parse(current.lastPublishedAt)) {
        sourceMap.set(id, { id, name, lastPublishedAt: publishedAt });
      }
    }

    return {
      latestPublishedAt: (latestResult.data?.published_at as string | undefined) ?? null,
      todayCount: sourcesResult.data?.filter((row) =>
        isSameIstDay(row.published_at as string),
      ).length ?? 0,
      activeSources: sourceMap.size,
      lastIngestAt: (runResult.data?.finished_at as string | undefined) ?? null,
      demo: false,
      sources: [...sourceMap.values()].sort(
        (a, b) => Date.parse(b.lastPublishedAt) - Date.parse(a.lastPublishedAt),
      ),
    };
  } catch (error) {
    console.warn("Supabase feed metadata failed, fallback to demo data:", error);
    return demoFeedMeta(memoryArticles);
  }
},

async getIngestRuns(limit: number = 10): Promise<IngestRunRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from("ingest_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(limit);
    if (!error && data) return data as IngestRunRow[];
  } catch (error) {
    console.warn("Supabase ingest runs failed:", error);
  }
  return [];
},
```

Add `import { isSameIstDay } from "@/lib/time";` at the top (alongside the other imports).

- [ ] **Step 8: Run the tests and typecheck**

Run: `npx vitest run tests/mapper.test.ts tests/feed.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS. Existing `saveArticle` still compiles because `content` is optional and it coalesces to `""`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/articles/mapper.ts src/lib/time.ts src/lib/feed.ts src/lib/dataService.ts tests/mapper.test.ts tests/feed.test.ts
git commit -m "feat: read live articles first with honest metrics and feed metadata"
```

---

### Task 10: Ingest, articles, and feed-version API routes

**Files:**
- Create: `src/lib/articles/query.ts`
- Create: `src/app/api/ingest/route.ts`
- Create: `src/app/api/articles/route.ts`
- Create: `src/app/api/feed/version/route.ts`
- Test: `tests/api.test.ts`

**Interfaces:**
- Produces: `queryArticles(query): Promise<{ articles: Article[]; demo: boolean; nextCursor: string | null }>`
- Produces: `parseLimit(value: string | null): number`, `sanitizeSearch(value: string): string`
- Produces: `handleIngest(request, deps?): Promise<Response>`, `handleArticles(request, deps?): Promise<Response>`, `handleFeedVersion(getMeta?): Promise<Response>`

- [ ] **Step 1: Write the failing API tests**

Create `tests/api.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { handleArticles, parseLimit, sanitizeSearch } from "@/app/api/articles/route";
import { handleFeedVersion } from "@/app/api/feed/version/route";
import { handleIngest } from "@/app/api/ingest/route";
import type { IngestResult } from "@/lib/ingest/types";

describe("parseLimit", () => {
  it("defaults to 20 and clamps between 1 and 50", () => {
    expect(parseLimit(null)).toBe(20);
    expect(parseLimit("0")).toBe(1);
    expect(parseLimit("-5")).toBe(1);
    expect(parseLimit("999")).toBe(50);
    expect(parseLimit("12")).toBe(12);
  });
});

describe("sanitizeSearch", () => {
  it("drops PostgREST filter punctuation", () => {
    expect(sanitizeSearch("  kannada,(cinema). ")).toBe("kannada cinema");
  });
});

describe("ingest route", () => {
  it("returns 503 when secrets are missing", async () => {
    const response = await handleIngest(new Request("http://localhost/api/ingest"), {
      env: {},
    });
    expect(response.status).toBe(503);
  });

  it("returns 401 for an invalid secret", async () => {
    const response = await handleIngest(
      new Request("http://localhost/api/ingest", {
        headers: { authorization: "Bearer wrong" },
      }),
      {
        env: {
          SUPABASE_SERVICE_ROLE_KEY: "service",
          NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
          CRON_SECRET: "right",
        },
      },
    );
    expect(response.status).toBe(401);
  });

  it("runs ingestion and returns per-source results", async () => {
    const run = vi.fn(async (): Promise<IngestResult[]> => [
      {
        sourceId: "filmibeat",
        status: "success",
        discovered: 3,
        fetched: 3,
        inserted: 2,
        merged: 1,
        skipped: 0,
        errors: 0,
        durationMs: 1200,
      },
    ]);
    const response = await handleIngest(
      new Request("http://localhost/api/ingest", {
        headers: { "x-ingest-secret": "right" },
      }),
      {
        env: {
          SUPABASE_SERVICE_ROLE_KEY: "service",
          NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
          CRON_SECRET: "right",
          INGEST_MAX_PER_SOURCE: "3",
          INGEST_REQUEST_DELAY_MS: "1000",
          INGEST_USER_AGENT: "SiniKannadaBot/1.0",
        },
        run,
      },
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.inserted).toBe(2);
    expect(body.merged).toBe(1);
    expect(run).toHaveBeenCalledTimes(1);
  });
});

describe("articles route", () => {
  it("returns demo articles with a meta.demo flag", async () => {
    const response = await handleArticles(
      new Request("http://localhost/api/articles?limit=999"),
      {
        query: async () => ({
          articles: [],
          demo: true,
          nextCursor: null,
        }),
      },
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ articles: [], meta: { demo: true } });
  });
});

describe("feed version route", () => {
  it("returns the latest timestamp with a short cache", async () => {
    const response = await handleFeedVersion(async () => ({
      latestPublishedAt: "2026-10-31T08:30:00Z",
      todayCount: 4,
      activeSources: 3,
      lastIngestAt: "2026-10-31T09:00:00Z",
      demo: false,
      sources: [],
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age=15");
    expect(await response.json()).toMatchObject({
      latestPublishedAt: "2026-10-31T08:30:00Z",
    });
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run tests/api.test.ts`
Expected: FAIL because the route modules do not exist.

- [ ] **Step 3: Implement the article query helper**

Create `src/lib/articles/query.ts`:

```ts
import type { Article, CategorySlug } from "@/types";
import { ARTICLES_SEED } from "@/data/mockData";
import { mapRowToArticle, type ArticleRow } from "@/lib/articles/mapper";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface ArticleQuery {
  category?: string;
  q?: string;
  limit: number;
  cursor?: string;
}

export interface ArticleQueryResult {
  articles: Article[];
  demo: boolean;
  nextCursor: string | null;
}

export function demoQuery(query: ArticleQuery): ArticleQueryResult {
  let articles = [...ARTICLES_SEED].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  if (query.category && query.category !== "mukhaputa") {
    articles = articles.filter((article) => article.category === query.category);
  }
  if (query.cursor) {
    articles = articles.filter((article) => Date.parse(article.publishedAt) < Date.parse(query.cursor as string));
  }
  if (query.q) {
    const needle = query.q.toLowerCase();
    articles = articles.filter((article) =>
      [article.title, article.titleEn ?? "", article.summary, article.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }
  articles = articles.slice(0, query.limit);
  return {
    articles,
    demo: true,
    nextCursor: articles.length === query.limit ? articles[articles.length - 1].publishedAt : null,
  };
}

export async function queryArticles(query: ArticleQuery): Promise<ArticleQueryResult> {
  if (!isSupabaseConfigured()) return demoQuery(query);

  try {
    let request = supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(query.limit);
    if (query.category && query.category !== "mukhaputa") {
      request = request.eq("category_slug", query.category);
    }
    if (query.cursor) {
      request = request.lt("published_at", query.cursor);
    }
    if (query.q) {
      const term = query.q.replace(/[%_]/g, " ").trim();
      request = request.or(`title.ilike.%${term}%,summary.ilike.%${term}%,excerpt.ilike.%${term}%`);
    }

    const { data, error } = await request;
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      // No rows for this filter means "nothing matches", not "the feed is
      // offline" — only fall back to demo when the table itself is empty.
      const { count } = await supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published");
      if (!count) return demoQuery(query);
      return { articles: [], demo: false, nextCursor: null };
    }

    const articles = (data as ArticleRow[]).map((row) => mapRowToArticle(row));
    return {
      articles,
      demo: false,
      nextCursor: articles.length === query.limit ? articles[articles.length - 1].publishedAt : null,
    };
  } catch {
    return demoQuery(query);
  }
}

export function isCategorySlug(value: string | null): value is CategorySlug {
  return [
    "mukhaputa", "latest", "reviews", "sandalwood", "bollywood", "hollywood", "actors",
    "actresses", "interviews", "gossip", "gallery", "videos", "ott", "box-office", "upcoming",
  ].includes(value ?? "");
}
```

- [ ] **Step 4: Implement the ingest route**

Create `src/app/api/ingest/route.ts`:

```ts
import { isAuthorized } from "@/lib/ingest/auth";
import { createPoliteFetcher, type PoliteFetcher } from "@/lib/ingest/fetcher";
import { createRobotsChecker, INGEST_BOT_TOKEN } from "@/lib/ingest/robots";
import { runIngest, type RunIngestOptions } from "@/lib/ingest/run";
import { SOURCE_ADAPTERS } from "@/lib/ingest/sources";
import { createSupabaseRepository } from "@/lib/ingest/store";
import type { IngestResult, SourceAdapter } from "@/lib/ingest/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

export interface IngestRouteDeps {
  env?: Record<string, string | undefined>;
  run?: (options: RunIngestOptions) => Promise<IngestResult[]>;
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "cache-control": "no-store" } });
}

export async function handleIngest(
  request: Request,
  deps: IngestRouteDeps = {},
): Promise<Response> {
  const env = deps.env ?? process.env;
  if (!env.SUPABASE_SERVICE_ROLE_KEY || !env.NEXT_PUBLIC_SUPABASE_URL) {
    return json(
      {
        ok: false,
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      503,
    );
  }
  if (!env.CRON_SECRET) {
    return json({ ok: false, error: "CRON_SECRET is not configured." }, 503);
  }
  if (
    !isAuthorized(
      request.headers.get("authorization"),
      request.headers.get("x-ingest-secret"),
      env.CRON_SECRET,
    )
  ) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  const startedAt = Date.now();
  const repository = createSupabaseRepository({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  });
  const userAgent = env.INGEST_USER_AGENT ?? "SiniKannadaBot/1.0 (+https://sinikannada.com/bot)";
  const maxPerSource = Number(env.INGEST_MAX_PER_SOURCE ?? "3") || 3;
  const delayMs = Number(env.INGEST_REQUEST_DELAY_MS ?? "1000") || 1000;
  const runner = deps.run ?? runIngest;
  const fetchers = new Map<string, PoliteFetcher>();
  const fetcherFor = (adapter: SourceAdapter): PoliteFetcher => {
    const existing = fetchers.get(adapter.id);
    if (existing) return existing;
    const fetcher = createPoliteFetcher({
      userAgent,
      allowedHosts: adapter.allowedHosts,
      minDelayMs: delayMs,
    });
    fetchers.set(adapter.id, fetcher);
    return fetcher;
  };

  try {
    const results = await runner({
      repository,
      adapters: SOURCE_ADAPTERS,
      maxPerSource,
      fetcherFor,
      robotsFor: (adapter) => createRobotsChecker(fetcherFor(adapter), INGEST_BOT_TOKEN),
    });

    const inserted = results.reduce((sum, result) => sum + result.inserted, 0);
    const merged = results.reduce((sum, result) => sum + result.merged, 0);
    const errors = results.reduce((sum, result) => sum + result.errors, 0);
    const failed = results.some((result) => result.status === "failed");
    return json(
      {
        ok: !failed,
        durationMs: Date.now() - startedAt,
        sources: results,
        inserted,
        merged,
        errors,
      },
      failed ? 207 : 200,
    );
  } catch {
    return json({ ok: false, error: "Ingestion failed." }, 500);
  }
}

export const GET = (request: Request) => handleIngest(request);
export const POST = (request: Request) => handleIngest(request);
```

- [ ] **Step 5: Implement the articles route**

Create `src/app/api/articles/route.ts`:

```ts
import { queryArticles, type ArticleQueryResult } from "@/lib/articles/query";

export const dynamic = "force-dynamic";

export interface ArticlesRouteDeps {
  query?: (query: {
    category?: string;
    q?: string;
    limit: number;
    cursor?: string;
  }) => Promise<ArticleQueryResult>;
}

export function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "20");
  if (!Number.isFinite(parsed)) return 20;
  return Math.min(50, Math.max(1, Math.trunc(parsed)));
}

export function sanitizeSearch(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function handleArticles(
  request: Request,
  deps: ArticlesRouteDeps = {},
): Promise<Response> {
  const url = new URL(request.url);
  const q = sanitizeSearch(url.searchParams.get("q") ?? "");
  const category = url.searchParams.get("category") ?? undefined;
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const limit = parseLimit(url.searchParams.get("limit"));
  const query = deps.query ?? queryArticles;

  const result = await query({
    category,
    q: q.length >= 2 ? q : undefined,
    limit,
    cursor,
  });

  return Response.json(
    {
      articles: result.articles,
      meta: {
        demo: result.demo,
        count: result.articles.length,
        nextCursor: result.nextCursor,
      },
    },
    { headers: { "cache-control": "public, max-age=15, stale-while-revalidate=30" } },
  );
}

export const GET = (request: Request) => handleArticles(request);
```

- [ ] **Step 6: Implement the feed version route**

Create `src/app/api/feed/version/route.ts`:

```ts
import type { FeedMeta } from "@/lib/feed";
import { DataService } from "@/lib/dataService";

export const dynamic = "force-dynamic";

export async function handleFeedVersion(
  getMeta: () => Promise<FeedMeta> = () => DataService.getFeedMeta(),
): Promise<Response> {
  const meta = await getMeta();
  return Response.json(meta, {
    headers: { "cache-control": "public, max-age=15, stale-while-revalidate=30" },
  });
}

export const GET = () => handleFeedVersion();
```

- [ ] **Step 7: Run the API tests and typecheck**

Run: `npx vitest run tests/api.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS. If the unused `Article` import in the articles route remains, delete it.

- [ ] **Step 8: Commit**

```bash
git add src/lib/articles/query.ts src/app/api/ingest/route.ts src/app/api/articles/route.ts src/app/api/feed/version/route.ts tests/api.test.ts
git commit -m "feat: add free-tier ingest, articles, and feed version APIs"
```

---

## Phase 1 exit criteria

- `npm test` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- The migration applies cleanly in the Supabase SQL editor.
- A manual `curl` to `/api/ingest` with `CRON_SECRET` inserts real rows and writes `ingest_runs`.
- No scraped row contains invented views, read times, or full article bodies.

# Live Newsroom UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the live data foundation into the Live Newsroom UI: realtime updates, honest source and freshness metadata, a live desk, and attribution on every scraped story.

**Architecture:** Server components keep rendering the initial feed through `DataService`; a client `LiveFeedProvider` in the root layout subscribes to Supabase `postgres_changes` and falls back to a 45-second `/api/feed/version` poll. Homepage, category, article, and search pages consume the same `Article` shape, so badges and metadata rules live in one shared helper. Scraped stories display a headline, excerpt, source, timestamp, and canonical link — never view counts or read times, and never scraped HTML.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS, Supabase Realtime (`@supabase/supabase-js`), Vitest.

**Spec:** [docs/superpowers/specs/2026-10-31-live-newsroom-design.md](../specs/2026-10-31-live-newsroom-design.md)

## Global Constraints

- **Prerequisite:** Plan A ([2026-10-31-live-data-foundation.md](2026-10-31-live-data-foundation.md)) is complete: `@/lib/categories`, `@/lib/time`, `@/lib/feed`, `@/lib/articles/mapper`, the live-first `DataService`, and the three API routes exist.
- **Free tier only:** Supabase Free, Vercel Hobby, source CDN images hotlinked with `unoptimized`. No paid APIs, image storage, or translation services.
- **No fabricated metrics.** Scraped articles never render invented views, read times, or author names. Source name occupies the author slot.
- **Honest timestamps.** `publishedAtEstimated: true` renders `ಈಗ ತಿಳಿದುಬಂದಿದೆ`, never the fetch clock as publication time.
- **No scraped HTML.** Scraped text is plain text rendered by React. `dangerouslySetInnerHTML` stays exclusive to editorial `article.content`.
- **Attribution everywhere.** Every scraped card links out to the canonical source; every scraped article page shows a source card and alternate coverage.
- **Design tokens only.** Reuse `brand-*` Tailwind tokens. Red = live/breaking, amber = top story, emerald = fresh. No new palette.
- **Accessibility.** Semantic landmarks, visible headings, `aria-live="polite"` on the ticker and pill, 44px touch targets, WCAG AA contrast.
- **Verification commands:** `npx vitest run`, `npm run typecheck`, `npm run build`.

---

## File Map

| File | Responsibility |
| --- | --- |
| `src/lib/freshness.ts` | Freshness label/tone and source label rules |
| `src/components/SourceBadge.tsx` | Source name, optional canonical link |
| `src/components/FreshnessBadge.tsx` | Breaking / fresh / relative-time chip |
| `src/lib/live/version.ts` | `feedAdvanced()` poll comparator |
| `src/components/live/LiveFeedProvider.tsx` | Realtime channel, poll fallback, pending count, auto-refresh |
| `src/components/live/NewStoriesPill.tsx` | Pending-stories refresh pill |
| `src/components/live/LiveDeskBar.tsx` | Live status, counts, refresh controls |
| `src/components/live/LiveSearch.tsx` | Debounced `/api/articles` search |
| `src/lib/live/search.ts` | Search URL builder |
| `src/components/LiveBriefs.tsx` | Four compact hero side rows |
| `src/components/OttMiniList.tsx` | Sidebar OTT list |
| `src/components/SourceCard.tsx` | Article-page attribution card |
| `src/app/layout.tsx` | Provider, live desk bar mount point, footer feed data |
| `src/app/page.tsx` | Live Newsroom section order |
| `src/app/news/[slug]/page.tsx` | Scraped article variant |
| `src/app/category/[slug]/page.tsx` | Live category header |
| `src/app/search/page.tsx` | Live search entry point |
| `src/app/admin/ingest/page.tsx` | Read-only ingest health |
| `supabase/cron.sql` | `pg_cron` + `pg_net` scheduling |
| `.env.example` | Documented free-tier configuration |
| `next.config.mjs` | Source CDN image hosts |

---

### Task 11: Freshness and source badges

**Files:**
- Create: `src/lib/freshness.ts`
- Create: `src/components/SourceBadge.tsx`
- Create: `src/components/FreshnessBadge.tsx`
- Test: `tests/freshness.test.ts`

**Interfaces:**
- Consumes: `formatKannadaRelative`, `minutesSince`, `formatKannadaExact` from `@/lib/time` (Plan A Task 9); `Article` from `@/types` (Plan A Task 1).
- Produces: `freshnessFor(article, now?): { label: string; tone: "breaking" | "fresh" | "muted" }`, `sourceLabel(article): string`, `<SourceBadge article link? />`, `<FreshnessBadge article />`.

- [ ] **Step 1: Write the failing freshness test**

Create `tests/freshness.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { freshnessFor, sourceLabel } from "@/lib/freshness";
import type { Article } from "@/types";

const base: Article = {
  id: "a1",
  title: "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರೀಕರಣ ಆರಂಭ",
  slug: "kantara-1",
  summary: "ಕುಂದಾಪುರದಲ್ಲಿ ಚಿತ್ರೀಕರಣ ಆರಂಭವಾಗಿದೆ.",
  category: "sandalwood",
  categoryName: "ಸ್ಯಾಂಡಲ್ವುಡ್",
  tags: ["ಸ್ಯಾಂಡಲ್ವುಡ್"],
  featuredImage: "https://images.filmibeat.com/kantara.jpg",
  author: { id: "src-filmibeat", name: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ" },
  publishedAt: "2026-10-31T08:00:00Z",
  readTimeMinutes: 0,
  views: 0,
  status: "published",
  isScraped: true,
  source: {
    id: "filmibeat",
    name: "ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ",
    url: "https://kannada.filmibeat.com/news/kantara-1.html",
    publishedAtEstimated: false,
  },
};

const soonAfter = new Date("2026-10-31T08:20:00Z");

describe("freshnessFor", () => {
  it("marks a sub-hour story as fresh with relative time", () => {
    expect(freshnessFor(base, soonAfter)).toEqual({
      label: "ತಾಜಾ · 20 ನಿಮಿಷಗಳ ಹಿಂದೆ",
      tone: "fresh",
    });
  });

  it("uses the estimated label instead of the fetch clock", () => {
    expect(freshnessFor({ ...base, publishedAtEstimated: true }, soonAfter)).toEqual({
      label: "ಈಗ ತಿಳಿದುಬಂದಿದೆ",
      tone: "fresh",
    });
  });

  it("earns the breaking label only when the mapper set it", () => {
    expect(freshnessFor({ ...base, isBreaking: true }, soonAfter)).toEqual({
      label: "ಬ್ರೇಕಿಂಗ್",
      tone: "breaking",
    });
  });

  it("falls back to relative time after an hour", () => {
    expect(freshnessFor(base, new Date("2026-10-31T11:00:00Z"))).toEqual({
      label: "3 ಗಂಟೆಗಳ ಹಿಂದೆ",
      tone: "muted",
    });
  });

  it("labels a story with no usable timestamp", () => {
    expect(freshnessFor({ ...base, publishedAt: "not-a-date" }, soonAfter)).toEqual({
      label: "ಸಮಯ ತಿಳಿದಿಲ್ಲ",
      tone: "muted",
    });
  });
});

describe("sourceLabel", () => {
  it("prefers the scraped source name", () => {
    expect(sourceLabel(base)).toBe("ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ");
  });

  it("falls back to the author name for editorial articles", () => {
    expect(sourceLabel({ ...base, source: undefined })).toBe("ಫಿಲ್ಮಿಬೀಟ್ ಕನ್ನಡ");
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run tests/freshness.test.ts`
Expected: FAIL because `@/lib/freshness` does not exist.

- [ ] **Step 3: Implement the freshness helper**

Create `src/lib/freshness.ts`:

```ts
import type { Article } from "@/types";
import { formatKannadaRelative, minutesSince } from "@/lib/time";

export type FreshnessTone = "breaking" | "fresh" | "muted";

export interface FreshnessInfo {
  label: string;
  tone: FreshnessTone;
}

type FreshnessInput = Pick<Article, "isBreaking" | "publishedAt" | "publishedAtEstimated">;

export function freshnessFor(article: FreshnessInput, now = new Date()): FreshnessInfo {
  if (article.isBreaking) {
    return { label: "ಬ್ರೇಕಿಂಗ್", tone: "breaking" };
  }
  if (article.publishedAtEstimated) {
    return { label: "ಈಗ ತಿಳಿದುಬಂದಿದೆ", tone: "fresh" };
  }
  if (!Number.isFinite(Date.parse(article.publishedAt))) {
    return { label: "ಸಮಯ ತಿಳಿದಿಲ್ಲ", tone: "muted" };
  }
  const minutes = minutesSince(article.publishedAt, now);
  if (minutes < 60) {
    return {
      label: `ತಾಜಾ · ${formatKannadaRelative(article.publishedAt, now)}`,
      tone: "fresh",
    };
  }
  return { label: formatKannadaRelative(article.publishedAt, now), tone: "muted" };
}

export function sourceLabel(article: Pick<Article, "source" | "author">): string {
  return article.source?.name ?? article.author.name;
}
```

- [ ] **Step 4: Create the badge components**

Create `src/components/SourceBadge.tsx`:

```tsx
import React from "react";
import { ExternalLink } from "lucide-react";
import type { Article } from "@/types";
import { sourceLabel } from "@/lib/freshness";

interface SourceBadgeProps {
  article: Article;
  link?: boolean;
}

export default function SourceBadge({ article, link = false }: SourceBadgeProps) {
  const label = sourceLabel(article);
  const className =
    "inline-flex items-center gap-1 text-[11px] font-kannada text-gray-400 hover:text-brand-red transition-colors";

  if (link && article.source?.url) {
    return (
      <a
        href={article.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={`ಮೂಲ: ${label}`}
      >
        <span className="truncate max-w-[160px]">{label}</span>
        <ExternalLink className="w-3 h-3 shrink-0" />
      </a>
    );
  }

  return (
    <span className={className} title={article.source ? `ಮೂಲ: ${label}` : label}>
      <span className="truncate max-w-[160px]">{label}</span>
    </span>
  );
}
```

Create `src/components/FreshnessBadge.tsx`:

```tsx
import React from "react";
import { Flame, Timer } from "lucide-react";
import type { Article } from "@/types";
import { freshnessFor } from "@/lib/freshness";
import { formatKannadaExact } from "@/lib/time";

const TONE_CLASS: Record<string, string> = {
  breaking: "bg-brand-red text-white",
  fresh: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  muted: "bg-brand-card text-gray-400 border border-brand-border",
};

export default function FreshnessBadge({ article }: { article: Article }) {
  const info = freshnessFor(article);
  const title = article.publishedAtEstimated
    ? "ಮೂಲ ತಾಣದಲ್ಲಿ ಪ್ರಕಟಣೆ ಸಮಯ ಇಲ್ಲ; ಈಗ ಪತ್ತೆಯಾಗಿದೆ"
    : formatKannadaExact(article.publishedAt);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-kannada font-semibold whitespace-nowrap ${TONE_CLASS[info.tone]}`}
      title={title}
    >
      {info.tone === "breaking" ? (
        <Flame className="w-3 h-3" />
      ) : (
        <Timer className="w-3 h-3" />
      )}
      {info.label}
    </span>
  );
}
```

- [ ] **Step 5: Run the test and typecheck**

Run: `npx vitest run tests/freshness.test.ts`
Expected: PASS (7 tests).

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/freshness.ts src/components/SourceBadge.tsx src/components/FreshnessBadge.tsx tests/freshness.test.ts
git commit -m "feat: add honest freshness and source badges"
```

---

### Task 12: Realtime provider, new-stories pill, live desk

**Files:**
- Create: `src/lib/live/version.ts`
- Test: `tests/live-version.test.ts`
- Create: `src/components/live/LiveFeedProvider.tsx`
- Create: `src/components/live/NewStoriesPill.tsx`
- Create: `src/components/live/LiveDeskBar.tsx`

**Interfaces:**
- Consumes: `supabase`, `isSupabaseConfigured` from `@/lib/supabase`; `FeedMeta` from `@/lib/feed`.
- Produces: `feedAdvanced(previous, next): boolean`; `LiveFeedProvider({ initialFeed, children })`; `useLiveFeed(): { feed, connection, pending, autoRefresh, setAutoRefresh, refreshNow }`; `LiveConnection = "connecting" | "live" | "reconnecting" | "offline"`; `<NewStoriesPill />`; `<LiveDeskBar />`.

- [ ] **Step 1: Write the failing version test**

Create `tests/live-version.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { feedAdvanced } from "@/lib/live/version";

describe("feedAdvanced", () => {
  it("detects a newer timestamp", () => {
    expect(feedAdvanced("2026-10-31T08:00:00Z", "2026-10-31T08:05:00Z")).toBe(true);
  });

  it("ignores an identical or older timestamp", () => {
    expect(feedAdvanced("2026-10-31T08:05:00Z", "2026-10-31T08:05:00Z")).toBe(false);
    expect(feedAdvanced("2026-10-31T08:05:00Z", "2026-10-31T08:00:00Z")).toBe(false);
  });

  it("advances when no previous timestamp was recorded", () => {
    expect(feedAdvanced(null, "2026-10-31T08:05:00Z")).toBe(true);
  });

  it("ignores missing or invalid next values", () => {
    expect(feedAdvanced("2026-10-31T08:05:00Z", null)).toBe(false);
    expect(feedAdvanced("2026-10-31T08:05:00Z", "not-a-date")).toBe(false);
  });

  it("advances when the previous value was invalid", () => {
    expect(feedAdvanced("not-a-date", "2026-10-31T08:05:00Z")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run tests/live-version.test.ts`
Expected: FAIL because `@/lib/live/version` does not exist.

- [ ] **Step 3: Implement the version comparator**

Create `src/lib/live/version.ts`:

```ts
export function feedAdvanced(previous: string | null, next: string | null): boolean {
  if (!next) return false;
  const nextTime = Date.parse(next);
  if (!Number.isFinite(nextTime)) return false;
  if (!previous) return true;
  const previousTime = Date.parse(previous);
  if (!Number.isFinite(previousTime)) return true;
  return nextTime > previousTime;
}
```

- [ ] **Step 4: Implement the provider**

Create `src/components/live/LiveFeedProvider.tsx`:

```tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { feedAdvanced } from "@/lib/live/version";
import type { FeedMeta } from "@/lib/feed";

export type LiveConnection = "connecting" | "live" | "reconnecting" | "offline";

interface LiveFeedContextValue {
  feed: FeedMeta;
  connection: LiveConnection;
  pending: number;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  refreshNow: () => void;
}

const LiveFeedContext = createContext<LiveFeedContextValue | null>(null);

const AUTO_REFRESH_KEY = "sini_auto_refresh";
const POLL_INTERVAL_MS = 45_000;
const REFRESH_DEBOUNCE_MS = 2_000;

function readStoredAutoRefresh(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(AUTO_REFRESH_KEY) !== "false";
}

export function LiveFeedProvider({
  initialFeed,
  children,
}: {
  initialFeed: FeedMeta;
  children: ReactNode;
}) {
  const router = useRouter();
  const [feed, setFeed] = useState(initialFeed);
  const [connection, setConnection] = useState<LiveConnection>(
    isSupabaseConfigured() ? "connecting" : "offline",
  );
  const [pending, setPending] = useState(0);
  const [autoRefresh, setAutoRefreshState] = useState(true);
  const autoRefreshRef = useRef(true);
  const latestRef = useRef<string | null>(initialFeed.latestPublishedAt);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setFeed(initialFeed);
    latestRef.current = initialFeed.latestPublishedAt;
  }, [initialFeed]);

  useEffect(() => {
    const stored = readStoredAutoRefresh();
    autoRefreshRef.current = stored;
    setAutoRefreshState(stored);
  }, []);

  const setAutoRefresh = useCallback((value: boolean) => {
    autoRefreshRef.current = value;
    setAutoRefreshState(value);
    window.localStorage.setItem(AUTO_REFRESH_KEY, String(value));
    if (value) setPending(0);
  }, []);

  const refreshNow = useCallback(() => {
    setPending(0);
    router.refresh();
  }, [router]);

  const queueRefresh = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPending(0);
      router.refresh();
    }, REFRESH_DEBOUNCE_MS);
  }, [router]);

  const registerChange = useCallback(
    (latest: string | null, force: boolean) => {
      if (!force && !feedAdvanced(latestRef.current, latest)) return;
      if (latest) {
        const nextTime = Date.parse(latest);
        const currentTime = latestRef.current ? Date.parse(latestRef.current) : Number.NaN;
        if (
          Number.isFinite(nextTime) &&
          (!Number.isFinite(currentTime) || nextTime > currentTime)
        ) {
          latestRef.current = latest;
          setFeed((current) => ({ ...current, latestPublishedAt: latest }));
        }
      }
      setPending((count) => count + 1);
      if (autoRefreshRef.current) queueRefresh();
    },
    [queueRefresh],
  );

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setConnection("offline");
      return;
    }

    const channel = supabase
      .channel("sini-live-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "articles", filter: "status=eq.published" },
        (payload) => {
          const row = payload.new as {
            published_at?: string | null;
            fetched_at?: string | null;
          };
          registerChange(row.published_at ?? row.fetched_at ?? null, false);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "articles", filter: "status=eq.published" },
        (payload) => {
          const row = payload.new as { published_at?: string | null };
          registerChange(row.published_at ?? null, true);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setConnection("live");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setConnection("reconnecting");
        else if (status === "CLOSED") setConnection("offline");
      });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      void supabase.removeChannel(channel);
    };
  }, [registerChange]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const id = setInterval(async () => {
      try {
        const response = await fetch("/api/feed/version", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { latestPublishedAt?: string | null };
        registerChange(data.latestPublishedAt ?? null, false);
      } catch {
        setConnection("offline");
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [registerChange]);

  const value = useMemo(
    () => ({ feed, connection, pending, autoRefresh, setAutoRefresh, refreshNow }),
    [feed, connection, pending, autoRefresh, setAutoRefresh, refreshNow],
  );

  return <LiveFeedContext.Provider value={value}>{children}</LiveFeedContext.Provider>;
}

export function useLiveFeed(): LiveFeedContextValue {
  const value = useContext(LiveFeedContext);
  if (!value) throw new Error("useLiveFeed must be used inside LiveFeedProvider");
  return value;
}
```

- [ ] **Step 5: Create the pill and the live desk bar**

Create `src/components/live/NewStoriesPill.tsx`:

```tsx
"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { useLiveFeed } from "@/components/live/LiveFeedProvider";

export default function NewStoriesPill() {
  const { pending, autoRefresh, refreshNow } = useLiveFeed();

  if (pending === 0 || autoRefresh) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4" aria-live="polite">
      <button
        type="button"
        onClick={refreshNow}
        className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-xs font-bold font-kannada text-white shadow-xl shadow-black/40 hover:bg-brand-crimson transition-colors min-h-[44px]"
      >
        <ArrowUp className="w-4 h-4" />
        {pending} ಹೊಸ ಸುದ್ದಿ — ನವೀಕರಿಸಿ
      </button>
    </div>
  );
}
```

Create `src/components/live/LiveDeskBar.tsx`:

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { PauseCircle, PlayCircle, Radio, RefreshCw } from "lucide-react";
import { useLiveFeed } from "@/components/live/LiveFeedProvider";
import { formatKannadaRelative } from "@/lib/time";
import type { LiveConnection } from "@/components/live/LiveFeedProvider";

const CONNECTION_STYLE: Record<LiveConnection, { dot: string; label: string }> = {
  connecting: { dot: "bg-amber-400 animate-pulse", label: "ಸಂಪರ್ಕಿಸುತ್ತಿದೆ" },
  live: { dot: "bg-emerald-400 animate-pulse", label: "ಲೈವ್" },
  reconnecting: { dot: "bg-amber-400 animate-pulse", label: "ಮರುಸಂಪರ್ಕ" },
  offline: { dot: "bg-gray-500", label: "ಆಫ್ಲೈನ್" },
};

export default function LiveDeskBar() {
  const { feed, connection, autoRefresh, setAutoRefresh, refreshNow } = useLiveFeed();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const style = CONNECTION_STYLE[connection];
  const updatedAt = feed.latestPublishedAt ?? feed.lastIngestAt;
  const updatedLabel = now && updatedAt ? formatKannadaRelative(updatedAt, now) : "—";

  return (
    <section aria-label="ಲೈವ್ ಡೆಸ್ಕ್" className="border-b border-brand-border bg-[#121316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span
          className="flex items-center gap-1.5 text-gray-200"
          aria-label={`ಲೈವ್ ಸ್ಥಿತಿ: ${style.label}`}
        >
          <span className={`w-2 h-2 rounded-full ${style.dot}`} />
          <Radio className="w-3.5 h-3.5 text-brand-red" />
          <span className="font-semibold font-kannada">{style.label}</span>
        </span>

        {feed.demo && (
          <span className="px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-yellow text-[10px] font-bold font-kannada">
            ಡೆಮೊ ಡೇಟಾ
          </span>
        )}

        <span className="text-brand-muted font-kannada">ಕೊನೆಯ ನವೀಕರಣ: {updatedLabel}</span>
        <span className="text-brand-muted font-kannada">ಇಂದು {feed.todayCount} ಸುದ್ದಿ</span>
        <span className="text-brand-muted font-kannada">{feed.activeSources} ಮೂಲಗಳು</span>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            aria-pressed={autoRefresh}
            className="inline-flex items-center gap-1 rounded-lg border border-brand-border bg-brand-dark px-2.5 py-1.5 text-[11px] font-kannada text-gray-300 hover:text-white hover:border-brand-red/60 transition-colors min-h-[44px]"
          >
            {autoRefresh ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
            <span>{autoRefresh ? "ಸ್ವಯಂ ನವೀಕರಣ ಆನ್" : "ಸ್ವಯಂ ನವೀಕರಣ ಆಫ್"}</span>
          </button>
          <button
            type="button"
            onClick={refreshNow}
            aria-label="ಈಗ ನವೀಕರಿಸಿ"
            className="inline-flex items-center gap-1 rounded-lg border border-brand-border bg-brand-dark px-2.5 py-1.5 text-[11px] font-kannada text-gray-300 hover:text-white hover:border-brand-red/60 transition-colors min-h-[44px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ನವೀಕರಿಸಿ</span>
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run tests and typecheck**

Run: `npx vitest run tests/live-version.test.ts`
Expected: PASS (5 tests).

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/live/version.ts tests/live-version.test.ts src/components/live/LiveFeedProvider.tsx src/components/live/NewStoriesPill.tsx src/components/live/LiveDeskBar.tsx
git commit -m "feat: add realtime live feed provider and desk controls"
```

---

### Task 13: Global shell — layout, header, footer, ticker

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/BreakingTicker.tsx`

**Interfaces:**
- Consumes: `DataService.getFeedMeta()` (Plan A Task 9); `LiveFeedProvider`, `NewStoriesPill`, `LiveDeskBar`, `useLiveFeed` (Task 12); `CATEGORIES` from `@/lib/categories`; `formatKannadaRelative` from `@/lib/time`.
- Produces: `Footer({ feed }: { feed: FeedMeta })`; root layout supplies feed context to every page.

- [ ] **Step 1: Wire the provider into the root layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveDeskBar from "@/components/live/LiveDeskBar";
import { LiveFeedProvider } from "@/components/live/LiveFeedProvider";
import NewStoriesPill from "@/components/live/NewStoriesPill";
import { DataService } from "@/lib/dataService";

export const metadata: Metadata = {
  metadataBase: new URL("https://sinikannada.com"),
  title: {
    default: "ಸಿನಿ ಕನ್ನಡ | Kannada Cinema News, Reviews, Box Office & Sandalwood Updates",
    template: "%s | ಸಿನಿ ಕನ್ನಡ (Sini Kannada)",
  },
  description:
    "ಕರ್ನಾಟಕದ ನಂ.1 ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಪೋರ್ಟಲ್. ಸ್ಯಾಂಡಲ್ವುಡ್ ಇತ್ತೀಚಿನ ಸುದ್ದಿ, ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್, ಒಟಿಟಿ ಅಪ್ಡೇಟ್ಸ್, ಫೋಟೋ ಗ್ಯಾಲರಿ ಮತ್ತು ವಿಡಿಯೋಗಳು.",
  keywords: [
    "ಕನ್ನಡ ಸಿನಿಮಾ",
    "ಸ್ಯಾಂಡಲ್ವುಡ್ ಸುದ್ದಿ",
    "Sandalwood news",
    "Kannada cinema",
    "Kannada movie reviews",
    "Kantara Chapter 1",
    "Yash Toxic",
    "Kiccha Sudeep Max",
    "Kannada box office",
    "Kannada OTT releases",
    "ಸಿನಿ ಕನ್ನಡ",
  ],
  authors: [{ name: "ಸಿನಿ ಕನ್ನಡ ಬ್ಯೂರೋ", url: "https://sinikannada.com" }],
  openGraph: {
    title: "ಸಿನಿ ಕನ್ನಡ - Sandalwood Entertainment News",
    description: "ಕರ್ನಾಟಕದ ನಂ.1 ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಪೋರ್ಟಲ್. ಕ್ಷಣಕ್ಷಣದ ತಾಜಾ ಸಮಾಚಾರ.",
    url: "https://sinikannada.com",
    siteName: "ಸಿನಿ ಕನ್ನಡ (Sini Kannada)",
    locale: "kn_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "ಸಿನಿ ಕನ್ನಡ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ಸಿನಿ ಕನ್ನಡ | Sandalwood Cinema News",
    description: "ಕನ್ನಡ ಸಿನಿಮಾಗಳ ಕ್ಷಣಕ್ಷಣದ ಸುದ್ದಿ, ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 60;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const feed = await DataService.getFeedMeta();

  return (
    <html lang="kn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hubballi&family=Noto+Sans+Kannada:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0F0F11] text-gray-100 font-kannada antialiased selection:bg-brand-red selection:text-white">
        <LiveFeedProvider initialFeed={feed}>
          <Header />
          <LiveDeskBar />
          <main className="flex-1 w-full">{children}</main>
          <Footer feed={feed} />
          <NewStoriesPill />
        </LiveFeedProvider>
      </body>
    </html>
  );
}
```

The live desk bar sits under the header on every page, as the spec requires for global live state.

- [ ] **Step 2: Update the header**

In `src/components/Header.tsx`, replace the mock import:

```tsx
import { CATEGORIES } from "@/data/mockData";
```

with:

```tsx
import { CATEGORIES } from "@/lib/categories";
import { useLiveFeed } from "@/components/live/LiveFeedProvider";
```

Then add the connection state inside the component, after `const pathname = usePathname();`:

```tsx
  const { connection } = useLiveFeed();
```

Remove the fake 728×90 leaderboard block entirely:

```tsx
        {/* Header Ad Slot (728x90 Leaderboard placeholder / responsive) */}
        <div className="hidden lg:flex items-center justify-center bg-brand-dark border border-dashed border-brand-border rounded-lg px-6 py-2.5 max-w-lg w-full text-center">
          <div className="text-center">
            <span className="text-[10px] text-brand-muted uppercase tracking-wider block">
              ಜಾಹೀರಾತು (Leaderboard 728x90)
            </span>
            <span className="text-xs text-gray-300 font-medium">
              ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 &middot; ಟಾಕ್ಸಿಕ್ &middot; ಮ್ಯಾಕ್ಸ್ ವಿಶೇಷ ಪ್ರಾಯೋಜಕತ್ವ
            </span>
          </div>
        </div>
```

Add the live dot to the utility bar by replacing:

```tsx
          <div className="flex items-center gap-3">
            <Link
              href="/category/trending"
```

with:

```tsx
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1.5"
              aria-label={`ಲೈವ್ ಸ್ಥಿತಿ: ${connection}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connection === "live"
                    ? "bg-emerald-400 animate-pulse"
                    : connection === "offline"
                      ? "bg-gray-500"
                      : "bg-amber-400 animate-pulse"
                }`}
              />
              <span className="text-gray-400">
                {connection === "live"
                  ? "ಲೈವ್"
                  : connection === "reconnecting"
                    ? "ಮರುಸಂಪರ್ಕ"
                    : connection === "connecting"
                      ? "ಸಂಪರ್ಕ..."
                      : "ಆಫ್ಲೈನ್"}
              </span>
            </span>
            <span className="text-brand-border">•</span>
            <Link
              href="/#trending"
```

`/category/trending` is not a real category and 404s; the trending rail lives on the homepage, so the link points at its anchor (added in Task 14 Step 3).

- [ ] **Step 3: Rewrite the footer**

Replace `src/components/Footer.tsx` with:

```tsx
import React from "react";
import Link from "next/link";
import { Film, Send, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { FeedMeta } from "@/lib/feed";
import { formatKannadaRelative } from "@/lib/time";

interface FooterProps {
  feed: FeedMeta;
}

export default function Footer({ feed }: FooterProps) {
  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-brand-border text-white mt-16 font-kannada">
      <div className="h-1 w-full bg-gradient-to-r from-brand-red via-brand-yellow to-brand-crimson"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-brand-red flex items-center justify-center text-white shadow-lg shadow-brand-red/30">
                <Film className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">ಸಿನಿ</span>
                <span className="text-2xl font-black text-brand-red">ಕನ್ನಡ</span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-sm">
              **ಸಿನಿ ಕನ್ನಡ** - ಕನ್ನಡಿಗರ ನೆಚ್ಚಿನ ಡಿಜಿಟಲ್ ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ತಾಣ. ಸ್ಯಾಂಡಲ್ವುಡ್, ಬಾಲಿವುಡ್, ಹಾಲಿವುಡ್ ಚಿತ್ರರಂಗದ ಕ್ಷಣಕ್ಷಣದ ಬ್ರೇಕಿಂಗ್ ಸುದ್ದಿ, ನೈಜ ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ ಮತ್ತು ಸೆಲೆಬ್ರಿಟಿ ಸಂದರ್ಶನಗಳ ಸಮಗ್ರ ಪೋರ್ಟಲ್.
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold text-gray-300 block mb-2">
                ಟೆಲಿಗ್ರಾಂ & ವಾಟ್ಸಾಪ್ ಚಾನೆಲ್ ಸೇರಿ:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-cyan-500/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ಟೆಲಿಗ್ರಾಂ</span>
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                >
                  <span>ವಾಟ್ಸಾಪ್ ಚಾನೆಲ್</span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              ಪ್ರಮುಖ ವಿಭಾಗಗಳು
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.slug === "mukhaputa" ? "/" : `/category/${cat.slug}`}
                    className="hover:text-brand-red transition-colors block py-0.5"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              ಮನರಂಜನೆ & ಸಿನಿಮಾ
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              {CATEGORIES.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-brand-red transition-colors block py-0.5"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-red pl-2">
              ವಿಶೇಷ ಸೇವೆಗಳು
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/box-office" className="hover:text-emerald-400 transition-colors block py-0.5">
                  ಬಾಕ್ಸ್ ಆಫೀಸ್ ರಿಪೋರ್ಟ್
                </Link>
              </li>
              <li>
                <Link href="/ott" className="hover:text-sky-400 transition-colors block py-0.5">
                  OTT ಬಿಡುಗಡೆ ಕ್ಯಾಲೆಂಡರ್
                </Link>
              </li>
              <li>
                <Link href="/category/reviews" className="hover:text-brand-yellow transition-colors block py-0.5">
                  ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ವಿಮರ್ಶೆಗಳು
                </Link>
              </li>
              <li>
                <Link href="/admin/ingest" className="hover:text-white transition-colors block py-0.5">
                  ಇಂಜೆಸ್ಟ್ ಸ್ಥಿತಿ (Ingest Health)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center gap-1 text-brand-red font-bold hover:underline py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ಅಡ್ಮಿನ್ ಲಾಗಿನ್ (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brand-border/60">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-brand-muted">
            <span className="text-gray-300 font-semibold">ಸುದ್ದಿ ಮೂಲಗಳು:</span>
            {feed.sources.length === 0 ? (
              <span>ಡೆಮೊ ಮೋಡ್</span>
            ) : (
              feed.sources.map((source) => (
                <span key={source.id}>
                  {source.name} · {formatKannadaRelative(source.lastPublishedAt)}
                </span>
              ))
            )}
            {feed.lastIngestAt && (
              <span className="sm:ml-auto">
                ಕೊನೆಯ ಯಶಸ್ವಿ ಸಿಂಕ್: {formatKannadaRelative(feed.lastIngestAt)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>
            &copy; {new Date().getFullYear()} ಸಿನಿ ಕನ್ನಡ (Sini Kannada). ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ಗೌಪ್ಯತೆ ನೀತಿ (Privacy Policy)</span>
            <span>•</span>
            <span>ಬಳಕೆಯ ನಿಯಮಗಳು (Terms of Use)</span>
            <span>•</span>
            <span>ಸಂಪರ್ಕಿಸಿ (Contact Us)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Rewrite the breaking ticker with real data only**

Replace `src/components/BreakingTicker.tsx` with:

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Pause, Play, ChevronRight } from "lucide-react";
import { Article } from "@/types";
import { sourceLabel } from "@/lib/freshness";
import { formatKannadaRelative } from "@/lib/time";

interface BreakingTickerProps {
  articles: Article[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, articles.length]);

  if (articles.length === 0) return null;

  const index = currentIndex % articles.length;
  const current = articles[index];

  return (
    <div
      className="w-full bg-[#181112] border-b border-brand-red/30 py-2 px-4 sm:px-6"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-red to-brand-crimson text-white px-3 py-1 rounded text-xs font-bold font-kannada tracking-wide shadow-md shrink-0">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <Zap className="w-3.5 h-3.5 text-white" />
          <span>ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <Link
            href={`/news/${current.slug}`}
            className="block text-xs sm:text-sm font-medium text-gray-200 hover:text-brand-red transition-colors font-kannada truncate"
          >
            {current.title}
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-brand-muted mt-0.5">
            <span className="text-brand-red font-kannada font-semibold">{sourceLabel(current)}</span>
            <span>•</span>
            <span>{mounted ? formatKannadaRelative(current.publishedAt) : ""}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-brand-muted">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded hover:bg-brand-card hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={isPaused ? "ಮುಂದುವರಿಸಿ" : "ವಿರಾಮ"}
            aria-label={isPaused ? "ಟಿಕ್ಕರ್ ಮುಂದುವರಿಸಿ" : "ಟಿಕ್ಕರ್ ವಿರಾಮಗೊಳಿಸಿ"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] font-sans text-gray-400">
            {index + 1}/{articles.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % articles.length)}
            className="p-1.5 rounded hover:bg-brand-card hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="ಮುಂದಿನ ಸುದ್ದಿ"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

The hardcoded fallback list is removed; an empty list renders nothing instead of fake headlines.

- [ ] **Step 5: Verify the shell compiles**

Run: `npm run typecheck`
Expected: PASS.

Run: `npx vitest run`
Expected: PASS (no UI tests yet, all Plan A tests still green).

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/components/Header.tsx src/components/Footer.tsx src/components/BreakingTicker.tsx
git commit -m "feat: mount live feed provider and honest global shell"
```

---

### Task 14: Article card, hero, trending rail

**Files:**
- Modify: `src/components/ArticleCard.tsx`
- Modify: `src/components/HeroTopStories.tsx`
- Modify: `src/components/TrendingSidebar.tsx`

**Interfaces:**
- Consumes: `SourceBadge`, `FreshnessBadge` (Task 11); `sourceLabel` from `@/lib/freshness`; `formatKannadaNumber` from `@/lib/utils`.
- Produces: single-link `ArticleCard` with honest metadata; lead-only `HeroTopStories`; coverage-based `TrendingSidebar`.

- [ ] **Step 1: Rewrite the article card**

Replace `src/components/ArticleCard.tsx` with:

```tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaNumber } from "@/lib/utils";
import SourceBadge from "@/components/SourceBadge";
import FreshnessBadge from "@/components/FreshnessBadge";

interface ArticleCardProps {
  article: Article;
  variant?: "grid" | "horizontal" | "compact" | "minimal";
}

const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

function CardImage({
  article,
  sizes,
  className,
}: {
  article: Article;
  sizes: string;
  className: string;
}) {
  return (
    <Image
      src={article.featuredImage}
      alt={article.title}
      fill
      unoptimized={Boolean(article.isScraped)}
      referrerPolicy="no-referrer"
      className={className}
      sizes={sizes}
    />
  );
}

function ViewCount({ views }: { views: number }) {
  if (views <= 0) return null;
  return (
    <span className="flex items-center gap-1">
      <Eye className="w-3 h-3 text-brand-red" />
      {formatKannadaNumber(views)}
    </span>
  );
}

export default function ArticleCard({ article, variant = "grid" }: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={`group flex flex-col sm:flex-row gap-4 bg-brand-dark hover:bg-brand-card p-3 rounded-xl border border-brand-border/60 hover:border-brand-red/60 transition-all duration-300 ${FOCUS_RING}`}
      >
        <div className="relative aspect-[16/10] sm:w-48 sm:h-32 shrink-0 rounded-lg overflow-hidden">
          <CardImage
            article={article}
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-brand-red/15 text-brand-red text-[10px] font-bold font-kannada">
                {article.categoryName}
              </span>
              <FreshnessBadge article={article} />
            </div>
            <h3 className="mt-2 text-sm sm:text-base font-bold text-white group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
              {article.title}
            </h3>
            <p className="mt-1.5 text-xs text-gray-400 font-kannada line-clamp-2">
              {article.summary}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-brand-muted">
            <SourceBadge article={article} />
            <ViewCount views={article.views} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/news/${article.slug}`}
        className={`group flex gap-3 py-2.5 border-b border-brand-border/40 last:border-none ${FOCUS_RING}`}
      >
        <div className="relative w-20 h-16 shrink-0 rounded-md overflow-hidden">
          <CardImage
            article={article}
            sizes="80px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-brand-red font-kannada leading-tight line-clamp-2 transition-colors">
            {article.title}
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-brand-muted mt-1">
            <span className="text-brand-red font-kannada font-medium">{article.categoryName}</span>
            <span>•</span>
            <FreshnessBadge article={article} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${article.slug}`}
      className={`group flex flex-col bg-brand-dark rounded-xl overflow-hidden border border-brand-border/80 hover:border-brand-red/60 hover:-translate-y-0.5 transition-all duration-300 ${FOCUS_RING}`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <CardImage
          article={article}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-brand-red text-white text-[11px] font-bold font-kannada tracking-wide shadow-md">
            {article.categoryName}
          </span>
          <FreshnessBadge article={article} />
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-xs text-gray-400 font-kannada line-clamp-2">
            {article.summary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between gap-3 text-[11px] text-brand-muted">
          <SourceBadge article={article} />
          <ViewCount views={article.views} />
        </div>
      </div>
    </Link>
  );
}
```

Notes:
- Each card is now a single link, so keyboard focus is one stop per card.
- `unoptimized` is set only for scraped images; editorial images keep optimization.
- `ViewCount` renders nothing when `views === 0`, which is always true for scraped rows.

- [ ] **Step 2: Make the hero lead-only with honest metadata**

Replace `src/components/HeroTopStories.tsx` with:

```tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Flame } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaDate } from "@/lib/utils";
import FreshnessBadge from "@/components/FreshnessBadge";
import { sourceLabel } from "@/lib/freshness";

interface HeroTopStoriesProps {
  articles: Article[];
}

export default function HeroTopStories({ articles }: HeroTopStoriesProps) {
  const leadStory = articles[0];
  if (!leadStory) return null;

  return (
    <section className="w-full" aria-label="ಮುಖ್ಯ ಸುದ್ದಿ">
      <div className="group relative rounded-2xl overflow-hidden bg-brand-dark border border-brand-border/80">
        <Link
          href={`/news/${leadStory.slug}`}
          className="block relative aspect-[16/10] sm:aspect-[16/9] w-full outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          <Image
            src={leadStory.featuredImage}
            alt={leadStory.title}
            fill
            priority
            unoptimized={Boolean(leadStory.isScraped)}
            referrerPolicy="no-referrer"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent"></div>

          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold font-kannada tracking-wide shadow-lg">
              {leadStory.categoryName}
            </span>
            {leadStory.isTopStory && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-black text-xs font-bold font-kannada flex items-center gap-1 shadow-md">
                <Flame className="w-3.5 h-3.5 fill-black" />
                ಟಾಪ್ ಸ್ಟೋರಿ
              </span>
            )}
            <FreshnessBadge article={leadStory} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-kannada leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
              {leadStory.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-300 font-kannada line-clamp-2 max-w-3xl hidden sm:block">
              {leadStory.summary}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400 font-sans">
              <span className="font-kannada text-gray-300 font-medium">
                {sourceLabel(leadStory)}
              </span>
              <span>•</span>
              <span>{formatKannadaDate(leadStory.publishedAt)}</span>
              {!leadStory.isScraped && leadStory.readTimeMinutes > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-muted" />
                    {leadStory.readTimeMinutes} ನಿಮಿಷ ಓದು
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Make the trending rail coverage-based**

Replace `src/components/TrendingSidebar.tsx` with:

```tsx
import React from "react";
import Link from "next/link";
import { Flame, Layers } from "lucide-react";
import { Article } from "@/types";
import { formatKannadaNumber, formatKannadaTimeAgo } from "@/lib/utils";
import { sourceLabel } from "@/lib/freshness";

interface TrendingSidebarProps {
  articles: Article[];
  title?: string;
}

export default function TrendingSidebar({
  articles,
  title = "ಟ್ರೆಂಡಿಂಗ್ (ಹೆಚ್ಚು ಕವರೇಜ್)",
}: TrendingSidebarProps) {
  const trendingList = articles.slice(0, 5);

  return (
    <aside
      id="trending"
      className="bg-brand-dark rounded-2xl border border-brand-border/80 p-5 shadow-xl scroll-mt-24"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-red/20 text-brand-red">
            <Flame className="w-4 h-4 fill-brand-red" />
          </div>
          <h3 className="text-base font-extrabold text-white font-kannada">{title}</h3>
        </div>
        <span className="text-[11px] text-brand-muted uppercase font-semibold">TOP 5</span>
      </div>

      <div className="space-y-4">
        {trendingList.map((item, index) => {
          const rank = index + 1;
          const rankColors = [
            "bg-brand-red text-white",
            "bg-orange-500 text-white",
            "bg-amber-500 text-black",
            "bg-brand-card text-gray-300 border border-brand-border",
            "bg-brand-card text-gray-300 border border-brand-border",
          ];
          const coverage = item.coverageCount ?? 1;

          return (
            <div
              key={item.id}
              className="group flex gap-3 items-start pb-3 border-b border-brand-border/40 last:border-none last:pb-0"
            >
              <span
                className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black font-sans shadow-md ${
                  rankColors[index] || rankColors[3]
                }`}
              >
                0{rank}
              </span>
              <div className="flex-1 min-w-0">
                <Link href={`/news/${item.slug}`}>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
                    {item.title}
                  </h4>
                </Link>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-brand-muted">
                  <span className="text-brand-red font-kannada font-medium">{item.categoryName}</span>
                  <span>•</span>
                  <span>{formatKannadaTimeAgo(item.publishedAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {coverage > 1
                      ? `${formatKannadaNumber(coverage)} ಮೂಲಗಳು`
                      : sourceLabel(item)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ArticleCard.tsx src/components/HeroTopStories.tsx src/components/TrendingSidebar.tsx
git commit -m "feat: honest card, hero, and coverage-based trending rail"
```

---

### Task 15: Homepage Live Desk and hero briefs

**Files:**
- Create: `src/components/LiveBriefs.tsx`
- Create: `src/components/OttMiniList.tsx`
- Create: `src/lib/ott.ts`
- Test: `tests/ott.test.ts`
- Modify: `src/components/OttSection.tsx`
- Modify: `src/components/BoxOfficeTable.tsx`
- Modify: `src/components/AdBanner.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `HeroTopStories` (Task 14), `ArticleCard`, `TrendingSidebar`, `BreakingTicker`, `OttMiniList`, `LiveBriefs`; `startOfIstDay` from `@/lib/time`; `DataService` getters from Plan A.
- Produces: `parseKannadaReleaseDate(value): Date | null`, `countdownLabel(releaseDate, now?): string | null`; homepage order `ticker → hero + briefs → latest + sidebar → sandalwood → reviews → box office → OTT → gallery → footer ad`.

- [ ] **Step 1: Create the live briefs rail**

Create `src/components/LiveBriefs.tsx`:

```tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types";
import { sourceLabel } from "@/lib/freshness";
import { formatKannadaRelative } from "@/lib/time";

interface LiveBriefsProps {
  articles: Article[];
}

export default function LiveBriefs({ articles }: LiveBriefsProps) {
  if (articles.length === 0) return null;

  return (
    <aside
      className="rounded-2xl border border-brand-border/80 bg-brand-dark p-4 flex flex-col gap-3"
      aria-label="ಲೈವ್ ಬ್ರೀಫ್ಸ್"
    >
      <div className="flex items-center justify-between border-b border-brand-border pb-2">
        <h2 className="text-sm font-extrabold text-white font-kannada">ಲೈವ್ ಬ್ರೀಫ್ಸ್</h2>
        <span className="text-[10px] text-brand-muted uppercase font-semibold">Live</span>
      </div>

      {articles.slice(0, 4).map((article) => (
        <Link
          key={article.id}
          href={`/news/${article.slug}`}
          className="group flex gap-3 items-start outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-lg p-1"
        >
          <div className="relative w-[72px] h-[72px] shrink-0 rounded-lg overflow-hidden bg-brand-card">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              unoptimized={Boolean(article.isScraped)}
              referrerPolicy="no-referrer"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              sizes="72px"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-200 group-hover:text-brand-red font-kannada leading-snug line-clamp-2 transition-colors">
              {article.title}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-brand-muted">
              <span className="text-brand-red font-kannada font-medium truncate max-w-[120px]">
                {sourceLabel(article)}
              </span>
              <span>•</span>
              <span>{formatKannadaRelative(article.publishedAt)}</span>
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
}
```

- [ ] **Step 2: Create the OTT sidebar list**

Create `src/components/OttMiniList.tsx`:

```tsx
import React from "react";
import Link from "next/link";
import { Tv, ChevronRight } from "lucide-react";
import type { OttRelease } from "@/types";

interface OttMiniListProps {
  releases: OttRelease[];
}

export default function OttMiniList({ releases }: OttMiniListProps) {
  if (releases.length === 0) return null;

  return (
    <aside className="bg-brand-dark rounded-2xl border border-brand-border/80 p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Tv className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-white font-kannada">OTT ಬಿಡುಗಡೆ</h3>
        </div>
        <Link
          href="/ott"
          className="text-[11px] text-sky-400 hover:text-white flex items-center gap-0.5 transition-colors"
        >
          ಎಲ್ಲಾ
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ul className="space-y-2.5">
        {releases.slice(0, 4).map((release) => (
          <li key={release.id} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="text-gray-200 font-kannada truncate">{release.movieTitle}</span>
            <span className="shrink-0 px-1.5 py-0.5 rounded bg-brand-card text-gray-300 font-sans">
              {release.platform}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

- [ ] **Step 3: Write the failing OTT countdown test**

Create `tests/ott.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { countdownLabel, parseKannadaReleaseDate } from "@/lib/ott";

const now = new Date("2026-10-31T08:00:00Z");

describe("parseKannadaReleaseDate", () => {
  it("parses a Kannada day-month-year string", () => {
    const parsed = parseKannadaReleaseDate("15 ನವೆಂಬರ್ 2026");
    expect(parsed).not.toBeNull();
    expect(countdownLabel("15 ನವೆಂಬರ್ 2026", now)).toBe("15 ದಿನಗಳಲ್ಲಿ");
  });

  it("rejects English and malformed strings", () => {
    expect(parseKannadaReleaseDate("15 Nov 2026")).toBeNull();
    expect(parseKannadaReleaseDate("ಬಿಡುಗಡೆ ದಿನಾಂಕ ಬೇಗ")).toBeNull();
  });
});

describe("countdownLabel", () => {
  it("labels today", () => {
    expect(countdownLabel("31 ಅಕ್ಟೋಬರ್ 2026", now)).toBe("ಇಂದು");
  });

  it("returns null once the release date has passed", () => {
    expect(countdownLabel("30 ಅಕ್ಟೋಬರ್ 2026", now)).toBeNull();
  });
});
```

- [ ] **Step 4: Run the test and confirm it fails**

Run: `npx vitest run tests/ott.test.ts`
Expected: FAIL because `@/lib/ott` does not exist.

- [ ] **Step 5: Implement the countdown helper**

Create `src/lib/ott.ts`:

```ts
import { startOfIstDay } from "@/lib/time";

const KANNADA_MONTHS = [
  "ಜನವರಿ",
  "ಫೆಬ್ರವರಿ",
  "ಮಾರ್ಚ್",
  "ಏಪ್ರಿಲ್",
  "ಮೇ",
  "ಜೂನ್",
  "ಜುಲೈ",
  "ಆಗಸ್ಟ್",
  "ಸೆಪ್ಟೆಂಬರ್",
  "ಅಕ್ಟೋಬರ್",
  "ನವೆಂಬರ್",
  "ಡಿಸೆಂಬರ್",
];

export function parseKannadaReleaseDate(value: string): Date | null {
  const match = value.trim().match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = KANNADA_MONTHS.indexOf(match[2]);
  const year = Number(match[3]);
  if (month < 0 || day < 1 || day > 31) return null;
  return startOfIstDay(new Date(Date.UTC(year, month, day)));
}

export function countdownLabel(releaseDate: string, now = new Date()): string | null {
  const release = parseKannadaReleaseDate(releaseDate);
  if (!release) return null;
  const days = Math.round(
    (release.getTime() - startOfIstDay(now).getTime()) / 86_400_000,
  );
  if (days < 0) return null;
  if (days === 0) return "ಇಂದು";
  return `${days} ದಿನಗಳಲ್ಲಿ`;
}
```

- [ ] **Step 6: Add the countdown chip to the OTT section**

In `src/components/OttSection.tsx`, add the import:

```tsx
import { countdownLabel } from "@/lib/ott";
```

Add this component after the `OttSectionProps` interface:

```tsx
function OttCountdown({ releaseDate }: { releaseDate: string }) {
  const label = countdownLabel(releaseDate);
  if (!label) return null;
  return (
    <span className="ml-1 px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px]">
      {label}
    </span>
  );
}
```

Then replace the release-date block inside the card:

```tsx
                <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-gray-300 font-kannada">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  <span>{item.releaseDate}</span>
                </div>
```

with:

```tsx
                <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] text-gray-300 font-kannada">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  <span>{item.releaseDate}</span>
                  <OttCountdown releaseDate={item.releaseDate} />
                </div>
```

- [ ] **Step 7: Add the source note to the box-office table**

In `src/components/BoxOfficeTable.tsx`, add the import:

```tsx
import { formatKannadaDate } from "@/lib/utils";
```

Then replace the subtitle:

```tsx
            <p className="text-xs text-brand-muted font-kannada">
              ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಸಾರ್ವಕಾಲಿಕ ಗಲ್ಲಾಪೆಟ್ಟಿಗೆ ದಾಖಲೆಗಳು
            </p>
```

with:

```tsx
            <p className="text-xs text-brand-muted font-kannada">
              ಕನ್ನಡ ಚಿತ್ರರಂಗದ ಸಾರ್ವಕಾಲಿಕ ಗಲ್ಲಾಪೆಟ್ಟಿಗೆ ದಾಖಲೆಗಳು · ಮೂಲ: ಸಾರ್ವಜನಿಕ ಬಾಕ್ಸ್ ಆಫೀಸ್ ವರದಿಗಳು
            </p>
            {entries.length > 0 && (
              <p className="text-[10px] text-brand-muted font-kannada mt-0.5">
                ನವೀಕರಣ:{" "}
                {formatKannadaDate(
                  entries.reduce(
                    (latest, entry) =>
                      Date.parse(entry.updatedAt) > Date.parse(latest)
                        ? entry.updatedAt
                        : latest,
                    entries[0].updatedAt,
                  ),
                )}
              </p>
            )}
```

- [ ] **Step 8: Hide unconfigured ad slots**

In `src/components/AdBanner.tsx`, add the guard at the top of the component so no page renders a fictional sponsorship slot:

```tsx
export default function AdBanner({ placement, ad, className = "" }: AdBannerProps) {
  if (!ad) return null;

  // If custom ad code exists
  if (ad.adCode) {
```

Also replace the `imageUrl` branch so a configured ad with an image renders a real linked banner instead of the placeholder copy. Replace the default return block's `<div className="flex flex-col items-center gap-1.5">…</div>` with:

```tsx
      {ad.imageUrl ? (
        <a href={ad.targetUrl ?? "#"} target="_blank" rel="noopener noreferrer" className="block">
          <Image
            src={ad.imageUrl}
            alt={ad.altText}
            width={728}
            height={90}
            unoptimized
            className="h-auto w-full max-w-full rounded-lg object-cover"
          />
        </a>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <h4 className="text-sm font-bold text-gray-200 font-kannada">{ad.title}</h4>
          <p className="text-xs text-brand-muted font-kannada max-w-md">{ad.altText}</p>
        </div>
      )}
```

Leave the homepage's existing `{sidebarAd && …}` and `{footerAd && …}` wrappers as written. Run `npm run typecheck`; expected PASS. The article and category pages keep calling `<AdBanner placement="…" />` without an ad and now render nothing.

- [ ] **Step 9: Rewrite the homepage**

Replace `src/app/page.tsx` with:

```tsx
import React from "react";
import Link from "next/link";
import { ChevronRight, Newspaper, Sparkles } from "lucide-react";
import { DataService } from "@/lib/dataService";
import BreakingTicker from "@/components/BreakingTicker";
import HeroTopStories from "@/components/HeroTopStories";
import LiveBriefs from "@/components/LiveBriefs";
import TrendingSidebar from "@/components/TrendingSidebar";
import OttMiniList from "@/components/OttMiniList";
import ArticleCard from "@/components/ArticleCard";
import ReviewsSection from "@/components/ReviewsSection";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import OttSection from "@/components/OttSection";
import VideoSection from "@/components/VideoSection";
import PhotoGallerySection from "@/components/PhotoGallerySection";
import AdBanner from "@/components/AdBanner";

export const revalidate = 60;

export default async function HomePage() {
  const [
    allArticles,
    breakingNews,
    topStories,
    trendingArticles,
    reviews,
    boxOffice,
    ottReleases,
    videos,
    galleries,
    sidebarAd,
    footerAd,
  ] = await Promise.all([
    DataService.getArticles(),
    DataService.getBreakingNews(),
    DataService.getTopStories(),
    DataService.getTrendingArticles(5),
    DataService.getReviews(),
    DataService.getBoxOffice(),
    DataService.getOttReleases(),
    DataService.getVideos(),
    DataService.getGalleries(),
    DataService.getAdByPlacement("sidebar_rectangle"),
    DataService.getAdByPlacement("footer_banner"),
  ]);

  const heroArticles =
    topStories.length > 0 ? topStories.slice(0, 1) : allArticles.slice(0, 1);
  const heroId = heroArticles[0]?.id;
  const briefArticles = allArticles.filter((article) => article.id !== heroId).slice(0, 4);
  const latestNews = allArticles.slice(0, 6);
  const sandalwoodNews = allArticles.filter((a) => a.category === "sandalwood").slice(0, 4);
  const tickerArticles =
    breakingNews.length > 0 ? breakingNews : latestNews.slice(0, 3);

  return (
    <div className="w-full">
      <BreakingTicker articles={tickerArticles} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-6">
          <div className="lg:col-span-8">
            <HeroTopStories articles={heroArticles} />
          </div>
          <div className="lg:col-span-4">
            <LiveBriefs articles={briefArticles} />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-red/20 text-brand-red">
                  <Newspaper className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
                  ಇತ್ತೀಚಿನ ತಾಜಾ ಸುದ್ದಿ (Latest News)
                </h2>
              </div>

              <Link
                href="/category/latest"
                className="text-xs sm:text-sm font-semibold text-brand-red hover:text-white flex items-center gap-1 font-kannada transition-colors"
              >
                <span>ಎಲ್ಲಾ ಸುದ್ದಿ</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {latestNews.map((article) => (
                <ArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/category/latest"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-card hover:bg-brand-red text-white text-sm font-bold font-kannada transition-colors border border-brand-border min-h-[44px]"
              >
                <span>ಮತ್ತಷ್ಟು ಸುದ್ದಿಗಳು ವೀಕ್ಷಿಸಿ</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <TrendingSidebar articles={trendingArticles} />
            <OttMiniList releases={ottReleases} />
            {sidebarAd && <AdBanner placement="sidebar_rectangle" ad={sidebarAd} />}
          </div>
        </section>

        {sandalwoodNews.length > 0 && (
          <section className="my-12">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-brand-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
                    ಸ್ಯಾಂಡಲ್ವುಡ್ ವಿಶೇಷ ಸಮಾಚಾರ (Sandalwood Special)
                  </h2>
                  <p className="text-xs text-brand-muted font-kannada">
                    ಕನ್ನಡದ ನೆಚ್ಚಿನ ಸ್ಟಾರ್‌ಗಳು, ಹೊಸ ಚಿತ್ರಗಳ ಅನೌನ್ಸ್‌ಮೆಂಟ್ & ಅಪ್ಡೇಟ್ಸ್
                  </p>
                </div>
              </div>

              <Link
                href="/category/sandalwood"
                className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-white flex items-center gap-1 font-kannada transition-colors"
              >
                <span>ಸ್ಯಾಂಡಲ್ವುಡ್ ಪೇಜ್</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible">
              {sandalwoodNews.map((article) => (
                <div
                  key={article.id}
                  className="min-w-[240px] sm:min-w-[280px] snap-start lg:min-w-0"
                >
                  <ArticleCard article={article} variant="grid" />
                </div>
              ))}
            </div>
          </section>
        )}

        <ReviewsSection reviews={reviews} />
        <BoxOfficeTable entries={boxOffice} />
        <OttSection releases={ottReleases} />
        <VideoSection videos={videos} />
        <PhotoGallerySection galleries={galleries} />

        {footerAd && <AdBanner placement="footer_banner" ad={footerAd} />}
      </div>
    </div>
  );
}
```

Ad placeholders render only when an admin-configured ad exists, so the page does not show fake sponsorship slots.

- [ ] **Step 10: Verify**

Run: `npx vitest run tests/ott.test.ts`
Expected: PASS (4 tests).

Run: `npm run typecheck`
Expected: PASS.

Run: `npm run dev` and open `http://localhost:3000`.
Expected: live desk bar under the header, ticker with source and time, hero lead + four briefs, six latest cards with source/freshness badges, coverage trending rail, OTT mini-list, sandalwood rail with snap scrolling on mobile, then reviews/box office (with source note and update date)/OTT (with countdown chips)/videos/gallery.

- [ ] **Step 11: Commit**

```bash
git add src/components/LiveBriefs.tsx src/components/OttMiniList.tsx src/lib/ott.ts tests/ott.test.ts src/components/OttSection.tsx src/components/BoxOfficeTable.tsx src/components/AdBanner.tsx src/app/page.tsx
git commit -m "feat: rebuild homepage as live newsroom"
```

---

### Task 16: Scraped article page

**Files:**
- Create: `src/components/SourceCard.tsx`
- Modify: `src/app/news/[slug]/page.tsx`

**Interfaces:**
- Consumes: `FreshnessBadge` (Task 11); `formatKannadaExact` from `@/lib/time`; `article.source`, `article.altSources`, `article.isScraped` from Plan A types.
- Produces: `<SourceCard article />`; scraped variant on the article page with no fabricated metrics and no scraped HTML.

- [ ] **Step 1: Create the source card**

Create `src/components/SourceCard.tsx`:

```tsx
import React from "react";
import { ExternalLink } from "lucide-react";
import type { Article } from "@/types";
import { formatKannadaExact } from "@/lib/time";

export default function SourceCard({ article }: { article: Article }) {
  if (!article.source) return null;

  return (
    <div className="rounded-xl border border-brand-border bg-brand-card p-4">
      <p className="text-[11px] text-brand-muted font-kannada">ಮೂಲ ವರದಿ</p>
      <p className="mt-1 text-sm font-bold text-white font-kannada">{article.source.name}</p>
      <p className="mt-1 text-[11px] text-gray-400 font-kannada">
        {article.publishedAtEstimated
          ? "ಮೂಲ ತಾಣದಲ್ಲಿ ಪ್ರಕಟಣೆ ಸಮಯ ಇಲ್ಲ · ಈಗ ತಿಳಿದುಬಂದಿದೆ"
          : `ಪ್ರಕಟ: ${formatKannadaExact(article.publishedAt)}`}
      </p>
      <a
        href={article.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2.5 text-xs font-bold font-kannada text-white hover:bg-brand-crimson transition-colors min-h-[44px]"
      >
        ಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Update the article page imports and hero image**

In `src/app/news/[slug]/page.tsx`, replace:

```tsx
import {
  Calendar,
  Clock,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bookmark,
  Share2,
} from "lucide-react";
```

with:

```tsx
import { ChevronLeft, ChevronRight, Clock, Eye } from "lucide-react";
```

Add these imports after the `DataService` import:

```tsx
import FreshnessBadge from "@/components/FreshnessBadge";
import SourceCard from "@/components/SourceCard";
```

Then replace the featured image:

```tsx
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
```

with:

```tsx
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    priority
                    unoptimized={Boolean(article.isScraped)}
                    referrerPolicy="no-referrer"
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
```

Scraped images come from a source CDN the Vercel optimizer cannot verify, so they skip optimization the same way cards do.

- [ ] **Step 3: Make the breadcrumb source-aware**

Replace:

```tsx
          <Link
            href={`/category/${article.category}`}
            className="hover:text-brand-red text-gray-300 font-medium transition-colors"
          >
            {article.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
```

with:

```tsx
          <Link
            href={`/category/${article.category}`}
            className="hover:text-brand-red text-gray-300 font-medium transition-colors"
          >
            {article.categoryName}
          </Link>
          {article.source && (
            <>
              <span>/</span>
              <span className="text-gray-400">{article.source.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-gray-400 truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
```

- [ ] **Step 4: Replace the category row and estimated timestamps**

Replace:

```tsx
              <div className="flex items-center justify-between gap-3 mb-4">
                <Link
                  href={`/category/${article.category}`}
                  className="px-3 py-1 rounded bg-brand-red text-white text-xs font-bold font-kannada tracking-wide"
                >
                  {article.categoryName}
                </Link>
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                  <Clock className="w-3.5 h-3.5 text-brand-red" />
                  <span>{article.readTimeMinutes} ನಿಮಿಷ ಓದು</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-sans">
                    <Eye className="w-3.5 h-3.5" />
                    {formatKannadaNumber(article.views)}
                  </span>
                </div>
              </div>
```

with:

```tsx
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/category/${article.category}`}
                    className="px-3 py-1 rounded bg-brand-red text-white text-xs font-bold font-kannada tracking-wide"
                  >
                    {article.categoryName}
                  </Link>
                  <FreshnessBadge article={article} />
                </div>
                {!article.isScraped && (
                  <div className="flex items-center gap-2 text-xs text-brand-muted">
                    <Clock className="w-3.5 h-3.5 text-brand-red" />
                    <span>{article.readTimeMinutes} ನಿಮಿಷ ಓದು</span>
                    {article.views > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-sans">
                          <Eye className="w-3.5 h-3.5" />
                          {formatKannadaNumber(article.views)}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
```

Then stop the author row from printing the fetch clock as a publication date. Replace:

```tsx
                  <span>📅 ಪ್ರಕಟ: {formatKannadaDate(article.publishedAt)}</span>
                  {article.updatedAt && (
```

with:

```tsx
                  <span>
                    📅 ಪ್ರಕಟ:{" "}
                    {article.publishedAtEstimated
                      ? "ಈಗ ತಿಳಿದುಬಂದಿದೆ"
                      : formatKannadaDate(article.publishedAt)}
                  </span>
                  {!article.isScraped && article.updatedAt && (
```

Scraped rows store the fetch time in `updated_at`, so showing it as an article update would invent an edit that never happened.

Finally, stop structured data from claiming the source is a person. Replace:

```tsx
    author: [
      {
        "@type": "Person",
        name: article.author.name,
      },
    ],
```

with:

```tsx
    author: [
      article.isScraped
        ? { "@type": "Organization", name: article.author.name, url: article.source?.url }
        : { "@type": "Person", name: article.author.name },
    ],
```

- [ ] **Step 5: Insert the source card and alternate coverage**

After the summary paragraph:

```tsx
              <p className="mt-4 text-base sm:text-lg text-gray-300 font-kannada leading-relaxed font-normal border-l-4 border-brand-red pl-4 italic">
                {article.summary}
              </p>
```

insert:

```tsx
              {article.source && (
                <div className="mt-5 space-y-3">
                  <SourceCard article={article} />
                  {article.altSources && article.altSources.length > 0 && (
                    <div className="rounded-xl border border-brand-border bg-brand-dark p-4">
                      <p className="text-[11px] text-brand-muted font-kannada">
                        ಇದನ್ನು ವರದಿ ಮಾಡಿದವರು
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {article.altSources.map((alt) => (
                          <a
                            key={alt.url}
                            href={alt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-red hover:underline"
                          >
                            {alt.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
```

- [ ] **Step 6: Guard the editorial content block**

Replace:

```tsx
              <div className="prose prose-invert max-w-none text-gray-200 font-kannada leading-relaxed space-y-4 text-sm sm:text-base">
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-extrabold'>$1</strong>")
                      .replace(/### (.*?)\n/g, "<h3 class='text-xl sm:text-2xl font-bold text-brand-red mt-6 mb-3 font-kannada'>$1</h3>")
                      .replace(/> (.*?)\n/g, "<blockquote class='border-l-4 border-brand-yellow pl-4 py-2 my-4 bg-brand-card/50 rounded-r text-brand-yellow font-medium italic'>$1</blockquote>"),
                  }}
                />
              </div>
```

with:

```tsx
              {article.content ? (
                <div className="prose prose-invert max-w-none text-gray-200 font-kannada leading-relaxed space-y-4 text-sm sm:text-base">
                  <div
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: article.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-extrabold'>$1</strong>")
                        .replace(/### (.*?)\n/g, "<h3 class='text-xl sm:text-2xl font-bold text-brand-red mt-6 mb-3 font-kannada'>$1</h3>")
                        .replace(/> (.*?)\n/g, "<blockquote class='border-l-4 border-brand-yellow pl-4 py-2 my-4 bg-brand-card/50 rounded-r text-brand-yellow font-medium italic'>$1</blockquote>"),
                    }}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-400 font-kannada border-l-4 border-brand-border pl-4">
                  ಪೂರ್ಣ ವರದಿ ಮೂಲ ತಾಣದಲ್ಲಿ ಲಭ್ಯವಿದೆ. ಮೇಲಿನ ಮೂಲ ಕಾರ್ಡ್‌ನಿಂದ ಓದಿ.
                </p>
              )}
```

Scraped rows always have `content === null`, so the guard is what prevents `undefined.replace(...)` and keeps scraped HTML out of `dangerouslySetInnerHTML`.

- [ ] **Step 7: Label demo comments**

Add the feed metadata to the page's data fetch:

```tsx
  const [allArticles, trendingArticles, feed] = await Promise.all([
    DataService.getArticles(),
    DataService.getTrendingArticles(5),
    DataService.getFeedMeta(),
  ]);
```

Then replace:

```tsx
              {/* Interactive Comment Section */}
              <CommentSection articleId={article.id} />
```

with:

```tsx
              {/* Interactive Comment Section */}
              {feed.demo && (
                <p className="text-[11px] text-brand-muted font-kannada">
                  ಈ ಸಂವಾದ ವಿಭಾಗದ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಡೆಮೊ ಡೇಟಾ.
                </p>
              )}
              <CommentSection articleId={article.id} />
```

- [ ] **Step 8: Verify**

Run: `npm run typecheck`
Expected: PASS.

Run: `npm run dev` and open a live scraped slug (or a seeded slug for the editorial path).
Expected: scraped page shows category + freshness, source card with external CTA, no views/read time, no body, alternate coverage when available; editorial seeded pages still show full content; demo mode labels seeded comments.

- [ ] **Step 9: Commit**

```bash
git add src/components/SourceCard.tsx "src/app/news/[slug]/page.tsx"
git commit -m "feat: add scraped article attribution layout"
```

---

### Task 17: Live category header and search

**Files:**
- Create: `src/lib/live/search.ts`
- Test: `tests/search-query.test.ts`
- Create: `src/components/live/LiveSearch.tsx`
- Modify: `src/app/category/[slug]/page.tsx`
- Modify: `src/app/search/page.tsx`

**Interfaces:**
- Consumes: `CATEGORIES` from `@/lib/categories`; `DataService.getFeedMeta()`; `formatKannadaRelative`; `/api/articles` from Plan A Task 10.
- Produces: `buildArticlesQuery({ q, category?, limit? }): string`; `<LiveSearch initialQuery? />`; category header with live count and last update.

- [ ] **Step 1: Write the failing search URL test**

Create `tests/search-query.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildArticlesQuery } from "@/lib/live/search";

function paramsOf(url: string): URLSearchParams {
  return new URLSearchParams(url.slice(url.indexOf("?") + 1));
}

describe("buildArticlesQuery", () => {
  it("trims and encodes a Kannada query", () => {
    const params = paramsOf(buildArticlesQuery({ q: "  ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ", limit: 30 }));
    expect(params.get("q")).toBe("ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1");
    expect(params.get("limit")).toBe("30");
  });

  it("omits an empty query", () => {
    const params = paramsOf(buildArticlesQuery({ q: "   " }));
    expect(params.has("q")).toBe(false);
    expect(params.get("limit")).toBe("20");
  });

  it("adds a category filter when provided", () => {
    const params = paramsOf(buildArticlesQuery({ q: "ಯಶ್", category: "sandalwood" }));
    expect(params.get("category")).toBe("sandalwood");
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run tests/search-query.test.ts`
Expected: FAIL because `@/lib/live/search` does not exist.

- [ ] **Step 3: Implement the search URL builder**

Create `src/lib/live/search.ts`:

```ts
interface SearchInput {
  q: string;
  category?: string;
  limit?: number;
}

export function buildArticlesQuery(input: SearchInput): string {
  const params = new URLSearchParams();
  const q = input.q.trim();
  if (q) params.set("q", q);
  if (input.category) params.set("category", input.category);
  params.set("limit", String(input.limit ?? 20));
  return `/api/articles?${params.toString()}`;
}
```

- [ ] **Step 4: Create the live search component**

Create `src/components/live/LiveSearch.tsx`:

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Search as SearchIcon } from "lucide-react";
import type { Article } from "@/types";
import { buildArticlesQuery } from "@/lib/live/search";
import ArticleCard from "@/components/ArticleCard";

interface LiveSearchProps {
  initialQuery?: string;
}

export default function LiveSearch({ initialQuery = "" }: LiveSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<Article[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [demo, setDemo] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const term = query.trim();
    abortRef.current?.abort();

    if (term.length < 2) {
      setArticles([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(buildArticlesQuery({ q: term, limit: 30 }), {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`search failed: ${response.status}`);
        const data = (await response.json()) as {
          articles: Article[];
          meta?: { demo?: boolean };
        };
        setArticles(data.articles ?? []);
        setDemo(Boolean(data.meta?.demo));
        setStatus("done");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setStatus("error");
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="max-w-2xl flex gap-2"
        role="search"
      >
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ಉದಾ: ಕಾಂತಾರ, ಯಶ್, ಕೆಜಿಎಫ್, ಮ್ಯಾಕ್ಸ್, OTT..."
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-red font-kannada"
            aria-label="ಸುದ್ದಿ ಹುಡುಕಿ"
          />
          <SearchIcon className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
        </div>
      </form>

      <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-brand-muted">
        <span className="text-gray-300 font-semibold font-kannada">ಟ್ರೆಂಡಿಂಗ್ ಸರ್ಚ್:</span>
        {["ಕಾಂತಾರ", "ಯಶ್", "ಟಾಕ್ಸಿಕ್", "ಸುದೀಪ್", "ರುಕ್ಮಿಣಿ ವಸಂತ್", "ಬಘೀರ", "ಕೆಜಿಎಫ್"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setQuery(tag)}
            className="px-2.5 py-1 rounded bg-brand-card hover:bg-brand-red text-gray-300 hover:text-white text-xs font-kannada border border-brand-border/60 transition-colors min-h-[44px]"
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="mt-6" aria-live="polite">
        {status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-brand-muted font-kannada">
            <Loader2 className="w-4 h-4 animate-spin" />
            ಹುಡುಕುತ್ತಿದೆ...
          </div>
        )}

        {status === "idle" && (
          <p className="text-sm text-brand-muted font-kannada">
            ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕನಿಷ್ಠ ಎರಡು ಅಕ್ಷರಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ.
          </p>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-brand-border bg-brand-dark p-6 text-center">
            <AlertCircle className="w-8 h-8 text-brand-yellow mx-auto" />
            <p className="mt-2 text-sm text-gray-300 font-kannada">
              ಹುಡುಕಾಟ ವಿಫಲವಾಗಿದೆ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.
            </p>
          </div>
        )}

        {status === "done" && (
          <>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
              <span className="text-sm font-bold text-gray-200 font-kannada">
                &ldquo;<span className="text-brand-red">{query.trim()}</span>&rdquo; ಫಲಿತಾಂಶಗಳು: (
                {articles.length})
              </span>
              {demo && (
                <span className="px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-yellow text-[10px] font-bold font-kannada">
                  ಡೆಮೊ ಡೇಟಾ
                </span>
              )}
            </div>

            {articles.length === 0 ? (
              <div className="bg-brand-dark p-12 rounded-2xl border border-brand-border text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-brand-yellow mx-auto" />
                <h3 className="text-base font-bold text-white font-kannada">
                  ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ!
                </h3>
                <p className="text-xs text-brand-muted font-kannada">
                  ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಮೂಲಕ ಹುಡುಕಲು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಮುಖಪುಟದ ತಾಜಾ ಸುದ್ದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-3 px-5 py-2.5 rounded-lg bg-brand-red text-white text-xs font-bold font-kannada min-h-[44px]"
                >
                  ಮುಖಪುಟಕ್ಕೆ ಹೋಗಿ
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Replace the search page**

Replace `src/app/search/page.tsx` with:

```tsx
import React from "react";
import type { Metadata } from "next";
import LiveSearch from "@/components/live/LiveSearch";

export const metadata: Metadata = {
  title: "ಸುದ್ದಿ ಹುಡುಕಾಟ (Search Cinema Articles)",
  description: "ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಲೇಖನಗಳು, ವಿಮರ್ಶೆಗಳು ಹಾಗೂ ಸಂದರ್ಶನಗಳನ್ನು ಹುಡುಕಿ",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="w-full">
      <div className="bg-brand-dark border-b border-brand-border py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-kannada">
            ಸುದ್ದಿ ಹುಡುಕಾಟ (Search Cinema Articles)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-brand-muted font-kannada">
            ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಲೇಖನಗಳು, ವಿಮರ್ಶೆಗಳು ಹಾಗೂ ಸಂದರ್ಶನಗಳನ್ನು ಹುಡುಕಿ
          </p>
        </div>
      </div>

      <LiveSearch initialQuery={searchParams.q ?? ""} />
    </div>
  );
}
```

- [ ] **Step 6: Add live counts to the category header**

In `src/app/category/[slug]/page.tsx`, replace the mock import:

```tsx
import { CATEGORIES } from "@/data/mockData";
```

with:

```tsx
import { CATEGORIES } from "@/lib/categories";
import { formatKannadaRelative } from "@/lib/time";
```

Add `feed` to the data fetch:

```tsx
  const [articles, trendingArticles, reviews, boxOffice, ottReleases, videos, galleries, feed] =
    await Promise.all([
      DataService.getArticles(params.slug as CategorySlug),
      DataService.getTrendingArticles(5),
      DataService.getReviews(),
      DataService.getBoxOffice(),
      DataService.getOttReleases(),
      DataService.getVideos(),
      DataService.getGalleries(),
      DataService.getFeedMeta(),
    ]);
```

Then replace the category header badge block:

```tsx
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase tracking-wider font-sans self-start md:self-auto">
              {currentCategory.englishName}
            </span>
```

with:

```tsx
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase tracking-wider font-sans">
                {currentCategory.englishName}
              </span>
              <span className="text-[11px] px-3 py-1.5 rounded-lg bg-brand-card text-gray-300 border border-brand-border font-kannada">
                ಒಟ್ಟು {articles.length} ಸುದ್ದಿ
              </span>
              <span className="text-[11px] px-3 py-1.5 rounded-lg bg-brand-card text-gray-300 border border-brand-border font-kannada">
                ಕೊನೆಯ ನವೀಕರಣ:{" "}
                {feed.lastIngestAt ? formatKannadaRelative(feed.lastIngestAt) : "—"}
              </span>
              <span className="text-[11px] px-3 py-1.5 rounded-lg bg-brand-red/15 text-brand-red border border-brand-red/30 font-kannada">
                ಹೊಸದು
              </span>
            </div>
```

- [ ] **Step 7: Verify**

Run: `npx vitest run tests/search-query.test.ts`
Expected: PASS (3 tests).

Run: `npm run typecheck`
Expected: PASS.

Run: `npm run dev`, open `/search?q=ಯಶ್`, then type to confirm the 300ms debounce and result count.

- [ ] **Step 8: Commit**

```bash
git add src/lib/live/search.ts tests/search-query.test.ts src/components/live/LiveSearch.tsx src/app/search/page.tsx "src/app/category/[slug]/page.tsx"
git commit -m "feat: add live search and category feed header"
```

---

### Task 18: Ingest health, image hosts, configuration, scheduling, verification

**Files:**
- Create: `src/app/admin/ingest/page.tsx`
- Create: `supabase/cron.sql`
- Modify: `next.config.mjs`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `DataService.getIngestRuns(10)` and `getFeedMeta()` (Plan A Task 9); `formatKannadaRelative`, `formatKannadaExact`; `IngestRunRow`, `FeedMeta`.
- Produces: read-only `/admin/ingest`; documented `pg_cron` scheduling; source CDN image hosts; full environment template.

- [ ] **Step 1: Create the ingest health page**

Create `src/app/admin/ingest/page.tsx`:

```tsx
import React from "react";
import Link from "next/link";
import { Activity, Database, ShieldCheck } from "lucide-react";
import { DataService } from "@/lib/dataService";
import { formatKannadaExact, formatKannadaRelative } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ಇಂಜೆಸ್ಟ್ ಸ್ಥಿತಿ | ಸಿನಿ ಕನ್ನಡ",
};

const STATUS_CLASS: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  partial: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  failed: "bg-brand-red/15 text-brand-red border-brand-red/30",
};

export default async function IngestHealthPage() {
  const [runs, feed] = await Promise.all([
    DataService.getIngestRuns(10),
    DataService.getFeedMeta(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-red/20 text-brand-red flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-kannada">
              ಇಂಜೆಸ್ಟ್ ಸ್ಥಿತಿ (Ingest Health)
            </h1>
            <p className="text-xs text-brand-muted font-kannada">
              ಕೊನೆಯ 10 ರನ್‌ಗಳು · ಓದಲು ಮಾತ್ರ
            </p>
          </div>
        </div>
        <Link
          href="/admin"
          className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs">
        <div className="rounded-xl border border-brand-border bg-brand-dark p-4">
          <p className="text-brand-muted font-kannada">ಸಕ್ರಿಯ ಮೂಲಗಳು</p>
          <p className="mt-1 text-2xl font-black text-white font-sans">{feed.activeSources}</p>
        </div>
        <div className="rounded-xl border border-brand-border bg-brand-dark p-4">
          <p className="text-brand-muted font-kannada">ಇಂದಿನ ಸುದ್ದಿ</p>
          <p className="mt-1 text-2xl font-black text-white font-sans">{feed.todayCount}</p>
        </div>
        <div className="rounded-xl border border-brand-border bg-brand-dark p-4">
          <p className="text-brand-muted font-kannada">ಕೊನೆಯ ಯಶಸ್ವಿ ಸಿಂಕ್</p>
          <p className="mt-1 text-sm font-bold text-white font-kannada">
            {feed.lastIngestAt ? formatKannadaRelative(feed.lastIngestAt) : "—"}
          </p>
          {feed.lastIngestAt && (
            <p className="mt-1 text-[10px] text-brand-muted font-sans">
              {formatKannadaExact(feed.lastIngestAt)}
            </p>
          )}
        </div>
      </div>

      {runs.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-brand-dark p-10 text-center">
          <Database className="w-8 h-8 text-brand-muted mx-auto" />
          <p className="mt-2 text-sm text-gray-300 font-kannada">
            ಇನ್ನೂ ಯಾವುದೇ ಇಂಜೆಸ್ಟ್ ರನ್ ದಾಖಲಾಗಿಲ್ಲ.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-card text-brand-muted uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">ಮೂಲ</th>
                <th className="px-4 py-3 font-semibold">ಸ್ಥಿತಿ</th>
                <th className="px-4 py-3 font-semibold text-right">ಕಂಡು</th>
                <th className="px-4 py-3 font-semibold text-right">ಸೇರಿಸಿದ</th>
                <th className="px-4 py-3 font-semibold text-right">ವಿಲೀನ</th>
                <th className="px-4 py-3 font-semibold text-right">ದೋಷ</th>
                <th className="px-4 py-3 font-semibold text-right">ಅವಧಿ</th>
                <th className="px-4 py-3 font-semibold">ಸಮಯ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {runs.map((run) => (
                <tr key={run.id} className="bg-brand-dark">
                  <td className="px-4 py-3 font-sans text-gray-200">{run.source_id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 border text-[10px] font-bold uppercase ${
                        STATUS_CLASS[run.status] ?? STATUS_CLASS.partial
                      }`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-gray-300">{run.discovered}</td>
                  <td className="px-4 py-3 text-right font-sans text-gray-300">{run.inserted}</td>
                  <td className="px-4 py-3 text-right font-sans text-gray-300">{run.merged}</td>
                  <td className="px-4 py-3 text-right font-sans text-gray-300">{run.errors}</td>
                  <td className="px-4 py-3 text-right font-sans text-gray-300">
                    {Math.round(run.duration_ms)}ms
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-kannada">
                    {formatKannadaRelative(run.started_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Allow the source CDN image hosts**

Replace `next.config.mjs` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.filmibeat.com" },
      { protocol: "https", hostname: "static.langimg.com" },
      { protocol: "https", hostname: "images.news18.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Document the environment**

Replace `.env.example` with:

```bash
# Supabase (Free tier)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Ingestion
CRON_SECRET=replace-with-a-long-random-value
INGEST_USER_AGENT=SiniKannadaBot/1.0 (+https://sinikannada.com/bot)
INGEST_MAX_PER_SOURCE=3
INGEST_REQUEST_DELAY_MS=1000
INGEST_STORE_IMAGES=false

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 4: Add the free scheduling SQL**

Create `supabase/cron.sql`:

```sql
-- Run in the Supabase SQL editor after applying
-- supabase/migrations/202610310001_live_feed.sql.
-- Replace <your-site> with the deployed origin (for example https://sinikannada.vercel.app).
-- The secret must match CRON_SECRET in the hosting environment.

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

select cron.schedule(
  'sini-ingest-cleanup',
  '0 3 * * *',
  $$
  delete from public.ingest_runs where started_at < now() - interval '14 days';
  $$
);
```

- [ ] **Step 5: Run the full verification suite**

Run: `npx vitest run`
Expected: PASS — all Plan A tests plus `freshness`, `live-version`, and `search-query`.

Run: `npm run typecheck`
Expected: PASS with no errors.

Run: `npm run build`
Expected: PASS. The build must not print `Dynamic server usage` errors from `/admin/ingest`; `force-dynamic` is set there.

- [ ] **Step 6: Manual end-to-end verification**

1. Apply `supabase_schema.sql`, then `supabase/migrations/202610310001_live_feed.sql`.
2. Run `supabase/cron.sql` after replacing `<your-site>` and creating the Vault secret.
3. Start the app with the env vars set: `npm run dev`.
4. Trigger ingestion:

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Authorization: Bearer $CRON_SECRET"
```

Expected: `200` with per-source counts; rows appear in `articles` and `ingest_runs`.

5. Open `/` and confirm: live desk bar, ticker with source + relative time, hero + four briefs, latest cards with source/freshness chips, coverage trending, OTT mini-list, sandalwood rail.
6. Open a scraped `/news/<slug>`: source card, canonical `ಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ` link, no views/read time, no scraped body, alternate coverage when merged.
7. Open `/search?q=ಯಶ್`: debounced results from `/api/articles` with count and demo badge only when applicable.
8. Open `/admin/ingest`: last runs with statuses and durations.
9. Two browser tabs: trigger ingest; with auto-refresh on the page updates after the 2-second debounce, with auto-refresh off the `ಹೊಸ ಸುದ್ದಿ` pill appears and refreshes on click.
10. Check 390px, 768px, and 1440px widths; confirm no horizontal overflow and 44px touch targets.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/ingest/page.tsx next.config.mjs .env.example supabase/cron.sql
git commit -m "feat: add ingest health page, image hosts, and free-tier scheduling"
```

---

## Definition of Done

- Homepage, category, article, and search pages render live Supabase data and degrade to visibly labeled demo data only when unconfigured or empty.
- Realtime INSERT/UPDATE events update the desk; polling still converges when the channel is unavailable.
- Scraped cards and article pages show source, freshness, and canonical link, with no fabricated metrics and no scraped HTML.
- Trending is ordered by real cross-source coverage.
- Ingest health, footer sources, and last-sync time are visible.
- `npx vitest run`, `npm run typecheck`, and `npm run build` pass.
- No paid service, API key, or storage bucket is required.

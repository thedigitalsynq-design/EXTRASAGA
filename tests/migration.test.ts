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
    expect(sql).toContain("for update");
    expect(sql).toContain("greatest(coverage_count, jsonb_array_length(coalesce(v_alt, '[]'::jsonb)) + 1)");
    expect(sql).toContain("supabase_realtime");
    expect(sql).toContain("replica identity full");
  });
});

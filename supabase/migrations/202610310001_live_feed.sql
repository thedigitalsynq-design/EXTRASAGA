-- ==========================================================
-- Sini Kannada live feed migration
-- Free-tier compatible: no extensions beyond Supabase defaults.
-- ==========================================================

-- 0. Seed categories first; articles.category_slug references this table.
insert into public.categories (name, english_name, slug, description) values
  ('Home', 'Home', 'mukhaputa', 'Cinema frontpage — the latest breaking stories and entertainment'),
  ('Latest News', 'Latest News', 'latest', 'Real-time news from the Indian film world'),
  ('Movie Reviews', 'Movie Reviews', 'reviews', 'Honest and strictly unbiased film verdicts'),
  ('Sandalwood', 'Sandalwood', 'sandalwood', 'Complete coverage of the Kannada film industry'),
  ('Bollywood', 'Bollywood', 'bollywood', 'Hot tea and updates from the Hindi film world'),
  ('Hollywood', 'Hollywood', 'hollywood', 'Global cinema news and international releases'),
  ('Actors', 'Actors', 'actors', 'Star actor news — on screen and off screen'),
  ('Actresses', 'Actresses', 'actresses', 'New projects, fashion and interviews from the leading ladies'),
  ('Interviews', 'Interviews', 'interviews', 'Exclusive sit-downs and conversations with the stars'),
  ('Gossip', 'Gossip', 'gossip', 'Hot tea from the wider cinema world'),
  ('Photo Gallery', 'Photo Gallery', 'gallery', 'Star photo drops and cinema event galleries'),
  ('Videos', 'Videos', 'videos', 'New trailers, teasers and song video drops'),
  ('OTT Updates', 'OTT Updates', 'ott', 'Verified streaming releases across platforms'),
  ('Box Office', 'Box Office', 'box-office', 'Receipts-backed collections and box office reports'),
  ('Upcoming Movies', 'Upcoming Movies', 'upcoming', 'Every verified release heading to theatres next')
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
  -- Row lock: serialize concurrent merges on the same primary article.
  select coalesce(alt_sources, '[]'::jsonb), published_at, published_at_estimated
    into v_alt, v_published_at, v_estimated
  from public.articles
  where id = p_primary_id
  for update;

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
      -- Keep the oldest four plus the entry just merged (the last one), so the
      -- incoming source is never discarded and an immediate repeat is a no-op.
      select coalesce(jsonb_agg(item order by ord), '[]'::jsonb)
        into v_alt
      from jsonb_array_elements(v_alt) with ordinality as t(item, ord)
      where ord <= 4 or ord = jsonb_array_length(v_alt);
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
      coverage_count = greatest(coverage_count, jsonb_array_length(coalesce(v_alt, '[]'::jsonb)) + 1),
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

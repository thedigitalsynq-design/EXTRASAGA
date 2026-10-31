-- ==========================================================
-- Sini Kannada (ಸಿನಿ ಕನ್ನಡ) - Supabase & PostgreSQL Database Schema
-- Production Ready Tables, RLS Policies, and Triggers
-- ==========================================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g. "ಸ್ಯಾಂಡಲ್ವುಡ್"
    english_name TEXT NOT NULL, -- e.g. "Sandalwood"
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Authors / Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'editor', -- 'admin', 'editor', 'author'
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Articles Table (News, Gossip, Sandalwood, Bollywood, etc.)
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL, -- Kannada headline
    title_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL, -- Kannada rich text / markdown
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON UPDATE CASCADE,
    tags TEXT[] DEFAULT '{}',
    featured_image TEXT NOT NULL,
    image_caption TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL DEFAULT 'ಸಿನಿ ಕನ್ನಡ ಬ್ಯೂರೋ',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_time_minutes INT DEFAULT 3,
    views INT DEFAULT 0,
    is_breaking BOOLEAN DEFAULT FALSE,
    is_top_story BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'scheduled')),
    related_article_ids UUID[] DEFAULT '{}'
);

-- 4. Movie Reviews & Details Table
CREATE TABLE IF NOT EXISTS public.movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_title TEXT NOT NULL, -- Kannada movie title
    movie_title_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5.0),
    release_date DATE,
    director TEXT NOT NULL,
    producers TEXT[] DEFAULT '{}',
    music_director TEXT NOT NULL,
    cinematography TEXT,
    cast_members JSONB DEFAULT '[]'::jsonb, -- [{name: "...", role: "...", image: "..."}]
    poster_image TEXT NOT NULL,
    banner_image TEXT,
    trailer_youtube_id TEXT,
    genres TEXT[] DEFAULT '{}',
    censor_rating TEXT DEFAULT 'U/A',
    runtime TEXT, -- e.g. '2 ಗಂಟೆ 40 ನಿಮಿಷ'
    verdict TEXT, -- e.g. 'ಬ್ಲಾಕ್‌ಬಸ್ಟರ್ ಸಿನಿಮಾ'
    summary TEXT,
    story_analysis TEXT,
    performance_analysis TEXT,
    direction_analysis TEXT,
    music_analysis TEXT,
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    box_office_summary TEXT,
    author TEXT DEFAULT 'ಸಿನಿಮಾ ಡೆಸ್ಕ್',
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Box Office Collections Table
CREATE TABLE IF NOT EXISTS public.box_office (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_title TEXT NOT NULL,
    movie_title_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    poster_image TEXT NOT NULL,
    release_year INT NOT NULL,
    day1_collection TEXT NOT NULL,
    weekend_collection TEXT NOT NULL,
    worldwide_collection TEXT NOT NULL,
    budget TEXT NOT NULL,
    verdict TEXT NOT NULL,
    verdict_badge_color TEXT DEFAULT 'green',
    rank INT DEFAULT 1,
    territory_breakdown JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. OTT Releases Table
CREATE TABLE IF NOT EXISTS public.ott_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_title TEXT NOT NULL,
    movie_title_en TEXT NOT NULL,
    platform TEXT NOT NULL,
    platform_badge_color TEXT NOT NULL,
    release_date TEXT NOT NULL,
    languages TEXT[] DEFAULT '{"ಕನ್ನಡ"}',
    genre TEXT NOT NULL,
    poster_image TEXT NOT NULL,
    watch_url TEXT,
    description TEXT NOT NULL,
    cast_members TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Videos Table (Trailers, Songs, Interviews)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ಟ್ರೇಲರ್', 'ಟೀಸರ್', 'ಹಾಡುಗಳು', 'ಸಂದರ್ಶನ')),
    youtube_id TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration TEXT,
    views TEXT DEFAULT '100K+',
    featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Photo Galleries Table
CREATE TABLE IF NOT EXISTS public.photo_galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT NOT NULL,
    celebrity_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ನಟರು', 'ನಟಿಯರು', 'ಸಿನಿಮಾ ಇವೆಂಟ್')),
    photo_count INT DEFAULT 0,
    photos JSONB DEFAULT '[]'::jsonb,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Advertisements Table
CREATE TABLE IF NOT EXISTS public.ad_spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placement TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    target_url TEXT,
    ad_code TEXT,
    alt_text TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_movies_slug ON public.movies(slug);
CREATE INDEX IF NOT EXISTS idx_comments_article ON public.comments(article_id);

-- Row Level Security (RLS) setup
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.box_office ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ott_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_spots ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public articles are viewable by everyone" ON public.articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public movies are viewable by everyone" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Public box_office viewable by everyone" ON public.box_office FOR SELECT USING (true);
CREATE POLICY "Public OTT releases viewable by everyone" ON public.ott_releases FOR SELECT USING (true);
CREATE POLICY "Public videos viewable by everyone" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public photo_galleries viewable by everyone" ON public.photo_galleries FOR SELECT USING (true);
CREATE POLICY "Approved comments are viewable by everyone" ON public.comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Public ad spots viewable by everyone" ON public.ad_spots FOR SELECT USING (is_active = true);

-- Allow public to submit comments
CREATE POLICY "Public can post comments" ON public.comments FOR INSERT WITH CHECK (true);

-- Storage bucket creation for media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sini-media', 'sini-media', true)
ON CONFLICT (id) DO NOTHING;

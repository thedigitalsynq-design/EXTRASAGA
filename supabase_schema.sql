-- ==========================================================
-- Cini Jaatre (ಸಿನಿ ಜಾತ್ರೆ) - Supabase & PostgreSQL Database Schema
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
    author_name TEXT NOT NULL DEFAULT 'ಸಿನಿ ಜಾತ್ರೆ ಬ್ಯೂರೋ',
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
VALUES ('cinijaatre-media', 'cinijaatre-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('sini-media', 'sini-media', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- 11. THEATRE DIRECTORY & SEAT BOOKING ARCHITECTURE (PCI-DSS & Transaction Safe)
-- ==========================================================

-- 11.1 Theatres Table
CREATE TABLE IF NOT EXISTS public.theatres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g. "ಊರ್ವಶಿ ಸಿನಿಮಾಸ್ (Urvashi Cinema)"
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    area TEXT NOT NULL, -- e.g. "Lalbagh Road"
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    phone TEXT,
    amenities TEXT[] DEFAULT '{"4K Dolby Atmos", "Recliner Seats", "Food Court", "Parking"}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.2 Screens Table
CREATE TABLE IF NOT EXISTS public.screens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theatre_id UUID NOT NULL REFERENCES public.theatres(id) ON DELETE CASCADE,
    screen_name TEXT NOT NULL, -- e.g. "ಸ್ಕ್ರೀನ್ 1 (Audi 1)"
    screen_type TEXT DEFAULT '4K Laser RGB',
    sound_system TEXT DEFAULT 'Dolby Atmos 64 Channel',
    total_seats INT NOT NULL DEFAULT 250,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.3 Showtimes Table
CREATE TABLE IF NOT EXISTS public.showtimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
    theatre_id UUID NOT NULL REFERENCES public.theatres(id) ON DELETE CASCADE,
    screen_id UUID NOT NULL REFERENCES public.screens(id) ON DELETE CASCADE,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    language TEXT NOT NULL DEFAULT 'ಕನ್ನಡ (Kannada)',
    format TEXT NOT NULL DEFAULT '2D', -- 2D, 3D, IMAX
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 200.00,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filling_fast', 'almost_full', 'sold_out', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.4 Seats Matrix Table
CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_id UUID NOT NULL REFERENCES public.screens(id) ON DELETE CASCADE,
    row_label TEXT NOT NULL, -- 'A', 'B', 'C'
    seat_number INT NOT NULL, -- 1, 2, 3...
    tier TEXT NOT NULL DEFAULT 'Classic' CHECK (tier IN ('Classic', 'Prime', 'Recliner')),
    price_multiplier NUMERIC(3, 2) DEFAULT 1.00,
    is_accessible BOOLEAN DEFAULT FALSE,
    UNIQUE (screen_id, row_label, seat_number)
);

-- 11.5 Concurrency Seat Locks Table (Double-Booking Prevention)
CREATE TABLE IF NOT EXISTS public.seat_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    showtime_id UUID NOT NULL REFERENCES public.showtimes(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (showtime_id, seat_id)
);

-- 11.6 Bookings Table (Idempotent & Auditable)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT UNIQUE NOT NULL, -- e.g. "CJB-20261031-8932"
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    showtime_id UUID NOT NULL REFERENCES public.showtimes(id) ON DELETE RESTRICT,
    seat_ids UUID[] NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    convenience_fee NUMERIC(10, 2) DEFAULT 25.00,
    gst_amount NUMERIC(10, 2) DEFAULT 4.50,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_gateway TEXT DEFAULT 'Razorpay' CHECK (payment_gateway IN ('Razorpay', 'Cashfree', 'PayU', 'UPI_Direct')),
    gateway_order_id TEXT UNIQUE,
    gateway_payment_id TEXT UNIQUE,
    idempotency_key TEXT UNIQUE NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'failed', 'refunded', 'cancelled')),
    qr_code_hash TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.7 Audit & Transaction Logs Table
CREATE TABLE IF NOT EXISTS public.booking_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'LOCK_ATTEMPT', 'PAYMENT_INITIATED', 'WEBHOOK_RECEIVED', 'TICKET_ISSUED', 'REFUND_PROCESSED'
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.8 Atomic Double-Booking Lock Function (Row-level Concurrency Lock)
CREATE OR REPLACE FUNCTION public.acquire_seat_locks(
    p_showtime_id UUID,
    p_seat_ids UUID[],
    p_session_id TEXT,
    p_lock_seconds INT DEFAULT 480 -- 8 minutes lock window
)
RETURNS TABLE (success BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conflicting_locks INT;
    v_confirmed_bookings INT;
    v_seat_id UUID;
    v_now TIMESTAMPTZ := NOW();
    v_expires TIMESTAMPTZ := NOW() + (p_lock_seconds || ' seconds')::INTERVAL;
BEGIN
    -- Purge expired locks first
    DELETE FROM public.seat_locks
    WHERE showtime_id = p_showtime_id AND expires_at <= v_now;

    -- Check if any of the requested seats are already confirmed
    SELECT COUNT(*) INTO v_confirmed_bookings
    FROM public.bookings
    WHERE showtime_id = p_showtime_id
      AND booking_status = 'confirmed'
      AND seat_ids && p_seat_ids;

    IF v_confirmed_bookings > 0 THEN
        RETURN QUERY SELECT FALSE, 'ಒಂದು ಅಥವಾ ಹೆಚ್ಚಿನ ಸೀಟುಗಳು ಈಗಾಗಲೇ ಬುಕ್ ಆಗಿವೆ (One or more seats already booked)';
        RETURN;
    END IF;

    -- Check if active lock exists for another session
    SELECT COUNT(*) INTO v_conflicting_locks
    FROM public.seat_locks
    WHERE showtime_id = p_showtime_id
      AND seat_id = ANY(p_seat_ids)
      AND session_id != p_session_id
      AND expires_at > v_now;

    IF v_conflicting_locks > 0 THEN
        RETURN QUERY SELECT FALSE, 'ಸೀಟುಗಳನ್ನು ಬೇರೆ ಗ್ರಾಹಕರು ಲಾಕ್ ಮಾಡಿದ್ದಾರೆ (Seats currently locked by another customer)';
        RETURN;
    END IF;

    -- Insert or refresh locks for this session
    FOREACH v_seat_id IN ARRAY p_seat_ids
    LOOP
        INSERT INTO public.seat_locks (showtime_id, seat_id, session_id, expires_at)
        VALUES (p_showtime_id, v_seat_id, p_session_id, v_expires)
        ON CONFLICT (showtime_id, seat_id)
        DO UPDATE SET expires_at = v_expires, session_id = p_session_id;
    END LOOP;

    RETURN QUERY SELECT TRUE, 'ಸೀಟುಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಲಾಕ್ ಮಾಡಲಾಗಿದೆ (Seats locked successfully for 8 minutes)';
END;
$$;

-- RLS for Booking Tables
ALTER TABLE public.theatres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public theatres viewable by everyone" ON public.theatres FOR SELECT USING (is_active = true);
CREATE POLICY "Public screens viewable by everyone" ON public.screens FOR SELECT USING (true);
CREATE POLICY "Public showtimes viewable by everyone" ON public.showtimes FOR SELECT USING (true);
CREATE POLICY "Public seats viewable by everyone" ON public.seats FOR SELECT USING (true);
CREATE POLICY "Public seat locks viewable by session" ON public.seat_locks FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);



-- ==========================================================
-- CINEMA RELEASES & AUTOMATION ENGINE SCHEMA
-- Tables: movies, movie_cast, genres, languages, release_dates,
-- article_revisions, article_sources, media_assets, admin_users, automation_logs
-- ==========================================================

-- 1. Languages Table
CREATE TABLE IF NOT EXISTS public.languages (
    code TEXT PRIMARY KEY, -- 'kn', 'te', 'ta', 'ml', 'hi', 'en'
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.languages (code, name, native_name, industry) VALUES
('kn', 'Kannada', 'ಕನ್ನಡ', 'sandalwood'),
('te', 'Telugu', 'తెలుగు', 'tollywood'),
('ta', 'Tamil', 'தமிழ்', 'kollywood'),
('ml', 'Malayalam', 'മലയാളം', 'mollywood'),
('hi', 'Hindi', 'हिन्दी', 'bollywood'),
('en', 'English', 'English', 'hollywood')
ON CONFLICT (code) DO NOTHING;

-- 2. Genres Table
CREATE TABLE IF NOT EXISTS public.genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL
);

-- 3. Dedicated Cinema Releases Table (movies)
CREATE TABLE IF NOT EXISTS public.cinema_movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    synopsis TEXT NOT NULL,
    introduction TEXT,
    theatrical_release_date DATE NOT NULL,
    release_date_confidence TEXT NOT NULL DEFAULT 'confirmed' CHECK (release_date_confidence IN ('confirmed', 'tentative')),
    release_status TEXT NOT NULL DEFAULT 'upcoming' CHECK (release_status IN ('upcoming', 'in_theatres', 'archived')),
    language_code TEXT NOT NULL REFERENCES public.languages(code),
    industry TEXT NOT NULL,
    genres TEXT[] DEFAULT '{}',
    director TEXT NOT NULL,
    producers TEXT[] DEFAULT '{}',
    production_company TEXT,
    distribution_company TEXT,
    poster_image TEXT NOT NULL,
    banner_image TEXT,
    trailer_youtube_id TEXT,
    trailer_url TEXT,
    censor_rating TEXT DEFAULT 'U/A',
    runtime_minutes INT DEFAULT 150,
    runtime_formatted TEXT,
    article_slug TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Movie Cast Table
CREATE TABLE IF NOT EXISTS public.movie_cast (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL REFERENCES public.cinema_movies(id) ON DELETE CASCADE,
    actor_name TEXT NOT NULL,
    character_name TEXT,
    role TEXT NOT NULL DEFAULT 'Actor',
    image_url TEXT,
    order_index INT DEFAULT 0
);

-- 5. Release Dates Table (Territory / Format-specific dates)
CREATE TABLE IF NOT EXISTS public.release_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL REFERENCES public.cinema_movies(id) ON DELETE CASCADE,
    territory TEXT NOT NULL DEFAULT 'India',
    format TEXT NOT NULL DEFAULT '2D' CHECK (format IN ('2D', '3D', 'IMAX', '4DX', 'Dolby Cinema')),
    release_date DATE NOT NULL,
    confidence TEXT NOT NULL DEFAULT 'confirmed' CHECK (confidence IN ('confirmed', 'tentative')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Article Revisions Table (Revision History)
CREATE TABLE IF NOT EXISTS public.article_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    revised_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Article Sources Table (Fact Checking & Origin Verification)
CREATE TABLE IF NOT EXISTS public.article_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ
);

-- 8. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID REFERENCES public.cinema_movies(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('poster', 'backdrop', 'trailer', 'still', 'press_kit')),
    url TEXT NOT NULL,
    caption TEXT,
    order_index INT DEFAULT 0
);

-- 9. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('superadmin', 'admin', 'editor', 'reporter')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Automation Logs Table (Daily 15-Minute & Date Rollover Telemetry)
CREATE TABLE IF NOT EXISTS public.automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    action TEXT NOT NULL,
    details TEXT,
    movies_processed INT DEFAULT 0,
    upcoming_count INT DEFAULT 0,
    in_theatres_count INT DEFAULT 0,
    archived_count INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'warning', 'error'))
);

-- Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_cinema_movies_release_date ON public.cinema_movies(theatrical_release_date);
CREATE INDEX IF NOT EXISTS idx_cinema_movies_status ON public.cinema_movies(release_status);
CREATE INDEX IF NOT EXISTS idx_cinema_movies_language ON public.cinema_movies(language_code);
CREATE INDEX IF NOT EXISTS idx_cinema_movies_slug ON public.cinema_movies(slug);
CREATE INDEX IF NOT EXISTS idx_automation_logs_timestamp ON public.automation_logs(timestamp DESC);

-- Enable RLS
ALTER TABLE public.cinema_movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public cinema movies viewable by everyone" ON public.cinema_movies FOR SELECT USING (true);
CREATE POLICY "Public movie cast viewable by everyone" ON public.movie_cast FOR SELECT USING (true);
CREATE POLICY "Public release dates viewable by everyone" ON public.release_dates FOR SELECT USING (true);
CREATE POLICY "Public media assets viewable by everyone" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Public article sources viewable by everyone" ON public.article_sources FOR SELECT USING (true);

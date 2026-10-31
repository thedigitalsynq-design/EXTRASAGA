# ಸಿನಿ ಕನ್ನಡ (Sini Kannada) - Kannada Cinema Entertainment Portal

> ಕರ್ನಾಟಕದ ನಂ.1 ಡಿಜಿಟಲ್ ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಪೋರ್ಟಲ್.

An original, modern, responsive, high-performance Kannada cinema news and entertainment web platform inspired by top cinema portals like Cineulagam, featuring authentic Sandalwood industry coverage, real-time breaking tickers, star-rating movie reviews, box office leaderboards, OTT release hubs, photo galleries, YouTube trailers, an interactive comment system, and an Editorial Admin Dashboard.

---

## ✨ Features & Architecture

### 1. 🔤 Natural Kannada Language & Typography
- Complete Kannada (ಕನ್ನಡ) interface across all navigation, headlines, buttons, categories, and article content.
- Typography powered by **Noto Sans Kannada** and **Tiro Kannada** with Unicode rendering on mobile and desktop.
- Zero "Lorem Ipsum" filler text — populated with real Sandalwood movies, stars, and news.

### 2. 🎨 Premium Cinema-News Branding
- High-contrast Red (`#E50914`), Black (`#0F0F11`), and White color palette.
- Modern glassmorphism overlays and custom cinematic dark styling.

### 3. 🧭 Sticky 15-Category Navigation
1. **ಮುಖಪುಟ** (Home)
2. **ಇತ್ತೀಚಿನ ಸುದ್ದಿ** (Latest News)
3. **ಸಿನಿಮಾ ವಿಮರ್ಶೆ** (Movie Reviews)
4. **ಸ್ಯಾಂಡಲ್ವುಡ್** (Sandalwood)
5. **ಬಾಲಿವುಡ್** (Bollywood)
6. **ಹಾಲಿವುಡ್** (Hollywood)
7. **ನಟರು** (Actors)
8. **ನಟಿಯರು** (Actresses)
9. **ಸಂದರ್ಶನ** (Interviews)
10. **ಗಾಸಿಪ್** (Gossip)
11. **ಫೋಟೋ ಗ್ಯಾಲರಿ** (Photo Gallery)
12. **ವಿಡಿಯೋಗಳು** (Videos)
13. **OTT ಅಪ್ಡೇಟ್** (OTT Updates)
14. **ಬಾಕ್ಸ್ ಆಫೀಸ್** (Box Office)
15. **ಮುಂಬರುವ ಸಿನಿಮಾಗಳು** (Upcoming Movies)

### 4. 📰 Homepage Layout & Modules
- **Breaking News Ticker**: Real-time Kannada scrolling headline ticker with play/pause and pulsing live badge.
- **Top Stories Hero Grid**: 1 dominant lead story with cinematic vignette + 2 stacked secondary stories.
- **Latest News Grid**: Responsive article cards with category tags, views, read times, and load more pagination.
- **Trending News (Top 5)**: Ranked 01–05 most-read stories with view count statistics.
- **Sandalwood Special**: High-impact industry updates on upcoming blockbusters (Kantara Chapter 1, Yash's Toxic, Kiccha Sudeep's Max, Uttarakaanda, Bagheera).
- **Movie Reviews**: Star rating scores (e.g., 4.8 ★ / 5), verdict badges, pros and cons, story/acting/direction breakdowns.
- **Box Office Hub**: All-time Kannada box office grossers (KGF 2, Kantara, KGF 1, Kaatera, 777 Charlie) with Day 1, weekend, and worldwide metrics.
- **OTT Hub**: Platform-branded cards (Netflix, Prime Video, ZEE5) with streaming countdowns.
- **Videos & Trailers**: Embedded YouTube modal player for trailers, teasers, and songs.
- **Celebrity Gallery**: Lightbox image viewer for Sandalwood stars and movie events.
- **Advertising Spaces**: Header Leaderboard (728x90), Sidebar Rectangle (300x250), In-Article banner, and Footer banner slots.

### 5. 📄 Dedicated Pages
- `/` - Full Homepage
- `/news/[slug]` - Individual article page with author info, rich Kannada content, social sharing (WhatsApp, X, Facebook, Telegram, Copy Link), previous/next navigation, and interactive comments.
- `/reviews/[slug]` - Movie review page with star rating, cast & crew, verdict, trailer embed, pros/cons, and analysis.
- `/category/[slug]` - Category listing for any of the 15 categories.
- `/box-office` - Dedicated box office analysis and territory breakdown.
- `/ott` - OTT releases calendar.
- `/search` - Bilingual search (Kannada & English) with trending query tags.
- `/admin` - Secure Admin Portal for managing articles, reviews, ads, comments, and SEO settings.

### 6. 🛡️ Secure Admin Panel
- URL: `/admin`
- Demo Credentials:
  - **Email**: `admin@sinikannada.com`
  - **Password**: `admin123`
- Capabilities:
  - Create, edit, and delete Kannada news articles with rich formatting.
  - Set breaking news, top stories, or trending flags.
  - Review moderation & comments control.
  - Ad placement management.
  - Live editorial analytics.

### 7. 🗄️ Backend & Supabase Support
- Works immediately out-of-the-box with persistent local storage.
- Full production Supabase DDL provided in `supabase_schema.sql` (Tables, RLS policies, indexes, and storage bucket for `sini-media`).

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

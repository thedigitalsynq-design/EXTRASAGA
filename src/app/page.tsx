import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DataService } from "@/lib/dataService";
import { HypoMeterService } from "@/lib/hypoMeterService";
import { YEARLY_LEADERBOARD_RECORDS } from "@/lib/boxOfficeEngine/yearlyLeaderboardData";
import VerdictBadge from "@/components/VerdictBadge";

export const revalidate = 60;

export default async function HomePage() {
  const [articles, movies, boxOffice] = await Promise.all([
    DataService.getArticles("en"),
    DataService.getMovies(),
    DataService.getBoxOffice(),
  ]);

  const hypoFilms = HypoMeterService.getFilms();
  const top2026 = YEARLY_LEADERBOARD_RECORDS[2026] || [];
  const leadFeature = hypoFilms[0] || {
    title: "Maatrubhumi",
    slug: "maatrubhumi",
    releaseDateFormatted: "Fri, 4 Dec 2026",
    language: "Hindi",
    director: "Aditya Dhar",
    daysToRelease: 25,
    interestedCountFormatted: "1,21,000",
    posterImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    backdropImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
  };

  const leadArticle = articles[0] || {
    id: "art_1",
    title: "Ramayana Part One Surges on Monday, Heads for a Rs. 100 Crore Day",
    slug: "ramayana-box-office-surge",
    summary: "The Ranbir Kapoor and Yash starrer is delivering the post-Diwali jump the trade expected, with North India setting the pace.",
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
    category: "box-office",
  };

  return (
    <main className="cn-home" id="cn-home" style={{ "--acc-d": "hsl(23 64% 62%)", "--acc-l": "hsl(23 55% 38%)" } as React.CSSProperties}>
      {/* ================= 1. Mosaic Hero ================= */}
      <section className="cn-hero" aria-label="Tonight on Films Discourse">
        {/* Feature slide */}
        <div className="cn-feature" id="cn-feature">
          <div className="cn-slides">
            <article
              className="cn-slide on"
              style={{
                "--acc-d": "hsl(23 64% 62%)",
                "--acc-l": "hsl(23 55% 38%)",
                "--tile-img": `url('${leadFeature.backdropImage}')`,
              } as React.CSSProperties}
            >
              <div className="cn-atmos" aria-hidden="true" />
              <div className="cn-vid cn-stills" aria-hidden="true">
                <Image
                  src={leadFeature.backdropImage}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="cn-scrim" aria-hidden="true" />

              <Link className="cn-standee" href={`/movies/${leadFeature.slug}`} tabIndex={-1} aria-hidden="true">
                <Image
                  src={leadFeature.posterImage}
                  alt=""
                  width={400}
                  height={600}
                  className="object-cover"
                />
              </Link>

              <div className="cn-copy">
                <h2 className="cn-title">
                  <Link href={`/movies/${leadFeature.slug}`}>{leadFeature.title}</Link>
                </h2>
                <p className="cn-credits">
                  <span>{leadFeature.releaseDateFormatted}</span>
                  <span>{leadFeature.language}</span>
                  <span>Directed by {leadFeature.director}</span>
                </p>
                <p className="cn-marquee">
                  <span className="cn-m">
                    <b className="num">{leadFeature.daysToRelease}</b> days to release
                  </span>
                  <span className="cn-m">
                    <b className="num">{leadFeature.interestedCountFormatted}</b> interested
                  </span>
                </p>
                <div className="cn-acts">
                  <Link className="cn-btn" href={`/movies/${leadFeature.slug}`}>
                    Film page
                  </Link>
                  <Link className="cn-link" href="/hypometer">
                    The most hyped films
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
              <p className="cn-credit">
                Stills: {leadFeature.title} official trailer<span> · All rights belong to the film&apos;s makers.</span>
              </p>
            </article>
          </div>
        </div>

        {/* Wide card: Latest featured story */}
        <Link className="cn-tile cn-wide cn-awide" href={`/news/${leadArticle.slug}`}>
          <span className="cn-atmos" aria-hidden="true" />
          <span className="cn-tile-poster">
            <Image
              src={leadArticle.featuredImage}
              alt=""
              width={1280}
              height={720}
              className="object-cover"
            />
          </span>
          <span className="cn-scrim" aria-hidden="true" />
          <span className="cn-tile-body">
            <span className="cn-tile-meta">Featured Dispatch · 9 Nov</span>
            <b className="cn-tile-title">{leadArticle.title}</b>
            <span className="cn-tile-ex">{leadArticle.summary}</span>
          </span>
        </Link>

        {/* Square card 1: In cinemas today */}
        <Link className="cn-tile cn-sq cn-films" href="/box-office">
          <span className="cn-atmos" aria-hidden="true" />
          <span className="cn-tile-poster">
            <Image
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop"
              alt=""
              width={400}
              height={600}
              className="object-cover"
            />
          </span>
          <span className="cn-tile-body">
            <span className="cn-tile-meta">In cinemas · 9 Nov</span>
            <b className="cn-tile-title">Ramayana: Part 1</b>
            <span className="cn-fig">
              <span className="cn-fig-main">
                <b className="num">81.38</b>
                <small>₹ Cr · day 5</small>
              </span>
              <span className="cn-fig-sub">
                <b className="num">310.97</b>
                <small>₹ Cr total</small>
              </span>
            </span>
          </span>
        </Link>

        {/* Square card 2: Next release */}
        <Link className="cn-tile cn-sq cn-next" href="/hypometer">
          <span className="cn-atmos" aria-hidden="true" />
          <span className="cn-tile-poster">
            <Image
              src="https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop"
              alt=""
              width={400}
              height={600}
              className="object-cover"
            />
          </span>
          <span className="cn-tile-body">
            <span className="cn-tile-meta">Also releasing · Fri, 4 Dec</span>
            <b className="cn-tile-title">Eetha</b>
            <span className="cn-fig">
              <span className="cn-fig-main">
                <b className="num">25</b>
                <small>days</small>
              </span>
              <span className="cn-fig-sub">
                <b className="num">31,400</b>
                <small>interested</small>
              </span>
            </span>
          </span>
        </Link>
      </section>

      {/* ================= 2. Live Collection Scoreboard ================= */}
      <section className="cn-livebox" id="live" aria-labelledby="cn-live-h">
        <div className="cn-live-card">
          <div className="cn-live-top">
            <h2 id="cn-live-h">
              <Link href="/box-office">
                <span className="cn-live-dot" aria-hidden="true" />
                Live collection
              </Link>
            </h2>
            <p>Today · updated in real time</p>
            <Link className="cn-live-all" href="/box-office">
              See live collection
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="cn-slider">
            <ol className="cn-track cn-ftrack">
              <li>
                <Link className="cn-ft" href="/box-office">
                  <span className="cn-ft-img">
                    <div className="poster">
                      <Image
                        src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop"
                        alt="Ramayana poster"
                        width={200}
                        height={300}
                        className="object-cover"
                      />
                    </div>
                    <span className="cn-ft-rk num">1</span>
                  </span>
                  <b className="cn-ft-t">Ramayana: Part 1</b>
                  <span className="cn-ft-day">Day 5</span>
                  <span className="cn-ft-tot">
                    <b className="num">81.38</b> ₹ Cr today · <b className="num">310.97</b> total
                  </span>
                  <span className="cn-ft-tags">
                    <VerdictBadge verdict="running" size="sm" />
                    <span className="tag">Hindi</span>
                  </span>
                </Link>
              </li>

              <li>
                <Link className="cn-ft" href="/box-office">
                  <span className="cn-ft-img">
                    <div className="poster">
                      <Image
                        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"
                        alt="Mirzapur poster"
                        width={200}
                        height={300}
                        className="object-cover"
                      />
                    </div>
                    <span className="cn-ft-rk num">2</span>
                  </span>
                  <b className="cn-ft-t">Mirzapur – The Movie</b>
                  <span className="cn-ft-day">Day 67</span>
                  <span className="cn-ft-tot">
                    <b className="num">215.00</b> ₹ Cr total
                  </span>
                  <span className="cn-ft-tags">
                    <VerdictBadge verdict="hit" size="sm" />
                    <span className="tag">Hindi</span>
                  </span>
                </Link>
              </li>

              <li>
                <Link className="cn-ft" href="/box-office">
                  <span className="cn-ft-img">
                    <div className="poster">
                      <Image
                        src="https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop"
                        alt="Border 2 poster"
                        width={200}
                        height={300}
                        className="object-cover"
                      />
                    </div>
                    <span className="cn-ft-rk num">3</span>
                  </span>
                  <b className="cn-ft-t">Border 2</b>
                  <span className="cn-ft-day">Day 90</span>
                  <span className="cn-ft-tot">
                    <b className="num">341.70</b> ₹ Cr total
                  </span>
                  <span className="cn-ft-tags">
                    <VerdictBadge verdict="superhit" size="sm" />
                    <span className="tag">Hindi</span>
                  </span>
                </Link>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ================= 3. In Cinemas Today Strip ================= */}
      <section id="box-office" className="cn-strip" aria-labelledby="cn-today-h">
        <div className="cn-strip-head">
          <h2 id="cn-today-h">In cinemas today</h2>
          <span className="cn-live">
            <span className="live-dot" aria-hidden="true" />
            Live collections
          </span>
          <Link className="cn-more" href="/box-office">
            See all box office
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="cn-slider">
          <ol className="cn-track cn-ftiles">
            {boxOffice.slice(0, 6).map((item, idx) => (
              <li key={item.id}>
                <Link className="cn-ft" href={`/movies/${item.slug}`}>
                  <span className="cn-ft-img">
                    <div className="poster">
                      <Image
                        src={item.posterImage}
                        alt={item.movieTitle}
                        width={200}
                        height={300}
                        className="object-cover"
                      />
                    </div>
                    <span className="cn-ft-rk num">{idx + 1}</span>
                  </span>
                  <b className="cn-ft-t">{item.movieTitle}</b>
                  <span className="cn-ft-day">Day 5</span>
                  <span className="cn-ft-tot">
                    <b className="num">{item.worldwideCollection || item.day1Collection}</b>
                  </span>
                  <span className="cn-ft-tags">
                    <VerdictBadge verdict={item.verdict} size="sm" />
                    <span className="tag">{(item.language || "all").toUpperCase()}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="wrap">
        {/* ================= 4. The Desk & Latest Stories ================= */}
        <section className="cn-sec cn-desk" aria-labelledby="cn-desk-h">
          <div className="cn-desk-about">
            <h2 id="cn-desk-h">Films Discourse</h2>
            <p>
              Films Discourse follows Indian cinema the way fans and the trade do: by the numbers and by the story. We track box office collections day by day, advance booking before release and audience hype for upcoming films, and we write news, analysis and reviews of Hindi, South Indian and Hollywood films, web series and reality shows.
            </p>
            <p>
              Every figure says what it covers and when it was last updated, and our articles are written by our own team.
            </p>
            <p className="cn-desk-links">
              <Link href="/box-office">Box office 2026</Link>
              <Link href="/box-office">Advance booking</Link>
              <Link href="/category/latest">All articles</Link>
              <Link href="/archive">About us</Link>
            </p>
          </div>

          <div className="cn-desk-list">
            <h3>Latest stories</h3>
            {articles.slice(0, 4).map((art) => (
              <article key={art.id}>
                <small>News · 9 Nov 2026</small>
                <h4>
                  <Link href={`/news/${art.slug}`}>{art.title}</Link>
                </h4>
                <p>{art.summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ================= 5. Top Grossers of 2026 ================= */}
        <section className="cn-sec" id="year-top">
          <div className="cn-head">
            <h2>Top grossers of 2026</h2>
            <span className="cn-meta">India nett, ₹ crore</span>
            <Link className="cn-more" href="/box-office">
              Full list
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="cn-slider">
            <ol className="cn-track cn-ftiles cn-ytiles">
              {top2026.slice(0, 6).map((item) => (
                <li key={item.slug}>
                  <Link className="cn-ft" href={`/movies/${item.slug}`}>
                    <span className="cn-ft-img">
                      <div className="poster">
                        <Image
                          src={item.posterImage}
                          alt={item.movieTitleEn}
                          width={200}
                          height={300}
                          className="object-cover"
                        />
                      </div>
                      <span className="cn-ft-rk num">{item.rank}</span>
                    </span>
                    <b className="cn-ft-t">{item.movieTitle}</b>
                    <span className="cn-ft-tot">
                      <b className="num">{item.indiaNettCrores.toFixed(2)}</b> ₹ Cr
                    </span>
                    <span className="cn-ft-tags">
                      <VerdictBadge verdict={item.verdict} size="sm" />
                      <span className="tag">{item.language.toUpperCase()}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= 6. Top 10 All-Time Lists ================= */}
        <section id="top10" className="cn-sec">
          <div className="cn-head">
            <h2>Top 10 lists</h2>
            <span className="cn-meta">All time, India nett unless noted</span>
          </div>

          <div className="cn-charts">
            <Link className="cn-t10c" href="/box-office">
              <span className="cn-t10-body">
                <span className="cn-t10-k">Opening day</span>
                <b className="cn-t10-n">Biggest opening days</b>
                <span className="cn-t10-lead">
                  <span>No. 1 · Dhurandhar: The Revenge</span>
                  <b className="num">102.55<small> ₹ Cr</small></b>
                </span>
                <span className="cn-t10-go">
                  See the top 10
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="cn-t10-poster">
                <Image
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop"
                  alt=""
                  width={200}
                  height={300}
                  className="object-cover"
                />
              </span>
            </Link>

            <Link className="cn-t10c" href="/box-office">
              <span className="cn-t10-body">
                <span className="cn-t10-k">Lifetime nett</span>
                <b className="cn-t10-n">Highest grossers in India</b>
                <span className="cn-t10-lead">
                  <span>No. 1 · Dhurandhar: The Revenge</span>
                  <b className="num">1,108.00<small> ₹ Cr</small></b>
                </span>
                <span className="cn-t10-go">
                  See the top 10
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="cn-t10-poster">
                <Image
                  src="https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop"
                  alt=""
                  width={200}
                  height={300}
                  className="object-cover"
                />
              </span>
            </Link>

            <Link className="cn-t10c" href="/box-office">
              <span className="cn-t10-body">
                <span className="cn-t10-k">Worldwide</span>
                <b className="cn-t10-n">Highest worldwide grossers</b>
                <span className="cn-t10-lead">
                  <span>No. 1 · Dhurandhar: The Revenge</span>
                  <b className="num">1,852.00<small> ₹ Cr</small></b>
                </span>
                <span className="cn-t10-go">
                  See the top 10
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
              <span className="cn-t10-poster">
                <Image
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop"
                  alt=""
                  width={200}
                  height={300}
                  className="object-cover"
                />
              </span>
            </Link>
          </div>
        </section>

        {/* ================= 7. Articles Grid ================= */}
        <section id="articles" className="cn-sec">
          <div className="cn-head">
            <h2>Articles</h2>
            <Link className="cn-more" href="/category/latest">
              All articles
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="cn-arts">
            {articles.slice(0, 6).map((art) => (
              <Link key={art.id} className="cn-artc" href={`/news/${art.slug}`}>
                <span className="cn-artc-img">
                  <Image
                    src={art.featuredImage}
                    alt=""
                    width={1280}
                    height={720}
                    className="object-cover"
                  />
                </span>
                <b>{art.title}</b>
                <span className="cn-artc-ex">{art.summary}</span>
                <small>News · 9 Nov</small>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ================= 8. Infinite Poster Reel ================= */}
      <section className="reel" aria-label="Films to explore">
        <div className="reel-track">
          {movies.slice(0, 16).map((movie) => (
            <Link key={movie.id} className="reel-item" href={`/movies/${movie.slug}`} title={movie.titleEn}>
              <Image
                src={movie.posterImage}
                alt={movie.titleEn}
                width={200}
                height={300}
                className="object-cover"
              />
            </Link>
          ))}
        </div>
      </section>

      <div className="wrap">
        {/* ================= 9. Releasing Soon ================= */}
        <section id="releases" className="cn-sec">
          <div className="cn-head">
            <h2>Releasing soon</h2>
            <span className="cn-meta">In cinemas over the coming weeks</span>
          </div>

          <div className="cn-soon">
            {hypoFilms.map((film) => (
              <Link key={film.id} className="cn-soon-c" href={`/movies/${film.slug}`}>
                <div className="poster">
                  <Image
                    src={film.posterImage}
                    alt={`${film.titleEn} poster`}
                    width={200}
                    height={300}
                    className="object-cover"
                  />
                </div>
                <b>{film.title}</b>
                <span>{film.releaseDateFormatted} · {film.language}</span>
                <span className="num">{film.interestedCountFormatted} interested</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= 10. Newsletter Dispatch CTA ================= */}
        <section className="cta" id="signup">
          <p>Get the day&apos;s box office and new reviews from Films Discourse.</p>
          <form className="cta-form" action="/archive" method="get">
            <label className="sr-only" htmlFor="cta-name">Your name</label>
            <input id="cta-name" name="name" placeholder="Your name" required />
            <label className="sr-only" htmlFor="cta-email">Your email</label>
            <input id="cta-email" name="email" type="email" placeholder="Your email" required />
            <button className="btn" type="submit">Get updates</button>
          </form>
        </section>
      </div>
    </main>
  );
}

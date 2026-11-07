import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataService } from "@/lib/dataService";
import BreakingTicker from "@/components/BreakingTicker";
import BespokeEditorialHero from "@/components/BespokeEditorialHero";
import CinemaIndustryPillFilters from "@/components/CinemaIndustryPillFilters";
import ModularBentoShowcase from "@/components/ModularBentoShowcase";
import UpcomingReleasesBuzz from "@/components/UpcomingReleasesBuzz";
import SpotlightNewsletter from "@/components/SpotlightNewsletter";
import HeroTopStories from "@/components/HeroTopStories";
import LiveUpdatesFeed from "@/components/LiveUpdatesFeed";
import HomeNewsFeed from "@/components/HomeNewsFeed";
import TrendingSidebar from "@/components/TrendingSidebar";
import ReviewsSection from "@/components/ReviewsSection";
import CinemaReleasesSection from "@/components/CinemaReleasesSection";
import BoxOfficeTable from "@/components/BoxOfficeTable";
import OttSection from "@/components/OttSection";
import VideoSection from "@/components/VideoSection";
import PhotoGallerySection from "@/components/PhotoGallerySection";
import EditorialBentoShowcase from "@/components/EditorialBentoShowcase";
import EditorialStoryDeck from "@/components/EditorialStoryDeck";
import CinemaJourneyTimeline from "@/components/CinemaJourneyTimeline";
import CelluloidEraScrubber from "@/components/CelluloidEraScrubber";
import EditorialTestimonials from "@/components/EditorialTestimonials";
import CineStarWidget from "@/components/CineStarWidget";
import AdBanner from "@/components/AdBanner";
import { DEFAULT_LANGUAGE, isLanguageCode } from "@/lib/languages";
import { LanguageCode } from "@/types";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const language: LanguageCode = "en";

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
    latestMovies,
    upcomingMovies,
    headerAd,
    sidebarAd,
  ] = await Promise.all([
    DataService.getArticles(language),
    DataService.getBreakingNews(language),
    DataService.getTopStories(language),
    DataService.getTrendingArticles(5, language),
    DataService.getReviews(language),
    DataService.getBoxOffice(language),
    DataService.getOttReleases(language),
    DataService.getVideos(language),
    DataService.getGalleries(language),
    DataService.getLatestTheatricalReleases(language, 8),
    DataService.getUpcomingReleases(language, "all", 8),
    DataService.getAdByPlacement("header_leaderboard"),
    DataService.getAdByPlacement("sidebar_rectangle"),
  ]);

  return (
    <div className="w-full">
      {/* 1. Breaking News Ticker */}
      <BreakingTicker articles={breakingNews} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
        {/* Header Ad Slot (728x90 Leaderboard) */}
        <AdBanner placement="header_leaderboard" ad={headerAd} />

        {/* ZONE 1: Bespoke Editorial Hero Concept */}
        <BespokeEditorialHero />

        {/* ZONE 2: High-Contrast Category Pill Filter Bar */}
        <CinemaIndustryPillFilters />

        {/* ZONE 3: Modular Pastel Bento Grid (The Everlasting Magic of Indian Cinema) */}
        <ModularBentoShowcase />

        {/* ZONE 4: Frontpage Press Dispatch & Lead Stories */}
        <div id="the-wire">
          <HeroTopStories articles={topStories.length > 0 ? topStories : allArticles.slice(0, 3)} />
        </div>

        {/* ZONE 5: Upcoming Theatrical Releases & Real-time Industry Buzz */}
        <UpcomingReleasesBuzz />

        {/* ZONE 6: Cinema Release Center (In Theatres & Theatrical Schedule) */}
        <section aria-label="Cinema Releases and Theatrical Schedule">
          <CinemaReleasesSection initialLatest={latestMovies} initialUpcoming={upcomingMovies} />
        </section>

        {/* In-Feed Banner Ad */}
        <AdBanner placement="in_article" />

        {/* ZONE 7: Core 2-Column Editorial Magazine (Col 8 Main Stream + Col 4 Intelligence Rail) */}
        <section aria-label="Editorial Stories and Industry Intelligence" className="content-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Col 8: Main Editorial Stream */}
            <div className="lg:col-span-8 space-y-12">
              {/* 7A. Magnum Opus Spotlight Review: Ramayana Part 1 & Latest Critical Reviews */}
              <ReviewsSection reviews={reviews} />

              {/* 7B. Latest Cinema Headlines & Industry Special Feed */}
              <HomeNewsFeed
                initialArticles={allArticles}
                initialTrending={trendingArticles}
                sidebarAd={null}
                hideSidebar={true}
              />

              {/* 7C. OTT & Streaming Radar */}
              <OttSection releases={ottReleases} />
            </div>

            {/* Col 4: Sticky Intelligence Sidebar */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-16">
              {/* Widget 1: Real-Time Live Cinema Wire */}
              <LiveUpdatesFeed compact={true} />

              {/* Widget 2: Top 5 Trending Cinema Stories */}
              <TrendingSidebar articles={trendingArticles} />

              {/* Widget 3: Box Office Leaderboard Summary */}
              <BoxOfficeTable entries={boxOffice} compact={true} />

              {/* Widget 4: CineStar Power Rankings (Forbes-style) */}
              <CineStarWidget />

              {/* Widget 5: Sidebar Rectangle Ad */}
              <AdBanner placement="sidebar_rectangle" ad={sidebarAd} />
            </div>
          </div>
        </section>

        {/* ZONE 8: Stay in the Spotlight Interactive Newsletter Strip */}
        <SpotlightNewsletter />

        {/* ZONE 9: Editorial Innovation Bento Showcase */}
        <EditorialBentoShowcase />

        {/* ZONE 10: Curated Story Deck (Fanned Editorial Cards) */}
        <EditorialStoryDeck />

        {/* ZONE 11: The Cinema Odyssey & Narrative Journey */}
        <CinemaJourneyTimeline />

        {/* ZONE 12: Celluloid Era Time-Machine (5 Decades of Cinema Evolution) */}
        <CelluloidEraScrubber />

        {/* ZONE 13: Visual Media Pavilion */}
        <section aria-label="Cinema Trailers and Celebrity Photo Gallery" className="space-y-12 pt-6 border-t-2 border-ink content-auto">
          {/* Trailers & Official Videos Lounge */}
          <VideoSection videos={videos} />

          {/* Celebrity Red Carpet & Photo Gallery */}
          <PhotoGallerySection galleries={galleries} />
        </section>

        {/* ZONE 14: Voices of Cinema & Community Acclaim */}
        <EditorialTestimonials />

        {/* Footer Banner Ad */}
        <AdBanner placement="footer_banner" />
      </main>
    </div>
  );
}

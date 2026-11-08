"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Flame, ArrowUpRight, Clock, Star } from "lucide-react";

interface ReleaseItem {
  id: string;
  title: string;
  starring: string;
  industry: string;
  industryBg: string;
  releaseDate: string;
  image: string;
  expectedGross: string;
}

export default function UpcomingReleasesBuzz() {
  const upcomingFilms: ReleaseItem[] = [
    {
      id: "rel-1",
      title: "Thangalaan",
      starring: "Chiyaan Vikram · Pa. Ranjith",
      industry: "Kollywood",
      industryBg: "bg-[#CBB2FE] text-ink",
      releaseDate: "AUG 15, 2026",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=650&fit=crop",
      expectedGross: "₹180 Cr Projected",
    },
    {
      id: "rel-2",
      title: "Coolie",
      starring: "Rajinikanth · Lokesh Kanagaraj",
      industry: "Pan-India",
      industryBg: "bg-[#FFAAA6] text-ink",
      releaseDate: "OCT 02, 2026",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=650&fit=crop",
      expectedGross: "₹650 Cr Projected",
    },
    {
      id: "rel-3",
      title: "Spirit",
      starring: "Prabhas · Sandeep Reddy Vanga",
      industry: "Tollywood",
      industryBg: "bg-[#F79D65] text-ink",
      releaseDate: "DEC 18, 2026",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=650&fit=crop",
      expectedGross: "₹900 Cr Projected",
    },
    {
      id: "rel-4",
      title: "Toxic: A Fairy Tale for Grown-ups",
      starring: "Yash · Geetu Mohandas",
      industry: "Sandalwood",
      industryBg: "bg-[#FFE082] text-ink",
      releaseDate: "APR 10, 2027",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&fit=crop&crop=face",
      expectedGross: "₹1,200 Cr Projected",
    },
  ];

  const buzzTags = [
    { tag: "#IndianCinema", count: "142K Dispatches" },
    { tag: "#RamayanaPart1", count: "98K Mentions" },
    { tag: "#Pushpa2TheRule", count: "84K Receipts" },
    { tag: "#Kalki2898AD", count: "65K Audits" },
    { tag: "#SSMB29", count: "54K Updates" },
    { tag: "#L2Empuraan", count: "41K Logs" },
  ];

  return (
    <section aria-label="Upcoming Theatrical Releases and Industry Buzz" className="w-full py-8">
      {/* Header with Handwritten Annotation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b-2 border-ink">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-handwritten text-xl text-ink font-semibold flex items-center gap-1 select-none">
              Mark your calendar!
              <span className="text-press font-bold">⤵</span>
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-poster uppercase text-ink tracking-tight">
            Upcoming Releases &amp; Buzz
          </h2>
          <p className="text-sm text-ink-dim font-grotesk font-medium mt-1 max-w-xl">
            Verified release schedules, audited screen bookings, and trending conversations across India&apos;s entertainment landscape.
          </p>
        </div>

        {/* Real-time Ticker Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sheet border-2 border-ink shadow-sticker text-xs font-poster uppercase font-bold text-ink">
          <Flame className="w-4 h-4 text-press fill-press animate-bounce" />
          <span>Live Industry Radar</span>
        </div>
      </div>

      {/* Grid of Upcoming Poster Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-8">
        {upcomingFilms.map((film) => (
          <div
            key={film.id}
            className="group relative bg-sheet rounded-[24px] border-2 border-ink shadow-press p-4 flex flex-col justify-between overflow-hidden hover:shadow-press-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Poster Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-ink shadow-sticker mb-4 bg-band">
              <Image
                src={film.image}
                alt={film.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

              {/* Industry & 5-Pillar Verification Tag inside photo */}
              <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-poster uppercase font-bold tracking-wider border border-ink shadow-xs ${film.industryBg}`}
                >
                  {film.industry}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-950 border border-ink shadow-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>5/5 Verified</span>
                </span>
              </div>

              {/* Date Overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-paper">
                <span className="px-2.5 py-1 rounded-full bg-ink/90 backdrop-blur-xs text-[10px] font-mono font-bold uppercase tracking-wider border border-paper/20">
                  {film.releaseDate}
                </span>
                <span className="text-[10px] font-mono text-marquee font-bold">
                  {film.expectedGross}
                </span>
              </div>
            </div>

            {/* Title & Cast */}
            <div className="space-y-1">
              <h3 className="text-lg font-poster uppercase text-ink tracking-tight line-clamp-1 group-hover:text-press transition-colors">
                {film.title}
              </h3>
              <p className="text-xs text-ink-dim font-grotesk font-medium line-clamp-1">
                {film.starring}
              </p>
            </div>

            {/* Bottom Card Action */}
            <div className="pt-3 mt-3 border-t border-ink/15 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-ink-mute font-bold">
                Theatrical Premiere
              </span>
              <span className="w-6 h-6 rounded-full bg-paper border border-ink flex items-center justify-center text-ink group-hover:bg-press group-hover:text-paper transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Industry Buzz Hashtag Strip */}
      <div className="rounded-2xl bg-paper border-2 border-ink p-4 shadow-sticker flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-press text-paper text-xs font-poster uppercase font-bold tracking-wider">
            Industry Buzz 🔥
          </span>
          <span className="text-xs font-mono font-bold text-ink-dim hidden sm:inline">
            Trending Across 6 Film Hubs:
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full">
          {buzzTags.map((item) => (
            <div
              key={item.tag}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sheet border border-ink text-xs font-mono font-bold text-ink whitespace-nowrap shadow-xs hover:bg-band cursor-pointer transition-colors"
            >
              <span className="text-press">#</span>
              <span>{item.tag.replace("#", "")}</span>
              <span className="text-[10px] text-ink-mute font-normal">({item.count})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


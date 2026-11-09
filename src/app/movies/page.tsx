import React, { Suspense } from "react";
import { Metadata } from "next";
import { DataService } from "@/lib/dataService";
import { MovieIntelligenceService } from "@/lib/movieIntelligence/movieIntelligenceService";
import MoviesClientView from "@/components/MoviesClientView";

export const metadata: Metadata = {
  title: "Cinema Releases & Discovery Hub | EXTRA-SAAGA",
  description:
    "A multi-source verified release board of new and upcoming Kannada, Telugu, Tamil, Malayalam, Hindi and Hollywood films now in theatres or arriving soon.",
};

export default async function MoviesPage() {
  const [movies, stats, verifiedResult] = await Promise.all([
    DataService.getMovies(),
    MovieIntelligenceService.getStats(),
    MovieIntelligenceService.getEngineResult(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper text-ink p-12 text-center font-poster uppercase text-sm">
          Loading Cinema Releases Wire...
        </div>
      }
    >
      <MoviesClientView
        allMovies={movies}
        stats={stats}
        verifiedMovies={verifiedResult.verifiedMovies}
      />
    </Suspense>
  );
}

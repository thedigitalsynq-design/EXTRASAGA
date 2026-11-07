import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TheaterAmbianceHUD from "@/components/TheaterAmbianceHUD";
import { getSiteUrl } from "@/lib/siteUrl";
import { LanguageProvider } from "@/context/LanguageContext";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EXTRASAGA | One Indian Cinema Industry. One Unified Platform.",
    template: "%s | EXTRASAGA — Bringing Indian Cinema Together",
  },
  description:
    "EXTRASAGA is the unified, professional corporate platform representing the entire Indian cinema industry. Connecting Bollywood, Sandalwood, Tollywood, Kollywood, Mollywood, Bengali, Marathi, Punjabi and every regional film industry under one consistent identity.",
  keywords: [
    "EXTRASAGA",
    "Indian Cinema",
    "One Indian Cinema Industry",
    "Indian Film Industry",
    "Bollywood",
    "Tollywood",
    "Kollywood",
    "Sandalwood",
    "Mollywood",
    "Box Office Telemetry",
    "CineStar Leaderboard",
    "Cinema Industry Directory",
    "Indian Movie Reviews",
    "Indian Theatrical Releases",
    "OTT Releases India",
  ],
  authors: [{ name: "EXTRASAGA Editorial Bureau", url: siteUrl }],
  openGraph: {
    title: "EXTRASAGA — One Indian Cinema Industry. One Unified Platform.",
    description: "Different languages. Different cultures. Different filmmaking traditions. One industry. One identity. One platform. EXTRASAGA — Bringing Indian Cinema Together.",
    url: siteUrl,
    siteName: "EXTRASAGA",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "EXTRASAGA — One Indian Cinema Industry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXTRASAGA | One Indian Cinema Industry. One Unified Platform.",
    description: "Different languages. Different cultures. Different filmmaking traditions. One industry. One identity. One platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kn">
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Kannada:wght@400;500;600;700;800;900&family=Benne&family=Anek+Kannada:wght@300;400;500;600;700;800&family=Noto+Sans+Kannada:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Baloo+Tammudu+2:wght@400;500;600;700;800&family=Baloo+Thambi+2:wght@400;500;600;700;800&family=Chilanka&family=DM+Sans:wght@400;500;700&family=Hubballi&family=Khand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F9FA] text-gray-900 font-kannada antialiased selection:bg-brand-crimson selection:text-white relative overflow-x-hidden">
        {/* Fluid Background Environment: Atmospheric Organic Gradient Blobs */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Top Left Crimson Ambient Blob */}
          <div className="absolute -top-[18%] -left-[10%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-brand-red/10 via-rose-300/10 to-transparent blur-[120px] animate-fluid-blob" />
          {/* Top Right Warm Amber Ambient Blob */}
          <div className="absolute top-[8%] -right-[12%] w-[620px] h-[620px] rounded-full bg-gradient-to-bl from-amber-400/10 via-yellow-200/10 to-transparent blur-[130px] animate-fluid-blob-delayed" />
          {/* Mid-Page Sky / Emerald Ambient Blob */}
          <div className="absolute top-[45%] -left-[8%] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-sky-400/8 via-emerald-300/8 to-transparent blur-[140px] animate-fluid-blob" />
          {/* Bottom Right Deep Lavender / Rose Ambient Blob */}
          <div className="absolute -bottom-[10%] right-[5%] w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-indigo-300/8 via-pink-300/8 to-transparent blur-[150px] animate-fluid-blob-delayed" />
          {/* Subtle Fine Micro-Grain for Tactile Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <LanguageProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <TheaterAmbianceHUD />
        </LanguageProvider>
      </body>
    </html>
  );
}

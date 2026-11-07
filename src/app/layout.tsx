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
    default: "EXTRASAGA | All Six Industries. One Cinema. House Full Every Day.",
    template: "%s | EXTRASAGA — House Full Indian Cinema Press",
  },
  description:
    "EXTRASAGA is the front page of Indian cinema fandom: verified release dates, receipt-backed box office, unbiased verdicts, OTT radar and the loudest cine conversations across Bollywood, Sandalwood, Tollywood, Kollywood, Mollywood and Hollywood — typeset in six native scripts.",
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
    title: "EXTRASAGA — All Six Industries. One Cinema.",
    description:
      "Different languages. Different cultures. Different filmmaking traditions. One industry. One identity. One press run. House full, every day.",
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
    title: "EXTRASAGA | All Six Industries. One Cinema.",
    description:
      "Different languages. Different cultures. Different filmmaking traditions. One industry. One identity. One platform.",
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
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Noto+Serif+Kannada:wght@400;500;600;700;800;900&family=Benne&family=Anek+Kannada:wght@300;400;500;600;700;800&family=Noto+Sans+Kannada:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Catamaran:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Baloo+Tammudu+2:wght@400;500;600;700;800&family=Baloo+Thambi+2:wght@400;500;600;700;800&family=Chilanka&family=Hubballi&family=Khand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-paper text-ink font-kannada antialiased relative overflow-x-hidden">
        {/* Press Environment: the sheet is always on the printing table */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Newsprint wash — warm paper breath, never sterile white */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#FBF7EC_0%,#F4EFE2_60%)]" />
          {/* Registration grid — faint risograph checkout lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,20,15,0.04)_1px,transparent_1px)] [background-size:32px_100%]" />
          {/* Halftone plates — two printed plates, top-left and mid-right */}
          <div className="absolute -top-10 -left-10 w-[420px] h-[320px] halftone-faint rounded-2xl rotate-[-2deg]" />
          <div className="absolute top-[45%] -right-16 w-[380px] h-[280px] halftone-faint rounded-2xl rotate-[1.5deg]" />
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

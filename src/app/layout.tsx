import type { Metadata } from "next";
import "./globals.css";
import "@/styles/filmsDiscourse.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TheaterAmbianceHUD from "@/components/TheaterAmbianceHUD";
import { getSiteUrl } from "@/lib/siteUrl";
import { LanguageProvider } from "@/context/LanguageContext";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EXTRA-SAAGA | All Six Industries. One Cinema. House Full Every Day.",
    template: "%s | EXTRA-SAAGA — Indian Cinema Press",
  },
  description:
    "EXTRA-SAAGA is the front page of Indian cinema fandom, reported in English: verified release dates, receipt-backed box office, unbiased verdicts and OTT radar across Bollywood, Sandalwood, Tollywood, Kollywood, Mollywood and Hollywood.",
  keywords: [
    "EXTRA-SAAGA",
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
  authors: [{ name: "EXTRA-SAAGA Editorial Bureau", url: siteUrl }],
  openGraph: {
    title: "EXTRA-SAAGA — All Six Industries. One Cinema.",
    description:
      "Different languages. Different cultures. Different filmmaking traditions. One industry. One identity. One press run. House full, every day.",
    url: siteUrl,
    siteName: "EXTRA-SAAGA",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "EXTRA-SAAGA — One Indian Cinema Industry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXTRA-SAAGA | All Six Industries. One Cinema.",
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
    <html lang="en" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `var fdT='dark';try{var fdS=localStorage.getItem('fd_theme');if(fdS==='dark'||fdS==='light')fdT=fdS;}catch(e){}document.documentElement.setAttribute('data-theme',fdT);`,
          }}
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        data-concept="cinema"
        className="min-h-screen flex flex-col bg-paper text-ink font-sans antialiased relative overflow-x-hidden"
      >
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

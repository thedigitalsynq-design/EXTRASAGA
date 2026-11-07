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
    default: "FILMY GARAGE | Cinema News, Movie Reviews, Box Office & Multi-Industry Entertainment Portal",
    template: "%s | FILMY GARAGE (ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್)",
  },
  description:
    "FILMY GARAGE (ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್) - ಪ್ರೀಮಿಯಂ ಬಹುಭಾಷಾ ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಮಾಧ್ಯಮ. ಸ್ಯಾಂಡಲ್ವುಡ್, ಟಾಲಿವುಡ್, ಕಾಲಿವುಡ್, ಮಾಲಿವುಡ್, ಬಾಲಿವುಡ್ ಮತ್ತು ಹಾಲಿವುಡ್ ಇತ್ತೀಚಿನ ಸುದ್ದಿ, ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್, ಒಟಿಟಿ ಅಪ್ಡೇಟ್ಸ್, ಫೋಟೋ ಗ್ಯಾಲರಿ ಮತ್ತು ವಿಡಿಯೋಗಳು.",
  keywords: [
    "FILMY GARAGE",
    "ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್",
    "Filmy Garage Cinema",
    "ಕನ್ನಡ ಸಿನಿಮಾ",
    "ಸ್ಯಾಂಡಲ್ವುಡ್ ಸುದ್ದಿ",
    "Sandalwood news",
    "Tollywood news",
    "Kollywood news",
    "Bollywood news",
    "Hollywood cinema",
    "Kannada movie reviews",
    "Kantara Chapter 1",
    "Yash Toxic",
    "Kiccha Sudeep Max",
    "Box office records",
    "OTT releases",
  ],
  authors: [{ name: "FILMY GARAGE ಬ್ಯೂರೋ", url: siteUrl }],
  openGraph: {
    title: "FILMY GARAGE - Cinema & Entertainment News Hub",
    description: "FILMY GARAGE (ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್) - ಪ್ರೀಮಿಯಂ ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಜರ್ನಲಿಸಂ. ಕ್ಷಣಕ್ಷಣದ ತಾಜಾ ಸಮಾಚಾರ.",
    url: siteUrl,
    siteName: "FILMY GARAGE (ಫಿಲ್ಮಿ ಗ್ಯಾರೇಜ್)",
    locale: "kn_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "FILMY GARAGE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FILMY GARAGE | Cinema & Entertainment News",
    description: "ಸಿನಿಮಾಗಳ ಕ್ಷಣಕ್ಷಣದ ಸುದ್ದಿ, ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ ಮತ್ತು ಸೆಲೆಬ್ರಿಟಿ ಅಪ್ಡೇಟ್ಸ್.",
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

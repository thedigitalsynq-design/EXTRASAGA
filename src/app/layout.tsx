import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sinikannada.com"),
  title: {
    default: "ಸಿನಿ ಕನ್ನಡ | Kannada Cinema News, Reviews, Box Office & Sandalwood Updates",
    template: "%s | ಸಿನಿ ಕನ್ನಡ (Sini Kannada)",
  },
  description:
    "ಕರ್ನಾಟಕದ ನಂ.1 ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಪೋರ್ಟಲ್. ಸ್ಯಾಂಡಲ್ವುಡ್ ಇತ್ತೀಚಿನ ಸುದ್ದಿ, ಸಿನಿಮಾ ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್, ಒಟಿಟಿ ಅಪ್ಡೇಟ್ಸ್, ಫೋಟೋ ಗ್ಯಾಲರಿ ಮತ್ತು ವಿಡಿಯೋಗಳು.",
  keywords: [
    "ಕನ್ನಡ ಸಿನಿಮಾ",
    "ಸ್ಯಾಂಡಲ್ವುಡ್ ಸುದ್ದಿ",
    "Sandalwood news",
    "Kannada cinema",
    "Kannada movie reviews",
    "Kantara Chapter 1",
    "Yash Toxic",
    "Kiccha Sudeep Max",
    "Kannada box office",
    "Kannada OTT releases",
    "ಸಿನಿ ಕನ್ನಡ",
  ],
  authors: [{ name: "ಸಿನಿ ಕನ್ನಡ ಬ್ಯೂರೋ", url: "https://sinikannada.com" }],
  openGraph: {
    title: "ಸಿನಿ ಕನ್ನಡ - Sandalwood Entertainment News",
    description: "ಕರ್ನಾಟಕದ ನಂ.1 ಸಿನಿಮಾ ಮತ್ತು ಮನರಂಜನಾ ಪೋರ್ಟಲ್. ಕ್ಷಣಕ್ಷಣದ ತಾಜಾ ಸಮಾಚಾರ.",
    url: "https://sinikannada.com",
    siteName: "ಸಿನಿ ಕನ್ನಡ (Sini Kannada)",
    locale: "kn_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "ಸಿನಿ ಕನ್ನಡ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ಸಿನಿ ಕನ್ನಡ | Sandalwood Cinema News",
    description: "ಕನ್ನಡ ಸಿನಿಮಾಗಳ ಕ್ಷಣಕ್ಷಣದ ಸುದ್ದಿ, ವಿಮರ್ಶೆ, ಬಾಕ್ಸ್ ಆಫೀಸ್ ಗಳಿಕೆ.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0F0F11] text-gray-100 font-kannada antialiased selection:bg-brand-red selection:text-white">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

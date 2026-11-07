import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          50: "#F2FAF5",
          100: "#E3F5EB",
          200: "#B7E5BA", // Jade Horizon Swatch 1
          300: "#86D29D",
          400: "#5CA87C", // Jade Horizon Swatch 2
          500: "#34A36B",
          600: "#288760", // Jade Horizon Swatch 3 (Core Brand Accent)
          700: "#1F6F4E",
          800: "#1A5140", // Jade Horizon Swatch 4 (Deep Spruce)
          900: "#0F3529",
          950: "#082018",
          DEFAULT: "#288760",
        },
        surface: {
          canvas: "#F8FAF9",
          card: "#FFFFFF",
          muted: "#F3F7F5",
          mint: "#E8F8EB",
          border: "#E5EBE7",
        },
        crimson: {
          DEFAULT: "#C81E2E",
          glow: "#E11D48",
          deep: "#8A121D",
        },
        cinemaGold: {
          DEFAULT: "#F59E0B",
          amber: "#D97706",
          light: "#FDE68A",
        },
        brand: {
          red: "#E50914",
          crimson: "#C81E2E",
          darkred: "#850000",
          yellow: "#F59E0B",
          black: "#0F3529",
          dark: "#1A5140",
          card: "#FFFFFF",
          border: "#E5EBE7",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        kannada: ["var(--font-sans)"],
        notoSerifKannada: ["var(--font-noto-serif-kannada)", "serif"],
        benne: ["var(--font-benne)", "var(--font-kannada)"],
        english: ["var(--font-english)"],
        googleSans: ["var(--font-english)"],
        hubballi: ["var(--font-kannada)"],
        telugu: ["var(--font-telugu)"],
        tamil: ["var(--font-tamil)"],
        hindi: ["var(--font-hindi)"],
        malayalam: ["var(--font-malayalam)"],
        display: ["var(--font-display)"],
      },
      animation: {
        ticker: "ticker 25s linear infinite",
        pulseFast: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

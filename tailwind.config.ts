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
        brand: {
          red: "#E50914",
          crimson: "#C10712",
          darkred: "#850000",
          yellow: "#FFB800",
          black: "#0F0F11",
          dark: "#16171B",
          card: "#1C1D22",
          border: "#2A2B33",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        kannada: ["var(--font-kannada)", "'Noto Sans Kannada'", "sans-serif"],
        display: ["var(--font-display)", "'Tiro Kannada'", "serif"],
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

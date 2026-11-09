import type { Config } from "tailwindcss";

/**
 * EXTRASAGA — HOUSE FULL PRESS EDITION (v4.0)
 * Ref: docs/DESIGN-SYSTEM.md
 *
 * Fandom-Webzine Brutalism: the site is a printed fanzine.
 * Newsprint canvas, ink-black type, loud poster inks, hard offset
 * shadows, sticker badges, marquee strips. Zero glow, zero glass.
 *
 * Legacy token names (void / hall / revealed / screen / glow-line /
 * popcorn / jade / surface / crimson / brand) stay resolvable but are
 * remapped onto the paper system so un-migrated internals degrade to
 * fanzine equivalents — never back to dark mode.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── HOUSE FULL PRESS core (canonical) ────────────────────────
        paper: "#F4EFE2", // the sheet — page canvas
        sheet: "#FBF7EC", // cards, panels
        band: "#ECE3D0", // alternate newspaper bands
        ink: {
          DEFAULT: "#17140F", // warm black — type & borders
          dim: "#5C5344", // secondary type
          mute: "#8D8471", // metadata, captions
        },
        line: {
          DEFAULT: "#D9CEB4", // hairline rules
          strong: "#17140F", // emphasis rules (2px ink)
        },

        // ── Poster inks ──────────────────────────────────────────────
        press: {
          DEFAULT: "#E03A2F", // poster red — LIVE, breaking, gossip, trending
          deep: "#B3271E", // pressed fill
          soft: "#D94B3B", // text-grade red on paper
          faint: "rgba(224, 58, 47, 0.10)",
        },
        violet: {
          DEFAULT: "#4F2BEF", // electric print violet — editorial, reviews
          deep: "#3B1DBE",
          soft: "#6D4FF5", // text-grade violet on paper
          faint: "rgba(79, 43, 239, 0.09)",
        },
        marquee: {
          DEFAULT: "#F0B429", // bulb gold — Ramayana reverence, #1 rank, countdowns
          soft: "#C4881A", // text-grade gold on paper
          deep: "#A96A00",
          faint: "rgba(240, 180, 41, 0.16)",
        },

        // ── Legacy aliases (remapped to press values) ────────────────
        signal: {
          DEFAULT: "#E03A2F",
          deep: "#B3271E",
          soft: "#D94B3B",
          faint: "rgba(224, 58, 47, 0.10)",
        },
        ultra: {
          DEFAULT: "#4F2BEF",
          deep: "#3B1DBE",
          soft: "#6D4FF5",
          faint: "rgba(79, 43, 239, 0.09)",
        },
        void: "#F4EFE2",
        hall: "#ECE3D0",
        revealed: "#FBF7EC",
        screen: "#F1EADA",
        "glow-line": {
          DEFAULT: "#D9CEB4",
          strong: "#17140F",
        },
        popcorn: {
          DEFAULT: "#17140F",
          dim: "#5C5344",
          muted: "#8D8471",
        },
        jade: {
          50: "#F4EFE2",
          100: "#ECE3D0",
          200: "#D9CEB4",
          300: "#C8B200",
          400: "#6D4FF5",
          500: "#4F2BEF",
          600: "#4F2BEF",
          700: "#3B1DBE",
          800: "#5C5344",
          900: "#17140F",
          950: "#17140F",
          DEFAULT: "#4F2BEF",
        },
        surface: {
          canvas: "#F4EFE2",
          card: "#FBF7EC",
          muted: "#ECE3D0",
          mint: "#F1EADA",
          border: "#D9CEB4",
        },
        crimson: {
          DEFAULT: "#E03A2F",
          glow: "#D94B3B",
          deep: "#B3271E",
        },
        cinemaGold: {
          DEFAULT: "#F0B429",
          amber: "#C4881A",
          light: "#F7CE68",
        },
        brand: {
          red: "#E03A2F",
          crimson: "#E03A2F",
          darkred: "#B3271E",
          yellow: "#F0B429",
          black: "#17140F",
          dark: "#FBF7EC",
          card: "#FBF7EC",
          border: "#17140F",
          muted: "#5C5344",
        },
      },
      fontFamily: {
        sans: ["'DM Serif Display'", "Georgia", "serif"],
        serif: ["'DM Serif Display'", "Georgia", "serif"],
        display: ["'DM Serif Display'", "Georgia", "serif"],
        poster: ["'DM Serif Display'", "Georgia", "serif"],
        kannada: ["'DM Serif Display'", "Georgia", "serif"],
        notoSerifKannada: ["'DM Serif Display'", "Georgia", "serif"],
        benne: ["'DM Serif Display'", "Georgia", "serif"],
        english: ["'DM Serif Display'", "Georgia", "serif"],
        grotesk: ["'DM Serif Display'", "Georgia", "serif"],
        googleSans: ["'DM Serif Display'", "Georgia", "serif"],
        googleSansFlex: ["'DM Serif Display'", "Georgia", "serif"],
        hubballi: ["'DM Serif Display'", "Georgia", "serif"],
        telugu: ["'DM Serif Display'", "Georgia", "serif"],
        tamil: ["'DM Serif Display'", "Georgia", "serif"],
        hindi: ["'DM Serif Display'", "Georgia", "serif"],
        malayalam: ["'DM Serif Display'", "Georgia", "serif"],
        displayLatin: ["'DM Serif Display'", "Georgia", "serif"],
      },
      boxShadow: {
        // The press-print offset shadows — the signature of the edition
        press: "4px 4px 0 0 #17140F",
        "press-sm": "2px 2px 0 0 #17140F",
        "press-lg": "7px 7px 0 0 #17140F",
        sticker: "3px 3px 0 0 #17140F",
        none: "none",
      },
      borderWidth: {
        3: "3px",
      },
      animation: {
        ticker: "ticker 25s linear infinite",
        pulseFast: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "ticker 18s linear infinite",
        "stamp-in": "stamp-in 0.4s cubic-bezier(0.22, 1.4, 0.36, 1) both",
        wiggle: "wiggle 2.5s ease-in-out infinite",
        "print-roll": "print-roll 0.6s ease-out both",
        flicker: "flicker 6s linear infinite",
        "countdown-flip": "countdown-flip 2.4s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "stamp-in": {
          "0%": { transform: "scale(1.6) rotate(-14deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(-3deg)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "print-roll": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.72" },
          "94%": { opacity: "1" },
          "97%": { opacity: "0.85" },
          "98%": { opacity: "1" },
        },
        "countdown-flip": {
          "0%, 100%": { transform: "perspective(400px) rotateX(0deg)" },
          "50%": { transform: "perspective(400px) rotateX(6deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

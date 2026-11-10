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
        // ── Cinema Auditorium & Press Tokens (Unified Across Whole Site) ──
        paper: "var(--paper)", // the sheet — page canvas
        sheet: "var(--sheet)", // cards, panels
        band: "var(--band)", // alternate bands
        ink: {
          DEFAULT: "var(--ink)", // primary type
          dim: "var(--ink-dim)", // secondary type
          mute: "var(--ink-mute)", // metadata, captions
        },
        line: {
          DEFAULT: "var(--line)", // hairline rules
          strong: "var(--line-2)", // emphasis rules
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
        sans: ["'Google Sans Flex'", "sans-serif"],
        serif: ["'Google Sans Flex'", "sans-serif"],
        display: ["'Google Sans Flex'", "sans-serif"],
        poster: ["'Google Sans Flex'", "sans-serif"],
        kannada: ["'Google Sans Flex'", "sans-serif"],
        notoSerifKannada: ["'Google Sans Flex'", "sans-serif"],
        benne: ["'Google Sans Flex'", "sans-serif"],
        english: ["'Google Sans Flex'", "sans-serif"],
        grotesk: ["'Google Sans Flex'", "sans-serif"],
        googleSans: ["'Google Sans Flex'", "sans-serif"],
        googleSansFlex: ["'Google Sans Flex'", "sans-serif"],
        hubballi: ["'Google Sans Flex'", "sans-serif"],
        telugu: ["'Google Sans Flex'", "sans-serif"],
        tamil: ["'Google Sans Flex'", "sans-serif"],
        hindi: ["'Google Sans Flex'", "sans-serif"],
        malayalam: ["'Google Sans Flex'", "sans-serif"],
        displayLatin: ["'Google Sans Flex'", "sans-serif"],
      },
      boxShadow: {
        // Cinema depth and subtle glow shadows
        press: "0 2px 8px rgba(0,0,0,0.5), 0 12px 28px -8px rgba(0,0,0,0.7)",
        "press-sm": "0 1px 4px rgba(0,0,0,0.4)",
        "press-lg": "0 16px 36px -12px rgba(0,0,0,0.85)",
        sticker: "0 2px 6px rgba(0,0,0,0.4)",
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

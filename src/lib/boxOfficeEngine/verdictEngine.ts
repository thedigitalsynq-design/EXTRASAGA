import { FilmsDiscourseVerdictLevel } from "@/types/boxOffice";

export function normalizeVerdictKey(v: string): FilmsDiscourseVerdictLevel {
  const clean = v.toLowerCase().replace(/[-_ ]+/g, "_");
  if (clean.includes("all_time") || clean.includes("atb")) return "all_time_blockbuster";
  if (clean.includes("blockbuster")) return "blockbuster";
  if (clean.includes("superhit") || clean.includes("super_hit")) return "superhit";
  if (clean.includes("hit")) return "hit";
  if (clean.includes("above_average")) return "above_average";
  if (clean.includes("average")) return "average";
  if (clean.includes("flop")) return "flop";
  if (clean.includes("disaster")) return "disaster";
  if (clean.includes("running") || clean.includes("in_theatres")) return "running";
  return "hit";
}

export function getVerdictPresentation(verdict: FilmsDiscourseVerdictLevel | string): {
  label: string;
  badgeClass: string;
  symbol: string;
} {
  const key = typeof verdict === "string" ? normalizeVerdictKey(verdict) : verdict;

  switch (key) {
    case "all_time_blockbuster":
      return {
        label: "All-Time Blockbuster",
        badgeClass: "bg-marquee text-ink border-2 border-ink shadow-sticker font-black",
        symbol: "👑",
      };
    case "blockbuster":
      return {
        label: "Blockbuster",
        badgeClass: "bg-marquee-soft text-ink border-2 border-ink shadow-sticker font-black",
        symbol: "⭐",
      };
    case "superhit":
      return {
        label: "Superhit",
        badgeClass: "bg-press text-paper border-2 border-ink shadow-sticker font-black",
        symbol: "🔥",
      };
    case "hit":
      return {
        label: "Hit",
        badgeClass: "bg-band text-ink border-2 border-ink shadow-sticker font-bold",
        symbol: "✓",
      };
    case "above_average":
      return {
        label: "Above Average",
        badgeClass: "bg-sheet text-ink border border-ink font-bold",
        symbol: "▲",
      };
    case "average":
      return {
        label: "Average",
        badgeClass: "bg-paper text-ink-dim border border-ink font-medium",
        symbol: "—",
      };
    case "flop":
      return {
        label: "Flop",
        badgeClass: "bg-paper text-ink-mute border border-ink/40 line-through font-normal",
        symbol: "✕",
      };
    case "disaster":
      return {
        label: "Disaster",
        badgeClass: "bg-paper text-ink-mute border border-ink/40 line-through font-normal",
        symbol: "⚠",
      };
    case "running":
      return {
        label: "In Theatres",
        badgeClass: "bg-press text-paper border-2 border-ink shadow-sticker animate-pulse font-bold",
        symbol: "●",
      };
    default:
      return {
        label: String(verdict),
        badgeClass: "bg-band text-ink border border-ink font-bold",
        symbol: "•",
      };
  }
}

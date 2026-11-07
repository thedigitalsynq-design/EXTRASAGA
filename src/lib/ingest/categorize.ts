import type { CategorySlug } from "@/types";

export interface CategoryRule {
  category: CategorySlug;
  keywords: string[];
}

export const CATEGORY_RULES: CategoryRule[] = [
  { category: "box-office", keywords: ["ಬಾಕ್ಸ್ ಆಫೀಸ್", "ಕಲೆಕ್ಷನ್", "box office", "collection", "crore"] },
  { category: "ott", keywords: ["ಒಟಿಟಿ", "ನೆಟ್‌ಫ್ಲಿಕ್ಸ್", "ಪ್ರೈಮ್", "ಜೀ5", "ಸ್ಟ್ರೀಮಿಂಗ್", "ott", "netflix", "prime video", "zee5", "streaming"] },
  { category: "reviews", keywords: ["ವಿಮರ್ಶೆ", "ವಿಮರ್ಶೆಗಳು", "ವಿಮರ್ಶಿಸ", "ರಿವ್ಯೂ", "ರೇಟಿಂಗ್", "review", "rating"] },
  { category: "interviews", keywords: ["ಸಂದರ್ಶನ", "ಸಂದರ್ಶನಗಳು", "ಮಾತುಕತೆ", "interview"] },
  { category: "gossip", keywords: ["ಗಾಸಿಪ್", "ಗುಲ್ಲು", "ವೈರಲ್", "gossip", "viral"] },
  { category: "upcoming", keywords: ["ಮುಂಬರುವ", "ಶೂಟಿಂಗ್", "ಚಿತ್ರೀಕರಣ", "ಬಿಡುಗಡೆ", "ಟೀಸರ್", "ಟ್ರೇಲರ್", "upcoming", "shooting", "teaser", "trailer"] },
  { category: "actresses", keywords: ["ನಟಿ", "ನಟಿಯರು", "ನಟಿಯರ", "ಹೀರೋಯಿನ್", "actress", "heroine"] },
  { category: "actors", keywords: ["ನಟ", "ನಟರು", "ನಟರ", "ನಟನ", "ನಟರಿಗೆ", "ಹೀರೋ", "actor", "hero"] },
  { category: "bollywood", keywords: ["ಬಾಲಿವುಡ್", "ಹಿಂದಿ", "bollywood", "hindi"] },
  { category: "hollywood", keywords: ["ಹಾಲಿವುಡ್", "hollywood"] },
  { category: "sandalwood", keywords: ["ಸ್ಯಾಂಡಲ್ವುಡ್", "ಕನ್ನಡ ಸಿನಿಮಾ", "ಕನ್ನಡ ಚಿತ್ರ", "ಕಿಚ್ಚ", "ಯಶ್", "ರಿಷಬ್", "ದರ್ಶನ್", "sandalwood", "kannada cinema"] },
];

const BOX_OFFICE_WEAK = ["ಗಳಿಕೆ", "ಕೋಟಿ", "collection", "crore"];

export interface CategoryInput {
  title: string;
  excerpt?: string;
  sourceSection?: string | null;
}

function keywordMatches(text: string, keyword: string): boolean {
  const lowerKeyword = keyword.toLowerCase();
  if (/^[\x20-\x7E]+$/.test(lowerKeyword)) {
    const escaped = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`).test(text);
  }
  let index = text.indexOf(lowerKeyword);
  while (index !== -1) {
    const next = text.slice(index + lowerKeyword.length, index + lowerKeyword.length + 1);
    const continuesWord = next !== "" && next >= "\u0C80" && next <= "\u0CFF";
    if (!continuesWord) return true;
    index = text.indexOf(lowerKeyword, index + 1);
  }
  return false;
}

export function inferCategory(input: CategoryInput, fallback: CategorySlug): CategorySlug {
  const text = `${input.title} ${input.excerpt ?? ""} ${input.sourceSection ?? ""}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => keywordMatches(text, keyword))) {
      return rule.category;
    }
  }
  const weakMatches = BOX_OFFICE_WEAK.filter((keyword) => keywordMatches(text, keyword)).length;
  if (weakMatches >= 2) return "box-office";
  return fallback;
}

export function extractTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (!keywordMatches(lower, keyword)) continue;
      const key = keyword.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      tags.push(keyword);
      if (tags.length === 4) return tags;
    }
  }
  return tags;
}

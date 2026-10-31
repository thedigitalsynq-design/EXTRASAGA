import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert numbers to Kannada numerals if needed or format currency
export function formatKannadaNumber(num: number): string {
  return new Intl.NumberFormat("kn-IN").format(num);
}

// Format date into natural Kannada string (e.g. "31 ಅಕ್ಟೋಬರ್ 2026")
const KANNADA_MONTHS = [
  "ಜನವರಿ",
  "ಫೆಬ್ರವರಿ",
  "ಮಾರ್ಚ್",
  "ಏಪ್ರಿಲ್",
  "ಮೇ",
  "ಜೂನ್",
  "ಜುಲೈ",
  "ಆಗಸ್ಟ್",
  "ಸೆಪ್ಟೆಂಬರ್",
  "ಅಕ್ಟೋಬರ್",
  "ನವೆಂಬರ್",
  "ಡಿಸೆಂಬರ್",
];

export function formatKannadaDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = d.getDate();
    const month = KANNADA_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

// Relative time in Kannada (e.g. "2 ಗಂಟೆಗಳ ಹಿಂದೆ", "ನಿನ್ನೆ")
export function formatKannadaTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "ಈಗಷ್ಟೇ";
    if (diffMin < 60) return `${diffMin} ನಿಮಿಷಗಳ ಹಿಂದೆ`;
    if (diffHours < 24) return `${diffHours} ಗಂಟೆಗಳ ಹಿಂದೆ`;
    if (diffDays === 1) return "ನಿನ್ನೆ";
    if (diffDays < 7) return `${diffDays} ದಿನಗಳ ಹಿಂದೆ`;
    return formatKannadaDate(dateString);
  } catch {
    return dateString;
  }
}

// Slug generator for Kannada & English titles
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0C80-\u0CFF-]+/g, "") // Keep alphanumeric, hyphen, and Kannada Unicode range (\u0C80-\u0CFF)
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}


const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "in",
  "is", "it", "its", "of", "on", "or", "that", "the", "this", "to", "was",
  "were", "will", "with",
]);

// [^\p{L}\p{M}\p{N}\s]: letters, marks, digits and whitespace survive. Kannada
// vowel signs and the virama are \p{M}, so omitting M would split "ಚಿತ್ರದ" into
// single-consonant fragments. Built from a string because the project's tsconfig
// has no "target" (defaults below ES6) and rejects the "u" flag on regex literals.
const NON_WORD_PATTERN = new RegExp("[^\\p{L}\\p{M}\\p{N}\\s]", "gu");

// ZWNJ/ZWJ are used inside Kannada words (e.g. ನೆಟ್‌ಫ್ಲಿಕ್ಸ್). Deleting rather
// than replacing them keeps one token for both spellings.
const ZERO_WIDTH_JOINERS = /[\u200C\u200D]/g;

/**
 * NFC-normalises, lowercases a headline, strips punctuation/symbols, and drops
 * English stopwords. Kannada words are kept whole; no stemming is applied.
 * NFC comes first so canonically equivalent spellings (composed vs decomposed
 * vowel signs) produce identical token strings.
 */
export function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .normalize("NFC")
      .toLowerCase()
      .replace(ZERO_WIDTH_JOINERS, "")
      .replace(NON_WORD_PATTERN, " ")
      .split(/\s+/)
      .filter((token) => token.length > 0 && !STOPWORDS.has(token)),
  );
}

/**
 * Jaccard similarity of two token sets: |intersection| / |union|.
 * Two empty sets score 0 rather than 1 so empty headlines never merge.
 */
export function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  a.forEach((token) => {
    if (b.has(token)) intersection += 1;
  });
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Returns the highest-scoring candidate whose headline similarity reaches
 * `threshold`, or null when nothing is similar enough.
 */
export function findMergeCandidate<T extends { id: string; title: string }>(
  title: string,
  candidates: T[],
  threshold = 0.62,
): T | null {
  const tokens = titleTokens(title);
  let best: T | null = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const score = jaccardSimilarity(tokens, titleTokens(candidate.title));
    if (score >= threshold && score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

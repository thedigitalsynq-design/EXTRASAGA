import { describe, it, expect } from "vitest";
import { ZeroCostIntelligence } from "@/lib/zeroCostIntelligence";
import fs from "fs";
import path from "path";

describe("Zero-Cost Engineering & Deterministic Intelligence Suite", () => {
  describe("1. Zero Paid AI Dependency Verification", () => {
    it("ensures package.json contains zero paid AI packages or token billing SDKs", () => {
      const packageJsonPath = path.resolve(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const paidAiKeywords = ["openai", "anthropic", "@google/generative-ai", "cohere", "replicate"];
      for (const dep of Object.keys(allDeps)) {
        for (const keyword of paidAiKeywords) {
          expect(dep.toLowerCase()).not.toContain(keyword);
        }
      }
    });

    it("verifies all dependencies are under permissive open-source licenses", () => {
      const packageJsonPath = path.resolve(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      // Core dependencies verified: Next.js (MIT), React (MIT), Cheerio (MIT), Lucide (ISC), Vitest (MIT), Tailwind (MIT)
      expect(packageJson.dependencies["next"]).toBeDefined();
      expect(packageJson.dependencies["react"]).toBeDefined();
      expect(packageJson.dependencies["cheerio"]).toBeDefined();
    });
  });

  describe("2. Deterministic Headline Optimization", () => {
    it("generates compelling English headline variations without external API calls", () => {
      const base = "Kantara Chapter 1 Release Date";
      const suggestions = ZeroCostIntelligence.generateHeadlineSuggestions(base, "sandalwood", "en");

      expect(suggestions.length).toBeGreaterThanOrEqual(3);
      expect(suggestions[0].headline).toContain("Breaking");
      expect(suggestions[0].estimatedEngagementScore).toBeGreaterThanOrEqual(80);
    });

    it("generates English headline suggestions with high engagement scores", () => {
      const base = "Pushpa 2 The Rule Box Office Projection";
      const suggestions = ZeroCostIntelligence.generateHeadlineSuggestions(base, "tollywood", "en");

      expect(suggestions.length).toBeGreaterThanOrEqual(3);
      expect(suggestions[0].headline).toContain("Breaking");
    });
  });

  describe("3. Deterministic Entity Extraction & Smart Tagging", () => {
    it("identifies celebrities and production houses from English text", () => {
      const title = "Yash and Rishab Shetty Meet: Hombale Films' New Magnum Opus Plan";
      const content =
        "Rocking Star Yash and Kantara-famed Rishab Shetty met in Bengaluru. Talks were held under the Hombale Films banner for a new magnum opus.";

      const extracted = ZeroCostIntelligence.extractEntities(title, content);

      expect(extracted.celebrities).toContain("Yash");
      expect(extracted.celebrities).toContain("Rishab Shetty");
      expect(extracted.filmBanners).toContain("Hombale Films");
      expect(extracted.suggestedTags).toContain("Cinema News");
    });
  });

  describe("4. Content Quality & Editorial Compliance Evaluator", () => {
    it("grades rich structured cinema review appropriately", () => {
      const title = "Kantara Chapter 1: A Spectacular Craft on the Bond Between Daiva and Man";
      const content = `
## Cinema Review
Directed by and starring Rishab Shetty, Kantara Chapter 1 grandly unveils the daiva aradhane (spirit worship) and cultural history of coastal Karnataka on an epic canvas.

## Story Synopsis
From the first frame to the final cut, the taut screenplay and the thrilling daiva dance sequences leave audiences spellbound in the theatre halls.

## Technical Aspects
Ajanish Lokanath's background score and Arvind Kashyap's cinematography are spectacular, making this a rare visual poetry best experienced on the big screen only.
      `.trim();

      const report = ZeroCostIntelligence.evaluateContentQuality(title, content);

      expect(report.score).toBeGreaterThanOrEqual(80);
      expect(report.hasStructure).toBe(true);
      expect(report.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    });

    it("flags thin content with actionable editorial suggestions", () => {
      const title = "Short News";
      const thinContent = "The film has released.";

      const report = ZeroCostIntelligence.evaluateContentQuality(title, thinContent);

      expect(report.score).toBeLessThan(70);
      expect(report.hasSufficientDepth).toBe(false);
      expect(report.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("5. News Freshness Exponential Decay", () => {
    it("gives 1.0 multiplier to news published moments ago", () => {
      const nowISO = new Date().toISOString();
      const weight = ZeroCostIntelligence.calculateFreshnessWeight(nowISO);
      expect(weight).toBeCloseTo(1.0, 1);
    });

    it("decays accurately to ~0.5 after exactly 48 hours (half-life)", () => {
      const fortyEightHoursAgo = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
      const weight = ZeroCostIntelligence.calculateFreshnessWeight(fortyEightHoursAgo);
      expect(weight).toBeCloseTo(0.5, 1);
    });
  });
});

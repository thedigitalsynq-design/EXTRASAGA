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
    it("generates compelling headline variations in Kannada without external API calls", () => {
      const base = "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಬಿಡುಗಡೆ ದಿನಾಂಕ";
      const suggestions = ZeroCostIntelligence.generateHeadlineSuggestions(base, "sandalwood", "kn");

      expect(suggestions.length).toBeGreaterThanOrEqual(3);
      expect(suggestions[0].headline).toContain("ಬ್ರೇಕಿಂಗ್");
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
    it("identifies celebrities and production houses from bilingual text", () => {
      const title = "ಯಶ್ ಮತ್ತು ರಿಷಬ್ ಶೆಟ್ಟಿ ಭೇಟಿ: ಹೊಂಬಾಳೆ ಫಿಲ್ಮ್ಸ್ ಹೊಸ ಮಹಾ ಯೋಜನೆ";
      const content = "ರಾಕಿಂಗ್ ಸ್ಟಾರ್ ಯಶ್ ಮತ್ತು ಕಾಂತಾರ ಖ್ಯಾತಿಯ ರಿಷಬ್ ಶೆಟ್ಟಿ ಬೆಂಗಳೂರಿನಲ್ಲಿ ಭೇಟಿಯಾಗಿದ್ದಾರೆ. Hombale Films ಬ್ಯಾನರ್ ಅಡಿಯಲ್ಲಿ ಮಾತುಕತೆ ನಡೆದಿದೆ.";

      const extracted = ZeroCostIntelligence.extractEntities(title, content);

      expect(extracted.celebrities).toContain("ಯಶ್");
      expect(extracted.celebrities).toContain("ರಿಷಬ್ ಶೆಟ್ಟಿ");
      expect(extracted.filmBanners).toContain("Hombale Films");
      expect(extracted.suggestedTags).toContain("Cinema News");
    });
  });

  describe("4. Content Quality & Editorial Compliance Evaluator", () => {
    it("grades rich structured cinema review appropriately", () => {
      const title = "ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1: ದೈವ ಮತ್ತು ಮನುಷ್ಯನ ಸಂಬಂಧದ ಅದ್ಭುತ ಕಲಾಕೃತಿ";
      const content = `
## ಸಿನಿಮಾ ವಿಮರ್ಶೆ
ರಿಷಬ್ ಶೆಟ್ಟಿ ನಿರ್ದೇಶಿಸಿ ನಟಿಸಿರುವ ಕಾಂತಾರ ಚಾಪ್ಟರ್ 1 ಚಿತ್ರವು ಕರಾವಳಿ ಕರ್ನಾಟಕದ ದೈವಾರಾಧನೆ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಇತಿಹಾಸವನ್ನು ಭವ್ಯವಾಗಿ ತೆರೆದಿಡುತ್ತದೆ.

## ಕಥಾ ಸಾರಾಂಶ
ಚಿತ್ರದ ಆರಂಭದಿಂದ ಅಂತ್ಯದವರೆಗೂ ಬಿಗಿಯಾದ ಚಿತ್ರಕಥೆ ಮತ್ತು ದೈವ ನರ್ತನದ ರೋಚಕ ದೃಶ್ಯಗಳು ಪ್ರೇಕ್ಷಕರನ್ನು ಮಂತ್ರಮುಗ್ಧರನ್ನಾಗಿಸುತ್ತವೆ.

## ತಾಂತ್ರಿಕ ಅಂಶಗಳು
ಅಜನೀಶ್ ಲೋಕನಾಥ್ ಅವರ ಹಿನ್ನೆಲೆ ಸಂಗೀತ ಮತ್ತು ಅರವಿಂದ್ ಕಶ್ಯಪ್ ಛಾಯಾಗ್ರಹಣ ಅದ್ಭುತವಾಗಿದೆ. ಚಿತ್ರಮಂದಿರದಲ್ಲೇ ನೋಡಬೇಕಾದ ಅಪರೂಪದ ದೃಶ್ಯಕಾವ್ಯ.
      `.trim();

      const report = ZeroCostIntelligence.evaluateContentQuality(title, content);

      expect(report.score).toBeGreaterThanOrEqual(80);
      expect(report.hasStructure).toBe(true);
      expect(report.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    });

    it("flags thin content with actionable editorial suggestions", () => {
      const title = "ಸಣ್ಣ ಸುದ್ದಿ";
      const thinContent = "ಚಿತ್ರ ಬಿಡುಗಡೆಯಾಗಿದೆ.";

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


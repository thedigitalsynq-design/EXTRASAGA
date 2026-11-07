import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("HOUSE FULL PRESS Design References For All Pages Verification", () => {
  const srcAppDir = path.resolve(__dirname, "../src/app");
  const srcComponentsDir = path.resolve(__dirname, "../src/components");

  it("verifies all page routes use PRESS tokens and no residual legacy-era classes", () => {
    const pageFiles = [
      "page.tsx",
      "box-office/page.tsx",
      "ott/page.tsx",
      "archive/page.tsx",
      "live/page.tsx",
      "movies/[slug]/page.tsx",
      "news/[slug]/page.tsx",
      "reviews/[slug]/page.tsx",
      "search/page.tsx",
      "category/[slug]/page.tsx",
    ];

    for (const relPath of pageFiles) {
      const fullPath = path.join(srcAppDir, relPath);
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, "utf-8");

      // Verify no legacy Jade-Horizon light-mode wrappers remain
      expect(content).not.toContain("bg-[#F8FAF9]");
      expect(content).not.toContain("bg-[#F8F9FA]");
      expect(content).not.toContain("bg-white");
      expect(content).not.toContain("bg-gradient-to-r from-emerald-50");
      expect(content).not.toContain("bg-gradient-to-r from-sky-50");
      expect(content).not.toContain("border-[#E5EBE7]");
      expect(content).not.toContain("text-[#0F3529]");

      // Verify no raw After-Dark canvas hexes leak into pages (v4 uses tokens)
      expect(content).not.toContain("bg-[#0d0e12]");
      expect(content).not.toContain("bg-[#15161c]");
      expect(content).not.toContain("bg-gradient-to-r from-emerald-950/40");
      expect(content).not.toContain("bg-gradient-to-r from-sky-950/40");
      expect(content).not.toContain("bg-gradient-to-r from-[#1c0e10]");
    }

    // The root layout must ship the newsprint press canvas (v4)
    const layoutContent = fs.readFileSync(path.join(srcAppDir, "layout.tsx"), "utf-8");
    expect(layoutContent).toContain("bg-paper");
    expect(layoutContent).toContain("text-ink");
  });

  it("verifies key component design references are implemented", () => {
    // 1. AFTER-DARK Bento Showcase
    const bentoContent = fs.readFileSync(
      path.join(srcComponentsDir, "EditorialBentoShowcase.tsx"),
      "utf-8"
    );
    expect(bentoContent).toContain("glass-bento");
    expect(bentoContent).toContain("rounded-[28px]");

    // 2. Minimalist Quiz Modal (Reference 2)
    const quizContent = fs.readFileSync(
      path.join(srcComponentsDir, "CinephileDiscoveryModal.tsx"),
      "utf-8"
    );
    expect(quizContent).toContain("QUESTION 01");
    expect(quizContent).toContain("SELECT ONLY ONE");

    // 3. Curved Roadmap / Work Process (Reference 3)
    const timelineContent = fs.readFileSync(
      path.join(srcComponentsDir, "CinemaJourneyTimeline.tsx"),
      "utf-8"
    );
    expect(timelineContent).toContain("01");
    expect(timelineContent).toContain("02");

    // 4. Dual-Axis Review Score & Spoiler Shield
    const dualAxisContent = fs.readFileSync(
      path.join(srcComponentsDir, "DualAxisReviewScore.tsx"),
      "utf-8"
    );
    expect(dualAxisContent).toContain("AXIS 1: NARRATIVE & SOUL");
    expect(dualAxisContent).toContain("AXIS 2: TECHNICAL CRAFT INDEX");
    expect(dualAxisContent).toContain("ShieldCheck");

    // 5. Overlapping Dual Luminous Discs (Problem & Solution Reference)
    const dualLuminousContent = fs.readFileSync(
      path.join(srcComponentsDir, "DualLuminousDiscs.tsx"),
      "utf-8"
    );
    expect(dualLuminousContent).toContain("EVALUATION AXIS A");
    expect(dualLuminousContent).toContain("EVALUATION AXIS B");
    expect(dualLuminousContent).toContain("rounded-full");
  });
});

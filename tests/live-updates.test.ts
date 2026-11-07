import { describe, it, expect } from "vitest";
import { LIVE_CINEMA_UPDATES } from "../src/data/liveUpdatesData";

describe("Real-Time Live Cinema Updates Engine", () => {
  it("should have English-only verified live updates for all 6 cinema industries", () => {
    const requiredIndustries = [
      "sandalwood",
      "tollywood",
      "kollywood",
      "mollywood",
      "bollywood",
      "hollywood",
    ] as const;

    requiredIndustries.forEach((industry) => {
      const updates = LIVE_CINEMA_UPDATES.filter((u) => u.industry === industry);
      expect(updates.length).toBeGreaterThan(0);
      updates.forEach((item) => {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.timestamp).toBeTruthy();
        expect(item.source).toBeTruthy();
        expect(item.industry).toBe(industry);
        // Unified English-only platform: edition artifacts ship as "en";
        // the film-language fact (Kannada/Telugu/...) is carried by the industry rail.
        expect(item.language).toBe("en");
        expect(item.verified).toBe(true);
        expect(item.badgeText).toBeTruthy();
      });
    });
  });

  it("should have correct factual details for major upcoming and recent releases", () => {
    // Kantara Chapter 1
    const kantara = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-kn-1");
    expect(kantara?.source).toContain("Hombale");
    expect(kantara?.industry).toBe("sandalwood");

    // Toxic
    const toxic = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-kn-2");
    expect(toxic?.title).toContain("Yash");
    expect(toxic?.title).toContain("Toxic");

    // Pushpa 2
    const pushpa = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-te-1");
    expect(pushpa?.title).toContain("Pushpa 2");
    expect(pushpa?.industry).toBe("tollywood");

    // Coolie
    const coolie = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-ta-1");
    expect(coolie?.title).toContain("Coolie");
    expect(coolie?.industry).toBe("kollywood");

    // Empuraan
    const empuraan = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-ml-1");
    expect(empuraan?.title).toContain("Empuraan");
    expect(empuraan?.industry).toBe("mollywood");

    // Stree 2
    const stree = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-hi-1");
    expect(stree?.title).toContain("Stree 2");
    expect(stree?.industry).toBe("bollywood");

    // Deadpool & Wolverine
    const deadpool = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-en-1");
    expect(deadpool?.title).toContain("Deadpool & Wolverine");
    expect(deadpool?.industry).toBe("hollywood");
  });
});

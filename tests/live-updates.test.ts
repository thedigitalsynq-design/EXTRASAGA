import { describe, it, expect } from "vitest";
import { LIVE_CINEMA_UPDATES } from "../src/data/liveUpdatesData";
import { LanguageCode } from "../src/types";

describe("Real-Time Live Cinema Updates Engine", () => {
  it("should have verified live updates for all 6 cinema industries", () => {
    const requiredLanguages: LanguageCode[] = ["kn", "te", "ta", "ml", "hi", "en"];

    requiredLanguages.forEach((lang) => {
      const updates = LIVE_CINEMA_UPDATES.filter((u) => u.language === lang);
      expect(updates.length).toBeGreaterThan(0);
      updates.forEach((item) => {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.timestamp).toBeTruthy();
        expect(item.source).toBeTruthy();
        expect(item.industry).toBeTruthy();
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
    expect(toxic?.title).toContain("ಯಶ್");
    expect(toxic?.title).toContain("ಟಾಕ್ಸಿಕ್");

    // Pushpa 2
    const pushpa = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-te-1");
    expect(pushpa?.title).toContain("పుష్ప 2");
    expect(pushpa?.industry).toBe("tollywood");

    // Coolie
    const coolie = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-ta-1");
    expect(coolie?.title).toContain("கூலி");
    expect(coolie?.industry).toBe("kollywood");

    // Empuraan
    const empuraan = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-ml-1");
    expect(empuraan?.title).toContain("എമ്പുരാൻ");
    expect(empuraan?.industry).toBe("mollywood");

    // Stree 2
    const stree = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-hi-1");
    expect(stree?.title).toContain("स्त्री 2");
    expect(stree?.industry).toBe("bollywood");

    // Deadpool & Wolverine
    const deadpool = LIVE_CINEMA_UPDATES.find((u) => u.id === "live-en-1");
    expect(deadpool?.title).toContain("Deadpool & Wolverine");
    expect(deadpool?.industry).toBe("hollywood");
  });
});


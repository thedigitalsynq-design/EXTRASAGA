import { describe, expect, it } from "vitest";
import { canFetch, createRobotsChecker } from "@/lib/ingest/robots";

const ROBOTS = [
  "User-agent: *",
  "Disallow: /private/",
  "Allow: /news/",
].join("\n");

describe("robots", () => {
  it("allows permitted paths and blocks disallowed paths", () => {
    expect(canFetch("https://example.com/news/a", ROBOTS, "ExtraSaagaBot")).toBe(true);
    expect(canFetch("https://example.com/private/a", ROBOTS, "ExtraSaagaBot")).toBe(false);
  });

  it("proceeds when robots.txt is unavailable", () => {
    expect(canFetch("https://example.com/news/a", null, "ExtraSaagaBot")).toBe(true);
  });

  it("caches robots.txt per origin", async () => {
    let calls = 0;
    const checker = createRobotsChecker(
      {
        fetchText: async () => {
          calls += 1;
          return ROBOTS;
        },
      },
      "ExtraSaagaBot",
    );
    await checker.isAllowed("https://example.com/news/a", "ExtraSaagaBot");
    await checker.isAllowed("https://example.com/news/b", "ExtraSaagaBot");
    expect(calls).toBe(1);
  });
});

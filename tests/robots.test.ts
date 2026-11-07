import { describe, expect, it } from "vitest";
import { canFetch, createRobotsChecker } from "@/lib/ingest/robots";

const ROBOTS = [
  "User-agent: *",
  "Disallow: /private/",
  "Allow: /news/",
].join("\n");

describe("robots", () => {
  it("allows permitted paths and blocks disallowed paths", () => {
    expect(canFetch("https://example.com/news/a", ROBOTS, "SiniKannadaBot")).toBe(true);
    expect(canFetch("https://example.com/private/a", ROBOTS, "SiniKannadaBot")).toBe(false);
  });

  it("proceeds when robots.txt is unavailable", () => {
    expect(canFetch("https://example.com/news/a", null, "SiniKannadaBot")).toBe(true);
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
      "SiniKannadaBot",
    );
    await checker.isAllowed("https://example.com/news/a", "SiniKannadaBot");
    await checker.isAllowed("https://example.com/news/b", "SiniKannadaBot");
    expect(calls).toBe(1);
  });
});

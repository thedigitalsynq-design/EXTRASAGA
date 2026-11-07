import { describe, expect, it, vi } from "vitest";
import { assertAllowedUrl, createPoliteFetcher } from "@/lib/ingest/fetcher";

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, { status, headers: { "content-type": "text/html" } });
}

describe("assertAllowedUrl", () => {
  it("accepts an allowed HTTPS host", () => {
    expect(assertAllowedUrl("https://kannada.filmibeat.com/news/a.html", ["filmibeat.com"])).toBeInstanceOf(URL);
  });

  it("rejects http, credentials, non-standard ports, and unknown hosts", () => {
    expect(() => assertAllowedUrl("http://kannada.filmibeat.com/a", ["filmibeat.com"])).toThrow(/https/i);
    expect(() => assertAllowedUrl("https://user:pass@kannada.filmibeat.com/a", ["filmibeat.com"])).toThrow(/credentials/i);
    expect(() => assertAllowedUrl("https://kannada.filmibeat.com:8443/a", ["filmibeat.com"])).toThrow(/port/i);
    expect(() => assertAllowedUrl("https://evil.example/a", ["filmibeat.com"])).toThrow(/not allowed/i);
    expect(() => assertAllowedUrl("https://127.0.0.1/a", ["127.0.0.1"])).toThrow(/private/i);
  });

  it("rejects IPv6 loopback, IPv4-mapped loopback, lookalike hosts, and CGNAT", () => {
    expect(() => assertAllowedUrl("https://[::1]/a", ["[::1]"])).toThrow(/private/i);
    expect(() => assertAllowedUrl("https://[::ffff:127.0.0.1]/a", ["[::ffff:127.0.0.1]"])).toThrow(/private/i);
    expect(() => assertAllowedUrl("https://example.com.evil.com/a", ["example.com"])).toThrow(/not allowed/i);
    expect(() => assertAllowedUrl("https://100.64.0.1/a", ["100.64.0.1"])).toThrow(/private/i);
  });
});

describe("createPoliteFetcher", () => {
  it("returns text and sends the bot user agent", async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      expect((init?.headers as Record<string, string>)["User-Agent"]).toContain("SiniKannadaBot");
      return htmlResponse("ok");
    });
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
    });
    await expect(fetcher.fetchText("https://example.com/a")).resolves.toBe("ok");
  });

  it("retries one transient failure", async () => {
    let calls = 0;
    const fetchImpl = vi.fn(async () => {
      calls += 1;
      return calls === 1 ? htmlResponse("busy", 503) : htmlResponse("ok");
    });
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
      sleep: async () => undefined,
      now: () => 0,
    });
    await expect(fetcher.fetchText("https://example.com/a")).resolves.toBe("ok");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("waits between requests to the same host", async () => {
    const sleeps: number[] = [];
    let clock = 0;
    const fetchImpl = vi.fn(async () => htmlResponse("ok"));
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 1000,
      sleep: async (ms) => {
        sleeps.push(ms);
        clock += ms;
      },
      now: () => clock,
    });
    await fetcher.fetchText("https://example.com/a");
    await fetcher.fetchText("https://example.com/b");
    expect(sleeps).toContain(1000);
  });

  it("does not follow a redirect to a disallowed host", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(null, { status: 302, headers: { location: "https://evil.example/x" } }),
    );
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
    });
    await expect(fetcher.fetchText("https://example.com/a")).rejects.toThrow(/not allowed/i);
  });

  it("does not retry when the per-call budget is already spent", async () => {
    const fetchImpl = vi.fn(async () => htmlResponse("busy", 503));
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
      retryBudgetMs: 0,
      sleep: async () => undefined,
      now: () => 0,
    });
    await expect(fetcher.fetchText("https://example.com/a")).rejects.toThrow(/status 503/i);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("grants each fetchText call its own retry budget", async () => {
    let clock = 0;
    let attempt = 0;
    const fetchImpl = vi.fn(async () => {
      attempt += 1;
      if (attempt === 1) {
        clock += 6000;
        return htmlResponse("busy", 503);
      }
      if (attempt === 2) {
        clock += 10;
        return htmlResponse("busy", 503);
      }
      return htmlResponse("ok");
    });
    const fetcher = createPoliteFetcher({
      userAgent: "SiniKannadaBot/1.0",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      allowedHosts: ["example.com"],
      minDelayMs: 0,
      retryBudgetMs: 5000,
      sleep: async (ms) => {
        clock += ms;
      },
      now: () => clock,
    });
    await expect(fetcher.fetchText("https://example.com/a")).rejects.toThrow(/status 503/i);
    await expect(fetcher.fetchText("https://example.com/b")).resolves.toBe("ok");
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });
});

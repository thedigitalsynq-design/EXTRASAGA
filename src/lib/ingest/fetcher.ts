export interface PoliteFetcher {
  fetchText(url: string): Promise<string>;
}

export interface PoliteFetcherOptions {
  userAgent: string;
  allowedHosts: string[];
  fetchImpl?: typeof fetch;
  minDelayMs?: number;
  timeoutMs?: number;
  retryBudgetMs?: number;
  maxBytes?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
}

interface Attempt {
  ok: boolean;
  status: number;
  text: string;
  retryAfter: string | null;
}

function ipv4Octets(host: string): [number, number, number, number] | null {
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return null;
  const octets = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
  if (octets.some((octet) => octet > 255)) return null;
  return octets as [number, number, number, number];
}

function isPrivateIpv4(host: string): boolean {
  const octets = ipv4Octets(host);
  if (!octets) return false;
  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 240
  );
}

function mappedIpv4(tail: string): string | null {
  if (tail.includes(".")) return ipv4Octets(tail) ? tail : null;
  const hex = tail.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (!hex) return null;
  const high = Number.parseInt(hex[1], 16);
  const low = Number.parseInt(hex[2], 16);
  return `${high >> 8}.${high & 0xff}.${low >> 8}.${low & 0xff}`;
}

function isPrivateIpv6(bare: string): boolean {
  if (bare === "::" || bare === "::1") return true;
  const mapped = bare.match(/^::ffff:(.+)$/);
  if (mapped) {
    const ipv4 = mappedIpv4(mapped[1]);
    return ipv4 !== null && isPrivateIpv4(ipv4);
  }
  const firstGroup = bare.split(":")[0];
  const first = Number.parseInt(firstGroup, 16);
  if (Number.isFinite(first) && first >= 0xfe80 && first <= 0xfebf) return true;
  return firstGroup.startsWith("fc") || firstGroup.startsWith("fd");
}

function isPrivateHost(host: string): boolean {
  const bare = host.replace(/^\[/, "").replace(/\]$/, "");
  if (bare === "localhost" || bare.endsWith(".localhost")) return true;
  if (bare.includes(":")) return isPrivateIpv6(bare);
  return isPrivateIpv4(bare);
}

export function assertAllowedUrl(rawUrl: string, allowedHosts: string[]): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`Only https URLs are allowed: ${rawUrl}`);
  }
  if (url.username || url.password) {
    throw new Error(`Credentials are not allowed in URLs: ${rawUrl}`);
  }
  if (url.port && url.port !== "443") {
    throw new Error(`Non-standard ports are not allowed: ${rawUrl}`);
  }
  const host = url.hostname.toLowerCase();
  if (isPrivateHost(host)) {
    throw new Error(`Private hosts are not allowed: ${host}`);
  }
  const allowed = allowedHosts.some((entry) => {
    const base = entry.toLowerCase();
    return host === base || host.endsWith(`.${base}`);
  });
  if (!allowed) {
    throw new Error(`Host not allowed: ${host}`);
  }
  return url;
}

function parseRetryAfter(value: string | null): number {
  if (!value) return 0;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, 10_000);
  const date = Date.parse(value);
  if (Number.isFinite(date)) return Math.min(Math.max(date - Date.now(), 0), 10_000);
  return 0;
}

export function createPoliteFetcher(options: PoliteFetcherOptions): PoliteFetcher {
  const fetchImpl = options.fetchImpl ?? fetch;
  const minDelayMs = options.minDelayMs ?? 1000;
  const timeoutMs = options.timeoutMs ?? 5000;
  const retryBudgetMs = options.retryBudgetMs ?? 5000;
  const maxBytes = options.maxBytes ?? 2_000_000;
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const now = options.now ?? Date.now;
  const lastByHost = new Map<string, number>();

  async function throttle(host: string): Promise<void> {
    const last = lastByHost.get(host);
    if (last !== undefined) {
      const wait = last + minDelayMs - now();
      if (wait > 0) await sleep(wait);
    }
    lastByHost.set(host, now());
  }

  async function request(rawUrl: string, deadline: number): Promise<Attempt> {
    let current = assertAllowedUrl(rawUrl, options.allowedHosts);
    for (let redirects = 0; redirects <= 3; redirects += 1) {
      await throttle(current.hostname);
      const remaining = deadline - now();
      const response = await fetchImpl(current.toString(), {
        method: "GET",
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(Math.max(1, Math.min(timeoutMs, remaining))),
        headers: {
          "User-Agent": options.userAgent,
          "Accept-Language": "kn-IN,kn;q=0.9,en;q=0.5",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) throw new Error(`Redirect without location: ${current.toString()}`);
        current = assertAllowedUrl(new URL(location, current).toString(), options.allowedHosts);
        continue;
      }

      const text = await response.text();
      if (text.length > maxBytes) {
        throw new Error(`Response too large (${text.length} bytes): ${current.toString()}`);
      }
      return {
        ok: response.ok,
        status: response.status,
        text,
        retryAfter: response.headers.get("retry-after"),
      };
    }
    throw new Error(`Too many redirects: ${rawUrl}`);
  }

  return {
    async fetchText(rawUrl: string): Promise<string> {
      const startedAt = now();
      const deadline = startedAt + retryBudgetMs;
      let retried = false;
      while (true) {
        const attempt = await request(rawUrl, deadline);
        if (attempt.ok) return attempt.text;
        const transient = attempt.status === 429 || attempt.status >= 500;
        if (!transient || retried || now() >= deadline) {
          throw new Error(`Fetch failed with status ${attempt.status}: ${rawUrl}`);
        }
        const delay = Math.min(
          Math.max(1000, parseRetryAfter(attempt.retryAfter)),
          Math.max(0, deadline - now()),
        );
        await sleep(delay);
        retried = true;
      }
    },
  };
}

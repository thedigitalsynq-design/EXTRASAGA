/**
 * Returns the fully qualified site URL dynamically based on environment.
 * Prioritizes custom domain (NEXT_PUBLIC_SITE_URL), then Vercel preview URL,
 * then defaults to localhost:3000 for local development.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}


/** @type {import('next').NextConfig} */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://images.unsplash.com https://upload.wikimedia.org https://i.ytimg.com https://img.youtube.com https://image.tmdb.org https://*.supabase.co https://placehold.co;
  font-src 'self' data: https://fonts.gstatic.com;
  frame-src 'self' https://www.youtube.com https://youtube.com;
  connect-src 'self' https://*.supabase.co;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
];

const isExport = process.env.NEXT_EXPORT === "true" || process.env.GITHUB_ACTIONS === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS === "true" ? "/EXTRASAGA" : "");

const nextConfig = {
  ...(isExport ? { output: "export" } : {}),
  ...(basePath ? { basePath } : {}),
  trailingSlash: isExport,
  eslint: {
    ignoreDuringBuilds: true,
  },
  optimizeFonts: false,
  compress: true,
  poweredByHeader: false,
  images: {
    ...(isExport ? { unoptimized: true } : {}),
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  ...(isExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
          ];
        },
      }),
};

export default nextConfig;

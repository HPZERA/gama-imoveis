import type { NextConfig } from "next";

const SUPABASE_ORIGIN = "https://hpqmzsqtzrpzanqtkcbf.supabase.co";

// Hosts do Google Analytics (GA4) e Meta Pixel — só chamados quando as
// respectivas env vars (NEXT_PUBLIC_GA_MEASUREMENT_ID / NEXT_PUBLIC_META_PIXEL_ID)
// estiverem configuradas, mas o CSP precisa liberar os hosts de antemão.
const ANALYTICS_SCRIPT_HOSTS = "https://www.googletagmanager.com https://connect.facebook.net";
const ANALYTICS_CONNECT_HOSTS = "https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com";
const ANALYTICS_IMG_HOSTS = "https://www.facebook.com https://www.google-analytics.com";

const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' no script-src: o layout injeta um <script type="application/ld+json">
  // estático (dados da empresa, sem input de usuário) e o Next injeta scripts inline de
  // hidratação. Sem isso a página não renderiza. Ainda bloqueia scripts de outras origens.
  `script-src 'self' 'unsafe-inline' ${ANALYTICS_SCRIPT_HOSTS}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://images.unsplash.com https://plus.unsplash.com https://randomuser.me https://ui-avatars.com https://www.gamaimoveissg.com.br ${SUPABASE_ORIGIN} ${ANALYTICS_IMG_HOSTS}`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_ORIGIN} ${ANALYTICS_CONNECT_HOSTS}`,
  `media-src 'self' ${SUPABASE_ORIGIN}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["sharp"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  images: {
    minimumCacheTTL: 3600,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 100],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384, 640],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gamaimoveissg.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "hpqmzsqtzrpzanqtkcbf.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// Vercel's Image Optimization CDN caches each transformed (avif/webp) variant
// of a source URL independently of the origin file's own Cache-Control.
// `minimumCacheTTL` was set to 1 year, so when a source photo was corrected
// in Supabase Storage (same filename), every browser kept being served the
// old cached transform for up to a year. Appending a version marker changes
// the URL Next/Image uses as its cache key, forcing a fresh fetch+transform.
//
// Bump CACHE_BUST_VERSION whenever a batch of already-referenced photos is
// corrected in place (same filename, new bytes) and needs to show up
// immediately instead of waiting out minimumCacheTTL.
const CACHE_BUST_VERSION = "20260706a";

export function withCacheBust(url: string): string {
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${CACHE_BUST_VERSION}`;
}

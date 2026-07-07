// Limitador em memória, por IP, best-effort. Funções serverless da Vercel
// são efêmeras e podem escalar em múltiplas instâncias, então isto é uma
// segunda camada de defesa (contra brute force/spam ingênuo) — a camada
// autoritativa deve ser um WAF/rate limit de borda (ex: Cloudflare).
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

export function clientIp(req: Request): string {
  const headers = (req as { headers: Headers }).headers;
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

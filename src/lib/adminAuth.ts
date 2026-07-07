import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isRateLimited as isRateLimitedGeneric, resetRateLimit as resetRateLimitGeneric } from "@/lib/rateLimit";

// Sessão de admin assinada por HMAC, sem depender do @supabase/ssr — a
// remoção do cookie de sessão do Supabase (ver AGENTS.md/histórico do painel)
// veio de um bug de serialização (ByteString/BOM) daquela lib, não de uma
// escolha de segurança. Este token é puro ASCII (base64url), então nunca
// esbarra naquele problema.
export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8h

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET não configurada no ambiente");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_SECONDS * 1000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  let expectedBuf: Buffer;
  let signatureBuf: Buffer;
  try {
    expectedBuf = Buffer.from(sign(payload));
    signatureBuf = Buffer.from(signature);
  } catch {
    return false;
  }
  if (signatureBuf.length !== expectedBuf.length || !timingSafeEqual(signatureBuf, expectedBuf)) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

// Para uso em Route Handlers / Server Actions (app router) via next/headers.
export async function requireAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 min

export function isRateLimited(ip: string): boolean {
  return isRateLimitedGeneric(`login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
}

export function resetRateLimit(ip: string): void {
  resetRateLimitGeneric(`login:${ip}`);
}

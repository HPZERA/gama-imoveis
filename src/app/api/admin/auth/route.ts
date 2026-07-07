import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
  createSessionToken,
  isRateLimited,
  resetRateLimit,
} from "@/lib/adminAuth";

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429 }
    );
  }

  const { email, password } = await req.json();

  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (email === validEmail && password === validPassword) {
    resetRateLimit(ip);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), ADMIN_SESSION_COOKIE_OPTIONS);
    return res;
  }

  return NextResponse.json({ ok: false, error: "E-mail ou senha incorretos" }, { status: 401 });
}

import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";

// Único ponto de verdade da autenticação do painel: redireciona páginas
// /admin/* não autenticadas para o login, e devolve 401 para chamadas de
// API /api/admin/* sem sessão válida. Cada rota /api/admin/* também
// revalida a sessão internamente (defesa em profundidade — a doc do Next
// alerta que um matcher mal ajustado pode silenciosamente parar de cobrir
// uma rota).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/auth", "/api/admin/logout"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = verifySessionToken(token);

  if (!authenticated) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

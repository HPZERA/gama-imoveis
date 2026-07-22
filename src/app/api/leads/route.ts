import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited, clientIp } from "@/lib/rateLimit";
import { notifyNewLead } from "@/lib/notifications";

const MAX_LEN = {
  name: 120,
  whatsapp: 20,
  email: 200,
  message: 2000,
  source: 40,
};

function isNonEmptyString(v: unknown, maxLen: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= maxLen;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  // 8 envios a cada 10 minutos por IP — generoso para um usuário real,
  // suficiente para conter flood de bot simples.
  if (isRateLimited(`lead:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  // Honeypot: campo invisível para humanos; só bots costumam preenchê-lo.
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!isNonEmptyString(body.name, MAX_LEN.name) || !isNonEmptyString(body.whatsapp, MAX_LEN.whatsapp)) {
    return NextResponse.json({ error: "Nome e WhatsApp são obrigatórios" }, { status: 400 });
  }
  if (body.email !== undefined && body.email !== null && body.email !== "" && !isNonEmptyString(body.email, MAX_LEN.email)) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }
  if (body.message !== undefined && body.message !== null && body.message !== "" && !isNonEmptyString(body.message, MAX_LEN.message)) {
    return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
  }
  const source = isNonEmptyString(body.source, MAX_LEN.source) ? body.source : "site";

  const lead = {
    name: (body.name as string).trim(),
    whatsapp: (body.whatsapp as string).trim(),
    email: (body.email as string | undefined)?.trim() || null,
    message: (body.message as string | undefined)?.trim() || null,
    source,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert(lead);

  if (error) {
    console.error("Erro ao salvar lead:", error.message);
    return NextResponse.json({ error: "Não foi possível enviar sua mensagem" }, { status: 500 });
  }

  // Roda depois da resposta ser enviada ao usuário, sem atrasar o formulário.
  after(() => notifyNewLead(lead));

  return NextResponse.json({ ok: true });
}

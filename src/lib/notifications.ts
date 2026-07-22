// Avisa a equipe (e-mail + WhatsApp) quando um lead novo chega pelo site.
// Cada canal é opcional e silenciosamente ignorado se as variáveis de
// ambiente correspondentes não estiverem configuradas — nunca deve derrubar
// o envio do lead em si (por isso os erros só vão pro log do servidor).

type NewLead = {
  name: string;
  whatsapp: string;
  email: string | null;
  message: string | null;
  source: string;
};

async function sendEmailNotification(lead: NewLead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.RESEND_FROM_EMAIL || "Gama Imóveis <onboarding@resend.dev>";
  const html = `
    <h2>Novo lead pelo site</h2>
    <p><strong>Nome:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(lead.whatsapp)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(lead.email || "não informado")}</p>
    <p><strong>Origem:</strong> ${escapeHtml(lead.source)}</p>
    ${lead.message ? `<p><strong>Mensagem:</strong><br>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>` : ""}
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Novo lead: ${lead.name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Falha ao enviar e-mail de notificação de lead:", res.status, await res.text());
  }
}

async function sendWhatsAppNotification(lead: NewLead) {
  const instance = process.env.ZAPI_INSTANCE_ID;
  const token = process.env.ZAPI_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;
  const notifyNumber = process.env.LEAD_NOTIFY_WHATSAPP;
  if (!instance || !token || !notifyNumber) return;

  const text = [
    "📩 Novo lead pelo site",
    `Nome: ${lead.name}`,
    `WhatsApp: ${lead.whatsapp}`,
    lead.email ? `E-mail: ${lead.email}` : null,
    `Origem: ${lead.source}`,
    lead.message ? `Mensagem: ${lead.message}` : null,
  ].filter(Boolean).join("\n");

  const res = await fetch(`https://api.z-api.io/instances/${instance}/token/${token}/send-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(clientToken ? { "Client-Token": clientToken } : {}),
    },
    body: JSON.stringify({ phone: notifyNumber, message: text }),
  });

  if (!res.ok) {
    console.error("Falha ao enviar WhatsApp de notificação de lead:", res.status, await res.text());
  }
}

export async function notifyNewLead(lead: NewLead) {
  const results = await Promise.allSettled([sendEmailNotification(lead), sendWhatsAppNotification(lead)]);
  for (const r of results) {
    if (r.status === "rejected") console.error("Erro ao notificar lead:", r.reason);
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

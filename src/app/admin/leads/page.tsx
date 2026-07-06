import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/AdminShell";
import { Users } from "lucide-react";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-charcoal font-display">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{leads?.length ?? 0} contatos capturados</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {leads && leads.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-charcoal">{lead.name}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                        {lead.source === "contact-form" ? "Formulário" : "WhatsApp"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm">
                    <a
                      href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {lead.whatsapp}
                    </a>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="text-gray-500 hover:underline">
                        {lead.email}
                      </a>
                    )}
                  </div>
                  {lead.message && (
                    <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-2">
                      {lead.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Users size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Nenhum lead capturado ainda.</p>
              <p className="text-gray-300 text-xs mt-1">Os leads aparecem aqui quando alguém preencher o popup do site.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

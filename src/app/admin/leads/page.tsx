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
            <>
              <div className="grid grid-cols-3 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <span>Nome</span>
                <span>WhatsApp</span>
                <span>Data</span>
              </div>
              <div className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <div key={lead.id} className="grid grid-cols-3 px-6 py-4 hover:bg-gray-50 transition-colors items-center">
                    <span className="text-sm font-medium text-charcoal">{lead.name}</span>
                    <a
                      href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand hover:underline"
                    >
                      {lead.whatsapp}
                    </a>
                    <span className="text-sm text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </>
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

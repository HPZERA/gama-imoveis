import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/AdminShell";
import { Home, Users, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const [{ count: totalImoveis }, { count: totalAtivos }, { count: totalLeads }] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("leads").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total de Imóveis", value: totalImoveis ?? 0, icon: Home, color: "bg-brand/10 text-brand" },
    { label: "Imóveis Ativos", value: totalAtivos ?? 0, icon: Eye, color: "bg-green-100 text-green-600" },
    { label: "Leads Capturados", value: totalLeads ?? 0, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Taxa de Ativação", value: totalImoveis ? `${Math.round(((totalAtivos ?? 0) / totalImoveis) * 100)}%` : "0%", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <AdminShell>
      <div className="p-3 md:p-6 max-w-5xl mx-auto">
        <div className="mb-5 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-charcoal font-display">Dashboard</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">Visão geral do site</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 md:mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-3 md:p-5 border border-gray-100">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-2 md:mb-3 ${color}`}>
                <Icon size={16} strokeWidth={2} />
              </div>
              <div className="text-xl md:text-2xl font-bold text-charcoal">{value}</div>
              <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-charcoal">Últimos Leads</h2>
              <Link href="/admin/leads" className="text-xs text-brand hover:underline">Ver todos</Link>
            </div>
            {recentLeads && recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.whatsapp}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">Nenhum lead ainda</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
            <h2 className="font-semibold text-charcoal mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Link href="/admin/imoveis/novo" className="flex items-center gap-3 p-3 bg-brand/5 hover:bg-brand/10 rounded-xl transition-colors">
                <Home size={18} className="text-brand" />
                <span className="text-sm font-medium text-charcoal">Adicionar novo imóvel</span>
              </Link>
              <Link href="/admin/imoveis" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <Eye size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-charcoal">Ver todos os imóveis</span>
              </Link>
              <Link href="/admin/leads" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <Users size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-charcoal">Ver leads capturados</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

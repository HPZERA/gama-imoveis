import AdminShell from "@/components/AdminShell";
import PropertyForm from "@/components/admin/PropertyForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NovoImovel() {
  return (
    <AdminShell>
      <div className="p-3 md:p-6 max-w-3xl mx-auto">
        <Link href="/admin/imoveis" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-charcoal mb-6 transition-colors">
          <ChevronLeft size={16} />
          Voltar para imóveis
        </Link>
        <h1 className="text-2xl font-bold text-charcoal font-display mb-6">Novo Imóvel</h1>
        <PropertyForm />
      </div>
    </AdminShell>
  );
}

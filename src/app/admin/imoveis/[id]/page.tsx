import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/AdminShell";
import PropertyForm from "@/components/admin/PropertyForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditarImovel({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: property } = await supabase.from("properties").select("*").eq("id", id).single();

  if (!property) notFound();

  return (
    <AdminShell>
      <div className="p-3 md:p-6 max-w-3xl mx-auto">
        <Link href="/admin/imoveis" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-charcoal mb-6 transition-colors">
          <ChevronLeft size={16} />
          Voltar para imóveis
        </Link>
        <h1 className="text-2xl font-bold text-charcoal font-display mb-6">Editar Imóvel</h1>
        <PropertyForm property={property} />
      </div>
    </AdminShell>
  );
}

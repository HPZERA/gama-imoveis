import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/PropertyCard";

/**
 * "Outros imóveis" section shown on every property detail page.
 * Respects the catalog filter the visitor came from (?tipo=all|venda|aluguel);
 * falls back to the current property's own type when accessed directly.
 */
export default async function OtherProperties({
  currentId,
  currentType,
  tipoParam,
}: {
  currentId: string | number;
  currentType: "venda" | "aluguel";
  tipoParam?: string;
}) {
  const effectiveType: "venda" | "aluguel" | null =
    tipoParam === "venda" || tipoParam === "aluguel"
      ? tipoParam
      : tipoParam === "all"
      ? null
      : currentType;

  const supabase = await createClient();
  let query = supabase
    .from("properties")
    .select("*")
    .eq("active", true)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (effectiveType) query = query.eq("type", effectiveType);

  const { data: properties } = await query;

  if (!properties || properties.length === 0) return null;

  const linkTipo = effectiveType ?? "all";

  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-charcoal font-display mb-6">
        Outros imóveis
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((p) => (
          <PropertyCard key={p.id} p={p} showCategory linkTipo={linkTipo} />
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedProperties } from "@/lib/properties";
import PropertyCard from "@/components/PropertyCard";

const SEE_MORE_LABEL: Record<"all" | "venda" | "aluguel", string> = {
  all: "Ver mais imóveis",
  venda: "Ver mais imóveis de compra",
  aluguel: "Ver mais imóveis de aluguel",
};

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

  const { properties, count } = await getRelatedProperties(currentId, effectiveType);

  if (properties.length === 0) return null;

  const linkTipo = effectiveType ?? "all";
  const seeMoreHref = linkTipo === "all" ? "/imoveis" : `/imoveis?tipo=${linkTipo}`;
  const hasMore = (count ?? 0) > properties.length;

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
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Link
            href={seeMoreHref}
            className="inline-flex items-center gap-2 border-2 border-brand text-brand hover:bg-brand hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
          >
            {SEE_MORE_LABEL[linkTipo]}
            <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  );
}

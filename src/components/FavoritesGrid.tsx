"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import type { DbProperty } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoritesGrid({ properties }: { properties: DbProperty[] }) {
  const { ids } = useFavorites();
  const favorites = properties.filter((p) => ids.some((id) => String(id) === String(p.id)));

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-20">
        <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-5">
          <Heart size={26} className="text-brand" />
        </div>
        <h2 className="text-xl font-bold text-charcoal font-display mb-2">
          Você ainda não tem favoritos
        </h2>
        <p className="text-gray-text text-sm max-w-sm mb-6">
          Toque no coração de qualquer imóvel para salvá-lo aqui e comparar depois.
        </p>
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-charcoal font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        >
          Ver imóveis disponíveis
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {favorites.map((p) => (
        <PropertyCard key={p.id} p={p} showCategory />
      ))}
    </div>
  );
}

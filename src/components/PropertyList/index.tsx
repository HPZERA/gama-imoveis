"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { BedDouble, Bath, Square, MapPin, ArrowRight, Search, ArrowUpDown, X } from "lucide-react";
import type { DbProperty } from "@/types";
import { salePrices, rentPrices } from "@/lib/searchOptions";

function formatPrice(price: number | null, label: string | null, type: "venda" | "aluguel") {
  if (label) return label;
  if (!price) return "Consulte";
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
  return type === "aluguel" ? `${formatted}/mês` : formatted;
}

function PropertyCard({ p, priority, showCategory }: { p: DbProperty; priority?: boolean; showCategory?: boolean }) {
  const imgs = p.images?.length ? p.images : [];

  return (
    <Link
      href={`/imoveis/${p.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300 group flex flex-col"
    >
      <div className="relative h-56 flex-shrink-0 bg-gray-100">
        {imgs.length > 0 ? (
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            loop={imgs.length > 1}
            touchStartPreventDefault={false}
            simulateTouch={false}
            className="property-swiper h-full md:pointer-events-none"
          >
            {imgs.map((img, i) => (
              <SwiperSlide key={i} className="relative h-full">
                <Image
                  src={img}
                  alt={`${p.title} - foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={priority && i === 0}
                  loading={priority && i === 0 ? undefined : "lazy"}
                  placeholder="blur"
                  blurDataURL="data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoIAAUAAUAmJYgCdAEO/gHOAAA="
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-sm">Sem foto</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm ${
              p.type === "venda"
                ? "bg-charcoal/90 text-white"
                : "bg-brand text-charcoal"
            }`}
          >
            {p.type === "venda" ? "Venda" : "Aluguel"}
          </span>
          {showCategory && p.category && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm bg-white/90 text-charcoal">
              {p.category}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-2xl font-bold text-charcoal font-display leading-tight mb-2">
          {formatPrice(p.price, p.price_label, p.type)}
        </p>
        <h3 className="text-base font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-brand transition-colors">
          {p.title}
        </h3>
        {(p.neighborhood || p.city) && (
          <div className="flex items-center gap-1.5 text-gray-text text-sm mb-4">
            <MapPin size={13} className="text-brand flex-shrink-0" />
            <span>{[p.neighborhood, p.city].filter(Boolean).join(", ")}</span>
          </div>
        )}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100 mb-4 text-sm text-charcoal-mid">
          {p.area ? (
            <span className="flex items-center gap-1.5">
              <Square size={14} className="text-brand" />
              {p.area}m²
            </span>
          ) : null}
          {p.bedrooms ? (
            <span className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-brand" />
              {p.bedrooms} quarto{p.bedrooms > 1 ? "s" : ""}
            </span>
          ) : null}
          {p.bathrooms ? (
            <span className="flex items-center gap-1.5">
              <Bath size={14} className="text-brand" />
              {p.bathrooms} banheiro{p.bathrooms > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
        <div className="mt-auto">
          <div className="w-full flex items-center justify-center gap-2 border-2 border-charcoal text-charcoal group-hover:bg-brand group-hover:border-brand group-hover:text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200">
            Ver Detalhes
            <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  "Casa": "Casas",
  "Apartamento": "Apartamentos",
  "Comercial": "Comercial",
  "Terreno": "Terrenos",
};

const CATEGORY_TITLE: Record<string, string> = {
  "Todos": "Todos os Imóveis",
  "Casa": "Casas",
  "Apartamento": "Apartamentos",
  "Comercial": "Comercial",
  "Terreno": "Terrenos",
};

export default function PropertyList({
  properties,
  initialType = "all",
  initialCategory = "Todos",
  initialSearch = "",
  initialMaxPrice = null,
}: {
  properties: DbProperty[];
  initialType?: "all" | "venda" | "aluguel";
  initialCategory?: string;
  initialSearch?: string;
  initialMaxPrice?: number | null;
}) {
  const [typeFilter, setTypeFilter] = useState<"all" | "venda" | "aluguel">(initialType);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [priceSort, setPriceSort] = useState<"default" | "asc" | "desc">("default");
  const [maxPrice, setMaxPrice] = useState<number | null>(initialMaxPrice);

  const priceOptions = typeFilter === "aluguel" ? rentPrices : salePrices;
  const hasActiveFilters = typeFilter !== "all" || categoryFilter !== "Todos" || !!search || maxPrice != null;

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("Todos");
    setSearch("");
    setMaxPrice(null);
    setPriceSort("default");
  };

  const categoryKeys = ["Casa", "Apartamento", "Comercial", "Terreno"];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: 0 };
    for (const p of properties) {
      if (typeFilter !== "all" && p.type !== typeFilter) continue;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !(p.neighborhood ?? "").toLowerCase().includes(q) &&
          !(p.city ?? "").toLowerCase().includes(q)
        ) continue;
      }
      counts["Todos"] = (counts["Todos"] ?? 0) + 1;
      if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [properties, typeFilter, search]);

  const filtered = useMemo(() => {
    const result = properties.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (categoryFilter !== "Todos" && p.category !== categoryFilter) return false;
      if (maxPrice != null && (p.price == null || p.price > maxPrice)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(q) &&
          !(p.neighborhood ?? "").toLowerCase().includes(q) &&
          !(p.city ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
    if (priceSort === "asc") return [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (priceSort === "desc") return [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return result;
  }, [properties, typeFilter, categoryFilter, search, priceSort, maxPrice]);

  return (
    <div>
      {/* Cabeçalho com seletor de categoria */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block text-brand font-semibold text-sm uppercase tracking-widest mb-3">
            Catálogo Completo
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-charcoal font-display mb-6">
            {CATEGORY_TITLE[categoryFilter] ?? categoryFilter}
          </h1>
          <div className="flex gap-2 flex-wrap">
            {(["Todos", ...categoryKeys] as string[]).map((cat) => {
              const label = cat === "Todos" ? "Todos" : (CATEGORY_LABELS[cat] ?? cat);
              const active = categoryFilter === cat;
              const count = categoryCounts[cat] ?? 0;
              return (
                <button
                  key={cat}
                  onClick={() => {
                setCategoryFilter(cat);
                if (cat === "Terreno" && typeFilter === "aluguel") setTypeFilter("all");
              }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-charcoal text-white border-charcoal"
                      : "border-gray-200 text-gray-500 hover:border-charcoal hover:text-charcoal bg-white"
                  }`}
                >
                  {label}
                  <span className={`text-xs font-normal ${active ? "text-white/70" : "text-gray-400"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">

          {/* Linha 1: Compra/Aluguel + Busca + Ordenação */}
          <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            {/* Toggle Compra / Aluguel */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              {(["all", "venda", "aluguel"] as const)
                .filter((t) => !(categoryFilter === "Terreno" && t === "aluguel"))
                .map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-4 py-2 text-sm font-semibold transition-all ${
                      i > 0 ? "border-l border-gray-200" : ""
                    } ${
                      typeFilter === t
                        ? "bg-charcoal text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-charcoal"
                    }`}
                  >
                    {t === "all" ? "Todos" : t === "venda" ? "Compra" : "Aluguel"}
                  </button>
                ))}
            </div>

            {/* Busca */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, bairro ou cidade..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* Faixa de preço máxima */}
            <div className="relative">
              <select
                value={maxPrice ?? ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                className="text-sm border border-gray-200 rounded-xl pl-4 pr-4 py-2 focus:outline-none focus:border-brand text-charcoal bg-white appearance-none cursor-pointer"
              >
                {priceOptions.map((p) => (
                  <option key={p.label} value={p.max ?? ""}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Ordenação por preço */}
            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as "default" | "asc" | "desc")}
                className="text-sm border border-gray-200 rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:border-brand text-charcoal bg-white appearance-none cursor-pointer"
              >
                <option value="default">Ordenar por preço</option>
                <option value="asc">Menor preço primeiro</option>
                <option value="desc">Maior preço primeiro</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-charcoal transition-colors"
              >
                <X size={14} />
                Limpar filtros
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <p className="text-sm text-gray-400">
          {filtered.length === 1 ? "1 imóvel encontrado" : `${filtered.length} imóveis encontrados`}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} p={p} priority={i < 6} showCategory={categoryFilter === "Todos"} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400">Nenhum imóvel encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

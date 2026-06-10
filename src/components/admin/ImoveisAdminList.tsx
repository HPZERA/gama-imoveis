"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Search, X } from "lucide-react";
import DeletePropertyButton from "./DeletePropertyButton";
import ToggleActiveButton from "./ToggleActiveButton";

interface Property {
  id: string | number;
  title: string;
  code?: string | null;
  type: string;
  category?: string | null;
  neighborhood?: string | null;
  city: string;
  price?: number | null;
  active: boolean;
  images?: string[] | null;
}

const CATEGORIES_BY_TYPE: Record<string, string[]> = {
  venda:   ["Casa", "Apartamento", "Comércio", "Terreno"],
  aluguel: ["Casa", "Apartamento", "Comércio"],
};

export default function ImoveisAdminList({ properties }: { properties: Property[] }) {
  const [search, setSearch]   = useState("");
  const [typeFilter, setType] = useState<"" | "venda" | "aluguel">("");
  const [catFilter,  setCat]  = useState("");

  const categories = typeFilter ? CATEGORIES_BY_TYPE[typeFilter] : [];

  function handleTypeChange(t: "" | "venda" | "aluguel") {
    setType(t);
    setCat("");
  }

  const filtered = properties.filter(p => {
    if (typeFilter && p.type !== typeFilter) return false;
    if (catFilter  && p.category !== catFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.code?.toLowerCase().includes(q) && !p.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const activeFilters = [typeFilter, catFilter, search.trim()].filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-charcoal font-display">Imóveis</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">{properties.length} imóveis cadastrados</p>
        </div>
        <Link
          href="/admin/imoveis/novo"
          className="flex items-center gap-1.5 bg-brand text-charcoal font-semibold px-3 py-2 md:px-4 md:py-2.5 rounded-xl hover:bg-brand/90 transition-colors text-xs md:text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Novo Imóvel</span>
          <span className="sm:hidden">Novo</span>
        </Link>
      </div>

      {/* Busca */}
      <div className="relative mb-2.5">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por código ou título..."
          className="w-full pl-8 pr-9 py-2 border border-gray-200 rounded-xl text-xs md:text-sm text-charcoal focus:outline-none focus:border-brand transition-colors bg-white"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {(["", "venda", "aluguel"] as const).map(t => (
          <button
            key={t || "todos"}
            onClick={() => handleTypeChange(t)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
              typeFilter === t
                ? t === "venda"
                  ? "bg-blue-600 text-white border-blue-600"
                  : t === "aluguel"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-charcoal text-white border-charcoal"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {t === "" ? "Todos" : t === "venda" ? "Venda" : "Aluguel"}
          </button>
        ))}

        {typeFilter && <span className="w-px h-4 bg-gray-200" />}

        {typeFilter && categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCat(catFilter === cat ? "" : cat)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
              catFilter === cat
                ? "bg-brand text-charcoal border-brand"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}

        {activeFilters > 0 && (
          <button
            onClick={() => { setType(""); setCat(""); setSearch(""); }}
            className="ml-auto flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={11} /> Limpar
          </button>
        )}
      </div>

      {(search || typeFilter || catFilter) && (
        <p className="text-[11px] text-gray-400 mb-2">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 md:gap-4 px-3 md:px-6 py-3 hover:bg-gray-50 transition-colors">

                {/* Imagem */}
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-12 h-9 md:w-16 md:h-12 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-12 h-9 md:w-16 md:h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                )}

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.code && (
                      <span className="text-[10px] font-mono font-semibold text-brand bg-brand/10 px-1.5 py-0.5 rounded shrink-0">
                        #{p.code}
                      </span>
                    )}
                    <p className="font-medium text-charcoal text-xs md:text-sm truncate">{p.title}</p>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 flex items-center flex-wrap gap-x-1">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-medium ${p.type === "venda" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                      {p.type === "venda" ? "Venda" : "Aluguel"}
                    </span>
                    {p.category && <span>{p.category} ·</span>}
                    <span className="truncate">{p.neighborhood || p.city}</span>
                    {p.price && <span className="hidden sm:inline">· R$ {Number(p.price).toLocaleString("pt-BR")}</span>}
                  </p>
                </div>

                {/* Status */}
                <span className={`text-[10px] md:text-xs px-2 py-0.5 md:px-2.5 md:py-1 rounded-full font-medium flex-shrink-0 ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.active ? "Ativo" : "Inativo"}
                </span>

                {/* Ações */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <ToggleActiveButton id={String(p.id)} active={p.active} />
                  <Link
                    href={`/admin/imoveis/${p.id}`}
                    className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </Link>
                  <DeletePropertyButton id={String(p.id)} title={p.title} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-sm">
              {search || typeFilter || catFilter
                ? "Nenhum imóvel encontrado para os filtros selecionados."
                : "Nenhum imóvel cadastrado ainda."}
            </p>
            {!search && !typeFilter && !catFilter && (
              <Link href="/admin/imoveis/novo" className="text-brand text-sm hover:underline mt-2 inline-block">
                Adicionar primeiro imóvel
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

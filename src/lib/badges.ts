import type { DbProperty } from "@/types";

const NOVO_WINDOW_DAYS = 21;

const KNOWN_BADGES: Record<string, string> = {
  "novo": "bg-emerald-500 text-white",
  "exclusivo": "bg-charcoal text-brand",
  "oportunidade": "bg-amber-500 text-white",
  "baixou preço": "bg-rose-500 text-white",
  "baixou o preço": "bg-rose-500 text-white",
};

/** Resolves the highlight badge (Novo/Exclusivo/Oportunidade/Baixou Preço) for a property. */
export function getHighlightBadge(p: DbProperty): { label: string; className: string } | null {
  if (p.badge) {
    const className = KNOWN_BADGES[p.badge.trim().toLowerCase()] ?? "bg-brand text-charcoal";
    return { label: p.badge, className };
  }

  if (p.created_at) {
    const ageDays = (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays >= 0 && ageDays <= NOVO_WINDOW_DAYS) {
      return { label: "Novo", className: KNOWN_BADGES.novo };
    }
  }

  return null;
}

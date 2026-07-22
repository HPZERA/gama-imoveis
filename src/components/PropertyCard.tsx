"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { BedDouble, Bath, Square, Car, MapPin, ArrowRight, Heart } from "lucide-react";
import type { DbProperty } from "@/types";
import { withCacheBust, BLUR_DATA_URL } from "@/lib/imageUrl";
import { useFavorites } from "@/hooks/useFavorites";
import { getHighlightBadge } from "@/lib/badges";

const MotionLink = motion(Link);

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

export default function PropertyCard({
  p,
  priority,
  showCategory,
  linkTipo,
  animate = false,
  delay = 0,
}: {
  p: DbProperty;
  priority?: boolean;
  showCategory?: boolean;
  /** Preserves the active catalog filter (all|venda|aluguel) across navigation to the detail page. */
  linkTipo?: "all" | "venda" | "aluguel";
  /** Fades the card in on scroll (used on the home page's featured grid). */
  animate?: boolean;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const mainImage = p.images?.length ? p.images[0] : null;
  const href = linkTipo ? `/imoveis/${p.id}?tipo=${linkTipo}` : `/imoveis/${p.id}`;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(p.id);
  const highlight = getHighlightBadge(p);

  const Card = animate ? MotionLink : Link;
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 30 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.55, delay },
      }
    : {};

  return (
    <Card
      ref={ref}
      href={href}
      {...motionProps}
      className="relative bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
    >
      <div className="relative aspect-[4/3] flex-shrink-0 bg-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={withCacheBust(mainImage)}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
            preload={priority}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-sm">Sem foto</span>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {highlight && (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md w-fit ${highlight.className}`}>
              {highlight.label}
            </span>
          )}
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm w-fit ${
              p.type === "venda"
                ? "bg-charcoal/90 text-white"
                : "bg-brand text-charcoal"
            }`}
          >
            {p.type === "venda" ? "Venda" : "Aluguel"}
          </span>
          {showCategory && p.category && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm bg-white/90 text-charcoal w-fit">
              {p.category}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(p.id);
          }}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favorite}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform duration-200"
        >
          <motion.span
            key={String(favorite)}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex"
          >
            <Heart
              size={17}
              className={favorite ? "fill-rose-500 text-rose-500" : "text-charcoal-mid"}
            />
          </motion.span>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-2xl font-bold text-charcoal font-display leading-tight mb-2">
          {formatPrice(p.price, p.price_label, p.type)}
        </p>
        <h3 className="text-base font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-brand transition-colors">
          {p.title}
        </h3>
        {(p.neighborhood || p.city) && (
          <div className="flex items-center gap-1.5 text-gray-text text-sm mb-2">
            <MapPin size={13} className="text-brand flex-shrink-0" />
            <span>{[p.neighborhood, p.city].filter(Boolean).join(", ")}</span>
          </div>
        )}
        {p.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
            {p.description}
          </p>
        )}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100 mb-4 text-sm text-charcoal-mid flex-wrap">
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
          {p.parking_spots ? (
            <span className="flex items-center gap-1.5">
              <Car size={14} className="text-brand" />
              {p.parking_spots} vaga{p.parking_spots > 1 ? "s" : ""}
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
    </Card>
  );
}

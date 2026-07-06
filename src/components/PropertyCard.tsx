"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { BedDouble, Bath, Square, Car, MapPin, ArrowRight } from "lucide-react";
import type { DbProperty } from "@/types";
import { withCacheBust } from "@/lib/imageUrl";

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
}: {
  p: DbProperty;
  priority?: boolean;
  showCategory?: boolean;
  /** Preserves the active catalog filter (all|venda|aluguel) across navigation to the detail page. */
  linkTipo?: "all" | "venda" | "aluguel";
}) {
  const imgs = p.images?.length ? p.images : [];
  const href = linkTipo ? `/imoveis/${p.id}?tipo=${linkTipo}` : `/imoveis/${p.id}`;

  return (
    <Link
      href={href}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300 group flex flex-col"
    >
      <div className="relative h-56 flex-shrink-0 bg-gray-100">
        {imgs.length > 0 ? (
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true, dynamicBullets: true }}
            loop={imgs.length > 1}
            touchStartPreventDefault={false}
            simulateTouch={false}
            className="property-swiper h-full md:pointer-events-none"
          >
            {imgs.map((img, i) => (
              <SwiperSlide key={i} className="relative h-full">
                <Image
                  src={withCacheBust(img)}
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
    </Link>
  );
}

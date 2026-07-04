"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import { BedDouble, Bath, Square, ArrowRight, MapPin } from "lucide-react";
import type { DbProperty } from "@/types";

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

function PropertyCard({ property, delay, priority }: { property: DbProperty; delay: number; priority?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const imgs = property.images?.length ? property.images : [];

  return (
    <MotionLink
      ref={ref}
      href={`/imoveis/${property.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.14)] transition-all duration-300 group flex flex-col"
    >
      <div className="relative h-60 flex-shrink-0 bg-gray-100">
        {imgs.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            loop={imgs.length > 1}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            touchStartPreventDefault={false}
            simulateTouch={false}
            className="property-swiper h-full md:pointer-events-none"
          >
            {imgs.map((img, i) => (
              <SwiperSlide key={i} className="relative h-full">
                <Image
                  src={img}
                  alt={`${property.title} - foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <div className="flex gap-2">
            {property.badge && (
              <span className="bg-brand text-charcoal text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {property.badge}
              </span>
            )}
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                property.type === "venda" ? "bg-charcoal text-white" : "bg-wood text-white"
              }`}
            >
              {property.type === "venda" ? "Venda" : "Locação"}
            </span>
          </div>
          {property.category && (
            <span className="self-start text-xs font-semibold px-3 py-1 rounded-full shadow-sm bg-white/90 text-charcoal backdrop-blur-sm">
              {property.category}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <p className="text-2xl font-bold text-charcoal font-display leading-tight">
            {formatPrice(property.price, property.price_label, property.type)}
          </p>
        </div>

        <h3 className="text-base font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-brand transition-colors">
          {property.title}
        </h3>

        {(property.neighborhood || property.city) && (
          <div className="flex items-center gap-1.5 text-gray-text text-sm mb-2">
            <MapPin size={13} className="text-brand flex-shrink-0" />
            <span>{[property.neighborhood, property.city].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {property.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
            {property.description}
          </p>
        )}

        <div className="flex items-center gap-4 py-3 border-t border-gray-100 mb-4 text-sm text-charcoal-mid">
          {property.area ? (
            <span className="flex items-center gap-1.5">
              <Square size={14} className="text-brand" />
              {property.area}m²
            </span>
          ) : null}
          {property.bedrooms ? (
            <span className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-brand" />
              {property.bedrooms} quarto{property.bedrooms > 1 ? "s" : ""}
            </span>
          ) : null}
          {property.bathrooms ? (
            <span className="flex items-center gap-1.5">
              <Bath size={14} className="text-brand" />
              {property.bathrooms} banheiro{property.bathrooms > 1 ? "s" : ""}
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
    </MotionLink>
  );
}

export default function FeaturedClient({ properties }: { properties: DbProperty[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="imoveis" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block text-brand font-semibold text-sm uppercase tracking-widest mb-3"
            >
              Seleção Exclusiva
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-charcoal font-display"
            >
              Imóveis em Destaque
            </motion.h2>
          </div>
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            href="/imoveis"
            className="flex items-center gap-2 text-brand font-semibold hover:gap-3 transition-all text-sm"
          >
            Ver todos os imóveis
            <ArrowRight size={16} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <PropertyCard key={property.id} property={property} delay={i * 0.08} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

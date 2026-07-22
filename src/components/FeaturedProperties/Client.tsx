"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { DbProperty } from "@/types";
import PropertyCard from "@/components/PropertyCard";

export default function FeaturedClient({ properties }: { properties: DbProperty[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="imoveis" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 gap-4">
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
            <PropertyCard
              key={property.id}
              p={property}
              showCategory
              animate
              delay={i * 0.08}
              priority={i < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

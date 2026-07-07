"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";

const TYPE_TO_CATEGORY: Record<string, string> = {
  house: "Casa",
  apartment: "Apartamento",
  commercial: "Comercial",
  land: "Terreno",
};

export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="categorias" className="py-16 bg-gray-light">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="text-center mb-11">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-brand font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Explore
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-charcoal font-display mb-4"
          >
            Categorias de Imóveis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-text text-lg max-w-xl mx-auto"
          >
            Encontre o tipo de imóvel ideal para você entre nossas opções exclusivas
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 + 0.2 }}
            >
              <a
                href={`/imoveis?categoria=${encodeURIComponent(TYPE_TO_CATEGORY[cat.type] ?? cat.name)}`}
                className="group block relative h-72 rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 transition-all duration-300 group-hover:from-black/90 group-hover:via-black/50" />
                <div className="absolute top-4 right-4 bg-brand text-charcoal text-xs font-bold px-2.5 py-1 rounded-full">
                  {cat.count.toLocaleString("pt-BR")}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold font-display mb-1">{cat.name}</h3>
                  <div className="flex items-center gap-1 text-white/60 text-sm group-hover:text-brand transition-colors">
                    <span>{cat.count.toLocaleString("pt-BR")} imóveis</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

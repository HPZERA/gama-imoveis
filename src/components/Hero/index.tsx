"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, DollarSign, Home, ChevronDown } from "lucide-react";
import { saleTypes, rentTypes, salePrices, rentPrices, locations } from "@/lib/searchOptions";

export default function Hero() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<"comprar" | "alugar">("comprar");
  const [propertyType, setPropertyType] = useState(saleTypes[0]);
  const [location, setLocation] = useState(locations[0]);
  const [priceRange, setPriceRange] = useState("Qualquer valor");

  const priceRanges = transactionType === "comprar" ? salePrices : rentPrices;
  const propertyTypes = transactionType === "comprar" ? saleTypes : rentTypes;

  const handleTransactionChange = (type: "comprar" | "alugar") => {
    setTransactionType(type);
    setPriceRange("Qualquer valor");
    setPropertyType("Todos os tipos");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("tipo", transactionType === "comprar" ? "venda" : "aluguel");
    if (propertyType !== "Todos os tipos") params.set("categoria", propertyType);
    if (location !== locations[0]) params.set("busca", location);
    const selectedPrice = priceRanges.find((p) => p.label === priceRange);
    if (selectedPrice?.max != null) params.set("precoMax", String(selectedPrice.max));
    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0">
        <motion.video
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source
            src="https://hpqmzsqtzrpzanqtkcbf.supabase.co/storage/v1/object/public/imoveis/site/hero-video.mp4"
            type="video/mp4"
          />
        </motion.video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-brand/20 border border-brand/40 text-brand px-4 py-1.5 rounded-full text-sm font-medium mb-5 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          Há 4+ anos realizando sonhos
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight font-display mb-4"
        >
          Escolha o imóvel que vai
          <br />
          <span className="text-brand">transformar sua vida</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/75 text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          Há mais de 4 anos conectando pessoas aos melhores imóveis da região
          com segurança, transparência e atendimento.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-5xl"
        >
          {/* Transaction toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
              {(["comprar", "alugar"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTransactionChange(type)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200 active:scale-95 ${
                    transactionType === type
                      ? "bg-brand text-charcoal shadow-sm"
                      : "text-white hover:text-brand"
                  }`}
                >
                  {type === "comprar" ? "Comprar" : "Alugar"}
                </button>
              ))}
            </div>
          </div>

          {/* Search form */}
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.3)] transition-shadow duration-300 p-2 flex flex-col lg:flex-row gap-2">
            {/* Property type */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-transparent hover:border-brand/30 focus-within:border-brand/50 focus-within:bg-brand/5 rounded-xl transition-colors group cursor-pointer">
              <Home size={18} className="text-brand flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-semibold text-gray-text uppercase tracking-wider mb-0.5">
                  Tipo de imóvel
                </label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full text-sm font-medium text-charcoal bg-transparent border-0 outline-none cursor-pointer pr-5 appearance-none rounded-md focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    {propertyTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gray-200 my-2" />

            {/* Location */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-transparent hover:border-brand/30 focus-within:border-brand/50 focus-within:bg-brand/5 rounded-xl transition-colors group cursor-pointer">
              <MapPin size={18} className="text-brand flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-semibold text-gray-text uppercase tracking-wider mb-0.5">
                  Localização
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm font-medium text-charcoal bg-transparent border-0 outline-none cursor-pointer pr-5 appearance-none rounded-md focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    {locations.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gray-200 my-2" />

            {/* Price range */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-transparent hover:border-brand/30 focus-within:border-brand/50 focus-within:bg-brand/5 rounded-xl transition-colors group cursor-pointer">
              <DollarSign size={18} className="text-brand flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-semibold text-gray-text uppercase tracking-wider mb-0.5">
                  Faixa de preço
                </label>
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full text-sm font-medium text-charcoal bg-transparent border-0 outline-none cursor-pointer pr-5 appearance-none rounded-md focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    {priceRanges.map((r) => (
                      <option key={r.label}>{r.label}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-text pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Search button */}
            <button
              className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-charcoal font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-95 whitespace-nowrap text-sm"
              onClick={handleSearch}
            >
              <Search size={18} strokeWidth={2.5} />
              Buscar
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs tracking-widest uppercase">Role para baixo</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-brand rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

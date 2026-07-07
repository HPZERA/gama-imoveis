"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { useLeadPopup } from "@/context/LeadPopupContext";

const navItems = [
  { label: "Comprar", href: "/imoveis?tipo=venda" },
  { label: "Alugar", href: "/imoveis?tipo=aluguel" },
  { label: "Lançamentos", href: "/#imoveis" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Contato", href: "/#contato" },
];

const WA_URL = "https://wa.me/5555992103520";

export default function Header() {
  const { openPopup } = useLeadPopup();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Non-home pages have no dark hero behind the header, so it must render
  // solid from the start instead of transparent-until-scrolled.
  const solid = scrolled || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-[#1a3530] shadow-lg"
          : "bg-transparent"
      }`}
    >
      {/* Top bar */}
      <div
        className={`hidden xl:flex items-center justify-between px-8 py-2 text-sm transition-all duration-300 ${
          solid ? "bg-[#122824] text-white" : "bg-black/40 text-white/90"
        }`}
      >
        <div className="flex items-center gap-6" />
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/LOGO.png"
            alt="Gama Imóveis"
            width={44}
            height={44}
            priority
            className="h-11 w-auto object-contain"
          />
          <div>
            <span className="text-xl font-bold tracking-tight transition-colors font-display text-white">
              Gama
            </span>
            <span className="text-xl font-bold text-brand tracking-tight font-display">
              {" "}
              Imóveis
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-brand text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openPopup(WA_URL)}
            className="hidden xl:flex items-center gap-2 bg-brand hover:bg-brand-hover text-charcoal font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-95"
          >
            <MessageCircle size={16} strokeWidth={2.5} />
            Fale Conosco
          </button>
          <button
            className="xl:hidden p-2 rounded-lg transition-colors text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-charcoal hover:bg-brand/10 hover:text-brand font-medium transition-all"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { openPopup(WA_URL); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-charcoal font-semibold px-5 py-3 rounded-full text-sm transition-all w-full"
                >
                  Fale Conosco via WhatsApp
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

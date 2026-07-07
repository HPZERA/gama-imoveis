import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle, Mail, Globe, Home, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Gama Imóveis | Links",
  description: "Gama Imóveis — Alto Padrão. Encontre o imóvel dos seus sonhos.",
};

const links = [
  {
    icon: Home,
    label: "Ver Imóveis",
    description: "Casas, aptos e terrenos disponíveis",
    href: "https://gama-imoveis-xi.vercel.app/#imoveis",
    featured: true,
  },
  {
    icon: MessageCircle,
    label: "Falar no WhatsApp",
    description: "Atendimento rápido com um consultor",
    href: "https://wa.me/5555992103520",
    featured: false,
  },
  {
    icon: Globe,
    label: "Nosso Site",
    description: "gama-imoveis-xi.vercel.app",
    href: "https://gama-imoveis-xi.vercel.app",
    featured: false,
  },
  {
    icon: Mail,
    label: "Enviar E-mail",
    description: "contato@gamaimoveis.com.br",
    href: "mailto:contato@gamaimoveis.com.br",
    featured: false,
  },
  {
    icon: MapPin,
    label: "Nossa Localização",
    description: "São Gabriel — RS",
    href: "https://www.google.com/maps/search/?api=1&query=S%C3%A3o+Gabriel%2C+RS",
    featured: false,
  },
];

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function BioPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-5 py-12">
      {/* Background video */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/Brazilian_house_facade_golden_hour_202605312154.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="absolute bottom-0 right-0 w-56 h-16 bg-gradient-to-tl from-black to-transparent" />
      </div>

      <div className="relative w-full max-w-md flex flex-col items-center gap-6">

        {/* Logo + identity */}
        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#6BCAC4]/30 shadow-xl shadow-black/40 flex items-center justify-center bg-[#1a3530]">
            <Image
              src="/LOGO.png"
              alt="Gama Imóveis"
              width={96}
              height={96}
              className="object-contain p-2"
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Gama <span className="text-[#6BCAC4]">Imóveis</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mt-0.5">Transformando Vidas</p>
            <p className="text-sm text-white/60 mt-3 max-w-xs leading-relaxed">
              Há mais de 4 anos conectando pessoas aos melhores imóveis de São Gabriel — RS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10" />

        {/* Links */}
        <div className="w-full flex flex-col gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-4 w-full rounded-2xl px-5 py-4 transition-all duration-200 group
                  ${link.featured
                    ? "bg-[#6BCAC4] hover:bg-[#4FABA5] text-[#1a1a1a] shadow-lg shadow-[#6BCAC4]/20"
                    : "bg-white/5 hover:bg-white/10 border border-white/8 text-white"
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                  ${link.featured
                    ? "bg-[#1a1a1a]/15"
                    : "bg-[#6BCAC4]/10 group-hover:bg-[#6BCAC4]/20"
                  }
                `}>
                  <Icon
                    size={20}
                    className={link.featured ? "text-[#1a1a1a]" : "text-[#6BCAC4]"}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`font-semibold text-sm ${link.featured ? "text-[#1a1a1a]" : "text-white"}`}>
                    {link.label}
                  </span>
                  <span className={`text-xs truncate mt-0.5 ${link.featured ? "text-[#1a1a1a]/60" : "text-white/40"}`}>
                    {link.description}
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all ${link.featured ? "text-[#1a1a1a]" : "text-white"}`}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            );
          })}
        </div>

        {/* Social icons */}
        <div className="flex gap-3 mt-2">
          {[
            { icon: <IconInstagram />, href: "https://www.instagram.com/gamaimoveissg/", label: "Instagram" },
            { icon: <IconFacebook />, href: "https://www.facebook.com/gamaimoveissg", label: "Facebook" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-10 h-10 bg-white/5 hover:bg-[#6BCAC4]/20 hover:text-[#6BCAC4] text-white/50 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/5"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-white/20 text-xs mt-4 text-center">
          © {new Date().getFullYear()} Gama Imóveis · Todos os direitos reservados
        </p>
      </div>
    </main>
  );
}

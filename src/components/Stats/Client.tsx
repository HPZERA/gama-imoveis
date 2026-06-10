"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Building2, Award, MapPin } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  iconSm: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

function useCountUp(target: number, isInView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return count;
}

function StatCard({ stat, delay }: { stat: StatItem; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(stat.value, isInView);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center px-2 py-6 sm:px-8 sm:py-10 group"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s ease ${delay}ms`,
      }}
    >
      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-brand/20 transition-colors">
        <span className="sm:hidden">{stat.iconSm}</span>
        <span className="hidden sm:block">{stat.icon}</span>
      </div>
      <div className="text-3xl sm:text-5xl font-bold text-charcoal font-display mb-1">
        {count.toLocaleString("pt-BR")}
        <span className="text-brand">{stat.suffix}</span>
      </div>
      <div className="text-sm sm:text-lg font-semibold text-charcoal mb-1 leading-tight">{stat.label}</div>
      <p className="hidden sm:block text-sm text-gray-text max-w-44 leading-relaxed">{stat.description}</p>
    </div>
  );
}

export default function StatsClient({ totalProperties }: { totalProperties: number }) {
  const stats: StatItem[] = [
    {
      icon: <Building2 size={32} className="text-brand" strokeWidth={1.5} />,
      iconSm: <Building2 size={20} className="text-brand" strokeWidth={1.5} />,
      value: totalProperties,
      suffix: "+",
      label: "Imóveis disponíveis",
      description: "Portfólio completo para todos os perfis",
    },
    {
      icon: <Award size={32} className="text-brand" strokeWidth={1.5} />,
      iconSm: <Award size={20} className="text-brand" strokeWidth={1.5} />,
      value: 4,
      suffix: "+",
      label: "Anos de experiência",
      description: "Tradição e expertise no mercado imobiliário",
    },
    {
      icon: <MapPin size={32} className="text-brand" strokeWidth={1.5} />,
      iconSm: <MapPin size={20} className="text-brand" strokeWidth={1.5} />,
      value: 40,
      suffix: "+",
      label: "Bairros atendidos",
      description: "Cobertura completa na região metropolitana",
    },
  ];

  return (
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

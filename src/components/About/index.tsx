"use client";

import { useRef } from "react";
import Image from "next/image";
import { useInView, motion } from "framer-motion";
import { CheckCircle2, Users, TrendingUp, Shield } from "lucide-react";

const highlights = [
  {
    icon: <Shield size={18} className="text-brand" />,
    title: "Transparência Total",
    description: "Processos claros e documentação completa em cada etapa",
  },
  {
    icon: <Shield size={18} className="text-brand" />,
    title: "Segurança Jurídica",
    description: "Equipe especializada para garantir transações seguras",
  },
  {
    icon: <Users size={18} className="text-brand" />,
    title: "Atendimento Premium",
    description: "Consultores dedicados disponíveis para você 7 dias por semana",
  },
  {
    icon: <TrendingUp size={18} className="text-brand" />,
    title: "Especialistas Locais",
    description: "Profundos conhecedores do mercado imobiliário regional",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="sobre" className="py-20 bg-cream">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative w-full lg:w-[600px] xl:w-[680px] flex-shrink-0"
          >
            <div className="relative w-full aspect-[3/2] rounded-[28px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
              <Image
                src="/sobre-2.png"
                alt="Equipe Gama Imóveis"
                fill
                quality={100}
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 680px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-5 shadow-xl max-w-52">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-brand" />
                </div>
                <div>
                  <p className="font-bold text-charcoal text-lg leading-none">98%</p>
                  <p className="text-xs text-gray-text">de satisfação</p>
                </div>
              </div>
              <p className="text-xs text-gray-text leading-relaxed">
                dos nossos clientes recomendam a Gama Imóveis
              </p>
            </div>

            {/* Top accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand rounded-2xl -z-10" />
          </motion.div>

          {/* Right: Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block text-brand font-semibold text-sm uppercase tracking-widest mb-5"
            >
              Sobre nós
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold text-charcoal font-display mb-7 leading-tight"
            >
              Especialistas em
              <br />
              <span className="text-brand">realizar sonhos</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-gray-text text-base leading-relaxed mb-4"
            >
              Fundada há mais de 4 anos, a Gama Imóveis nasceu com uma missão clara:
              conectar pessoas ao imóvel perfeito com confiança, segurança e excelência
              no atendimento.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-text text-base leading-relaxed mb-9"
            >
              Nossa equipe de consultores especializados possui profundo conhecimento do
              mercado imobiliário regional e está comprometida em oferecer uma experiência
              única e personalizada para cada cliente, desde a busca até a assinatura do contrato.
            </motion.p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand/30 hover:shadow-sm transition-all"
                >
                  <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal text-sm mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-gray-text text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10"
            >
              <a
                href="#contato"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-charcoal font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Fale com um consultor
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

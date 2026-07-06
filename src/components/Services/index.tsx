"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import {
  HandshakeIcon,
  Key,
  BarChart3,
  Scale,
  Banknote,
  ClipboardList,
} from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const services = [
  {
    icon: <HandshakeIcon size={28} strokeWidth={1.5} />,
    title: "Compra e Venda",
    description:
      "Assessoria completa para compra e venda de imóveis residenciais e comerciais, com avaliação de mercado e suporte jurídico.",
    color: "from-brand/20 to-brand/5",
    whatsappMessage:
      "Olá! 👋\nTenho interesse no serviço de Compra e Venda de imóveis da Gama Imóveis.\n\nGostaria de receber um atendimento e conhecer as opções disponíveis.",
  },
  {
    icon: <Key size={28} strokeWidth={1.5} />,
    title: "Locação",
    description:
      "Encontre o imóvel ideal para alugar ou maximize a rentabilidade do seu patrimônio com nossa gestão especializada.",
    color: "from-charcoal/10 to-charcoal/5",
    whatsappMessage:
      "Olá! 👋\nTenho interesse em imóveis para Locação.\n\nGostaria de conversar com um corretor para conhecer as opções disponíveis.",
  },
  {
    icon: <BarChart3 size={28} strokeWidth={1.5} />,
    title: "Avaliação de Imóveis",
    description:
      "Laudos técnicos precisos e análises de mercado detalhadas para você tomar as melhores decisões de investimento.",
    color: "from-brand/15 to-brand/5",
    whatsappMessage:
      "Olá! 👋\nGostaria de solicitar uma Avaliação de Imóvel.\n\nPoderiam me passar mais informações sobre esse serviço?",
  },
  {
    icon: <Scale size={28} strokeWidth={1.5} />,
    title: "Consultoria Jurídica",
    description:
      "Nossa equipe jurídica garante segurança total em contratos, escrituras, inventários e regularização de imóveis.",
    color: "from-charcoal/10 to-charcoal/5",
    whatsappMessage:
      "Olá! 👋\nTenho interesse na Consultoria Jurídica da Gama Imóveis.\n\nGostaria de receber mais informações.",
  },
  {
    icon: <Banknote size={28} strokeWidth={1.5} />,
    title: "Financiamento",
    description:
      "Simulação e assessoria completa para obtenção do melhor crédito imobiliário junto aos principais bancos do país.",
    color: "from-brand/20 to-brand/5",
    whatsappMessage:
      "Olá! 👋\nGostaria de informações sobre Financiamento Imobiliário.\n\nTenho interesse em realizar uma simulação e entender as melhores opções disponíveis.",
  },
  {
    icon: <ClipboardList size={28} strokeWidth={1.5} />,
    title: "Administração",
    description:
      "Gestão profissional de imóveis: cobrança, manutenção, vistoria e toda a burocracia resolvida para você.",
    color: "from-charcoal/10 to-charcoal/5",
    whatsappMessage:
      "Olá! 👋\nTenho interesse no serviço de Administração de Imóveis.\n\nGostaria de receber mais informações sobre como funciona.",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-brand font-semibold text-sm uppercase tracking-widest mb-3"
          >
            O que fazemos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-charcoal font-display mb-4"
          >
            Nossos Serviços
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-text text-lg max-w-xl mx-auto"
          >
            Soluções completas para todas as suas necessidades imobiliárias em
            um só lugar
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.a
              key={service.title}
              href={getWhatsAppUrl(service.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08 + 0.2 }}
              className="group block p-7 rounded-2xl border border-gray-100 hover:border-brand/40 hover:shadow-[0_8px_32px_rgba(184,212,48,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 text-brand group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-charcoal mb-3 group-hover:text-brand transition-colors font-display">
                {service.title}
              </h3>
              <p className="text-gray-text text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Arrow */}
              <div className="mt-5 flex items-center gap-2 text-brand text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                Saiba mais
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

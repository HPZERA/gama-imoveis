"use client";

import { useRef, useState } from "react";
import { useInView, motion } from "framer-motion";
import {
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { useLeadPopup } from "@/context/LeadPopupContext";

const contactInfo = [
  {
    icon: <MessageCircle size={20} className="text-brand" />,
    label: "WhatsApp",
    value: "(55) 99210-3520",
    href: "https://wa.me/5555992103520",
  },
  {
    icon: <Mail size={20} className="text-brand" />,
    label: "E-mail",
    value: "contato@gamaimoveis.com.br",
    href: "mailto:contato@gamaimoveis.com.br",
  },
];

export default function Contact() {
  const { openPopup } = useLeadPopup();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "", // honeypot — mantido vazio por usuários reais
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(false);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        whatsapp: form.phone,
        email: form.email,
        message: form.message,
        company: form.company,
        source: "contact-form",
      }),
    });

    setSending(false);

    if (!res.ok) {
      setError(true);
      return;
    }

    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", phone: "", message: "", company: "" });
  }

  return (
    <section id="contato" className="py-16 bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-11">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-brand font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Fale conosco
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white font-display mb-4"
          >
            Entre em Contato
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto"
          >
            Estamos prontos para ajudá-lo a encontrar o imóvel dos seus sonhos.
            Fale com um de nossos consultores agora.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: Info + Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contact info */}
            <div className="bg-charcoal-light border border-white/5 rounded-2xl p-7">
              <h3 className="font-bold text-white text-lg mb-5 font-display">
                Informações de Contato
              </h3>
              <div className="flex flex-col gap-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group"
                    onClick={item.href.startsWith("https://wa.me") ? (e) => { e.preventDefault(); openPopup(item.href); } : undefined}
                  >
                    <div className="w-9 h-9 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-white text-sm font-medium group-hover:text-brand transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <button
                onClick={() => openPopup("https://wa.me/5555992103520")}
                className="mt-6 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ea855] text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm w-full hover:scale-[1.02] active:scale-95"
              >
                <MessageCircle size={18} />
                Iniciar conversa no WhatsApp
              </button>
            </div>

            {/* Service area */}
            <div className="rounded-2xl overflow-hidden shadow-sm bg-charcoal-light border border-white/5 p-7 flex flex-col items-start gap-3">
              <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-brand" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                  Área de atendimento
                </p>
                <p className="text-white font-medium">São Gabriel e região – RS</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-charcoal-light border border-white/5 rounded-2xl p-8">
              <h3 className="font-bold text-white text-lg mb-1 font-display">
                Envie uma mensagem
              </h3>
              <p className="text-white/50 text-sm mb-6">
                Preencha o formulário e um consultor entrará em contato em até 24 horas.
              </p>

              {sent && (
                <div className="mb-5 p-4 bg-brand/10 border border-brand/30 rounded-xl text-white text-sm font-medium">
                  ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
                </div>
              )}

              {error && (
                <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-white text-sm font-medium">
                  Não foi possível enviar sua mensagem. Tente novamente ou fale conosco pelo WhatsApp.
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px overflow-hidden"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Seu nome"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Descreva o imóvel que você procura, sua faixa de preço e qualquer outra informação relevante..."
                    className="w-full bg-charcoal border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center justify-center gap-2.5 bg-brand hover:bg-brand-hover text-charcoal font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 text-sm disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send size={16} />
                  {sending ? "Enviando..." : "Enviar Mensagem"}
                </button>

                <p className="text-center text-white/40 text-xs">
                  Ao enviar, você concorda com nossa{" "}
                  <a href="/politica-de-privacidade" className="text-brand underline">
                    política de privacidade
                  </a>
                  .
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

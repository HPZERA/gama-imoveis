"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const COOKIE_KEY = "gama_lead_popup";

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/`;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
};

export default function LeadPopup({ isOpen, onClose, targetUrl }: Props) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function handleDismiss() {
    setName("");
    setWhatsapp("");
    setDone(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    await supabase.from("leads").insert({ name, whatsapp, source: "cta" });

    setCookie(COOKIE_KEY, "submitted", 365);
    setSaving(false);
    setDone(true);

    setTimeout(() => {
      onClose();
      window.open(targetUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => {
        setName("");
        setWhatsapp("");
        setDone(false);
      }, 300);
    }, 1500);
  }

  function formatWhatsapp(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-charcoal px-6 pt-6 pb-8 relative">
          <button
            onClick={handleDismiss}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center mb-3">
            <MessageCircle size={24} className="text-brand" />
          </div>
          <h2 id="lead-popup-title" className="text-white font-bold text-lg font-display">Encontre seu imóvel ideal</h2>
          <p className="text-white/50 text-sm mt-1">Deixe seu contato e um consultor entra em touch com você.</p>
        </div>

        <div className="px-6 py-6 -mt-4 bg-white rounded-t-2xl relative">
          {done ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-semibold text-charcoal">Recebemos seu contato!</p>
              <p className="text-sm text-gray-400 mt-1">Abrindo o WhatsApp...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  required
                  aria-label="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <div>
                <input
                  required
                  aria-label="Seu WhatsApp"
                  value={whatsapp}
                  onChange={e => setWhatsapp(formatWhatsapp(e.target.value))}
                  placeholder="WhatsApp: (55) 99999-9999"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand text-charcoal font-semibold py-3 rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? "Enviando..." : "Quero ser atendido"}
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                Agora não
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLeadPopup } from "@/context/LeadPopupContext";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" width="30" height="30" fill="white">
    <path d="M16.004 0C7.164 0 .003 7.16.003 16c0 2.824.738 5.47 2.03 7.77L.003 32l8.463-2.01A15.94 15.94 0 0016.004 32C24.84 32 32 24.84 32 16S24.84 0 16.004 0zm0 29.23a13.2 13.2 0 01-6.73-1.84l-.482-.286-4.997 1.186 1.23-4.865-.316-.5A13.19 13.19 0 012.77 16c0-7.297 5.937-13.23 13.234-13.23 7.296 0 13.228 5.933 13.228 13.23 0 7.296-5.932 13.23-13.228 13.23zm7.26-9.907c-.398-.2-2.355-1.162-2.72-1.295-.366-.133-.632-.2-.898.2-.266.398-1.03 1.295-1.264 1.56-.232.267-.464.3-.862.1-.398-.2-1.68-.62-3.2-1.98-1.183-1.057-1.98-2.362-2.213-2.76-.232-.398-.025-.613.175-.81.18-.178.398-.465.597-.697.2-.233.266-.4.4-.664.132-.267.066-.5-.034-.698-.1-.2-.898-2.162-1.23-2.96-.325-.778-.655-.672-.898-.685-.232-.01-.498-.013-.764-.013-.267 0-.697.1-1.063.498-.365.398-1.394 1.362-1.394 3.324 0 1.962 1.427 3.858 1.627 4.125.2.266 2.81 4.29 6.808 6.017.952.41 1.695.655 2.274.838.955.303 1.826.26 2.514.158.767-.114 2.355-.963 2.688-1.893.332-.93.332-1.728.232-1.893-.1-.167-.366-.267-.764-.465z" />
  </svg>
);

const WA_URL = "https://wa.me/5555992103520?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20im%C3%B3veis%20da%20Gama%20Im%C3%B3veis.";

export default function WhatsAppButton() {
  const { openPopup } = useLeadPopup();
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="relative bg-white rounded-2xl shadow-xl p-4 max-w-[220px] border border-gray-100"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <X size={12} />
            </button>
            <p className="text-charcoal text-sm font-semibold mb-1">
              Precisa de ajuda? 👋
            </p>
            <p className="text-gray-text text-xs leading-relaxed">
              Fale com um consultor agora pelo WhatsApp!
            </p>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={() => openPopup(WA_URL)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1ea855] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 relative"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <WhatsAppIcon />

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
      </motion.button>
    </div>
  );
}

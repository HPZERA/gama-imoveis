"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLeadPopup } from "@/context/LeadPopupContext";

const WA_URL = "https://wa.me/5555992103520";

export default function CtaBanner() {
  const { openPopup } = useLeadPopup();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-brand py-14">
      <div
        ref={ref}
        className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-5"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-2xl lg:text-3xl font-bold text-charcoal font-display"
        >
          Encontrou o imóvel ideal?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-charcoal/70 text-base max-w-xl"
        >
          Nossa equipe está pronta para ajudar você a encontrar o imóvel perfeito.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => openPopup(WA_URL)}
          className="inline-flex items-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-lg hover:scale-[1.03] active:scale-95"
        >
          <MessageCircle size={18} />
          Falar com um consultor
        </motion.button>
      </div>
    </section>
  );
}

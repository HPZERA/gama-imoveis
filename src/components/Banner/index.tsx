"use client";

import Image from "next/image";
import { useLeadPopup } from "@/context/LeadPopupContext";

const WA_URL = "https://wa.me/5555992103520?text=Ol%C3%A1!%20Gostaria%20de%20anunciar%20meu%20im%C3%B3vel%20com%20a%20Gama%20Im%C3%B3veis.";

export default function Banner() {
  const { openPopup } = useLeadPopup();

  return (
    <section>
      <button
        onClick={() => openPopup(WA_URL)}
        aria-label="Anuncie seu imóvel com a Gama Imóveis pelo WhatsApp"
        className="block w-full"
      >
        <Image
          src="/Banner.png"
          alt="Anuncie seu imóvel com a Gama Imóveis"
          width={1920}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </button>
    </section>
  );
}

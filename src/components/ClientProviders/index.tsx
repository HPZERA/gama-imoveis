"use client";

import { useState, useCallback } from "react";
import { LeadPopupContext } from "@/context/LeadPopupContext";
import LeadPopup from "@/components/LeadPopup";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");

  const openPopup = useCallback((whatsappUrl: string) => {
    if (getCookie("gama_lead_popup") === "submitted") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setTargetUrl(whatsappUrl);
    setIsOpen(true);
  }, []);

  return (
    <LeadPopupContext.Provider value={{ openPopup }}>
      {children}
      <LeadPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetUrl={targetUrl}
      />
    </LeadPopupContext.Provider>
  );
}

"use client";

import { createContext, useContext } from "react";

type LeadPopupContextType = {
  openPopup: (whatsappUrl: string) => void;
};

export const LeadPopupContext = createContext<LeadPopupContextType>({
  openPopup: () => {},
});

export function useLeadPopup() {
  return useContext(LeadPopupContext);
}

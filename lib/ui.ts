"use client";

import { create } from "zustand";

type UIState = {
  consentBannerOpen: boolean;
  setConsentBannerOpen: (open: boolean) => void;
};

/**
 * Shared shell state so the floating WhatsApp and voice controls can move out of
 * the way while the cookie banner is on screen.
 */
export const useUI = create<UIState>((set) => ({
  consentBannerOpen: false,
  setConsentBannerOpen: (open) => set({ consentBannerOpen: open }),
}));

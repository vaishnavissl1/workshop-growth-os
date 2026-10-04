import React from "react";
import { WORKSHOP_CONFIG } from "@/config";

/**
 * PrototypeBanner — appears at the top of every page.
 * PLAN.md §4 Tier 1 item 6:
 * "Prototype built for the NxtWave Growth Challenge — not an official NxtWave event."
 */
export default function PrototypeBanner() {
  return (
    <div
      id="prototype-banner"
      role="banner"
      aria-label="Prototype notice"
      className="w-full bg-amber-50 border-b border-amber-300 text-amber-900 text-center px-4 py-2 text-xs sm:text-sm font-medium tracking-wide z-50"
    >
      ⚠️&nbsp;{WORKSHOP_CONFIG.prototypeBanner}
    </div>
  );
}

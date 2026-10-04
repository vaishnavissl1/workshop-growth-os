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
      className="w-full border-b border-amber-400/20 bg-amber-400/10 px-4 py-2 text-center text-xs font-medium tracking-wide text-amber-200 sm:text-sm"
    >
      ⚠️&nbsp;{WORKSHOP_CONFIG.prototypeBanner}
    </div>
  );
}

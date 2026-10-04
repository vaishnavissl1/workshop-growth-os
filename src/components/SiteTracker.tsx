"use client";

import { useEffect } from "react";
import { resolveVariant, track } from "@/lib/analytics";

const STORE = "wgos";

/**
 * Mounted once in the root layout. Saves attribution (?ref, ?src, ?amb) to localStorage on whatever page
 * the visitor lands on, so the register page can use it even though it's a different URL.
 * Cookies are never used: WhatsApp's in-app browser drops them.
 */
export default function SiteTracker() {
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const prev = JSON.parse(localStorage.getItem(STORE) ?? "{}");
      const next = {
        ...prev,
        ref: q.get("ref") ?? prev.ref,
        source: q.get("src") ?? prev.source,
        ambassador: q.get("amb") ?? prev.ambassador,
      };
      localStorage.setItem(STORE, JSON.stringify(next));
      if (window.location.pathname === "/") {
        resolveVariant((v) =>
          track("landing_view", { headline_variant: v, source: next.source ?? "direct", ambassador_code: next.ambassador }),
        );
      }
    } catch {}
  }, []);
  return null;
}

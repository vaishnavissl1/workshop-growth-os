"use client";

import { useEffect } from "react";

/** Keeps the student's own ref code in localStorage (cookies are unreliable in WhatsApp's in-app browser). */
export default function RememberMe({ code }: { code: string }) {
  useEffect(() => {
    try {
      localStorage.setItem("wgos_me", code);
    } catch {}
  }, [code]);
  return null;
}

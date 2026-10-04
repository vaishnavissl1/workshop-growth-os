"use client";

import { usePathname } from "next/navigation";

const SHOW_ON = ["/", "/program", "/certificate", "/faq", "/leaderboard", "/evaluate"];

/**
 * Phone-only bar pinned to the bottom of the screen with the one action that matters.
 * Most traffic arrives from WhatsApp on a phone, where the header button scrolls out of reach.
 */
export default function MobileCta() {
  const pathname = usePathname();
  if (!SHOW_ON.includes(pathname)) return null;

  return (
    <>
      {/* keeps the footer clear of the fixed bar */}
      <div className="h-20 bg-[#1E293B] md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.10)] backdrop-blur md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/register" className="btn-cta w-full">
          Reserve my free seat
        </a>
      </div>
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { WORKSHOP_CONFIG as cfg } from "@/config";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
];

/**
 * Floating glass nav pill (Pixel.io style): workshop name on the left, Home and Leaderboard on the right.
 * Rendered once in the root layout, so it appears on every public page. Hidden on /admin.
 */
export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav aria-label="Main" className="sticky top-3 z-40 px-4 pb-3 pt-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur-md">
        {/* Plain anchors on purpose: each click is a full page load to a new URL, never a scroll or an in-page swap. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex min-w-0 items-center gap-2 !text-white">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{ backgroundImage: "linear-gradient(to bottom right, #4F46E5, #4338CA)" }}
          >
            AI
          </span>
          <span className="hidden truncate text-sm font-semibold min-[420px]:block sm:text-base">{cfg.title}</span>
        </a>
        <div className="flex flex-shrink-0 items-center gap-1">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  active ? "bg-white/10 !text-white" : "!text-gray-300 hover:bg-white/5 hover:!text-white"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

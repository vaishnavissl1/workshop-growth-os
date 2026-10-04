"use client";

import { usePathname } from "next/navigation";
import { WORKSHOP_CONFIG as cfg } from "@/config";

const STRIP = [
  "Free",
  "60 minutes",
  "Live AI project link",
  "Certificate",
  "2027 batch",
  "Any engineering branch",
  "No AI experience needed",
  "Build · Deploy · Share",
];

const NAV = [
  ["/", "Home"],
  ["/register", "Register"],
  ["/program", "Program"],
  ["/certificate", "Certificate"],
  ["/faq", "FAQ"],
  ["/leaderboard", "Leaderboard"],
];

/** Footer: sliding highlights bar, page links, and the prototype notice. Hidden on /admin. */
export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-white/10 bg-black/30">
      <div aria-label="Highlights" className="overflow-hidden border-b border-white/10 bg-white/[0.03] py-5">
        <div className="animate-marquee items-center gap-14 whitespace-nowrap">
          {STRIP.concat(STRIP).map((t, i) => (
            <span key={i} className="flex items-center gap-14 text-base font-semibold tracking-wide text-gray-300 sm:text-lg">
              {t}
              <span aria-hidden="true" className="text-violet-400">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-wide grid gap-10 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-xl font-semibold">{cfg.title}</p>
          <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-gray-400">
            A free, hands-on live workshop for final-year engineering students: build an AI app, deploy it, and leave with a public link for your resume.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.95rem]">
          {NAV.map(([href, label]) => (
            <li key={href}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href={href} className="!text-gray-300 hover:!text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-white/10 px-4 py-5 text-center text-sm text-gray-400">
        {cfg.prototypeBanner}
      </p>
    </footer>
  );
}

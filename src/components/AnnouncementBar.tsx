"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WORKSHOP_CONFIG as cfg } from "@/config";

const HIDE_ON = ["/admin", "/live"];

/**
 * Top bar: the NIAT logo on the left and a live countdown to the REAL registration close date in config.
 * The countdown disappears once that date has passed, so it never shows a deadline that isn't true; the logo stays.
 */
export default function AnnouncementBar() {
  const pathname = usePathname();
  const target = new Date(cfg.registrationCloses).getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  const open = left !== null && left > 0;
  const s = Math.floor((left ?? 0) / 1000);
  const cells: [number, string][] = [
    [Math.floor(s / 86400), "DAYS"],
    [Math.floor((s % 86400) / 3600), "HRS"],
    [Math.floor((s % 3600) / 60), "MINS"],
    [s % 60, "SECS"],
  ];

  return (
    <div className="bg-[#991B1B] px-4 py-2.5 text-white sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-x-5 gap-y-2.5 lg:grid-cols-[1fr_auto_1fr]">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" aria-label="NIAT home" className="justify-self-center lg:justify-self-start">
          {/* White version of NIAT's logo (crest + name). Swap public/niat-logo-white.svg to change it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/niat-logo-white.svg" alt="NIAT: NxtWave of Innovation in Advanced Technologies" width={237} height={56} className="h-10 w-auto sm:h-11" />
        </a>

        {open && (
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <p className="text-center text-[0.95rem] font-semibold sm:text-base">
              Free seats for the 2027 batch. Registration closes in
            </p>
            <div role="timer" aria-label={`${cells[0][0]} days ${cells[1][0]} hours ${cells[2][0]} minutes left to register`} className="flex items-center gap-1.5">
              {cells.map(([n, u], i) => (
                <span key={u} className="flex items-center gap-1.5">
                  <span className="flex min-w-[2.9rem] flex-col items-center rounded-md bg-white px-1.5 py-1 leading-none text-[#1E293B]">
                    <span className="text-lg font-bold tabular-nums">{String(n).padStart(2, "0")}</span>
                    <span className="mt-0.5 text-[0.6rem] font-bold tracking-wide">{u}</span>
                  </span>
                  {i < 3 && <span aria-hidden="true" className="font-bold">:</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

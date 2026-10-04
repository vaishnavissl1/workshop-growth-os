"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORKSHOP_CONFIG as cfg } from "@/config";

/** Floating glass nav pill (Pixel.io style): workshop name on the left, Leaderboard on the right. Hidden on /admin. */
export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const onBoard = pathname.startsWith("/leaderboard");
  return (
    <nav aria-label="Main" className="sticky top-3 z-40 px-4 pt-3">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur-md">
        <Link href="/" className="flex min-w-0 items-center gap-2 !text-white">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{ backgroundImage: "linear-gradient(to bottom right, #4F46E5, #4338CA)" }}
          >
            AI
          </span>
          <span className="truncate text-sm font-semibold sm:text-base">{cfg.title}</span>
        </Link>
        <Link
          href="/leaderboard"
          aria-current={onBoard ? "page" : undefined}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            onBoard ? "bg-white/10 !text-white" : "!text-gray-300 hover:bg-white/5 hover:!text-white"
          }`}
        >
          Leaderboard
        </Link>
      </div>
    </nav>
  );
}

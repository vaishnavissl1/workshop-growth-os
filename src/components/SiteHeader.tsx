"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import { authClient } from "@/lib/supabaseBrowser";

const LINKS = [
  { href: "/program", label: "Program" },
  { href: "/certificate", label: "Certificate" },
  { href: "/faq", label: "FAQ" },
  { href: "/leaderboard", label: "Leaderboard" },
];

/**
 * Site header: logo/name on the left, one button per page on the right (hamburger menu on phones).
 * Plain anchors on purpose, so every click is a full page load to its own URL, never a scroll or in-page swap.
 * Rendered once in the root layout; hidden on /admin.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // undefined = still checking (render nothing, avoids a flash of the wrong buttons)
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const supabase = authClient();
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only auth state
      setSignedIn(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const linkCls = (href: string) =>
    `rounded-full px-4 py-2 text-[0.95rem] font-medium transition ${
      isActive(href) ? "bg-white/10 !text-white" : "!text-gray-300 hover:bg-white/5 hover:!text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-xl">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="flex min-w-0 items-center gap-3 !text-white" aria-label="NxtWave home">
          {/* NxtWave's white logo (already includes the name). Swap public/nxtwave-logo.svg to change it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nxtwave-logo.svg" alt="NxtWave" width={117} height={66} className="h-11 w-auto flex-shrink-0 sm:h-12" />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={linkCls(l.href)}>
              {l.label}
            </a>
          ))}
          <span className="mx-1 h-6 w-px bg-white/15" aria-hidden="true" />
          {signedIn === true && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/account" aria-current={isActive("/account") ? "page" : undefined} className={linkCls("/account")}>Account</a>
          )}
          {signedIn === false && (
            <>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/login" className={linkCls("/login")}>Log in</a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/signup" className="btn-secondary btn-sm">Sign up</a>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/register" className="btn-cta btn-sm ml-1 !text-[#111827]">
            Register free
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl border border-white/10 bg-black/85 p-3 backdrop-blur-xl md:hidden"
        >
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className={`${linkCls("/")} !py-3 text-lg ${pathname === "/" ? "bg-white/10" : ""}`}>Home</a>
          {LINKS.map((l) => (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a key={l.href} href={l.href} className={`${linkCls(l.href)} !py-3 text-lg`}>
              {l.label}
            </a>
          ))}
          <div className="my-1 h-px bg-white/10" aria-hidden="true" />
          {signedIn === true && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/account" className={`${linkCls("/account")} !py-3 text-lg`}>Account</a>
          )}
          {signedIn === false && (
            <>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/login" className={`${linkCls("/login")} !py-3 text-lg`}>Log in</a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/signup" className="btn-secondary btn-lg">Sign up</a>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/register" className="btn-cta btn-lg mt-1 !text-[#111827]">
            Register free
          </a>
        </nav>
      )}
      <span className="sr-only">{cfg.title}</span>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import { authClient } from "@/lib/supabaseBrowser";

const LINKS = [
  { href: "/program", label: "Program" },
  { href: "/certificate", label: "Certificate" },
  { href: "/evaluate", label: "Checker" },
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
      isActive(href) ? "bg-[#991B1B] !text-white" : "!text-[#991B1B] hover:bg-[#FBF2F3]"
    }`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-[#F0CDD0] bg-white px-4 py-3 shadow-lg shadow-slate-900/10">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        {/* The logo lives in the bar above. On phones, the workshop name sits beside the menu button. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="min-w-0 truncate text-[0.95rem] font-semibold !text-[#991B1B] md:hidden">{cfg.title}</a>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-between gap-1 px-2 md:flex lg:px-6">
          {[{ href: "/", label: "Home" }, ...LINKS].map((l) => (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={linkCls(l.href)}>
              {l.label}
            </a>
          ))}
          <span className="mx-1 h-6 w-px bg-[#F0CDD0]" aria-hidden="true" />
          {signedIn === true && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/account" aria-current={isActive("/account") ? "page" : undefined} className={linkCls("/account")}>Account</a>
          )}
          {signedIn === false && (
            <>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/login" className={linkCls("/login")}>Log in</a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/signup" className="btn-cta btn-sm">Sign up</a>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F0CDD0] bg-[#FBF2F3] text-xl text-[#991B1B] md:hidden"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl border border-[#F0CDD0] bg-white p-3 shadow-lg md:hidden"
        >
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className={`${linkCls("/")} !py-3 text-lg `}>Home</a>
          {LINKS.map((l) => (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a key={l.href} href={l.href} className={`${linkCls(l.href)} !py-3 text-lg`}>
              {l.label}
            </a>
          ))}
          <div className="my-1 h-px bg-[#F0CDD0]" aria-hidden="true" />
          {signedIn === true && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a href="/account" className={`${linkCls("/account")} !py-3 text-lg`}>Account</a>
          )}
          {signedIn === false && (
            <>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/login" className={`${linkCls("/login")} !py-3 text-lg`}>Log in</a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/signup" className="btn-cta btn-lg">Sign up</a>
            </>
          )}
        </nav>
      )}
      <span className="sr-only">{cfg.title}</span>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/supabaseBrowser";

/**
 * Wraps a page that needs an account. Signed in: shows the page. Signed out: sends the visitor to sign up
 * (with a link to log in) and brings them back to this exact page afterwards.
 *
 * The session is in localStorage (not cookies, so it works in WhatsApp's in-app browser), which means the
 * check has to run in the browser. If auth isn't configured we let people through rather than lock them out.
 */
export default function AuthGate({ children, refCode }: { children: React.ReactNode; refCode?: string }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const supabase = authClient();
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- auth not configured: don't block the page
      setOk(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setOk(true);
        return;
      }
      // Keep an invite's referral code so it survives the trip through sign up.
      if (refCode) {
        try {
          const prev = JSON.parse(localStorage.getItem("wgos") ?? "{}");
          localStorage.setItem("wgos", JSON.stringify({ ...prev, ref: refCode }));
        } catch {}
      }
      const next = window.location.pathname + window.location.search;
      window.location.replace(`/signup?next=${encodeURIComponent(next)}`);
    });
  }, [refCode]);

  if (!ok) {
    return (
      <div className="container-wide flex min-h-[50vh] items-center justify-center" role="status">
        <p className="text-slate-500">Checking your account…</p>
      </div>
    );
  }
  return <>{children}</>;
}

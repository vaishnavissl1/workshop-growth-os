"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/supabaseBrowser";

/**
 * The two buttons on the landing hero. Signed-out visitors log in (the login page offers "Create an account"
 * to anyone without one); signed-in visitors go straight to the workshop home page.
 */
export default function LandingActions() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    authClient()?.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href={signedIn ? "/home" : "/login?next=/home"} className="btn-cta btn-lg sm:min-w-[15rem]">
          {signedIn ? "Continue to the workshop" : "Log in"}
        </a>
        <a href="/brochure.pdf" download="AI-Workshop-Brochure.pdf" className="btn-secondary btn-lg sm:min-w-[15rem]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v3h16v-3" />
          </svg>
          Download brochure
        </a>
      </div>
      {!signedIn && (
        <p className="mt-5 text-[0.95rem] text-slate-300">
          No account yet?{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/signup?next=/home" className="font-semibold !text-white underline underline-offset-4">Create one</a>
        </p>
      )}
    </div>
  );
}

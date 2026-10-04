"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/supabaseBrowser";
import AuthShell, { Field, Notice, PasswordInput } from "@/components/auth/AuthShell";

/** Landing page for the link in the reset email. Supabase puts a recovery session in the URL; we then let them set a new password. */
export default function ResetForm() {
  const [state, setState] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = authClient();
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no auth client available (env missing)
      setState("invalid");
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) setState("ready");
    });
    // The recovery event may already have fired before we subscribed.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setState("ready");
    });
    const t = setTimeout(() => setState((s) => (s === "checking" ? "invalid" : s)), 4000);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    if (password !== String(f.get("confirm"))) return setError("The two passwords don't match.");
    setBusy(true);
    const { error: err } = (await authClient()?.auth.updateUser({ password })) ?? { error: { message: "unavailable" } };
    setBusy(false);
    if (err) {
      return setError(
        /same|different/i.test(err.message) ? "Choose a password you haven't used before." : "Could not update your password. The link may have expired.",
      );
    }
    setState("done");
  }

  if (state === "checking") {
    return (
      <AuthShell eyebrow="One moment" title="Checking your link">
        <p className="text-center text-gray-400">Verifying…</p>
      </AuthShell>
    );
  }

  if (state === "invalid") {
    return (
      <AuthShell eyebrow="Link problem" title="This link has expired">
        <div className="space-y-4 text-center">
          <p className="text-gray-300">Reset links work once and expire quickly. Ask for a fresh one.</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/forgot-password" className="btn-primary btn-lg">Send a new link</a>
        </div>
      </AuthShell>
    );
  }

  if (state === "done") {
    return (
      <AuthShell eyebrow="All set" title="Password updated">
        <div className="space-y-4 text-center">
          <p className="text-5xl" aria-hidden="true">✅</p>
          <p className="text-gray-300">You&apos;re signed in with your new password.</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/account" className="btn-primary btn-lg">Go to my account</a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Account help" title="Choose a new password">
      <form onSubmit={submit} className="space-y-5">
        <Field label="New password" hint="At least 8 characters">
          <PasswordInput id="password" name="password" autoComplete="new-password" minLength={8} />
        </Field>
        <Field label="Confirm new password">
          <PasswordInput id="confirm" name="confirm" autoComplete="new-password" minLength={8} />
        </Field>
        {error && <Notice tone="red">{error}</Notice>}
        <button className="btn-primary btn-lg w-full" disabled={busy}>
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}

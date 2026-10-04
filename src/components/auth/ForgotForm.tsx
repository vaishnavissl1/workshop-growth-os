"use client";

import { useState } from "react";
import { authClient } from "@/lib/supabaseBrowser";
import AuthShell, { Field, Notice } from "@/components/auth/AuthShell";

export default function ForgotForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const email = String(new FormData(e.currentTarget).get("email")).trim().toLowerCase();
    const supabase = authClient();
    if (!supabase) return setError("Accounts are not available right now.");
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (err && /rate|seconds|too many/i.test(err.message)) {
      return setError("Too many reset emails have been sent recently, so the email service is pausing for a while. Please try again in about an hour.");
    }
    // Same message whether or not the email has an account, so this page can't be used to look people up.
    setSent(email);
  }

  if (sent) {
    return (
      <AuthShell eyebrow="Check your inbox" title="Reset link sent">
        <div className="space-y-4 text-center">
          <p className="text-5xl" aria-hidden="true">📬</p>
          <p className="text-lg text-gray-200">
            If <strong>{sent}</strong> has an account, a reset link is on its way.
          </p>
          <p className="text-gray-400">The link opens a page where you choose a new password. It can take a minute to arrive.</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/login" className="btn-secondary btn-lg">Back to log in</a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account help"
      title="Forgot password?"
      lead="Enter your email and we'll send you a link to choose a new one."
      footer={
        <>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/login" className="font-semibold">← Back to log in</a>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className="field" placeholder="you@college.edu" />
        </Field>
        {error && <Notice tone="red">{error}</Notice>}
        <button className="btn-primary btn-lg w-full" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}

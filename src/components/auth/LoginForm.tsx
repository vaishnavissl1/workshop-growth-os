"use client";

import { useState } from "react";
import { authClient } from "@/lib/supabaseBrowser";
import AuthShell, { Field, Notice, PasswordInput } from "@/components/auth/AuthShell";

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const supabase = authClient();
    if (!supabase) return setError("Accounts are not available right now.");
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")).trim().toLowerCase(),
      password: String(f.get("password")),
    });
    setBusy(false);
    if (err) {
      setError(
        /confirm/i.test(err.message)
          ? "Please confirm your email first. Check your inbox for the link."
          : "That email and password don't match. Try again, or reset your password.",
      );
      return;
    }
    // Full page load: the header re-reads the new session and the account page opens fresh.
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.assign(next && next.startsWith("/") && !next.startsWith("//") ? next : "/account");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in"
      lead="Manage your workshop profile and invite link."
      footer={
        <>
          New here?{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/signup" className="font-semibold">Create an account</a>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className="field" placeholder="you@college.edu" />
        </Field>
        <Field label="Password">
          <PasswordInput id="password" name="password" autoComplete="current-password" />
        </Field>
        <p className="text-right text-sm">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/forgot-password">Forgot password?</a>
        </p>
        {error && <Notice tone="red">{error}</Notice>}
        <button className="btn-primary btn-lg w-full" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

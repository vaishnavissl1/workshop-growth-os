"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/supabaseBrowser";
import AuthShell, { Field, Notice, PasswordInput } from "@/components/auth/AuthShell";

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [nextQ, setNextQ] = useState("");

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL after mount
    if (n) setNextQ(`?next=${encodeURIComponent(n)}`);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const supabase = authClient();
    if (!supabase) return setError("Accounts are not available right now.");
    setBusy(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({
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
    // Reviewer / admin accounts go to the dashboard. The server checks the role and sets the admin cookie.
    const role = data.user?.app_metadata?.role;
    if (role === "reviewer" || role === "admin") {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session?.access_token}` },
      });
      if (res.ok) {
        window.location.assign("/admin");
        return;
      }
    }

    // Full page load: the header re-reads the new session and the account page opens fresh.
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.assign(next && next.startsWith("/") && !next.startsWith("//") ? next : "/account");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in"
      lead="Students manage their profile and invite link here. Reviewers go straight to the dashboard."
      footer={
        <>
          New here?{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href={`/signup${nextQ}`} className="font-semibold">Create an account</a>
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

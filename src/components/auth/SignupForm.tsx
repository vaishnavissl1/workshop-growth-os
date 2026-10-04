"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/supabaseBrowser";
import AuthShell, { Field, Notice, PasswordInput } from "@/components/auth/AuthShell";

export default function SignupForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [next, setNext] = useState("/register");

  // Where they were heading when they were sent here (only same-site paths are accepted).
  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL after mount
    if (n && n.startsWith("/") && !n.startsWith("//")) setNext(n);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim().toLowerCase();
    const password = String(f.get("password"));
    if (password !== String(f.get("confirm"))) return setError("The two passwords don't match.");
    const supabase = authClient();
    if (!supabase) return setError("Accounts are not available right now.");

    setBusy(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: String(f.get("name")).trim() },
        emailRedirectTo: `${window.location.origin}${next}`,
      },
    });
    setBusy(false);

    if (err) {
      return setError(
        /already|registered/i.test(err.message)
          ? "An account with this email already exists. Try logging in."
          : err.message.includes("rate")
            ? "Too many attempts. Please wait a few minutes and try again."
            : err.message,
      );
    }
    // Supabase hides whether an email already exists: a fake user comes back with no identities.
    if (data.user && data.user.identities?.length === 0) {
      return setError("An account with this email already exists. Try logging in.");
    }
    if (data.session) {
      // Email confirmation is off: they're signed in, so go straight to reserving a seat.
      window.location.assign(next);
      return;
    }
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <AuthShell eyebrow="One more step" title="Check your email">
        <div className="space-y-4 text-center">
          <p className="text-5xl" aria-hidden="true">📬</p>
          <p className="text-lg text-gray-200">
            We sent a confirmation link to <strong>{sentTo}</strong>.
          </p>
          <p className="text-gray-400">Open it to activate your account, then log in. It can take a minute to arrive; check spam too.</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/login" className="btn-primary btn-lg">Go to log in</a>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Create your account"
      title="Sign up"
      lead={next === "/register" ? "Save your details, edit them any time, and keep your invite link." : "Create a free account to continue. It takes a minute, and you'll pick up right where you left off."}
      footer={
        <>
          Already have an account?{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold">Log in</a>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Full name">
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" className="field" placeholder="Name on your certificate" />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className="field" placeholder="you@college.edu" />
        </Field>
        <Field label="Password" hint="At least 8 characters">
          <PasswordInput id="password" name="password" autoComplete="new-password" minLength={8} />
        </Field>
        <Field label="Confirm password">
          <PasswordInput id="confirm" name="confirm" autoComplete="new-password" minLength={8} />
        </Field>
        {error && <Notice tone="red">{error}</Notice>}
        <button className="btn-primary btn-lg w-full" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-gray-400">
          Signing up doesn&apos;t reserve a seat. You can do that once you&apos;re in.
        </p>
      </form>
    </AuthShell>
  );
}

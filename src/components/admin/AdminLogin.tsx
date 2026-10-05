"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageGlow from "@/components/PageGlow";
import { authClient } from "@/lib/supabaseBrowser";

/**
 * Dashboard sign-in with an email and password. The account's role (admin or reviewer) is stored where only
 * the server can write it; /api/admin/session checks it and sets the dashboard cookie.
 */
export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const supabase = authClient();
    if (!supabase) return setError("Sign-in is not available right now.");
    setBusy(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")).trim().toLowerCase(),
      password: String(f.get("password")),
    });
    if (err || !data.session) {
      setBusy(false);
      return setError("That email and password don't match.");
    }
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${data.session.access_token}` },
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else {
      await supabase.auth.signOut();
      setError("This account doesn't have dashboard access.");
    }
  }

  return (
    <>
      <PageGlow tone="blue" />
      <div className="container-page animate-fade-in-up py-16">
        <form onSubmit={submit} className="card mx-auto max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">Growth OS dashboard</h1>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="admin-email">Email</label>
            <input id="admin-email" name="email" type="email" required autoComplete="email" className="field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold" htmlFor="admin-password">Password</label>
            <input id="admin-password" name="password" type="password" required autoComplete="current-password" className="field" />
          </div>
          {error && <p role="alert" className="notice-red p-3 text-sm font-medium">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? "Checking…" : "Sign in"}</button>
        </form>
      </div>
    </>
  );
}

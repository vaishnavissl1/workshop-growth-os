"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError("Wrong password.");
  }

  return (
    <div className="container-page animate-fade-in-up py-16">
      <form onSubmit={submit} className="card mx-auto max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Growth OS admin</h1>
        <p className="text-sm text-[var(--color-muted)]">Reviewer and admin passwords both work. Reviewers get a read-only view.</p>
        <label className="block text-sm font-semibold" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
        />
        {error && <p role="alert" className="notice-red p-3 text-sm font-medium">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? "Checking…" : "Sign in"}</button>
      </form>
    </div>
  );
}

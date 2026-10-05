"use client";

import { useState } from "react";

const TOPICS = [
  ["registration", "Registering or my seat"],
  ["workshop", "The workshop itself"],
  ["certificate", "Certificate or project"],
  ["account", "My account or password"],
  ["other", "Something else"],
];

export default function HelpForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/help", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const d = await res.json();
      if (d.ok) setSent(true);
      else setError(d.message ?? "Could not send your question. Please try again.");
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="notice-green p-6 text-center">
        <p className="text-lg font-semibold">Your question is with the team.</p>
        <p className="mt-1 text-[0.95rem]">The team will reply to you by email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Your name
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" className="field mt-1" />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input name="email" type="email" required maxLength={160} autoComplete="email" className="field mt-1" placeholder="you@college.edu" />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        What is it about?
        <select name="topic" required defaultValue="registration" className="field mt-1">
          {TOPICS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Your question
        <textarea name="message" required minLength={10} maxLength={2000} rows={5} className="field mt-1" placeholder="Tell us what happened or what you need." />
      </label>
      {/* honeypot: hidden from people, filled by bots */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {error && <p role="alert" className="notice-red p-3 text-sm font-medium">{error}</p>}
      <button className="btn-cta btn-lg w-full sm:w-auto" disabled={busy}>{busy ? "Sending…" : "Send my question"}</button>
    </form>
  );
}

"use client";

import { useState } from "react";
import type { Evaluation } from "@/lib/evaluate";
import { track } from "@/lib/analytics";

export default function ProjectChecker() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [res, setRes] = useState<Evaluation | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setRes(null);
    const space = String(new FormData(e.currentTarget).get("space") ?? "");
    let refCode: string | null = null;
    try {
      refCode = localStorage.getItem("wgos_me");
    } catch {}
    setBusy(true);
    try {
      const r = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ space, refCode }),
      });
      const d = await r.json();
      if (!d.ok) setError(d.message ?? "Something went wrong. Please try again.");
      else {
        setRes(d);
        track("project_checked", { score: d.score, grade: d.grade });
      }
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const pct = res ? Math.round((res.score / res.max) * 100) : 0;

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="card !p-8 sm:!p-10">
        <label htmlFor="space" className="mb-2 block text-sm font-semibold text-slate-800">
          Your Hugging Face Space link
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="space"
            name="space"
            required
            className="field"
            placeholder="huggingface.co/spaces/yourname/your-app"
            autoComplete="off"
            spellCheck={false}
          />
          <button className="btn-cta btn-lg flex-shrink-0" disabled={busy}>
            {busy ? "Checking…" : "Check my project"}
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-500">The Space must be public. We read its settings and code; nothing is changed.</p>
        {error && <p role="alert" className="notice-red mt-4 p-4 text-[0.95rem] font-medium">{error}</p>}
      </form>

      {res && (
        <section aria-live="polite" className="space-y-6">
          <div className="card !p-8 sm:!p-10">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div
                role="img"
                aria-label={`Score ${res.score} out of ${res.max}`}
                className="flex h-36 w-36 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: `conic-gradient(#991B1B ${pct * 3.6}deg, #E2E8F0 0deg)` }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-4xl font-bold">{res.score}</span>
                  <span className="text-xs text-slate-500">out of {res.max}</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="eyebrow mb-1">{res.grade}</p>
                <h2 className="text-2xl font-bold">{res.title}</h2>
                <p className="mt-1 break-all text-sm text-slate-500">
                  <a href={res.url} target="_blank" rel="noopener noreferrer">{res.space}</a>
                  {res.sdk ? ` · ${res.sdk}` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="card !p-8 sm:!p-10">
            <h3 className="mb-1 text-xl font-bold">Automated checks</h3>
            <p className="mb-5 text-sm text-slate-500">Rule-based: read from your Space&apos;s settings and code.</p>
            <ul className="space-y-4">
              {res.checks.map((c) => (
                <li key={c.id} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      c.pass ? "bg-green-100 text-green-800" : c.earned > 0 ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {c.pass ? "✓" : c.earned > 0 ? "!" : "✕"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap justify-between gap-x-3 font-semibold">
                      <span>
                        <span className="sr-only">{c.pass ? "Passed: " : c.earned > 0 ? "Partly passed: " : "Not passed: "}</span>
                        {c.label}
                      </span>
                      <span className="text-sm font-medium text-slate-500">{c.earned} / {c.points}</span>
                    </p>
                    <p className="text-[0.95rem] text-slate-600">{c.detail}</p>
                    {c.tip && <p className="mt-1 text-[0.95rem] font-medium text-[#991B1B]">Next: {c.tip}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card !p-8 sm:!p-10">
            <h3 className="mb-1 text-xl font-bold">AI review</h3>
            {res.review ? (
              <>
                <p className="mb-5 text-sm text-slate-500">Written by an AI model after reading your code. Treat it as a second opinion.</p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 font-semibold text-green-800">What works</p>
                    <ul className="space-y-2 text-[0.95rem] text-slate-600">
                      {res.review.strengths.map((s) => <li key={s}>• {s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-[#991B1B]">Try next</p>
                    <ul className="space-y-2 text-[0.95rem] text-slate-600">
                      {res.review.improvements.map((s) => <li key={s}>• {s}</li>)}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-[0.95rem] text-slate-600">
                The written AI review isn&apos;t switched on for this prototype. The score above comes from the automated checks only.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { LIVE_STEPS, type LiveSummary } from "@/lib/live";

/** A stable id for this browser. The student's invite code if they have one, otherwise a random id. No name is sent. */
function attendeeId() {
  try {
    const mine = localStorage.getItem("wgos_me");
    if (mine && /^[A-Za-z0-9_-]{4,40}$/.test(mine)) return mine;
    let id = localStorage.getItem("wgos_live");
    if (!id) {
      id = "a-" + Math.random().toString(36).slice(2, 12);
      localStorage.setItem("wgos_live", id);
    }
    return id;
  } catch {
    return "a-" + Math.random().toString(36).slice(2, 12);
  }
}

export default function LiveChecklist({ session }: { session: string }) {
  const [me, setMe] = useState("");
  const [data, setData] = useState<LiveSummary | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async (id: string) => {
    try {
      const r = await fetch(`/api/live?session=${session}&attendee=${id}`, { cache: "no-store" });
      const d = await r.json();
      if (d.ok) setData(d);
    } catch {}
  }, [session]);

  useEffect(() => {
    const id = attendeeId();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only id from localStorage
    setMe(id);
    refresh(id);
    const t = setInterval(() => refresh(id), 10000);
    return () => clearInterval(t);
  }, [refresh]);

  async function toggle(step: number, done: boolean) {
    setBusy(step);
    setError("");
    try {
      const r = await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, attendee: me, step, done }),
      });
      const d = await r.json();
      if (d.ok) setData(d);
      else setError(d.message ?? "Could not save. Try again.");
    } catch {
      setError("Network problem. Try again.");
    } finally {
      setBusy(null);
    }
  }

  const mine = new Set(data?.mine ?? []);
  const doneCount = mine.size;

  return (
    <div className="space-y-6">
      <div className="card !p-8">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Your progress</h2>
          <p className="text-sm font-semibold text-slate-500">{doneCount} of {LIVE_STEPS.length}</p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuemin={0} aria-valuemax={LIVE_STEPS.length} aria-valuenow={doneCount}>
          <div className="h-full rounded-full bg-[#991B1B] transition-all" style={{ width: `${(doneCount / LIVE_STEPS.length) * 100}%` }} />
        </div>
        <ul className="mt-6 space-y-3">
          {LIVE_STEPS.map((s) => {
            const done = mine.has(s.step);
            return (
              <li key={s.step}>
                <button
                  type="button"
                  onClick={() => toggle(s.step, !done)}
                  disabled={!me || busy === s.step}
                  aria-pressed={done}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    done ? "border-green-300 bg-green-50" : "border-slate-200 bg-white hover:border-[#E5B8BB]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-bold ${
                      done ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {done ? "✓" : s.step}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{s.label}</span>
                    <span className="block text-sm text-slate-500">{s.help}</span>
                  </span>
                  <span className="text-sm font-semibold text-slate-500">{done ? "Done" : "Tap when done"}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {error && <p role="alert" className="notice-red mt-4 p-3 text-sm font-medium">{error}</p>}
        {doneCount === LIVE_STEPS.length && (
          <p className="notice-green mt-5 p-4 text-[0.95rem] font-semibold">All five done. Add your live link to your resume tonight.</p>
        )}
      </div>

      <p className="text-center text-sm text-slate-500">
        {data ? `${data.total} ${data.total === 1 ? "person is" : "people are"} building in this session.` : "Connecting…"} Stuck on a step? Leave it unticked: the host sees where people need help.
      </p>
    </div>
  );
}

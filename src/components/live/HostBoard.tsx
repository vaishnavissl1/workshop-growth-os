"use client";

import { useEffect, useState } from "react";
import type { LiveSummary } from "@/lib/live";

/** Host view: how far the room has got, and the step where most people are stopped. Refreshes every 10 seconds. */
export default function HostBoard({ session, initial, simulated }: { session: string; initial: LiveSummary; simulated: boolean }) {
  const [data, setData] = useState(initial);
  const [updated, setUpdated] = useState("");

  useEffect(() => {
    const tick = async () => {
      try {
        const r = await fetch(`/api/live?session=${session}`, { cache: "no-store" });
        const d = await r.json();
        if (d.ok) {
          setData(d);
          setUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }
      } catch {}
    };
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [session]);

  const total = data.total;
  const stuck = data.steps.find((s) => s.step === data.stuckAt);
  const finished = data.steps[data.steps.length - 1].reached;

  return (
    <div className="space-y-6">
      {simulated && (
        <p className="notice-amber p-3 text-sm">
          Simulated session: these attendees are generated to show how the board behaves. It is not a real workshop.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="card !p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">In the room</p>
          <p className="mt-1 text-3xl font-bold">{total}</p>
        </div>
        <div className="card !p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Finished all 5</p>
          <p className="mt-1 text-3xl font-bold">{finished}<span className="text-base font-medium text-slate-500"> {total ? `(${Math.round((finished / total) * 100)}%)` : ""}</span></p>
        </div>
        <div className="card col-span-2 !p-5 md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Help needed at</p>
          <p className="mt-1 text-xl font-bold text-[#991B1B]">{stuck ? `Step ${stuck.step + 1}` : "Nobody stuck"}</p>
          {stuck && <p className="text-sm text-slate-500">{stuck.stuckHere} stopped after “{stuck.label}”</p>}
        </div>
      </div>

      <div className="card !p-8">
        <h2 className="mb-1 text-xl font-bold">Progress by step</h2>
        <p className="mb-6 text-sm text-slate-500">The bar is how many reached the step. The amber number is how many are stopped there.</p>
        <ol className="space-y-5">
          {data.steps.map((s) => {
            const pct = total ? Math.round((s.reached / total) * 100) : 0;
            const worst = s.step === data.stuckAt;
            return (
              <li key={s.step}>
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-semibold">
                    {s.step}. {s.label}
                    {worst && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">Most stuck here</span>}
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>{s.reached}</strong> reached ({pct}%)
                    {s.stuckHere > 0 && <span className="ml-2 font-semibold text-amber-800">{s.stuckHere} stopped here</span>}
                  </p>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${pct}% reached step ${s.step}`}>
                  <div className={`h-full rounded-full transition-all ${worst ? "bg-[#D97706]" : "bg-[#991B1B]"}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-xs text-slate-500">Refreshes every 10 seconds{updated ? ` · last update ${updated}` : ""}. Counts only: no names are shown or stored.</p>
      </div>
    </div>
  );
}

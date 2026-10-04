"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Live countdown to the real registration close date from config. Renders nothing once that date has passed. */
export default function Countdown({ closesAt, label = "Registration closes in" }: { closesAt: string; label?: string }) {
  const target = new Date(closesAt).getTime();
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left === null || left <= 0) return null;
  const { d, h, m, s } = parts(left);
  const cells: [number, string][] = [[d, "days"], [h, "hours"], [m, "min"], [s, "sec"]];

  return (
    <div role="timer" aria-label={`${label} ${d} days ${h} hours ${m} minutes`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {cells.map(([n, u]) => (
          <div key={u} className="rounded-xl border border-slate-200 bg-white py-2 text-center">
            <p className="text-2xl font-bold tabular-nums text-[var(--color-primary)]">{String(n).padStart(2, "0")}</p>
            <p className="text-xs text-slate-500">{u}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

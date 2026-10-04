"use client";

import { useEffect, useState } from "react";

/** Seats-left counter. Starts from the server-rendered value and refreshes from /api/seats every 15s. */
export default function SeatsCounter({ initial, cap }: { initial: number; cap: number }) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    const tick = async () => {
      try {
        const r = await fetch("/api/seats", { cache: "no-store" });
        const d = await r.json();
        if (typeof d.left === "number") setLeft(d.left);
      } catch {}
    };
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="text-center text-sm font-semibold">
      <span className="text-[var(--color-success)]">{left}</span> of {cap} seats left in Session 1
    </p>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageGlow from "@/components/PageGlow";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import type { AdminData, Status } from "@/lib/stats";
import { AMBASSADOR_REACH, META_SPEND_NET } from "@/lib/stats";

const CHIP: Record<Status, string> = {
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-900",
  red: "bg-red-100 text-red-800",
};
const LABEL: Record<Status, string> = { green: "On track", amber: "Watch", red: "Act" };
const TIP = { background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 8px 24px rgba(15,23,42,0.10)" };
const MODES = [
  ["sim", "Simulated"],
  ["real", "Real"],
  ["all", "All"],
] as const;
const SCENARIOS = ["pessimistic", "base", "optimistic"] as const;

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card !p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      {sub && <p className="text-xs text-[var(--color-muted)]">{sub}</p>}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="flex justify-between font-semibold">
        {label}
        <span className="text-[var(--color-primary)]">{fmt(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-8 w-full accent-[#991B1B]"
      />
    </label>
  );
}

export default function Dashboard({ data, role }: { data: AdminData; role: "admin" | "reviewer" }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  // Scenario simulator: pure client-side maths, no database calls (PLAN.md §3 base assumptions as defaults).
  const [tpoConv, setTpoConv] = useState(4);
  const [waCr, setWaCr] = useState(1.5);
  const [k, setK] = useState(0.25);
  const [cpr, setCpr] = useState(18);
  const proj = useMemo(() => {
    const tpo = 15 * 400 * (tpoConv / 100);
    const amb = AMBASSADOR_REACH * (waCr / 100);
    const ref = (tpo + amb) * k;
    const meta = META_SPEND_NET / cpr;
    const core = tpo + amb + ref;
    const d3 = (core * cfg.dayPlan[2].cumulativeTarget) / cfg.dayPlan[6].cumulativeTarget;
    return { tpo, amb, ref, meta, core, total: core + meta, d3 };
  }, [tpoConv, waCr, k, cpr]);
  const firedAtD3 = proj.d3 < 200;

  async function simulate(scenario: string, seed: boolean) {
    setBusy(scenario + seed);
    setMsg("");
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, seed }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy("");
    setMsg(d.message ?? (res.ok ? "Done." : "Failed."));
    if (res.ok) router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  const { kpi } = data;
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
      <PageGlow tone="blue" />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Workshop Growth OS</h1>
          <p className="text-sm text-[var(--color-muted)]">
            {role === "admin" ? "Admin" : "Reviewer (read-only)"} · showing{" "}
            <strong>{data.mode === "sim" ? "simulated" : data.mode === "real" ? "real" : "all"}</strong> data ·{" "}
            {data.realCount} real / {data.simCount} simulated rows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Data mode" className="flex overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold">
            {MODES.map(([m, label]) => (
              <Link
                key={m}
                href={`/admin?mode=${m}`}
                className={`px-3 py-2 ${data.mode === m ? "bg-[var(--color-primary)] !text-white" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <button onClick={logout} className="text-sm font-semibold underline">Sign out</button>
        </div>
      </header>

      {data.mode !== "real" && (
        <p className="notice-amber p-3 text-sm">
          Simulated data: every number here is generated from the plan&apos;s assumptions, not measured from real students.
        </p>
      )}

      {/* 1. KPI strip */}
      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Registrations" value={`${kpi.total}`} sub={`target ${cfg.registrationTarget}`} />
        <Kpi label="Verified" value={`${kpi.verified}`} sub={kpi.total ? `${Math.round((kpi.verified / kpi.total) * 100)}% of total` : undefined} />
        <Kpi label="Sessions filled (real)" value={`${kpi.s1}/${cfg.seatCap}`} sub={`Session 2: ${kpi.s2}`} />
        <Kpi label="₹ per verified reg" value={kpi.perVerified ? `₹${kpi.perVerified.toFixed(1)}` : "–"} sub={`of ₹${cfg.totalBudget} budget`} />
      </section>

      {/* Charts */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 text-base font-bold">Cumulative vs the 500 goal</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.daily} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip contentStyle={TIP} labelStyle={{ color: "#1E293B" }} itemStyle={{ color: "#475569" }} cursor={{ fill: "rgba(15,23,42,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#475569" }} />
                <ReferenceLine y={cfg.registrationTarget} stroke="#DC2626" strokeDasharray="4 4" label={{ value: "500", fontSize: 11, fill: "#DC2626" }} />
                <Line isAnimationActive={false} type="monotone" dataKey="target" name="Daily target" stroke="#94A3B8" strokeDasharray="5 4" dot={false} />
                <Line isAnimationActive={false} type="monotone" dataKey="actual" name="Actual" stroke="#991B1B" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h2 className="mb-2 text-base font-bold">Funnel</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.funnel} layout="vertical" margin={{ left: 20, right: 24 }}>
                <CartesianGrid stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis type="category" dataKey="step" width={110} tick={{ fontSize: 12, fill: "#64748B" }} />
                <Tooltip contentStyle={TIP} labelStyle={{ color: "#1E293B" }} itemStyle={{ color: "#475569" }} cursor={{ fill: "rgba(15,23,42,0.04)" }} />
                <Bar isAnimationActive={false} dataKey="value" name="Students" fill="#991B1B" radius={[0, 6, 6, 0]} label={{ position: "right", fontSize: 12, fill: "#475569" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 2. Channel breakdown */}
      <section className="card overflow-x-auto">
        <h2 className="mb-3 text-base font-bold">Channels</h2>
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--color-muted)]">
              <th className="pb-2">Channel</th>
              <th className="pb-2 text-right">Regs</th>
              <th className="pb-2 text-right">Verified</th>
              <th className="pb-2 text-right">Cost (₹)</th>
              <th className="pb-2 text-right">₹ / verified</th>
            </tr>
          </thead>
          <tbody>
            {data.channels.map((c) => (
              <tr key={c.source} className="border-t border-[var(--color-border)]">
                <td className="py-2 font-semibold">{c.source === "tpo" ? "TPO" : c.source[0].toUpperCase() + c.source.slice(1)}</td>
                <td className="py-2 text-right">{c.count}</td>
                <td className="py-2 text-right">{c.verified}</td>
                <td className="py-2 text-right">{c.cost}</td>
                <td className="py-2 text-right">{c.perVerified ? c.perVerified.toFixed(1) : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Costs are what each channel&apos;s budget line is for: referral prizes ₹700, top ambassador ₹300, Meta test ₹500 (the other ₹500 is the D4 reserve).
        </p>
      </section>

      {/* 3. Decision rules */}
      <section className="card">
        <h2 className="mb-3 text-base font-bold">Decision rules (R0–R6)</h2>
        <ul className="space-y-3">
          {data.rules.map((r) => (
            <li key={r.id} className="grid gap-1 border-t border-[var(--color-border)] pt-3 first:border-0 first:pt-0 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4">
              <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${CHIP[r.status]}`}>
                {r.id} · {LABEL[r.status]}
              </span>
              <div className="text-sm">
                <p className="font-semibold">{r.name}</p>
                <p className="text-[var(--color-muted)]">{r.action}</p>
              </div>
              <p className="text-sm sm:text-right">
                <strong>{r.value}</strong>
                <span className="block text-xs text-[var(--color-muted)]">threshold {r.threshold}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Scenario simulator */}
      <section className="card space-y-4">
        <h2 className="text-base font-bold">Scenario simulator</h2>
        <p className="text-sm text-[var(--color-muted)]">Starts from the plan&apos;s base assumptions. Moves live in your browser; nothing is saved.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Slider label="TPO conversion" value={tpoConv} min={1} max={8} step={0.5} fmt={(n) => `${n}%`} onChange={setTpoConv} />
          <Slider label="WhatsApp conversion (ambassadors)" value={waCr} min={0.5} max={3} step={0.1} fmt={(n) => `${n.toFixed(1)}%`} onChange={setWaCr} />
          <Slider label="Referral rate (k)" value={k} min={0.05} max={0.5} step={0.01} fmt={(n) => n.toFixed(2)} onChange={setK} />
          <Slider label="Meta cost per registration" value={cpr} min={8} max={60} step={1} fmt={(n) => `₹${n}`} onChange={setCpr} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
          <Kpi label="TPO" value={`${Math.round(proj.tpo)}`} />
          <Kpi label="Ambassadors" value={`${Math.round(proj.amb)}`} />
          <Kpi label="Referral" value={`${Math.round(proj.ref)}`} />
          <Kpi label="Meta (upside)" value={`${Math.round(proj.meta)}`} />
          <Kpi label="Projected total" value={`${Math.round(proj.total)}`} sub={proj.total >= 500 ? "meets 500" : `${Math.round(500 - proj.total)} short of 500`} />
        </div>
        <p className={`rounded-xl p-3 text-sm font-semibold ${firedAtD3 ? CHIP.red : CHIP.green}`}>
          Projected D3 cumulative ≈ {Math.round(proj.d3)}: {firedAtD3 ? "R1 fires. Pull the recovery levers." : "R1 stays green."}
        </p>
      </section>

      {/* Load scenario (admin only) */}
      <section className="card space-y-3">
        <h2 className="text-base font-bold">Load scenario into the database</h2>
        {role === "admin" ? (
          <>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s) => (
                <button key={s} disabled={!!busy} onClick={() => simulate(s, true)} className="btn-secondary !px-4 capitalize">
                  {busy === s + true ? "Loading…" : `Load ${s}`}
                </button>
              ))}
              <button disabled={!!busy} onClick={() => simulate("base", false)} className="btn-secondary !px-4">
                {busy === "basefalse" ? "Clearing…" : "Clear simulated data"}
              </button>
            </div>
            {msg && <p role="status" className="text-sm">{msg}</p>}
          </>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">Read-only for reviewers. The base scenario is pre-loaded.</p>
        )}
      </section>

      <section className="card space-y-3">
        <h2 className="text-base font-bold">Workshop day</h2>
        <p className="text-sm text-[var(--color-muted)]">
          During the hour, students tick off five checkpoints and this board shows where the room is stuck.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/live/demo/host" className="btn-secondary btn-sm">Host board (simulated session)</Link>
          <Link href="/live/session-1/host" className="btn-secondary btn-sm">Host board (Session 1)</Link>
          <Link href="/live/session-1" className="btn-secondary btn-sm">Attendee checklist</Link>
        </div>
      </section>

      <section className="card text-sm">
        <h2 className="mb-1 text-base font-bold">Data access, by design</h2>
        <p className="text-[var(--color-muted)]">
          The two leaderboard views (<code>leaderboard_public</code>, <code>college_leaderboard</code>) show as &quot;UNRESTRICTED&quot; in
          Supabase on purpose. Views can&apos;t have row-level security, so access is controlled by their columns and a SELECT-only grant. They
          expose first name, college, invite code and counts only: no phone, email or surname. Every table is locked to the server.
        </p>
      </section>

    </div>
  );
}

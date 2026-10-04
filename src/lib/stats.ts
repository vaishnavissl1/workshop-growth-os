import { WORKSHOP_CONFIG as cfg } from "@/config";
import { db } from "@/lib/supabase";

export type Mode = "real" | "sim" | "all";

export const SOURCES = ["direct", "referral", "ambassador", "meta", "tpo"] as const;

/** What each channel cost out of the ₹2,000 (PLAN.md §3 budget table). */
export const CHANNEL_COST: Record<(typeof SOURCES)[number], number> = {
  direct: 0,
  referral: cfg.referralRewards.reduce((n, r) => n + r.amountINR, 0),
  ambassador: cfg.ambassadorReward.amountINR,
  meta: cfg.metaTestBudget,
  tpo: 0,
};

/** Reach assumed for the ambassador channel (30 ambassadors × 3 groups × 150 members). Assumption, not measured. */
export const AMBASSADOR_REACH = 30 * 3 * 150;
/** Meta ad spend actually reaching Meta after 18% GST on ₹500. */
export const META_SPEND_NET = Math.round(cfg.metaTestBudget / 1.18);

type Row = {
  created_at: string;
  source: (typeof SOURCES)[number];
  ambassador_code: string | null;
  college: string;
  is_verified: boolean;
  session: number;
  is_simulated: boolean;
  referred_by: string | null;
};

async function fetchAll(): Promise<Row[]> {
  const supabase = db();
  if (!supabase) return [];
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("registrations")
      .select("created_at, source, ambassador_code, college, is_verified, session, is_simulated, referred_by")
      .order("created_at")
      .range(from, from + 999);
    if (error || !data?.length) break;
    rows.push(...(data as Row[]));
    if (data.length < 1000) break;
  }
  return rows;
}

export type Status = "green" | "amber" | "red";
export type Rule = { id: string; name: string; value: string; threshold: string; status: Status; action: string };

export async function adminData(requested?: Mode) {
  const all = await fetchAll();
  const simCount = all.filter((r) => r.is_simulated).length;
  const realCount = all.length - simCount;
  const mode: Mode = requested ?? (simCount > 0 ? "sim" : "real");
  const rows = all.filter((r) => (mode === "all" ? true : mode === "sim" ? r.is_simulated : !r.is_simulated));

  const total = rows.length;
  const verified = rows.filter((r) => r.is_verified).length;
  const s1 = all.filter((r) => !r.is_simulated && r.session === 1).length;
  const s2 = all.filter((r) => !r.is_simulated && r.session === 2).length;

  const channels = SOURCES.map((s) => {
    const rs = rows.filter((r) => r.source === s);
    const v = rs.filter((r) => r.is_verified).length;
    const cost = CHANNEL_COST[s];
    return { source: s, count: rs.length, verified: v, cost, perVerified: v ? cost / v : null };
  });

  // Day buckets from campaign start (IST midnight). Rows before Day 1 are shown in D1.
  const start = new Date(cfg.campaignStart).getTime();
  const dayOf = (iso: string) => Math.min(7, Math.max(1, Math.floor((new Date(iso).getTime() - start) / 86400000) + 1));
  const perDay = Array(7).fill(0);
  rows.forEach((r) => perDay[dayOf(r.created_at) - 1]++);
  let run = 0;
  const daily = cfg.dayPlan.map((d, i) => {
    run += perDay[i];
    return { day: d.label, actual: run, target: d.cumulativeTarget, goal: cfg.registrationTarget };
  });

  const referred = rows.filter((r) => r.source === "referral").length;
  const referrers = new Set(rows.filter((r) => r.referred_by).map((r) => r.referred_by)).size;
  const funnel = [
    { step: "Registered", value: total },
    { step: "Verified", value: verified },
    { step: "Referred a friend", value: referrers },
    { step: "Friends who joined", value: referred },
  ];

  const cumD3 = daily[2].actual;
  const k = total - referred > 0 ? referred / (total - referred) : 0;
  const ambRegs = rows.filter((r) => r.source === "ambassador").length;
  const ambConv = (ambRegs / AMBASSADOR_REACH) * 100;
  const tpoColleges = new Set(rows.filter((r) => r.source === "tpo").map((r) => r.college)).size;
  const verifiedShare = total ? (verified / total) * 100 : 0;
  const metaVerified = rows.filter((r) => r.source === "meta" && r.is_verified).length;
  const metaCpr = metaVerified ? META_SPEND_NET / metaVerified : null;
  const has = total > 0;

  const rules: Rule[] = [
    {
      id: "R0",
      name: "Replace assumptions with measured rates",
      value: has ? `TPO 4% / ambassador ${ambConv.toFixed(1)}% / k ${k.toFixed(2)}` : "no data",
      threshold: "Re-run simulator with D1–D2 measured rates",
      status: "amber",
      action: "Plug measured conversion and k into the scenario simulator below.",
    },
    {
      id: "R1",
      name: "Cumulative at end of D3",
      value: String(cumD3),
      threshold: "≥ 200",
      status: !has ? "amber" : cumD3 >= 200 ? "green" : cumD3 >= 160 ? "amber" : "red",
      action: "Below 200: contact +40 colleges, double ambassadors to 60, show the referral reward.",
    },
    {
      id: "R2",
      name: "Ambassador-link conversion (vs assumed reach)",
      value: `${ambConv.toFixed(2)}%`,
      threshold: "≥ 1%",
      status: !has ? "amber" : ambConv >= 1 ? "green" : ambConv >= 0.8 ? "amber" : "red",
      action: "Below 1% after 24h: switch ambassador kits to the winning A/B headline.",
    },
    {
      id: "R3",
      name: "Referral k-factor",
      value: k.toFixed(2),
      threshold: "≥ 0.15",
      status: !has ? "amber" : k >= 0.15 ? "green" : k >= 0.1 ? "amber" : "red",
      action: "Below 0.15 by D4: show the reward on the thanks page.",
    },
    {
      id: "R4",
      name: "TPO colleges converting",
      value: String(tpoColleges),
      threshold: "≥ 8",
      status: !has ? "amber" : tpoColleges >= 8 ? "green" : tpoColleges >= 5 ? "amber" : "red",
      action: "Below 8 by D2: contact 40 more colleges.",
    },
    {
      id: "R5",
      name: "Verified share",
      value: `${verifiedShare.toFixed(0)}%`,
      threshold: "≥ 75%",
      status: !has ? "amber" : verifiedShare >= 75 ? "green" : verifiedShare >= 65 ? "amber" : "red",
      action: "Below 75%: tighten targeting; drop the channel or ambassador with the lowest verified %.",
    },
    {
      id: "R6",
      name: "Meta cost per verified registration",
      value: metaCpr === null ? "no Meta data" : `₹${metaCpr.toFixed(1)}`,
      threshold: "≤ ₹15 scale · > ₹25 stop",
      status: metaCpr === null ? "amber" : metaCpr <= 15 ? "green" : metaCpr <= 25 ? "amber" : "red",
      action: "≤ ₹15: put the D4 reserve into Meta. > ₹25: stop Meta, reserve goes to an extra referral prize tier.",
    },
  ];

  return {
    mode,
    simCount,
    realCount,
    kpi: {
      total,
      verified,
      s1,
      s2,
      perVerified: verified ? cfg.totalBudget / verified : null,
    },
    channels,
    daily,
    funnel,
    rules,
  };
}

export type AdminData = Awaited<ReturnType<typeof adminData>>;

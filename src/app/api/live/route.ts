import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { ATTENDEE_RE, LIVE_STEPS, SESSION_RE, summarise } from "@/lib/live";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const LIMIT = 120; // ticks per network per 10 min: a classroom on one Wi-Fi, five steps each

async function rowsFor(session: string) {
  const { data } = (await db()?.from("checkpoints").select("attendee, step").eq("session", session).limit(10000)) ?? { data: null };
  return (data ?? []) as { attendee: string; step: number }[];
}

/** Counts for a session. Returns numbers only, plus the caller's own ticked steps when they pass their attendee id. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const session = q.get("session") ?? "";
  const attendee = q.get("attendee") ?? undefined;
  if (!SESSION_RE.test(session)) return NextResponse.json({ ok: false, message: "Unknown session." }, { status: 400 });
  const me = attendee && ATTENDEE_RE.test(attendee) ? attendee : undefined;
  return NextResponse.json({ ok: true, ...summarise(session, await rowsFor(session), me) });
}

/** Tick or untick one checkpoint for one attendee. */
export async function POST(req: Request) {
  const supabase = db();
  if (!supabase) return NextResponse.json({ ok: false, message: "Not available right now." }, { status: 503 });

  const b = await req.json().catch(() => ({}));
  const session = typeof b.session === "string" ? b.session : "";
  const attendee = typeof b.attendee === "string" ? b.attendee : "";
  const step = Number(b.step);
  if (!SESSION_RE.test(session) || !ATTENDEE_RE.test(attendee) || !LIVE_STEPS.some((s) => s.step === step)) {
    return NextResponse.json({ ok: false, message: "Bad request." }, { status: 400 });
  }
  // simulated attendees are seeded by the server only
  if (attendee.startsWith("sim-")) return NextResponse.json({ ok: false, message: "Bad request." }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const ipHash = createHash("sha256").update(`live:${ip}${process.env.RATE_LIMIT_SALT ?? "wgos"}`).digest("hex");
  const since = new Date(Date.now() - 10 * 60_000).toISOString();
  const { count } = await supabase.from("rate_limits").select("*", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= LIMIT) return NextResponse.json({ ok: false, message: "Too many updates. Try again shortly." }, { status: 429 });
  await supabase.from("rate_limits").insert({ ip_hash: ipHash });

  if (b.done === false) {
    await supabase.from("checkpoints").delete().eq("session", session).eq("attendee", attendee).eq("step", step);
  } else {
    await supabase.from("checkpoints").upsert({ session, attendee, step }, { onConflict: "session,attendee,step", ignoreDuplicates: true });
  }
  return NextResponse.json({ ok: true, ...summarise(session, await rowsFor(session), attendee) });
}

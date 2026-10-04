import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { evaluateSpace } from "@/lib/evaluate";
import { db } from "@/lib/supabase";

export const maxDuration = 45;

const LIMIT = 20;
const WINDOW_MIN = 10;

/** Checks a Hugging Face Space against the workshop rubric. Rate-limited per network; results are logged without personal data. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const input = typeof body.space === "string" ? body.space.slice(0, 300) : "";
  if (!input.trim()) return NextResponse.json({ ok: false, message: "Paste your Hugging Face Space link." }, { status: 400 });

  const supabase = db();
  if (supabase) {
    const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    const ipHash = createHash("sha256").update(`eval:${ip}${process.env.RATE_LIMIT_SALT ?? "wgos"}`).digest("hex");
    const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
    const { count } = await supabase.from("rate_limits").select("*", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
    if ((count ?? 0) >= LIMIT) {
      return NextResponse.json({ ok: false, message: "That's a lot of checks. Please try again in a few minutes." }, { status: 429 });
    }
    await supabase.from("rate_limits").insert({ ip_hash: ipHash });
  }

  const result = await evaluateSpace(input);
  if (!result.ok) return NextResponse.json(result, { status: 422 });

  // Keep a record of the outcome (space id and scores only) for the host's dashboard.
  await supabase?.from("evaluations").insert({
    space_id: result.space,
    ref_code: typeof body.refCode === "string" ? body.refCode.slice(0, 12) : null,
    score: { score: result.score, max: result.max, grade: result.grade, checks: Object.fromEntries(result.checks.map((c) => [c.id, c.pass])), review: result.reviewSource },
  });

  return NextResponse.json(result);
}

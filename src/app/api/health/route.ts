import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Keep-alive: the Vercel cron hits this so the Supabase free project doesn't pause from inactivity. */
export async function GET() {
  const supabase = db();
  let dbOk = false;
  if (supabase) {
    const { error } = await supabase.from("rate_limits").select("ip_hash", { head: true, count: "exact" }).limit(1);
    dbOk = !error;
  }
  return NextResponse.json({ ok: dbOk, ts: Date.now() }, { status: dbOk ? 200 : 503 });
}

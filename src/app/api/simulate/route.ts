import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { buildScenario, SCENARIOS, type Scenario } from "@/lib/simulate";
import { db } from "@/lib/supabase";

export const maxDuration = 60;

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

/** Admin-only. seed=true replaces simulated data with the chosen scenario; seed=false clears it. Real rows are never touched. */
export async function POST(req: Request) {
  if ((await currentRole()) !== "admin") return fail("Admin only.", 403);

  const body = await req.json().catch(() => ({}));
  const scenario = body.scenario as Scenario;
  if (!(scenario in SCENARIOS) || typeof body.seed !== "boolean") return fail("Body must be { scenario, seed }.", 400);

  const supabase = db();
  if (!supabase) return fail("Database not configured.", 503);

  // 1. Clear existing simulated data. A real signup could have used a simulated referral link; detach those first.
  const { data: simCodes } = await supabase.from("registrations").select("ref_code").eq("is_simulated", true).limit(5000);
  const codes = (simCodes ?? []).map((r) => r.ref_code as string);
  for (let i = 0; i < codes.length; i += 200) {
    const { error } = await supabase.from("registrations").update({ referred_by: null }).eq("is_simulated", false).in("referred_by", codes.slice(i, i + 200));
    if (error) return fail(`Could not detach real referrals: ${error.message}`, 500);
  }
  const del = await supabase.from("registrations").delete().eq("is_simulated", true);
  if (del.error) return fail(`Could not clear simulated rows: ${del.error.message}`, 500);
  await supabase.from("ambassadors").delete().eq("is_simulated", true);

  if (!body.seed) return NextResponse.json({ ok: true, message: `Cleared ${codes.length} simulated registrations.` });

  // 2. Seed.
  const { ambassadors, rows } = buildScenario(scenario);
  const amb = await supabase.from("ambassadors").insert(ambassadors);
  if (amb.error) return fail(`Ambassador insert failed: ${amb.error.message}`, 500);
  for (let i = 0; i < rows.length; i += 200) {
    const { error } = await supabase.from("registrations").insert(rows.slice(i, i + 200));
    if (error) return fail(`Insert failed at row ${i}: ${error.message}`, 500);
  }

  const spec = SCENARIOS[scenario];
  return NextResponse.json({
    ok: true,
    message: `Loaded ${scenario}: ${rows.length} simulated registrations (TPO ${spec.tpo}, ambassador ${spec.ambassador}, referral ${spec.referral}) across 7 days.`,
    total: rows.length,
  });
}

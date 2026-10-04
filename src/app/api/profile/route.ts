import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import { thanksToken } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { userFromRequest } from "@/lib/user";

const COLS = "name, phone, college, branch, grad_year, project_idea, ref_code, session, is_verified, created_at";

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

/** The caller's own workshop registration (found by user_id, set when they registered while signed in). */
async function myRegistration(userId: string) {
  const { data } = await db()!.from("registrations").select(COLS).eq("user_id", userId).maybeSingle();
  return data;
}

export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return fail("Please log in.", 401);
  const registration = await myRegistration(user.id);
  return NextResponse.json({
    ok: true,
    account: { email: user.email, name: (user.user_metadata?.name as string | undefined) ?? "", created_at: user.created_at },
    registration,
    thanksToken: registration ? thanksToken(registration.ref_code) : null,
  });
}

function text(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function PATCH(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return fail("Please log in.", 401);
  const body = await req.json().catch(() => ({}));
  const supabase = db()!;

  // Account-level name lives in the auth profile; it also applies to the registration when one exists.
  const name = text(body.name, 80);
  if (name.length < 2) return fail("Name must be 2–80 characters.", 422);
  const reg = await myRegistration(user.id);

  if (!reg) {
    await supabase.auth.admin.updateUserById(user.id, { user_metadata: { ...user.user_metadata, name } });
    return NextResponse.json({ ok: true, message: "Profile saved." });
  }

  const phone = text(body.phone, 20).replace(/[\s\-.]/g, "").replace(/^\+91/, "").replace(/^91(?=\d{10}$)/, "").replace(/^0+/, "");
  if (!/^[6-9]\d{9}$/.test(phone)) return fail("Enter a valid 10-digit Indian mobile number.", 422);
  const branch = text(body.branch, 40);
  if (!(cfg.targetBranches as readonly string[]).includes(branch)) return fail("Pick a branch from the list.", 422);
  const gradYear = Number(body.gradYear);
  if (!Number.isInteger(gradYear) || gradYear < 2024 || gradYear > 2031) return fail("Graduation year must be between 2024 and 2031.", 422);
  const college = text(body.college, 120);
  if (!college) return fail("College is required.", 422);

  const { error } = await supabase
    .from("registrations")
    .update({ name, phone, college, branch, grad_year: gradYear, project_idea: text(body.projectIdea, 120) || null })
    .eq("user_id", user.id);
  if (error) {
    return fail(error.code === "23505" ? "That phone number is already registered to someone else." : "Could not save. Please try again.", error.code === "23505" ? 409 : 500);
  }
  await supabase.auth.admin.updateUserById(user.id, { user_metadata: { ...user.user_metadata, name } });
  return NextResponse.json({ ok: true, message: "Profile saved.", registration: await myRegistration(user.id) });
}

/**
 * Delete account. The auth user is removed. The registration is anonymised rather than deleted, because other
 * students' referral chains and the leaderboard point at its invite code.
 */
export async function DELETE(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return fail("Please log in.", 401);
  const supabase = db()!;

  const reg = await myRegistration(user.id);
  if (reg) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const phone = `9${String(randomInt(0, 1_000_000_000)).padStart(9, "0")}`;
      const { error } = await supabase
        .from("registrations")
        .update({ name: "Deleted user", phone, email: `deleted-${user.id}@example.invalid`, user_id: null })
        .eq("user_id", user.id);
      if (!error) break;
      if (error.code !== "23505") return fail("Could not delete your registration. Please try again.", 500);
    }
  }
  const { error } = await supabase.auth.admin.deleteUser(user.id);
  if (error) return fail("Could not delete your account. Please try again.", 500);
  return NextResponse.json({ ok: true });
}

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

const LIMIT = 6;
const WINDOW_MIN = 10;

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

/**
 * Creates an account that is already confirmed, so signing up never depends on email delivery
 * (Supabase's built-in email sender allows only a few messages per hour for the whole project).
 * The browser then signs the user in with the same email and password.
 * Trade-off: the email address isn't verified. Nothing sensitive depends on that: registrations are only ever
 * linked to the account that created them, never claimed by email.
 */
export async function POST(req: Request) {
  const supabase = db();
  if (!supabase) return fail("Accounts are not available right now.", 503);

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (name.length < 2 || name.length > 80) return fail("Name must be 2–80 characters.", 422);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) return fail("Enter a valid email address.", 422);
  if (password.length < 8 || password.length > 72) return fail("Password must be 8–72 characters.", 422);

  // Per-IP limit, stored in Postgres (in-memory limits don't survive serverless instances).
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const ipHash = createHash("sha256").update(`signup:${ip}${process.env.RATE_LIMIT_SALT ?? "wgos"}`).digest("hex");
  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
  const { count } = await supabase.from("rate_limits").select("*", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= LIMIT) return fail("Too many sign-up attempts from this network. Please try again in a few minutes.", 429);
  await supabase.from("rate_limits").insert({ ip_hash: ipHash });

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error) {
    if (/already|exists|registered/i.test(error.message) || (error as { code?: string }).code === "email_exists") {
      return fail("An account with this email already exists. Try logging in.", 409);
    }
    if (/password/i.test(error.message)) return fail("Choose a stronger password (at least 8 characters).", 422);
    return fail("Could not create your account. Please try again.", 500);
  }
  return NextResponse.json({ ok: true });
}

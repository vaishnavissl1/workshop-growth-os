import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { thanksToken } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { userFromRequest } from "@/lib/user";

const LIMIT = 5;
const WINDOW_MIN = 10;

function str(v: unknown, max = 200) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const supabase = db();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "not_configured", message: "Registration is not available right now." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request", message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see this field. Pretend success so bots learn nothing.
  if (str(body.website)) {
    return NextResponse.json({ ok: true, already_registered: false, ref_code: "BOT000" });
  }

  // Per-IP rate limit stored in Postgres (in-memory limits don't survive serverless).
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const ipHash = createHash("sha256")
    .update(ip + (process.env.RATE_LIMIT_SALT ?? "wgos"))
    .digest("hex");
  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
  const { count } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) >= LIMIT) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }
  await supabase.from("rate_limits").insert({ ip_hash: ipHash });

  const { data, error } = await supabase.rpc("register", {
    p_name: str(body.name, 80),
    p_phone: str(body.phone, 20),
    p_email: str(body.email, 120),
    p_college: str(body.college, 120) || "Other",
    p_branch: str(body.branch, 40),
    p_grad_year: Number(body.gradYear),
    p_consent: body.consent === true,
    p_referred_by: str(body.ref, 12) || null,
    p_source: str(body.source, 20) || "direct",
    p_ambassador_code: str(body.ambassador, 40) || null,
    p_headline_variant: str(body.variant, 20) || null,
    p_project_idea: str(body.projectIdea, 120) || null,
    p_is_simulated: false,
  });

  if (error) {
    // A concurrent duplicate hits the unique constraint; treat it as a retryable error.
    return NextResponse.json(
      { ok: false, error: "server_error", message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
  // If the student is signed in, link the registration we just created to their account. Only ever a brand-new
  // row (never an existing one), so signing up with someone else's email can't claim their registration.
  if (data?.ok && !data.already_registered && data.ref_code) {
    const user = await userFromRequest(req);
    if (user) await supabase.from("registrations").update({ user_id: user.id }).eq("ref_code", data.ref_code).is("user_id", null);
  }

  const body2 = data?.ok && data.ref_code ? { ...data, t: thanksToken(data.ref_code) } : data;
  return NextResponse.json(body2, { status: data?.ok ? 200 : 422 });
}

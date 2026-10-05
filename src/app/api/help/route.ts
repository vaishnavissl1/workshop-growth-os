import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";

const TOPICS = ["registration", "workshop", "certificate", "account", "other"];
const LIMIT = 5;
const WINDOW_MIN = 10;

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function fail(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

/** Help centre: saves a question for the team. Read from the admin dashboard only. */
export async function POST(req: Request) {
  const supabase = db();
  if (!supabase) return fail("The help centre is not available right now.", 503);

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return fail("Invalid request.", 400);

  // Honeypot: real users never see this field. Pretend success so bots learn nothing.
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const name = str(body.name, 80);
  const email = str(body.email, 160).toLowerCase();
  const topic = str(body.topic, 20);
  const message = str(body.message, 2000);
  if (name.length < 2) return fail("Please enter your name.", 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email.", 400);
  if (!TOPICS.includes(topic)) return fail("Please choose a topic.", 400);
  if (message.length < 10) return fail("Please describe your question in a little more detail.", 400);

  // Per-IP limit, kept apart from the registration limit by the "help:" prefix.
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const ipHash = createHash("sha256").update("help:" + ip + (process.env.RATE_LIMIT_SALT ?? "wgos")).digest("hex");
  const since = new Date(Date.now() - WINDOW_MIN * 60_000).toISOString();
  const { count } = await supabase.from("rate_limits").select("*", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if ((count ?? 0) >= LIMIT) return fail("Too many messages. Please try again in a few minutes.", 429);
  await supabase.from("rate_limits").insert({ ip_hash: ipHash });

  const { error } = await supabase.from("help_requests").insert({ name, email, topic, message });
  if (error) return fail("Could not send your question. Please try again.", 500);
  return NextResponse.json({ ok: true });
}

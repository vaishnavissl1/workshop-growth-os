import { validThanksToken } from "@/lib/auth";
import { ideaFor, starterApp } from "@/lib/starter";
import { db } from "@/lib/supabase";

/** Downloads the student's personalised starter app.py. Needs the same signed token as the thanks page. */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.toUpperCase();
  const t = new URL(req.url).searchParams.get("t") ?? undefined;
  if (!validThanksToken(code, t)) return new Response("Not found", { status: 404 });

  const { data } = (await db()?.from("registrations").select("name, branch, project_idea").eq("ref_code", code).maybeSingle()) ?? { data: null };
  if (!data) return new Response("Not found", { status: 404 });

  const firstName = String(data.name).trim().split(/\s+/)[0];
  const body = starterApp(firstName, data.branch, ideaFor(data.branch, data.project_idea));
  return new Response(body, {
    headers: {
      "Content-Type": "text/x-python; charset=utf-8",
      "Content-Disposition": 'attachment; filename="app.py"',
      "Cache-Control": "private, no-store",
    },
  });
}

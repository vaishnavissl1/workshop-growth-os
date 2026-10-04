import { db } from "@/lib/supabase";
import { icsFile } from "@/lib/share";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.toUpperCase();
  const { data } = (await db()
    ?.from("registrations")
    .select("session")
    .eq("ref_code", code)
    .maybeSingle()) ?? { data: null };
  return new Response(icsFile(data?.session ?? 1), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="workshop.ics"',
    },
  });
}

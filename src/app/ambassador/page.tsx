import { redirect } from "next/navigation";
import AmbassadorKit from "@/components/AmbassadorKit";
import { db } from "@/lib/supabase";
import { trackedLink } from "@/lib/kit";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ambassador kit", robots: { index: false } };

export default async function AmbassadorPage({ searchParams }: { searchParams: Promise<{ amb?: string }> }) {
  const { amb } = await searchParams;
  const code = amb?.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 40) ?? "";
  const supabase = db();

  const { data: me } =
    code && supabase
      ? await supabase.from("ambassadors").select("code, name, college, is_simulated").eq("code", code).maybeSingle()
      : { data: null };

  // Only reachable with a valid ?amb=CODE. Anything else goes back to the landing page.
  if (!me) redirect("/");

  // Stats for this ambassador's tracked link. Counts only: no student details are read.
  const [{ count: total }, { count: verified }] = await Promise.all([
    supabase!.from("registrations").select("*", { count: "exact", head: true }).eq("ambassador_code", code),
    supabase!.from("registrations").select("*", { count: "exact", head: true }).eq("ambassador_code", code).eq("is_verified", true),
  ]);
  const { data: rank } = await supabase!.from("registrations").select("ambassador_code").not("ambassador_code", "is", null).limit(5000);
  const tally = new Map<string, number>();
  rank?.forEach((r) => tally.set(r.ambassador_code as string, (tally.get(r.ambassador_code as string) ?? 0) + 1));
  const ordered = [...tally.entries()].sort((a, b) => b[1] - a[1]);
  const position = ordered.findIndex(([c]) => c === code) + 1;

  return (
    <AmbassadorKit
      code={me.code}
      name={me.name}
      college={me.college}
      simulated={me.is_simulated}
      link={trackedLink(me.code)}
      stats={{ total: total ?? 0, verified: verified ?? 0, position: position || null, of: ordered.length }}
    />
  );
}

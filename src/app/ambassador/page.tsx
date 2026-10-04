import Link from "next/link";
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

  if (!me) {
    return (
      <div className="container-page py-16">
        <form className="card mx-auto max-w-sm space-y-4" method="get">
          <h1 className="text-2xl font-extrabold">Ambassador kit</h1>
          <p className="text-sm text-[var(--color-muted)]">Enter your ambassador code to open your tracked link and messages.</p>
          {code && <p role="alert" className="text-sm font-medium text-red-700">We couldn&apos;t find that code.</p>}
          <input
            name="amb"
            defaultValue={code}
            required
            placeholder="e.g. AMB-001"
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-base"
          />
          <button className="btn-secondary w-full">Open my kit</button>
          <p className="text-center text-sm"><Link href="/">← Back</Link></p>
        </form>
      </div>
    );
  }

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

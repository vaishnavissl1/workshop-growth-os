import Link from "next/link";
import PageGlow from "@/components/PageGlow";
import AutoRefresh from "@/components/AutoRefresh";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leaderboard" };

const BADGE = ["bg-amber-300 text-amber-950", "bg-slate-200 text-slate-900", "bg-orange-300 text-orange-950"];

function Rank({ n }: { n: number }) {
  return (
    <span
      className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        BADGE[n - 1] ?? "bg-slate-100 text-[var(--color-soft)]"
      }`}
    >
      {n}
    </span>
  );
}

type Person = { first_name: string; college: string; count: number; rank: number };
type College = { college: string; verified: number; rank: number };

/** Dense rank: equal counts share a rank. */
function ranked<T>(items: T[], value: (t: T) => number) {
  let rank = 0;
  let last = Number.NaN;
  return items.map((t) => {
    if (value(t) !== last) {
      rank++;
      last = value(t);
    }
    return { item: t, rank };
  });
}

/**
 * The simulated campaign's board, built from rows flagged is_simulated. It only ever renders under a clear
 * "Simulated" label: these are generated students, never shown as real ones.
 */
async function simulatedBoard(): Promise<{ people: Person[]; colleges: College[]; total: number }> {
  const supabase = db();
  if (!supabase) return { people: [], colleges: [], total: 0 };
  const rows: { ref_code: string; name: string; college: string; referred_by: string | null; is_verified: boolean }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await supabase
      .from("registrations")
      .select("ref_code, name, college, referred_by, is_verified")
      .eq("is_simulated", true)
      .range(from, from + 999);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < 1000) break;
  }
  const byCode = new Map(rows.map((r) => [r.ref_code, r]));
  const refs = new Map<string, number>();
  const cols = new Map<string, number>();
  for (const r of rows) {
    if (r.is_verified) cols.set(r.college, (cols.get(r.college) ?? 0) + 1);
    if (r.referred_by && r.is_verified && byCode.has(r.referred_by)) refs.set(r.referred_by, (refs.get(r.referred_by) ?? 0) + 1);
  }
  const top = [...refs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const people = ranked(top, (t) => t[1]).map(({ item: [code, count], rank }) => {
    const r = byCode.get(code)!;
    return { first_name: r.name.trim().split(/\s+/)[0], college: r.college, count, rank };
  });
  const topCols = [...cols.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
  const colleges = ranked(topCols, (t) => t[1]).map(({ item: [college, verified], rank }) => ({ college, verified, rank }));
  return { people, colleges, total: rows.length };
}

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ ref?: string; view?: string }> }) {
  const { ref, view } = await searchParams;
  const simulated = view === "simulated";
  const code = ref?.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const supabase = db();

  let people: Person[] = [];
  let colleges: College[] = [];
  let simTotal = 0;
  let nudge: string | null = null;
  let myName = "";

  if (simulated) {
    ({ people, colleges, total: simTotal } = await simulatedBoard());
  } else if (supabase) {
    // Only first name, college and counts are ever selected: no phone or email leaves the database here.
    const [p, c, mine] = await Promise.all([
      supabase
        .from("leaderboard_public")
        .select("first_name, college, verified_referral_count, referrer_rank")
        .gt("verified_referral_count", 0)
        .order("verified_referral_count", { ascending: false })
        .limit(10),
      supabase
        .from("college_leaderboard")
        .select("college, verified_count, total_count, college_rank")
        .gt("total_count", 0)
        .order("verified_count", { ascending: false })
        .limit(15),
      code
        ? supabase.from("leaderboard_public").select("first_name, verified_referral_count, referrer_rank").eq("ref_code", code).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    people = (p.data ?? []).map((r) => ({ first_name: r.first_name, college: r.college, count: Number(r.verified_referral_count), rank: Number(r.referrer_rank) }));
    colleges = (c.data ?? []).map((r) => ({ college: r.college, verified: Number(r.verified_count), rank: Number(r.college_rank) }));

    // Nudge: how many more verified referrals to pass the person one rank above.
    if (mine.data) {
      myName = mine.data.first_name ?? "";
      const myCount = Number(mine.data.verified_referral_count);
      const myRank = Number(mine.data.referrer_rank);
      if (myRank > 1) {
        const { data: above } = await supabase
          .from("leaderboard_public")
          .select("verified_referral_count")
          .gt("verified_referral_count", myCount)
          .order("verified_referral_count", { ascending: true })
          .limit(1)
          .maybeSingle();
        if (above) {
          const need = Number(above.verified_referral_count) - myCount + 1;
          nudge = `you are ${need} more verified referral${need === 1 ? "" : "s"} away from overtaking #${myRank - 1}.`;
        }
      } else if (myRank === 1 && myCount > 0) {
        nudge = "you're #1. Keep sharing to hold the top spot.";
      } else {
        nudge = "share your link to get on the board: one verified referral puts you in.";
      }
    }
  }

  const tab = (active: boolean) =>
    `rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition ${active ? "bg-[#991B1B] !text-white" : "!text-slate-600 hover:bg-slate-100"}`;

  return (
    <>
      <PageGlow tone="amber" />
      <div className="container-wide animate-fade-in-up pt-16 pb-10">
        {!simulated && <AutoRefresh seconds={60} />}
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center">
            <p className="eyebrow mb-1">{simulated ? "Simulated campaign" : "Live"}</p>
            <h1 className="display !text-[clamp(2.5rem,6vw,4rem)]">Leaderboard</h1>
          </div>

          <nav aria-label="Leaderboard view" className="mx-auto flex w-fit gap-1 rounded-full border border-slate-200 bg-white p-1">
            <Link href="/leaderboard" aria-current={!simulated ? "page" : undefined} className={tab(!simulated)}>Live</Link>
            <Link href="/leaderboard?view=simulated" aria-current={simulated ? "page" : undefined} className={tab(simulated)}>Simulated campaign</Link>
          </nav>

          {simulated && (
            <p role="note" className="notice-amber p-4 text-center text-[0.95rem] font-medium">
              Simulated data. These {simTotal} students are generated from the plan&apos;s base scenario to show how the board looks mid-campaign. They are not real registrations.
            </p>
          )}

          {nudge && (
            <p role="status" className="notice-violet p-3 text-center text-sm font-semibold">
              {myName ? `${myName}, ` : ""}
              {nudge}
            </p>
          )}

          <div className="grid items-start gap-6 md:grid-cols-2">
            <section className="card">
              <h2 className="mb-4 text-xl font-semibold">Top 10 referrers</h2>
              {people.length ? (
                <ol className="space-y-3">
                  {people.map((p, i) => (
                    <li key={i} className="flex items-center gap-4 text-base">
                      <Rank n={p.rank} />
                      <span className="min-w-0 flex-1">
                        <span className="font-semibold">{p.first_name}</span>
                        <span className="block truncate text-[var(--color-muted)]">{p.college}</span>
                      </span>
                      <strong>{p.count}</strong>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  {simulated ? "No simulated data is loaded." : "No verified referrals yet. Be the first."}
                </p>
              )}
            </section>

            <section className="card">
              <h2 className="mb-4 text-xl font-semibold">College Cup</h2>
              {colleges.length ? (
                <table className="w-full text-base">
                  <thead>
                    <tr className="text-left text-xs text-[var(--color-muted)]">
                      <th className="pb-2 font-semibold">#</th>
                      <th className="pb-2 font-semibold">College</th>
                      <th className="pb-2 text-right font-semibold">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colleges.map((c, i) => (
                      <tr key={i} className="border-t border-slate-200">
                        <td className="py-3 pr-3"><Rank n={c.rank} /></td>
                        <td className="py-3 pr-3">{c.college}</td>
                        <td className="py-3 text-right text-lg font-bold">{c.verified}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">{simulated ? "No simulated data is loaded." : "No colleges on the board yet."}</p>
              )}
              <p className="mt-3 text-xs text-[var(--color-muted)]">Sorted by verified registrations (2027 batch, engineering).</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

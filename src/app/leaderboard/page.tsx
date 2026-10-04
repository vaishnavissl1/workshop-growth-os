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
        BADGE[n - 1] ?? "bg-white/10 text-[var(--color-soft)]"
      }`}
    >
      {n}
    </span>
  );
}

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const code = ref?.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const supabase = db();

  // Only first name, college and counts are ever selected: no phone or email leaves the database here.
  const [people, colleges, mine] = supabase
    ? await Promise.all([
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
          ? supabase
              .from("leaderboard_public")
              .select("first_name, verified_referral_count, referrer_rank")
              .eq("ref_code", code)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ])
    : [{ data: [] }, { data: [] }, { data: null }];

  // Nudge: how many more verified referrals to pass the person one rank above.
  let nudge: string | null = null;
  if (mine.data) {
    const myCount = Number(mine.data.verified_referral_count);
    const myRank = Number(mine.data.referrer_rank);
    if (myRank > 1 && supabase) {
      const { data: above } = await supabase
        .from("leaderboard_public")
        .select("verified_referral_count")
        .gt("verified_referral_count", myCount)
        .order("verified_referral_count", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (above) {
        const need = Number(above.verified_referral_count) - myCount + 1;
        nudge = `You are ${need} more verified referral${need === 1 ? "" : "s"} away from overtaking #${myRank - 1}.`;
      }
    } else if (myRank === 1 && myCount > 0) {
      nudge = "You're #1. Keep sharing to hold the top spot.";
    } else {
      nudge = "Share your link to get on the board: one verified referral puts you in.";
    }
  }

  return (
    <>
      <PageGlow tone="amber" />
    <div className="container-wide animate-fade-in-up pt-16 pb-10">
      <AutoRefresh seconds={60} />
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <p className="eyebrow mb-1">Live</p>
          <h1 className="display !text-[clamp(2.5rem,6vw,4rem)]">Leaderboard</h1>
        </div>

        {nudge && (
          <p role="status" className="notice-violet p-3 text-center text-sm font-semibold">
            {mine.data?.first_name ? `${mine.data.first_name}, ` : ""}
            {nudge}
          </p>
        )}

        <div className="grid items-start gap-6 md:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 text-xl font-semibold">Top 10 referrers</h2>
          {people.data?.length ? (
            <ol className="space-y-3">
              {people.data.map((p, i) => (
                <li key={i} className="flex items-center gap-4 text-base">
                  <Rank n={Number(p.referrer_rank)} />
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold">{p.first_name}</span>
                    <span className="block truncate text-[var(--color-muted)]">{p.college}</span>
                  </span>
                  <strong>{p.verified_referral_count}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No verified referrals yet. Be the first.</p>
          )}
        </section>

        <section className="card">
          <h2 className="mb-4 text-xl font-semibold">College Cup</h2>
          {colleges.data?.length ? (
            <table className="w-full text-base">
              <thead>
                <tr className="text-left text-xs text-[var(--color-muted)]">
                  <th className="pb-2 font-semibold">#</th>
                  <th className="pb-2 font-semibold">College</th>
                  <th className="pb-2 text-right font-semibold">Verified</th>
                </tr>
              </thead>
              <tbody>
                {colleges.data.map((c, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="py-3 pr-3"><Rank n={Number(c.college_rank)} /></td>
                    <td className="py-3 pr-3">{c.college}</td>
                    <td className="py-3 text-right text-lg font-bold">{c.verified_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No colleges on the board yet.</p>
          )}
          <p className="mt-3 text-xs text-[var(--color-muted)]">Sorted by verified registrations (2027 batch, engineering).</p>
        </section>

        </div>

        <p className="text-center"><Link href="/register" className="btn-cta btn-lg !text-[#111827]">Reserve my free seat</Link></p>
      </div>
    </div>
    </>
  );
}

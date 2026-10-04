import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  const supabase = db();
  const [people, colleges] = supabase
    ? await Promise.all([
        supabase
          .from("leaderboard_public")
          .select("first_name, college, verified_referral_count, referrer_rank")
          .gt("verified_referral_count", 0)
          .order("verified_referral_count", { ascending: false })
          .limit(20),
        supabase
          .from("college_leaderboard")
          .select("college, verified_count, college_rank")
          .gt("verified_count", 0)
          .order("college_rank")
          .limit(10),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-center text-3xl font-extrabold">Leaderboard</h1>
        <section className="card">
          <h2 className="mb-3 text-lg font-bold">Top referrers</h2>
          {people.data?.length ? (
            <ol className="space-y-2">
              {people.data.map((p, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>#{p.referrer_rank} {p.first_name} · <span className="text-[var(--color-muted)]">{p.college}</span></span>
                  <strong>{p.verified_referral_count}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No verified referrals yet. Be the first.</p>
          )}
        </section>
        <section className="card">
          <h2 className="mb-3 text-lg font-bold">College Cup</h2>
          {colleges.data?.length ? (
            <ol className="space-y-2">
              {colleges.data.map((c, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>#{c.college_rank} {c.college}</span>
                  <strong>{c.verified_count}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No colleges on the board yet.</p>
          )}
        </section>
        <p className="text-center text-sm"><a href="/">← Back to registration</a></p>
      </div>
    </div>
  );
}

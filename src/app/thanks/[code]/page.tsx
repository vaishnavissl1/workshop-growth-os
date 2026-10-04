import { notFound } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import RememberMe from "@/components/RememberMe";
import SeatsCounter from "@/components/SeatsCounter";
import ideas from "@/data/projectIdeas.json";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import { db } from "@/lib/supabase";
import { calendarUrl, inviteUrl, sessionStart, shareMessage, waShareUrl } from "@/lib/share";

export const dynamic = "force-dynamic";
export const metadata = { title: "You're in!" };

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ again?: string }>;
}) {
  const code = (await params).code.toUpperCase();
  const { again } = await searchParams;
  const supabase = db();
  if (!supabase) notFound();

  const { data: me } = await supabase
    .from("registrations")
    .select("name, college, branch, project_idea, session, is_verified")
    .eq("ref_code", code)
    .maybeSingle();
  if (!me) notFound();

  const [{ data: seats }, { data: mine }, { data: top }, { data: colleges }] = await Promise.all([
    supabase.rpc("seats_left"),
    supabase.from("leaderboard_public").select("verified_referral_count, referrer_rank").eq("ref_code", code).maybeSingle(),
    supabase.from("leaderboard_public").select("verified_referral_count").order("verified_referral_count", { ascending: false }).limit(3),
    supabase.from("college_leaderboard").select("college, verified_count, college_rank").order("college_rank").limit(50),
  ]);

  const count = Number(mine?.verified_referral_count ?? 0);
  const third = Number(top?.[2]?.verified_referral_count ?? 0);
  const toTop3 = Math.max(0, third + 1 - count);
  const myCollege = colleges?.find((c) => c.college === me.college);
  const rankedAbove = myCollege
    ? colleges?.find((c) => Number(c.college_rank) === Number(myCollege.college_rank) - 1)
    : undefined;
  const toOvertake = myCollege && rankedAbove ? Number(rankedAbove.verified_count) - Number(myCollege.verified_count) + 1 : 0;

  const branchIdeas = (ideas as Record<string, { title: string; description: string; stack: string }[]>)[me.branch] ?? [];
  const idea = branchIdeas.find((i) => i.title === me.project_idea) ?? branchIdeas[0];
  const firstName = me.name.split(" ")[0];

  const when = new Date(sessionStart(me.session)).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const link = inviteUrl(code);
  const pct = Math.min(100, Math.round((count / Math.max(1, third + 1)) * 100));

  return (
    <div className="container-page py-8">
      <div className="mx-auto max-w-md space-y-5">
        <RememberMe code={code} />
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)] text-3xl text-white">✓</div>
          <h1 className="text-3xl font-extrabold">{again ? "You're already in!" : "You're in!"}</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            {me.name.split(" ")[0]}, your seat is reserved for {when} IST
            {me.session === 2 ? " (repeat session, since Session 1 is full)" : ""}.
          </p>
          {!me.is_verified && (
            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              This workshop is designed for final-year engineering students, so referral rewards apply only to 2027-batch engineering registrations.
            </p>
          )}
        </div>

        {idea && (
          <div className="card">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">{firstName}&apos;s project</p>
            <h2 className="mt-1 text-lg font-bold">{firstName}, you&apos;ll build: {idea.title}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{idea.description}</p>
            <p className="mt-2 text-xs font-semibold text-[var(--color-primary)]">{idea.stack} · deployed live in 60 minutes</p>
          </div>
        )}

        <SeatsCounter initial={typeof seats === "number" ? seats : cfg.seatCap} cap={cfg.seatCap} />

        <div className="card space-y-3">
          <h2 className="text-lg font-bold">Invite friends, climb the leaderboard</h2>
          <a className="btn-wa w-full !text-white" href={waShareUrl(code)} target="_blank" rel="noopener noreferrer">
            Share on WhatsApp
          </a>
          <div className="flex items-center gap-2 rounded-xl bg-[#F1F5F9] p-3 text-sm break-all">{link}</div>
          <CopyButton text={shareMessage(code)} label="Copy message for your class group" />
          <div>
            <div className="mb-1 flex justify-between text-sm font-semibold">
              <span>{count} verified referral{count === 1 ? "" : "s"}</span>
              <span>Rank #{mine?.referrer_rank ?? "-"}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
              <div className="h-full bg-[var(--color-primary)]" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {toTop3 > 0 ? `${toTop3} more verified referral${toTop3 === 1 ? "" : "s"} to reach the top 3` : "You're in the top 3 🎉"}
              {" "}(₹{cfg.referralRewards[0].amountINR}/₹{cfg.referralRewards[1].amountINR}/₹{cfg.referralRewards[2].amountINR} for verified referrals).
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-1 text-lg font-bold">College Cup</h2>
          <p className="text-sm">
            {myCollege
              ? `${me.college} is #${myCollege.college_rank}${toOvertake > 0 ? `. ${toOvertake} more registration${toOvertake === 1 ? "" : "s"} to overtake #${Number(myCollege.college_rank) - 1}.` : "."}`
              : `${me.college} is on the board once its first verified registration lands.`}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Top college wins: {cfg.collegeCupPrize}.</p>
        </div>

        <div className="card flex flex-wrap gap-3">
          <a className="btn-secondary" href={calendarUrl(me.session)} target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
          <a className="btn-secondary" href={`/api/ics/${code}`}>Download .ics</a>
        </div>

        <p className="text-center text-sm"><a href="/leaderboard">See the leaderboard →</a></p>
      </div>
    </div>
  );
}

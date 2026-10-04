import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageGlow from "@/components/PageGlow";
import { validThanksToken } from "@/lib/auth";
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
  searchParams: Promise<{ again?: string; t?: string }>;
}) {
  const code = (await params).code.toUpperCase();
  const { again, t } = await searchParams;
  // Only reachable straight after registering: the signed token is issued by /api/register.
  if (!validThanksToken(code, t)) redirect("/");
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
    <>
      <PageGlow tone="green" />
    <div className="container-wide animate-fade-in-up pt-14 pb-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <RememberMe code={code} />
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white shadow-lg shadow-green-500/30">✓</div>
          <h1 className="display !text-[clamp(2.5rem,6vw,4rem)]">{again ? "You're already in!" : "You're in!"}</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            {me.name.split(" ")[0]}, your seat is reserved for {when} IST
            {me.session === 2 ? " (repeat session, since Session 1 is full)" : ""}.
          </p>
          {!me.is_verified && (
            <p className="notice-amber mt-3 p-3 text-sm">
              This workshop is designed for final-year engineering students, so referral rewards apply only to 2027-batch engineering registrations.
            </p>
          )}
        </div>

        {idea && (
          <div className="card">
            <p className="eyebrow !text-xs">{firstName}&apos;s project</p>
            <h2 className="mt-1 text-lg font-bold">{firstName}, you&apos;ll build: {idea.title}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{idea.description}</p>
            <p className="mt-2 text-xs font-semibold text-[var(--color-primary-light)]">{idea.stack} · deployed live in 60 minutes</p>
          </div>
        )}

        <SeatsCounter initial={typeof seats === "number" ? seats : cfg.seatCap} cap={cfg.seatCap} />

        <div className="card space-y-3">
          <h2 className="text-lg font-bold">Invite friends, climb the leaderboard</h2>
          <a className="btn-wa w-full" href={waShareUrl(code)} target="_blank" rel="noopener noreferrer">
            Share on WhatsApp
          </a>
          <div className="inset flex items-center gap-2 p-3 text-sm break-all">{link}</div>
          <CopyButton text={shareMessage(code)} label="Copy message for your class group" />
          <div>
            <div className="mb-1 flex justify-between text-sm font-semibold">
              <span>{count} verified referral{count === 1 ? "" : "s"}</span>
              <span>Rank #{mine?.referrer_rank ?? "-"}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-[#991B1B] to-[#DC2626]" style={{ width: `${pct}%` }} />
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

        <div className="flex flex-col gap-3 text-center">
          <Link href="/leaderboard" className="btn-primary w-full">See the leaderboard →</Link>
        </div>
      </div>
    </div>
    </>
  );
}

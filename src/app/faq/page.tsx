import AuthGate from "@/components/auth/AuthGate";
import PageGlow from "@/components/PageGlow";
import PageHero from "@/components/PageHero";
import { WORKSHOP_CONFIG as cfg } from "@/config";

export const metadata = { title: "FAQ" };

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "Getting started",
    items: [
      ["Do I need to know coding?", "No. You follow along step by step, and every step is shown live."],
      ["What do I need?", "A laptop, internet and a free Google account."],
      ["Is it really free?", "Yes. No payment at any point."],
      ["Who can join?", `Final-year (${cfg.targetGradYear} batch) engineering students from any branch. Other students can still register, but referral rewards apply only to ${cfg.targetGradYear}-batch engineering registrations.`],
    ],
  },
  {
    title: "The session",
    items: [
      ["How long is it?", "60 minutes, start to finish: set up, build, deploy and share."],
      ["Can't make it live?", "Register anyway. You'll get the recording and the step-by-step guide."],
      ["What if Session 1 is full?", "You're registered for the repeat session automatically. Same workshop, same certificate."],
      ["What will I build?", "An LLM-powered app with Gradio, deployed on Hugging Face Spaces. You pick an idea suited to your branch."],
    ],
  },
  {
    title: "Referrals and rewards",
    items: [
      ["How does the leaderboard work?", "Every registrant gets a personal invite link. Each friend who registers through it counts as a referral, and the leaderboard ranks the top referrers."],
      ["What do referrals win?", `The top three referrers win ₹${cfg.referralRewards[0].amountINR}, ₹${cfg.referralRewards[1].amountINR} and ₹${cfg.referralRewards[2].amountINR}. Only verified referrals count: ${cfg.targetGradYear}-batch engineering students.`],
      ["What is the College Cup?", `Colleges are ranked by verified registrations. The top college wins ${cfg.collegeCupPrize}.`],
    ],
  },
  {
    title: "Your data",
    items: [
      ["What do you do with my details?", "We only use them to contact you about this workshop on WhatsApp or email, as you agreed when you registered."],
      ["What shows on the public leaderboard?", "First name and college only. Never your phone number, email or surname."],
    ],
  },
];

export default function FaqPage() {
  return (
    <AuthGate>
    <>
      <PageGlow tone="violet" />
      <PageHero
        eyebrow="FAQ"
        title={<>Quick <span className="gradient-text">answers</span></>}
        lead="Everything students ask before they register. Can't find yours? Register and ask during the session."
      />

      <div className="container-mid space-y-14">
        {GROUPS.map((g) => (
          <section key={g.title} aria-labelledby={`g-${g.title}`}>
            <h2 id={`g-${g.title}`} className="mb-5 text-2xl font-semibold">{g.title}</h2>
            <div className="space-y-3">
              {g.items.map(([q, a]) => (
                <details key={q} className="group rounded-2xl border border-slate-200 bg-slate-50 transition open:bg-slate-50">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-lg font-medium">
                    {q}
                    <span aria-hidden="true" className="text-xl text-slate-600 transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="px-6 pb-6 text-[1.0125rem] leading-relaxed text-slate-600">{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <section className="card !p-10 text-center">
          <h2 className="section-title">Ready when you are</h2>
          <p className="lead mt-3">It takes about a minute to reserve your seat.</p>
          <p className="mt-6">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/register" className="btn-cta btn-lg">Reserve my free seat</a>
          </p>
        </section>
      </div>
    </>
    </AuthGate>
  );
}

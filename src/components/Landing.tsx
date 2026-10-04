import { WORKSHOP_CONFIG as cfg } from "@/config";
import PageGlow from "@/components/PageGlow";
import { db } from "@/lib/supabase";
import RegisterForm, { Subhead } from "@/components/RegisterForm";

async function seatsLeft() {
  const supabase = db();
  if (!supabase) return cfg.seatCap;
  const { data } = await supabase.rpc("seats_left");
  return typeof data === "number" ? data : cfg.seatCap;
}

const FAQ = [
  ["Do I need to know coding?", "No. You follow along step by step, and every step is shown live."],
  ["What do I need?", "A laptop, internet and a free Google account."],
  ["Is it really free?", "Yes. No payment at any point."],
  ["Can't make it live?", "Register anyway. You'll get the recording and the step-by-step guide."],
];

const STRIP = ["Free", "60 minutes", "Live AI project link", "Certificate", "2027 batch", "Any engineering branch", "No AI experience needed"];

export default async function Landing({
  refCode,
  inviter,
}: {
  refCode?: string;
  inviter?: { firstName: string; college: string; project?: string | null };
}) {
  const left = await seatsLeft();
  const closes = new Date(cfg.registrationCloses).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="pb-16">
      <PageGlow tone="violet" />
      <div className="container-page animate-fade-in-up pt-14">
        {inviter && (
          <div className="notice-violet mx-auto mb-6 max-w-md p-3 text-center text-sm font-medium">
            {inviter.firstName} from {inviter.college} invited you
            {inviter.project ? (
              <>
                {" "}· building: <strong>{inviter.project}</strong>
              </>
            ) : null}
          </div>
        )}

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          <span className="badge badge-amber">FREE</span>
          <span className="badge badge-primary">60 MIN</span>
          <span className="badge badge-success">2027 BATCH</span>
        </div>

        <h1 className="mb-4 text-center text-[34px] font-bold leading-tight sm:text-5xl">
          Build Your First <span className="gradient-text">AI Project</span> in 60 Minutes
        </h1>
        <p className="mx-auto mb-8 max-w-md text-center text-lg text-[var(--color-soft)]">
          <Subhead />
        </p>

        {/* Outcome visual: what students leave with */}
        <div className="animate-float mx-auto mb-8 w-64 rounded-[28px] border border-white/10 bg-gradient-to-b from-black/60 to-transparent p-3 shadow-2xl">
          <div className="mb-2 rounded-lg bg-white/5 px-2 py-1 text-center text-[11px] text-[var(--color-muted)]">
            huggingface.co/spaces/<strong className="text-white">yourname</strong>/my-ai-app
          </div>
          <div className="space-y-2 rounded-xl bg-violet-500/10 p-3 text-xs">
            <p className="font-bold text-[var(--color-primary-light)]">Your AI app is live ✓</p>
            <p className="rounded-lg bg-white/10 p-2 text-gray-200">Ask me anything about your branch…</p>
            <p className="rounded-lg bg-indigo-600 p-2 text-white">Here&apos;s a clear, step-by-step answer.</p>
          </div>
        </div>

        <p className="mb-6 flex items-center justify-center gap-2 text-center text-sm font-semibold">
          <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span>
            <span className="text-[var(--color-success-text)]">{left}</span> of {cfg.seatCap} seats left in Session 1 ·
            Registration closes {closes}
          </span>
        </p>
      </div>

      {/* Trust strip */}
      <section aria-label="Highlights" className="mb-10 border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl overflow-hidden px-6 py-5">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {STRIP.concat(STRIP).map((t, i) => (
              <span key={i} className="text-sm font-semibold tracking-wide text-gray-400 sm:text-base">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page">
        <div className="card mb-10">
          <RegisterForm refCode={refCode} />
        </div>

        <section className="card mb-8">
          <p className="eyebrow mb-1">Agenda</p>
          <h2 className="mb-4 text-xl">60 minutes, start to finish</h2>
          <ol className="space-y-4">
            {cfg.agenda.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundImage: "linear-gradient(to bottom right, #4F46E5, #4338CA)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <span className="text-xs font-semibold text-[var(--color-primary-light)]">{item.timeRange}</span>
                  <p className="text-sm text-[var(--color-soft)]">{item.task}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-900/20 to-violet-900/5 p-8 text-center">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" aria-hidden="true" />
          <div className="relative">
            <p className="eyebrow mb-2">Your certificate</p>
            <div className="mx-auto max-w-xs rounded-xl border-2 border-dashed border-violet-400/40 bg-black/20 p-5">
              <p className="text-xs text-[var(--color-muted)]">Certificate of completion</p>
              <p className="mt-1 text-lg font-bold">Build Your First AI Project</p>
              <p className="text-sm text-[var(--color-muted)]">Your name · live project link · LinkedIn-ready</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <p className="eyebrow mb-1 text-center">FAQ</p>
          <h2 className="mb-4 text-center text-xl">Quick answers</h2>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group select-none rounded-xl border border-white/10 bg-white/[0.06]">
                <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                  <h3 className="text-base font-medium">{q}</h3>
                  <span aria-hidden="true" className="text-gray-300 transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <p className="p-4 pt-0 text-sm leading-relaxed text-[var(--color-soft)]">{a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

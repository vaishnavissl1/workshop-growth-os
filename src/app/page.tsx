import { WORKSHOP_CONFIG as cfg } from "@/config";
import Countdown from "@/components/Countdown";
import PageGlow from "@/components/PageGlow";
import { Subhead } from "@/components/RegisterForm";
import { closesLabel, seatsLeft, sessionLabel } from "@/lib/seats";

export const dynamic = "force-dynamic";

const STATS = [
  ["60", "minutes, start to finish"],
  ["₹0", "no payment, ever"],
  ["1", "live public link for your resume"],
  ["2027", "batch · every engineering branch"],
];

const WALK_AWAY = [
  { icon: "🔗", title: "A live public link to your AI app", note: "Add it to your resume tonight. Interviewers can open it and try it." },
  { icon: "📜", title: "Certificate with your name + project title", note: "LinkedIn-ready, issued when you finish the build." },
  { icon: "🏆", title: "Proof you built something", note: "Before everyone else in your batch does." },
];

const STEPS = [
  ["0–10", "Set up", "Open Google Colab and add your API key."],
  ["10–40", "Build", "Make an LLM-powered app with Gradio."],
  ["40–55", "Deploy", "Publish it on Hugging Face Spaces and get a public URL."],
  ["55–60", "Share", "Get your certificate and add the project to LinkedIn and your resume."],
];

export default async function HomePage() {
  const left = await seatsLeft();

  return (
    <>
      <PageGlow tone="violet" />

      {/* Hero */}
      <section className="container-wide animate-fade-in-up grid items-center gap-12 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="badge badge-amber">Free</span>
            <span className="badge badge-primary">60 min</span>
            <span className="badge badge-success">2027 batch</span>
          </div>
          <h1 className="display">
            Build Your First <span className="gradient-text">AI Project</span> in 60 Minutes
          </h1>
          <p className="lead mt-6 max-w-xl">
            <Subhead />
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/register" className="btn-cta btn-lg">Reserve my free seat</a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/program" className="btn-secondary btn-lg">See the program →</a>
          </div>
          <p className="mt-5 text-sm text-slate-500">No coding background needed. A laptop, internet and a Google account is all it takes.</p>
        </div>

        {/* Live seat card */}
        <aside className="card animate-float !p-8" aria-label="Next session">
          <p className="eyebrow mb-3">Next live session</p>
          <p className="text-3xl font-semibold leading-tight">{sessionLabel(cfg.sessionDate)} IST</p>
          <p className="mt-1 text-slate-500">Repeat session: {sessionLabel(cfg.session2Date)} IST</p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Seats left in Session 1
            </p>
            <p className="mt-1 text-5xl font-bold text-[var(--color-success-text)]">
              {left}
              <span className="text-xl font-medium text-slate-500"> / {cfg.seatCap}</span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-[#991B1B] to-[#DC2626]" style={{ width: `${Math.min(100, ((cfg.seatCap - left) / cfg.seatCap) * 100)}%` }} />
            </div>
          </div>
          <div className="mt-5"><Countdown closesAt={cfg.registrationCloses} /></div>
          <p className="mt-4 text-sm text-slate-500">Registration closes {closesLabel()}.</p>
        </aside>
      </section>

      {/* Stats band */}
      <section aria-label="At a glance" className="border-y border-slate-200 bg-slate-50">
        <dl className="container-wide grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {STATS.map(([n, label]) => (
            <div key={label} className="text-center">
              <dt className="text-4xl font-bold gradient-text sm:text-5xl">{n}</dt>
              <dd className="mt-1 text-[0.95rem] text-slate-500">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Walk away with */}
      <section className="container-wide pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">What you&apos;ll walk away with</p>
          <h2 className="section-title">Three things you can show, not just say</h2>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {WALK_AWAY.map((w) => (
            <li key={w.title} className="card card-lift !p-9">
              <span aria-hidden="true" className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FBF2F3] text-4xl">
                {w.icon}
              </span>
              <h3 className="text-xl font-semibold">{w.title}</h3>
              <p className="mt-3 text-[1.0125rem] leading-relaxed text-slate-500">{w.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="container-wide pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">How the hour runs</p>
          <h2 className="section-title">Four steps, one finished project</h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([time, title, text], i) => (
            <li key={title} className="card card-lift relative overflow-hidden !p-8">
              <span aria-hidden="true" className="absolute -right-2 -top-4 text-8xl font-bold text-slate-900/[0.05]">{i + 1}</span>
              <p className="text-sm font-semibold text-[var(--color-primary-light)]">{time} min</p>
              <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-slate-500">{text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/program" className="btn-secondary btn-lg">Full program details →</a>
        </p>
      </section>

      {/* Who it's for */}
      <section className="container-wide pt-24">
        <div className="card !p-10 text-center sm:!p-14">
          <p className="eyebrow mb-3">Who it&apos;s for</p>
          <h2 className="section-title">Final-year engineers, any branch</h2>
          <p className="lead mx-auto mt-4 max-w-2xl">
            Interviewers are asking about GenAI and most resumes still show last year&apos;s projects. Come with whatever you study, leave with something current.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {cfg.targetBranches.filter((b) => b !== "Non-engineering").map((b) => (
              <li key={b} className="chip !flex items-center">{b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-wide pt-24">
        <div className="relative overflow-hidden rounded-3xl border border-[#F0CDD0] bg-gradient-to-b from-[#FBF2F3] to-white p-10 text-center sm:p-16">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02]" aria-hidden="true" />
          <div className="relative">
            <h2 className="section-title">Your seat is free. The hour is yours.</h2>
            <p className="lead mx-auto mt-4 max-w-xl">Takes a minute to register. Bring a laptop, we&apos;ll bring the rest.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/register" className="btn-cta btn-lg">Reserve my free seat</a>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/faq" className="btn-secondary btn-lg">Read the FAQ</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

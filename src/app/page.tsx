import { WORKSHOP_CONFIG as cfg } from "@/config";
import LandingActions from "@/components/landing/LandingActions";
import NetworkCanvas from "@/components/landing/NetworkCanvas";
import { sessionLabel } from "@/lib/seats";

const FACTS = [
  ["Live workshop", "60 minutes"],
  ["Next session", `${sessionLabel(cfg.sessionDate)} IST`],
  ["Open to", "2027 batch · every engineering branch"],
];

const LEAVE_WITH = [
  ["Build", "An app powered by a large language model, written by you."],
  ["Deploy", "A public link anyone can open, on Hugging Face Spaces."],
  ["Show", "A certificate and a project line for your resume."],
];

/** Landing page: the first thing a visitor sees. Log in (or create an account) to reach the workshop pages. */
export default function LandingPage() {
  return (
    <div className="px-3 pb-16 pt-4 sm:px-5">
      <section className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center overflow-hidden rounded-[2rem] bg-[#0B0F19]">
        <NetworkCanvas />
        {/* darkens the left side so the text stays readable over the animation */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
        <div aria-hidden="true" className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#991B1B]/30 blur-3xl" />

        <div className="relative w-full px-6 py-16 sm:px-12 lg:px-16">
          <p className="text-xl font-semibold text-[#EF4444] sm:text-2xl">Start your journey in</p>
          <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.08] text-white">
            Generative AI <span aria-hidden="true" className="mx-1 inline-block align-middle text-[0.5em] text-[#EF4444]">✦</span> LLM Apps
            <br />
            Deployment &amp; More
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">{cfg.title}</p>

          <dl className="mt-10 flex flex-col gap-6 sm:flex-row sm:gap-0 sm:divide-x sm:divide-white/25">
            {FACTS.map(([label, value]) => (
              <div key={label} className="sm:px-6 sm:first:pl-0">
                <dt className="text-sm font-medium uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-white sm:text-2xl">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <LandingActions />
          </div>
        </div>
      </section>

      <section aria-label="What you leave with" className="mx-auto mt-8 grid max-w-7xl gap-5 md:grid-cols-3">
        {LEAVE_WITH.map(([title, text], i) => (
          <div key={title} className="card !p-8">
            <p className="text-sm font-semibold text-[var(--color-primary-light)]">Step {i + 1}</p>
            <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-slate-500">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

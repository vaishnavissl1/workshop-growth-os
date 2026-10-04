import PageGlow from "@/components/PageGlow";
import PageHero from "@/components/PageHero";
import { WORKSHOP_CONFIG as cfg } from "@/config";

export const metadata = { title: "Certificate" };

const INCLUDES = [
  ["Your name", "Exactly as you registered it."],
  ["Your project title", "The AI app you built during the workshop."],
  ["Ready for LinkedIn", "A clean format you can add to your profile in a minute."],
];

const EARN = [
  ["Register", "Reserve a free seat. Use the name you want printed."],
  ["Build", "Follow the live session and finish your app."],
  ["Deploy", "Publish it on Hugging Face Spaces so it has a public link."],
  ["Receive", "Get your certificate at the end of the hour."],
];

const LINKEDIN = [
  "Open your LinkedIn profile and choose Add profile section → Licenses & certifications.",
  `Enter "${cfg.title}" as the name and the workshop as the issuing organisation.`,
  "Paste your live project link in the credential URL.",
  "Post a short note about what your app does, so people try it.",
];

export default function CertificatePage() {
  return (
    <>
      <PageGlow tone="amber" />
      <PageHero
        eyebrow="Your certificate"
        title={<>Proof you <span className="gradient-text">built it</span></>}
        lead="A certificate with your name and the title of the AI project you shipped."
      />

      {/* Certificate artwork */}
      <section className="container-mid">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-violet-900/40 via-indigo-950/60 to-black p-3 shadow-2xl shadow-violet-950/50">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" aria-hidden="true" />
          <div className="relative rounded-[1.6rem] border-2 border-dashed border-violet-300/40 px-6 py-14 text-center sm:px-16 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Certificate of completion</p>
            <p className="mt-8 text-gray-300">This certifies that</p>
            <p className="mt-2 text-4xl font-bold sm:text-6xl">Your Name</p>
            <p className="mt-8 text-gray-300">built and deployed a live AI application in</p>
            <p className="mt-2 text-2xl font-semibold sm:text-4xl">{cfg.title}</p>
            <p className="mt-8 text-sm text-gray-400">Sample layout. Your certificate carries your own name and project title.</p>
          </div>
        </div>
      </section>

      <section className="container-wide pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">What&apos;s on it</p>
          <h2 className="section-title">Three details, nothing generic</h2>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {INCLUDES.map(([t, d]) => (
            <li key={t} className="card card-lift !p-8">
              <h3 className="text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-gray-400">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-mid pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">How to earn it</p>
          <h2 className="section-title">Four steps</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-2">
          {EARN.map(([t, d], i) => (
            <li key={t} className="card !p-7">
              <p className="text-sm font-semibold text-[var(--color-primary-light)]">Step {i + 1}</p>
              <h3 className="mt-1 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-gray-400">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-mid pt-24">
        <div className="card !p-8 sm:!p-12">
          <p className="eyebrow mb-3">Add it to LinkedIn</p>
          <h2 className="section-title">Put it where recruiters look</h2>
          <ol className="mt-6 space-y-4">
            {LINKEDIN.map((s, i) => (
              <li key={s} className="flex gap-4 text-[1.0125rem] text-gray-300">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-200">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/register" className="btn-cta btn-lg !text-[#111827]">Reserve my free seat</a>
          </p>
        </div>
      </section>
    </>
  );
}

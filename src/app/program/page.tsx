import { WORKSHOP_CONFIG as cfg } from "@/config";
import AuthGate from "@/components/auth/AuthGate";
import PageGlow from "@/components/PageGlow";
import PageHero from "@/components/PageHero";
import ideas from "@/data/projectIdeas.json";
import { sessionLabel } from "@/lib/seats";

export const metadata = { title: "Program" };

type Idea = { title: string; description: string; stack: string };
const IDEAS = ideas as Record<string, Idea[]>;

const OVERVIEW = [
  ["🎥", "Live and online", "A single 60-minute session with a host walking you through every step on screen."],
  ["⌨️", "Follow along", "You build as we go. Nothing to prepare, no AI experience needed."],
  ["🚀", "Ends with a launch", "By minute 60 your app is public on the internet with a link you can share."],
];

const BLOCKS = [
  {
    time: "0–10 min",
    title: "Set up",
    task: cfg.agenda[0].task,
    steps: [
      "Open a fresh Google Colab notebook (it runs in your browser, nothing to install).",
      "Create a free API key for the language model and add it as a secret.",
      "Run a first cell to confirm the model answers you.",
    ],
    leave: "A working notebook connected to an LLM.",
  },
  {
    time: "10–40 min",
    title: "Build",
    task: cfg.agenda[1].task,
    steps: [
      "Choose a project idea for your branch (see the list below).",
      "Write a small Python function that takes input, calls the model and returns an answer.",
      "Wrap it in a Gradio interface and tune the prompt until it behaves.",
    ],
    leave: "A running AI app with a real interface.",
  },
  {
    time: "40–55 min",
    title: "Deploy",
    task: cfg.agenda[2].task,
    steps: [
      "Create a Hugging Face Space and push your app to it.",
      "Add your API key as a Space secret so the app can run for everyone.",
      "Open the public URL on your phone to prove it works.",
    ],
    leave: "A public link anyone can open.",
  },
  {
    time: "55–60 min",
    title: "Share",
    task: cfg.agenda[3].task,
    steps: [
      "Add the project and its link to your resume.",
      "Post it on LinkedIn with a short note on what it does.",
      "Receive your certificate with your name and project title.",
    ],
    leave: "A certificate and a resume line that wasn't there an hour ago.",
  },
];

const TOOLS = ["Google Colab", "Python", "Gradio", "Hugging Face Spaces", "An LLM API key (free tier)"];

export default function ProgramPage() {
  return (
    <AuthGate>
    <>
      <PageGlow tone="blue" />
      <PageHero
        eyebrow="The program"
        title={<>What happens in <span className="gradient-text">the hour</span></>}
        lead="A closer look at how the workshop runs, what you'll do at each step, and what you leave with."
      />

      <section className="container-wide">
        <ul className="grid gap-6 md:grid-cols-3">
          {OVERVIEW.map(([icon, title, text]) => (
            <li key={title} className="card !p-8">
              <span aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF2F3] text-3xl">{icon}</span>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 leading-relaxed text-slate-500">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-mid pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">Minute by minute</p>
          <h2 className="section-title">The 60-minute agenda</h2>
        </div>
        <ol className="space-y-6">
          {BLOCKS.map((b, i) => (
            <li key={b.title} className="card !p-8 sm:!p-10">
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundImage: "linear-gradient(to bottom right, #B91C1C, #991B1B)" }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary-light)]">{b.time}</p>
                  <h3 className="text-2xl font-semibold">{b.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-lg text-slate-800">{b.task}</p>
              <ul className="mt-4 space-y-2 text-[1.0125rem] text-slate-500">
                {b.steps.map((s) => (
                  <li key={s} className="flex gap-3">
                    <span aria-hidden="true" className="mt-1 text-[#991B1B]">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
              <p className="notice-violet mt-6 p-4 text-[0.95rem]"><strong>You leave with:</strong> {b.leave}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-mid pt-24">
        <div className="card !p-8 text-center sm:!p-12">
          <p className="eyebrow mb-3">What you&apos;ll use</p>
          <h2 className="section-title">Free tools, nothing to buy</h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {TOOLS.map((t) => (
              <li key={t} className="chip !flex items-center">{t}</li>
            ))}
          </ul>
          <p className="mt-6 text-slate-500">You need a laptop, a stable internet connection and a free Google account.</p>
        </div>
      </section>

      <section className="container-wide pt-24">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">Project ideas</p>
          <h2 className="section-title">Pick something from your own branch</h2>
          <p className="lead mx-auto mt-4 max-w-2xl">Every idea is built the same way, so you can follow along whichever one you choose.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(IDEAS)
            .filter(([b]) => b !== "Non-engineering")
            .map(([branch, list]) => (
              <div key={branch} className="card card-lift !p-7">
                <h3 className="mb-4 text-lg font-semibold text-[var(--color-primary-light)]">{branch}</h3>
                <ul className="space-y-4">
                  {list.map((i) => (
                    <li key={i.title}>
                      <p className="font-semibold">{i.title}</p>
                      <p className="text-[0.95rem] text-slate-500">{i.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      <section className="container-mid pt-24">
        <div className="card !p-8 sm:!p-12">
          <p className="eyebrow mb-3 text-center">Sessions</p>
          <h2 className="section-title text-center">Two dates, same workshop</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="inset p-6">
              <p className="text-sm text-slate-500">Session 1</p>
              <p className="mt-1 text-2xl font-semibold">{sessionLabel(cfg.sessionDate)} IST</p>
              <p className="mt-1 text-sm text-slate-500">{cfg.seatCap} seats</p>
            </div>
            <div className="inset p-6">
              <p className="text-sm text-slate-500">Repeat session</p>
              <p className="mt-1 text-2xl font-semibold">{sessionLabel(cfg.session2Date)} IST</p>
              <p className="mt-1 text-sm text-slate-500">Opens automatically if Session 1 fills</p>
            </div>
          </div>
        </div>
      </section>
    </>
    </AuthGate>
  );
}

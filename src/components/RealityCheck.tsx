"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * A one-minute self-check on the home page. Each question is something the workshop itself delivers, so the
 * result is a plain count of what the student already has, not a prediction of whether they will be placed.
 */
const QUESTIONS = [
  {
    q: "Have you built an app that uses an AI model?",
    gap: "An AI app you built yourself",
    fix: "Minutes 10–40: you build an LLM-powered app with Gradio.",
  },
  {
    q: "Is a project of yours live at a public link anyone can open?",
    gap: "A project that is live, not just on your laptop",
    fix: "Minutes 40–55: you deploy it on Hugging Face Spaces.",
  },
  {
    q: "Does your resume have a project link an interviewer can click and try?",
    gap: "A clickable project link on your resume",
    fix: "You leave with a public URL to add the same evening.",
  },
  {
    q: "Could you explain, start to finish, how you built and deployed a project?",
    gap: "A project story you can tell in an interview",
    fix: "You do every step yourself, so you can walk someone through it.",
  },
  {
    q: "Do you have a certificate or post on LinkedIn that names a project you built?",
    gap: "Proof on LinkedIn with your project's name on it",
    fix: "Minutes 55–60: a certificate with your name and project title.",
  },
];

export default function RealityCheck() {
  const [answers, setAnswers] = useState<boolean[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const have = answers.filter(Boolean).length;
  const gaps = QUESTIONS.filter((_, i) => answers[i] === false);

  function answer(yes: boolean) {
    const next = [...answers, yes];
    if (step === 0) track("check_start");
    if (next.length === QUESTIONS.length) track("check_done", { have: next.filter(Boolean).length });
    setAnswers(next);
  }

  return (
    <div className="card mx-auto max-w-3xl !p-8 sm:!p-12" aria-live="polite">
      {!done ? (
        <>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-500">Question {step + 1} of {QUESTIONS.length}</p>
            <div className="flex gap-1.5" aria-hidden="true">
              {QUESTIONS.map((_, i) => (
                <span key={i} className={`h-2 w-8 rounded-full ${i < step ? "bg-[#991B1B]" : i === step ? "bg-[#E5B8BB]" : "bg-slate-200"}`} />
              ))}
            </div>
          </div>
          <h3 className="text-2xl font-semibold leading-snug sm:text-3xl">{QUESTIONS[step].q}</h3>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button type="button" onClick={() => answer(true)} className="btn-secondary btn-lg">Yes</button>
            <button type="button" onClick={() => answer(false)} className="btn-secondary btn-lg">Not yet</button>
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow mb-2">Your result</p>
          <h3 className="text-3xl font-semibold sm:text-4xl">
            You have <span className="gradient-text">{have} of {QUESTIONS.length}</span>
          </h3>
          {gaps.length > 0 ? (
            <>
              <p className="lead mt-3">
                {gaps.length === 1 ? "One thing is missing." : `${gaps.length} things are missing.`} The workshop covers {gaps.length === 1 ? "it" : "all of them"} in one hour.
              </p>
              <ul className="mt-7 space-y-3">
                {gaps.map((g) => (
                  <li key={g.gap} className="inset flex gap-4 p-5">
                    <span aria-hidden="true" className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#FBF2F3] text-sm font-bold text-[#991B1B]">✕</span>
                    <span>
                      <span className="block font-semibold">{g.gap}</span>
                      <span className="block text-[0.95rem] text-slate-500">{g.fix}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="lead mt-3">You already have all five. Come anyway if you want a second project built with an LLM, or send this to a friend who doesn&apos;t.</p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/register" onClick={() => track("check_cta", { have })} className="btn-cta btn-lg">
              {gaps.length > 0 ? `Close ${gaps.length === 1 ? "this gap" : `these ${gaps.length} gaps`} for free` : "Reserve my free seat"}
            </a>
            <button type="button" onClick={() => setAnswers([])} className="text-sm font-semibold text-slate-500 underline underline-offset-4">
              Start again
            </button>
          </div>
        </>
      )}
    </div>
  );
}

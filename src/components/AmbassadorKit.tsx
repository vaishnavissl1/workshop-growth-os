"use client";

import { useState } from "react";
import PageGlow from "@/components/PageGlow";
import CopyButton from "@/components/CopyButton";
import { LANGS, MESSAGE_TITLES, fillMessage, tpoEmail, type Lang } from "@/lib/kit";

type Props = {
  code: string;
  name: string;
  college: string;
  simulated: boolean;
  link: string;
  stats: { total: number; verified: number; position: number | null; of: number };
};

const inputCls = "field";
const INDIC = { fontFamily: "var(--font-indic), var(--font-body), sans-serif" } as const;

export default function AmbassadorKit({ code, name, college, simulated, link, stats }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [club, setClub] = useState("");
  const [friend, setFriend] = useState("");
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [tpoCollege, setTpoCollege] = useState("");
  const [tpoName, setTpoName] = useState("");

  async function pick(next: Lang) {
    setLang(next);
    if (next === "en") return;
    setLoading(true);
    // Ask the server for each message (LLM when a key is configured, AI-drafted static copy otherwise).
    const out: Record<string, string> = {};
    await Promise.all(
      [0, 1, 2].map(async (i) => {
        try {
          const r = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lang: next, index: i, link, club, name: friend, amb: code }),
          });
          const d = await r.json();
          out[`${next}${i}`] = d.ok ? d.text : fillMessage(next, i, { link, club, name: friend });
        } catch {
          out[`${next}${i}`] = fillMessage(next, i, { link, club, name: friend });
        }
      }),
    );
    setTranslated((t) => ({ ...t, ...out }));
    setLoading(false);
  }

  const email = tpoEmail(tpoCollege, tpoName, name);
  const emailText = `Subject: ${email.subject}\n\n${email.body}`;

  return (
    <>
      <PageGlow tone="pink" />
    <div className="container-page animate-fade-in-up pt-14 pb-10">
      <div className="mx-auto max-w-md space-y-5">
        <div>
          <h1 className="text-3xl font-bold">Hi {name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-[var(--color-muted)]">
            {college} · code <strong>{code}</strong>
            {simulated && " · simulated ambassador"}
          </p>
        </div>

        <section className="card">
          <h2 className="mb-3 text-lg font-bold">Your stats</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-[var(--color-muted)]">registered</p></div>
            <div><p className="text-2xl font-bold">{stats.verified}</p><p className="text-xs text-[var(--color-muted)]">verified</p></div>
            <div><p className="text-2xl font-bold">{stats.position ? `#${stats.position}` : "–"}</p><p className="text-xs text-[var(--color-muted)]">of {stats.of}</p></div>
          </div>
          <p className="mt-3 text-xs text-[var(--color-muted)]">Rewards go to verified registrations only (2027 batch, engineering).</p>
        </section>

        <section className="card space-y-3">
          <h2 className="text-lg font-bold">Your tracked link</h2>
          <p className="inset break-all p-3 text-sm">{link}</p>
          <CopyButton text={link} label="Copy link" />
        </section>

        <section className="card space-y-4">
          <h2 className="text-lg font-bold">Messages to forward</h2>
          <div role="group" aria-label="Language" className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => pick(l.id)}
                aria-pressed={lang === l.id}
                className="chip"
              >
                {l.label}
              </button>
            ))}
          </div>
          {lang !== "en" && (
            <p className="notice-amber p-3 text-sm font-semibold">
              AI-drafted · native-speaker review needed before you send this.
            </p>
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            <input className={inputCls} placeholder="Club name (message 2)" value={club} onChange={(e) => setClub(e.target.value)} />
            <input className={inputCls} placeholder="Friend's name (message 3)" value={friend} onChange={(e) => setFriend(e.target.value)} />
          </div>
          {MESSAGE_TITLES.map((title, i) => {
            const text =
              lang === "en"
                ? fillMessage("en", i, { link, club, name: friend })
                : (translated[`${lang}${i}`] ?? fillMessage(lang, i, { link, club, name: friend }));
            return (
              <div key={title} className="space-y-2">
                <p className="text-sm font-bold">{i + 1}. {title}</p>
                <pre style={lang === "en" ? undefined : INDIC} className="inset whitespace-pre-wrap p-3 text-sm leading-relaxed text-[var(--color-soft)]">
                  {loading && lang !== "en" ? "Loading…" : text}
                </pre>
                <CopyButton text={text} label="Copy" />
              </div>
            );
          })}
        </section>

        <section className="card space-y-3">
          <h2 className="text-lg font-bold">TPO email generator</h2>
          <input className={inputCls} placeholder="College name" value={tpoCollege} onChange={(e) => setTpoCollege(e.target.value)} />
          <input className={inputCls} placeholder="TPO name" value={tpoName} onChange={(e) => setTpoName(e.target.value)} />
          <pre className="inset whitespace-pre-wrap p-3 text-sm leading-relaxed text-[var(--color-soft)]">{emailText}</pre>
          <CopyButton text={emailText} label="Copy email" />
        </section>
      </div>
    </div>
    </>
  );
}

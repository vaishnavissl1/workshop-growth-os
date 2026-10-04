"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ideas from "@/data/projectIdeas.json";
import { COLLEGES } from "@/lib/colleges";
import { WORKSHOP_CONFIG as cfg } from "@/config";

type Idea = { title: string; description: string; stack: string };
const IDEAS = ideas as Record<string, Idea[]>;
const VARIANTS = ["control", "resume", "certificate"] as const;
const STORE = "wgos";

type Stored = { ref?: string; source?: string; ambassador?: string; variant?: string };

function readStore(): Stored {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? "{}");
  } catch {
    return {};
  }
}

export const SUBHEADS: Record<string, string> = {
  control: "A free, hands-on live workshop for final-year engineering students.",
  resume: cfg.tagline,
  certificate: "Build, deploy and get certified, in one hour, for free.",
};

/** Subhead that depends on the A/B variant (assigned once per visitor, kept in localStorage). */
export function Subhead() {
  const [variant, setVariant] = useState("control");
  useEffect(() => setVariant(ensureVariant()), []);
  return <>{SUBHEADS[variant]}</>;
}

function ensureVariant() {
  const s = readStore();
  if (s.variant && s.variant in SUBHEADS) return s.variant;
  const v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  try {
    localStorage.setItem(STORE, JSON.stringify({ ...s, variant: v }));
  } catch {}
  return v;
}

export default function RegisterForm({ refCode }: { refCode?: string }) {
  const router = useRouter();
  const [branch, setBranch] = useState("");
  const [project, setProject] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attr, setAttr] = useState<Stored>({});

  // Capture attribution from the URL, falling back to localStorage (WhatsApp in-app browsers drop cookies).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const prev = readStore();
    const next: Stored = {
      ...prev,
      ref: refCode ?? q.get("ref") ?? prev.ref,
      source: q.get("src") ?? prev.source,
      ambassador: q.get("amb") ?? prev.ambassador,
      variant: ensureVariant(),
    };
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {}
    setAttr(next);
  }, [refCode]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!branch) return setError("Please pick your branch above.");
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          college: f.get("college"),
          branch,
          gradYear: f.get("gradYear"),
          consent: f.get("consent") === "on",
          website: f.get("website"),
          projectIdea: project,
          ref: attr.ref,
          source: attr.ref ? "referral" : attr.source,
          ambassador: attr.ambassador,
          variant: attr.variant,
        }),
      });
      const data = await res.json();
      if (!data.ok) return setError(data.message ?? "Something went wrong.");
      router.push(`/thanks/${data.ref_code}${data.already_registered ? "?again=1" : ""}`);
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-ink)] focus:border-[var(--color-primary)]";
  const label = "block text-sm font-semibold mb-1";

  return (
    <form onSubmit={onSubmit} className="space-y-5" id="register">
      <div>
        <p className={label}>1. Tap your branch to see what you could build</p>
        <div className="flex flex-wrap gap-2">
          {cfg.targetBranches.map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => {
                setBranch(b);
                setProject("");
              }}
              aria-pressed={branch === b}
              className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold ${
                branch === b
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-ink)]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {branch && (
        <div className="space-y-2">
          <p className={label}>Pick the project you would like to build</p>
          {IDEAS[branch]?.map((i) => (
            <button
              type="button"
              key={i.title}
              onClick={() => setProject(i.title)}
              aria-pressed={project === i.title}
              className={`block w-full min-h-[44px] rounded-xl border p-3 text-left ${
                project === i.title
                  ? "border-[var(--color-primary)] bg-[#EEF2FF]"
                  : "border-[var(--color-border)] bg-white"
              }`}
            >
              <span className="block text-sm font-bold">{i.title}</span>
              <span className="block text-sm text-[var(--color-muted)]">{i.description}</span>
              <span className="mt-1 block text-xs font-semibold text-[var(--color-primary)]">{i.stack}</span>
            </button>
          ))}
        </div>
      )}

      <div>
        <label className={label} htmlFor="name">2. Your name</label>
        <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={input} />
      </div>
      <div>
        <label className={label} htmlFor="phone">WhatsApp number</label>
        <input id="phone" name="phone" required inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" className={input} />
      </div>
      <div>
        <label className={label} htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={input} />
      </div>
      <div>
        <label className={label} htmlFor="college">College</label>
        <input id="college" name="college" required list="colleges" placeholder="Start typing, or enter your own" className={input} />
        <datalist id="colleges">
          {COLLEGES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div>
        <label className={label} htmlFor="gradYear">Graduation year</label>
        <select id="gradYear" name="gradYear" defaultValue="2027" className={input}>
          {[2026, 2027, 2028, 2029].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1 h-5 w-5" />
        <span>I agree to be contacted on WhatsApp/email about this workshop.</span>
      </label>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>
      )}

      <button id="cta-reserve-seat" type="submit" disabled={busy} className="btn-cta w-full text-lg">
        {busy ? "Reserving…" : "Reserve my free seat"}
      </button>
    </form>
  );
}

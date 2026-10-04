"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ideas from "@/data/projectIdeas.json";
import { COLLEGES } from "@/lib/colleges";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import { resolveVariant, track, type Variant } from "@/lib/analytics";

type Idea = { title: string; description: string; stack: string };
const IDEAS = ideas as Record<string, Idea[]>;
const STORE = "wgos";

/** The six picker chips; the form's branch select offers every option (incl. Chemical, Biotech, Non-engineering). */
const PICKER: { label: string; branch: string }[] = [
  { label: "CSE", branch: "CSE / IT" },
  { label: "ECE", branch: "ECE" },
  { label: "EEE", branch: "EEE" },
  { label: "Mech", branch: "Mechanical" },
  { label: "Civil", branch: "Civil" },
  { label: "Other", branch: "Other Engineering" },
];

type Stored = { ref?: string; source?: string; ambassador?: string };

function readStore(): Stored {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? "{}");
  } catch {
    return {};
  }
}

const SUBHEADS: Record<Variant, string> = {
  control: "A free, hands-on live workshop for final-year engineering students.",
  resume: "Walk into your next placement interview with a live AI project link on your resume.",
  certificate: "Build, deploy and get certified, in one hour, for free.",
};

/** Subhead driven by the PostHog `headline_variant` flag (control / resume / certificate). */
export function Subhead() {
  const [variant, setVariant] = useState<Variant>("control");
  useEffect(() => resolveVariant(setVariant), []);
  return <>{SUBHEADS[variant]}</>;
}

export default function RegisterForm({ refCode }: { refCode?: string }) {
  const router = useRouter();
  const [branch, setBranch] = useState("");
  const [project, setProject] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attr, setAttr] = useState<Stored>({});
  const [variant, setVariant] = useState<Variant>("control");

  // Attribution: URL param first, then localStorage (WhatsApp in-app browsers can drop cookies).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const prev = readStore();
    const next: Stored = {
      ref: refCode ?? q.get("ref") ?? prev.ref,
      source: q.get("src") ?? prev.source,
      ambassador: q.get("amb") ?? prev.ambassador,
    };
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only state (URL, localStorage)
    setAttr(next);
    resolveVariant((v) => {
      setVariant(v);
      track("landing_view", { headline_variant: v, source: next.source ?? "direct", ambassador_code: next.ambassador });
    });
  }, [refCode]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!branch) return setError("Please pick your branch above.");
    const f = new FormData(e.currentTarget);
    setBusy(true);
    track("form_submit", { headline_variant: variant, source: attr.source ?? "direct" });
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
          ref: f.get("ref") || attr.ref,
          source: attr.source,
          ambassador: attr.ambassador,
          variant,
        }),
      });
      const data = await res.json();
      if (!data.ok) return setError(data.message ?? "Something went wrong. Please try again.");
      console.log("ref_code:", data.ref_code);
      try {
        localStorage.setItem("wgos_me", data.ref_code);
      } catch {}
      router.push(`/thanks/${data.ref_code}?t=${data.t}${data.already_registered ? "&again=1" : ""}`);
    } catch {
      setError("Network problem. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const input = "field";
  const label = "block text-sm font-semibold mb-1 text-gray-200";

  return (
    <form onSubmit={onSubmit} className="space-y-5" id="register">
      <div>
        <p className={label}>1. Tap your branch to see what you could build</p>
        <div className="flex flex-wrap gap-2">
          {PICKER.map((b) => (
            <button
              type="button"
              key={b.label}
              onClick={() => {
                setBranch(b.branch);
                setProject("");
                track("branch_picked", { branch: b.branch });
              }}
              aria-pressed={branch === b.branch}
              className="chip min-w-[64px]"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {branch && (
        <div className="space-y-2">
          <p className={label}>3 AI projects you could build in 60 minutes. Pick one:</p>
          {IDEAS[branch]?.map((i) => (
            <button
              type="button"
              key={i.title}
              onClick={() => setProject(i.title)}
              aria-pressed={project === i.title}
              className="option-card"
            >
              <span className="block text-sm font-bold">{i.title}</span>
              <span className="block text-sm text-[var(--color-muted)]">{i.description}</span>
              <span className="mt-1 block text-xs font-semibold text-[var(--color-primary-light)]">{i.stack}</span>
            </button>
          ))}
        </div>
      )}

      <div>
        <label className={label} htmlFor="name">2. Your name</label>
        <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={input} onFocus={() => track("form_start")} />
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
        <label className={label} htmlFor="branch">Branch</label>
        <select id="branch" value={branch} onChange={(e) => { setBranch(e.target.value); setProject(""); }} required className={input}>
          <option value="" disabled>Select your branch</option>
          {cfg.targetBranches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="gradYear">Graduation year</label>
        <select id="gradYear" name="gradYear" defaultValue="2027" className={input}>
          {[2026, 2027, 2028, 2029].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Referrer code: also carried as a hidden field (URL param + localStorage + hidden field, never cookies) */}
      <input type="hidden" name="ref" value={attr.ref ?? ""} />

      {/* Honeypot: invisible to people, tempting for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="flex items-start gap-3 text-sm text-[var(--color-soft)]">
        <input type="checkbox" name="consent" required className="mt-1 h-5 w-5 accent-violet-500" />
        <span>I agree to be contacted on WhatsApp/email about this workshop.</span>
      </label>

      {error && <p role="alert" className="notice-red p-3 text-sm font-medium">{error}</p>}

      <button id="cta-reserve-seat" type="submit" disabled={busy} className="btn-cta w-full text-lg">
        {busy ? "Reserving…" : "Reserve my free seat"}
      </button>
    </form>
  );
}

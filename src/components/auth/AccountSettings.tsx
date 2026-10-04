"use client";

import { useCallback, useEffect, useState } from "react";
import { WORKSHOP_CONFIG as cfg } from "@/config";
import ideas from "@/data/projectIdeas.json";
import CopyButton from "@/components/CopyButton";
import { COLLEGES } from "@/lib/colleges";
import { authClient, authHeader } from "@/lib/supabaseBrowser";
import { Field, Notice, PasswordInput } from "@/components/auth/AuthShell";

type Idea = { title: string };
const IDEAS = ideas as Record<string, Idea[]>;

type Registration = {
  name: string;
  phone: string;
  college: string;
  branch: string;
  grad_year: number;
  project_idea: string | null;
  ref_code: string;
  session: number;
  is_verified: boolean;
};
type Profile = {
  account: { email: string; name: string; created_at: string };
  registration: Registration | null;
  thanksToken: string | null;
};

function Section({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="card !p-8 sm:!p-10">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {lead && <p className="mt-1 text-slate-500">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function AccountSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tone: "red" | "green"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ tone: "red" | "green"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState("");

  const load = useCallback(async () => {
    const headers = await authHeader();
    if (!headers.Authorization) {
      window.location.assign("/login?next=/account");
      return;
    }
    const res = await fetch("/api/profile", { headers, cache: "no-store" });
    if (res.status === 401) {
      window.location.assign("/login?next=/account");
      return;
    }
    const data = await res.json();
    setProfile(data);
    setBranch(data.registration?.branch ?? "");
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch of the signed-in user's profile
    load();
  }, [load]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    const f = new FormData(e.currentTarget);
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify({
        name: f.get("name"),
        phone: f.get("phone"),
        college: f.get("college"),
        branch,
        gradYear: f.get("gradYear"),
        projectIdea: f.get("projectIdea"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    setMsg({ tone: res.ok ? "green" : "red", text: data.message ?? (res.ok ? "Saved." : "Could not save.") });
    if (res.ok) load();
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwMsg(null);
    const form = e.currentTarget;
    const f = new FormData(form);
    const password = String(f.get("password"));
    if (password !== String(f.get("confirm"))) return setPwMsg({ tone: "red", text: "The two passwords don't match." });
    const { error } = (await authClient()?.auth.updateUser({ password })) ?? { error: { message: "unavailable" } };
    if (error) {
      return setPwMsg({
        tone: "red",
        text: /same|different/i.test(error.message) ? "Choose a password you haven't used before." : "Could not update your password. Log in again and retry.",
      });
    }
    form.reset();
    setPwMsg({ tone: "green", text: "Password updated." });
  }

  async function signOut() {
    await authClient()?.auth.signOut();
    window.location.assign("/");
  }

  async function deleteAccount() {
    const res = await fetch("/api/profile", { method: "DELETE", headers: await authHeader() });
    if (res.ok) {
      await authClient()?.auth.signOut();
      try {
        localStorage.removeItem("wgos_me");
      } catch {}
      window.location.assign("/");
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg({ tone: "red", text: data.message ?? "Could not delete your account." });
    }
  }

  if (loading || !profile) {
    return (
      <div className="container-wide py-24 text-center text-slate-500" role="status">
        Loading your account…
      </div>
    );
  }

  const reg = profile.registration;
  const displayName = reg?.name ?? (profile.account.name || profile.account.email);
  const inviteLink = reg ? `${window.location.origin}/r/${reg.ref_code}` : "";
  const branchIdeas = IDEAS[branch] ?? [];

  return (
    <div className="container-wide animate-fade-in-up py-14 sm:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Account settings</p>
            <h1 className="section-title !text-[clamp(2rem,4.5vw,3rem)]">Hi, {displayName.trim().split(/\s+/)[0]}</h1>
            <p className="mt-1 text-slate-500">{profile.account.email}</p>
          </div>
          <button onClick={signOut} className="btn-secondary">Log out</button>
        </header>

        {/* Workshop status */}
        {reg ? (
          <Section title="Your workshop seat" lead="You're registered. Share your link to climb the leaderboard.">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="inset p-4"><p className="text-xs text-slate-500">Session</p><p className="text-lg font-semibold">{reg.session === 2 ? "Repeat session" : "Session 1"}</p></div>
              <div className="inset p-4"><p className="text-xs text-slate-500">Invite code</p><p className="text-lg font-semibold">{reg.ref_code}</p></div>
              <div className="inset p-4"><p className="text-xs text-slate-500">Reward status</p><p className="text-lg font-semibold">{reg.is_verified ? "Verified ✓" : "Not verified"}</p></div>
            </div>
            {!reg.is_verified && (
              <p className="notice-amber mt-4 p-4 text-[0.95rem]">
                Referral rewards apply to {cfg.targetGradYear}-batch engineering registrations. Update your branch or year below if they&apos;re wrong.
              </p>
            )}
            <p className="inset mt-5 break-all p-4 text-[0.95rem]">{inviteLink}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <CopyButton text={inviteLink} label="Copy invite link" />
              {profile.thanksToken && (
                // eslint-disable-next-line @next/next/no-html-link-for-pages
                <a className="btn-secondary" href={`/thanks/${reg.ref_code}?t=${profile.thanksToken}`}>View my seat page</a>
              )}
            </div>
          </Section>
        ) : (
          <Section title="Reserve your seat" lead="You have an account but no workshop seat yet.">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/register" className="btn-cta btn-lg">Reserve my free seat</a>
          </Section>
        )}

        {/* Profile */}
        <Section title="Profile" lead={reg ? "These details appear on your certificate and in workshop messages." : "Your name appears on your account."}>
          <form onSubmit={save} className="space-y-5">
            <Field label="Full name">
              <input name="name" required minLength={2} maxLength={80} defaultValue={displayName} className="field" />
            </Field>
            <Field label="Email" hint="Can't be changed here">
              <input value={profile.account.email} readOnly className="field cursor-not-allowed opacity-60" aria-readonly="true" />
            </Field>
            {reg && (
              <>
                <Field label="WhatsApp number">
                  <input name="phone" required inputMode="tel" autoComplete="tel" defaultValue={reg.phone} className="field" />
                </Field>
                <Field label="College">
                  <input name="college" required list="account-colleges" defaultValue={reg.college} className="field" />
                  <datalist id="account-colleges">
                    {COLLEGES.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Branch">
                    <select value={branch} onChange={(e) => setBranch(e.target.value)} className="field">
                      {cfg.targetBranches.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Graduation year">
                    <select name="gradYear" defaultValue={reg.grad_year} className="field">
                      {[2026, 2027, 2028, 2029].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Project you'll build" hint="Ideas for your branch">
                  <select name="projectIdea" key={branch} defaultValue={reg.project_idea ?? ""} className="field">
                    <option value="">Decide later</option>
                    {branchIdeas.map((i) => <option key={i.title} value={i.title}>{i.title}</option>)}
                  </select>
                </Field>
              </>
            )}
            {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
            <button className="btn-primary btn-lg" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
          </form>
        </Section>

        {/* Security */}
        <Section title="Password" lead="Choose a new password for this account.">
          <form onSubmit={changePassword} className="space-y-5">
            <Field label="New password" hint="At least 8 characters">
              <PasswordInput id="new-password" name="password" autoComplete="new-password" minLength={8} />
            </Field>
            <Field label="Confirm new password">
              <PasswordInput id="confirm-password" name="confirm" autoComplete="new-password" minLength={8} />
            </Field>
            {pwMsg && <Notice tone={pwMsg.tone}>{pwMsg.text}</Notice>}
            <button className="btn-secondary btn-lg">Update password</button>
          </form>
        </Section>

        {/* Danger zone */}
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-red-800">Delete account</h2>
          <p className="mt-2 text-slate-600">
            This removes your login and erases your name, phone and email from your registration. Your invite code and college count stay, without any personal details, so friends you referred keep their place.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder='Type DELETE to confirm'
              aria-label="Type DELETE to confirm"
              className="field sm:max-w-xs"
            />
            <button
              onClick={deleteAccount}
              disabled={confirmDelete !== "DELETE"}
              className="btn-secondary !border-red-300 !text-red-800 hover:!bg-red-50"
            >
              Delete my account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

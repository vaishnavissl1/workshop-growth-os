"use client";

import { useState } from "react";

/** Centered card used by every auth page, so log in / sign up / reset all feel like one flow. */
export default function AuthShell({
  eyebrow,
  title,
  lead,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="container-wide animate-fade-in-up py-14 sm:py-20">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="section-title !text-[clamp(2rem,4.5vw,3rem)]">{title}</h1>
          {lead && <p className="lead mt-3">{lead}</p>}
        </div>
        <div className="card !p-8 sm:!p-10">{children}</div>
        {footer && <div className="mt-6 text-center text-[0.95rem] text-gray-400">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-gray-200">{label}</span>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordInput({
  id,
  name,
  autoComplete,
  placeholder,
  minLength,
}: {
  id: string;
  name: string;
  autoComplete: string;
  placeholder?: string;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="field !pr-20"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-300 hover:bg-white/10"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function Notice({ tone, children }: { tone: "red" | "green" | "amber"; children: React.ReactNode }) {
  return (
    <p role={tone === "red" ? "alert" : "status"} className={`notice-${tone} p-4 text-[0.95rem] font-medium`}>
      {children}
    </p>
  );
}

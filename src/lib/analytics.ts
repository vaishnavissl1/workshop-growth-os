"use client";

import posthog from "posthog-js";

export const VARIANTS = ["control", "resume", "certificate"] as const;
export type Variant = (typeof VARIANTS)[number];

let started = false;

/** Initialise PostHog once (session recording on, input masking left at its default: ON). */
export function initAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (started || !key || typeof window === "undefined") return started;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
  });
  started = true;
  return true;
}

export function track(event: string, props?: Record<string, unknown>) {
  try {
    if (started) posthog.capture(event, props);
  } catch {}
}

/**
 * Resolve `headline_variant`: the PostHog flag if it loads, otherwise a random variant kept in
 * localStorage so the page still works without PostHog (or if the flag isn't created yet).
 */
export function resolveVariant(onResolve: (v: Variant) => void) {
  const fallback = () => {
    let v: string | null = null;
    try {
      v = localStorage.getItem("wgos_variant");
    } catch {}
    if (!VARIANTS.includes(v as Variant)) {
      v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
      try {
        localStorage.setItem("wgos_variant", v);
      } catch {}
    }
    return v as Variant;
  };

  if (!initAnalytics()) return onResolve(fallback());

  let done = false;
  const finish = (v: Variant) => {
    if (!done) {
      done = true;
      onResolve(v);
    }
  };
  posthog.onFeatureFlags(() => {
    const flag = posthog.getFeatureFlag("headline_variant");
    finish(VARIANTS.includes(flag as Variant) ? (flag as Variant) : fallback());
  });
  setTimeout(() => finish(fallback()), 1500); // don't leave the subhead hanging if PostHog is slow
}

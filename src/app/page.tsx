import type { Metadata } from "next";
import { WORKSHOP_CONFIG } from "@/config";

export const metadata: Metadata = {
  title: WORKSHOP_CONFIG.title,
  description: WORKSHOP_CONFIG.ogDescription,
  openGraph: {
    title: WORKSHOP_CONFIG.title,
    description: WORKSHOP_CONFIG.ogDescription,
    url: WORKSHOP_CONFIG.siteUrl,
  },
};

/**
 * P1 Scaffold — Landing Page Placeholder
 * Features will be added in P3 (Tier 1).
 */
export default function HomePage() {
  const cfg = WORKSHOP_CONFIG;

  return (
    <div className="container-page py-12 animate-fade-in-up">
      {/* Badge row */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <span className="badge badge-amber">FREE</span>
        <span className="badge badge-primary">60 MIN</span>
        <span className="badge badge-success">2027 BATCH</span>
      </div>

      {/* Title */}
      <h1
        className="text-[32px] sm:text-4xl font-extrabold text-center leading-tight mb-4"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {cfg.title}
      </h1>

      {/* Subhead */}
      <p className="text-center text-[var(--color-muted)] text-lg mb-8 max-w-md mx-auto">
        {cfg.tagline}
      </p>

      {/* CTA placeholder */}
      <div className="flex justify-center mb-12">
        <button
          id="cta-reserve-seat"
          className="btn-cta text-lg px-8 py-4 w-full max-w-sm"
          disabled
          aria-label="Reserve your free seat — coming soon"
        >
          Reserve My Free Seat
        </button>
      </div>

      {/* Agenda preview */}
      <div className="card max-w-sm mx-auto mb-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          60-Minute Agenda
        </h2>
        <ol className="space-y-3">
          {cfg.agenda.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                }}
              >
                {i + 1}
              </span>
              <div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {item.timeRange}
                </span>
                <p className="text-sm text-[var(--color-ink)]">{item.task}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Scaffold notice */}
      <div
        className="rounded-xl border border-dashed border-[var(--color-border)] p-6 text-center"
        style={{ background: "#F1F5F9" }}
      >
        <p className="text-sm text-[var(--color-muted)]">
          🚧&nbsp;<strong>P1 Scaffold</strong> — Features (registration form,
          leaderboard, admin) will be added in P2–P3.
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Seat cap: <strong>{cfg.seatCap}</strong> · Target:{" "}
          <strong>{cfg.registrationTarget}</strong> · Budget: ₹
          <strong>{cfg.totalBudget.toLocaleString("en-IN")}</strong>
        </p>
      </div>
    </div>
  );
}

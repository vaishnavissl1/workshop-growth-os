/** The five checkpoints attendees tick off during the workshop hour. */
export const LIVE_STEPS = [
  { step: 1, label: "Colab is open", help: "Open a new Google Colab notebook." },
  { step: 2, label: "API key is set", help: "Add your key as a secret, not in the code." },
  { step: 3, label: "My app runs", help: "The Gradio interface answers a question." },
  { step: 4, label: "It's deployed", help: "Your Hugging Face Space has a public link." },
  { step: 5, label: "I checked it", help: "You ran it through the project checker." },
] as const;

export const SESSION_RE = /^[a-z0-9][a-z0-9-]{1,39}$/;
export const ATTENDEE_RE = /^[A-Za-z0-9_-]{4,40}$/;

export type LiveSummary = {
  session: string;
  total: number;
  steps: { step: number; label: string; reached: number; stuckHere: number }[];
  /** The step where the most people are currently stopped (their furthest step), or null if nobody has started. */
  stuckAt: number | null;
  mine: number[];
};

/** Turns raw checkpoint rows into counts. No names leave the server: attendees are counted, never listed. */
export function summarise(session: string, rows: { attendee: string; step: number }[], attendee?: string): LiveSummary {
  const furthest = new Map<string, number>();
  const reached = new Map<number, Set<string>>();
  for (const r of rows) {
    furthest.set(r.attendee, Math.max(furthest.get(r.attendee) ?? 0, r.step));
    if (!reached.has(r.step)) reached.set(r.step, new Set());
    reached.get(r.step)!.add(r.attendee);
  }
  const last = LIVE_STEPS.length;
  const steps = LIVE_STEPS.map((s) => ({
    step: s.step,
    label: s.label,
    reached: reached.get(s.step)?.size ?? 0,
    // people whose furthest step is this one and who haven't finished
    stuckHere: s.step === last ? 0 : [...furthest.values()].filter((f) => f === s.step).length,
  }));
  const worst = steps.reduce((a, b) => (b.stuckHere > a.stuckHere ? b : a), steps[0]);
  return {
    session,
    total: furthest.size,
    steps,
    stuckAt: worst.stuckHere > 0 ? worst.step : null,
    mine: attendee ? rows.filter((r) => r.attendee === attendee).map((r) => r.step).sort() : [],
  };
}

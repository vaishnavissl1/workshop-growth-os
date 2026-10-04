import { WORKSHOP_CONFIG as cfg } from "@/config";
import { db } from "@/lib/supabase";
import RegisterForm, { Subhead } from "@/components/RegisterForm";

async function seatsLeft() {
  const supabase = db();
  if (!supabase) return cfg.seatCap;
  const { data } = await supabase.rpc("seats_left");
  return typeof data === "number" ? data : cfg.seatCap;
}

const FAQ = [
  ["Do I need to know coding?", "No. You follow along step by step, and every step is shown live."],
  ["What do I need?", "A laptop, internet and a free Google account."],
  ["Is it really free?", "Yes. No payment at any point."],
  ["Can't make it live?", "Register anyway. You'll get the recording and the step-by-step guide."],
];

export default async function Landing({
  refCode,
  inviter,
}: {
  refCode?: string;
  inviter?: { firstName: string; college: string; project?: string | null };
}) {
  const left = await seatsLeft();
  const closes = new Date(cfg.registrationCloses).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="container-page py-8">
      {inviter && (
        <div className="mx-auto mb-5 max-w-md rounded-xl bg-[#EEF2FF] p-3 text-center text-sm font-medium">
          {inviter.firstName} from {inviter.college} invited you
          {inviter.project ? <> · building: <strong>{inviter.project}</strong></> : null}
        </div>
      )}

      <div className="mb-5 flex flex-wrap justify-center gap-2">
        <span className="badge badge-amber">FREE</span>
        <span className="badge badge-primary">60 MIN</span>
        <span className="badge badge-success">2027 BATCH</span>
      </div>

      <h1 className="mb-3 text-center text-[32px] font-extrabold leading-tight sm:text-4xl">{cfg.title}</h1>
      <p className="mx-auto mb-6 max-w-md text-center text-lg text-[var(--color-muted)]">
        <Subhead />
      </p>

      {/* Outcome visual: what students leave with */}
      <div className="mx-auto mb-6 w-64 rounded-[28px] border-4 border-[var(--color-ink)] bg-white p-3 shadow-lg">
        <div className="mb-2 rounded-md bg-[#F1F5F9] px-2 py-1 text-center text-[11px] text-[var(--color-muted)]">
          huggingface.co/spaces/<strong>yourname</strong>/my-ai-app
        </div>
        <div className="space-y-2 rounded-lg bg-[#EEF2FF] p-3 text-xs">
          <p className="font-bold text-[var(--color-primary)]">Your AI app is live ✓</p>
          <p className="rounded bg-white p-2">Ask me anything about your branch…</p>
          <p className="rounded bg-[var(--color-primary)] p-2 text-white">Here&apos;s a clear, step-by-step answer.</p>
        </div>
      </div>

      <p className="mb-6 text-center text-sm font-semibold">
        <span className="text-[var(--color-success)]">{left}</span> of {cfg.seatCap} seats left in Session 1 · Registration closes {closes}
      </p>

      <div className="card mx-auto mb-10 max-w-md">
        <RegisterForm refCode={refCode} />
      </div>

      <div className="card mx-auto mb-8 max-w-md">
        <h2 className="mb-4 text-lg font-bold">60-Minute Agenda</h2>
        <ol className="space-y-3">
          {cfg.agenda.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <span className="text-xs font-semibold text-[var(--color-primary)]">{item.timeRange}</span>
                <p className="text-sm">{item.task}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="card mx-auto mb-8 max-w-md">
        <h2 className="mb-3 text-lg font-bold">FAQ</h2>
        <dl className="space-y-3 text-sm">
          {FAQ.map(([q, a]) => (
            <div key={q}>
              <dt className="font-semibold">{q}</dt>
              <dd className="text-[var(--color-muted)]">{a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-center text-sm">
        <a href="/leaderboard">See the leaderboard →</a>
      </p>
    </div>
  );
}

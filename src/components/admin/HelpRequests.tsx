import { db } from "@/lib/supabase";

/** Latest questions from the help centre, for whoever is on the dashboard. */
export default async function HelpRequests() {
  const { data } = (await db()?.from("help_requests").select("id, created_at, name, email, topic, message").order("created_at", { ascending: false }).limit(20)) ?? { data: null };
  const rows = data ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10">
      <section className="card space-y-3">
        <h2 className="text-base font-bold">Help centre questions</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">No questions yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {rows.map((r) => (
              <li key={r.id} className="py-3 text-sm">
                <p className="font-semibold">
                  {r.name} <span className="font-normal text-[var(--color-muted)]">· {r.email} · {r.topic} · {new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}</span>
                </p>
                <p className="mt-1 whitespace-pre-wrap text-slate-700">{r.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import HostBoard from "@/components/live/HostBoard";
import PageGlow from "@/components/PageGlow";
import { currentRole } from "@/lib/auth";
import { SESSION_RE, summarise } from "@/lib/live";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Host board", robots: { index: false } };

/** Host view for workshop day. Same sign-in as the admin dashboard (admin or reviewer). */
export default async function HostPage({ params }: { params: Promise<{ session: string }> }) {
  const { session } = await params;
  if (!SESSION_RE.test(session)) notFound();
  if (!(await currentRole())) return <AdminLogin />;

  const { data } = (await db()?.from("checkpoints").select("attendee, step").eq("session", session).limit(10000)) ?? { data: null };
  const rows = (data ?? []) as { attendee: string; step: number }[];
  const simulated = rows.length > 0 && rows.every((r) => r.attendee.startsWith("sim-"));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <PageGlow tone="blue" />
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Workshop day · host board</p>
          <h1 className="text-3xl font-bold">Where is the room?</h1>
          <p className="text-sm text-slate-500">Session “{session}”</p>
        </div>
        <Link href="/admin" className="btn-secondary btn-sm">← Dashboard</Link>
      </header>
      <HostBoard session={session} initial={summarise(session, rows)} simulated={simulated} />
    </div>
  );
}

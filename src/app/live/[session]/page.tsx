import { notFound } from "next/navigation";
import AuthGate from "@/components/auth/AuthGate";
import LiveChecklist from "@/components/live/LiveChecklist";
import PageGlow from "@/components/PageGlow";
import PageHero from "@/components/PageHero";
import { SESSION_RE } from "@/lib/live";

export const metadata = { title: "Live workshop", robots: { index: false } };

/** Attendee view for workshop day: tick off each checkpoint as you finish it. */
export default async function LivePage({ params }: { params: Promise<{ session: string }> }) {
  const { session } = await params;
  if (!SESSION_RE.test(session)) notFound();

  return (
    <AuthGate>
      <>
        <PageGlow tone="green" />
        <PageHero
          eyebrow="Workshop day"
          title={<>Build along, <span className="gradient-text">step by step</span></>}
          lead="Tick each step as you finish it. If you get stuck, the host can see where and will slow down there."
        />
        <div className="container-mid max-w-2xl pb-10">
          <LiveChecklist session={session} />
        </div>
      </>
    </AuthGate>
  );
}

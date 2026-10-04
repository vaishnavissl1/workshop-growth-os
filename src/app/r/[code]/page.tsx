import type { Metadata } from "next";
import RegisterView from "@/components/RegisterView";
import { getInviter } from "@/lib/inviter";
import { WORKSHOP_CONFIG as cfg } from "@/config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const inviter = await getInviter(code.toUpperCase());
  if (!inviter) return {};
  const title = `${inviter.firstName} invited you: ${cfg.title}`;
  return { title, openGraph: { title, description: cfg.ogDescription } };
}

/** Referral invite: renders the register view directly so the personalised link preview survives. */
export default async function ReferralPage({ params }: Props) {
  const code = (await params).code.toUpperCase();
  const inviter = await getInviter(code);
  return <RegisterView refCode={inviter ? code : undefined} inviter={inviter ?? undefined} />;
}

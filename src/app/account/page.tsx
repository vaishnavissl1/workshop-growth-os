import PageGlow from "@/components/PageGlow";
import AccountSettings from "@/components/auth/AccountSettings";

export const metadata = { title: "Account settings", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageGlow tone="violet" />
      <AccountSettings />
    </>
  );
}

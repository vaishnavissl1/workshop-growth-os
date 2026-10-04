import PageGlow from "@/components/PageGlow";
import ResetForm from "@/components/auth/ResetForm";

export const metadata = { title: "Reset password", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageGlow tone="blue" />
      <ResetForm />
    </>
  );
}

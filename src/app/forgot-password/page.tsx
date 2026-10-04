import PageGlow from "@/components/PageGlow";
import ForgotForm from "@/components/auth/ForgotForm";

export const metadata = { title: "Forgot password", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageGlow tone="amber" />
      <ForgotForm />
    </>
  );
}

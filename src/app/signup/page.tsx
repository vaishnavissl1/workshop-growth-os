import PageGlow from "@/components/PageGlow";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = { title: "Sign up", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageGlow tone="pink" />
      <SignupForm />
    </>
  );
}

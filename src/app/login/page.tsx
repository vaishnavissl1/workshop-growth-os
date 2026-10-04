import PageGlow from "@/components/PageGlow";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Log in", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageGlow tone="violet" />
      <LoginForm />
    </>
  );
}

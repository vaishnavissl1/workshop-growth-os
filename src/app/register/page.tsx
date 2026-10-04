import AuthGate from "@/components/auth/AuthGate";
import RegisterView from "@/components/RegisterView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <AuthGate>
      <RegisterView />
    </AuthGate>
  );
}

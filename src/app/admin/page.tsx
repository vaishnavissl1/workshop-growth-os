import AdminLogin from "@/components/admin/AdminLogin";
import Dashboard from "@/components/admin/Dashboard";
import HelpRequests from "@/components/admin/HelpRequests";
import { currentRole } from "@/lib/auth";
import { adminData, type Mode } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const role = await currentRole();
  if (!role) return <AdminLogin />;

  const { mode } = await searchParams;
  const requested = mode === "real" || mode === "sim" || mode === "all" ? (mode as Mode) : undefined;
  const data = await adminData(requested);
  return (
    <>
      <Dashboard data={data} role={role} />
      <HelpRequests />
    </>
  );
}

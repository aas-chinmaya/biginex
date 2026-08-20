import "../globals.css";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthInitializer from "@/components/auth/AuthInitializer";
import DashboardShell from "@/components/layout/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthInitializer>
      <ProtectedRoute>
        <DashboardShell>{children}</DashboardShell>
      </ProtectedRoute>
    </AuthInitializer>
  );
}
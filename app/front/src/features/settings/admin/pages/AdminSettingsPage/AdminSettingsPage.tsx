import { Navigate } from "@tanstack/react-router";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCurrentUser } from "@/features/auth";
import { AdminAccountSection } from "../../components/AdminAccountSection";
import { OperationalCalibrationSection } from "../../components/OperationalCalibrationSection";

export const AdminSettingsPage = () => {
  const { user, isAuthenticated } = useCurrentUser();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/perfil" />;
  }

  return (
    <PageLayout
      title="Configurações Gerais"
      description="Gerencie a conta de administrador e a calibração operacional do sistema."
    >
      <div className="space-y-8">
        <AdminAccountSection />
        <OperationalCalibrationSection />
      </div>
    </PageLayout>
  );
};

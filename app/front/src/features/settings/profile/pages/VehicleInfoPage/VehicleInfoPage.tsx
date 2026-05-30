import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCurrentUser } from "@/features/auth";
import { useGetRawVehicles } from "@/features/users/hooks/useGetRawVehicles";
import { findVehicleForUser } from "@/features/users/lib/join-users-with-vehicles";

export const VehicleInfoPage = () => {
  const { user } = useCurrentUser();
  const { data: vehicles = [], isLoading } = useGetRawVehicles();

  const vehicle = user ? findVehicleForUser(user.id, vehicles) : undefined;

  return (
    <PageLayout
      title="Informações do Veículo"
      description="Detalhes do veículo vinculado à sua conta."
    >
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Veículo Vinculado</CardTitle>
          <CardDescription>
            Dados cadastrados na frota associados ao seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : vehicle ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">TAG ID</dt>
                <dd className="font-medium">{vehicle.id_tag}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Placa</dt>
                <dd className="font-medium">{vehicle.license_plate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Modelo</dt>
                <dd className="font-medium">{vehicle.model}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Combustível</dt>
                <dd className="font-medium">{vehicle.fuel_type}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-muted-foreground">
              Nenhum veículo vinculado ao seu perfil.
            </p>
          )}
          <Button asChild variant="outline" className="mt-6">
            <Link to="/perfil">Voltar ao perfil</Link>
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/form/ControlledInput";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { FormActions } from "@/components/form/FormActions";
import { PageLayout } from "@/components/layout/PageLayout";
import { joinUsersWithVehicles } from "@/features/users/lib/join-users-with-vehicles";
import { useGetRawVehicles } from "@/features/users/hooks/useGetRawVehicles";
import { useGetUser } from "@/features/users/hooks/useGetUser";
import { useUpdateUser } from "@/features/users/hooks/useUpdateUser";
import {
  driverFormSchema,
  type DriverFormData,
} from "@/features/users/schemas/user-schema";

export const EditDriverPage = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/motoristas/editar/$id" });
  const driverId = Number(id);
  const isValidId = Number.isFinite(driverId);

  const { data: user, isLoading, isError } = useGetUser(driverId, isValidId);
  const { data: vehicles = [] } = useGetRawVehicles();
  const { mutate, isPending } = useUpdateUser();

  const driverWithVehicle = useMemo(() => {
    if (!user) return undefined;
    return joinUsersWithVehicles([user], vehicles)[0];
  }, [user, vehicles]);

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((vehicle) => ({
        value: String(vehicle.id),
        label: `${vehicle.license_plate} (TAG ${vehicle.id_tag})`,
      })),
    [vehicles],
  );

  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverFormSchema as any),
    defaultValues: {
      name: "",
      email: "",
      vehicleId: "__none__",
    },
  });

  useEffect(() => {
    if (!driverWithVehicle) return;
    form.reset({
      name: driverWithVehicle.name,
      email: driverWithVehicle.email,
      vehicleId: driverWithVehicle.vehicleId
        ? String(driverWithVehicle.vehicleId)
        : "__none__",
    });
  }, [driverWithVehicle, form]);

  const onSubmit = (formData: DriverFormData) => {
    mutate(
      {
        id: driverId,
        data: {
          name: formData.name,
          email: formData.email,
        },
      },
      {
        onSuccess: () => {
          if (formData.vehicleId && formData.vehicleId !== "__none__") {
            toast.info(
              "Vínculo de veículo será persistido quando a API estiver disponível.",
            );
          }
          navigate({ to: "/motoristas" });
        },
      },
    );
  };

  if (!isValidId) {
    return (
      <PageLayout title="Editar Motorista">
        <p className="text-destructive" role="alert">
          Identificador de motorista inválido.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/motoristas">Voltar para motoristas</Link>
        </Button>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout
        title="Editar Motorista"
        description="Atualize os dados do motorista."
      >
        <p className="text-muted-foreground">Carregando...</p>
      </PageLayout>
    );
  }

  if (isError || !user || user.role !== "motorista") {
    return (
      <PageLayout title="Editar Motorista">
        <p className="text-destructive" role="alert">
          Motorista não encontrado.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/motoristas">Voltar para motoristas</Link>
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Editar motorista"
      description="Atualize os dados do motorista e o veículo vinculado."
    >
      <section className="max-w-xl rounded border border-neutral-300 bg-white p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput
            control={form.control}
            name="name"
            label="Nome"
            placeholder="Nome completo"
          />
          <ControlledInput
            control={form.control}
            name="email"
            label="E-mail"
            placeholder="email@exemplo.com"
          />
          <ControlledSelect
            control={form.control}
            name="vehicleId"
            label="Veículo vinculado"
            placeholder="Selecione um veículo"
            options={[
              { value: "__none__", label: "Sem veículo" },
              ...vehicleOptions,
            ]}
          />
          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/motoristas" })}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando…" : "Salvar"}
            </Button>
          </FormActions>
        </form>
      </section>
    </PageLayout>
  );
};

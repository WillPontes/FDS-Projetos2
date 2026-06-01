import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { getToastErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/form/ControlledInput";
import { FormActions } from "@/components/form/FormActions";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  OrganizationsRelationSelect,
  VehiclesRelationSelect,
} from "@/components/form/relation-selects";
import { joinUsersWithVehicles } from "@/features/users/lib/join-users-with-vehicles";
import { useGetRawVehicles } from "@/features/users/hooks/useGetRawVehicles";
import { useGetUser } from "@/features/users/hooks/useGetUser";
import { useUpdateUser } from "@/features/users/hooks/useUpdateUser";
import { updateUserVehicles } from "@/features/users/api/requests";
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
  const { mutate, isPending } = useUpdateUser({ silent: true });

  const driverWithVehicle = useMemo(() => {
    if (!user) return undefined;
    return joinUsersWithVehicles([user], vehicles)[0];
  }, [user, vehicles]);

  const assignedVehicleIds = useMemo(
    () => vehicles.filter((v) => v.assigned_driver_id === driverId).map((v) => v.id),
    [vehicles, driverId],
  );

  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverFormSchema as any),
    defaultValues: {
      name: "",
      email: "",
      vehicle_id: null,
      vehicle_ids: [],
      organization_id: null,
    },
  });

  const organizationId = form.watch("organization_id");
  const isIndividualDriver = organizationId == null;

  useEffect(() => {
    if (!driverWithVehicle) return;
    form.reset({
      name: driverWithVehicle.name,
      email: driverWithVehicle.email,
      vehicle_id: driverWithVehicle.vehicleId ?? null,
      vehicle_ids: assignedVehicleIds,
      organization_id: driverWithVehicle.organization_id ?? null,
    });
  }, [driverWithVehicle, assignedVehicleIds, form]);

  const onSubmit = (formData: DriverFormData) => {
    mutate(
      {
        id: driverId,
        data: {
          name: formData.name,
          email: formData.email,
          organization_id: formData.organization_id ?? undefined,
        },
      },
      {
        onSuccess: async () => {
          try {
            if (isIndividualDriver) {
              await updateUserVehicles(driverId, formData.vehicle_ids ?? []);
            } else {
              await updateUserVehicles(
                driverId,
                formData.vehicle_id != null ? [formData.vehicle_id] : [],
              );
            }
            toast.success("Motorista atualizado.");
            navigate({ to: "/motoristas" });
          } catch (error) {
            toast.error(
              getToastErrorMessage(error, {
                fallback: "Erro ao atualizar veículos vinculados.",
              }),
            );
          }
        },
        onError: (error) =>
          toast.error(
            getToastErrorMessage(error, { fallback: "Erro ao atualizar motorista." }),
          ),
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
      title="Editar Motorista"
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
          {isIndividualDriver ? (
            <div className="space-y-1">
              <Label>Veículos Vinculados</Label>
              <Controller
                control={form.control}
                name="vehicle_ids"
                render={({ field }) => (
                  <VehiclesRelationSelect
                    mode="multiple"
                    value={field.value ?? []}
                    onValueChange={(value) =>
                      field.onChange(Array.isArray(value) ? value : [])
                    }
                    placeholder="Selecione os veículos"
                    allowEmpty
                  />
                )}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <Label>Veículo Vinculado</Label>
              <Controller
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <VehiclesRelationSelect
                    value={field.value ?? undefined}
                    onValueChange={(value) =>
                      field.onChange(typeof value === "number" ? value : null)
                    }
                    organizationId={organizationId ?? undefined}
                    placeholder="Selecione um veículo"
                    emptyLabel="Sem veículo"
                  />
                )}
              />
            </div>
          )}
          <div className="space-y-1">
            <Label>Organização</Label>
            <Controller
              control={form.control}
              name="organization_id"
              render={({ field }) => (
                <OrganizationsRelationSelect
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v ?? null)}
                  placeholder="Sem organização"
                />
              )}
            />
          </div>
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

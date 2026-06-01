import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getToastErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ControlledInput } from "@/components/form/ControlledInput";
import {
  OrganizationsRelationSelect,
  VehiclesRelationSelect,
} from "@/components/form/relation-selects";
import { useGetRawVehicles } from "@/features/users/hooks/useGetRawVehicles";
import { useUpdateUser } from "@/features/users/hooks/useUpdateUser";
import { updateUserVehicles } from "@/features/users/api/requests";
import { joinUsersWithVehicles } from "@/features/users/lib/join-users-with-vehicles";
import { driverFormSchema, type DriverFormData } from "@/features/users/schemas/user-schema";
import type { User } from "@/features/users/api/types";

type DriverFormDialogProps = {
  open: boolean;
  onClose: () => void;
  driver: User;
};

export const DriverFormDialog = ({ open, onClose, driver }: DriverFormDialogProps) => {
  const { data: vehicles = [] } = useGetRawVehicles();
  const { mutate, isPending } = useUpdateUser({ silent: true });
  const [savingVehicles, setSavingVehicles] = useState(false);

  const driverWithVehicle = useMemo(
    () => joinUsersWithVehicles([driver], vehicles)[0],
    [driver, vehicles],
  );

  const assignedVehicleIds = useMemo(
    () => vehicles.filter((v) => v.assigned_driver_id === driver.id).map((v) => v.id),
    [vehicles, driver.id],
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
    if (!open || !driverWithVehicle) return;
    form.reset({
      name: driverWithVehicle.name,
      email: driverWithVehicle.email,
      vehicle_id: driverWithVehicle.vehicleId ?? null,
      vehicle_ids: assignedVehicleIds,
      organization_id: driverWithVehicle.organization_id ?? null,
    });
  }, [open, driverWithVehicle, assignedVehicleIds, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    mutate(
      {
        id: driver.id,
        data: {
          name: data.name,
          email: data.email,
          organization_id: data.organization_id ?? undefined,
        },
      },
      {
        onSuccess: async () => {
          try {
            setSavingVehicles(true);
            if (isIndividualDriver) {
              await updateUserVehicles(driver.id, data.vehicle_ids ?? []);
            } else {
              await updateUserVehicles(
                driver.id,
                data.vehicle_id != null ? [data.vehicle_id] : [],
              );
            }
            toast.success("Motorista atualizado.");
            onClose();
          } catch (vehicleError) {
            toast.error(
              getToastErrorMessage(vehicleError, {
                fallback: "Erro ao atualizar veículos vinculados.",
              }),
            );
          } finally {
            setSavingVehicles(false);
          }
        },
        onError: (error) =>
          toast.error(
            getToastErrorMessage(error, { fallback: "Erro ao atualizar motorista." }),
          ),
      },
    );
  });

  const pending = isPending || savingVehicles;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Motorista</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <ControlledInput control={form.control} name="name" label="Nome" placeholder="Nome completo" />
          <ControlledInput control={form.control} name="email" label="E-mail" placeholder="email@exemplo.com" />
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
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

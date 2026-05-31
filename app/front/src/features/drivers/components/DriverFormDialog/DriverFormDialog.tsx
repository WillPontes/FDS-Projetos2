import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ControlledInput } from "@/components/form/ControlledInput";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { OrganizationsCombobox } from "@/features/fleet/components/OrganizationsCombobox/OrganizationsCombobox";
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
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([]);
  const [savingVehicles, setSavingVehicles] = useState(false);

  const driverWithVehicle = useMemo(
    () => joinUsersWithVehicles([driver], vehicles)[0],
    [driver, vehicles],
  );

  const assignedVehicleIds = useMemo(
    () => vehicles.filter((v) => v.assigned_driver_id === driver.id).map((v) => v.id),
    [vehicles, driver.id],
  );

  const vehicleOptions = useMemo(
    () =>
      vehicles.map((v) => ({
        value: String(v.id),
        label: `${v.license_plate} (TAG ${v.id_tag})`,
      })),
    [vehicles],
  );

  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverFormSchema as any),
    defaultValues: {
      name: "",
      email: "",
      vehicleId: "__none__",
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
      vehicleId: driverWithVehicle.vehicleId ? String(driverWithVehicle.vehicleId) : "__none__",
      organization_id: driverWithVehicle.organization_id ?? null,
    });
    setSelectedVehicleIds(assignedVehicleIds);
  }, [open, driverWithVehicle, assignedVehicleIds, form]);

  const toggleVehicle = (vehicleId: number, checked: boolean) => {
    setSelectedVehicleIds((prev) =>
      checked ? [...prev, vehicleId] : prev.filter((id) => id !== vehicleId),
    );
  };

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
              await updateUserVehicles(driver.id, selectedVehicleIds);
            } else {
              const vehicleId =
                data.vehicleId && data.vehicleId !== "__none__"
                  ? Number(data.vehicleId)
                  : null;
              await updateUserVehicles(driver.id, vehicleId ? [vehicleId] : []);
            }
            toast.success("Motorista atualizado.");
            onClose();
          } catch {
            toast.error("Erro ao atualizar veículos vinculados.");
          } finally {
            setSavingVehicles(false);
          }
        },
        onError: () => toast.error("Erro ao atualizar motorista."),
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
            <div className="space-y-2">
              <Label>Veículos Vinculados</Label>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded border border-neutral-200 p-3">
                {vehicles.map((v) => (
                  <label key={v.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedVehicleIds.includes(v.id)}
                      onChange={(e) => toggleVehicle(v.id, e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                    <span>{v.license_plate} (TAG {v.id_tag})</span>
                  </label>
                ))}
                {vehicles.length === 0 && (
                  <p className="text-sm text-neutral-500">Nenhum veículo disponível.</p>
                )}
              </div>
            </div>
          ) : (
            <ControlledSelect
              control={form.control}
              name="vehicleId"
              label="Veículo Vinculado"
              placeholder="Selecione um veículo"
              options={[{ value: "__none__", label: "Sem veículo" }, ...vehicleOptions]}
            />
          )}
          <div className="space-y-1">
            <Label>Organização</Label>
            <Controller
              control={form.control}
              name="organization_id"
              render={({ field }) => (
                <OrganizationsCombobox
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

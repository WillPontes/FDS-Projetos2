import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ControlledInput } from "@/components/form/ControlledInput";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { FleetsCombobox } from "../FleetsCombobox/FleetsCombobox";
import { VEHICLE_FUEL_OPTIONS } from "../../constants";
import { useCreateVehicle } from "../../hooks/useCreateVehicle";
import { useUpdateVehicle } from "../../hooks/useUpdateVehicle";
import {
  vehicleUpdateSchema,
  type VehicleUpdateData,
  type Vehicle,
} from "../../schemas/vehicle-schema";

const VALID_FUEL = ["diesel_s10", "gasolina_c", "etanol"] as const;

type VehicleFormDialogProps = {
  open: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
  defaultFleetId?: number | null;
  defaultOrganizationId?: number | null;
};

export const VehicleFormDialog = ({
  open,
  onClose,
  vehicle,
  defaultFleetId,
  defaultOrganizationId,
}: VehicleFormDialogProps) => {
  const isEdit = !!vehicle;
  const { mutate: createVehicle, isPending: isCreating } = useCreateVehicle();
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();
  const isPending = isCreating || isUpdating;

  const form = useForm<VehicleUpdateData>({
    resolver: zodResolver(vehicleUpdateSchema as any),
    defaultValues: {
      id_tag: "",
      license_plate: "",
      model: "",
      fuel_type: "gasolina_c",
      fleet_id: defaultFleetId ?? null,
      organization_id: defaultOrganizationId ?? null,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (vehicle) {
      form.reset({
        id_tag: vehicle.id_tag,
        license_plate: vehicle.license_plate,
        model: vehicle.model,
        fuel_type: VALID_FUEL.includes(
          vehicle.fuel_type as (typeof VALID_FUEL)[number],
        )
          ? (vehicle.fuel_type as (typeof VALID_FUEL)[number])
          : "gasolina_c",
        fleet_id: vehicle.fleet_id ?? null,
        organization_id: vehicle.organization_id ?? null,
      });
    } else {
      form.reset({
        id_tag: "",
        license_plate: "",
        model: "",
        fuel_type: "gasolina_c",
        fleet_id: defaultFleetId ?? null,
        organization_id: defaultOrganizationId ?? null,
      });
    }
  }, [open, vehicle, defaultFleetId, defaultOrganizationId, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (isEdit) {
      updateVehicle(
        { id: vehicle!.id, data },
        {
          onSuccess: () => {
            toast.success("Veículo atualizado.");
            onClose();
          },
          onError: () => toast.error("Erro ao atualizar veículo."),
        },
      );
    } else {
      if (
        !data.id_tag ||
        !data.license_plate ||
        !data.model ||
        !data.fuel_type
      ) {
        toast.error("Preencha todos os campos obrigatórios.");
        return;
      }
      createVehicle(
        data as VehicleUpdateData & {
          id_tag: string;
          license_plate: string;
          model: string;
          fuel_type: string;
        },
        {
          onSuccess: () => {
            toast.success("Veículo cadastrado.");
            onClose();
          },
          onError: () => toast.error("Erro ao cadastrar veículo."),
        },
      );
    }
  });

  const orgIdForFleet =
    form.watch("organization_id") ?? defaultOrganizationId ?? undefined;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Veículo" : "Cadastrar Veículo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <ControlledInput
            control={form.control}
            name="id_tag"
            label="TAG ID"
            placeholder="TAG-001-ABC"
          />
          <ControlledInput
            control={form.control}
            name="license_plate"
            label="Placa"
            placeholder="AAA-0000"
          />
          <ControlledInput
            control={form.control}
            name="model"
            label="Modelo"
            placeholder="Toyota Hilux"
          />
          <ControlledSelect
            control={form.control}
            name="fuel_type"
            label="Tipo de combustível"
            options={VEHICLE_FUEL_OPTIONS}
          />
          <div className="space-y-1">
            <Label>Frota</Label>
            <Controller
              control={form.control}
              name="fleet_id"
              render={({ field }) => (
                <FleetsCombobox
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v ?? null)}
                  organizationId={orgIdForFleet ?? undefined}
                  noneLabel="Sem frota"
                />
              )}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

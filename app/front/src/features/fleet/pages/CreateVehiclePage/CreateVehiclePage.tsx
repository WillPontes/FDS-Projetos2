import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/form/ControlledInput";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { FormActions } from "@/components/form/FormActions";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  vehicleCreateSchema,
  type VehicleFormData,
} from "../../schemas/vehicle-schema";
import { useCreateVehicle } from "../../hooks/useCreateVehicle";
import { VEHICLE_FUEL_OPTIONS } from "../../constants";

export const CreateVehiclePage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateVehicle();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleCreateSchema),
    defaultValues: {
      id_tag: "",
      license_plate: "",
      model: "",
      fuel_type: "gasolina_c",
    },
  });

  const onSubmit = (data: VehicleFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Veículo cadastrado com sucesso!");
        navigate({ to: "/frota" });
      },
    });
  };

  return (
    <PageLayout
      title="Cadastrar Veículo"
      description="Preencha os dados do veículo para incluí-lo no cadastro da frota."
    >
      <section className="max-w-xl space-y-4 rounded border border-neutral-300 bg-white p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/frota" })}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
            >
              {isPending ? "Salvando…" : "Salvar"}
            </Button>
          </FormActions>
        </form>
      </section>
    </PageLayout>
  );
};

import { useForm, type Resolver } from "react-hook-form";
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
import { STATUS_OPTIONS, VEHICLE_FUEL_OPTIONS } from "../../constants";

export const CreateVehiclePage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateVehicle();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleCreateSchema) as Resolver<VehicleFormData>,
    defaultValues: {
      plate: "",
      model: "",
      year: new Date().getFullYear(),
      status: "active",
      fuelType: "",
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
            name="plate"
            label="Placa"
            placeholder="AAA0A00"
          />
          <ControlledInput
            control={form.control}
            name="model"
            label="Modelo"
            placeholder="Toyota Hilux"
          />
          <ControlledInput
            control={form.control}
            name="year"
            label="Ano"
            type="number"
            placeholder={String(new Date().getFullYear())}
          />
          <ControlledSelect
            control={form.control}
            name="fuelType"
            label="Tipo de combustível"
            options={VEHICLE_FUEL_OPTIONS}
          />
          <ControlledSelect
            control={form.control}
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
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

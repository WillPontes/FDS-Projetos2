import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
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
import { useGetVehicle } from "../../hooks/useGetVehicle";
import { useUpdateVehicle } from "../../hooks/useUpdateVehicle";
import { STATUS_OPTIONS, VEHICLE_FUEL_OPTIONS } from "../../constants";

export const EditVehiclePage = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/frota/editar/$id" });
  const vehicleId = Number(id);
  const isValidId = Number.isFinite(vehicleId);

  const { data, isLoading, isError } = useGetVehicle(vehicleId);
  const { mutate, isPending } = useUpdateVehicle();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleCreateSchema as any),
    defaultValues: {
      plate: "",
      model: "",
      year: new Date().getFullYear(),
      status: "active",
      fuelType: "",
    },
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      plate: data.plate,
      model: data.model,
      year: data.year,
      status: data.status,
      fuelType: data.fuelType,
    });
  }, [data, form]);

  const onSubmit = (formData: VehicleFormData) => {
    mutate(
      { id: vehicleId, data: formData },
      {
        onSuccess: () => {
          toast.success("Veículo atualizado com sucesso!");
          navigate({ to: "/frota" });
        },
      },
    );
  };

  if (!isValidId) {
    return (
      <PageLayout title="Editar Veículo">
        <p className="text-destructive" role="alert">
          Identificador de veículo inválido.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/frota">Voltar para frota</Link>
        </Button>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout
        title="Editar Veículo"
        description="Atualize os dados do veículo cadastrado na frota."
      >
        <p className="text-muted-foreground">Carregando veículo…</p>
      </PageLayout>
    );
  }

  if (isError || !data) {
    return (
      <PageLayout title="Editar Veículo">
        <p className="text-destructive" role="alert">
          Não foi possível carregar os dados do veículo.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/frota">Voltar para frota</Link>
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Editar Veículo"
      description="Atualize os dados do veículo cadastrado na frota."
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

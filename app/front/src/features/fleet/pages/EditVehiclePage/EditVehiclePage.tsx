import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ControlledInput } from "@/components/form/ControlledInput";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { FormActions } from "@/components/form/FormActions";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
import { OrganizationsCombobox } from "../../components/OrganizationsCombobox/OrganizationsCombobox";
import {
  vehicleUpdateSchema,
  type VehicleUpdateData,
} from "../../schemas/vehicle-schema";
import { useGetVehicle } from "../../hooks/useGetVehicle";
import { useUpdateVehicle } from "../../hooks/useUpdateVehicle";
import { VEHICLE_FUEL_OPTIONS } from "../../constants";

const VALID_FUEL_TYPES = VEHICLE_FUEL_OPTIONS.map((o) => o.value);

export const EditVehiclePage = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/frota/editar/$id" });
  const vehicleId = Number(id);
  const isValidId = Number.isFinite(vehicleId);

  const { data, isLoading, isError } = useGetVehicle(vehicleId);
  const { mutate, isPending } = useUpdateVehicle();

  const form = useForm<VehicleUpdateData>({
    resolver: zodResolver(vehicleUpdateSchema),
    defaultValues: {
      id_tag: "",
      license_plate: "",
      model: "",
      fuel_type: "gasolina_c",
      organization_id: null,
    },
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      id_tag: data.id_tag,
      license_plate: data.license_plate,
      model: data.model,
      fuel_type: VALID_FUEL_TYPES.includes(data.fuel_type)
        ? (data.fuel_type as "diesel_s10" | "gasolina_c" | "etanol")
        : undefined,
      organization_id: data.organization_id ?? null,
    });
  }, [data, form]);

  const onSubmit = (formData: VehicleUpdateData) => {
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
              name="organization_id"
              render={({ field }) => (
                <OrganizationsCombobox
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v ?? null)}
                  placeholder="Sem frota"
                />
              )}
            />
          </div>
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

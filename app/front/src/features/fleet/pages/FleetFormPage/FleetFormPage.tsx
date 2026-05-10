import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ControlledInput } from "@/components/ControlledInput";
import { ControlledSelect } from "@/components/ControlledSelect";
import {
  vehicleCreateSchema,
  type VehicleFormData,
} from "../../schemas/vehicle-schema";
import { useCreateVehicle } from "../../hooks/useCreateVehicle";
import { FormActions } from "@/components/form/FormActions";
import { STATUS_OPTIONS } from "../../constants";

export const FleetFormPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateVehicle();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleCreateSchema) as Resolver<VehicleFormData>,
    defaultValues: {
      plate: "",
      model: "",
      year: new Date().getFullYear(),
      status: "active",
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
    <div className="mx-auto w-full max-w-xl px-1 sm:px-0">
      <Card className="shadow-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle>Novo Veículo</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando…" : "Salvar"}
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

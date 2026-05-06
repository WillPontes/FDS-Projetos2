import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ControlledInput } from "@/components/form/controlled-input"
import { ControlledSelect, type SelectOption } from "@/components/form/controlled-select"
import { vehicleCreateSchema, type VehicleFormData } from "../schemas/vehicle-schema"
import { useCreateVehicleMutation } from "../hooks/use-create-vehicle-mutation"

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Em Manutenção", value: "maintenance" },
]

export function FleetFormPage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateVehicleMutation()

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleCreateSchema) as Resolver<VehicleFormData>,
    defaultValues: {
      plate: "",
      model: "",
      year: new Date().getFullYear(),
      status: "active",
    },
  })

  function onSubmit(data: VehicleFormData) {
    mutate(data, {
      onSuccess: () => {
        toast.success("Veículo cadastrado com sucesso!")
        navigate({ to: "/fleet" })
      },
    })
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
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
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/fleet" })}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

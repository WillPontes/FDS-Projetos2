import { z } from "zod"

export const vehicleCreateSchema = z.object({
  plate: z.string().min(7, "Placa deve ter ao menos 7 caracteres"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Ano inválido")
    .max(new Date().getFullYear() + 1, "Ano inválido"),
  status: z.enum(["active", "inactive", "maintenance"]),
})

export const vehicleSchema = vehicleCreateSchema.extend({
  id: z.number(),
})

export type Vehicle = z.infer<typeof vehicleSchema>
export type VehicleFormData = z.infer<typeof vehicleCreateSchema>

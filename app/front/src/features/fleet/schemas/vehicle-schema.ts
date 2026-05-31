import { z } from "zod"

export const fuelTypeEnum = z.enum(["diesel_s10", "gasolina_c", "etanol"])

export const vehicleCreateSchema = z.object({
  id_tag: z.string().min(1, "TAG ID é obrigatório"),
  license_plate: z.string().min(7, "Placa deve ter ao menos 7 caracteres"),
  model: z.string().min(1, "Modelo é obrigatório"),
  fuel_type: fuelTypeEnum,
})

export const vehicleUpdateSchema = vehicleCreateSchema.partial()

export const vehicleSchema = z.object({
  id: z.number(),
  id_tag: z.string(),
  user_id: z.number(),
  organization_id: z.number().nullable(),
  assigned_driver_id: z.number().nullable(),
  license_plate: z.string(),
  plate: z.string(),
  model: z.string(),
  fuel_type: z.string(),
})

export type Vehicle = z.infer<typeof vehicleSchema>
export type VehicleFormData = z.infer<typeof vehicleCreateSchema>
export type VehicleUpdateData = z.infer<typeof vehicleUpdateSchema>

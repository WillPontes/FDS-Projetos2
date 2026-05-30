import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["motorista", "gestor_frota", "admin"]),
  organization_id: z.coerce.number().nullable().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const driverFormSchema = userFormSchema
  .pick({ name: true, email: true })
  .extend({
    vehicleId: z.string().optional(),
  });

export type DriverFormData = z.infer<typeof driverFormSchema>;

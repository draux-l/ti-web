import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Correo invalido").min(1, "El correo es requerido"),
  password: z.string().min(1, "La contrasena es requerida"),
  remember: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

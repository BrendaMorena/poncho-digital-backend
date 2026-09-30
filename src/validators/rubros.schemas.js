import { z } from "zod";

export const crearRubrosSchema = z.object({
  nombre: z.string().min(3).max(100),
  descripcion: z.string().max(255).optional()
})

export const actualizarRubrosSchema = z.object({
  nombre: z.string().min(3).max(100).optional(),
  descripcion: z.string().max(255).optional()
}).refine((datos) => Object.keys(datos).length > 0, {
  message: "Debe enviar por lo menos un dato válido para actualizar." 
});
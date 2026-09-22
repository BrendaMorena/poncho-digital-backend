import { z } from "zod";

// Molde para CREAR
export const crearArtesanoSchema = z.object({
  descripcion: z.string({
    required_error: "La descripción es obligatoria",
    invalid_type_error: "La descripción debe ser un texto"
  }).min(10, "La descripción debe tener al menos 10 caracteres"),
  
  usuarioId: z.number({
    required_error: "El ID del usuario es obligatorio",
    invalid_type_error: "El ID del usuario debe ser un número"
  }).int().positive("El ID debe ser positivo"),
  rubroId: z.number({
    required_error: "El ID del rubro es obligatorio",
  }).int().positive()
});
// Molde para ACTUALIZAR (Aquí todos son opcionales porque puedes actualizar solo una cosa)
export const actualizarArtesanoSchema = z.object({
  descripcion: z.string().min(10).optional(),
  rubroId: z.number().int().positive().optional(),
  nombre: z.string().min(2).optional(),
  apellido: z.string().min(2).optional(),
  localidadId: z.number().int().positive().optional()
});

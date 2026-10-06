import { z } from "zod";

export const crearRubroSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre del rubro es obligatorio",
      invalid_type_error: "El nombre debe ser un texto"
    })
    .trim()
    .min(3, "El nombre del rubro debe tener al menos 3 caracteres")
    .max(100, "El nombre del rubro no puede superar los 100 caracteres")
});

export const actualizarRubroSchema = z.object({
  nombre: z
    .string({
      invalid_type_error: "El nombre debe ser un texto"
    })
    .trim()
    .min(3, "El nombre del rubro debe tener al menos 3 caracteres")
    .max(100, "El nombre del rubro no puede superar los 100 caracteres")
    .optional()
}).refine((datos) => Object.keys(datos).length > 0, {
  message: "Debe enviar por lo menos un dato válido para actualizar." 
});
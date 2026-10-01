import { z } from "zod";

const pabellonBaseSchema = z.object({
  nombre_pabellon: z
    .string({ required_error: "El nombre del pabellón es obligatorio" })
    .trim()
    .min(1, "El nombre del pabellón no puede estar vacío"),

  descripcion_pabellon: z
    .string({ required_error: "La descripción del pabellón es obligatoria" })
    .trim()
    .min(1, "La descripción del pabellón no puede estar vacía"),
});

// Esquema para CREAR (POST)
export const pabellonSchema = pabellonBaseSchema;

// Esquema para ACTUALIZAR (PATCH)
export const actualizarPabellonSchema = pabellonBaseSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debe enviar al menos un campo para actualizar",
    }
  );

// Esquema para FILTRAR / CONSULTAR (GET)
export const consultarPabellonesSchema = z.object({
  nombre_pabellon: z
    .string()
    .trim()
    .min(1, "El término de búsqueda no puede estar vacío")
    .optional(),

  ordenarPor: z
    .enum(["nombre_pabellon", "createdAt"])
    .default("nombre_pabellon"),

  direccion: z
    .enum(["asc", "desc"])
    .default("asc"),

  pagina: z
    .coerce.number()
    .int()
    .positive()
    .optional(),

  limite: z
    .coerce.number()
    .int()
    .min(1)
    .max(50)
    .optional(),
});

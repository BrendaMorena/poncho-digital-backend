import { z } from "zod";

const rolBaseSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre del rol es obligatorio" })
    .trim()
    .min(1, "El nombre del rol no puede estar vacío"),

  descripcion: z
    .string({ required_error: "La descripción del rol es obligatoria" })
    .trim()
    .min(1, "La descripción del rol no puede estar vacía"),
});

// Esquema para CREAR (POST)
export const rolSchema = rolBaseSchema;

// Esquema para ACTUALIZAR (PATCH)
export const actualizarRolSchema = rolBaseSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debe enviar al menos un campo para actualizar",
    }
  );

// Esquema para FILTRAR / CONSULTAR (GET)
export const consultarRolesSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El término de búsqueda no puede estar vacío")
    .optional(),

  ordenarPor: z
    .enum(["nombre", "createdAt"])
    .default("nombre"),

  direccion: z
    .enum(["asc", "desc"])
    .default("asc"),

  pagina: z
    .coerce.number({ message: "La página debe ser un número" })
    .int("La página debe ser un número entero")
    .positive("La página debe ser mayor a 0")
    .default(1),

  limite: z
    .coerce.number({ message: "El límite debe ser un número" })
    .int("El límite debe ser un número entero")
    .min(1, "El límite mínimo es 1")
    .max(50, "El límite máximo es 50")
    .default(10),
});

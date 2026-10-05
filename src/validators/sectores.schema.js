import { z } from "zod";

const sectorBaseSchema = z.object({
  codigo_sector: z
    .string({ required_error: "El código del sector es obligatorio" })
    .trim()
    .min(1, "El código del sector no puede estar vacío"),

  nombre_sector: z
    .string({ required_error: "El nombre del sector es obligatorio" })
    .trim()
    .min(1, "El nombre del sector no puede estar vacío"),

  pabellonId: z
    .number({ invalid_type_error: "El pabellonId debe ser un número" })
    .int("El pabellonId debe ser un número entero")
    .positive("El pabellonId debe ser positivo")
    .nullable()
    .optional(),
});

// Esquema para CREAR (POST)
export const sectorSchema = sectorBaseSchema;

// Esquema para ACTUALIZAR (PATCH)
export const actualizarSectorSchema = sectorBaseSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debe enviar al menos un campo para actualizar",
    }
  );

// Esquema para FILTRAR / CONSULTAR (GET)
export const consultarSectoresSchema = z.object({
  nombre_sector: z
    .string()
    .trim()
    .min(1, "El término de búsqueda no puede estar vacío")
    .optional(),

  codigo_sector: z
    .string()
    .trim()
    .min(1, "El código no puede estar vacío")
    .optional(),

  pabellonId: z.coerce
    .number({ message: "El pabellonId debe ser un número" })
    .int("El pabellonId debe ser un número entero")
    .positive("El pabellonId debe ser positivo")
    .optional(),

  ordenarPor: z
    .enum(["nombre_sector", "codigo_sector", "createdAt"])
    .default("nombre_sector"),

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
